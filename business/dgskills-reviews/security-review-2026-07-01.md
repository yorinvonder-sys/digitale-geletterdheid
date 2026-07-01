# Missie-review: security-review

**Datum:** 2026-07-01
**Wave:** 10 (verse review)
**TemplateType:** `review-arena`
**Config:** `src/features/missions/templates/review-arena/configs/security-review.ts`
**Curriculum-plek:** Leerjaar 3, Week 2, `havo`/`vwo`
**SLO-claim:** `23A` (Veiligheid & privacy) — `src/config/slo-kerndoelen-mapping.ts:170`

---

## 🎨 Design review

**Mission:** security-review (review-arena)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** de missie-config zelf (`security-review.ts`) bevat geen `className`/kleur-literals — alle styling zit in de gedeelde `ReviewArena.tsx`-engine en is dus engine-eigendom, niet missie-specifiek. Badge-kleuren in de config gebruiken hex (`#e1ff01`, `#202023`, `#ff3c21`) die exact overeenkomen met de DUCK-tokens `duck-acid`/`duck-ink`/`duck-error` — consistent met het doelpalet, geen off-brand kleuren.
- **Criterium 2 (Layout consistentie):** template-missie, layout volledig gedeeld met de andere 2 review-arena-missies (`advanced-code-review`, `impact-review`) via dezelfde engine — geen structurele afwijking mogelijk vanuit de config.
- **Criterium 3 (Knop-clarity):** N.v.t. op config-niveau — alle knoppen zitten in `ReviewArena.tsx` (engine), niet in deze missie-specifieke file.
- **Criterium 4 (Copy-lengte, leerjaar 3 → intro <120w, opdracht <80w):** `introDescription` 25 woorden, ronde-beschrijvingen 9–15 woorden per ronde — ruim binnen de grens (`security-review.ts:8-9,55-56,103,131-132,150-151`).
- **Criterium 6 (Framer Motion):** geen animatie-code in de config — engine-eigendom.

### ⚠️ Aandachtspunten
- Geen missie-specifieke design-issues gevonden. De enige design-oppervlakte van een `review-arena`-config is copy + badge-kleuren + item-labels; die zijn allemaal binnen normen.

### ❌ Blocking issues
- Geen.

### Score
5/5 toepasbare criteria geslaagd · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** security-review (review-arena)
**Curriculum-plek:** Leerjaar 3, Periode/week 2 (`src/config/slo-kerndoelen-mapping.ts:170`)
**SLO-claim:** `23A` (Veiligheid & privacy)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `23A` is een geldig regulier-VO-kerndoel (Veiligheid & privacy), precies passend bij het onderwerp cybersecurity. Geen VSO-mapping aanwezig, maar dat is geen fout — niet elke missie hoeft VSO te dekken.
- **Criterium 2 (SLO-fit):** sterke fit. Alle 4 rondes oefenen direct veiligheids-/privacygedrag: wachtwoordsterkte beoordelen, aanval↔tegenmaatregel koppelen, veilig/onveilig gedrag classificeren, encryptie/phishing/logging-kennis toetsen (`security-review.ts:50-196`).
- **Criterium 3 (Leerdoelen helder):** `missionGoals.ts:515-523` bevat een expliciet, meetbaar `primaryGoal` ("Ik laat zien dat ik cybersecurity-concepten... beheers door wachtwoorden te beoordelen, aanvallen te koppelen en gedrag te classificeren") met concrete `evidence`-zin. Actiewerkwoorden aanwezig (beoordelen, koppelen, classificeren, uitleggen).
- **Criterium 4 (Opdracht-beknoptheid):** ruim binnen leerjaar-3-grenzen (zie design-review, zelfde telling).
- **Criterium 5 (Leeftijds-passend vocabulaire):** taal past bij 13-14 jaar, geen onnodig jargon (waar vaktermen voorkomen — "brute force", "man-in-the-middle", "DDoS" — worden ze direct in de item-tekst zelf uitgelegd, bv. `security-review.ts:119` "(een aanvaller luistert mee tussen jou en de server)" en `:124` "(het aantal pogingen beperken)").
- **Criterium 6 (Curriculum-plek logisch):** past als afsluitende reviewmissie ná een blok cyber-detective/encryptie/phishing/forensics-missies (bevestigd door `problemScenario` in `year3.tsx:1055`: "de afgelopen weken heb je gewerkt als cyber detective, encryptie-expert, phishing fighter, security auditor en forensisch analist").
- **Criterium 7 (Bloom-balans):** goede mix — ronde 1 en 3 zijn toepassen/analyseren (sorteren/classificeren op basis van principes), ronde 2 is toepassen (koppelen), ronde 4 is onthouden/begrijpen met korte transferverklaring per vraag. Niet alleen kale recall.
- **Criterium 8 (AI-as-copilot):** N.v.t. — `templateRegistry.ts:42` bevestigt `review-arena` heeft géén `enableChat`, dus geen AI-chatrol in deze missie. Bekend, platform-breed (alle 3 review-arena-missies), niet opnieuw te flaggen als issue van déze missie specifiek.
- **Criterium 9 (Welzijn):** geen gevoelige-onderwerp-risico's; onderwerp is technisch/gedragsmatig, geen zelfbeeld/pesten-component nodig.

### Inhoudelijke juistheid van de security-adviezen (missie-eigen check, zoals gevraagd in opdracht)
Alle 4 rondes geïnspecteerd op feitelijke correctheid:
- **Wachtwoordsortering** (`:66-97`): volgorde klopt met moderne richtlijnen — lange wachtzin met symbolen > willekeurige 12-tekens > lange woorden zonder cijfers > kort-complex > veelgebruikt > naam+jaartal. Geen verouderd advies (bv. geen "8 tekens met hoofdletter+cijfer is genoeg"-mythe).
- **Aanval↔tegenmaatregel** (`:106-126`): alle 5 koppelingen correct en actueel (phishing→link/afzender-check, brute force→lang wachtwoord+2FA, USB-malware→autorun uit, MITM→HTTPS+VPN, DDoS→firewall+rate-limiting).
- **Veilig/onveilig gedrag** (`:137-144`): 8 items, alle classificaties correct — geen risicovol advies aan leerlingen.
- **Rapid-fire stellingen** (`:156-193`): alle 8 waar/onwaar-antwoorden feitelijk juist, inclusief de twee "vals veiligheidsgevoel"-correcties die didactisch waardevol zijn ("2FA maakt volledig onhackbaar" = terecht als onwaar gemarkeerd; "wachtwoord delen met vrienden mag" = terecht als onwaar gemarkeerd).

Geen verouderde of gevaarlijke security-adviezen aangetroffen.

### ⚠️ Aandachtspunten
Geen.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy):** sterk geraakt — bewijs: alle 4 rondes + de follow-up-vraag in ronde 1 draaien direct om veiligheidsprincipes (wachtwoordsterkte, aanvalsherkenning, veilig gedrag, MFA-noodzaak).

### Score
9/9 criteria geslaagd · Bloom-balans: medium-hoog (mix van toepassen/analyseren, niet alleen recall) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** security-review (review-arena)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** niet uitgevoerd — geen screenshots-map aanwezig voor deze missie en geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde 0 resultaten); dit rapport beperkt zich tot statische analyse conform de M4-batch-scope.

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** `ReviewArenaConfig`-type geïmporteerd en toegepast (`security-review.ts:1`), geen `any`, geen `@ts-ignore`, alle round-types (`drag-sort`, `match-pairs`, `categorize`, `rapid-fire`) expliciet getypeerd via de gedeelde interface.
- **Criterium A4 (Imports via alias):** enige import is `'../ReviewArena'` (relatief, binnen dezelfde template-map) — dit is het gebruikelijke patroon voor config→engine-type-imports binnen een templatemap, geen `../../` padvervuiling.
- **Criterium A6 (Restart-safe state):** N.v.t. op config-niveau — state-persistence zit in de gedeelde `ReviewArena.tsx`-engine (`useMissionAutoSave`-patroon), niet in deze content-only config.
- **Criterium A7 (Security-checks):** geen AI-interactie in deze missie (bevestigd via templateRegistry: geen `enableChat`), dus geen promptSanitizer- of systemInstruction-oppervlakte om te checken. Geen `dangerouslySetInnerHTML`, geen leerling-input die naar een AI-model of database gaat binnen deze config.
- **Data-integriteit rondes:** `round-drag-sort` heeft 6 items met `correctPosition` 0-5, geen duplicaten of gaten (`security-review.ts:66-97`) — sorteer-logica kan niet vastlopen op een dubbele/missende positie.
- **maxScore-consistentie:** 4 rondes × 25 punten = 100, komt exact overeen met top-level `maxScore: 100` (`security-review.ts:10,57,104,133,152`) — geen scoring-mismatch die de eindscore zou laten afwijken van de badge-drempels.
- **Badge-drempels sluitend:** 5 badges met drempels 0/25/50/70/90, oplopend en zonder gaten of overlap (`security-review.ts:12-42`) — elke mogelijke score (0-100, incl. de +5 bonuspunten van de follow-up) valt in precies één badge-categorie.

#### ⚠️ Aandachtspunten
Geen missie-specifieke technische issues in de config gevonden.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd (zie boven). Aanbevolen als aparte, niet-blokkerende follow-up binnen de bestaande wave-brede Fase-B-achterstand — dit is een bekend, engine-breed/platform-breed gat (geen enkele review-arena-missie heeft dynamic-evidence in de huidige batch), geen nieuw issue van déze missie.

### Score
Static: 7/7 toepasbare criteria geslaagd · Dynamic: n.v.t. (geen dev-server-evidence beschikbaar in deze batch-run) · Aanbeveling: **ship**

---

## Samenvatting

| Rubric | Score (0-10) | Aanbeveling |
|---|---|---|
| Design | 9.0 | ship |
| Didactiek | 9.0 | ship |
| Tech | 8.5 (static volledig groen, dynamic n.v.t.) | ship |

**triageScore** = (10-9.0)×0.3 + (10-9.0)×0.4 + (10-8.5)×0.3 = 0.30 + 0.40 + 0.45 = **1.15**

Lage triageScore bevestigt: dit is een sterke, af missie. Geen voorstel-blokken nodig — er zijn geen fixes om toe te passen.

**Bekende platform-brede punten (niet aan deze missie toe te schrijven, niet opnieuw ter discussie):**
- Dormante chat-rol geldt template-breed voor alle 7 review-arena-achtige missies/alle `review-arena`-instances zonder `enableChat` — architectuurkeuze, geen bug.
- Duck-tokens beperkt tot bg/bgLight/ink/acid/gray/error — badge-kleuren in deze config zijn hex-literals die met die tokens overeenkomen, geen afwijking.
- Geen dynamic/Chrome-plugin-evidence beschikbaar voor deze wave — engine-brede beperking van de huidige batch-run, niet missie-specifiek.

**Wijzigingen aangebracht:** geen (conform opdracht — "Wijzig NIETS").
