# Missiereview: Social Safeguard

**MissionId:** `social-safeguard` · **Type:** `scenario-engine` · **Leerjaar:** 1, week 3 · **Config:** `src/features/missions/templates/scenario-engine/configs/social-safeguard.ts`
**Datum:** 2026-07-02 · **Wave:** 16 (verse review)

---

## Registratie-check (voorafgaand aan rubrics)

| Bron | Status |
|---|---|
| `templateRegistry.ts:15` | ✅ `templateType: 'scenario-engine'` |
| `agents/year1.tsx:1846-1847` | ✅ agent-rol geregistreerd, kleur/icoon/briefing consistent |
| `slo-kerndoelen-mapping.ts:69` (autoritair) | ✅ `sloKerndoelen: ['23B','23A']`, `sloVsoKerndoelen: ['20A','20B']`, week 3, yearGroup 1 |
| `curriculum.ts` periode 3 leerjaar 1 | ✅ mission-id staat in periode 3 "Digitaal Burgerschap" (`sloFocus` bevat 23A/23B) |
| `missionGoals.ts:216-223` | ✅ `primaryGoal`/`criteria`/`evidence` aanwezig, dekt de missie-inhoud correct |

Geen registratie-gaten. Identiteit consistent over alle vier bronnen.

---

## 🎨 Design review

**Score: 8.5/10**

### ✅ Geslaagd
- Duck-tokens correct: alleen `bg/bgLight/ink/acid/gray/error`-varianten gebruikt in engine-sublagen (geen legacy `lab-*` in de config zelf — die zit alleen in de niet-geraakte `visualPreview` van `agents/year1.tsx`, buiten scope).
- Badge-progressie logisch (0/40/60/80), kleurgebruik consistent met andere missies (`#ff3c21` acid-rood voor topbadge).
- Iconen (emoji) passend en niet triviliserend bij een serieus thema — geen speelse iconen bij ernstige items (bv. 💀, 📍 bij doxing/dreigement, geen lachende gezichten).

### ⚠️ Aandachtspunten
- **Cognitieve overbelasting ronde 1 en 4 (8 items/scherm):** `SelectCorrectRound.tsx:39` rendert `round.items.map(...)` als één grid — alle items van een ronde tegelijk zichtbaar, geen paginering. Ronde 1 ("Wat is er aan de hand") en ronde 4 ("Privacy-instellingen") hebben elk 8 items; de leerjaar-1-richtlijn is 3-4 items/scherm. Zelfde klasse als eerder gesignaleerd bij notificatie-ninja/mail-detective — **Yorin-keuze, niet autoFixable** (raakt engine-gedrag of contentsplitsing).
  - **Voorstel (indien gewenst):** splits ronde 1 en 4 elk in twee rondes van 4 items, of vraag de engine om paginering per 4 items binnen één ronde (engine-wijziging, buiten missie-scope).
- Ronde 2 (5 items, order-priority) en ronde 3 (6 items, binary-choice) zitten net boven de 3-4-richtlijn maar zijn functioneel anders (sequentiële ranking / los-behandelde scenario's) — minder acuut dan ronde 1/4.

### ❌ Blocking issues
Geen.

---

## 📚 Didactiek review

**Score: 9.0/10**

### ✅ Geslaagd
- **SLO-fit:** 23A (mediawijsheid/online gedrag) en 23B (digitale identiteit/privacy) worden beide inhoudelijk gedekt — ronde 1/3 raken 23B (herkennen risicosituaties, sociale dynamiek), ronde 2/4 raken 23A (handelingsprotocol, privacy-instellingen).
- **Welzijnsgevoelig thema correct behandeld:** geen normaliserende taal bij pesten/doxing/dreigementen; expliciete erkenning dat "blokkeren en muten zelfzorg is, geen lafheid" (takeaway 5) tegen schaamte-framing.
- **Doorverwijsgedrag intact en in juiste volgorde:** SAFE-ACT-protocol (Stop → Save → Share → Secure) plaatst "meld bij volwassene" vóór "meld bij platform" — didactisch correct (voorkomt bewijsverlies), en instrueert consequent "dit hoef je niet alleen op te lossen" (rondes 2 en 3, meerdere items).
- **Omstander-effect expliciet als leerdoel** (item 1 ronde 3, takeaway 3) — sterke didactische keuze, sluit aan bij vermijden van bystander-passiviteit.
- **Zorgwekkende-statuspost-scenario (ronde 3, item 6):** correct behandeld als "altijd ingrijpen, ook bij onzekerheid" zonder het als suïcidepreventie-triage te framen die een leerling niet kan/moet dragen — expliciete ontlasting ("Jij hoeft dit niet alleen te beoordelen").
- Geen enkel scenario nodigt uit tot zelf-oplossen van strafbare feiten (identiteitsfraude, heimelijk filmen) — telkens "documenteer, verwijder niet zelf, laat volwassene het afhandelen".

### ⚠️ Aandachtspunten
- **Politienummer bij directe dreiging onvolledig (welzijnsgevoelig — NIET autoFixable):** ronde 3, item 3 (r.260) beschrijft een concrete fysieke dreiging ("dreigt hem fysiek iets aan te doen als hij morgen naar school komt") en verwijst naar "de politie (0900-8844)". 0900-8844 is het correcte **niet-spoed** politienummer, maar bij een concrete, tijdgebonden dreiging is 112 het aangewezen alarmnummer — het scenario mist die precisering. Voor een leerjaar-1-leerling die dit letterlijk neemt is dit een feitelijk risico in een veiligheidsinstructie, dus een inhoudelijke correctie, geen cosmetische.
  - **Voorstel:** wijzig r.260 naar: *"Ingrijpen is verplicht. Een fysieke bedreiging is altijd ernstig. Maak meteen samen een screenshot en ga direct naar een volwassene. Bij een directe, concrete dreiging: bel 112. Voor niet-spoedeisende meldingen kan de politie ook via 0900-8844."*
- **Bloom-niveau blijft overwegend herkennen/toepassen:** alle vier rondes zijn select/order/binary — geen ronde vraagt de leerling om zelf een korte reflectie of eigen woorden te formuleren (bv. "wat zou jij zeggen tegen het slachtoffer?"). Voor leerjaar 1 acceptabel gezien de scenario-engine-architectuur, maar een `followUp`-vraag (zoals het type ondersteunt, zie `types.ts:41`) zou het Bloom-plafond verhogen. Niet blocking — engine ondersteunt dit al optioneel, dus laaghangend fruit voor een latere iteratie.

### ❌ Blocking issues
Geen. SLO-codes correct, geen normaliserende content, doorverwijsgedrag intact.

---

## 🔧 Tech review

**Score: 9.5/10**
**Dynamic verificatie:** niet uitgevoerd (geen screenshots-map aanwezig voor `social-safeguard`; niet gedekt in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — grep op missionId gaf geen treffers, dus geen eerder vastgelegde runtime-bevindingen om op voort te bouwen).

### Scoreplafond — exact nagerekend
Elke ronde heeft `maxScore: 25` × 4 rondes = 100. Config-top-level `maxScore: 100` (r.16) — **klopt exact**, geen mismatch tussen som-van-rondes en declared maxScore.

Badge-drempels (0/40/60/80) vallen allemaal binnen [0,100] — geen onbereikbare of triviale drempel.

### ✅ Geslaagd
- **A1 — Structural correctness:** alle 4 rondes hebben geldig `type` (`select-correct`/`order-priority`/`binary-choice`) dat exact overeenkomt met `ScenarioRound['type']` in `types.ts:24`.
- **A2 — Select-correct interne consistentie (ronde 1, 4):** `minSelections` (6 resp. 4) ≤ aantal `correct: true`-items (6 resp. 5 geteld) — haalbaar zonder geforceerde fout-selectie.
- **A3 — Order-priority interne consistentie (ronde 2):** `correctPosition` 0-4 uniek en volledig (geen gaten/duplicaten) over 5 items.
- **A4 — Binary-choice labels aanwezig:** `acceptLabel`/`rejectLabel` correct ingevuld (r.226-227), overschrijft de generieke default zoals `types.ts:37-39` toestaat.
- **A5 — Geen `dangerouslySetInnerHTML`, geen AI-call, geen leerlinginput naar backend:** pure statische config, geen prompt-injection-oppervlak.
- **A6 — Item-id's uniek binnen elke ronde:** geen collisions (geverifieerd per ronde, 8/5/6/8 items met doorlopende of herstartende maar niet-overlappende id's per ronde-scope).
- **A7 — TypeScript-discipline:** geen `any`, config voldoet aan `ScenarioEngineConfig`-interface zonder optionele-veld-misbruik.

### ⚠️ Aandachtspunten
Geen noemenswaardige technische aandachtspunten dit pass.

### ❌ Blocking issues
Geen.

---

## Samenvatting

- **Geslaagd:** design 3/4 substantiële criteria · didactiek 6/7 · tech 7/7
- **Blocking:** 0
- **Resterende issues:** 1 design (cognitieve overbelasting ronde 1/4 — Yorin-keuze, niet autoFixable) · 2 didactiek (politienummer-precisering bij directe dreiging — welzijnsgevoelig, niet autoFixable; Bloom-plafond — laag risico, optioneel)
- **Sterkste punt:** doorverwijsgedrag en omstander-effect zijn didactisch scherp uitgewerkt zonder normalisatie of schaamte-framing; volledige registratie-consistentie over templateRegistry/agent-rol/SLO/curriculum/missionGoals.
- **Grootste resterend risico:** het niet-spoednummer bij een scenario met concrete fysieke dreiging kan een leerling in een echte noodsituatie naar het verkeerde kanaal sturen — inhoudelijk risico, geen cosmetische tekstfout.

**Triage-score:** (10-8.5)×0.3 + (10-9.0)×0.4 + (10-9.5)×0.3 = 0.45 + 0.40 + 0.15 = **1.00** (laag = gezond)

**Verdict: fix-eerst** (geen blocking, maar de 112-precisering is een welzijnsgevoelige feitelijke correctie die vóór verdere distributie de voorkeur verdient; cognitieve-overbelasting is een Yorin-keuze zonder verplicht karakter)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 16) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing, met name voor de welzijnsgevoelige 112-vraag.
