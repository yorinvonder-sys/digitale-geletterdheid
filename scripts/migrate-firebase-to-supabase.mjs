#!/usr/bin/env node

/**
 * Firebase → Supabase Auth Migration Script
 *
 * Migreert alle gebruikersaccounts van Firebase Auth naar Supabase Auth.
 *
 * Vereisten:
 *   1. Firebase service account key JSON in ./firebase-service-account.json
 *      (Download via Firebase Console → Project Settings → Service Accounts → Generate new private key)
 *
 *   2. Environment variabelen (in .env of als CLI flags):
 *      - SUPABASE_URL          (bijv. https://xxxxx.supabase.co)
 *      - SUPABASE_SERVICE_KEY  (de service_role key, NIET de anon key)
 *
 * Gebruik:
 *   npm install firebase-admin @supabase/supabase-js dotenv   (eenmalig)
 *
 *   # Dry run (geen wijzigingen):
 *   node scripts/migrate-firebase-to-supabase.mjs --dry-run
 *
 *   # Echte migratie:
 *   node scripts/migrate-firebase-to-supabase.mjs
 *
 *   # Met wachtwoord-reset e-mails:
 *   node scripts/migrate-firebase-to-supabase.mjs --send-reset-emails
 *
 * Wat het doet:
 *   1. Lijst alle gebruikers op uit Firebase Auth
 *   2. Voor elke gebruiker:
 *      a. Check of het e-mailadres al in Supabase Auth bestaat
 *      b. Zo niet: maak een nieuw account aan in Supabase Auth
 *      c. Zet app_metadata (role, school_id) vanuit de Supabase users-tabel
 *      d. Optioneel: stuur een wachtwoord-reset e-mail
 *   3. Genereert een rapport (migration-report.json)
 *
 * BELANGRIJK: Firebase wachtwoorden (scrypt hash) zijn NIET overdraagbaar
 * naar Supabase (bcrypt). Gebruikers moeten hun wachtwoord resetten of
 * inloggen via Microsoft SSO.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ─── Config ──────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run');
const SEND_RESET_EMAILS = process.argv.includes('--send-reset-emails');
const VERBOSE = process.argv.includes('--verbose');

// ─── Dependencies ────────────────────────────────────────────────────────────

let admin, createClient, dotenv;
try {
    admin = require('firebase-admin');
} catch {
    console.error('❌ firebase-admin niet gevonden. Installeer met: npm install firebase-admin');
    process.exit(1);
}
try {
    ({ createClient } = require('@supabase/supabase-js'));
} catch {
    console.error('❌ @supabase/supabase-js niet gevonden. Installeer met: npm install @supabase/supabase-js');
    process.exit(1);
}
try {
    dotenv = require('dotenv');
    dotenv.config({ path: '.env.local' });
    dotenv.config(); // also load .env if present
} catch {
    // dotenv is optional
}

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Firebase Setup ──────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = resolve(ROOT, 'firebase-service-account.json');

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`❌ Firebase service account key niet gevonden op: ${SERVICE_ACCOUNT_PATH}`);
    console.error('   Download via: Firebase Console → Project Settings → Service Accounts → Generate new private key');
    console.error('   Sla op als: firebase-service-account.json in de project root');
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

console.log(`✅ Firebase Admin geïnitialiseerd (project: ${serviceAccount.project_id})`);

// ─── Supabase Setup ─────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL) {
    console.error('❌ SUPABASE_URL niet gevonden. Zet in .env of als environment variabele.');
    process.exit(1);
}
if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_KEY niet gevonden.');
    console.error('   Dit is de service_role key (NIET de anon key).');
    console.error('   Vind deze in: Supabase Dashboard → Settings → API → service_role key');
    console.error('   Zet als: export SUPABASE_SERVICE_KEY="ey..."');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

console.log(`✅ Supabase client geïnitialiseerd (${SUPABASE_URL})`);

// ─── Helper Functions ────────────────────────────────────────────────────────

async function getAllFirebaseUsers() {
    const users = [];
    let nextPageToken;
    do {
        const result = await admin.auth().listUsers(1000, nextPageToken);
        users.push(...result.users);
        nextPageToken = result.pageToken;
    } while (nextPageToken);
    return users;
}

async function getExistingSupabaseUsers() {
    // Use admin API to list all users
    const allUsers = [];
    let page = 1;
    const perPage = 1000;

    while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({
            page,
            perPage,
        });
        if (error) throw error;
        if (!data.users || data.users.length === 0) break;
        allUsers.push(...data.users);
        if (data.users.length < perPage) break;
        page++;
    }
    return allUsers;
}

async function getSupabaseUserProfiles() {
    // Fetch all user profiles from the public.users table
    const { data, error } = await supabase
        .from('users')
        .select('id, uid, email, display_name, role, school_id, student_class, stats');

    if (error) throw error;
    return data || [];
}

async function createSupabaseUser(firebaseUser, existingProfile) {
    const email = firebaseUser.email;
    if (!email) return { status: 'skipped', reason: 'no_email', uid: firebaseUser.uid };

    // Determine role and metadata from existing profile or Firebase custom claims
    const customClaims = firebaseUser.customClaims || {};
    const role = existingProfile?.role || customClaims.role || 'student';
    const schoolId = existingProfile?.school_id || customClaims.school_id || null;

    const appMetadata = {
        role,
        ...(schoolId && { school_id: schoolId }),
        provider: 'firebase_migration',
        firebase_uid: firebaseUser.uid,
    };

    const userMetadata = {
        display_name: firebaseUser.displayName || existingProfile?.display_name || null,
        student_class: existingProfile?.student_class || null,
        migrated_from_firebase: true,
        migrated_at: new Date().toISOString(),
    };

    if (DRY_RUN) {
        return {
            status: 'dry_run',
            email,
            role,
            schoolId,
            firebaseUid: firebaseUser.uid,
        };
    }

    try {
        // Create user in Supabase Auth (without password — user must reset)
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            email_confirm: true, // Skip email verification since Firebase already verified
            app_metadata: appMetadata,
            user_metadata: userMetadata,
        });

        if (error) {
            // Check for duplicate email
            if (error.message?.includes('already been registered') ||
                error.message?.includes('already exists') ||
                error.status === 422) {
                return { status: 'already_exists', email, firebaseUid: firebaseUser.uid };
            }
            return { status: 'error', email, error: error.message, firebaseUid: firebaseUser.uid };
        }

        const supabaseUserId = data.user.id;

        // Update or create the public.users profile to link with the new Supabase auth ID
        if (existingProfile) {
            // Update existing profile to point to new Supabase user ID
            await supabase
                .from('users')
                .update({
                    id: supabaseUserId,
                    uid: supabaseUserId,
                    updated_at: new Date().toISOString(),
                })
                .eq('email', email);
        } else {
            // Create new profile
            await supabase
                .from('users')
                .upsert({
                    id: supabaseUserId,
                    uid: supabaseUserId,
                    email,
                    display_name: firebaseUser.displayName || null,
                    role,
                    school_id: schoolId,
                    created_at: new Date(firebaseUser.metadata.creationTime).toISOString(),
                    updated_at: new Date().toISOString(),
                    last_login: firebaseUser.metadata.lastSignInTime
                        ? new Date(firebaseUser.metadata.lastSignInTime).toISOString()
                        : null,
                }, { onConflict: 'id' });
        }

        return {
            status: 'created',
            email,
            supabaseId: supabaseUserId,
            firebaseUid: firebaseUser.uid,
            role,
        };
    } catch (err) {
        return { status: 'error', email, error: err.message, firebaseUid: firebaseUser.uid };
    }
}

async function sendPasswordResetEmail(email) {
    if (DRY_RUN) return { status: 'dry_run', email };

    try {
        const { error } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
                redirectTo: `${SUPABASE_URL.replace('.supabase.co', '')}/reset-password`,
            },
        });
        if (error) return { status: 'error', email, error: error.message };
        return { status: 'sent', email };
    } catch (err) {
        return { status: 'error', email, error: err.message };
    }
}

// ─── Main Migration ──────────────────────────────────────────────────────────

async function main() {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  Firebase → Supabase Auth Migratie');
    console.log('═══════════════════════════════════════════════════════════');
    if (DRY_RUN) {
        console.log('  ⚠️  DRY RUN — geen wijzigingen worden gemaakt');
    }
    console.log('');

    // Step 1: Fetch all Firebase users
    console.log('📥 Firebase gebruikers ophalen...');
    const firebaseUsers = await getAllFirebaseUsers();
    console.log(`   Gevonden: ${firebaseUsers.length} gebruikers`);

    // Step 2: Fetch existing Supabase users
    console.log('📥 Bestaande Supabase gebruikers ophalen...');
    const supabaseUsers = await getExistingSupabaseUsers();
    const supabaseEmails = new Set(supabaseUsers.map(u => u.email?.toLowerCase()));
    console.log(`   Gevonden: ${supabaseUsers.length} gebruikers`);

    // Step 3: Fetch existing profiles
    console.log('📥 Supabase user profiles ophalen...');
    const profiles = await getSupabaseUserProfiles();
    const profilesByEmail = new Map(profiles.map(p => [p.email?.toLowerCase(), p]));
    console.log(`   Gevonden: ${profiles.length} profiles`);

    // Step 4: Analyse
    const toMigrate = [];
    const alreadyInSupabase = [];
    const noEmail = [];

    for (const fbUser of firebaseUsers) {
        if (!fbUser.email) {
            noEmail.push(fbUser.uid);
            continue;
        }
        if (supabaseEmails.has(fbUser.email.toLowerCase())) {
            alreadyInSupabase.push(fbUser.email);
        } else {
            toMigrate.push(fbUser);
        }
    }

    console.log('');
    console.log('📊 Analyse:');
    console.log(`   Totaal Firebase gebruikers:    ${firebaseUsers.length}`);
    console.log(`   Al in Supabase (overslaan):    ${alreadyInSupabase.length}`);
    console.log(`   Te migreren:                   ${toMigrate.length}`);
    console.log(`   Geen e-mail (overslaan):       ${noEmail.length}`);
    console.log('');

    if (VERBOSE) {
        if (alreadyInSupabase.length > 0) {
            console.log('   📋 Al in Supabase:');
            alreadyInSupabase.forEach(e => console.log(`      - ${e}`));
        }
        if (noEmail.length > 0) {
            console.log('   📋 Geen e-mail:');
            noEmail.forEach(uid => console.log(`      - UID: ${uid}`));
        }
        console.log('');
    }

    if (toMigrate.length === 0) {
        console.log('✅ Alle Firebase gebruikers staan al in Supabase. Niets te migreren!');
        return;
    }

    // Step 5: Migrate
    console.log(`🚀 Migratie starten (${toMigrate.length} gebruikers)...`);
    console.log('');

    const results = {
        created: [],
        already_exists: [],
        skipped: [],
        errors: [],
        dry_run: [],
        reset_emails_sent: [],
        reset_emails_failed: [],
    };

    for (let i = 0; i < toMigrate.length; i++) {
        const fbUser = toMigrate[i];
        const existingProfile = profilesByEmail.get(fbUser.email?.toLowerCase());
        const progress = `[${i + 1}/${toMigrate.length}]`;

        const result = await createSupabaseUser(fbUser, existingProfile);

        switch (result.status) {
            case 'created':
                results.created.push(result);
                console.log(`   ✅ ${progress} ${result.email} (${result.role})`);
                break;
            case 'already_exists':
                results.already_exists.push(result);
                console.log(`   ⏭️  ${progress} ${result.email} — bestaat al`);
                break;
            case 'skipped':
                results.skipped.push(result);
                console.log(`   ⏭️  ${progress} UID:${result.uid} — ${result.reason}`);
                break;
            case 'dry_run':
                results.dry_run.push(result);
                console.log(`   🔍 ${progress} ${result.email} (${result.role}) — dry run`);
                break;
            case 'error':
                results.errors.push(result);
                console.log(`   ❌ ${progress} ${result.email} — ${result.error}`);
                break;
        }

        // Send password reset email if requested and user was created
        if (SEND_RESET_EMAILS && result.status === 'created') {
            const resetResult = await sendPasswordResetEmail(result.email);
            if (resetResult.status === 'sent') {
                results.reset_emails_sent.push(result.email);
                console.log(`      📧 Reset e-mail verstuurd`);
            } else {
                results.reset_emails_failed.push({ email: result.email, error: resetResult.error });
                console.log(`      ⚠️  Reset e-mail mislukt: ${resetResult.error}`);
            }
        }

        // Rate limiting: small delay between API calls
        if (!DRY_RUN && i < toMigrate.length - 1) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    // Step 6: Report
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  Migratie Rapport');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  Aangemaakt in Supabase:     ${results.created.length}`);
    console.log(`  Al bestaand (overgeslagen):  ${results.already_exists.length + alreadyInSupabase.length}`);
    console.log(`  Overgeslagen (geen email):   ${results.skipped.length}`);
    console.log(`  Fouten:                      ${results.errors.length}`);
    if (DRY_RUN) {
        console.log(`  Dry run (niet uitgevoerd):   ${results.dry_run.length}`);
    }
    if (SEND_RESET_EMAILS) {
        console.log(`  Reset e-mails verstuurd:     ${results.reset_emails_sent.length}`);
        console.log(`  Reset e-mails mislukt:       ${results.reset_emails_failed.length}`);
    }
    console.log('═══════════════════════════════════════════════════════════');

    if (results.errors.length > 0) {
        console.log('');
        console.log('❌ Fouten:');
        results.errors.forEach(e => {
            console.log(`   - ${e.email}: ${e.error}`);
        });
    }

    // Save report
    const reportPath = resolve(ROOT, 'migration-report.json');
    const report = {
        timestamp: new Date().toISOString(),
        dryRun: DRY_RUN,
        firebase: {
            projectId: serviceAccount.project_id,
            totalUsers: firebaseUsers.length,
        },
        supabase: {
            url: SUPABASE_URL,
            existingUsers: supabaseUsers.length,
        },
        migration: {
            alreadyInSupabase: alreadyInSupabase.length,
            migrated: results.created.length,
            errors: results.errors,
            skipped: results.skipped.length + noEmail.length,
        },
        created: results.created,
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('');
    console.log(`📄 Rapport opgeslagen: ${reportPath}`);

    if (!DRY_RUN && results.created.length > 0 && !SEND_RESET_EMAILS) {
        console.log('');
        console.log('⚠️  BELANGRIJK: Gemigreerde gebruikers hebben nog GEEN wachtwoord in Supabase.');
        console.log('   Opties:');
        console.log('   1. Draai dit script opnieuw met --send-reset-emails');
        console.log('   2. Gebruikers klikken zelf op "Wachtwoord vergeten" op de loginpagina');
        console.log('   3. Gebruikers loggen in via Microsoft 365 SSO');
    }

    console.log('');
    console.log('🏁 Klaar!');
}

main().catch(err => {
    console.error('💥 Onverwachte fout:', err);
    process.exit(1);
});
