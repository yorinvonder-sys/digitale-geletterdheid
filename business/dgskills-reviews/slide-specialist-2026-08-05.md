# Missie-review: Slide Specialist / Presentatiespecialist

**Mission ID:** `slide-specialist`  
**Template:** `tool-guide`  
**Curriculum:** Leerjaar 1, Periode 1  
**Linear:** DGS-61  
**Datum:** 2026-08-05  
**Reviewer-pipeline:** `dgskills-mission-review`  
**Status:** reviewed en gerepareerd; **niet formeel gesloten**  
**Verdict:** **FIX EERST** — uitsluitend de geserialiseerde productiecompletion en reload-persistentie ontbreken nog

## Eindoordeel

Slide Specialist is inhoudelijk, didactisch, technisch en responsief gerepareerd en op de exact gemergde productiecommit gevalideerd. De release zelf is groen, de vier side-effect-free viewportflows halen 55/55 en het fout-herstelpad werkt. Formele sluiting is nog niet verantwoord: de aangewezen productie-Luna trof in de interne browser een uitgelogd productiescherm aan en stopte vóór iedere mutatie. Daardoor zijn de ene toegestane productiecompletion, de werkelijke +25 XP en persistentie na volledige herlaad nog niet bewezen.

Open severity en bewijsrisico:

- **Blocker: 0** — geen open productdefect op blocker-niveau.
- **High: 0** — alle aangetroffen high-bevindingen zijn gemergd en exact-final hergetest.
- **Medium: 2** — fysieke iPad Safari en de fysieke PowerPoint-app zijn niet getest; productiecompletion/XP/reload-persistentie zijn nog onbewezen door de uitgelogde synthetische QA-sessie.
- **Low: 1** — de twee side-effect-free Luna-runtimes konden de interne browser niet binden; Sol heeft daarom de finale read-only viewportcaptures uitgevoerd. Dit is een procesbeperking, geen productdefect.

De veilige batchstatus blijft **3/5 formeel gesloten**: Magister Meester, Cloud Commander en Word Wizard. PR #257 blijft open en draft en mag pas naar 4/5 nadat de ontbrekende productiereis geslaagd is.

## Design

**PASS voor de preview- en responsive-poort.**

- Exact-finale flows zijn uitgevoerd op desktop 1440×900, iPad portrait 820×1180, iPad landscape 1180×820 en mobile 390×844.
- Intro, normale flow, middenstappen, foutfeedback, hetzelfde-vraag-herstel en completion zijn visueel beoordeeld.
- Geen horizontale overflow, blokkerende overlap, clipping of tekstafsnijding gevonden.
- Zichtbare knoppen, links en invoervelden waren minimaal 44×44 px.
- De lange iPad-beperkingen blijven scanbaar op portrait, landscape en mobiel.
- De eindstaat toont een haalbare 55/55 met uitsplitsing 15 + 15 + 10 + 15.

Beperking: dit is Chromium-CSS-emulatie in de interne ChatGPT-browser. De beelden bewijzen geen fysieke iPad Safari.

## Didactiek

**PASS op de finale commit.**

- De leerling bouwt één presentatie met drie afzonderlijke inhoudsslides en laat per externe PowerPoint-stap concreet docentbewijs zien.
- De opdracht vraagt een bestaand thema; een kleurvariant is alleen verplicht als die zichtbaar beschikbaar is.
- De leerling bewaart in school-OneDrive met een neutrale bestandsnaam en toont geen account- of e-mailgegevens.
- De beeldtaak vraagt neutraal, docent-aangeleverd of aantoonbaar herbruikbaar materiaal, zonder gezichten, namen, schoollogo's of privéscreenshots; de bron wordt in notities of een docent-aangewezen veilige plek vermeld.
- Eén bewust fout antwoord geeft de concrete hint: “Nog niet. Denk aan wat een thema voor kleuren en lettertypen door de hele presentatie doet. Kies daarna opnieuw.” Daarna kan de leerling op dezelfde vraag herstellen zonder dat het juiste antwoord vooraf wordt onthuld.
- Overgangen en animaties blijven rustig en doelgericht; de presentatie wordt in presentatiemodus afgespeeld om het resultaat te controleren.
- Timing, startopties en overgangsduur worden niet als universele iPad-actie gepresenteerd. Bij ontbrekende functies gebruikt de leerling laptop/desktop of een docentdemonstratie.
- Microsoft 365-, account-, apparaat-, licentie-, tenant-, versie- en schermstandverschillen zijn benoemd met een fail-safe docentroute.

De instructies sluiten aan op officiële Microsoft-documentatie:

- [Can I set slide timings in PowerPoint on a mobile device?](https://support.microsoft.com/en-us/powerpoint/can-i-set-slide-timings-in-powerpoint-on-a-mobile-device): slide timings zijn niet instelbaar op mobiel; daarvoor is desktop PowerPoint nodig.
- [Set the timing and speed of a transition](https://support.microsoft.com/en-us/powerpoint/set-the-timing-and-speed-of-a-transition): overgangsduur wordt beschreven voor Windows en macOS.
- [Add, change, or remove transitions between slides](https://support.microsoft.com/en-US/PowerPoint/training/add-change-or-remove-transitions-between-slides): iPad kan een overgang/effect kiezen en waar beschikbaar op alle slides toepassen; de iOS-stappen beloven geen duurregeling.
- [Add animation effects in PowerPoint on a mobile device](https://support.microsoft.com/en-us/powerpoint/add-animation-effects-in-powerpoint-on-a-mobile-device): mobiele apps ondersteunen basale animaties, maar niet iedere desktopoptie.
- [Set the start time and speed of an animation effect](https://support.microsoft.com/en-us/powerpoint/set-the-start-time-and-speed-of-an-animation-effect): start- en snelheidsinstellingen zijn desktop/web-gedrag, niet als universele iPad-route gedocumenteerd.
- [Change the theme and background color of your slides](https://support.microsoft.com/en-us/powerpoint/change-the-theme-and-background-color-of-your-slides): thema's zijn beschikbaar op iPad; een specifieke zichtbare kleurvariant is niet gegarandeerd.
- [Save Office files automatically](https://support.microsoft.com/en-US/Office/save-office-files-automatically) en [Give your presentation a file name](https://support.microsoft.com/en-US/PowerPoint/give-your-presentation-a-file-name): cloudopslag en veilige bestandsnaam zijn versie- en accountafhankelijk.
- [When do I need a Microsoft 365 subscription?](https://support.microsoft.com/en-US/Microsoft-365-Activation-Licensing/when-do-i-need-a-microsoft-365-subscription) en [Microsoft 365 system requirements](https://support.microsoft.com/en-US/accounts-billing/subscriptions/microsoft-365-system-requirements): licentie en apparaat kunnen beschikbare functies beperken.

## Techniek

**PASS voor code, scorecontract, ARIA, build, security-diff en exacte deployment; productiepersistentie blijft de sluitingspoort.**

- Zichtbare maximale score en haalbare eindscore: exact 55/55.
- Alle drie checkpoints ondersteunen `allowRetry` en geven een gerichte hint.
- Foutfeedback gebruikt de gedeelde live status; het gekozen antwoord draagt de ingedrukte ARIA-status.
- Iedere externe stap vereist een afzonderlijke `teacherCheck`.
- De zichtbare XP-belofte is exact +25 XP.
- De serverfunctie `award_xp(uuid, integer, text, text)` bindt aan `auth.uid()`, weigert anonieme uitvoering en begrenst het verzoek met `LEAST(..., 25)`. De missie-override vraagt exact 25, dus de zichtbare belofte en het servercontract sluiten aan.
- SLO-koppeling is aangescherpt naar 21A en 22A; de onjuiste 21C-claim is verwijderd.
- Agentcoach en leerlingconfig geven dezelfde privacy-, apparaat- en PowerPoint-beperkingen.

Uitgevoerde checks:

- Gerichte contracttests: 17/17 PASS.
- `npm run typecheck` — PASS.
- `npm run doctor` — PASS.
- `npm run build:prod` — PASS; alleen de verwachte lokale waarschuwing voor ontbrekende `VITE_SUPABASE_*`-variabelen.
- `npm run audit:security` — PASS.
- `git diff --check` — PASS.
- `npm run security:check` — FAIL op drie reeds bestaande bevindingen in `supabase/functions/import-ai-cost/index.ts`; exact dezelfde fouten zijn op schoon `origin/main` gereproduceerd en zijn niet door deze missie-diff veroorzaakt.
- PR #269: quality, performance en Vercel-checks groen; onafhankelijk reviewverdict SHIP.

Release:

- Fixbranch-head na rebase: `ca059e2fe422b0a767c5b9c72f88c15ab090b28b`.
- Fix-PR [#269](https://github.com/yorinvonder-sys/digitale-geletterdheid/pull/269): gesquasht en gemerged.
- Exacte merge- en productiecommit: `7101f650880afc14c80ad1fb457ff8c8e063cba1`.
- Exacte Vercel-deployment: `dpl_EWc6opjLJSoWfopaXhoD6ukfYYVu`, `READY`, target `production`, dezelfde GitHub-SHA.

## Productiepoort

De productiejourney is niet uitgevoerd. De productie-Luna bond de interne ChatGPT-browser, maar `https://dgskills.app/login` toonde alleen het inlogformulier. Daardoor waren de synthetische identiteit, de verwachte 75 XP, drie eerdere voltooide missies en de ontgrendelde/onvoltooide Slide Specialist niet zichtbaar te bevestigen. Volgens de stopregels heeft zij:

- geen credentials bekeken;
- geen account gemaakt of gewisseld;
- geen missie geopend of voltooid;
- geen XP of voortgang gemuteerd;
- de browserviewport hersteld en de productietab gesloten.

Na een zichtbare login op de bestaande synthetische QA-account moet dezelfde Luna vóór iedere mutatie opnieuw 75 XP, drie voltooiingen en de ontgrendelde/onvoltooide missie bevestigen. Daarna mag completion exact één keer gebeuren, gevolgd door een volledige reload die 100 XP, vier voltooide missies en blijvende Slide Specialist-completion toont.

## Evidence

### Geaccepteerd

- Exact-finale vier-viewportbewijs op merge `7101f650880afc14c80ad1fb457ff8c8e063cba1`:
  - `screenshots/mission-audit/batches/j1p1/slide-specialist/final-merged/7101f65/sol-iab/`
  - `manifest.json` — PASS
  - `review.md`
  - `SHA256SUMS` — 26/26 bestanden geverifieerd
  - `desktop/`, `ipad-portrait/`, `ipad-landscape/`, `mobile/`
- Read-only Vercel-proof: deployment `dpl_EWc6opjLJSoWfopaXhoD6ukfYYVu` is `READY`, productie en exact dezelfde commit.
- Productie-Luna fail-closed-resultaat wordt geaccepteerd als veiligheidsbewijs, niet als missie-PASS.

### Verworpen of niet-PASS

- Alle oude, onvolledige, failed of wrong-commit manifests.
- Baseline-captures onder `590abc3/`: pre-fix, herstel op dezelfde vraag ontbrak; sommige bestanden droegen een `.png`-naam maar bevatten JPEG-bytes.
- Candidate-evidence op `ca059e2`: nuttig regressiebewijs, maar niet de finale mergecommit.
- Productiescherm met een demo/docentachtige identiteit en afwijkende XP/voltooiingen: mixed-identity-risico, terecht zonder mutatie verworpen.
- De uitgelogde finale productiecheck: geldige fail-closed-historie, geen bewijs van score, XP-award of persistentie.
- Een aanvullende Opus-review telt niet als PASS doordat lokale OAuth-refresh mislukte.

## Luna-resultaten

- Productie-Luna, eerste poging: zag een demo/docentachtige toestand met afwijkende XP/voltooiingen en stopte vóór mutatie.
- Productie-Luna, finale poging op de gemergde deployment: IAB gebonden, maar uitgelogd; opnieuw fail-closed, nul mutaties.
- Desktop/iPad-portrait-Luna: vond pre-fix het ontbrekende herstel; finale IAB-retry was niet beschikbaar, nul mutaties.
- Landscape/mobile/fix-Luna: implementeerde de afgebakende missie-, XP-, privacy-, iPad- en didactiekfixes en gerichte tests; finale IAB-retry was niet beschikbaar.
- Sol: bleef eigenaar van planning, auth/privacy, servercontract, release, deployment en eindbesluit; merge en vier exacte-finale side-effect-free viewportflows zijn onafhankelijk gevalideerd.

## Cleanup en volgende toegestane actie

- De productie-Luna heeft haar uitgelogde productietab gesloten en de viewport hersteld.
- Er zijn geen lokale productiecredentials of tijdelijke authscripts gemaakt.
- De synthetische QA-account is niet verwijderd en blijft beschikbaar voor de volledige J1P1-period cleanup.
- Evidence-PR #257 blijft open en draft op **3/5**.
- Linear DGS-61 krijgt pas de ene veilige actuele statusupdate nadat de productiepoort is hervat of definitief als blocker moet worden overgedragen.
- Volgende toegestane actie: meld de bestaande synthetische QA-account zichtbaar aan in de interne ChatGPT-browser en geef daarna aan dat de login klaarstaat. Start geen Print Pro of andere opdracht in deze chat.
