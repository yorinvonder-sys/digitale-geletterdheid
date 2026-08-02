import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import test from 'node:test';

const PURCHASE_ITEM = 'model_bot';
const INSUFFICIENT_ITEM = 'shirt_hoodie';
const PURCHASE_PRICE = 500;
const INSUFFICIENT_PRICE = 150;

test('avatar shop rekent XP veilig af van saldo tot inventaris', async () => {
    const sandbox = startThrowawaySupabase();
    const container = sandbox.container;
    const normalUserId = randomUUID();
    const raceUserId = randomUUID();
    const userIds = [normalUserId, raceUserId];

    try {
        await seedStudent(container, normalUserId, 600);

        const normalRows = parseJsonLines(await runPsql(container, `
BEGIN;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '${normalUserId}';
SET LOCAL request.jwt.claims = '{"sub":"${normalUserId}","role":"authenticated","aal":"aal1"}';

SELECT jsonb_build_object(
  'case', 'initial_balance',
  'xp', (stats ->> 'xp')::integer,
  'xpSpent', coalesce((stats ->> 'xpSpent')::integer, 0),
  'balance', greatest((stats ->> 'xp')::integer - coalesce((stats ->> 'xpSpent')::integer, 0), 0)
)
FROM public.users
WHERE id = '${normalUserId}';

SELECT jsonb_build_object('case', 'purchase', 'result', public.purchase_avatar_item('${PURCHASE_ITEM}'));
SELECT jsonb_build_object('case', 'repurchase', 'result', public.purchase_avatar_item('${PURCHASE_ITEM}'));
SELECT jsonb_build_object('case', 'insufficient', 'result', public.purchase_avatar_item('${INSUFFICIENT_ITEM}'));

SELECT jsonb_build_object(
  'case', 'persisted_balance',
  'xp', (stats ->> 'xp')::integer,
  'xpSpent', (stats ->> 'xpSpent')::integer,
  'balance', greatest((stats ->> 'xp')::integer - (stats ->> 'xpSpent')::integer, 0),
  'inventory', stats -> 'inventory'
)
FROM public.users
WHERE id = '${normalUserId}';
ROLLBACK;
`));

        assertInitialBalance(normalRows.find((row) => row.case === 'initial_balance'));
        assertSuccessfulPurchase(normalRows.find((row) => row.case === 'purchase'));
        assertAlreadyOwned(normalRows.find((row) => row.case === 'repurchase'));
        assertInsufficientBalance(normalRows.find((row) => row.case === 'insufficient'));
        assertPersistedBalance(normalRows.find((row) => row.case === 'persisted_balance'));

        await seedStudent(container, raceUserId, PURCHASE_PRICE);
        const [firstAttempt, secondAttempt] = await Promise.all([
            runPsql(container, racePurchaseSql(raceUserId, true)),
            runPsql(container, racePurchaseSql(raceUserId, false)),
        ]);

        const raceResults = [...parseJsonLines(firstAttempt), ...parseJsonLines(secondAttempt)];
        assert.equal(raceResults.length, 2, 'beide gelijktijdige RPC-aanroepen moeten een resultaat geven');
        assert.deepEqual(
            raceResults.map((row) => row.code).sort(),
            ['ALREADY_OWNED', 'PURCHASED'],
            'exact één racewinnaar mag XP afschrijven; de andere aankoop is al in bezit',
        );

        const finalRaceState = parseJsonLines(await runPsql(container, `
SELECT jsonb_build_object(
  'stats', stats,
  'ownedRows', (SELECT count(*) FROM public.user_avatar_items WHERE user_id = '${raceUserId}'),
  'paidSum', (SELECT coalesce(sum(price_paid), 0) FROM public.user_avatar_items WHERE user_id = '${raceUserId}')
)
FROM public.users
WHERE id = '${raceUserId}';
`))[0];

        assert.equal(finalRaceState.ownedRows, 1, 'een gelijktijdige aankoop mag maar één eigendomsrij maken');
        assert.equal(finalRaceState.paidSum, PURCHASE_PRICE, 'de uitgave mag maar één keer in het grootboek staan');
        assert.equal(finalRaceState.stats.xp, PURCHASE_PRICE, 'totaal verdiende XP blijft onaangeraakt');
        assert.equal(finalRaceState.stats.xpSpent, PURCHASE_PRICE, 'xpSpent wordt exact één keer verhoogd');
        assert.equal(finalRaceState.stats.inventory.includes(PURCHASE_ITEM), true);
        assert.equal(finalRaceState.stats.inventory.length, 1);
        assert.equal(finalRaceState.stats.xp - finalRaceState.stats.xpSpent, 0);
    } finally {
        cleanupStudents(container, userIds);
        stopThrowawaySupabase(sandbox);
    }
});

function assertInitialBalance(row) {
    assert.deepEqual(row, {
        case: 'initial_balance',
        xp: 600,
        xpSpent: 0,
        balance: 600,
    });
}

function assertSuccessfulPurchase(row) {
    assert.equal(row.result.ok, true);
    assert.equal(row.result.code, 'PURCHASED');
    assert.equal(row.result.itemId, PURCHASE_ITEM);
    assert.equal(row.result.price, PURCHASE_PRICE);
    assert.equal(row.result.xp, 600);
    assert.equal(row.result.xpSpent, PURCHASE_PRICE);
    assert.equal(row.result.balance, 600 - PURCHASE_PRICE);
    assert.deepEqual(row.result.inventory, [PURCHASE_ITEM]);
}

function assertAlreadyOwned(row) {
    assert.equal(row.result.ok, true);
    assert.equal(row.result.code, 'ALREADY_OWNED');
    assert.equal(row.result.itemId, PURCHASE_ITEM);
    assert.equal(row.result.price, PURCHASE_PRICE);
    assert.equal(row.result.xpSpent, PURCHASE_PRICE);
    assert.equal(row.result.balance, 600 - PURCHASE_PRICE);
    assert.deepEqual(row.result.inventory, [PURCHASE_ITEM]);
}

function assertInsufficientBalance(row) {
    assert.equal(row.result.ok, false);
    assert.equal(row.result.code, 'INSUFFICIENT_XP');
    assert.equal(row.result.itemId, INSUFFICIENT_ITEM);
    assert.equal(row.result.price, INSUFFICIENT_PRICE);
    assert.equal(row.result.xpSpent, PURCHASE_PRICE);
    assert.equal(row.result.balance, 600 - PURCHASE_PRICE);
    assert.equal(row.result.needed, INSUFFICIENT_PRICE - (600 - PURCHASE_PRICE));
}

function assertPersistedBalance(row) {
    assert.equal(row.xp, 600);
    assert.equal(row.xpSpent, PURCHASE_PRICE);
    assert.equal(row.balance, 600 - PURCHASE_PRICE);
    assert.deepEqual(row.inventory, [PURCHASE_ITEM]);
}

async function seedStudent(container, userId, xp) {
    const email = `avatar-economy-${userId}@example.test`;
    await runPsql(container, `
BEGIN;
INSERT INTO auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
  email_confirmed_at, created_at, updated_at
) VALUES (
  '${userId}', 'authenticated', 'authenticated', '${email}',
  '{"role":"student","schoolId":"avatar-economy-test"}', '{}', now(), now(), now()
);
INSERT INTO public.users (
  id, uid, email, display_name, role, school_id, student_class, stats
) VALUES (
  '${userId}', '${userId}', '${email}', 'Avatar economy test', 'student',
  'avatar-economy-test', 'TEST',
  jsonb_build_object('xp', ${xp}, 'level', 1, 'inventory', '[]'::jsonb, 'missionsCompleted', '[]'::jsonb)
);
COMMIT;
`);
}

function cleanupStudents(container, userIds) {
    const ids = userIds.map((id) => `'${id}'`).join(', ');
    const result = runPsqlSync(container, `
BEGIN;
DELETE FROM public.users WHERE id IN (${ids});
DELETE FROM auth.users WHERE id IN (${ids});
COMMIT;
`);
    if (result.status !== 0) {
        process.stderr.write(`avatar-shop test cleanup failed: ${result.stderr}\n`);
    }
}

function racePurchaseSql(userId, holdTransaction) {
    return `
BEGIN;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '${userId}';
SET LOCAL request.jwt.claims = '{"sub":"${userId}","role":"authenticated","aal":"aal1"}';
SELECT public.purchase_avatar_item('${PURCHASE_ITEM}');
${holdTransaction ? 'SELECT pg_sleep(1);' : ''}
COMMIT;
`;
}

function parseJsonLines(output) {
    return output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function startThrowawaySupabase() {
    const tempRoot = mkdtempSync('/private/tmp/dgskills-avatar-shop-');
    const npmCache = join(tempRoot, '.npm-cache');
    const projectId = `dgskills-avatar-shop-${process.pid}-${Date.now().toString(36)}`.toLowerCase();
    const basePort = 55_500 + Math.floor(Math.random() * 400);
    const container = `supabase_db_${projectId}`;
    const dockerHost = detectDockerHost();
    const env = {
        ...process.env,
        HOME: tempRoot,
        DO_NOT_TRACK: '1',
        SUPABASE_TELEMETRY_DISABLED: '1',
        npm_config_cache: npmCache,
        npm_config_update_notifier: 'false',
        ...(dockerHost ? { DOCKER_HOST: dockerHost } : {}),
    };
    let initialized = false;

    try {
        runCommand('npx', ['supabase', 'init', '--workdir', tempRoot], {
            env: { ...process.env, HOME: tempRoot, npm_config_cache: npmCache },
            timeout: 30_000,
        });
        initialized = true;
        cpSync(
            join(process.cwd(), 'supabase', 'migrations'),
            join(tempRoot, 'supabase', 'migrations'),
            { recursive: true, force: true },
        );
        patchSupabaseConfig(join(tempRoot, 'supabase', 'config.toml'), projectId, basePort);
        runCommand('npx', ['supabase', 'db', 'start', '--workdir', tempRoot], { env, timeout: 240_000 });
        runCommand('npx', ['supabase', 'migration', 'up', '--local', '--include-all', '--workdir', tempRoot], {
            env,
            timeout: 180_000,
        });
        return { tempRoot, container, env };
    } catch (error) {
        if (initialized) stopThrowawaySupabase({ tempRoot, env });
        rmSync(tempRoot, { recursive: true, force: true });
        throw new Error(
            `Avatar-shop test kon geen geïsoleerde Supabase-database starten. ` +
            `Docker moet draaien; productie wordt nooit gebruikt. ${error.message}`,
        );
    }
}

function detectDockerHost() {
    const result = spawnSync('docker', ['context', 'inspect'], { encoding: 'utf8' });
    if (result.status !== 0) return '';
    try {
        return JSON.parse(result.stdout)?.[0]?.Endpoints?.docker?.Host ?? '';
    } catch {
        return '';
    }
}

function stopThrowawaySupabase(sandbox) {
    if (!sandbox?.tempRoot) return;
    const result = spawnSync('npx', ['supabase', 'stop', '--workdir', sandbox.tempRoot], {
        cwd: process.cwd(),
        env: sandbox.env,
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 60_000,
    });
    if (result.status !== 0 && result.stderr) process.stderr.write(result.stderr);
    rmSync(sandbox.tempRoot, { recursive: true, force: true });
}

function patchSupabaseConfig(configPath, projectId, basePort) {
    if (!existsSync(configPath)) throw new Error(`Supabase config ontbreekt: ${configPath}`);
    const config = readFileSync(configPath, 'utf8')
        .replace(/^project_id = ".*"$/m, `project_id = "${projectId}"`)
        .replaceAll('port = 54321', `port = ${basePort}`)
        .replaceAll('port = 54322', `port = ${basePort + 1}`)
        .replaceAll('shadow_port = 54320', `shadow_port = ${basePort + 2}`)
        .replaceAll('port = 54329', `port = ${basePort + 3}`)
        .replaceAll('port = 54323', `port = ${basePort + 4}`)
        .replaceAll('port = 54324', `port = ${basePort + 5}`)
        .replaceAll('smtp_port = 54325', `smtp_port = ${basePort + 6}`)
        .replaceAll('pop3_port = 54326', `pop3_port = ${basePort + 7}`)
        .replace('sql_paths = ["./seed.sql"]', 'sql_paths = []');
    writeFileSync(configPath, config);
}

function runCommand(command, args, options) {
    const result = spawnSync(command, args, {
        cwd: process.cwd(),
        env: options.env,
        encoding: 'utf8',
        stdio: 'inherit',
        timeout: options.timeout,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
}

function runPsqlSync(container, sql) {
    return spawnSync('docker', psqlArgs(container), {
        input: sql,
        encoding: 'utf8',
    });
}

function runPsql(container, sql) {
    return new Promise((resolve, reject) => {
        const child = spawn('docker', psqlArgs(container), { stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (chunk) => { stdout += chunk; });
        child.stderr.on('data', (chunk) => { stderr += chunk; });
        child.once('error', reject);
        child.once('close', (status) => {
            if (status !== 0) {
                reject(new Error(`psql avatar-shop test failed (${status}): ${stderr.trim() || stdout.trim()}`));
                return;
            }
            resolve(stdout);
        });
        child.stdin.end(sql);
    });
}

function psqlArgs(container) {
    return [
        'exec', '-i', container, 'psql', '-U', 'postgres', '-d', 'postgres',
        '-v', 'ON_ERROR_STOP=1', '-X', '-q', '-t', '-A',
    ];
}
