/**
 * Edge Function: /gdrive-backup — Generate backup ZIP and upload to Google Drive
 *
 * Can be called two ways:
 * 1. By user (manual): JWT auth via Authorization header
 * 2. By pg_cron (automatic): service-role key + x-backup-cron header
 *
 * Flow:
 * - Query all accountant data (service role)
 * - Download receipt images from Supabase Storage
 * - Build ZIP with fflate
 * - Upload to Google Drive folder
 * - Log result
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { zipSync, strToU8 } from "https://esm.sh/fflate@0.8.2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import {
    getValidAccessToken,
    ensureDriveFolder,
    uploadFileToDrive,
    type DriveConnection,
} from "../_shared/gdriveAuth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CATEGORY_LABELS: Record<string, string> = {
    kantoorkosten: "Kantoorkosten",
    reiskosten: "Reiskosten",
    marketing: "Marketing",
    automatisering: "Automatisering",
    opleiding: "Opleiding",
    "telefoon-internet": "Telefoon & Internet",
    representatie: "Representatie",
    omzet: "Omzet",
    overig: "Overig",
};

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS");

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // -----------------------------------------------------------------------
    // Auth: determine caller and target user
    // -----------------------------------------------------------------------
    const isCron = req.headers.get("x-backup-cron") === "true";
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        return jsonResponse({ error: "Authenticatie vereist." }, 401, corsHeaders);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let targetUserIds: string[] = [];

    if (isCron) {
        // Cron mode: backup all users with active Drive connections
        const token = authHeader.replace("Bearer ", "");
        if (token !== SUPABASE_SERVICE_ROLE_KEY) {
            return jsonResponse({ error: "Ongeldige service key." }, 403, corsHeaders);
        }

        const { data: connections } = await supabaseAdmin
            .from("google_drive_connections")
            .select("user_id");

        if (!connections || connections.length === 0) {
            return jsonResponse({ message: "Geen actieve Drive-koppelingen." }, 200, corsHeaders);
        }
        targetUserIds = connections.map((c: { user_id: string }) => c.user_id);
    } else {
        // Manual mode: browser request with origin check
        const rejected = rejectDisallowedBrowserRequest(req, corsHeaders);
        if (rejected) return rejected;

        const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
        if (authError || !user) {
            return jsonResponse({ error: "Ongeldige sessie." }, 401, corsHeaders);
        }
        const role = user.app_metadata?.role;
        if (role !== "developer" && role !== "admin") {
            return jsonResponse({ error: "Geen toegang." }, 403, corsHeaders);
        }
        targetUserIds = [user.id];
    }

    // -----------------------------------------------------------------------
    // Process each user
    // -----------------------------------------------------------------------
    const results: Array<{ userId: string; status: string; fileId?: string; error?: string }> = [];

    for (const userId of targetUserIds) {
        try {
            const result = await backupUserToDrive(supabaseAdmin, userId);
            results.push({ userId, status: "success", fileId: result.fileId });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error(`[gdrive-backup] Failed for user ${userId}:`, errorMsg);

            // Update connection status
            await supabaseAdmin
                .from("google_drive_connections")
                .update({
                    last_backup_status: "failed",
                    last_backup_error: errorMsg.slice(0, 500),
                })
                .eq("user_id", userId);

            results.push({ userId, status: "failed", error: errorMsg });
        }
    }

    return jsonResponse({ results }, 200, corsHeaders);
});

// ---------------------------------------------------------------------------
// Core backup logic
// ---------------------------------------------------------------------------

interface BackupResult {
    fileId: string;
    fileName: string;
    fileSize: number;
}

async function backupUserToDrive(
    supabase: ReturnType<typeof createClient>,
    userId: string,
): Promise<BackupResult> {
    // 1. Get Drive connection
    const { data: connection, error: connError } = await supabase
        .from("google_drive_connections")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (connError || !connection) {
        throw new Error("Geen Drive-koppeling gevonden");
    }

    const conn = connection as DriveConnection & { root_folder_id: string };

    // 2. Get valid access token
    const { accessToken, refreshed, expiresAt } = await getValidAccessToken(conn);

    // Update cached token if refreshed
    if (refreshed) {
        await supabase
            .from("google_drive_connections")
            .update({
                access_token: accessToken,
                access_token_expires_at: expiresAt,
            })
            .eq("user_id", userId);
    }

    // 3. Query all accountant data
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

    const [
        { data: transactions },
        { data: receipts },
        { data: subscriptions },
        { data: hours },
        { data: invoices },
        { data: settings },
    ] = await Promise.all([
        supabase.from("accountant_transactions").select("*").eq("user_id", userId).in("year", years),
        supabase.from("accountant_receipts").select("*").eq("user_id", userId),
        supabase.from("accountant_subscriptions").select("*").eq("user_id", userId),
        supabase.from("accountant_hours").select("*").eq("user_id", userId),
        supabase.from("accountant_invoices").select("*").eq("user_id", userId),
        supabase.from("accountant_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    // 4. Download receipt images (with timeout protection)
    const receiptImages: Record<string, Uint8Array> = {};
    const receiptsWithImages = (receipts || []).filter((r: { image_url?: string }) => r.image_url);

    // Limit to prevent timeout: max 20 images per backup
    const imageSlice = receiptsWithImages.slice(0, 20);
    for (const receipt of imageSlice) {
        try {
            const storagePath = extractStoragePath(receipt.image_url);
            if (!storagePath) continue;

            const { data: fileData } = await supabase.storage
                .from("receipts")
                .download(storagePath);

            if (fileData) {
                const filename = storagePath.split("/").pop() || `bonnetje-${receipt.id}.jpg`;
                const arrayBuffer = await fileData.arrayBuffer();
                receiptImages[`bonnetjes/${filename}`] = new Uint8Array(arrayBuffer);
            }
        } catch {
            // Skip failed downloads — data is in JSON
        }
    }

    // 5. Build CSV
    const csvContent = transactiesToCSV(transactions || []);

    // 6. Build ZIP
    const backupData = {
        exportDate: new Date().toISOString(),
        exportYear: "alle",
        versie: "1.0",
        transacties: transactions || [],
        bonnetjes: receipts || [],
        abonnementen: subscriptions || [],
        uren: hours || [],
        facturen: invoices || [],
        instellingen: settings || null,
    };

    const zipFiles: Record<string, Uint8Array> = {
        "data/transacties.json": strToU8(JSON.stringify(backupData.transacties, null, 2)),
        "data/bonnetjes.json": strToU8(JSON.stringify(backupData.bonnetjes, null, 2)),
        "data/abonnementen.json": strToU8(JSON.stringify(backupData.abonnementen, null, 2)),
        "data/uren.json": strToU8(JSON.stringify(backupData.uren, null, 2)),
        "data/facturen.json": strToU8(JSON.stringify(backupData.facturen, null, 2)),
        "data/instellingen.json": strToU8(JSON.stringify(backupData.instellingen, null, 2)),
        "export/jaaroverzicht.csv": strToU8(csvContent),
        ...receiptImages,
    };

    const zipData = zipSync(zipFiles);

    // 7. Upload to Drive
    const yearFolder = await ensureDriveFolder(
        accessToken,
        String(currentYear),
        conn.root_folder_id,
    );

    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `boekhouding-backup-compleet-${dateStr}.zip`;

    const { fileId, fileSize } = await uploadFileToDrive(
        accessToken,
        yearFolder,
        fileName,
        zipData,
        "application/zip",
    );

    // 8. Update connection status + log
    await supabase
        .from("google_drive_connections")
        .update({
            last_backup_at: new Date().toISOString(),
            last_backup_status: "success",
            last_backup_error: null,
        })
        .eq("user_id", userId);

    await supabase
        .from("accountant_backup_log")
        .insert({
            user_id: userId,
            backup_type: "auto_gdrive",
            file_name: fileName,
            file_size_bytes: fileSize,
            drive_file_id: fileId,
        });

    return { fileId, fileName, fileSize };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractStoragePath(imageUrl: string): string | null {
    const marker = "/receipts/";
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return null;
    const path = imageUrl.substring(idx + marker.length);
    return path.split("?")[0];
}

function escapeCSV(value: string | number | undefined | null): string {
    if (value === undefined || value === null) return "";
    const str = String(value);
    if (str.includes(";") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function transactiesToCSV(
    transacties: Array<{
        date: string;
        amount: number;
        category: string;
        description: string;
        imported_from?: string;
        is_private?: boolean;
        km_distance?: number;
    }>,
): string {
    const header = "Datum;Bedrag;Categorie;Omschrijving;Bron;Privé;Km";
    const rows = transacties.map((tx) =>
        [
            escapeCSV(tx.date),
            escapeCSV(tx.amount.toFixed(2).replace(".", ",")),
            escapeCSV(CATEGORY_LABELS[tx.category] || tx.category),
            escapeCSV(tx.description),
            escapeCSV(tx.imported_from || "handmatig"),
            escapeCSV(tx.is_private ? "Ja" : "Nee"),
            escapeCSV(tx.km_distance ?? ""),
        ].join(";")
    );

    return [header, ...rows].join("\n");
}

function jsonResponse(
    body: unknown,
    status: number,
    corsHeaders: Record<string, string>,
): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}
