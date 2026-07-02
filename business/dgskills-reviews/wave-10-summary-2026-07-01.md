# Batch-review wave 10 — verse reviews (2026-07-01)

Vijf nooit-gereviewde missies beoordeeld. Drie zijn grondig schoon; twee bevestigen een systematisch patroon dat nu één platform-beslissing voor Yorin is. Geen mechanische fixes in deze wave (dus ook geen Codex-gates nodig). (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| portfolio-builder | 8 / 6 / 8 | 2.8 | fix-eerst | blocked | coach-briefing beschrijft 3 stappen, canvas heeft er 4 (platform-patroon, zie onder) |
| prototype-developer | 9 / 6 / 7 | 2.8 | fix-eerst | blocked | zelfde patroon, extra: markers een positie verschoven — juist de kernstap "scopen" mist een eigen voltooiingsmarker |
| review-week-2 | 9 / 8 / 9 | 1.4 | ok | fixed | geen — alle antwoordmodellen en score-sommen nagerekend (5/5, 8/8, 8/8, 2/2) |
| review-week-3 | 8.5 / 8 / 8 | 1.85 | ok | fixed | geen — gezond op het nieuwe ethics-council-sjabloon (#184) |
| security-review | 9 / 9 / 8.5 | 1.15 | ok | fixed | geen — security-adviezen inhoudelijk geverifieerd; schoonste missie van de run |

## Platform-beslispunt (bevestigd patroon): coach-plan ≠ canvas-stappen

Nu bij **vier** builder-canvas-missies vastgesteld (podcast-producer, meesterproef, portfolio-builder, prototype-developer): de AI-coach-briefing hanteert een ouder 3-stappenmodel met 3 voltooiingsmarkers, terwijl het canvas 4 stappen heeft. Dit is een systematisch auteurs-artefact, geen losse fouten. **Eén keuze volstaat:** (a) briefings herschrijven naar het 4-stappen-canvasmodel (aanbevolen; herschrijfvoorstellen liggen per missie klaar in de rapporten), of (b) canvassen terugbrengen naar 3 stappen. Na de keuze kan één fix-wave alle vier tegelijk doen.

## Engine-/architectuurlijst (aanvulling)

- ethics-council: `EerlijkDossier.tsx` en `RewardHud.tsx` importeren rechtstreeks uit andere template-mappen (review-arena/sub, builder-canvas/sub) i.p.v. via shared/ — opruimkandidaat.
