/**
 * STEP_COMPLETE Server-side Detector — EU AI Act Art. 12 + Art. 14
 *
 * Parseert ---STEP_COMPLETE:X--- markers uit AI responses en logt ze
 * server-side naar audit_logs. Dit is onafhankelijk van de client en
 * garandeert dat elke AI-beslissing over stapvoltooiing gelogd wordt.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STEP_COMPLETE_REGEX = /---STEP_COMPLETE:(\d+)---/g;

export interface StepCompleteEvent {
    stepNumber: number;
}

/**
 * Detecteert STEP_COMPLETE markers in AI response tekst.
 * Retourneert de gevonden step numbers (kan meerdere zijn).
 */
export function detectStepCompleteMarkers(text: string): StepCompleteEvent[] {
    const events: StepCompleteEvent[] = [];
    let match: RegExpExecArray | null;

    // Reset regex state
    STEP_COMPLETE_REGEX.lastIndex = 0;

    while ((match = STEP_COMPLETE_REGEX.exec(text)) !== null) {
        const stepNumber = parseInt(match[1], 10);
        if (Number.isFinite(stepNumber) && stepNumber >= 0 && stepNumber <= 100) {
            events.push({ stepNumber });
        }
    }

    return events;
}

/**
 * Detecteert en logt STEP_COMPLETE events server-side.
 * Gebruikt service role voor INSERT (onafhankelijk van client auth).
 *
 * @param text - Volledige AI response tekst
 * @param userId - Geauthenticeerde user ID
 * @param roleId - Agent/rol die de response genereerde
 * @param missionId - Optioneel missie-ID voor context
 */
export async function detectAndLogStepComplete(
    text: string,
    userId: string,
    roleId: string,
    missionId?: string,
): Promise<StepCompleteEvent[]> {
    const events = detectStepCompleteMarkers(text);

    if (events.length === 0) return events;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("[stepCompleteDetector] Missing env vars, cannot log events");
        return events;
    }

    // Service role client — bypasses RLS voor server-side logging
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const inserts = events.map((event) => ({
        uid: userId,
        action: "step_complete" as const,
        data: {
            mission_id: missionId ?? "unknown",
            step_number: event.stepNumber,
            agent_id: roleId,
            source: "server",
        },
    }));

    const { error } = await adminClient.from("audit_logs").insert(inserts);

    if (error) {
        console.error("[stepCompleteDetector] Failed to log events:", error.message);
    } else {
        console.log(`[stepCompleteDetector] Logged ${events.length} step_complete event(s) for user ${userId}`);
    }

    return events;
}
