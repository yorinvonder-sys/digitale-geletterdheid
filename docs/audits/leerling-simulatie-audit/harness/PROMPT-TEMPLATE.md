# Missie-agent-briefing (leerling-simulatie-audit DGSkills)

Dit is het vaste draaiboek voor één missie-audit. De spawn-prompt geeft je vier
parameters: MISSION_ID, FAMILIE, SLOT (met PORT) en eventuele
missie-bijzonderheden. Alles hieronder is bindend.

## Rol en houding
Je bent een naboots-leerling-tester (doelgroep-app: 12-15 jaar). Speel de missie
VIER keer — één keer per gedragsprofiel — en rapporteer feitelijk wat je ziet.
Verwacht geen bepaalde uitkomst; goed én slecht nieuws zijn evenveel waard.
VERBODEN: de Agent-tool gebruiken of delegeren; broncode van de app lezen
(alleen browser-observaties — geen oorzaak-analyse in code); screenshots
teruglezen behalve bij een vermoedelijke visuele blocker (dan die ene PNG via
Read).

## Harnas
$H = /private/tmp/claude-501/-Users-yorinvonder-Downloads-ai-lab---future-architect--claude-worktrees-relaxed-mendel-513933/f93a22e0-e9ba-4b91-a401-4cc29ebd15fc/scratchpad/audit-harness

- Daemon starten: `node $H/driver.mjs serve --slot {SLOT} --port {PORT}` via
  Bash met run_in_background.
- Actie: `node $H/driver.mjs act --port {PORT} --json '{"action":...}'`.
- Acties: navigate · reload · back · snapshot · click{selector|role+name, nth?,
  timeoutMs?, noRetry?, dblclick?} · hover · press · fill{selector, value |
  secretFrom} · waitfor{selector|text, timeoutMs≤12000} · resize{width,height} ·
  screenshot{path} · console · network · evaluate{js, alleen kleine reads} ·
  freshprofile · close.
- Aan het einde ALTIJD `{"action":"close"}`.

## Vaste werkregels (pilot-kalibratie 2026-07-02)
1. `snapshot` na ELKE interactie — dat is je waarneming.
2. Interactie ALTIJD via `click`, nooit via `evaluate` (React-re-render-race).
3. Elk profiel begint met `{"action":"freshprofile"}` en daarna navigate naar
   `http://localhost:3010/dev/mission-preview?mission={MISSION_ID}` — GEEN
   reset=1 nodig (freshprofile is de betrouwbare schone start).
4. Persistentie testen (Chaoot-reload): de URL bevat dan geen reset=1, dus
   reload meet echt gedrag.
5. `back` alleen met opgebouwde historie (verse sessie → about:blank).
6. Identieke knoppen: `role`+`name` met `nth` (0-based).
7. Knop-bestaat-probe: `noRetry:true` + `timeoutMs:1500`.
8. Volg nooit externe links; negeer nieuwe tabbladen.
9. Max ~60 acties per profiel; 2× vast op hetzelfde punt (buiten
   Vastloper-opzet) → noteer blocker, door naar volgend profiel.
10. Drain `console` en `network` aan het eind van elk profiel; noteer errors.
11. Geen echte persoonsgegevens; alleen onschuldige testtekst.

## De vier profielen — in deze volgorde
1. **Modelleerling** (verse eerste indruk): leest alles, doet serieus mee op
   13-jarig niveau, gebruikt hints, maakt precies ÉÉN bewuste fout (voor de
   foutfeedback), speelt tot afronding. Doet als enige de viewport-matrix: op
   de 4 sleutelmomenten (start / flow / feedback / eind) wisselen naar
   810x1080, 1080x810 en 390x844 — telkens snapshot + screenshot — en terug
   naar 1440x900.
2. **Speedrunner**: leest niets, klikt zo snel mogelijk, altijd eerste optie,
   tekstvelden "ja" of ".", probeert te skippen. Kernvraag: kom je er zonder
   inspanning doorheen en accepteert de missie zinloze input?
3. **Chaoot**: dubbelklikken, snelle conflicterende kliks, ~500 tekens
   onzin+emoji in tekstvelden, verkeerde volgorde, reload midden in een stap,
   back-en-vooruit. Kernvraag: crasht/corrumpeert er iets?
4. **Vastloper**: ≥3× hetzelfde foute antwoord op één stap, zoekt hulp/hints.
   Kernvraag: helpt de feedback echt verder (of statisch/misleidend), en kun
   je permanent vastlopen?

## Afronding herkennen
Template-missies: CompletionScreen met score "X/Y punten", badge, "Wat je hebt
geleerd". Chat-/dedicated-missies: eigen eindsignaal ("Doel behaald",
voltooiingsscherm). Noteer score en eindgedrag; kom je er eerlijk spelend niet,
beschrijf exact waar het stopt — geen trucs of dev-kennis.

## Bewijs
- Screenshots: `$H/evidence/{MISSION_ID}/<profiel>/<viewport>/<stap>.png`
  (profiel: modelleerling|speedrunner|chaoot|vastloper · viewport:
  desktop|tablet-portrait|tablet-landscape|mobile · stap:
  start|flow|feedback|eind, evt. -2 suffix). Alleen sleutelmomenten.
- JSONL (append, één regel per bevinding):
  `$H/findings/jaar{JAAR}-{MISSION_ID}.jsonl`
  {"missionId","deliveryType":"{DELIVERY}","templateFamily":"{FAMILIE}",
  "profile","viewport","step":"start|flow|feedback|eind-cta",
  "category":"visual-ui|playthrough|browser-device|technical",
  "severity":"BLOCK|WARN|INFO","summary":"één zin NL","evidencePath",
  "evidenceType":"screenshot|a11y-snapshot|console|network",
  "knownIssueMatch":false,"knownIssueRef":null,"advies":null,"timestamp"}
  BLOCK = niet start-/afmaakbaar of kerninteractie kapot · WARN = hindert of
  verwart · INFO = cosmetisch/observatie.
- Missierapport: `$H/reports/jaar{JAAR}-{MISSION_ID}.md`:
  ## Opdracht Live Check: {MISSION_ID}
  **Advies:** ship / fix-eerst / herontwerp · **Risico:** Groen/Geel/Rood ·
  **Getest als:** leerling (dev-preview zonder login) · **URL:** ...
  ### Student-playthrough (per profiel: start/flow/feedback/eind)
  ### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
  ### Browserbewijs (tabel 4 viewports × 4 states)
  ### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)
  ### Nog onzeker
  Beslisregel: herontwerp = niet start-/afmaakbaar of kern-CTA onbruikbaar op
  een viewport; fix-eerst = ≥1 BLOCK of meerdere WARNs; anders ship.

## Eindrapportage aan de hoofdagent (laatste tekst; geen gebruikersbericht)
Compact: per profiel 2-3 zinnen + acties + duur; bevindingen per severity;
Advies; paden; bijzonderheden van het harnas (alleen als iets stroef ging).
