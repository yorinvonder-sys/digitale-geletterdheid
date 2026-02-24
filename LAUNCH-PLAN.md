# DGSkills Launch Plan — Stappenplan voor Marktlancering

**Eigenaar:** Yorin (solo-founder, fulltime docent)
**Beschikbare tijd:** ~8-10 uur per week (avonden/weekenden)
**Startdatum:** 24 februari 2026
**Doel:** Eerste betalende pilotschool(en) voor schooljaar 2026-2027
**Kritiek venster:** Scholen beslissen feb-mei over nieuwe tools voor volgend schooljaar

---

## STATUS: WAT IS AL GEDAAN

Deze zaken uit het juridisch rapport (09) zijn **al opgelost**:

- [x] CORS beperken op Edge Functions (whitelist dgskills.app)
- [x] Gemini Safety Settings (BLOCK_LOW_AND_ABOVE op alle categorieën)
- [x] Welzijnsprotocol in SYSTEM_INSTRUCTION_SUFFIX
- [x] DPIA volledig uitgevoerd (dpia-dgskills-compleet.md, 48.8 KB)
- [x] DPA Model 4.0 Privacyconvenant (A-E bijlagen compleet)
- [x] Verwerkingsregister opgesteld (verwerkingsregister.md)
- [x] Vertex AI migratie — data in EU (europe-west4, Nederland)
- [x] Privacyverklaring opgesteld (privacyverklaring-dgskills.md)
- [x] AI-transparantieverklaring op website (hoog-risico classificatie)
- [x] FG/DPO adviesrapport (fg-dpo-adviesrapport.md)
- [x] 40+ missies ontwikkeld met SLO Kerndoelen mapping

---

## SPRINT 0 — "Fundament" (Week 1-2: 24 feb - 9 mrt)

**Thema:** Juridische en zakelijke basis leggen
**Uren:** ~6-8 uur

| # | Taak | Tijd | Status |
|---|------|------|--------|
| 0.1 | KvK-inschrijving als eenmanszaak (online, SBI-code kiezen) | 2 uur | ⬜ |
| 0.2 | Zakelijke bankrekening openen | 1 uur | ⬜ |
| 0.3 | `[invullen]` placeholders in privacy-docs invullen (zodra KvK-nr bekend) | 1 uur | ⬜ |
| 0.4 | Beroepsaansprakelijkheidsverzekering (BAV) afsluiten | 2 uur | ⬜ |
| 0.5 | BTW-nummer activeren / kleine ondernemersregeling beoordelen | 1 uur | ⬜ |

**Claude helpt met:** SBI-code kiezen, banken vergelijken, BAV-opties, KOR-berekening

**Definition of Done:** KvK-nummer, bankrekening, BAV-polis, alle `[invullen]` in docs vervangen

---

## SPRINT 1 — "Contracten" (Week 3-4: 10-23 mrt)

**Thema:** Juridische documenten afronden
**Uren:** ~10-12 uur

| # | Taak | Tijd | Status |
|---|------|------|--------|
| 1.1 | Algemene Voorwaarden opstellen (NLdigital 2025 als basis) | 4 uur | ⬜ |
| 1.2 | Pilotovereenkomst juridisch formuleren | 3 uur | ⬜ |
| 1.3 | SLA aanvullen met uptime-garantie en credits | 2 uur | ⬜ |
| 1.4 | Datalekregister en -procedure operationeel maken | 1 uur | ⬜ |
| 1.5 | Alle juridische docs publiceren op compliance-hub pagina | 2 uur | ⬜ |

**Claude helpt met:** AV opstellen, pilotcontract formuleren, SLA-tekst, compliance-hub update

**Definition of Done:** Getekende AV, pilotovereenkomst template, werkend datalekregister

---

## SPRINT 2 — "Curriculum" (Week 5-6: 24 mrt - 6 apr)

**Thema:** Inhoud controleren en completeren
**Uren:** ~10-12 uur

| # | Taak | Tijd | Status |
|---|------|------|--------|
| 2.1 | Alle 40+ missies systematisch doorlopen op kwaliteit | 4 uur | ⬜ |
| 2.2 | Gap-analyse: welke SLO kerndoelen missen nog een missie? | 2 uur | ⬜ |
| 2.3 | Ontbrekende missies schrijven (max 3-5 prioriteit) | 4 uur | ⬜ |
| 2.4 | systemInstruction server-side valideren (security issue) | 2 uur | ⬜ |
| 2.5 | 2-3 leerlingen informeel laten testen + feedback noteren | 2 uur | ⬜ |

**Claude helpt met:** Missie-review, SLO gap-analyse, nieuwe missies schrijven, security fix

**Definition of Done:** Alle missies gereviewed, kritieke gaps gevuld, security fix live

---

## SPRINT 3 — "Technische Polish" (Week 7-8: 7-20 apr)

**Thema:** Website optimaliseren voor conversie en performance
**Uren:** ~10-12 uur

| # | Taak | Tijd | Status |
|---|------|------|--------|
| 3.1 | Lighthouse audit draaien + top-5 issues fixen | 3 uur | ⬜ |
| 3.2 | Homepage conversie-optimalisatie (CTA, social proof, flow) | 3 uur | ⬜ |
| 3.3 | SEO: meta tags, alt texts, interne links, schema markup checken | 2 uur | ⬜ |
| 3.4 | Frontend check: responsive, accessibility, broken links | 2 uur | ⬜ |
| 3.5 | Backend check: RLS policies, edge function error handling, logs | 2 uur | ⬜ |

**Claude helpt met:** Lighthouse analyse, code fixes, SEO audit, RLS check via Supabase MCP

**Definition of Done:** Lighthouse score >90, geen broken links, SEO basics compleet

---

## SPRINT 4 — "Go-to-Market" (Week 9-10: 21 apr - 4 mei)

**Thema:** Klanten werven
**Uren:** ~8-10 uur

| # | Taak | Tijd | Status |
|---|------|------|--------|
| 4.1 | Pricing finaliseren (pakketten, BTW-berekening voor scholen) | 2 uur | ⬜ |
| 4.2 | One-pager / pitch deck voor ICT-coördinatoren | 3 uur | ⬜ |
| 4.3 | Eigen school als eerste pilot voorstellen | 1 uur | ⬜ |
| 4.4 | 3-5 scholen in netwerk benaderen met concrete propositie | 2 uur | ⬜ |
| 4.5 | Aanmelden bij Kennisgroep ICT (Kennisnet) | 1 uur | ⬜ |

**Claude helpt met:** Pricing model, pitch deck content, outreach templates, positionering

**Definition of Done:** Pricing live, pitch deck klaar, minimaal 3 scholen benaderd

---

## SPRINT 5 — "Pilot Draaien" (Week 11-14: mei - juni)

**Thema:** Eerste pilot(s) uitvoeren en leren
**Uren:** ~6-8 uur/week

| # | Taak | Tijd | Status |
|---|------|------|--------|
| 5.1 | Pilotovereenkomst tekenen met 1-3 scholen | 2 uur | ⬜ |
| 5.2 | Onboarding flow voor docenten bouwen/testen | 4 uur | ⬜ |
| 5.3 | Wekelijks feedback verzamelen (korte survey) | 1 uur/week | ⬜ |
| 5.4 | Top-3 feedbackpunten per week verwerken | 3 uur/week | ⬜ |
| 5.5 | KPI dashboard bijhouden (gebruik, retentie, NPS) | 1 uur/week | ⬜ |

**Claude helpt met:** Onboarding UX, survey opstellen, data-analyse, iteraties

**Definition of Done:** Minimaal 1 actieve pilot met meetbare resultaten

---

## ACHTERGROND — Parallel (niet-urgent, geen deadline-druk)

Deze taken kun je tussendoor oppakken of in rustige weken:

| # | Taak | Deadline | Prioriteit |
|---|------|----------|------------|
| B.1 | AI Act: Risicobeheersysteem documenteren (Art. 9) | 2 aug 2026 | Hoog |
| B.2 | AI Act: Technische documentatie Annex IV (Art. 11) | 2 aug 2026 | Hoog |
| B.3 | AI Act: Registratie EU AI-database (Art. 49) | 2 aug 2026 | Hoog |
| B.4 | AI Act: Docent override voor STEP_COMPLETE (Art. 14) | 2 aug 2026 | Hoog |
| B.5 | Merknaam "DGSkills" registreren bij BOIP (€271) | Q3 2026 | Midden |
| B.6 | Cyberverzekering afsluiten | Q3 2026 | Midden |
| B.7 | Privacyconvenant Onderwijs aansluiting | Q3 2026 | Midden |
| B.8 | THIRD_PARTY_LICENSES.txt genereren | Q3 2026 | Laag |
| B.9 | Defensieve domeinnamen (dgskills.nl) | Q4 2026 | Laag |
| B.10 | BTW vooroverleg Belastingdienst (21% vs 9%) | Q2 2026 | Midden |

---

## CLAUDE TUTOR PROTOCOL

**Bij het begin van ELKE chat doet Claude het volgende:**

1. Check dit bestand (`LAUNCH-PLAN.md`) voor de huidige sprint en status
2. Rapporteer in 3 zinnen:
   - **Waar we zijn:** "We zitten in Sprint X — [thema]"
   - **Wat het doel is:** "Het doel van deze sessie is [concreet]"
   - **Waarom:** "Dit is belangrijk omdat [reden / deadline]"
3. Stel voor welke taak we nu oppakken
4. Aan het eind van de sessie:
   - Update de status in dit bestand (⬜ → ✅)
   - Vat samen wat er gedaan is
   - Benoem de volgende stap voor de volgende sessie

**Regels voor Claude als tutor:**
- Eén taak tegelijk. Niet springen.
- Als Yorin afdwaalt: vriendelijk terugsturen naar het plan.
- Geef aan het begin van elke taak een schatting: "Dit kost ~X minuten"
- Bij twijfel: vraag, niet aannemen.
- Vier kleine overwinningen. Elke afgeronde taak is vooruitgang.

---

## TIJDLIJN VISUEEL

```
Feb 24 ──── Mrt 9    Mrt 10 ──── Mrt 23    Mrt 24 ──── Apr 6
 SPRINT 0              SPRINT 1               SPRINT 2
 Fundament             Contracten             Curriculum
 KvK, bank, BAV        AV, pilot, SLA         Missies, QA

Apr 7 ──── Apr 20    Apr 21 ──── Mei 4      Mei ──── Juni
 SPRINT 3              SPRINT 4               SPRINT 5
 Tech Polish           Go-to-Market           Pilot Draaien
 Perf, SEO, check      Pricing, pitch         Eerste klant(en)

                                               Aug 2 ────
                                               AI ACT DEADLINE
                                               Art. 9, 11, 49
```

---

## BELANGRIJKE CONTEXT

**Inkoopvenster scholen:** Feb-Mei. Scholen beslissen NU over tools voor 2026-2027.
**Je oneerlijk voordeel:** Je bent zelf docent. Je kent de pijnpunten. Gebruik dat.
**Route naar klanten:** Direct aan scholen verkopen, niet via SIVON (dat is voor grote partijen).
**Eerste klant:** Je eigen school. Gebruik concrete resultaten als bewijs voor school #2 en #3.
**Netwerk:** Kennisgroep ICT (Kennisnet) = waar de ICT-coördinatoren zitten die over tooling beslissen.

---

*Dit plan is opgesteld op 24 februari 2026 en wordt door Claude bijgehouden als levend document.*
