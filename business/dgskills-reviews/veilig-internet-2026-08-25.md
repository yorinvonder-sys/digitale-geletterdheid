# Rubric-review: Veilig Internet

**Datum:** 2026-08-25
**templateType:** scenario-engine
**Wave:** 23 (batch review)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

Static analyse van de config (geen dev-server beschikbaar in deze pass).

### ✅ Geslaagd
- Vier rondes met afwisselende interactietypen (`select-correct`, `binary-choice`, `select-correct`, `order-priority`) — geen herhaling van hetzelfde patroon, goed voor betrokkenheid.
- `maxScore` per ronde (25×4=100) klopt op het missie-totaal.
- Badges lopen in logische, oplopende drempels (0/40/65/85) met passende emoji's en eigen kleuren.
- Copy per item is kort en scanbaar (1-2 zinnen titel + description), past bij het `scenario-engine`-patroon.

### ⚠️ Aandachtspunten
- Geen mission-specifieke designkeuzes (kleuren, iconen buiten de standaard emoji-set) te beoordelen — de config bevat geen custom styling-overrides, dus dit criterium is niet van toepassing en levert geen bevinding op.

### ❌ Blocking issues
- Geen missie-specifieke blocking issues gevonden. De bekende engine-brede blocker (dood-lopend resultatenscherm onder 40%, zie Tech-sectie) raakt deze missie wél, maar is een engine-bevinding, niet een config-bevinding.

### Score
**8/10** — nette, consistente config zonder eigen designfouten. Aftrek alleen voor het ontbreken van dynamische verificatie (geen browserscreenshots in deze pass) en voor de erfelijke engine-blocker die de indruk van "af" iets drukt.

---

## 📚 Didactiek review

### ✅ Geslaagd
- **SLO-codes correct**: `23A`, `21B` (vo) en `20A`, `18B` (vso) zijn plausibele digitale-veiligheidskerndoelen; geen evident mismatch met de inhoud (phishing, wachtwoorden, privacy, social engineering).
- **Leerdoelen helder**: vier `learningObjectives` zijn allemaal meetbaar geformuleerd ("Herken minstens vier...", "Vergelijk...", "Scheid...", "Zet de stappen... in de juiste volgorde").
- **Bloom-balans**: de vier rondes dekken herkennen (ronde 1), evalueren (ronde 2), classificeren (ronde 3) en toepassen/ordenen (ronde 4) — een goede spreiding, niet alleen onthouden/herkennen.
- **Uitleg per item**: elk item heeft een `explanation` die het "waarom" uitlegt, niet alleen goed/fout — dat versterkt het leereffect na feedback.
- **Welzijn**: takeaway 5 ("Bij twijfel: stop, controleer rustig en vraag hulp van een vertrouwde volwassene") is een gezonde, niet-angstaanjagende afsluiting — geen paniekframing rond online gevaar.
- **Curriculumplek**: `veilig-internet` staat in leerjaar 1, periode met andere digitale-geletterdheid-missies (`data-detective`, `social-safeguard`, `mail-detective` etc.) — logisch geclusterd, week 3.

### ⚠️ Aandachtspunten
- Ronde 1, item 6 ("Je docent stuurt een opdracht via het schoolplatform") en item 3 ("Je exacte geboortedatum" in ronde 3) zijn contextueel prima, maar de minSelections van 4 op een set van 7 (ronde 1) resp. 6 (ronde 3) items betekent dat een leerling met wat gokwerk relatief makkelijk aan het minimum komt — dit is een scoringskwestie, geen didactisch gebrek, en hoort dus in de Tech-sectie thuis (zie orde-priority-bevinding uit de engine-pass, die niet ronde-1/3 raakt maar wel het algemene patroon van deze missie's rondetypen aanstipt).
- `mail-detective` (zelfde curriculumcluster) gebruikt `order-priority`/`order-drag` — deze missie gebruikt bewust géén sleepronde, dus de engine-bevinding over `OrderDragRound`/startvolgorde-lek raakt `veilig-internet` niet (ronde 4 is `order-priority`, niet `order-drag`).

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
Claim en werkelijkheid komen overeen: de vier rondes behandelen concreet phishing-signalen, wachtwoord/2FA-hygiëne, persoonsgegevens en incident-respons — dit dekt de geclaimde kerndoelen inhoudelijk.

### Score
**8.5/10** — sterke, leeftijdspassende opzet met heldere leerdoelen en goede feedbackstructuur.

---

## 🔧 Tech review

### Static analyse

#### ✅ Geslaagd
- Config volgt het `ScenarioEngineConfig`-type correct; alle vier rondetypen (`select-correct`, `binary-choice`, `select-correct`, `order-priority`) zijn engine-ondersteunde types.
- `attribution` is compleet ingevuld (bron, auteur, licentie, licentie-URL, bron-URL) — voldoet aan de CC-BY-bronvereiste.
- Registratie is consistent over de vier bronnen: `templateRegistry.ts:16` (`scenario-engine`), `curriculum.ts:113` (leerjaar 1), `slo-kerndoelen-mapping.ts:73` (SLO's + week 3). Geen `missionGoals.ts`-entry nodig/aanwezig — `missionGoal.criteria.type: 'rounds-complete'` staat zelf-bevattend in de config, wat voor scenario-engine-missies het normale patroon is.
- `order-priority` (niet `order-drag`) wordt gebruikt in ronde 4 — dit is het type mét per-leerling seed-bescherming (`dgskills_shuffle_seed`), dus het engine-brede verklaprisico van de ongeseede sleepvariant (`OrderDragRound.tsx`) raakt deze missie niet.

#### ⚠️ Aandachtspunten
- **Gokcorrectie-zwakte in de gedeelde orderformule** (engine-bevinding, hier van toepassing): ronde 4 (`verdacht-bericht`, 4 items) gebruikt `scoreOrderPriority`, de enige scoreformule zonder gokbasislijn-correctie. Bij 4 items levert klikken zonder lezen gemiddeld ~10/25 op en ligt 13% van de willekeurige klikkers boven de "bijna foutloos"-drempel. Dit is geen configfout, maar een missie-brede engine-tekortkoming die deze missie's ronde 4 concreet raakt.
- **Contract-mismatch tussen `missionGoal.criteria.threshold` en de vaste 40%-CompletionScreen-drempel** raakt deze missie niet: `criteria.type` is `'rounds-complete'`, geen `threshold`-gebaseerd type, dus de door de engine-pass gerapporteerde 40-vs-60-mismatch (die alleen `online-helden`, `factchecker`, `ai-bias-detective` raakt) is hier niet van toepassing.
- **Dood-lopend eindscherm onder 40%** (engine-bevinding, blocking, raakt alle 12 scenario-missies incl. deze): als een leerling onder 40% van de 100 punten scoort, is de voltooiknop uitgeschakeld en heeft het resultatenscherm geen `onBack`/uitweg — de opgeslagen `phase: 'results'`-state herstelt dit scherm bij elk volgend bezoek. Dit is een engine-fix, geen missie-specifieke fix; wordt hier alleen genoteerd omdat deze missie het contract deelt.

#### ❌ Blocking issues
- Geen missie-specifieke blocking issues in de `veilig-internet`-config zelf. De enige blocking bevinding die deze missie raakt (dood-lopend eindscherm <40%) zit in de gedeelde engine (`ScenarioEngine.tsx`), niet in bestanden binnen de whitelist van deze review — dus geen `autoFixable`-entry, wel een escalatie.

### Dynamic verificatie
Niet uitgevoerd in deze pass (geen dev-server-URL meegegeven). Alleen static code-analyse.

### Score
**7/10** — de config zelf is technisch schoon en correct geregistreerd; het cijfer wordt gedrukt door de twee engine-brede kwetsbaarheden (gokcorrectie in `order-priority`, dood-lopend eindscherm) die deze missie's speelervaring concreet raken, ook al zit de oorzaak buiten dit configbestand.

---

## Voorstellen

Geen mechanische fixes binnen de whitelist van deze missie (`veilig-internet.ts`, registry-entries) nodig — de config zelf bevat geen defecten. De twee relevante technische kwetsbaarheden zitten in de gedeelde `scenario-engine`-motor en horen thuis in een engine-brede fix, niet in een per-missie patch. Zie escalations hieronder.

---

## Samenvatting & verdict

De `veilig-internet`-config is inhoudelijk en structureel sterk: heldere leerdoelen, goede Bloom-spreiding, correcte SLO-registratie op alle vier bronnen, en een afwisselende rondemix zonder de kwetsbare `order-drag`-variant. Er zijn geen missie-specifieke defecten gevonden op design, didactiek of tech.

Twee kwetsbaarheden komen wel via de gedeelde engine binnen: de score-formule van ronde 4 (`order-priority`) mist gokcorrectie (engine-breed, elf van de twaalf missies), en een leerling die onder 40% scoort loopt vast op een doodlopend eindscherm (engine-breed, alle twaalf scenario-missies). Beide zijn geen taak voor deze missie-config maar voor een engine-fix.

**Verdict: ok** — geen missie-eigen blocking issues; de aanwezige risico's zijn engine-breed en horen in een aparte engine-fix-taak, niet in een herontwerp of fix-eerst van deze specifieke missie.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
