#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseRunConfig } from './config/run-config.mjs';
import { recordModelRouting } from './config/model-routing.mjs';
import { assertSafeTarget } from './browser/safety-guard.mjs';
import { loadPersonas } from './persona/load-personas.mjs';
import { createRunDirectory, writeRunReports } from './reporting/write-report.mjs';

async function loadCredentialMetadata(config) {
  if (config.mode !== 'authenticated') return null;
  if (!config.credentialsPath) throw new Error('Authenticated mode vereist AI_STUDENT_CREDENTIALS_PATH.');
  const credentials = JSON.parse(await readFile(config.credentialsPath, 'utf8'));
  return {
    schoolId: credentials.schoolId,
    accounts: (credentials.accounts || []).map(({ alias, email }) => ({ alias, email })),
  };
}

function selectPersonas(allPersonas, requestedIds) {
  if (requestedIds.length === 0) return allPersonas;
  const byId = new Map(allPersonas.map((persona) => [persona.id, persona]));
  return requestedIds.map((id) => {
    const persona = byId.get(id);
    if (!persona) throw new Error(`Onbekende persona "${id}".`);
    return persona;
  });
}

function devicesForPersona(persona, config) {
  const preferred = persona.preferredViewports || [persona.deviceProfile];
  if (!config.devicesExplicit) return preferred;
  const selected = preferred.filter((device) => config.devices.includes(device));
  if (selected.length === 0) {
    throw new Error(`Geen gekozen device past bij persona "${persona.id}". Voorkeur: ${preferred.join(', ')}.`);
  }
  return selected;
}

async function executePilot(config, selectedPersonas) {
  if (config.mode !== 'preview') {
    throw new Error('Authenticated browserruns blijven geblokkeerd totdat disposable staging handmatig is bevestigd.');
  }
  const runDir = await createRunDirectory(config.reportDir);
  const routingEntries = [
    {
      task: 'Deterministische persona-besluitvorming voor ScenarioEngine',
      complexity: 'gemiddeld', risk: 'gemiddeld', chosenModel: 'Terra', thinkingLevel: 'gemiddeld',
      reason: 'Zichtbare missie-inhoud moet per persona tot andere maar reproduceerbare keuzes leiden zonder antwoordoracle.',
      fallback: 'Beschikbaar Codex-model met gemiddelde reasoning en seedbare beslisregels.',
    },
    {
      task: 'Playwright-pilot mail-detective met drie leerlingpersona’s',
      complexity: 'gemiddeld', risk: 'gemiddeld', chosenModel: 'Terra', thinkingLevel: 'gemiddeld',
      reason: 'Meerdere browserstappen en persona-afhankelijke keuzes, zonder productie-auth of databasewijzigingen.',
      fallback: 'Beschikbaar Codex-model met gemiddelde reasoning en deterministische browseradapter.',
    },
    {
      task: 'Beoordeling authenticated staging en servervoortgang',
      complexity: 'hoog', risk: 'hoog', chosenModel: 'Sol', thinkingLevel: 'hoog',
      reason: 'Auth- en databasebewijs vereist een aantoonbaar disposable stagingproject en fictieve accounts; die ontbreken nog.',
      fallback: 'Fail-closed previewrun; authenticated readback blijft NOT_RUN.',
    },
    {
      task: 'Samenvoegen JSON- en Markdownpilotrapporten',
      complexity: 'laag', risk: 'laag', chosenModel: 'Luna', thinkingLevel: 'laag',
      reason: 'Deterministische formatting en deduplicatie van reeds verzamelde resultaten.',
      fallback: 'Beschikbaar Codex-model met lage reasoning en schemacontrole.',
    },
  ];
  for (const entry of routingEntries) {
    await recordModelRouting(entry, runDir);
    await recordModelRouting(entry, config.reportDir);
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    throw new Error(`Playwright kon niet worden geladen: ${error.message}`);
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless: config.headless,
      ...(config.chromiumPath ? {
        executablePath: config.chromiumPath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      } : {}),
    });
  } catch (error) {
    throw new Error(`Chromium kon niet starten. Installeer de Playwright-browser met "npx playwright install chromium". ${error.message}`);
  }

  const personaReports = [];
  try {
    const { runScenarioPilot } = await import('./browser/run-scenario-pilot.mjs');
    for (const persona of selectedPersonas) {
      const report = { personaId: persona.id, displayName: persona.displayName, results: [], issues: [] };
      for (const deviceId of devicesForPersona(persona, config)) {
        const outcome = await runScenarioPilot({
          browser,
          config,
          missionId: config.missions[0],
          persona,
          deviceId,
          runDir,
        });
        report.results.push(outcome.result);
        report.issues.push(...outcome.issues);
      }
      personaReports.push(report);
    }
  } finally {
    await browser.close();
  }

  const run = {
    runId: runDir.split(/[\\/]/).at(-1),
    environment: config.environment,
    mode: config.mode,
    origin: config.origin,
    missions: config.missions,
    personas: selectedPersonas.map((persona) => persona.id),
    devices: [...new Set(selectedPersonas.flatMap((persona) => devicesForPersona(persona, config)))],
    seed: config.seed,
    authAndServerProgress: 'NOT_RUN_NO_CONFIRMED_STAGING',
  };
  const payload = await writeRunReports({ runDir, run, personaReports });
  process.stdout.write(`${JSON.stringify({
    mode: 'playwright-preview',
    runDir,
    completed: payload.summary.completedCount,
    results: payload.summary.resultCount,
    issues: payload.summary.issueCount,
    uniqueProblems: payload.summary.uniqueProblemCount,
  }, null, 2)}\n`);
  if (payload.summary.completedCount !== payload.summary.resultCount) process.exitCode = 1;
}

async function main() {
  const config = parseRunConfig();
  const credentials = await loadCredentialMetadata(config);
  assertSafeTarget({ ...config, credentials });

  const allPersonas = await loadPersonas();
  const selectedPersonas = selectPersonas(allPersonas, config.personas);
  if (config.missions.length === 0) throw new Error('Selecteer minimaal één missie met --mission=<id>.');

  if (config.dryRun) {
    process.stdout.write(`${JSON.stringify({
      mode: 'dry-run',
      environment: config.environment,
      origin: config.origin,
      missions: config.missions,
      personas: selectedPersonas.map((persona) => persona.id),
      devices: config.devices,
      seed: config.seed,
      reportDir: config.reportDir,
      browserStarted: false,
    }, null, 2)}\n`);
    return;
  }

  if (config.missions.length !== 1) {
    throw new Error('Fase 3 voert precies één pilotmissie per run uit.');
  }
  await executePilot(config, selectedPersonas);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
