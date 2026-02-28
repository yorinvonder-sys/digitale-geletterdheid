# DGSkills Launch Plan — Deadline: Mei 2026

**Eigenaar:** Yorin (solo-founder, fulltime docent)
**Beschikbare tijd:** ~8-10 uur per week (avonden/weekenden)
**Startdatum:** 24 februari 2026
**Harde deadline:** Mei 2026 — scholen beslissen NU over tools voor 2026-2027
**Co-developers:** Claude (code + schrijven) · ChatGPT/Codex 5.3 (architectuur + autonoom) · Gemini (grote context + analyse)

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

## AI TOOLING STRATEGIE

Drie modellen, elk voor een ander type taak. Gebruik de router hieronder als geheugensteuntje.

| Model | Gebruik voor | Niet voor |
|-------|-------------|-----------|
| **Claude** (jij leest dit) | Frontend/React code, opdrachten schrijven, documenten reviewen, instructies opvolgen, privacy/security | Grote autonome refactors, abstracte architectuurkeuzes |
| **ChatGPT 5.3 Codex** | Autonome backend-taken (meerdere PRs tegelijk), architectuurkeuzes, brainstorm met geheugen over sessies, zakelijke documenten (pitch, AV, pricing) | UI-code (Claude beter), hoge-volume analyse (Gemini goedkoper) |
| **Gemini 2.5 Pro** | Hele codebase in één keer analyseren (1M token), marktonderzoek, video/audio verwerking, hoge-volume taken (goedkoopst) | Coding (significant zwakker), nuanced writing |

**Vuistregel:** Claude = standaard. Wissel alleen als de taak in de tabel hierboven duidelijk voor een ander model past.

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

## SPRINT 1 — "Opdrachten Perfectioneren (deel 1)" (1-8 mrt)

**Focus:** P1 — Het product kloppend maken
**Uren:** ~4-5 uur (1 werkweek, schoolreis 9-14 mrt)

| # | Taak | Tijd | Status | Model + taak |
|---|------|------|--------|-------------|
| 1.1 | Security fix: systemInstruction server-side valideren | 2u | ⬜ | **Claude** — code schrijven + deployen |
| 1.2 | Missie-review starten: jaar 1, periode 1+2 (prioriteit) | 3u | ⬜ | **Claude** — review-rapport per missie |

**Done wanneer:** Security fix live, eerste batch missies gereviewed.

---

## PAUZE — Schoolreis (9-14 mrt)

*Geen werk. Geniet van de reis.*

---

## SPRINT 2 — "Opdrachten Perfectioneren (deel 2)" (15-28 mrt)

**Focus:** P1 + begin P2 — Missies afronden + branding starten
**Uren:** ~10 uur

| # | Taak | Tijd | Status | Model + taak |
|---|------|------|--------|-------------|
| 2.1 | Missie-review afronden: jaar 1 periode 3+4, jaar 2+3 | 3u | ⬜ | **Claude** — review-rapport |
| 2.2 | Gap-analyse: welke SLO kerndoelen missen een missie? | 1u | ⬜ | **ChatGPT** — abstracte redenering + aanbeveling |
| 2.3 | Top-3 ontbrekende missies schrijven | 3u | ⬜ | **Claude** — missies schrijven (pakt schrijfstijl beter op) |
| 2.4 | Didactische onderbouwing schrijven (visie, leerlijnen) | 2u | ⬜ | **Claude** — concept + SLO-mapping check |
| 2.5 | Branding document: visie, missie, tone-of-voice | 1u | ⬜ | **Claude** — concept schrijven |

**Done wanneer:** Alle missies gereviewed, gaps gevuld, branding op papier.

---

## SPRINT 3 — "UI/UX + Bugs" (29 mrt - 11 apr)

**Focus:** P2 + P3 — Professionele uitstraling + bugs wegwerken
**Uren:** ~10 uur

| # | Taak | Tijd | Status | Model + taak |
|---|------|------|--------|-------------|
| 3.1 | UI consistency check: lab-* tokens, typografie, spacing | 2u | ⬜ | **Claude** — audit + fixes |
| 3.2 | Bug hunt: volledige flow doorlopen (login → missie → afronden) | 3u | ⬜ | **Claude** — testen + fixen |
| 3.3 | Lighthouse audit + top-5 performance issues fixen | 2u | ⬜ | **Claude** — audit + code fixes |
| 3.4 | Responsive check: mobiel, tablet, desktop | 1u | ⬜ | **Claude** — testen + fixen |
| 3.5 | Zakelijk: KvK, bank, BTW, verzekering, AV | 2u | ⬜ | **ChatGPT** — checklist + advies (geheugen over sessies) |

**Done wanneer:** Consistent design, Lighthouse >90, geen bekende bugs in core flow.

---

## SPRINT 4 — "Homepage + Dashboard" (12-25 apr)

**Focus:** P5 + P6 — Etalage + docentervaring
**Uren:** ~10 uur

| # | Taak | Tijd | Status | Model + taak |
|---|------|------|--------|-------------|
| 4.1 | Homepage: AI Chat Demo + Dashboard Demo secties afmaken | 2u | ⬜ | **Claude** — componenten bouwen |
| 4.2 | Homepage: conversie-optimalisatie (CTA, social proof) | 2u | ⬜ | **Claude** — copy + design |
| 4.3 | Homepage: SEO meta tags, alt texts, schema markup | 1u | ⬜ | **Claude** — SEO audit + fixes |
| 4.4 | Docentendashboard: UX vereenvoudigen (5-min onboarding) | 3u | ⬜ | **Claude** — redesign waar nodig |
| 4.5 | Docentendashboard: focus mode + groepen testen | 1u | ⬜ | **Claude** — testen + fixen |
| 4.6 | Pilotovereenkomst + pricing finaliseren | 2u | ⬜ | **ChatGPT** — juridische documenten + onderhandelingsadvies |

**Done wanneer:** Homepage verkoopt, dashboard is intuïtief, pricing staat.

---

## SPRINT 5 — "Go-to-Market" (26 apr - 9 mei)

**Focus:** Eerste klant(en) binnenhalen
**Uren:** ~8 uur

| # | Taak | Tijd | Status | Model + taak |
|---|------|------|--------|-------------|
| 5.1 | One-pager / pitch deck voor ICT-coördinatoren | 3u | ⬜ | **ChatGPT** — structuur + argumentatie; **Claude** — schrijfstijl + opmaak |
| 5.2 | Eigen school als eerste pilot voorstellen | 1u | ⬜ | **ChatGPT** — pitch strategie voorbereiden |
| 5.3 | 3-5 scholen in netwerk benaderen | 2u | ⬜ | **Claude** — outreach templates (schrijfstijl) |
| 5.4 | Compliance-hub pagina publiceren met alle docs | 1u | ⬜ | **Claude** — pagina updaten |
| 5.5 | Aanmelden bij Kennisgroep ICT (Kennisnet) | 1u | ⬜ | **Claude** — aanmelding voorbereiden |

**Done wanneer:** Minimaal 1 pilot getekend, 3+ scholen benaderd.

---

## SPRINT 6 — "Pilot Draaien" (mei - juni)

**Focus:** Uitvoeren en leren
**Uren:** ~6-8 uur/week

| # | Taak | Tijd | Status | Model + taak |
|---|------|------|--------|-------------|
| 6.1 | Onboarding flow voor docenten bouwen/testen | 4u | ⬜ | **Claude** — UX bouwen |
| 6.2 | Wekelijks feedback verzamelen | 1u/week | ⬜ | **Claude** — survey opstellen |
| 6.3 | Top-3 feedbackpunten per week verwerken | 3u/week | ⬜ | **Claude** (kleine fixes) · **ChatGPT Codex** (grote refactors) |
| 6.4 | KPI's bijhouden (gebruik, retentie, NPS) | 1u/week | ⬜ | **Gemini** — grote dataset-analyse; **Claude** — dashboard code |

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
Mrt 1 ─── Mrt 8    [9-14 SCHOOLREIS]    Mrt 15 ──── Mrt 28
 SPRINT 1                                 SPRINT 2
 Security + start                         Missies afronden
 missie-review                            + branding

Mrt 29 ──── Apr 11    Apr 12 ──── Apr 25    Apr 26 ──── Mei 9
 SPRINT 3               SPRINT 4              SPRINT 5
 UI/UX + Bugs           Homepage + Dashboard  Go-to-Market
 KvK/bank tussendoor    Etalage, docent-UX    Pitch, eerste klant

Mei ──── Juni                              Aug 2 ────
 SPRINT 6                                  AI ACT DEADLINE
 Pilot Draaien
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
