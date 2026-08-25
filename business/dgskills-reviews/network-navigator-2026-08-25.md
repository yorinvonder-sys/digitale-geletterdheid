# Missie-review: network-navigator

**Datum:** 2026-08-25
**TemplateType:** data-viewer
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Mission:** network-navigator (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

Deze missie bestaat uitsluitend uit een config-bestand; er is geen eigen JSX/Tailwind. Design-criteria die op de shared engine slaan (tokens, layout, knop-clarity, Framer Motion, toegankelijkheid) zijn al beoordeeld in de gedeelde engine-review en worden hier niet herhaald.

### ✅ Geslaagd
- **Criterium 4 (copy-lengte):** `introDescription` (~40 woorden) en alle vraagteksten blijven ruim onder de leerjaar-2-grens (intro <80, vraag <60 woorden) — `src/features/missions/templates/data-viewer/configs/network-navigator.ts:8-9`.
- **Criterium 1/2 (tokens/layout):** n.v.t. voor deze missie — geen eigen styling, engine bepaalt layout.

### ⚠️ Aandachtspunten
- **Badge-differentiatie**: alle vier badges gebruiken exact dezelfde kleur `#202023` — `src/features/missions/templates/data-viewer/configs/network-navigator.ts:205-227`.
  - **Wat:** `minScore: 85/65/40/0` badges zijn visueel niet van elkaar te onderscheiden op kleur; alleen emoji + titel verschillen.
  - **Waarom:** een leerling die snel terugkijkt naar zijn resultaat mist het directe visuele signaal "hoe goed heb ik het gedaan" — badges zijn juist bedoeld als snelle statusindicator.
  - **Voorstel:** geef elk niveau een oplopend duck-token, bijvoorbeeld:
    ```ts
    // ❌ Huidig
    { minScore: 85, emoji: '🌐', title: 'Netwerk Engineer!', color: '#202023' },
    { minScore: 65, emoji: '📡', title: 'Internetdetective', color: '#202023' },
    { minScore: 40, emoji: '🔌', title: 'Netwerk Verkenner', color: '#202023' },
    { minScore: 0,  emoji: '📚', title: 'Aan de slag!',      color: '#202023' },

    // ✅ Voorgesteld
    { minScore: 85, emoji: '🌐', title: 'Netwerk Engineer!', color: '#e1ff01' },
    { minScore: 65, emoji: '📡', title: 'Internetdetective', color: '#c2c1bd' },
    { minScore: 40, emoji: '🔌', title: 'Netwerk Verkenner', color: '#202023' },
    { minScore: 0,  emoji: '📚', title: 'Aan de slag!',      color: '#202023' },
    ```

### ❌ Blocking issues
- Geen.

### Score
2/2 toepasbare criteria geslaagd, 1 aandachtspunt · Aanbeveling: **ship** (badge-fix is een kleine polish, geen blocker)

---

## 📚 Didactiek review

**Mission:** network-navigator (data-viewer)
**Curriculum-plek:** Leerjaar 2, Periode (zie `curriculum.ts`, week 2)
**SLO-claim:** `21A` (regulier), `18A` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21A` (Digitale systemen) en `18A` (VSO-equivalent) zijn geldige codes en logisch voor een netwerk/internet-thema — `src/config/slo-kerndoelen-mapping.ts:122`.
- **Criterium 2 (SLO-fit):** de missie behandelt daadwerkelijk digitale systemen — DNS, routers, latency, HTTP-statuscodes — dus geen oppervlakkig contact.
- **Criterium 3 (leerdoelen helder):** `missionGoal.primaryGoal` gebruikt heldere actiewerkwoorden ("leg uit", "gebruik data om ... te herkennen") — `configs/network-navigator.ts:12`.
- **Criterium 4 (beknoptheid):** intro en vragen ruim binnen de leerjaar-2-grenzen.
- **Criterium 6 (curriculum-plek):** logisch voor leerjaar 2 als vervolg op basisbegrippen digitale systemen.
- **Criterium 9 (VSO-mapping):** aanwezig (`18A`).

### ⚠️ Aandachtspunten
- **Criterium 7 (Bloom-balans)**: de meeste vragen zijn recall/begrijpen (multiple-choice, rekensom) — `configs/network-navigator.ts:52-179`.
  - **Wat:** 5 van de 8 vragen zijn multiple-choice of number-input op feitenkennis/rekenwerk; 3 text-observation-vragen (q3, q6, q8) tillen het richting analyseren/verklaren.
  - **Waarom:** voor leerjaar 2 is dit een acceptabele mix (onthouden/begrijpen met een analyse-laag via de open vragen), maar het zwaartepunt ligt laag in Bloom.
  - **Voorstel:** dit is voor leerjaar 2 geen probleem — geen actie nodig, alleen genoteerd als context.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21A (Digitale systemen)**: sterk geraakt — leerling analyseert de volledige route van een databericht (router, DNS, server) en HTTP-statuscodes, kernonderdeel van "hoe werkt het internet".

### Score
6/6 criteria geslaagd · Bloom-balans: laag-medium (passend voor leerjaar 2) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** network-navigator (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze review-run; missie is bovendien puur content-config zonder eigen handlers.

### Static analyse

#### ✅ Geslaagd
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`; config is volledig getypeerd via `DataViewerConfig` — `configs/network-navigator.ts:1`.
- **A4 (imports via alias):** enige import is `../DataViewer` (relatief maar binnen dezelfde template-map, conform patroon van zusterconfigs) — geen probleem.
- **Registry-consistentie:** `missionGoals.ts:755-762` (min:3 rounds-complete) komt overeen met `datasets.length === 3` en `curriculum.ts:189` plaatst de missie logisch in leerjaar 2.

#### ⚠️ Aandachtspunten
- **Cross-check q5-antwoord tegen engine-tolerantie**: `correctAnswer: 5.6` voor `number-input` — `configs/network-navigator.ts:126`.
  - **Wat:** 45 ÷ 8 = 5,625, afgerond op 5,6. Als de data-viewer-engine exacte match verwacht in plaats van een tolerantie-marge, kan een leerling die "5,625" of "5,63" intypt onterecht fout scoren.
  - **Risico:** vals-negatieve score bij een leerling die wél correct heeft gerekend maar anders afrondt.
  - **Voorstel:** dit is een engine-brede kwestie (tolerantie bij number-input), niet specifiek aan deze missie — geen missie-lokale fix nodig; noteren voor de engine-eigenaar als dit nog niet is opgelost.
- **Bekende engine-bevindingen die deze missie raken** (uit gedeelde engine-review, niet opnieuw beoordeeld): de blocking issues rond `onRetry`/`clearSave`-volgorde en het ontbreken van een eenmalig-guard op `onComplete` gelden voor élke data-viewer-missie, dus ook voor network-navigator. Een leerling die op deze missie onder de 40%-drempel scoort, loopt tegen hetzelfde vastloop-scherm aan als bij elke andere data-viewer-missie. Geen missie-specifieke fix mogelijk — dit hoort bij de engine-fix.

#### ❌ Blocking issues
- Geen missie-specifieke blockers. De engine-blockers (zie hierboven) zijn al gerapporteerd in de gedeelde engine-review en gelden generiek voor het templateType.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server gestart in deze review-run.

### Score
Static: 3/3 toepasbare criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: **ship** (missie-niveau); engine-blockers blijven van toepassing op het hele templateType

---

## Voorstellen

Zie de "Voorstel"-blokken hierboven (badge-kleuren). Verder geen missie-specifieke code-wijzigingen nodig; de content is inhoudelijk correct en didactisch passend.

## Samenvatting & verdict

network-navigator is een inhoudelijk sterke, correct opgebouwde data-viewer-missie: heldere SLO-fit (21A/18A), correcte rekenkundige antwoorden, leeftijdspassende copy en een logische plek in leerjaar 2. Het enige concrete verbeterpunt is cosmetisch (identieke badge-kleuren). De blocking issues die de leerling-ervaring echt kunnen breken (vastlopen bij <40% score, dubbele `onComplete`-afvuur, opslag wissen vóór serverbevestiging) zitten in de gedeelde data-viewer-engine en zijn al als engine-bevinding gerapporteerd — niet missie-specifiek oplosbaar binnen deze config.

**Verdict:** ship (missie-content), met de kanttekening dat de generieke engine-blockers eerst gefixt moeten worden voordat élke data-viewer-missie — inclusief deze — echt "klaar voor leerlingen" is.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
