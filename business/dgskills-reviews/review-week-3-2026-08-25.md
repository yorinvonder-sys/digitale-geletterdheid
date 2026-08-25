# Review: De Ethische Raad (review-week-3)

**Datum:** 2026-08-25
**TemplateType:** ethics-council
**Wave:** 24 (batch-review sweep)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

### ✅ Geslaagd
- `badges` gebruiken consistent de bestaande merkkleuren (`#ff3c21`, `#202023`), geen ad-hoc hex-waarden.
- `introFeatures` en `takeaways` zijn kort, concreet en leeftijdspassend geformuleerd (geen jargon zonder uitleg).
- `counterArgument` (miniboss) is scherp en uitlokkend geschreven — goede stof voor een debat-moment.

### ⚠️ Aandachtspunten
- Config-niveau geeft geen aanleiding tot eigen ontwerpbevindingen; de zichtbare UI-tekortkomingen zitten in de gedeelde engine (zie hieronder), niet in deze config.

### ❌ Blocking issues
- Geen missie-specifieke blocking design-issues gevonden in de config zelf.

**Wat deze missie concreet raakt van de engine-bevindingen (toegankelijkheid):** de LegaalDossier-oordeelknoppen (drie losse buttons zonder `aria-pressed`/radiogroup) en het ontbreken van focusverplaatsing bij stagewissel gelden 1-op-1 voor deze missie, omdat `review-week-3` het volledige vier-dossier-stramien (Legaal → Eerlijk → Transparant → Miniboss) gebruikt.

### Score
**7.5 / 10** — config zelf is schoon; score gedrukt door de geërfde a11y-gaten in de engine die dit dossier daadwerkelijk raakt.

---

## 📚 Didactiek review

### ✅ Geslaagd
- SLO-koppeling is beargumenteerd, niet klakkeloos: `slo-kerndoelen-mapping.ts:88` bevat een expliciete inline-toelichting waarom 21D is toegevoegd ("bevat AI-bias dilemma") — dit is precies het soort claim-vs-werkelijkheid-onderbouwing die de rubric vraagt.
- Curriculumplaatsing is logisch verantwoord: de comment bij `curriculum.ts:140-144` legt uit waarom periode 4 wordt afgesloten met deze missie i.p.v. een aparte toets, en waarom de vorige `assessment-j1-p4`-verwijzing foutief was (verwees naar een periode-1-toets die nooit werd aangeboden). Dat is nette zelfcorrectie, geen bevinding.
- De drie dossiers (legaal/eerlijk/transparant) dekken een herkenbare, leeftijdspassende ethische driehoek; de `eerlijkItems` zijn concreet en behapbaar voor leerjaar 1 (knop-tekst, ondertiteling, contrast, toetsenbord — geen abstracte begrippen).
- `primaryGoal` en `evidence` in `missionGoals.ts` zijn helder en toetsbaar geformuleerd ("noemt voordelen, risico's en een keuze die je kunt verdedigen").

### ⚠️ Aandachtspunten
- De didactische intentie van deze missie ("leg uit of je project mag bestaan") wordt ondermijnd door de scoringslogica van de gedeelde engine: 70 van de 100 punten zijn lengte-gebaseerd (zie tech-sectie). Dat is geen fout in de config, maar het betekent dat de zorgvuldig opgestelde SLO-claim ("bevat AI-bias dilemma", 21D) in de praktijk niet gemeten wordt — een leerling kan het dilemma volledig negeren en toch scoren.

### ❌ Blocking issues
- Geen missie-specifieke blocking didactiek-issues in de config; het blocking probleem (leerling <40% kan niet afronden) zit in de gedeelde `VonnisClimax`/`CompletionScreen`, maar treft déze missie direct: precies de leerlingen die het onderwerp het minst goed onder de knie hebben, lopen vast zonder XP of vervolg.

### SLO-fit oordeel
**Terecht.** De claim (23C, 21D; vso 20B) is inhoudelijk gedekt door de drie dossiers en het miniboss-debat.

### Score
**7 / 10** — sterk ontworpen leerdoel en SLO-onderbouwing, maar de meting ervan wordt ondermijnd door de gedeelde scoringsengine, en de zwakste leerlingen kunnen de missie niet voltooien.

---

## 🔧 Tech review

### Static analyse

#### ✅ Geslaagd
- Config-bestand zelf: geen syntaxfouten, `maxScore: 100` consistent met de engine-optelling die de gedeelde review al valideerde.
- Registry-, SLO-, curriculum- en goals-entries zijn onderling consistent (dezelfde `missionId`, geen typefouten, geen dubbele registratie).

#### ⚠️ Aandachtspunten
- Geen extra missie-specifieke aandachtspunten buiten de reeds vastgestelde engine-bevindingen.

#### ❌ Blocking issues (overgenomen uit de gedeelde engine-beoordeling, van toepassing op deze missie)
1. **Scoring is grotendeels lengte-gebaseerd, niet inhoud-gebaseerd** (`TransparantDossier.tsx:43`, `UitdagingBoss.tsx:30-31`, `LegaalDossier.tsx:42-49`). Voor `review-week-3` betekent dit concreet: een leerling kan met een reeks willekeurige tekens (bv. "aaaaaaaaaa..." × 40 in Legaal, 100 tekens in Transparant, 150 in Uitdaging) 70/100 punten halen zonder één inhoudelijk juist antwoord over privacy, uitsluiting of transparantie te geven.
2. **Missie kan niet worden afgerond onder 40%** (`VonnisClimax.tsx:82` + `CompletionScreen.tsx:163-166`). `review-week-3` gebruikt `VonnisClimax` als afsluiting; een leerling die serieus maar kort antwoordt (en dus laag scoort) krijgt een uitgeschakelde knop en geen `onComplete`/XP.
3. **Categorize-dossier (Eerlijk) verliest state bij herladen** (`EerlijkDossier.tsx:60`). In `review-week-3` is dit het dossier met de zes ontwerpkeuze-items; bij een refresh midden in dit dossier gaat de voortgang van precies dit onderdeel verloren en wordt gereshuffled, terwijl de andere drie dossiers hun tekst behouden.

### Dynamic verificatie
Niet uitgevoerd in deze pass (statische configanalyse + gedeelde engine-bevindingen); geen dev-server-sessie gestart voor deze specifieke missie.

### Score
**4 / 10** — de config zelf is technisch correct, maar de missie erft drie blocking gedragsdefecten van de gedeelde engine die de kernfunctie (eerlijk beoordelen, kunnen afronden, voortgang bewaren) direct raken.

---

## Voorstellen

Alle onderstaande fixes zitten in de **gedeelde engine** (`sub/TransparantDossier.tsx`, `sub/UitdagingBoss.tsx`, `sub/LegaalDossier.tsx`, `sub/VonnisClimax.tsx`, `sub/EerlijkDossier.tsx`) — niet in de missie-config van `review-week-3`. Ze zijn **escalations**, geen auto-fixable wijzigingen binnen de whitelist van deze missie: een engine-fix raakt alle ethics-council-missies tegelijk en hoort in de gedeelde engine-doorvoerronde, niet in een per-missie patch.

Voor de config van `review-week-3` zelf zijn geen mechanische voor/na-fixes nodig — de entries in templateRegistry, slo-kerndoelen-mapping, curriculum en missionGoals zijn correct en goed onderbouwd.

---

## Samenvatting & verdict

De inhoud van `review-week-3` — SLO-koppeling, curriculumplaatsing, dossierteksten, leerdoelen — is zorgvuldig gemaakt en behoeft geen wijziging. Het probleem zit volledig in de gedeelde `ethics-council`-engine die deze missie gebruikt: scoring is grotendeels op tekenlengte gebaseerd (spam scoort bijna vol), leerlingen onder 40% kunnen de missie niet afronden, en het Categorize-dossier verliest voortgang bij herladen. Omdat deze defecten in gedeelde code zitten, kan deze missie niet los van de andere ethics-council-missies worden "gefixt" — een engine-brede reparatie is nodig.

**Verdict: fix-eerst** (blocking op tech-as, via de gedeelde engine — niet zelfstandig oplosbaar binnen de scope van deze missie-config).
