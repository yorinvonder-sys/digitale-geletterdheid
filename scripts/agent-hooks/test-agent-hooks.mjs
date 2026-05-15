import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildUserPromptContext,
  extractTouchedPaths,
  handlePreToolUse,
  handlePostToolUse,
  handleStop,
} from './policy.mjs';

const tempStateDir = mkdtempSync(join(tmpdir(), 'dgskills-agent-hooks-test-'));

try {
  const promptContext = buildUserPromptContext({
    prompt: 'Pas de login flow aan en fix de foutmelding.',
  });

  assert.match(
    promptContext.additionalContext.split('\n').slice(0, 4).join('\n'),
    /Begin elke assistant-reply met deze afstemmingscheck/,
  );
  assert.match(promptContext.additionalContext, /vóór planning, uitleg, toolgebruik of edits/);
  assert.match(promptContext.additionalContext, /wait for the answer/);
  assert.match(promptContext.additionalContext, /Plan:/);
  assert.match(promptContext.additionalContext, /Risico:/);
  assert.match(promptContext.additionalContext, /Bewijs:/);
  assert.match(promptContext.additionalContext, /kritische vragen/i);

  assert.deepEqual(
    extractTouchedPaths({
      tool_name: 'apply_patch',
      tool_input: {
        command: [
          '*** Begin Patch',
          '*** Update File: src/features/auth/Login.tsx',
          '@@',
          '-old',
          '+new',
          '*** End Patch',
        ].join('\n'),
      },
    }),
    ['src/features/auth/Login.tsx'],
  );

  const envEditDecision = handlePreToolUse({
    hook_event_name: 'PreToolUse',
    tool_name: 'Write',
    tool_input: {
      file_path: '.env.local',
      content: 'SUPABASE_SERVICE_ROLE_KEY=secret',
    },
  });

  assert.equal(
    envEditDecision.hookSpecificOutput.permissionDecision,
    'deny',
  );
  assert.match(
    envEditDecision.hookSpecificOutput.permissionDecisionReason,
    /secret/i,
  );

  const destructiveCommandDecision = handlePreToolUse({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'git reset --hard HEAD' },
  });

  assert.equal(
    destructiveCommandDecision.hookSpecificOutput.permissionDecision,
    'deny',
  );

  const codeEditResult = handlePostToolUse(
    {
      hook_event_name: 'PostToolUse',
      session_id: 'session-1',
      cwd: '/tmp/project',
      tool_name: 'Write',
      tool_input: {
        file_path: 'src/features/auth/Login.tsx',
        content: 'export const Login = () => null;',
      },
    },
    { stateDir: tempStateDir },
  );

  assert.equal(codeEditResult, null);

  const failingStopDecision = handleStop(
    {
      hook_event_name: 'Stop',
      session_id: 'session-1',
      cwd: '/tmp/project',
      stop_hook_active: false,
    },
    {
      stateDir: tempStateDir,
      runDoctor: () => ({
        status: 1,
        stdout: 'Type error',
        stderr: '',
      }),
    },
  );

  assert.equal(failingStopDecision.decision, 'block');
  assert.match(failingStopDecision.reason, /npm run doctor/);

  const passingStopDecision = handleStop(
    {
      hook_event_name: 'Stop',
      session_id: 'session-1',
      cwd: '/tmp/project',
      stop_hook_active: false,
    },
    {
      stateDir: tempStateDir,
      runDoctor: () => ({
        status: 0,
        stdout: 'Critical TypeScript Check OK',
        stderr: '',
      }),
    },
  );

  assert.equal(passingStopDecision.continue, true);

  const secretDecision = handlePostToolUse(
    {
      hook_event_name: 'PostToolUse',
      session_id: 'session-2',
      cwd: '/tmp/project',
      tool_name: 'Write',
      tool_input: {
        file_path: 'src/services/example.ts',
        content: 'const key = "sk-proj-abcdefghijklmnopqrstuvwxyz123456";',
      },
    },
    { stateDir: tempStateDir },
  );

  assert.equal(secretDecision.decision, 'block');
  assert.match(secretDecision.reason, /secret/i);

  writeFileSync(join(tempStateDir, 'sentinel'), 'ok');
  console.log('agent hook tests passed');
} finally {
  rmSync(tempStateDir, { recursive: true, force: true });
}
