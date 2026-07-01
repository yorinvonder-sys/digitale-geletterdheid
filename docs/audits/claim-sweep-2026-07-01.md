# Compliance-claim-sweep — 1 juli 2026

> ⚖️ Dit is een **informatieve analyse**, geen formeel juridisch advies. Het vervangt geen gekwalificeerde jurist of FG. Onderdelen gemarkeerd "jurist/FG" vereisen menselijke juridische review vóór extern gebruik.
>
> **Locatie:** dit rapport staat bewust in `docs/audits/` (uitgezonderd van `scripts/check-ai-provider-docs.mjs`), zodat letterlijke citaten van verboden formuleringen de CI-claimchecks niet breken.

**Doel.** Repo-brede sweep op misleidende of verouderde compliance-claims en drift tussen compliance-documenten, gecorrigeerd naar de goedgekeurde wording uit [`docs/compliance/legal-claim-source-of-truth.md`](../compliance/legal-claim-source-of-truth.md) (versie 2026-06-25).

**Methode.** 3 parallelle verkenningsagenten (code-oppervlakken / documenten / provider-staleness) + Opus-planreview per bevinding; patroonset: `complian`, `AVG-proof`, `AVG proof`, `AVG-compliant`, `voldoet aan de AVG`, `GDPR-compliant`, `AI Act`, `Vertex`, `Gemini`, `Google`, `zero-training`, `2 augustus 2026`, `gegarandeerd`, plus status-markers (`VOLDAAN`, `NIET geimplementeerd`, `BLOKKEREND`, `TODO`). Alle wijzigingen zijn uitsluitend **afzwakkingen of aantoonbare feit-correcties**; geen enkele claim is versterkt zonder jurist-flag.

**Basis.** Branch `claude/quirky-bouman-0bf1c5`, afgetakt van `main@7183d37` (identiek aan origin/main bij start). Nulmeting `npm run check:legal`: groen (de resterende bevindingen vielen buiten het regex-net van de bewaakscripts — de norm is de lat, niet het script).

---

## 1. Samenvatting

| Categorie | Aantal | Afhandeling |
|---|---|---|
| Kale/te stellige claims (school-facing) | 8 locaties | **Gecorrigeerd** (commit `1505f9a`) |
| Art. 14 docent-override feit-drift | 9 regels in 2 werkdocs | **Gecorrigeerd** (commit `417c022`); bindende docs → jurist-lijst |
| Stale deadline "2 aug 2026" als dé deadline | 2 levende docs | **Gecorrigeerd** (`417c022` FASE-6-notitie, `cdf370c`); gedateerde audits → historische header (`40d5a49`) |
| Stale provider (Vertex/Gemini) in levende interne naslag | 8 bestanden | **Gecorrigeerd** (commit `d6a8631`) |
| Juridisch bindende documenten met drift | 3 documenten | **NIET gewijzigd** → jurist/FG-lijst (§3) met voorgestelde tekst |
| Grensgevallen / bewust OK | ±10 | Geclassificeerd in §4, geen wijziging |
| In-flight PR-overlap | #152, #164, #156 | Niet gedupliceerd; advies in §5 |

De code-oppervlakken (React-componenten, SEO/prerender, e-mailtemplate `submitPilotRequest`, PDF-service) waren bij de start al grotendeels schoon: correcte toepassingsdatum (2 dec 2027), conditionele wording, geen AVG-proof/compliant-claims. De resterende risico's zaten in documenten en interne naslag.

---

## 2. Toegepaste correcties

### Commit `d6a8631` — interne dev-naslag: providers + deadline (geen school-facing claims, wel drift)

| Locatie | Oud (kern) | Nieuw (kern) |
|---|---|---|
| `ARCHITECTURE.md:34` | verwijst naar niet-bestaand `src/services/geminiService.ts` | `src/services/aiProviderService.ts` |
| `.claude/project-context.md:20` | "AI: Google Gemini via Vertex AI (europe-west4)" | Mistral AI + BFL FLUX, server-side; EER/EU-projectregio-wording |
| `.claude/skill-router.md:40` | "Vertex AI auth → `_shared/vertexAuth.ts`" (bestand bestaat niet) | `mistralClient.ts` / `bflImageClient.ts` / `moderationClient.ts` |
| `.claude/skills/dgskills-supabase-edge/SKILL.md` (8 plekken) | vertexAuth, `GOOGLE_SERVICE_ACCOUNT_KEY`, `europe-west4-aiplatform.googleapis.com`, "Vertex AI vision" | actuele clients, `MISTRAL_API_KEY`/`BFL_API_KEY` (namen), `api.mistral.ai` + `api.eu.bfl.ai`, "Mistral OCR/vision". NB: triggerfrase "vertex ai" in frontmatter → "mistral" (skill-trigger gewijzigd) |
| `.claude/skills/dgskills-compliance-check/SKILL.md` r8/73/87/171 | deadline "2 augustus 2026"; Art. 10-check noemde "Gemini via Vertex AI"; residency "europe-west4" | duale datumformulering (oorspr. 2-8-2026 → verwacht 2-12-2027, Digital Omnibus); Mistral/BFL + conditionele trainings-wording; EER/EU-projectregio |
| `.claude/skills/dgskills-didactiek-reviewer/SKILL.md:54` | "Gemini/Vertex helper" | "Mistral/FLUX-providerhelper" |
| `LAUNCH-PLAN.md:46` | "[x] Vertex AI migratie — data in EU (europe-west4, Nederland)" | AI-providers server-side (Mistral + BFL); EER/EU-projectregio |
| `docs/security/security-audit-prompt-dgskills.md:157` | audit-leeslijst wees naar `_shared/vertexAuth.ts` | `mistralClient.ts`, `bflImageClient.ts`, `moderationClient.ts` |

### Commit `1505f9a` — school-facing claims afgezwakt naar conditionele wording

| Locatie | Oud | Nieuw |
|---|---|---|
| `business/nl-vo/didactische-onderbouwing.md:275` | "Voldoet aan **AVG, DPIA en EU AI Act** vereisten voor gebruik in het onderwijs" — **de meest riskante treffer van de sweep** (kale tripleclaim, actief GTM-doc) | "Is **AVG-bewust ontworpen** met privacy-by-design maatregelen en ondersteunt scholen bij hun AVG-, DPIA- en EU AI Act-verplichtingen, onder voorbehoud van DPA, school-DPIA en FG-review" |
| `business/nl-vo/10-didactische-onderbouwing.md:165` | "**AVG-ready:** DPIA uitgevoerd, …" ("uitgevoerd" = klaar-claim; zusterkopieën waren al verzacht) | "**AVG-bewust:** DPIA-support, verwerkingsovereenkomst en privacy-by-design documentatie beschikbaar" |
| `SECURITY.md:33` | "GDPR-compliant audit logging (EU data residency via Supabase)" | "Audit logging designed to support GDPR obligations (…EU/EEA project region as contractually and operationally agreed)" |
| `school-compliance-guide.html` ×3 (business/nl-vo/compliance, public/compliance, public/dev-docs) | kopje "Garanties conform de AI Act:"; in 2 van 3 kopieën statusregel "Ontworpen voor AVG & EU AI Act Compliance" | kopje "AI Act-maatregelen (onder voorbehoud van school/FG-review):"; statusregel gelijkgetrokken met goedgekeurde v1.3-formulering ("Privacy-by-design dossier voor AVG, ePrivacy en EU AI Act-review door school/FG") |
| `src/features/public-site/ict/AiTransparency.tsx:20,107` | "Conform EU AI Act (Art. 50)" / "Conform de AI Act stellen wij…" (Art. 50 geldt pas vanaf aug 2026 → present-tense "conform" is prematuur) | "Opgesteld met het oog op de transparantie-eisen van de EU AI Act (Art. 50, van toepassing vanaf augustus 2026)" / "Met het oog op de transparantieverplichtingen van de AI Act…" |
| `public/dev-docs/dpa-dgskills-v4.html:117 e.o.` | "Opslag uitsluitend binnen de EU (Google Cloud, regio europe-west1)"; subverwerkerstabel zonder Supabase, afwijkend van de canonieke kopie | regel + tabel gelijkgetrokken met `public/compliance/dpa-dgskills-v4.html` (Supabase + Mistral + BFL; EER/EU-projectregio). NB: `public/dev-docs/` staat in `.vercelignore` → **niet op productie**; wel tracked legacy in de repo |

### Commit `417c022` — Art. 14 docent-override: feiten gecorrigeerd, juridische status conservatief gehouden

Bewijs implementatie (zelf geverifieerd): `supabase/migrations/20260315500000_teacher_step_override.sql` (header citeert "EU AI Act Art. 14 — menselijk toezicht"), `src/services/teacherOverrideService.ts`, `src/features/teacher/StepOverrideModal.tsx`.

| Locatie | Oud | Nieuw |
|---|---|---|
| `eu-ai-act-conformiteitsplan.md:241` | "Docent kan STEP_COMPLETE momenteel NIET overriden" | doorgehaald + "**Opgelost (15 mrt 2026)**" met bewijsverwijzing |
| `eu-ai-act-conformiteitsplan.md:249` (actie 14.1) | "Implementeer docent-override … KRITIEK" | doorgehaald + "**AFGEROND (15 mrt 2026)**" — audit-trail blijft staan |
| `eu-ai-act-conformiteitsplan.md:565` (FASE 6-kop) | "GO-LIVE (Augustus 2026)" | "(interne planning: augustus 2026; wettelijke toepassingsdatum … naar verwachting 2 december 2027 — zie tabel)"; de fasering zelf is bewust NIET herschreven (→ §3) |
| `risicoregister-ai-act.md:94` (R15) | maatregel "Geen maatregel geimplementeerd"; restrisico "directe schending van Art. 14"; status "Non-compliant"; actie "**BLOKKEREND**" | maatregel = geïmplementeerd (15-3-2026) met bewijs; restrisico "HOOG (15) — **herscoring nodig**" (score W/I bewust NIET zelf verlaagd → jurist/FG-review, §3); status "Grotendeels beheerst — herscoring open"; actie = docenttraining/monitoring borgen |
| `risicoregister-ai-act.md:100` (R16) | gap-lijst "…geen EU-databank registratie, geen docent-override" | "geen docent-override" verwijderd; R16-status en overige gaps ongewijzigd |
| `risicoregister-ai-act.md:195` (TM-13) | "**NIET geimplementeerd — BLOKKEREND**" | "**Geimplementeerd (15 mrt 2026)**" met bewijs |
| `risicoregister-ai-act.md:263,273` | "(zodra override is geimplementeerd)" ×2 | "(override is geimplementeerd sinds 15 mrt 2026)" |
| `risicoregister-ai-act.md:325` (§8.2) | "NIET geimplementeerd" | "Geimplementeerd (15 mrt 2026) — herscoring bij volgende risico-review" |

Bewust NIET aangeraakt: Art. 9-statussen (overal consistent "NIET VOLDAAN" — correct), Art. 14 totaalstatus "GEDEELTELIJK VOLDAAN" (dashboard/noodstop/training nog open), R18 leerling-beroepsmogelijkheid ("Non-compliant" blijft — apart control).

### Commit `40d5a49` — historische headers op gedateerde audits (i.p.v. snapshot-vervalsing)

| Locatie | Probleem | Afhandeling |
|---|---|---|
| `docs/security/audit-ai-integrations-2026-04.md` | Art. 14 "N/A" (gold alleen voor de toen geauditeerde nieuwe functies) kan als actuele status worden misgelezen | "Historische status 01-07-2026"-header (bestaande conventie) met duiding; bevindingen zelf onaangetast |
| `docs/security/security-audit-rapport-dgskills.md` | r330 "deadline 2 augustus 2026"; r49/60 citeren oude statussen | zelfde header; citaten/snapshot bewust intact (het zijn historische quotes, geen levende claims) |

### Commit `cdf370c` — stale deadline in levend strategiedoc

| Locatie | Oud | Nieuw |
|---|---|---|
| `business/strategy/strategisch-implementatieplan.md:121` | "vóór **2 augustus 2026** (harde wettelijke deadline…)" | duale formulering: oorspronkelijk 2-8-2026, via Digital Omnibus naar verwachting **2 december 2027**, nog niet in het EU-Publicatieblad |

---

## 3. Voor jurist/FG — bewust NIET gewijzigd (juridisch bindende documenten of juridisch oordeel vereist)

1. **`business/nl-vo/compliance/algemene-voorwaarden-dgskills.md:393`** — "Docent-override functie — … technisch nog niet volledig geïmplementeerd (TODO in product)". Feitelijk achterhaald, maar corrigeren **versterkt een toezegging in een bindend contract** en raakt de scope van Art. 11.3 AV. Voorstel voor de jurist: *"…is technisch geïmplementeerd (docent kan STEP_COMPLETE-beoordelingen goedkeuren/terugdraaien, sinds 15 maart 2026); definitieve verwerking in de AV onder voorbehoud van juridische review."*
2. **`business/nl-vo/compliance/dpia-dgskills-compleet.md:529,639`** — Art. 14 "Gedeeltelijk **(docent-override nodig)**" en actie A06 "Open" zijn achterhaald (en intern strijdig met r407, die de override al als mitigatie telt). DPIA is juridisch bindend → voorstel: r529 "(docent-override geïmplementeerd 15-3-2026; training/monitoring te borgen)", r639 A06 → "Afgerond (15 mrt 2026)".
3. **`business/nl-vo/compliance/privacyverklaring-dgskills.md:219`** — "GDPR-compliant EU-datacenter" (over Zoho). Laag risico (beschrijft de subverwerker, niet DGSkills), maar het is het verboden woordpatroon in een bindend document → voorstel: "DPA; EU-datacenter (smtp.zoho.eu)".
4. **`risicoregister-ai-act.md` R15-herscoring** — W/I-score (5×3=15 HOOG) staat er nog met expliciete "herscoring nodig"-markering; formele herscoring is een risico-oordeel voor jurist/FG bij de eerstvolgende review.
5. **`eu-ai-act-conformiteitsplan.md` FASE 5–6-planning** — de W1–W4/GO-LIVE-fasering is op de oude augustus-2026-deadline gebouwd. Herijken van de planning op 2-12-2027 is een strategische/juridische beslissing (Yorin + jurist), geen tekstcorrectie.
6. **`business/nl-vo/compliance/legal-matrix.md`** — heeft een "Correctie 25-06-2026"-header maar géén historisch-label, terwijl de Art. 9–17-statustabel deels ouder is. Beslissing nodig: is dít het levende status-overzicht (dan bijwerken bij elke wijziging) of historisch (dan header)?
7. **`.env.production.template`** — bevat volgens de sweep 1× "Vertex" + 1× "Gemini" (vermoedelijk stale env-var-namen). De credential-beveiliging blokkeert geautomatiseerd lezen/schrijven van `.env*`-bestanden → **handmatig door Yorin controleren/opschonen**.

---

## 4. Beoordeeld en bewust ongewijzigd (OK of grensgeval)

| Locatie | Tekst | Oordeel |
|---|---|---|
| `supabase/functions/submitPilotRequest/index.ts:364,397` | FAQ-kop "Is DGSkills compliant met de EU AI Act?" | **OK** — een vráág is geen claim; het antwoord eronder is correct conditioneel ("werken aan aantoonbare documentatie…") |
| `public/guides/avg-compliance-school-software.md:1` | titel "AVG Compliance bij de inkoop van onderwijssoftware" | **OK** — generiek adviesartikel over inkoopcriteria, geen zelf-claim; body is conditioneel |
| `docs/compliance/ai-act-control-matrix.md` | "Needs Flow Test" (logging + human oversight) | **OK** — eerlijke verificatiestatus ("artefact bestaat ≠ getoetst"); de oversight-rij verwijst al naar "teacher override logs" |
| "AVG-ready dossier" — `PilotAanmelden.tsx:54,164,267,293`, `ScholenLandingContact.tsx:102`, `overdracht/03-pilot-propositie-school.md:22` | "AVG-ready dossier" / "Data binnen EU, AVG-ready" | **Grensgeval, aanbeveling** — beschrijft het dossier-artefact (bestaat), staat niet op de verboden lijst; strikter zou "AVG-dossier" of "AVG-bewust dossier" zijn. Beslissing Yorin; niet auto-gefixt (6 UI-plekken incl. SEO-meta) |
| `src/utils/aiContentMarker.ts:45` | JSDoc-voorbeeld `'gemini-pro'` | code-commentaar, geen claim; stale voorbeeldstring (cosmetisch) |
| `LAUNCH-PLAN.md:7,31,32,157` | Gemini als **ontwikkeltool** (analyse/codebase) | **OK** — dev-tooling, geen product-/verwerkersclaim |
| `eu-ai-act-conformiteitsplan.md:611,687`, `dpia:476`, `annex-iv:220` | noemen Vertex/Gemini om te zeggen dat het **historisch** is | **OK** — dit zijn juist de goede disclaimers (dpia:294 "ge**mini**maliseerde" = false positive) |
| Historisch gemarkeerde docs: `verwerkersovereenkomsten-rapport.md` (o.a. "gegarandeerd…zero data retention"), `audit-report.md`, `08-lanceringsrapport`, `09-juridisch-rapport` (o.a. "2 AUGUSTUS 2026"-kop) | dragen sinds 25-06 de "Historische status"-header | **OK** — conventie gerespecteerd; niet herschreven |
| `docs/compliance/regulations/AUDIT_RAPPORT_2026.md:11` | "Dataresidentie is nu gegarandeerd in de EU" | laag risico (gedateerd auditrapport, map is CI-uitgezonderd); strikter: "contractueel vastgelegd" — meenemen bij volgende revisie |
| `C-sub-verwerkerslijst-dgskills.md:104` | "EU-dataresidentie gegarandeerd bij gebruik van eu.zoho.com" | **OK** — conditioneel ("bij gebruik van") en contractueel onderbouwd |
| `reports/design-audit/*.json` | oude paginateksten in snapshots | gegenereerde artefacten, geen levende bron |
| `fg-dpo-adviesrapport.md:215` | "augustus 2026 voor sommige bepalingen" | **OK** — correct genuanceerd (Art. 50) |
| `docs/security/rapport-ai-cybersecurity-kwetsbaarheden.md:284` | "HIGH RISK EU AI Act" | **OK** — classificatie, geen conformiteitsclaim |
| `risicoregister-ai-act.md:197` (TM-15 output-filtering "NIET geimplementeerd") | `_shared/outputFilter.ts` bestaat en wordt op main geïmporteerd door chat/chatStream/demo-chat → status oogt stale, maar de **afdwinging** wordt juist gewijzigd in open PR #156 | **Report-only** — bijwerken zodra #156 landt (anders dubbel werk/conflict) |

---

## 5. In-flight PR's (niet gedupliceerd)

- **PR #152** (annex-iv, Art. 11): vult de Annex IV-TODO's en zet de Art. 14-rij op "Afgerond (15 mrt 2026)". → `annex-iv-technische-documentatie.md` is in deze sweep bewust NIET aangeraakt. **Advies: #152 reviewen en mergen** — het dicht de laatste Art. 14-drift in de docset.
- **PR #164** (draft "waiting room release", 155 bestanden, CONFLICTING, sinds 26-06 stil): bevatte een oudere versie van veel van deze claim-fixes; main heeft een deel al via andere PR's geabsorbeerd, en deze sweep dekt de rest. **Advies: rebasen en uitdunnen** — na deze PR resteert in #164 vooral de waiting-room-feature + checkscript-wijzigingen; de claim-diffs zijn grotendeels overbodig geworden.
- **PR #156** (moderated Mistral delivery): raakt outputFilter/moderation. → TM-15-status in het risicoregister pas daarna bijwerken.

## 6. Structurele aanbevelingen (niet uitgevoerd — scope)

1. **Guard-script-dekking**: `check-ai-provider-docs.mjs` scant `.claude/`, `docs/security/`, root-`.md`'s (ARCHITECTURE/LAUNCH-PLAN) en `business/strategy/` niet, en de regex mist markdown-onderbroken claims ("voldoet aan **AVG…**") en Engelse varianten ("GDPR-compliant"). Precies daar accumuleerde deze drift. Overweeg scope + patronen uit te breiden (aparte hardening-taak; regressierisico op false positives bewust afwegen).
2. **Drie kopieën `school-compliance-guide.html`** (business / public/compliance / public/dev-docs) divergeren structureel (v1.2/v1.3-mix, afwijkende secties). Consolideer naar één bron of genereer de kopieën.
3. **`public/dev-docs/`**: tracked legacy-bestanden in een `.gitignore`d + `.vercelignore`d map — verwarrend (deze sweep trapte er bijna in). Opruimen of de tracking-status expliciet documenteren.
4. Kleine na-loop bij volgende gelegenheid: `aiContentMarker.ts` JSDoc-voorbeeld, `AUDIT_RAPPORT_2026.md:11` "gegarandeerd".

## 7. Bewijs

- `npm run check:legal` groen op nulmeting, na elke claim-commit en finaal.
- `npx vite build` groen; nieuwe AiTransparency-copy aantoonbaar in bundle (`dist/assets/AiTransparency-*.js`).
- Afsluitende hergrep volledige patroonset: **geen onbehandelde kale claim** buiten (a) norm-/gate-documenten die de verboden patronen citeren (source-of-truth, jurist-check-skill, post-market-monitoring-plan, checkscript-regexes), (b) de jurist-lijst in §3, (c) historisch gemarkeerde documenten en gegenereerde artefacten (§4).
- Consistentie-greps per gewijzigde claim (doc-breed + zusterdocs conformiteitsplan ↔ risicoregister ↔ legal-matrix ↔ audits) uitgevoerd; resterende inconsistenties staan expliciet in §3.
