import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { decideNextAction } from '../behavior/decision-engine.mjs';
import { evaluateLanguageLoad } from '../evaluation/language-evaluator.mjs';
import { createIssue } from '../evaluation/issue-builder.mjs';
import { getMissionAdapter } from '../missions/registry.mjs';
import { createStudentContext } from './create-context.mjs';
import { captureLocalProgress, verifyRefreshRecovery } from './progress-probe.mjs';
import { addDomTelemetry, attachTelemetry, redactText } from './telemetry.mjs';

function relativeEvidence(personaId, fileName) {
  return `${personaId}/${fileName}`;
}

function parseFinalScore(scoreText) {
  const match = String(scoreText || '').match(/(\d+)\/(\d+) punten \((\d+)%\)/);
  if (!match) return { score: null, maxScore: null, percentage: null };
  return { score: Number(match[1]), maxScore: Number(match[2]), percentage: Number(match[3]) };
}

async function captureViewportState(page) {
  return page.evaluate(() => {
    const interactive = [...document.querySelectorAll('button, input, select, textarea, a[href]')]
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: element.getAttribute('aria-label') || element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) || element.tagName,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      });
    return {
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      smallTargets: interactive.filter((target) => target.width < 44 || target.height < 44),
      externalLinks: [...document.querySelectorAll('a[href]')]
        .map((anchor) => anchor.href)
        .filter((href) => {
          try { return new URL(href).origin !== window.location.origin; } catch { return false; }
        }),
      mediaErrors: [
        ...[...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => ({ type: 'img', url: image.currentSrc || image.src })),
        ...[...document.querySelectorAll('video')]
          .filter((video) => video.error)
          .map((video) => ({ type: 'video', url: video.currentSrc || video.src })),
      ],
      visibleText: document.body.innerText.trim(),
    };
  });
}

function technicalIssues({ missionId, persona, deviceId, telemetry, progress, viewportChecks }) {
  const issues = [];
  const evidence = [`${persona.id}/telemetry-${deviceId}.json`];
  const errorCount = telemetry.consoleErrors.length + telemetry.pageErrors.length;
  if (errorCount) {
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: 'browser-runtime', category: 'TECHNICAL', severity: 'HIGH',
      description: 'De browser registreerde console- of paginafouten tijdens de missie.',
      expected: 'De missie doorloopt zonder browserfouten.', actual: `${errorCount} browserfout(en) geregistreerd.`,
      learnerImpact: 'De missie kan onbetrouwbaar reageren of onverwacht vastlopen.',
      reproduce: ['Start de lokale pilot.', `Doorloop de missie op ${deviceId}.`, 'Bekijk het telemetrylog.'],
      evidence, recommendation: 'Onderzoek de eerste fout in het telemetrylog en voeg een gerichte regressietest toe.',
      confidence: 0.98, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  }
  const networkCount = telemetry.failedRequests.length + telemetry.httpErrors.length;
  if (networkCount) {
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: 'network', category: 'TECHNICAL', severity: 'HIGH',
      description: 'Een netwerkverzoek mislukte of kreeg een HTTP-foutstatus.',
      expected: 'Alle vereiste lokale missie-assets en modules laden succesvol.', actual: `${networkCount} netwerkfout(en) geregistreerd.`,
      learnerImpact: 'Inhoud of voortgang kan ontbreken.',
      reproduce: ['Start de lokale pilot.', `Doorloop de missie op ${deviceId}.`, 'Bekijk het telemetrylog.'],
      evidence, recommendation: 'Herstel het falende endpoint of assetpad en dek het af met een browsertest.',
      confidence: 0.99, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  }
  if (telemetry.mediaErrors.length) {
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: 'media', category: 'TECHNICAL', severity: 'MEDIUM',
      description: 'Een afbeelding of video kon niet correct worden geladen.',
      expected: 'Alle zichtbare media laden zonder foutstatus.', actual: `${telemetry.mediaErrors.length} mediafout(en) geregistreerd.`,
      learnerImpact: 'Visuele context of uitleg kan ontbreken.',
      reproduce: ['Start de lokale pilot.', `Doorloop de missie op ${deviceId}.`, 'Bekijk het telemetrylog.'],
      evidence, recommendation: 'Controleer het assetpad en voeg een regressiecontrole voor het mediabestand toe.',
      confidence: 0.98, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  }
  if (progress && (!progress.preserved || !progress.sameVisibleStep)) {
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: progress.observationBefore?.stepId || 'refresh', category: 'TECHNICAL', severity: 'HIGH',
      description: 'De lokale missievoortgang of zichtbare stap bleef niet behouden na vernieuwen.',
      expected: 'Dezelfde stap en opgeslagen status keren terug na refresh.', actual: JSON.stringify(progress),
      learnerImpact: 'De leerling kan eerder werk verliezen en moet opnieuw beginnen.',
      reproduce: ['Voltooi de eerste ronde.', 'Wacht tot autosave is uitgevoerd.', 'Vernieuw de pagina.'],
      evidence: [`${persona.id}/trace-${deviceId}.json`], recommendation: 'Controleer autosave-key, debounce en herstelinitialisatie.',
      confidence: 0.99, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  }
  if (viewportChecks.some((check) => check.horizontalOverflow)) {
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: 'responsive-layout', category: 'USABILITY', severity: 'MEDIUM',
      description: 'De missie veroorzaakt horizontale overflow op het geteste apparaat.',
      expected: 'Alle inhoud blijft binnen de viewport.', actual: 'Documentbreedte was groter dan de viewport.',
      learnerImpact: 'Inhoud of knoppen kunnen buiten beeld raken.',
      reproduce: ['Open de missie.', `Gebruik deviceprofiel ${deviceId}.`, 'Controleer document- en viewportbreedte.'],
      evidence: [], recommendation: 'Maak de overlopende component responsief en test portrait en landscape.',
      confidence: 0.99, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  }
  if ((persona.behaviorWeights?.touchReliance ?? 0) > 0 && viewportChecks.some((check) => check.smallTargets.length)) {
    const smallTargets = viewportChecks.flatMap((check) => check.smallTargets).slice(0, 5);
    const touchEvidence = [...new Set(viewportChecks.map((check) => check.touchEvidence).filter(Boolean))];
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: 'touch-controls', category: 'USABILITY', severity: 'MEDIUM',
      description: 'Minstens één zichtbaar interactief element is kleiner dan 44×44 CSS-pixels.',
      expected: 'Touchdoelen zijn minimaal 44×44 CSS-pixels.', actual: JSON.stringify(smallTargets),
      learnerImpact: 'iPad-Iris kan een verkeerde knop raken of een bediening missen.',
      reproduce: ['Open de missie op iPad.', 'Doorloop alle rondes.', 'Meet de zichtbare interactieve elementen.'],
      evidence: touchEvidence, recommendation: 'Vergroot het klikvlak zonder de visuele hiërarchie te veranderen.',
      confidence: 0.96, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  }
  return issues;
}

export async function runScenarioPilot({ browser, config, missionId, persona, deviceId, runDir }) {
  const adapter = getMissionAdapter(missionId);
  const personaDir = path.join(runDir, persona.id);
  const screenshotDir = path.join(personaDir, 'screenshots');
  await mkdir(screenshotDir, { recursive: true });
  const context = await createStudentContext(browser, deviceId);
  const page = await context.newPage();
  const telemetry = attachTelemetry(page);
  const trace = [];
  const issues = [];
  const viewportChecks = [];
  let refreshProbe = null;
  let languageChecked = false;
  let touchEvidenceCaptured = false;
  let final = { score: null, maxScore: null, percentage: null };
  let status = 'failed';
  let finalStatus = 'not-completed';
  const startedAt = new Date();

  try {
    await page.goto(new URL(adapter.previewPath, config.origin).toString(), { waitUntil: 'networkidle' });
    await page.locator('[data-qa="mission-intro"]').waitFor({ state: 'visible' });
    await page.evaluate(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete('reset');
      window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    });
    const introScreenshot = `screenshots/${deviceId}-intro.png`;
    await page.screenshot({ path: path.join(personaDir, introScreenshot), fullPage: true });

    for (let step = 0; step < 30; step += 1) {
      const observation = await adapter.observe(page);
      const viewport = await captureViewportState(page);
      addDomTelemetry(telemetry, viewport);
      let touchEvidence = null;
      if (!touchEvidenceCaptured && (persona.behaviorWeights?.touchReliance ?? 0) > 0 && viewport.smallTargets.length) {
        const screenshot = `screenshots/${deviceId}-small-touch-target.png`;
        await page.screenshot({ path: path.join(personaDir, screenshot), fullPage: true });
        touchEvidence = relativeEvidence(persona.id, screenshot);
        touchEvidenceCaptured = true;
      }
      viewportChecks.push({ stepId: observation.stepId, ...viewport, visibleText: undefined, touchEvidence });
      trace.push({
        sequence: step + 1,
        at: new Date().toISOString(),
        observation: { ...observation, options: observation.options.map(({ id, text }) => ({ id, text })) },
      });

      if (!languageChecked && observation.phase === 'round' && persona.readingLevel === 'a2-b1') {
        const screenshot = `screenshots/${deviceId}-language-check.png`;
        await page.screenshot({ path: path.join(personaDir, screenshot), fullPage: true });
        issues.push(...evaluateLanguageLoad({
          missionId,
          persona,
          stepId: observation.stepId,
          visibleText: viewport.visibleText,
          evidence: relativeEvidence(persona.id, screenshot),
        }));
        languageChecked = true;
      }

      if (observation.phase === 'intro') {
        await adapter.perform(page, { action: 'start' });
      } else if (observation.phase === 'round' || observation.phase === 'confidence' || observation.phase === 'follow-up') {
        if (!refreshProbe && ['puzzle-lab', 'password-fortress'].includes(adapter.id) && trace.some((entry) => (
          entry.observation.phase === 'round' && entry.observation.stepId !== observation.stepId
        ))) {
          refreshProbe = await verifyRefreshRecovery(page, missionId, adapter.observe);
        }
        const decision = decideNextAction({ observation, persona, seed: `${config.seed}:${deviceId}` });
        trace.at(-1).decision = adapter.redactDecision ? adapter.redactDecision(decision) : decision;
        await adapter.perform(page, decision);
      } else if (observation.phase === 'feedback') {
        if (!refreshProbe) refreshProbe = await verifyRefreshRecovery(page, missionId, adapter.observe);
        await adapter.perform(page, { action: 'next' });
      } else if (observation.phase === 'transition') {
        await adapter.perform(page, { action: 'wait-transition' });
      } else if (observation.phase === 'completion') {
        final = parseFinalScore(observation.scoreText);
        const completionScreenshot = `screenshots/${deviceId}-completion.png`;
        await page.screenshot({ path: path.join(personaDir, completionScreenshot), fullPage: true });
        await page.waitForTimeout(1_100);
        status = 'completed';
        finalStatus = final.percentage == null ? 'completed-unscored' : final.percentage >= 40 ? 'passed' : 'completed-below-threshold';
        break;
      } else {
        throw new Error(`Onbekende of vastgelopen missiestap: ${observation.phase}`);
      }
      await page.waitForTimeout(120);
    }

    if (status !== 'completed') throw new Error('De missie bereikte de voltooiingspagina niet binnen 30 stappen.');
  } catch (error) {
    const blockerScreenshot = `screenshots/${deviceId}-blocker.png`;
    await page.screenshot({ path: path.join(personaDir, blockerScreenshot), fullPage: true }).catch(() => undefined);
    issues.push(createIssue({
      missionId, personaId: persona.id, stepId: trace.at(-1)?.observation?.stepId || 'startup', category: 'TECHNICAL', severity: 'BLOCKER',
      description: 'De gesimuleerde leerling kon de missie niet voltooien.', expected: 'De persona bereikt zelfstandig de eindpagina.',
      actual: redactText(error.message), learnerImpact: 'De leerling kan de missie niet afronden.',
      reproduce: ['Start de lokale previewpilot.', `Gebruik ${persona.displayName} op ${deviceId}.`, 'Doorloop de missie tot de fout optreedt.'],
      evidence: [relativeEvidence(persona.id, blockerScreenshot)], recommendation: 'Reproduceer de laatste traceactie en herstel de vastlopende bediening of adapter.',
      confidence: 0.99, evidenceType: 'OBJECTIVE', requiresHumanValidation: false, pedagogicalImpact: false,
    }));
  } finally {
    const progressAtEnd = await captureLocalProgress(page, missionId).catch(() => null);
    await writeFile(path.join(personaDir, `trace-${deviceId}.json`), `${JSON.stringify(trace, null, 2)}\n`);
    await writeFile(path.join(personaDir, `telemetry-${deviceId}.json`), `${JSON.stringify(telemetry, null, 2)}\n`);
    issues.push(...technicalIssues({ missionId, persona, deviceId, telemetry, progress: refreshProbe, viewportChecks }));
    await context.close();

    return {
      result: {
        missionId,
        deviceId,
        status,
        finalScore: final.score,
        maxScore: final.maxScore,
        percentage: final.percentage,
        finalStatus,
        accountStatus: 'NOT_APPLICABLE_PREVIEW',
        persistence: {
          localRefresh: refreshProbe,
          serverReadback: 'NOT_RUN_NO_CONFIRMED_STAGING',
          progressAtEnd,
        },
        telemetrySummary: {
          consoleErrors: telemetry.consoleErrors.length,
          pageErrors: telemetry.pageErrors.length,
          failedRequests: telemetry.failedRequests.length,
          httpErrors: telemetry.httpErrors.length,
          externalLinks: telemetry.externalLinks.length,
          mediaErrors: telemetry.mediaErrors.length,
        },
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
      },
      issues,
    };
  }
}
