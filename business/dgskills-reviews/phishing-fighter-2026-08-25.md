# Review: Phishing Fighter

**Datum:** 2026-08-25
**templateType:** scenario-engine
**Missie-ID:** `phishing-fighter`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7,5/10

**Bevindingen**
- **[blocking, gedeeld]** Doodlopend eindscherm onder 40% score: de gedeelde `CompletionScreen` schakelt de voltooiingsknop uit zonder `onRetry` en zonder terugweg (`ScenarioEngine.tsx:328`). Dit is een engine-brede bevinding die ook `phishing-fighter` raakt — elke leerling die onder 40% van 100 punten scoort, loopt vast op het resultatenscherm en kan de missie nooit meer afronden (opgeslagen `phase: 'results'`). Niet mission-config-specifiek op te lossen; hoort bij de engine-fix.
- **[info]** Consistente iconografie en toon: elke ronde heeft een duidelijk emoji-anker (🚩📊🤔🛡️) en de badges lopen logisch op (0/40/60/80). Geen bevinding, wel vermeld als sterk punt.
- **[warning, gedeeld]** Contrastrisico op gedeelde componenten die deze missie gebruikt: `order-priority`-ronde (`gevaarlijkst-eerst`) rendert via `OrderPriorityRound.tsx`, waar `bg-duck-error text-white` ~3,6:1 haalt — onder de WCAG AA-eis van 4,5:1 voor kleine tekst. Dit is een engine-brede styling-bevinding, niet in de config van deze missie op te lossen.

## Didactiek — score 8/10

**Bevindingen**
- Leerdoelen zijn concreet en toetsbaar ("Benoem minimaal 4 rode vlaggen") en sluiten aan bij `missionGoals.ts`'s `primaryGoal`/`evidence`.
- Ronde 1 (`rode-vlaggen`) mengt correcte en foute afleiders goed: logo-correctheid, tijdstip en verzendkanaal zijn realistische "geen-rode-vlag"-items die studenten dwingen kritisch te blijven i.p.v. alles aan te vinken.
- Ronde 2 (`gevaarlijkst-eerst`) gebruikt een **order-priority**-ronde. Volgens de gedeelde engine-bevindingen mist dit rondetype als enige een gokcorrectie: zonder te lezen, kaarten van boven naar beneden aanklikken levert bij 5 items gemiddeld 9/25 punten op, en bij 16% van de leerlingen ≥15 (de drempel voor "bijna foutloos"-feedback). Dat is een reële didactische zwakte specifiek voor déze ronde: de rangschikking test precies het onderscheidingsvermogen (spear phishing t.o.v. bulkmail) waar het leerdoel om draait, en een leerling die niet leest kan er toch goed op scoren.
- `followUp`-vraag in ronde 4 is sterk: een realistisch WhatsApp-scenario met advies aan een klasgenoot, sluit direct aan bij leerdoel 4 ("Adviseer een klasgenoot").
- Takeaways zijn to-the-point en herhalen de kernprincipes (afzenderadres, urgentie, linkhover, 2FA, zelf-opzoeken).

## Tech — score 8,5/10

**Bevindingen**
- Config volgt het `ScenarioEngineConfig`-contract correct: alle vier rondes hebben `maxScore: 25` (som 100), `feedbackCorrect`/`feedbackIncorrect` overal aanwezig, en items met `correct: false` hebben consequent een `wrongFeedback`.
- Wiring in `templateRegistry.ts`, `slo-kerndoelen-mapping.ts` (SLO 23A, leerjaar 3, week 2), `curriculum.ts` (periode 2, cluster "Cybersecurity & Privacy") en `missionGoals.ts` (`criteria.type: 'rounds-complete'`) is consistent en compleet.
- **Belangrijk voor triage:** omdat `criteria.type` hier `rounds-complete` is (geen `threshold`), raakt deze missie de tweede blokkerende engine-bevinding (40%-vs-drempel-mismatch bij `threshold`-criteria) NIET. Alleen de eerste blokkerende bevinding (dead-end onder 40%, ongeacht criteria-type) is relevant.
- Geen missie-specifieke technische fouten gevonden in de config zelf (geen dubbele item-id's, `correctPosition` in ronde 2 loopt 0-4 zonder gaten, `correctIndex: 2` in de followUp klopt met de bedoelde optie).

---

## Voorstellen

Geen mechanische auto-fixes binnen de whitelist voor deze missie: de enige blocking-bevinding (dead-end completion screen) en de warning-bevindingen (order-priority gokcorrectie, contrast) zitten in de **gedeelde engine**, niet in `phishing-fighter.ts` of de registry-entries. Een config-only aanpassing kan dit niet oplossen zonder de score-logica van de engine te wijzigen — dat is buiten de whitelist-scope van deze review en hoort als aparte engine-fix opgepakt te worden (zie `engine-scenario-engine.json`).

---

## Samenvatting & verdict

`phishing-fighter` is inhoudelijk een sterke, goed doordachte missie: realistische scenario's, duidelijke leerdoelen, nette gokcorrecties op drie van de vier rondes en correcte wiring door de hele config-keten. De enige serieuze zwaktes zijn niet missie-specifiek maar liggen in de gedeelde scenario-engine (dead-end onder 40%, geen gokcorrectie op order-priority, contrast op gedeelde componenten) — deze missie erft ze, veroorzaakt ze niet.

**Verdict: ok** (content-kwaliteit hoog; blocking issue zit in de gedeelde engine en moet daar centraal worden opgelost, niet per missie).
