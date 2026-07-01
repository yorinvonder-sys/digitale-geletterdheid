# Strategisch implementatieplan DGSkills — breed beschikbaar maken

**Versie:** 1.0 · **Datum:** 16 juni 2026 · **Eigenaar:** Yorin (solo-founder) · **Status:** concept ter review
**Scope:** NL breed + buitenland gefaseerd
**Verhouding tot andere docs:** dit is de *strategische laag* bóven het operationele `LAUNCH-PLAN.md` (root) en de NL-verkoopkit in `business/nl-vo/`. Het beschrijft *waarheen en waarom* we verbreden; het herhaalt die documenten niet maar verwijst ernaar.

---

## 1. Samenvatting (mensentaal)

Het product is af genoeg en de Nederlandse verkoopaanpak (prijzen, pilots, sales-materiaal, compliance) is al grondig uitgewerkt. Maar er is nog geen plan voor de stap dáárna: hoe groeien we van losse, met de hand verkochte schoolpilots naar (1) een breed publiek in heel Nederland en (2) daarna het buitenland. Dit document beschrijft die route in drie horizonten: **eerst bewijzen in NL, dan verbreden in NL, dan gefaseerd naar het buitenland.** De grote hefboom voor "breed beschikbaar" is een **gratis, zelf-startende toegang** (nu kan een school alleen binnenkomen via een betaalde pilot met een verkoopgesprek). De grote rem op internationaal is dat **alles nu hardcoded Nederlands is** (vertaling/i18n moet nog volledig gebouwd worden). Onderaan staat een concrete lijst met wat er nog moet gebeuren.

---

## 2. Context & relatie tot bestaande documenten

Deze taak ("strategisch implementatieplan — breed beschikbaar maken, ook naar het buitenland") vult een echt gat. Veel bestaat al; dit document voegt de verbredings- en internationaliseringslaag toe.

| Wat bestaat al | Waar | Wat dit document toevoegt |
|---|---|---|
| Operationeel sprintplan tot mei 2026 | `LAUNCH-PLAN.md` | De strategische horizon eróver (2026–2027+) |
| NL go-to-market (concentrische cirkels, stopt bij "landelijk 2027") | `business/nl-vo/12-go-to-market-strategie.md` | Hoe je breder gaat dan de betaalde-pilot-funnel + buitenland |
| Prijzen, pakketten, pilot-playbook | `business/nl-vo/02-pricing-matrix.md`, `01-…`, `03-…` | Freemium-/gratis-toegang als extra instroomlaag |
| USP, messaging, branding | `business/nl-vo/07-…`, `branding-document.md` | Positionering die ook internationaal houdbaar is |
| Marketing-cadans (LinkedIn, content) | `business/nl-vo/10-marketing-campagne-strategie.md` | SEO-/content-autoriteit als verbredingsmotor |
| Compliance (DPIA, DPA, AI Act) | `business/nl-vo/compliance/` | Per-land regelgeving als internationale randvoorwaarde |

**Niet dupliceren:** waar dit plan NL-tactiek raakt, verwijst het naar bovenstaande bronnen.

---

## 3. Huidige staat (waar staan we nu)

- **Product is marktklaar genoeg.** 92+ missies (leerjaar 1–3), leerling- én docentdashboard, nulmeting + eindmeting, RLS/MFA/CSP, live op **`dgskills.app`** (Vercel + Supabase). Bron: `README.md`, `src/config/curriculum.ts`, `src/features/teacher/TeacherDashboard.tsx`, `src/features/assessment/escaperoom/`.
- **Instroom = één smal kanaal.** De enige echte on-ramp is een **betaalde pilot** (Pilot Start €1.500 / Pilot School €3.000, daarna jaarlicentie €4.900–€17.900 ex btw — `business/nl-vo/02-pricing-matrix.md`), founder-to-school verkocht. Dat is hoogwaardig maar arbeidsintensief en geplafonneerd op de bandbreedte van één founder (~8–10 u/week).
- **Gratis kennismaking bestaat al, maar is niet als groeimotor ingezet.** Demo-oppervlakken zonder login: `/leerlingdemo`, `/docentdemo`, `/speeltuin` (`src/features/public-site/demo/`). Vandaag dienen ze als verkoopondersteuning, niet als zelfstandig viraal/funnel-kanaal.
- **NL-SEO is sterk, maar 100% NL.** 25 routes in `public/sitemap.xml` (incl. SEO-landingspagina's `/digitale-geletterdheid-vo`, `/slo-kerndoelen-…`, 8× `/gids/*`, en concurrent-vergelijkingen `/vergelijking/dgskills-vs-digit-vo` en `-vs-basicly`). Allemaal `hreflang="nl"`.
- **Internationaal is technisch geblokkeerd.** i18n = 0: `index.html` heeft `lang="nl"` en `og:locale="nl_NL"`, hreflang alleen `nl`/`x-default`; alle UI-, missie- en Edge-Function-teksten zijn hardcoded Nederlands.

---

## 4. Strategische principes

1. **Bewijzen → verbreden → uitbreiden.** Geen brede of internationale uitrol vóór aantoonbaar NL-succes (getekende pilots → contracten). Volgorde is een keuze, geen toeval: elke horizon levert het bewijs dat de volgende financiert en geloofwaardig maakt.
2. **Gratis als wig.** "Breed beschikbaar" vraagt een instroom zónder verkoopgesprek en zónder kosten. Een gratis, zelf-startende laag schaalt los van de founder-bandbreedte; de betaalde laag blijft het verdienmodel.
3. **Docenten zijn het distributiekanaal.** De kernkracht is "de docent die het zelf gebruikt" (`branding-document.md`). Groei loopt via collega-docenten (peer-vertrouwen, mond-tot-mond), niet via advertentiebudget. Bescherm die geloofwaardigheid bij elke schaalstap.
4. **Laagste drempel eerst.** Zowel in NL (gratis vóór betaald) als internationaal (Nederlandstalig België vóór anderstalige markten). Defer kostbare randvoorwaarden (i18n, per-land curriculum) tot ze de eerstvolgende stap echt blokkeren.
5. **Eén founder, beperkte uren.** Elke keuze wordt gewogen tegen ~8–10 u/week. Dat bevoordeelt product-led groei (zelf-startend, gratis apps) en uitstel van zware trajecten tot er tractie/budget is.

---

## 5. Fasemodel — drie horizonten

| Horizon | Periode (richting) | Doel | Leunt op |
|---|---|---|---|
| **H1 — NL diepte** | nu → mei 2026 | Eerste 3–5 betaalde pilots → eerste contracten | `LAUNCH-PLAN.md`, `business/nl-vo/12-…`, `00-niche-definition-first-3-pilots.md` |
| **H2 — NL breedte** | 2026 → 2027 | Van founder-verkoop naar breed bereik: gratis zelf-start, standalone missie-apps, docent-community, content-autoriteit, naamsbekendheid | demo-routes + standalone-apps-visie (net-nieuw uitgewerkt) |
| **H3 — Internationaal** | 2027+ (trigger-gestuurd) | Gefaseerd buitenland, beginnend bij Nederlandstalig België | i18n als voorwaarde (net-nieuw) |

> Horizonten zijn **trigger-gestuurd**, niet kalender-vast: H2 start zodra H1 minstens 2 betaalde contracten oplevert; H3-anderstalig start zodra i18n staat én er ≥1 Vlaamse referentie is.

---

## 6. Horizon 2 uitgewerkt — NL breedte

Doel: het bereik losmaken van de founder-bandbreedte. Zes samenhangende zetten.

1. **Gratis zelf-startende laag (kern).** Een docent kan zonder verkoopgesprek een account maken en met een klas starten op een **beperkte set missies**. Product-led groei bovenop de bestaande founder-led verkoop. Conversie naar betaald wanneer de school het volledige curriculum, het docentdashboard en SLO-rapportage wil.
2. **Standalone gratis missie-apps.** Verpak de sterkste "groene" missies (nu al toonbaar via `/speeltuin`, `/leerlingdemo`) als gratis, deelbare mini-apps zonder login. Direct bruikbaar in de klas, deelbaar op social, en SEO-vindbaar. Funnel: gratis app → "wil je dit voor je hele klas mét voortgang en bewijs?" → docent-aanmelding → schoolpilot.
3. **Docent-community & mond-tot-mond-lus.** Maak het delen makkelijk (kant-en-klaar lesmateriaal, verwijslink-mechaniek) en bouw een lichte community (bestaande LinkedIn-cadans uit `10-marketing-campagne-strategie.md` als kern). Doel: collega's halen collega's binnen.
4. **Content-/SEO-autoriteit.** De NL-SEO-basis (`/gids/*`, SLO- en AI-Act-pagina's) is sterk; houd een vaste publicatiecadans aan rond verplichte thema's (SLO-kerndoelen, EU AI Act). Dit compoundt en levert gratis instroom.
5. **Nieuwsbrief / lead-nurture (gat).** Er is nu **geen** nieuwsbriefinschrijving. Veel bezoekers zijn nog niet pilot-klaar maar wel geïnteresseerd; vang die en voed ze tot het inkoopvenster (feb–mei) opent.
6. **Naamsbekendheid.** Conferenties (Kennisnet, NOT 2027), pers en kanaalpartners (Kennisnet, SIVON). Sequenceer dit ná de gratis-laag, zodat instroom ergens op landt.

**Strategische guard — kannibalisatie.** De gratis laag mag de jaarlicentie (€4.900+) niet ondermijnen. Trek de lijn bewust: **gratis = individuele docent, beperkte missieset, géén docentdashboard / SLO-rapportage / assessment / compliance-pakket**; **betaald = schoolbreed mét bewijsvoering, rapportage en compliance.** Precies de zaken waarvoor scholen betalen, blijven achter de betaalmuur.

---

## 7. Horizon 3 uitgewerkt — internationaal (gefaseerd)

**Beachhead-logica: laagste drempel eerst.**

| Fase | Markt | Waarom (volgorde) | Grootste horde |
|---|---|---|---|
| 3a | **Vlaanderen (BE)** | Nederlandstalig → **geen i18n nodig**; content vrijwel herbruikbaar; EU/GDPR geldt al | Curriculum-mapping naar Vlaamse eindtermen (digitale competenties); lokale referentie nodig |
| 3b | **Engelstalig (UK/IE + internationale scholen)** | Engels = hoogste hefboom; ontsluit óók internationale scholen wereldwijd | Vereist i18n (Engels); eigen curriculum (UK Computing) |
| 3c | **Duitstalig (DE + Duitstalig België)** | Grote markt | i18n (Duits) + curriculum-mapping (KMK/Bildungsstandards); zwaarder |
| 3d | **VS** | Groot, maar ander regime | FERPA/COPPA, andere financiering, data-residency — bewust laat |

**Per-land afhankelijkheden (vast sjabloon bij elke nieuwe markt):**
1. **Taal/i18n** — alleen BE (3a) ontwijkt dit; al het andere is geblokkeerd tot i18n staat (zie §8).
2. **Curriculum-mapping** — de SLO-kerndoelkoppeling is NL-specifiek. Elk land heeft eigen standaarden; dit is **inhoudelijk werk, niet alleen vertalen**, en vaak de échte kostenpost.
3. **Regelgeving** — EU (BE/DE) = GDPR, grotendeels gedekt door bestaande compliance (`business/nl-vo/compliance/`); VS = FERPA/COPPA + data-residency; check per land op datalocatie-eisen.
4. **Gelokaliseerde SEO/messaging + lokaal bewijs** — scholen vertrouwen lokale referenties; per markt eigen landingspagina's, hreflang en testimonials.
5. **Operationeel** — facturatie/btw/entiteit per land, support-tijdzone, betaalmethoden.

> Kernscheiding: **3a (Vlaanderen) kan vrijwel direct ná NL-bewijs starten** (geen i18n). Alles daarná wacht op het i18n-traject. i18n is dus de poort tussen "Nederlandstalige uitbreiding" en "echt internationaal".

---

## 8. Internationale opstap — i18n & lokalisatie (de bindende randvoorwaarde)

Dit is **géén implementatie-opdracht hier** — het wordt een eigen toekomstige taak. Alleen de hoofdlijn en de omvang.

**Wat het traject omvat (hoofdlijn):**
- i18n-framework introduceren (voor React is `react-i18next` de standaard) en alle hardcoded strings naar berichtcatalogi extraheren.
- Locale-routing: taalprefix in routes, dynamische `lang`, `hreflang` en `og:locale`, per-locale `sitemap.xml`.
- Server-side teksten in de Supabase Edge Functions (bv. formulierbevestigingen) lokaliseren.
- **De grootste vertaaloppervlakte: de 92+ missies.** Elke missie heeft een AI-`systemInstruction` van 500+ woorden (`src/config/agents/`). Dat — niet de UI — bepaalt de omvang.

**Omvangsindicatie:** groot traject, grove orde **€15.000–€25.000** voor een volwaardig tweetalig (NL + Engels) systeem inclusief vertaalbeheer. **Faseerbaar:** begin met UI + een **kern-set missies** voor de eerste anderstalige beachhead; vertaal de rest incrementeel. Dit is precies waarom Vlaanderen (3a, Nederlandstalig) als eerste internationale stap zoveel goedkoper is.

---

## 9. Wat moet er nog gebeuren (gap-analyse + actielijst)

Geclusterd per horizon. Dit is de kern van de opdracht: concrete, uitvoerbare stappen.

### Cross-cutting — blokkeert alles (nu)
- [ ] **Juridische basis afronden:** KvK-inschrijving, zakelijke rekening, btw-administratie (open in `LAUNCH-PLAN.md`). Zonder dit geen facturatie/contract.
- [ ] **EU AI Act hoog-risico-documentatie compleet** ruim vóór de toepassingsdatum voor Annex III-onderwijs — oorspronkelijk 2 augustus 2026, via de Digital Omnibus naar verwachting **2 december 2027**, nog niet gepubliceerd in het EU-Publicatieblad (`business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md`).

### H1 — NL diepte (nu → mei 2026): uitvoeren, niet opnieuw bedenken
- [ ] Eigen school als showcase activeren; 3–5 netwerkscholen selecteren en persoonlijk benaderen (templates bestaan in `10-marketing-campagne-strategie.md`).
- [ ] Eerste pilots draaien volgens `03-pilot-cohort-playbook.md`; conversie naar contract via de "2 van 3"-beslisregel (`00-niche-definition-first-3-pilots.md`).

### H2 — NL breedte (start bij ≥2 contracten)
- [ ] **Beslis de gratis-vs-betaald-featurelijn** (welke missies/functies gratis, wat achter de betaalmuur). Eerste, goedkoopste stap — stuurt al het andere.
- [ ] **Gratis zelf-startende docentlaag** bouwen (account + beperkte missieset, geen sales-gesprek).
- [ ] **Standalone gratis missie-apps** verpakken uit de `/speeltuin`-set (deelbaar, geen login) + funnel-CTA naar schoolaanmelding.
- [ ] **Nieuwsbrief/lead-capture** opzetten (ontbreekt nu volledig).
- [ ] **Verwijs-/community-lus** voor docenten; vaste content-/SEO-cadans vasthouden.

### H3 — Internationaal (trigger-gestuurd)
- [ ] **Vlaanderen-verkenning** (kan zonder i18n): mapping naar Vlaamse eindtermen + 1–2 pilotscholen BE.
- [ ] **i18n-architectuur als apart traject** opzetten (de poort naar anderstalig; §8).
- [ ] **Per-markt regelgeving + curriculum-mapping** uitwerken volgens het sjabloon in §7.
- [ ] **Gelokaliseerde SEO/messaging** + lokaal bewijs per markt.

> Voorstel (apart te bevestigen): de H2/H3-items als losse backlog-taken op het Notion-bord zetten zodra dit document is goedgekeurd.

---

## 10. Risico's & afhankelijkheden

| Risico / afhankelijkheid | Impact | Mitigatie |
|---|---|---|
| **Founder-bandbreedte (~8–10 u/wk)** | Beperkt alles | Product-led keuzes (zelf-start, gratis apps) i.p.v. high-touch; lage-drempel-beachhead BE |
| **AI Act-toepassingsdatum (Annex III-onderwijs)** | Wettelijk; blokkeert verkoop bij niet-naleving | Documentatie afronden ruim vóór de toepassingsdatum — naar verwachting 2 dec 2027 (Digital Omnibus, nog niet gepubliceerd) |
| **i18n-kosten €15–25k** | Blokkeert anderstalig | Vlaanderen eerst (geen i18n); daarna gefaseerd, kern-missies eerst |
| **Curriculum-mapping per land** | Verborgen kostenpost (inhoud, niet vertaling) | Per-markt sjabloon §7; pas committen na bewezen vraag |
| **Freemium-kannibalisatie** | Ondermijnt licentie-omzet | Strikte gratis-vs-betaald-featurelijn (§6) |
| **NL-concurrentie (DigIT-VO, Basicly)** | Verzadiging thuismarkt | Founder-led differentiatie + bestaande vergelijkpagina's aanscherpen |

---

## 11. Meetpunten per horizon

- **H1 (diepte):** 3–5 pilots gestart; ≥2 conversies naar contract. KPI-definities hergebruiken uit `business/nl-vo/03-pilot-cohort-playbook.md` en `05-weekly-kpi-dashboard-rhythm.md`.
- **H2 (breedte):** aantal zelf-start-aanmeldingen; gebruik van gratis missie-apps; **gratis → betaald conversieratio**; nieuwsbrief-omvang; groei organisch verkeer; verwijscoëfficiënt (hoeveel docenten halen nieuwe docenten).
- **H3 (internationaal):** eerste Vlaamse pilot getekend; i18n-traject opgeleverd; eerste anderstalige aanmelding; gelokaliseerd organisch verkeer per markt.

---

*Dit document is de strategische kapstok. Operationele uitvoering loopt via `LAUNCH-PLAN.md` en de NL-kit in `business/nl-vo/`; technische trajecten (i18n, gratis laag) worden aparte taken.*
