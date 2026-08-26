# Homepage-ontwerpkader en audit — DGSkills

**Datum:** 26 augustus 2026
**Geauditeerde code:** `origin/main` (commit-staat van 26-08-2026) + de live site `https://dgskills.app/`
**Scope:** alleen onderzoek, audit en dit naslagdocument. Er is geen code gewijzigd.

## In één alinea

De homepage van DGSkills is sinds de laatste herbouw de **verhaalpagina** (`src/features/public-site/verhaal/`),
niet meer `ScholenLanding`. Inhoudelijk is die pagina sterk: er staat binnen één scherm wat het
product is, voor wie, wat leerlingen doen en wat de docent eraan heeft — precies wat onderzoek
voorschrijft. De problemen zitten er *omheen*: voor een bezoeker zonder JavaScript — en dat zijn
vrijwel alle AI-crawlers — is de pagina zo goed als leeg; de tweede knop in de hero (`/pilot`) geeft
een 404; en er wordt op de homepage vrijwel niets gemeten, waardoor geen enkele toekomstige
wijziging te toetsen valt. Verderop staat een vast kader met 12 toetsbare principes, zodat elke
volgende wijziging aan bewijs kan worden gehouden in plaats van aan smaak.

## Leeswijzer: hoe zeker is een uitspraak?

Elke aanbeveling in dit document draagt één van drie labels. Dat is nodig omdat een deel van dit
vakgebied (vooral het AI-zoekgedeelte) nog nauwelijks wetenschappelijk gefundeerd is.

| Label | Betekenis |
|---|---|
| **[BEWEZEN]** | Onderbouwd met gepubliceerd gebruikersonderzoek, een peer-reviewed paper, officiële documentatie van de leverancier, of een meting die in deze audit zelf is gedaan. |
| **[PLAUSIBEL]** | Breed waargenomen in de praktijk en consistent met meerdere onafhankelijke bronnen, maar zonder gecontroleerd onderzoek. Redelijk om op te bouwen; niet als zekerheid presenteren. |
| **[SPECULATIEF]** | Wordt als "best practice" verkocht, maar het bewijs ontbreekt of spreekt het tegen. Niet in tijd investeren zonder eigen meting. |

---

# Deel 1 — Wat het onderzoek zegt

## 1.1 De eerste seconden en hoe mensen scannen

**[BEWEZEN] Je hebt ongeveer 10 seconden om te vertellen wat dit is.** Bezoekers verlaten pagina's
vaak binnen 10–20 seconden; de kans om te vertrekken is in de eerste seconden het hoogst en wordt
pas na ongeveer 30 seconden vlak. Wie meerdere minuten aandacht wil, moet de waardepropositie
binnen die eerste 10 seconden duidelijk hebben gemaakt.
Bron: [NN/g — How Long Do Users Stay on Web Pages?](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/)

**[BEWEZEN] Mensen lezen niet, ze scannen — en ze scannen vooral koppen.** Eyetracking-onderzoek
onderscheidt vier scanpatronen: F-patroon, spotted, layer-cake en commitment. Het **layer-cake**-patroon
(alleen koppen en tussenkoppen lezen, met af en toe een blik in de lopende tekst) is na
woord-voor-woord lezen de meest effectieve manier om te vinden wat je zoekt. Praktische consequentie:
*wie alleen jouw koppen leest, moet het hele verhaal al hebben.*
Bronnen: [NN/g — Text Scanning Patterns](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/) ·
[NN/g — The Layer-Cake Pattern](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) ·
[NN/g — F-Shaped Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)

*Kanttekening:* het F-patroon wordt vaak als ontwerpwet aangehaald, maar NN/g zelf noemt het
"misunderstood": het is een *symptoom* van slecht opgemaakte tekst, geen indeling om naar te
ontwerpen. Goede koppen, tussenkoppen en opsommingen dúwen mensen juist naar het layer-cake-patroon.
Ontwerp dus niet "in een F" — ontwerp koppen die op zichzelf informatie dragen.

**[BEWEZEN] Boven de vouw krijgt ~80% van de aandacht, ook al scrollen mensen wél.** De vouw is niet
dood: bezoekers besteden ongeveer 80% van hun kijktijd boven de vouw en 20% eronder. Dat betekent
niet "alles boven de vouw proppen", maar wel: de belangrijkste boodschap en het eerste bewijs staan
daar, en de rand van het scherm moet zichtbaar maken dat er meer volgt.
Bron: [NN/g — Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)

**[BEWEZEN] Scrolljacking (het scrollgedrag overnemen) veroorzaakt meer problemen dan het oplost.**
In NN/g-onderzoek was de meerderheid van de deelnemers minstens licht gedesoriënteerd; sommigen
dachten dat de pagina kapot was en probeerden te verversen of weg te navigeren. Het werkt het
slechtst bij taakgerichte bezoekers, op mobiel, en wanneer er véél tekst in de vastgezette sectie
staat. Het werkt het minst slecht als het kort is, ver onder de vouw staat, weinig tekst bevat en de
scrollrichting niet verandert.
Bron: [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) ·
[NN/g — What Parallax Lacks](https://www.nngroup.com/articles/parallax-usability/)

**[BEWEZEN] Vertrouwen ontstaat uit vier dingen.** Nielsens vier factoren zijn na 25 jaar stabiel
gebleken: (1) ontwerpkwaliteit, (2) *up-front disclosure* — meteen open zijn over wat iets kost,
wie je bent en wat de voorwaarden zijn, (3) volledige en actuele inhoud, en (4) verbondenheid met de
rest van het web. Contactgegevens en bedrijfsinformatie hóren zichtbaar te zijn, niet weggestopt.
Bronnen: [NN/g — Trustworthiness in Web Design](https://www.nngroup.com/articles/trustworthy-design/) ·
[NN/g — Communicating Trustworthiness](https://www.nngroup.com/articles/communicating-trustworthiness/)

**[BEWEZEN] Minder formuliervelden = betere afronding, en markeer verplichte velden.** Baymard vindt
een directe correlatie tussen het aantal velden dat een bezoeker moet *overwegen* en de
UX-prestatie. Verder: verplichte velden niet markeren leidt aantoonbaar tot meer invulfouten en
langere invultijd — en formulieren die de *verplichte* velden markeerden presteerden beter dan
formulieren die alleen de optionele markeerden.
Bronnen: [Baymard — Minimize Form Fields](https://baymard.com/blog/checkout-flow-average-form-fields) ·
[Baymard — Required vs. Optional Fields](https://baymard.com/blog/required-optional-form-fields)

## 1.2 Waarom B2B/B2G anders is dan webshop-CRO

**[BEWEZEN] De koper is al bijna klaar voordat hij contact opneemt.** Gartner meet dat B2B-kopers
slechts ~17% van hun tijd besteden aan gesprekken met leveranciers; vergelijkt een koper meerdere
partijen, dan blijft er per leverancier maar een paar procent van de totale tijd over. De koopreis
is bovendien niet lineair maar een lus door zes "koopklussen" (probleem vaststellen, oplossingen
verkennen, eisen opstellen, leverancier kiezen, valideren, consensus maken).
Bron: [Gartner — The B2B Buying Journey](https://www.gartner.com/en/sales/insights/b2b-buying-journey)

**[BEWEZEN] Kopers willen liefst zonder verkoper kunnen beslissen.** In Gartners salesonderzoek geeft
67% van de B2B-kopers de voorkeur aan een aankoopervaring zonder vertegenwoordiger (2026; 61% in de
meting van 2025).
Bron: [Gartner — 67% of B2B Buyers Prefer a Rep-Free Experience (maart 2026)](https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience)

**[PLAUSIBEL] Er beslist geen persoon maar een groep, en die groep leest apart.** Meerdere
marktonderzoeken (Gartner, Forrester) komen uit op 6–11 betrokkenen per aankoop, die elk zelfstandig
materiaal verzamelen en dat later met elkaar delen. Voor een school betekent dat concreet: docent,
teamleider/schoolleider, ICT-coördinator en soms een FG of inkoper, die de site *los van elkaar*
bezoeken.
Bron: [Bret Starr / The Starr Conspiracy — B2B buyer journey statistics](https://www.thestarrconspiracy.com/insights/qa/b2b-buyer-journey-statistics)
(samenvatting van Gartner- en Forrester-cijfers; het onderliggende onderzoek zit achter een betaalmuur,
vandaar het label plausibel in plaats van bewezen)

**Wat dit betekent voor het ontwerp — de belangrijkste afwijking van webshop-CRO:**
een webshop optimaliseert op *impuls binnen één sessie en één persoon*. Een schoolsite optimaliseert
op *materiaal dat een bezoeker kan meenemen naar een collega die er niet bij was*. Urgentietrucs
(aftellende timers, "nog 3 plekken"), sociale-bewijsvormen zonder naam ("500+ tevreden gebruikers") en
frictie-verlaging ten koste van informatie werken hier averechts: ze verlagen precies het
vertrouwen dat je nodig hebt bij een aankoop die maanden duurt en langs een privacyfunctionaris gaat.
De juiste "conversie" op een homepage voor VO/VSO is niet een klik, maar **een bezoeker die een
document, demo of link heeft waarmee hij intern het gesprek kan openen.**

## 1.3 SEO in 2026

**[BEWEZEN] Core Web Vitals-drempels.** Goed = LCP onder 2,5 s, INP onder 200 ms, CLS onder 0,1 —
gemeten op het 75e percentiel van échte bezoeken (niet op een labtest). Deze drie zitten in het
page-experience-signaal van Google Search.
Bronnen: [web.dev — Web Vitals](https://web.dev/articles/vitals) ·
[Google — Understanding Core Web Vitals and Google Search results](https://developers.google.com/search/docs/appearance/core-web-vitals)

**[BEWEZEN] Van E-E-A-T is de T het zwaarst.** Google's kwaliteitsrichtlijnen (versie september 2025)
stellen letterlijk dat Trust het belangrijkste lid van de familie is: een niet-betrouwbare pagina
heeft lage E-E-A-T, hoe ervaren, deskundig of gezaghebbend hij verder ook lijkt. De extra "E" van
Experience beloont expliciet aantoonbare eigen ervaring — voor DGSkills is "gebouwd door een docent
die het zelf in de klas gebruikt" dus geen marketingzin maar een rankingrelevant signaal, *mits het
verifieerbaar op de site staat*.
Bronnen: [Google — Search Quality Rater Guidelines (sept. 2025, PDF)](https://www.google.com/insidesearch/howsearchworks/assets/searchqualityevaluatorguidelines.pdf) ·
[Google Search Central — E-A-T krijgt een extra E](https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t)

## 1.4 GEO/AEO — zichtbaarheid in AI-antwoorden

Dit is het minst gevestigde deel. Onderstaande volgorde is bewust: van hard bewijs naar hype.

**[BEWEZEN] AI-crawlers voeren geen JavaScript uit.** Vercel analyseerde bijna een miljard
crawlerverzoeken over het eigen netwerk: GPTBot (OpenAI) en ClaudeBot (Anthropic) *halen*
JavaScript-bestanden wel op (11,5% resp. 23,8% van hun verzoeken), maar **voeren ze niet uit**. Ze
zien alleen de HTML die de server direct teruggeeft. Googlebot is de enige grote crawler die wél
volledig rendert. Gevolg: een pagina kan prima in Google staan en tegelijk volledig onzichtbaar zijn
in ChatGPT, Claude en Perplexity.
Bron: [Vercel — The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler) ·
[Vercel — How we're adapting SEO for LLMs and AI search](https://vercel.com/blog/how-were-adapting-seo-for-llms-and-ai-search)

**[BEWEZEN] Wat wél helpt in AI-antwoorden: citaten, cijfers en bronvermelding — niet trefwoorden.**
Het GEO-onderzoek (Princeton/Georgia Tech, gepubliceerd op ACM SIGKDD 2024) testte negen
bewerkingsstrategieën op een benchmark van diverse zoekopdrachten. De beste methoden —
**statistieken toevoegen, citaten uit geloofwaardige bronnen opnemen, en bronnen vermelden** —
verbeterden de zichtbaarheid met tot 41% op de ene maat en 28% op de andere. **Keyword stuffing, de
klassieke SEO-truc, presteerde juist slecht.** De auteurs benadrukken zelf dat het effect per domein
verschilt en dat generatieve zoekmachines een snel bewegende zwarte doos zijn.
Bron: [Aggarwal e.a. — GEO: Generative Engine Optimization, arXiv:2311.09735](https://arxiv.org/abs/2311.09735) ·
[ACM SIGKDD 2024](https://dl.acm.org/doi/abs/10.1145/3637528.3671900)

**[SPECULATIEF — niet doen] `llms.txt`.** Dit bestand wordt breed als GEO-best-practice verkocht,
maar het bewijs wijst de andere kant op. Google's John Mueller (2 juni 2026): *"it's purely
speculative for now (the file has existed for years, yet none of the AI systems use it)"*. Google's
eigen documentatie stelt dat het bestand geen enkel effect heeft op Search of AI Overviews. Geen
enkele grote AI-aanbieder (OpenAI, Anthropic, Google, Meta, Mistral) heeft publiek bevestigd het te
gebruiken; een Ahrefs-analyse van 137.000 sites vond dat 97% van de `llms.txt`-bestanden in mei 2026
nul verkeer kreeg. **Advies: niet bouwen.** Steek die tijd in server-gerenderde HTML — dat is het
probleem dat `llms.txt` zógenaamd oplost, en dat aantoonbaar wél bestaat.
Bronnen: [Search Engine Journal — Google Confirms LLMs.txt Has No Current Implementation](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/) ·
[Search Engine Roundtable — Google Search Team Does Not Endorse LLMs.txt](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html)

**[PLAUSIBEL, maar overdreven verkocht] Schema.org / structured data voor AI-zichtbaarheid.**
Marketingbronnen claimen forse effecten ("3,4× vaker geciteerd", "50% meer zichtbaarheid"). Dat zijn
**correlaties uit kleine, niet-gecontroleerde steekproeven van commerciële partijen**, geen
experimenten — sites met goede schema-opmaak zijn doorgaans ook overigens beter onderhouden. Google
zelf stelt (juni 2026) dat structured data *niet vereist* is voor generatieve AI-zoekresultaten en
dat er geen speciale markup voor bestaat. Toch is het de moeite waard: correct `Organization`- en
`FAQPage`-markup is goedkoop, maakt je entiteit ondubbelzinnig, en is sowieso nodig voor gewone SEO.
Behandel het als hygiëne, niet als hefboom.
Bron (voor de claims én de nuance): [SE Ranking/overzicht via Globerunner — Structured Data in 2026](https://globerunner.com/structured-data-schema-markup-ai-2026/)

---

# Deel 2 — Audit van de huidige homepage

**Wat is "de homepage"?** In `src/app/AppRouter.tsx` wordt `/` afgehandeld door `PublicRoute story`,
wat de **`VerhaalPage`** rendert. `ScholenLanding` zit op `/scholen`. Dezelfde `VerhaalPage` staat
óók op `/verhaal`, met een andere titel.

De secties in volgorde: Proloog (hero) → Film (alleen op verzoek) → Probleem → Ontmoeting → MilaReis
→ NuJij → Marquee → Docent → Bewijs (incl. EchtProduct + FAQ) → Epiloog (incl. pilotformulier + footer).

**Wat goed zit** — voordat de knelpunten komen: de Proloog doet exact wat 1.1 voorschrijft. Doelgroep
(pill "VO & VSO"), categorie (kop), belofte voor leerling én docent (subtekst), twee heldere acties,
drie bewijspunten en een productblok met wat leerlingen máken — allemaal binnen het eerste scherm.
De code-commentaren laten bovendien zien dat claims bewust zijn ingeperkt ("bewust geen dekkings-,
AVG- of AI Act-claims: die zijn niet bewijsbaar op een publieke pagina"). Dat is precies de
juiste reflex voor deze markt.

## Knelpunt 1 — Voor AI-crawlers is de homepage vrijwel leeg — **HOOG**

**Locatie:** `scripts/prerender.mjs` (regels ~200–255) in combinatie met `src/app/AppRouter.tsx`.

**Wat er aan de hand is.** Het prerender-script vervangt na de build alleen **meta-tags** in de
`<head>` — titel, description, canonical, Open Graph. Het rendert de *inhoud* van de pagina niet.
Alles wat de bezoeker leest, wordt pas door JavaScript in de browser opgebouwd.

**Meting (in deze audit gedaan, 26-08-2026).** De rauwe HTML van `https://dgskills.app/`, opgehaald
zonder JavaScript uit te voeren, is 10.789 bytes en bevat **197 tekens zichtbare bodytekst**:
letterlijk `"Digitale geletterdheid, missie voor missie."` plus `"Laden..."`. Het
`<noscript>`-blok voegt daar nog 1.037 tekens aan toe — een korte samenvatting, geen pagina.

**Waarom dit telt.** Googlebot rendert JavaScript en ziet de pagina dus wél. GPTBot, ClaudeBot en
PerplexityBot niet (zie 1.4, Vercel-netwerkdata). Voor de AI-assistenten waar een docent of
ICT-coördinator steeds vaker "wat is DGSkills?" intypt, bestaat de homepage feitelijk uit één zin.
Alle onderbouwing — SLO-domeinen, FAQ, docentdashboard, privacy — is voor hen onzichtbaar.

**Verwachte impact:** hoog. Dit is de enige bevinding in dit rapport die een compleet kanaal
onbruikbaar maakt.

## Knelpunt 2 — De tweede hero-knop `/pilot` geeft HTTP 404 — **HOOG**

**Locatie:** `src/features/public-site/verhaal/sections/Proloog.tsx` (CTA `href="/pilot"`) versus de
`ROUTES`-lijst in `scripts/prerender.mjs`.

**Wat er aan de hand is.** `/pilot` staat wél in de client-side router (`isPublicRoute` in
`AppRouter.tsx`), maar **niet** in de prerender-routelijst. Er wordt dus geen `dist/pilot/index.html`
weggeschreven, en de hosting valt terug op de 404-pagina.

**Meting (26-08-2026):**

| URL | HTTP-status |
|---|---|
| `https://dgskills.app/verhaal` | 200 |
| `https://dgskills.app/leerlingdemo` | 200 |
| `https://dgskills.app/pilot` | **404** |
| `https://dgskills.app/pilot-aanmelden` | **404** |

De teruggegeven pagina draagt de titel *"Pagina niet gevonden — DGSkills"*. Omdat het
app-startpunt in die 404-HTML wél meekomt, neemt React de pagina daarna waarschijnlijk alsnog over —
maar de bezoeker ziet in zijn tabblad eerst "Pagina niet gevonden", de statuscode blijft 404, en
crawlers zien uitsluitend de foutpagina. Wie de link deelt in een mail of Teams-bericht, deelt een
kapotte link met een verkeerde preview.

**Verwachte impact:** hoog. Dit is de knop die de zakelijke conversie moet dragen.

## Knelpunt 3 — Op de homepage wordt vrijwel niets gemeten — **HOOG**

**Locatie:** `src/features/public-site/verhaal/VerhaalPage.tsx` (regel ~130) versus
`src/hooks/useHomepageAnalytics.ts`.

De verhaalpagina stuurt precies één gebeurtenis: `seo_page_view`. De hook `useHomepageAnalytics`
(scrolldiepte, CTA-kliks) is aangesloten op **`ScholenLanding`** — de pagina die géén homepage meer
is. Van het pilotformulier komen wel `pilot_request_start` en `pilot_request_success`.

Er is dus geen antwoord op: hoeveel bezoekers halen de Bewijs-sectie? Hoeveel openen de film?
Klikken ze "Bekijk een missie" of "Plan een schoolpilot"? Waar haken ze af in de 320vh-sectie?

**Waarom dit telt.** De opdracht achter dit document is "voortaan toetsen aan principes in plaats van
smaak". Zonder deze meting is elk principe hieronder onbewijsbaar en is elke A/B-variant een mening.
Dit knelpunt blokkeert het hele kader.

**Verwachte impact:** hoog (indirect — het maakt alle andere verbeteringen onmeetbaar).

## Knelpunt 4 — Scrolljacking in de Mila-sectie, zonder uitweg — **HOOG**

**Locatie:** `src/features/public-site/verhaal/sections/MilaReis.tsx` (regel ~390:
`className="relative h-[320vh] ..."` met een `sticky` binnenlaag en zes tekst-beats).

De sectie is 3,2 schermhoogtes lang en houdt de inhoud vast terwijl de bezoeker scrollt. Volgens
NN/g raakt de meerderheid van de gebruikers hiervan gedesoriënteerd; het effect is het sterkst bij
(a) taakgerichte bezoekers, (b) mobiel, en (c) veel tekst in de vastgezette sectie. Alle drie zijn
hier van toepassing: de doelgroep is taakgericht (een docent die wil weten of dit past), en elke beat
bevat een kop plus een alinea.

**Extra bevinding:** `verhaal.css` respecteert `prefers-reduced-motion` netjes voor de marquee, de
dobberende eend, de cursor en de Jayden-animatie — maar **de Mila-sectie valt buiten die regel**.
Wie bewegingsreductie aan heeft staan (vaak vanwege duizeligheid of migraine) krijgt de zwaarste
beweging op de pagina alsnog volledig.

**Verwachte impact:** hoog voor mobiel en voor bezoekers met bewegingsgevoeligheid; midden overall.

## Knelpunt 5 — De structured data klopt niet meer met de pagina — **HOOG**

**Locatie:** `index.html`, het `application/ld+json`-blok (regel ~86).

Drie problemen tegelijk:

1. **Verouderde positionering.** Het blok beschrijft DGSkills als platform voor "het voortgezet
   onderwijs" met doelgroep "MAVO, HAVO, VWO" — **VSO ontbreekt**, terwijl de hele pagina nu
   "VO & VSO" zegt. Ook staat er nog "AI-missies, gamification en SLO Kerndoelen 2025".
2. **Een aanbod dat de pagina niet doet.** `offers` claimt *"Gratis pilot van 3 maanden voor
   scholen"*. De pagina zelf spreekt van een schoolpilot met een rapport na zes weken en een start
   binnen tien werkdagen — nergens drie maanden gratis.
3. **FAQ-markup die niet overeenkomt met de zichtbare FAQ.** De vier vragen in het JSON-LD hebben
   andere antwoordteksten dan de FAQ in `sections/Bewijs.tsx`. Google's beleid vereist dat
   FAQPage-markup overeenkomt met wat de bezoeker op de pagina ziet.

Voor AI-antwoorden is dit extra vervelend: het JSON-LD is één van de weinige inhoudelijke dingen die
een niet-renderende crawler *wél* leest (knelpunt 1). Op dit moment is dat dus de meest verouderde
beschrijving van het product die er bestaat, en juist die wordt uitgeserveerd.

**Verwachte impact:** hoog voor AI-zichtbaarheid; midden voor klassieke SEO.

## Knelpunt 6 — De koppen dragen geen informatie — **MIDDEN**

**Locatie:** alle `sections/*.tsx`.

De pagina heeft één `<h1>` ("Digitale geletterdheid, missie voor missie" — prima) en daarna
verhalende `<h2>`'s: *"Het begint zoals elke maandag begint."*, *"Klaar voor het volgende
hoofdstuk?"*, en `<h3>`'s als *"Mila kiest haar route."*

Als literatuur werkt dat. Als informatiestructuur niet. Een layer-cake-scanner (§1.1) leest alleen
koppen en houdt aan deze pagina niets feitelijks over. Hetzelfde geldt voor een taalmodel dat een
citeerbare passage zoekt: het GEO-onderzoek (§1.4) laat zien dat juist zelfstandige, feitelijke,
met cijfers en bronnen onderbouwde passages worden opgepikt.

De oplossing is níét het verhaal opgeven — het is per hoofdstuk een feitelijke tussenkop of
samenvattende regel toevoegen naast de verhalende kop.

**Verwachte impact:** midden (scanbaarheid + AI-citeerbaarheid).

## Knelpunt 7 — De automatische homepage-check bewaakt de verkeerde pagina — **MIDDEN**

**Locatie:** `scripts/check-homepage-buyer-contract.mjs`.

Dit script bewaakt of de homepage bepaalde koperszinnen bevat ("Pilot binnen 10 werkdagen", "Veilig
te beoordelen door ICT", "Veelgestelde vragen per rol", …). Het leest daarvoor
**`ScholenLanding.tsx`** — de pagina die sinds de herbouw op `/scholen` staat en niet meer de
homepage is. Bovendien: het script is **niet aangesloten** op `package.json` en komt in geen enkele
CI-workflow voor, en in een eerdere reviewnotitie
(`business/dgskills-reviews/j1p2-batch-2026-08-06.md`) staat dat het al faalde.

Er staat dus een vangnet in de repo dat niets vangt. Voor het kader hieronder is dat relevant: een
toets die niet draait, is geen toets.

**Verwachte impact:** midden (het risico is dat toekomstige wijzigingen ongemerkt kernboodschappen
slopen).

## Knelpunt 8 — De footer mist de legitimiteitssignalen die een inkoper zoekt — **MIDDEN**

**Locatie:** `src/features/public-site/verhaal/sections/Epiloog.tsx` (regel ~77 e.v.).

De footer bevat: logo, tagline, vijf links (Het verhaal, SLO-koppeling, Privacy & AI, Voor scholen,
Contact) en één e-mailadres. Wat ontbreekt, gemeten tegen NN/g's *up-front disclosure* (§1.1) en
tegen wat een schoolinkoper of FG standaard controleert:

- geen rechtspersoon, KvK-nummer of vestigingsadres;
- geen link naar `/compliance-hub`, `/ict` (het volledige ICT-dossier), of de verwerkersovereenkomst,
  terwijl die pagina's bestaan en juist voor deze doelgroep gemaakt zijn;
- geen "over ons"/wie-bouwt-dit, terwijl "gebouwd door een docent" de kernpositionering is én een
  E-E-A-T-signaal (§1.3);
- geen datum of versie-indicatie van de inhoud.

**Verwachte impact:** midden. Voor de docent nauwelijks; voor de ICT'er en de inkoper — de mensen die
de handtekening blokkeren — direct.

## Knelpunt 9 — `/` en `/verhaal` zijn dezelfde pagina, allebei geïndexeerd — **MIDDEN**

**Locatie:** `AppRouter.tsx` (`/` → `PublicRoute story`, `/verhaal` → dezelfde component),
`scripts/prerender.mjs` (beide in `ROUTES` en dus in de gegenereerde sitemap), plus de
titel/description-wissel in `VerhaalPage.tsx`.

Beide URL's staan in de sitemap, beide krijgen een eigen canonical die naar zichzelf wijst, en beide
serveren identieke inhoud met alleen een andere titel. Dat is een bijna-duplicaat waarvan Google zelf
moet raden welke de "echte" is.

**Verwachte impact:** midden. Kies er één als canoniek (waarschijnlijk `/`) en laat `/verhaal` daar
naar verwijzen, of geef `/verhaal` inhoud die wél verschilt.

## Knelpunt 10 — Het "bewijs" is grotendeels bewering — **MIDDEN**

**Locatie:** `sections/Bewijs.tsx`, `sections/Epiloog.tsx`.

De pagina belooft "Rapport na zes weken", "Binnen 10 werkdagen na de eerste afstemming",
"DPIA-support", "Eén aanspreekpunt". Stuk voor stuk geloofwaardig, maar geen ervan is op de pagina
*verifieerbaar*: geen voorbeeldrapport, geen genoemde school, geen datum, geen citaat met naam en
functie, geen downloadbaar document.

Voor deze markt is dat het duurste gemis. Een koper doet ~80% van zijn onderzoek zelfstandig (§1.2)
en moet zijn bevindingen dóórgeven aan mensen die er niet bij waren. Een bewering kan hij niet
doorsturen; een voorbeeldrapport wel. Er *bestaat* al een voorbeeld-SLO-rapport
(`/compliance/slo-rapport`) en de Bewijs-sectie linkt daar ook naartoe — dat is de goede beweging,
maar het staat weggestopt onderin en niet bij de belofte waar het bewijs voor is.

Let op de spanning met de bestaande, terechte terughoudendheid: DGSkills mag geen "AVG-compliant"- of
"AI Act-compliant"-claims doen. Dit knelpunt vraagt niet om zulke claims — het vraagt om
**artefacten**: een voorbeeldrapport, een ingevulde checklist, een datum, een naam.

**Verwachte impact:** midden tot hoog op de zakelijke conversie, laag op verkeer.

## Knelpunt 11 — Zes concurrerende vervolgstappen in de hero — **LAAG/MIDDEN**

**Locatie:** `sections/Proloog.tsx`.

Boven de vouw staan: "Bekijk een missie", "Plan een schoolpilot", "Inloggen", "Film (49 sec)", "Lees
het verhaal ↓", plus het logo als anker. Vijf daarvan concurreren om dezelfde 10 seconden (§1.1).
De twee hoofdknoppen zijn goed onderscheiden (gevuld/omgekeerd) en de rest is visueel duidelijk
ondergeschikt, dus het is geen zware fout — maar het is wel de plek waar de meeste ruis zit.

**Verwachte impact:** laag/midden.

## Kleinere bevindingen — **LAAG**

| # | Locatie | Wat |
|---|---|---|
| 12 | `sections/MilaReis.tsx` (~regel 423) | De teller toont `NN / 05` terwijl `BEATS` **zes** items bevat en er ook zes stipjes worden getekend. Bezoeker ziet "06 / 05". Klein, maar het ondermijnt de precisie-indruk bij een product dat op zorgvuldigheid verkoopt. |
| 13 | `PilotForm.tsx` | Alleen het optionele veld is gemarkeerd ("Bericht (optioneel)"); de drie verplichte velden en de twee keuzelijsten zijn niet gemarkeerd. Baymard: verplichte velden markeren presteert beter (§1.1). Verder is het formulier goed: 3 verplicht + 3 optioneel, echte `<label>`s, `autoComplete`, honeypot en een privacyregel met link. |
| 14 | `index.html` | De rauwe HTML bevat **twee** `<h1>`'s: de LCP-hero en die in het `<noscript>`-blok. Alleen zichtbaar voor niet-renderende crawlers, maar dat zijn precies de crawlers uit knelpunt 1. |
| 15 | `scripts/prerender.mjs` | `/speeltuin` is een publieke route in de router maar staat niet in `ROUTES` en dus niet in de sitemap — zelfde mechanisme als knelpunt 2. |

---

# Deel 3 — Het toetsingskader

Twaalf principes. Elk principe heeft een **toets**: iets wat je kunt uitvoeren of meten en waarop het
antwoord ja of nee is. Loop deze lijst langs bij **elke** homepage-wijziging en bij **elke**
A/B-variant. Een variant die een toets laat zakken, gaat niet live — ook niet als hij mooier is.

> **Voorwaarde vooraf.** Principes P5 tot en met P8 zijn pas te toetsen als knelpunt 3 (meting)
> is opgelost. Tot die tijd zijn ze een intentie, geen toets. Los dat dus eerst op.

## A. Boodschap en scanbaarheid

**P1 — De 5-secondenregel.**
Een bezoeker die het eerste scherm vijf seconden ziet, moet daarna kunnen navertellen: *wat is dit,
voor wie, en wat is mijn volgende stap?*
→ **Toets:** laat drie mensen die het product niet kennen (bij voorkeur één docent, één ICT'er) vijf
seconden naar een schermafdruk van het eerste scherm kijken, sluit hem, en laat ze die drie vragen
beantwoorden. Slaagt als 3 van de 3 alle drie goed hebben.
*Grondslag: [NN/g — 10-secondenregel](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) (BEWEZEN)*

**P2 — Koppen dragen het verhaal alleen.**
Wie uitsluitend de koppen leest, kent de kern.
→ **Toets:** kopieer alle `<h1>`/`<h2>`/`<h3>`-teksten onder elkaar in een leeg document. Staat daar
een begrijpelijke samenvatting van het aanbod? Zo nee: voeg per hoofdstuk een feitelijke tussenkop
toe naast de verhalende kop.
*Grondslag: [NN/g — Layer-cake-patroon](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) (BEWEZEN)*

**P3 — Eén primaire actie per scherm.**
Per schermhoogte is er precies één visueel dominante actie; de rest is aantoonbaar ondergeschikt.
→ **Toets:** tel per schermhoogte de klikbare elementen die zich als "hoofdactie" presenteren
(gevulde knop, grote tekst, accentkleur). Meer dan één = zakken.
*Grondslag: [NN/g — 10-secondenregel](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) + cognitieve belasting (BEWEZEN)*

**P4 — Elke belofte heeft een artefact.**
Bij elke concrete belofte (een termijn, een rapport, een dekking) staat binnen één klik iets wat de
bezoeker kán doorsturen: een voorbeeld, een document, een datum of een naam.
→ **Toets:** maak een lijst van alle stellige beweringen op de pagina. Zet achter elke bewering de
URL van het bewijs. Beweringen zonder URL: schrappen, afzwakken, of bewijs maken.
→ **Grens:** dit is géén vrijbrief voor compliance-claims. "AVG-proof" of "AI Act compliant" blijft
verboden; bewijs is een artefact, geen adjectief.
*Grondslag: [Gartner — B2B buying journey](https://www.gartner.com/en/sales/insights/b2b-buying-journey) (BEWEZEN) + [NN/g — up-front disclosure](https://www.nngroup.com/articles/trustworthy-design/) (BEWEZEN)*

## B. Meetbaarheid — de voorwaarde voor alle andere principes

**P5 — Elke sectie meldt of hij gezien is.**
Elke hoofdsectie stuurt een gebeurtenis bij het in beeld komen.
→ **Toets:** open de homepage, scroll naar beneden, en controleer in de analytics dat er per sectie
één gebeurtenis binnenkomt. Ontbreekt er één, dan is die sectie onbeoordeelbaar.

**P6 — Elke CTA is te onderscheiden in de meting.**
Elke actieknop stuurt een eigen gebeurtenis met een unieke naam én zijn positie op de pagina.
→ **Toets:** klik alle knoppen; er moeten evenveel unieke gebeurtenisnamen binnenkomen als er
knoppen zijn.

**P7 — Een variant wordt beoordeeld op één vooraf benoemde uitkomstmaat.**
Vóór het bouwen van een A/B-variant leg je vast: welke maat, welk verschil is groot genoeg, hoeveel
bezoekers zijn nodig, en hoe lang loopt de test.
→ **Toets:** staat dat opgeschreven vóór de eerste regel code? Zo nee, dan is het geen test maar een
smaakverandering — noem het dan ook zo.
→ **Realistische kanttekening:** met het verkeersvolume van een startend platform in een niche is
statistisch significant A/B-testen op een *conversie* vrijwel onhaalbaar. Gebruik varianten dan om
*gedrag* te vergelijken (scrolldiepte, sectiebereik, formulierstart) en accepteer dat het richting
geeft, geen bewijs.

**P8 — De homepage-check bewaakt de daadwerkelijke homepage.**
Er is één geautomatiseerde controle die vastlegt welke kernboodschappen op `/` moeten staan, hij
wijst naar de component die `/` daadwerkelijk rendert, en hij draait in CI.
→ **Toets:** `git grep` de naam van het checkscript in `package.json` en in `.github/workflows/`.
Beide treffers, of het principe zakt. (Zie knelpunt 7 — nu zakt hij op alle drie.)

## C. Techniek en toegankelijkheid

**P9 — Beweging is nooit verplicht.**
Elke animatie, sticky-sectie of scroll-gestuurde sequentie heeft een variant voor
`prefers-reduced-motion: reduce` waarin de inhoud volledig leesbaar blijft.
→ **Toets:** zet bewegingsreductie aan (macOS: Systeeminstellingen → Toegankelijkheid → Beeldscherm →
Verminder beweging), herlaad de pagina en scroll er in één keer doorheen. Alle inhoud gelezen zonder
vastgehouden scroll? Zo nee: zakken.
*Grondslag: [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) (BEWEZEN)*

**P10 — Scrolljacking alleen onder strikte voorwaarden.**
Een sectie die het scrollen overneemt mag alleen als hij (a) ver onder de vouw staat, (b) korter is
dan ~2 schermhoogtes, (c) weinig tekst bevat, (d) de scrollrichting niet verandert, en (e) op mobiel
is uitgeschakeld of vervangen door gewone secties.
→ **Toets:** loop de vijf voorwaarden af. Eén nee = geen scrolljack.
*Grondslag: [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) (BEWEZEN)*

**P11 — Snelheidsdrempels op echte bezoekersdata.**
LCP < 2,5 s · INP < 200 ms · CLS < 0,1, gemeten op het 75e percentiel van échte bezoeken.
→ **Toets:** de bestaande `npm run performance:ci` (lighthouse-mediaan, netwerk-assert,
bundlebudget) is de poort vóór merge; de `web-vitals`-metingen uit het veld zijn de poort erná.
Een labscore is geen bewijs — de veldmeting is dat wel.
*Grondslag: [web.dev — Web Vitals](https://web.dev/articles/vitals) (BEWEZEN)*

**P12 — Elke link die de pagina toont, bestaat ook echt.**
Elke `href` naar een eigen pagina geeft HTTP 200 bij een directe navigatie (dus niet alleen
client-side).
→ **Toets:** haal alle interne `href`'s uit de homepage-code en vraag ze één voor één op met een
kale HTTP-aanvraag. Alles 200, anders zakken. Nieuwe publieke route = ook toevoegen aan `ROUTES` in
`scripts/prerender.mjs`.
*Grondslag: knelpunt 2 uit deze audit (in deze audit gemeten)*

---

# Deel 4 — SEO- en GEO-eisen waar de homepage altijd aan voldoet

Kort en absoluut. Dit zijn geen afwegingen maar drempelvoorwaarden.

## Altijd doen — bewezen nut

1. **Server-gerenderde inhoud.** De HTML die de server teruggeeft, bevat de echte tekst van de
   pagina — kop, waardepropositie, de kernsecties en de FAQ — zonder dat er JavaScript aan te pas
   komt.
   → **Toets:** `curl -s https://dgskills.app/ | wc -c` en daarna de bodytekst zonder scripts tellen.
   Minder dan ~2.000 tekens zichtbare tekst = zakken. *(Nu: 197.)*
   *[BEWEZEN] — [Vercel: AI-crawlers voeren geen JS uit](https://vercel.com/blog/the-rise-of-the-ai-crawler)*

2. **Eén canonieke URL per inhoud.** Geen twee routes met identieke inhoud die allebei naar zichzelf
   canonicaliseren en allebei in de sitemap staan.
   → **Toets:** vergelijk de sitemap met de routelijst; zoek dubbele inhoud. *(Nu: `/` en `/verhaal`.)*
   *[BEWEZEN] — standaard Google-documentatie over canonicalisatie*

3. **Structured data die overeenkomt met de pagina.** `Organization` en `WebSite` altijd;
   `FAQPage` alleen als de vragen en antwoorden **letterlijk** ook zichtbaar op de pagina staan.
   Beschrijvingen, doelgroep en aanbod komen woordelijk overeen met de zichtbare tekst.
   → **Toets:** vergelijk elk veld in het JSON-LD regel voor regel met de pagina; test met de
   Rich Results Test van Google. *(Nu: doelgroep, aanbod én FAQ wijken af — knelpunt 5.)*
   *[BEWEZEN] voor het beleid (markup moet overeenkomen); [PLAUSIBEL] voor de omvang van het effect op AI-zichtbaarheid*

4. **Titel en description per route, in de HTML zelf.** Niet pas door JavaScript gezet. Het
   prerender-script doet dit al goed; nieuwe routes moeten er expliciet in.
   → **Toets:** `curl` de route en lees de `<title>` uit de rauwe HTML.
   *[BEWEZEN]*

5. **Core Web Vitals binnen de drempels** — zie P11.
   *[BEWEZEN] — [Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals)*

6. **Citeerbare, zelfstandige alinea's met cijfers en bron.** Minstens vijf alinea's op de pagina
   zijn zó geschreven dat ze losgeknipt uit de context nog steeds kloppen, en bevatten een concreet
   getal of een verwijzing naar een bron. Dit is de best onderbouwde GEO-maatregel die er is —
   en het is toevallig ook gewoon beter schrijven.
   → **Toets:** knip vijf alinea's los, lees ze zonder de rest van de pagina. Zijn ze los
   begrijpelijk en feitelijk? Zo nee: herschrijven.
   *[BEWEZEN] — [GEO, ACM SIGKDD 2024](https://arxiv.org/abs/2311.09735): statistieken, citaten en
   bronvermelding gaven tot +41%; keyword stuffing werkte juist niet.*

7. **Zichtbare afzender.** Rechtspersoon, KvK, contact en "wie bouwt dit" staan op de site en zijn
   vanaf de homepage binnen één klik bereikbaar.
   → **Toets:** klik vanaf de homepage naar die informatie. Meer dan één klik = zakken.
   *[BEWEZEN] — Trust is het zwaarste onderdeel van E-E-A-T ([Google Quality Rater Guidelines, sept. 2025](https://www.google.com/insidesearch/howsearchworks/assets/searchqualityevaluatorguidelines.pdf))
   en up-front disclosure is een van Nielsens vier vertrouwensfactoren.*

8. **Sitemap en routes lopen synchroon.** Elke publieke route staat in `ROUTES` in
   `scripts/prerender.mjs` én in de gegenereerde sitemap; niets in de sitemap geeft een andere status
   dan 200.
   → **Toets:** doorloop de sitemap met een statuscheck. *(Nu: `/pilot` en `/speeltuin` ontbreken.)*
   *[BEWEZEN]*

## Bewust niet doen

- **`llms.txt` aanmaken.** Geen enkele grote AI-aanbieder gebruikt het, Google negeert het expliciet,
  en 97% van de bestanden krijgt nul verkeer. Als iemand dit voorstelt: het is de moderne variant van
  de keywords-metatag.
  *[SPECULATIEF, bewijs wijst tegen] — [SEJ over Mueller, juni 2026](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/)*
- **Trefwoorden opstapelen** in koppen, alt-teksten of verborgen tekst. Werkt niet in klassieke SEO
  en presteerde in het GEO-onderzoek expliciet slecht.
  *[BEWEZEN dat het niet werkt]*
- **Urgentie- en schaarste-trucs** ("nog 3 pilotplekken", afteltimers). Verkeerde markt: het
  verhoogt wantrouwen bij een koper die maanden de tijd neemt en langs een privacyfunctionaris moet.
  *[PLAUSIBEL — geen gecontroleerd onderzoek voor deze specifieke markt, wel consistent met de
  koopreis uit §1.2]*
- **Anoniem sociaal bewijs** ("500+ tevreden docenten"). Zonder naam, school en datum is het geen
  bewijs maar een bewering — zie P4.
  *[PLAUSIBEL]*

---

# Deel 5 — Voorgestelde volgorde

Niet als opdracht, maar omdat de knelpunten van elkaar afhangen.

| Volgorde | Knelpunt | Waarom eerst |
|---|---|---|
| 1 | **2** — `/pilot` geeft 404 | Kleinste ingreep, directe schade aan de belangrijkste knop. |
| 2 | **3** — meting op de homepage | Blokkeert het hele kader; zonder dit is niets toetsbaar. |
| 3 | **5** — structured data bijwerken | Goedkoop, en het is nu de enige inhoud die AI-crawlers lezen. |
| 4 | **1** — server-gerenderde inhoud | Grootste ingreep, grootste opbrengst; heeft een echte architectuurkeuze nodig. |
| 5 | **4 + 9** — scrolljacking en bewegingsreductie | Toegankelijkheid; raakt bestaande code, dus na de meting zodat het effect zichtbaar is. |
| 6 | **6, 8, 10** — koppen, footer, bewijs | Inhoudelijk werk; het meest waardevol zodra de rest meet en indexeert. |
| 7 | **7, 12–15** | Opruimwerk. |

Knelpunt 1 (server-rendering) is de enige die een echte ontwerpbeslissing vraagt — de huidige opzet
is een client-side SPA met een prerender-script dat alleen meta-tags injecteert. Dat is geen
bugfix maar een keuze tussen opties (het prerender-script echt laten renderen met een headless
browser, of een deel van de inhoud statisch in de HTML zetten). Die afweging hoort in een apart
voorstel, niet in dit document.

---

## Volledige bronnenlijst

**UX en gedrag**
- [NN/g — How Long Do Users Stay on Web Pages?](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/)
- [NN/g — Text Scanning Patterns: Eyetracking Evidence](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/)
- [NN/g — The Layer-Cake Pattern of Scanning Content](https://www.nngroup.com/articles/layer-cake-pattern-scanning/)
- [NN/g — F-Shaped Pattern of Reading: Misunderstood, But Still Relevant](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- [NN/g — Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
- [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- [NN/g — What Parallax Lacks](https://www.nngroup.com/articles/parallax-usability/)
- [NN/g — Trustworthiness in Web Design: 4 Credibility Factors](https://www.nngroup.com/articles/trustworthy-design/)
- [NN/g — Communicating Trustworthiness in Web Design](https://www.nngroup.com/articles/communicating-trustworthiness/)
- [Baymard — Checkout Optimization: Minimize Form Fields](https://baymard.com/blog/checkout-flow-average-form-fields)
- [Baymard — Mark Both Required and Optional Fields](https://baymard.com/blog/required-optional-form-fields)

**B2B/B2G-koopgedrag**
- [Gartner — The B2B Buying Journey](https://www.gartner.com/en/sales/insights/b2b-buying-journey)
- [Gartner — 67% of B2B Buyers Prefer a Rep-Free Experience (maart 2026)](https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience)
- [The Starr Conspiracy — B2B buyer journey statistics](https://www.thestarrconspiracy.com/insights/qa/b2b-buyer-journey-statistics)

**SEO**
- [web.dev — Web Vitals](https://web.dev/articles/vitals)
- [Google Search Central — Understanding Core Web Vitals and Google Search results](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google — Search Quality Rater Guidelines, september 2025 (PDF)](https://www.google.com/insidesearch/howsearchworks/assets/searchqualityevaluatorguidelines.pdf)
- [Google Search Central — E-A-T krijgt een extra E voor Experience](https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t)

**GEO/AEO**
- [Aggarwal e.a. — GEO: Generative Engine Optimization (arXiv:2311.09735 / ACM SIGKDD 2024)](https://arxiv.org/abs/2311.09735)
- [Vercel — The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler)
- [Vercel — How we're adapting SEO for LLMs and AI search](https://vercel.com/blog/how-were-adapting-seo-for-llms-and-ai-search)
- [Search Engine Journal — Google Confirms LLMs.txt Has No Current Implementation (juni 2026)](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/)
- [Search Engine Roundtable — Google Search Team Does Not Endorse LLMs.txt](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html)
- [Globerunner — Structured Data in 2026: The Schema Markup AI Actually Uses](https://globerunner.com/structured-data-schema-markup-ai-2026/)

## Verantwoording van de metingen in dit document

Alle cijfers die in deel 2 als "meting" staan, zijn op 26 augustus 2026 in deze sessie uitgevoerd
tegen de live site en tegen `origin/main`:

- Rauwe HTML van `https://dgskills.app/` opgehaald zonder JavaScript-uitvoering; bodytekst geteld na
  verwijdering van `<script>`, `<style>` en `<noscript>`: **197 tekens** (met `<noscript>`: 1.234).
- HTTP-statuscodes van `/verhaal`, `/leerlingdemo`, `/pilot`, `/pilot-aanmelden`, `/llms.txt` en een
  niet-bestaande controleroute afzonderlijk opgevraagd.
- `robots.txt`, `sitemap.xml` en het JSON-LD-blok live opgehaald en vergeleken met de repo-versies.
- Codebevindingen gelezen uit `origin/main`, niet uit de werkkopie van deze branch — die liep 46
  commits achter en bevatte nog de vorige hero-tekst.
