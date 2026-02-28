# DGSkills Launch Plan — Deadline: Mei 2026

**Eigenaar:** Yorin (solo-founder, fulltime docent)
**Beschikbare tijd:** ~8-10 uur per week (avonden/weekenden)
**Startdatum:** 24 februari 2026
**Harde deadline:** Mei 2026 — scholen beslissen NU over tools voor 2026-2027
**Co-developer:** Claude

---

## PRIORITEITEN (in volgorde van belang)

| # | Prioriteit | Waarom |
|---|-----------|--------|
| P1 | Opdrachten: volledig, didactisch, veilig, onderbouwd | Dit IS het product. Zonder goede opdrachten is de rest zinloos. |
| P2 | UI/UX + branding + visie/missie | Eerste indruk telt. Alles moet professioneel en samenhangend aanvoelen. |
| P3 | Bug-vrij platform | Bugs bij leerlingen = vertrouwen kwijt bij docenten. |
| P4 | Zakelijk: KvK, bank, belasting, verzekering | Moet geregeld zijn zodat je eind 2026 geen belastingstress hebt. |
| P5 | Homepage: visueel + beleving van platform weergeven | De etalage. Moet ICT-coordinatoren en docenten overtuigen. |
| P6 | Docentendashboard: controle + eenvoud | Docenten moeten het in 5 minuten snappen. |

---

## STATUS: WAT IS AL GEDAAN

- [x] CORS beperken op Edge Functions (whitelist dgskills.app)
- [x] Gemini Safety Settings (BLOCK_LOW_AND_ABOVE op alle categorieën)
- [x] Welzijnsprotocol in SYSTEM_INSTRUCTION_SUFFIX
- [x] DPIA volledig uitgevoerd
- [x] DPA Model 4.0 Privacyconvenant (A-E bijlagen compleet)
- [x] Verwerkingsregister opgesteld
- [x] Vertex AI migratie — data in EU (europe-west4, Nederland)
- [x] Privacyverklaring opgesteld
- [x] AI-transparantieverklaring op website (hoog-risico classificatie)
- [x] FG/DPO adviesrapport
- [x] 94 missies ontwikkeld met SLO Kerndoelen mapping
- [x] Docentendashboard met 11 tabs (monitoring, gamificatie, SLO, etc.)
- [x] Homepage met lazy-loaded secties, SEO, JSON-LD
- [x] Avatar-systeem, XP/leveling, badges
- [x] Mobile-first responsive design

---

## SPRINT 1 — "Opdrachten Perfectioneren" (1-14 mrt)

**Focus:** P1 — Het product kloppend maken
**Uren:** ~10 uur

| # | Taak | Tijd | Status | Claude doet |
|---|------|------|--------|-------------|
| 1.1 | Alle 94 missies systematisch reviewen op kwaliteit | 4u | ⬜ | Review-rapport per missie |
| 1.2 | Didactische onderbouwing schrijven (visie, leerlijnen) | 2u | ⬜ | Concept + SLO-mapping check |
| 1.3 | Security fix: systemInstruction server-side valideren | 2u | ⬜ | Code schrijven + deployen |
| 1.4 | Gap-analyse: welke SLO kerndoelen missen een missie? | 1u | ⬜ | Analyse + aanbeveling |
| 1.5 | Top-3 ontbrekende missies schrijven | 3u | ⬜ | Missies schrijven |

**Done wanneer:** Elke missie heeft een kwaliteitsstempel, security fix live, gaps gevuld.

---

## SPRINT 2 — "UI/UX + Branding" (15-28 mrt)

**Focus:** P2 + P3 — Professionele uitstraling + bugs wegwerken
**Uren:** ~10 uur

| # | Taak | Tijd | Status | Claude doet |
|---|------|------|--------|-------------|
| 2.1 | Branding document: visie, missie, tone-of-voice, kleurenpalet | 2u | ⬜ | Concept schrijven |
| 2.2 | UI consistency check: alles lab-* tokens, typografie, spacing | 2u | ⬜ | Audit + fixes |
| 2.3 | Bug hunt: volledige flow doorlopen (login → missie → afronden) | 3u | ⬜ | Testen + fixen |
| 2.4 | Lighthouse audit + top-5 performance issues fixen | 2u | ⬜ | Audit + code fixes |
| 2.5 | Responsive check: mobiel, tablet, desktop | 1u | ⬜ | Testen + fixen |

**Done wanneer:** Consistent design, Lighthouse >90, geen bekende bugs in core flow.

---

## SPRINT 3 — "Zakelijk Fundament" (29 mrt - 11 apr)

**Focus:** P4 — Belasting en juridisch op orde
**Uren:** ~8 uur

| # | Taak | Tijd | Status | Claude doet |
|---|------|------|--------|-------------|
| 3.1 | KvK-inschrijving als eenmanszaak | 2u | ⬜ | SBI-code advies, checklist |
| 3.2 | Zakelijke bankrekening openen | 1u | ⬜ | Banken vergelijken |
| 3.3 | BTW-nummer + kleine ondernemersregeling beoordelen | 1u | ⬜ | KOR-berekening |
| 3.4 | Beroepsaansprakelijkheidsverzekering (BAV) | 1u | ⬜ | Opties vergelijken |
| 3.5 | `[invullen]` placeholders in privacy-docs invullen | 1u | ⬜ | Docs updaten |
| 3.6 | Algemene Voorwaarden opstellen | 2u | ⬜ | AV schrijven (NLdigital basis) |

**Done wanneer:** KvK-nr, bankrekening, BAV-polis, BTW-keuze gemaakt, AV klaar.

---

## SPRINT 4 — "Homepage + Dashboard" (12-25 apr)

**Focus:** P5 + P6 — Etalage + docentervaring
**Uren:** ~10 uur

| # | Taak | Tijd | Status | Claude doet |
|---|------|------|--------|-------------|
| 4.1 | Homepage: AI Chat Demo + Dashboard Demo secties afmaken | 2u | ⬜ | Componenten bouwen |
| 4.2 | Homepage: conversie-optimalisatie (CTA, social proof) | 2u | ⬜ | Copy + design |
| 4.3 | Homepage: SEO meta tags, alt texts, schema markup | 1u | ⬜ | SEO audit + fixes |
| 4.4 | Docentendashboard: UX vereenvoudigen (5-min onboarding) | 3u | ⬜ | Redesign waar nodig |
| 4.5 | Docentendashboard: focus mode + groepen testen | 1u | ⬜ | Testen + fixen |
| 4.6 | Pilotovereenkomst + pricing finaliseren | 2u | ⬜ | Documenten schrijven |

**Done wanneer:** Homepage verkoopt, dashboard is intuïtief, pricing staat.

---

## SPRINT 5 — "Go-to-Market" (26 apr - 9 mei)

**Focus:** Eerste klant(en) binnenhalen
**Uren:** ~8 uur

| # | Taak | Tijd | Status | Claude doet |
|---|------|------|--------|-------------|
| 5.1 | One-pager / pitch deck voor ICT-coördinatoren | 3u | ⬜ | Content + design |
| 5.2 | Eigen school als eerste pilot voorstellen | 1u | ⬜ | Pitch voorbereiden |
| 5.3 | 3-5 scholen in netwerk benaderen | 2u | ⬜ | Outreach templates |
| 5.4 | Compliance-hub pagina publiceren met alle docs | 1u | ⬜ | Pagina updaten |
| 5.5 | Aanmelden bij Kennisgroep ICT (Kennisnet) | 1u | ⬜ | Aanmelding voorbereiden |

**Done wanneer:** Minimaal 1 pilot getekend, 3+ scholen benaderd.

---

## SPRINT 6 — "Pilot Draaien" (mei - juni)

**Focus:** Uitvoeren en leren
**Uren:** ~6-8 uur/week

| # | Taak | Tijd | Status | Claude doet |
|---|------|------|--------|-------------|
| 6.1 | Onboarding flow voor docenten bouwen/testen | 4u | ⬜ | UX bouwen |
| 6.2 | Wekelijks feedback verzamelen | 1u/week | ⬜ | Survey opstellen |
| 6.3 | Top-3 feedbackpunten per week verwerken | 3u/week | ⬜ | Code fixes |
| 6.4 | KPI's bijhouden (gebruik, retentie, NPS) | 1u/week | ⬜ | Dashboard inrichten |

**Done wanneer:** Actieve pilot met meetbare resultaten.

---

## ACHTERGROND — Na mei (geen deadline-druk)

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

## TIJDLIJN VISUEEL

```
Mrt 1 ──── Mrt 14    Mrt 15 ──── Mrt 28    Mrt 29 ──── Apr 11
 SPRINT 1              SPRINT 2               SPRINT 3
 Opdrachten            UI/UX + Bugs           Zakelijk
 Review, security      Branding, polish       KvK, bank, AV

Apr 12 ──── Apr 25    Apr 26 ──── Mei 9      Mei ──── Juni
 SPRINT 4              SPRINT 5               SPRINT 6
 Homepage + Dashboard  Go-to-Market           Pilot Draaien
 Etalage, docent-UX    Pitch, eerste klant    Feedback, iteratie

                                               Aug 2 ────
                                               AI ACT DEADLINE
```

---

## CLAUDE TUTOR PROTOCOL

**Bij het begin van ELKE chat doet Claude het volgende:**

1. Check dit bestand voor de huidige sprint en status
2. Rapporteer in 3 zinnen:
   - **Waar we zijn:** "We zitten in Sprint X — [thema]"
   - **Wat het doel is:** "Het doel van deze sessie is [concreet]"
   - **Waarom:** "Dit is belangrijk omdat [reden / deadline]"
3. Stel voor welke taak we nu oppakken
4. Aan het eind van de sessie:
   - Update de status in dit bestand (⬜ → ✅)
   - Vat samen wat er gedaan is
   - Benoem de volgende stap

**Regels voor Claude als tutor:**
- Eén taak tegelijk. Niet springen.
- Als Yorin afdwaalt: vriendelijk terugsturen naar het plan.
- Geef aan het begin van elke taak een schatting: "Dit kost ~X minuten"
- Bij twijfel: vraag, niet aannemen.
- Vier kleine overwinningen. Elke afgeronde taak is vooruitgang.

---

## BELANGRIJKE CONTEXT

**Inkoopvenster scholen:** Feb-Mei. Scholen beslissen NU over tools voor 2026-2027.
**Je oneerlijk voordeel:** Je bent zelf docent. Je kent de pijnpunten. Gebruik dat.
**Route naar klanten:** Direct aan scholen verkopen, niet via SIVON.
**Eerste klant:** Je eigen school. Gebruik concrete resultaten als bewijs voor school #2 en #3.
**Netwerk:** Kennisgroep ICT (Kennisnet) = waar de ICT-coördinatoren zitten.

---

*Plan herschreven op 28 februari 2026 op basis van Yorin's prioriteiten. Wordt door Claude bijgehouden als levend document.*
