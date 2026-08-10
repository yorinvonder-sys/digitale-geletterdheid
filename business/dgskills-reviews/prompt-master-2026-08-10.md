# Prompt Master — missieaudit 2026-08-10

- **MissionId:** `prompt-master`
- **Curriculum:** leerjaar 1, periode 2 — AI & Creatie
- **Auditstatus:** **niet formeel gesloten**
- **Aanbeveling:** **fix-eerst**
- **DGS-62 voortgang na deze audit:** `0/16/partial`; DGS-62 blijft open
- **Checkout:** schone auditworktree, branch `codex/dgs-62-prompt-master-audit-20260810`
- **Checkout/origin/main:** `17c94127309b574a9afbb860d9c904ee48985f06`
- **Productiedeployment:** `dpl_2WeBRuJ4EhdyDYFSPX3hADEnia3A`, READY, `https://dgskills.app/`, commit `17c94127309b574a9afbb860d9c904ee48985f06`

De rapporten van 2026-08-02 en 2026-08-06 zijn alleen als historische context gebruikt. Alle criteria hieronder zijn opnieuw gecontroleerd op de huidige main/deploymentbinding.

## Eindoordeel

Prompt Master heeft een sterke, speelbare lokale leerlingflow en slaagt voor de vier-viewport Visual Precision Gate. Formele sluiting faalt echter op drie verplichte poorten:

1. **HIGH:** herhaald afronden kan opnieuw XP geven; de client roept opnieuw `award_xp` aan en de live server ontdubbelt niet per leerling+missie.
2. **Productie CANNOT VERIFY:** een verse J1P2-leerling ziet Prompt Master gelockt achter vier herhalingsmissies. Omdat deze audit exact één missie mocht raken, zijn geen andere missies voltooid of vooraf gemarkeerd en is geen directe-route/adminbypass gebruikt.
3. **Opus CANNOT VERIFY:** Claude Code CLI stopte vóór broninspectie met een verlopen OAuth-token (HTTP 401).

Er is daarom geen SHIP-, productie-, merge- of release-readinessclaim.

## Severitytelling

| Blocker | Hoog | Middel | Laag |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 1 |

De productie-lock en de ontbrekende Opus-uitkomst zijn bewijs-/reviewpoorten met `CANNOT VERIFY`, niet als afzonderlijke productseverity meegeteld.

## Design

**Rubric: 18/20 — PASS voor kernontwerp, met open polishpunten.**

| Criterium | Status | Bewijs/oordeel |
|---|---|---|
| Vier responsive viewports | PASS | Desktop 1440x900, iPad-portret CSS 820x1180, iPad-landschap 1180x820 en mobiel 390x844 doorlopen. Geen overlap, clipping of horizontale overflow. |
| Visual Precision Gate | PASS | Intro, normale interactie, foutfeedback, recovery en resultaat zijn op alle vier formaten zichtbaar en leesbaar. |
| Touch-targets | PASS | De eerder te kleine Terug/Stoppen-bediening is nu `min-h-[44px]`; gemeten kritieke controls waren minimaal 44px hoog. |
| Assets en alt-tekst | PASS | Voorbeeldafbeeldingen hebben beschrijvende alt-tekst; lokale providerfallback is duidelijk zichtbaar. |
| Design tokens | FAIL — MEDIUM | Inline merkhexen worden herhaald waar `duck-*`-tokens bestaan, onder meer in `PromptMasterMission.tsx:1036-1041, 1101-1103, 1135-1137, 1192-1195, 1271-1273, 1398, 1420, 1485-1487`. |
| Keyboardfocus | FAIL — LOW | De textarea heeft een expliciete focusring, maar de meeste actieknoppen niet. |
| Fysieke iPad/Safari | CANNOT VERIFY | Chromium-emulatie is geen fysieke iPad-check: **Echte iPad-check nodig**. |

Mobiel loopt `PROMPT LAB` visueel over twee regels en de intro-CTA staat op landschap/mobiel onder de eerste fold, maar beide blijven volledig bereikbaar zonder layoutbreuk.

## Didactiek

**Rubric: 18/20 — PASS voor de kernactiviteit.**

| Criterium | Status | Bewijs/oordeel |
|---|---|---|
| Leerdoel | PASS | De leerling voegt observeerbaar context, vorm en eisen toe aan steeds betere prompts. |
| Actief denken | PASS | De leerling schrijft zelf, analyseert ontbrekende criteria en herschrijft op dezelfde stap. |
| Foutfeedback | PASS | De bewuste fout `Teken een hond.` geeft concrete, niet-verklappende criteria en hints. |
| Recovery | PASS | `Verbeteren` keert terug naar dezelfde uitdaging met bestaande tekst; een uitgebreidere prompt slaagt. |
| Niveauopbouw | PASS | Zes uitdagingen bouwen op van specificiteit/context naar format, persona en beperkingen. |
| Leerbewijs | PASS | Resultaat toont 6/6 en een zichtbare puntenscore; previewresultaten waren 260/270 punten afhankelijk van invoer. |
| Curriculum/SLO | PASS met MEDIUM inconsistentie | Centrale mapping is 21D/22A en VSO 18C/19A/20B, passend bij de activiteit. De dashboardkaart declareert echter 21B/22A (`ProjectZeroDashboard.tsx:139`), waardoor de zichtbare SLO-tag niet met de centrale mapping overeenkomt. |
| Autonomie | gedeeltelijk | Eigen formulering is mogelijk, maar scenario's en criterialijsten liggen vast. |

De lokale scorelogica bepaalt slagen; ontbrekende AI-afbeeldingsgeneratie blokkeert voortgang niet. Dit herbevestigt het eerder gerapporteerde herstel en is opnieuw zichtbaar bewezen.

## Technologie

**Rubric: 11/20 — FAIL voor formele klaarstatus.**

| Criterium | Status | Bewijs/oordeel |
|---|---|---|
| Huidige main/deploymentbinding | PASS | `HEAD == origin/main == deploymentCommit == 17c94127309b574a9afbb860d9c904ee48985f06`. |
| Gerichte checks | PASS | `check:prompt-master`, `check:mission-goals`, 9 mission-completiontests en `doctor` slagen. |
| Vier-viewport previewmanifest | PASS | Officiële validator: `Evidence PASS: prompt-master (preview, 17c9412)`. |
| Autosave en lokale recovery | PASS | User-/missiespecifieke opslag, debounce/flush en clear na duurzame completion zijn aanwezig; Prompt Master heeft geen extra state-validator. |
| Error/loading | PASS | Timeouts en AI-/afbeeldingsfouten hebben leerlingvriendelijke fallback; preview bleef speelbaar. |
| Productie-identiteit | PASS | Exact zichtbaar `DGSkills QA J1P2`; geen bestaande QA-account gebruikt. |
| Productiestart/flow/completion | CANNOT VERIFY | Prompt Master bleef zichtbaar gelockt achter `0/4` herhalingen, ook na volledige reload. Completion clicks: 0. |
| Productieprogress/XP/reload | CANNOT VERIFY | Baseline bleef 50 XP en 0 voltooide missies; er was geen Prompt Master-progress, XP-transactie of completionreload om te bewijzen. |
| Console | PASS binnen zichtbare scope | Productiebrowser meldde 0 errors en 0 warnings; lokale preview toonde alleen de verwachte ontbrekende Supabase-envmelding. |
| Netwerk | CANNOT VERIFY | De interne browser bood geen directe response-statusstream; er wordt geen volledige netwerkgezondheid geclaimd. |
| Scorepersistente rapportage | FAIL — MEDIUM | De missie toont een score/percentage, maar geeft bij afronding alleen `true` door. `handleMissionComplete('prompt-master')` ontvangt geen score, zodat `mission_progress.score` leeg blijft. |
| Herhaal-XP | **FAIL — HIGH** | Reeds voltooide missies blijven heropenbaar; de al-voltooid-tak roept `awardXP` opnieuw aan. De live `award_xp`-functie voegt iedere toegestane aanroep toe en de live tabel heeft geen unieke leerling+missie-index. Alleen 25 XP per aanroep en 200 XP per 24 uur begrenzen herhaling. |

De HIGH is zonder tweede productiecompletion nauw bewezen via de clienttak, de live read-only functiedefinitie en de live indexinventaris. Dit voorkomt extra productiedata en voldoet aan de opdracht om niet buiten deze ene missie te muteren.

## Viewport- en bewijsregister

| Omgeving/formaat | Status | Evidence |
|---|---|---|
| Preview desktop 1440x900 | PASS | `luna-preview-desktop-portrait/01-07-*.png` |
| Preview iPad-portret 820x1180 CSS | PASS | `luna-preview-desktop-portrait/08-13-*.png`; native raster 820x1170 apart vastgelegd |
| Preview iPad-landschap 1180x820 | PASS | `luna-preview-landscape-mobile/landscape-01-10-*.png` |
| Preview mobiel 390x844 | PASS | `luna-preview-landscape-mobile/mobile-01-10-*.png` |
| Productie mobiel 390x844 CSS | BLOCKED | onboardingprovenance, zichtbare 0/4-lock, lock na reload en signed-out post-cleanup; raster 384x831 apart vastgelegd |

Belangrijkste machineleesbare artefacten:

- Previewmanifest: `screenshots/mission-audit/batches/j1p2/prompt-master/17c94127309b574a9afbb860d9c904ee48985f06/current-main-2026-08-10/preview-manifest.json`
- Productiemanifest: `screenshots/mission-audit/batches/j1p2/prompt-master/17c94127309b574a9afbb860d9c904ee48985f06/current-main-2026-08-10/luna-production-mobile/manifest.json`
- Batchmanifest: `screenshots/mission-audit/batches/j1p2/manifest.json`
- Contactsheet: `screenshots/mission-audit/batches/j1p2/prompt-master/17c94127309b574a9afbb860d9c904ee48985f06/contact-sheet.png` (20 gevalideerde bron-PNG's)
- Technisch contractbewijs: `screenshots/mission-audit/batches/j1p2/prompt-master/17c94127309b574a9afbb860d9c904ee48985f06/current-main-2026-08-10/technology-contract-review.md`
- Opus-poort: `screenshots/mission-audit/batches/j1p2/prompt-master/17c94127309b574a9afbb860d9c904ee48985f06/current-main-2026-08-10/opus-sample.md`

Alle geregistreerde PNG's zijn op magic bytes, afmetingen en SHA-256 gecontroleerd. De samengestelde contact sheet is visueel geïnspecteerd; afwijkende productie-rasterafmetingen zijn expliciet gemodelleerd, niet als 390x844 vervalst.

## Auth, productie en cleanup

- Eén tijdelijk synthetisch J1P2-account, één interne productie-browserworker.
- Credentialbestand stond tijdelijk buiten Git met mode 0600; inhoud is nooit gelogd of in bewijs opgeslagen.
- Verplichte welcome/avatar/nulmeting is zichtbaar met synthetische, niet-persoonlijke keuzes doorlopen om het dashboard te bereiken.
- Prompt Master bleef gelockt; er zijn 0 Prompt Master-completionclicks en 0 XP-transacties uitgevoerd.
- Zichtbare logout is gevolgd door globale refreshsessie-intrekking; de vastgelegde refresh token is afgewezen.
- Exact één Auth-user en profiel zijn verwijderd. Drie synthetische `student_activities`-rijen uit de prerequisiteflow zijn verwijderd; alle ondersteunde tabellen zijn daarna exact nul.
- Credentialsbestand én tijdelijke credentialmap zijn verwijderd.
- Volledige reload in dezelfde browserbinding bleef post-cleanup signed-out op de publieke landing.
- **Sessietoken-cleanup: CANNOT VERIFY.** Bestaande access-JWT's kunnen volgens het authcontract tot hun expiry geldig blijven; expiry of server-side denial is niet bewezen. In de gebruikte browser was geen sessieherstel mogelijk en de onderliggende Auth-user bestaat niet meer.
- De tijdelijke helpercopy is teruggezet, self-testte groen en de helperworktree is verwijderd.

## Opus en onafhankelijk Sol-oordeel

- **Claude Opus 5 high:** `CANNOT VERIFY`; de CLI-authenticatie was verlopen (HTTP 401) voordat de herstelde 44px sample en de HIGH konden worden gelezen.
- **Onafhankelijk Sol:** **FAIL — fix-eerst — niet formeel sluiten — 0/16**. Account/profiel/rijen/credentials en refreshrevocation zijn `PASS`; access-JWT-expiry/denial is `CANNOT VERIFY`. Er is geen onafhankelijke positieve signoff. Memo: `screenshots/mission-audit/batches/j1p2/prompt-master/17c94127309b574a9afbb860d9c904ee48985f06/current-main-2026-08-10/sol-independent-review/independent-review.md`.

## Benodigd vóór formele sluiting

1. Los de herhaal-XP HIGH server-side/idempotent op en bewijs dit onafhankelijk, zonder Rood-merge/deploy vóór expliciete gebruikersbeslissing.
2. Bewaar de zichtbare Prompt Master-score als percentage in `mission_progress.score` (MEDIUM) of documenteer bewust waarom niet.
3. Maak een geautoriseerde, één-missie productieproof mogelijk zonder vier andere missies in deze taak te beoordelen; herhaal daarna exact één completion met XP-transactietelling en reloadpersistentie.
4. Herstel Claude Code-auth en laat Opus 5 high de fixed sample en iedere blocker/high beoordelen.
5. Laat een fysieke iPad/Safari-check uitvoeren of behoud expliciet `Echte iPad-check nodig`.

Tot deze poorten groen zijn blijft `prompt-master` **niet formeel gesloten** en blijft DGS-62 op `0/16/partial`.
