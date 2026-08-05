import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
    promptContext.additionalContext.split('\n').slice(0, 2).join('\n'),
    /Vóór een edit/,
  );
  assert.match(promptContext.additionalContext, /Plan:/);
  assert.match(promptContext.additionalContext, /Risico:/);
  assert.match(promptContext.additionalContext, /Bewijs:/);
  assert.match(promptContext.additionalContext, /Waarschijnlijke bestanden/);
  assert.match(promptContext.additionalContext, /leerlinggegevens/);
  // Bewust kort: de volledige werkwijze staat in AGENTS.md, niet in deze injectie.
  assert.ok(promptContext.additionalContext.split(/\s+/).length < 60);

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

  const hookEditDecision = handlePreToolUse({
    hook_event_name: 'PreToolUse',
    tool_name: 'Edit',
    tool_input: { file_path: 'scripts/agent-hooks/policy.mjs' },
  });
  assert.equal(
    hookEditDecision.hookSpecificOutput.permissionDecision,
    'deny',
  );
  assert.match(
    hookEditDecision.hookSpecificOutput.permissionDecisionReason,
    /hook enforcement/,
  );

  const aliasedHookEditDecision = handlePreToolUse({
    hook_event_name: 'PreToolUse',
    tool_name: 'Edit',
    cwd: '/tmp/project',
    tool_input: { file_path: 'scripts/lib/../agent-hooks/policy.mjs' },
  });
  assert.equal(
    aliasedHookEditDecision.hookSpecificOutput.permissionDecision,
    'deny',
  );

  const hookShellDecision = handlePreToolUse({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'sed -i test scripts/agent-hooks/policy.mjs' },
  });
  assert.equal(
    hookShellDecision.hookSpecificOutput.permissionDecision,
    'deny',
  );

  const aliasedHookShellDecision = handlePreToolUse({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: {
      command: 'sed -i test scripts/lib/../agent-hooks/policy.mjs',
    },
  });
  assert.equal(
    aliasedHookShellDecision.hookSpecificOutput.permissionDecision,
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

  handlePostToolUse(
    {
      hook_event_name: 'PostToolUse',
      session_id: 'agent-config-session',
      cwd: '/tmp/project',
      tool_name: 'Write',
      tool_input: {
        file_path: '.opencode/agents/terra-shadow.md',
        content: '---\nmode: subagent\n---',
      },
    },
    { stateDir: tempStateDir },
  );

  const failingAgentStop = handleStop(
    {
      hook_event_name: 'Stop',
      session_id: 'agent-config-session',
      cwd: '/tmp/project',
      stop_hook_active: false,
    },
    {
      stateDir: tempStateDir,
      runAgentCheck: () => ({
        status: 1,
        stdout: '',
        stderr: 'routing mismatch',
      }),
    },
  );

  assert.equal(failingAgentStop.decision, 'block');
  assert.match(failingAgentStop.reason, /npm run agent:check/);
  assert.match(failingAgentStop.reason, /Red-risk area touched/);

  const passingAgentStop = handleStop(
    {
      hook_event_name: 'Stop',
      session_id: 'agent-config-session',
      cwd: '/tmp/project',
      stop_hook_active: false,
    },
    {
      stateDir: tempStateDir,
      runAgentCheck: () => ({ status: 0, stdout: 'ok', stderr: '' }),
    },
  );

  assert.equal(passingAgentStop.continue, true);

  handlePostToolUse(
    {
      hook_event_name: 'PostToolUse',
      session_id: 'bash-session',
      cwd: '/tmp/project',
      tool_name: 'Bash',
      tool_input: { command: 'git status --short' },
    },
    { stateDir: tempStateDir },
  );
  let agentCheckCalled = false;
  let doctorCalled = false;
  const passingBashStop = handleStop(
    {
      hook_event_name: 'Stop',
      session_id: 'bash-session',
      cwd: '/tmp/project',
      stop_hook_active: false,
    },
    {
      stateDir: tempStateDir,
      runAgentCheck: () => {
        agentCheckCalled = true;
        return { status: 0, stdout: 'ok', stderr: '' };
      },
      runDoctor: () => {
        doctorCalled = true;
        return { status: 0, stdout: 'ok', stderr: '' };
      },
    },
  );
  assert.equal(passingBashStop.continue, true);
  assert.equal(agentCheckCalled, true);
  assert.equal(doctorCalled, true);

  handlePostToolUse(
    {
      hook_event_name: 'PostToolUse',
      session_id: 'malformed-session',
      cwd: '/tmp/project',
      tool_name: 'Bash',
      tool_input: { command: 'git status --short' },
    },
    { stateDir: tempStateDir },
  );
  const malformedStateFile = readdirSync(tempStateDir)[0];
  writeFileSync(join(tempStateDir, malformedStateFile), '{broken');
  const malformedStop = handleStop(
    {
      hook_event_name: 'Stop',
      session_id: 'malformed-session',
      cwd: '/tmp/project',
      stop_hook_active: false,
    },
    { stateDir: tempStateDir },
  );
  assert.equal(malformedStop.decision, 'block');
  assert.match(malformedStop.reason, /malformed/);
  rmSync(join(tempStateDir, malformedStateFile), { force: true });

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
