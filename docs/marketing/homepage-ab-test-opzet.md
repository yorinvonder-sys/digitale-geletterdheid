# Homepage A/B-opzet — variant B

**Datum:** 26 augustus 2026
**Hoort bij:** [homepage-ontwerpkader.md](homepage-ontwerpkader.md) — dit document voert principe
**P7** (een variant wordt beoordeeld op één vooraf benoemde uitkomstmaat) concreet uit.
**Status:** stap 1 en 2 gebouwd (variantmechaniek + variant B). De verdeling staat uit tot er
verkeer is; er is niets verwijderd.

## In het kort

Je hebt nu twee volledige homepages in de codebase: de verhaalpagina op `/` en de oudere
schoolpagina op `/scholen`. Dat is feitelijk al een A en een B, alleen weet niemand welke wint,
omdat er tot vorige week niets werd gemeten en bezoekers niet netjes over beide worden verdeeld.
Dit document legt vast wát we vergelijken, hóé we verdelen, wat we meten, en welke uitkomst
"gewonnen" betekent — vóórdat er één regel code voor variant B geschreven wordt. Anders wordt de
keuze alsnog op smaak gemaakt, en dan hadden we het meten net zo goed kunnen laten.

Belangrijkste waarschuwing vooraf: **het is goed mogelijk dat je te weinig bezoekers hebt voor een
statistisch geldige test.** Dat is geen reden om niets te doen, wel een reden om het eerlijk een
gestructureerde vergelijking te noemen in plaats van een bewijs. Hoofdstuk 1 gaat daarover.

---

## Waarom dit document er moet zijn

Zonder vooraf vastgelegde beslisregel eindigt elke A/B-test op dezelfde manier: er komen twee
getallen uit, en degene die het hardst vindt dat zijn variant beter is, krijgt gelijk. Het punt van
vooraf vastleggen is dat je jezelf bindt aan een uitkomst die je nog niet kent.

Concreet legt dit document vier dingen vast die achteraf niet meer te verschuiven zijn:

1. Wat de primaire uitkomstmaat is (één, niet drie).
2. Hoe lang de test loopt en hoeveel bezoekers minimaal nodig zijn.
3. Welke verslechtering we niet accepteren, ook al wint de variant (guardrails).
4. Wat er gebeurt met de verliezer.

---

## 1. Eerst de vraag die alles bepaalt: is testen hier haalbaar?

> **Beantwoord op 26-08-2026 door Yorin: er zijn nog geen bezoekers.** Dat maakt een A/B-test in de
> statistische zin voorlopig onmogelijk — je kunt nul bezoekers niet over twee varianten verdelen.
> Het verandert niet wat we bouwen, wel waar het eerst voor dient: de variantmechaniek is nu een
> **schakelaar** om beide versies naast elkaar te kunnen tonen, en de eerste zinvolle vergelijking
> is de kwalitatieve uit de tabel hieronder (vijf mensen uit de doelgroep, beide versies, de
> 5-secondentoets uit P1). De verdeling over echt verkeer gaat pas aan zodra er verkeer ís; dat is
> één constante omzetten (`VARIANT_B_READY` in `src/features/public-site/homepageVariant.ts`).
>
> De rest van dit hoofdstuk blijft staan als richtlijn voor het moment dat er wél bezoekers zijn.

Ik heb geprobeerd het bezoekvolume zelf op te halen en dat lukte niet:

- Vercel Web Analytics is **niet ingeschakeld** voor dit project (de API antwoordt met 404).
- De Supabase-koppeling was in deze sessie niet geautoriseerd, dus de `events`-tabel kon ik niet
  bevragen.

**Actie vóór alles:** haal het aantal unieke bezoekers per week op `/` op over de afgelopen drie
maanden, uit de `events`-tabel (`homepage_pageview` bestond nog niet op `/`, dus gebruik
`seo_page_view` met `page = 'home'`, of de `web_vitals`-rijen met `route = '/'` als ruwe proxy).

Wat de uitkomst betekent:

| Unieke bezoekers per week op `/` | Wat er dan kan |
|---|---|
| **Onder ~200** | Een significantietest is kansloos. Doe geen A/B-test met percentages. Zet variant B op een aparte, `noindex`-URL en gebruik hem voor **gestructureerde gebruikersgesprekken**: laat vijf mensen uit de doelgroep (docent, teamleider, ICT'er) beide versies doorlopen met de 5-secondentoets uit principe P1. Dat levert bij dit volume méér bruikbare informatie op dan een test die maanden moet lopen. |
| **~200 – 1.000** | Een A/B-test kan, maar alleen op een **gedrags**maat die vaak voorkomt (sectiebereik, CTA-klik), niet op pilotaanvragen. Reken op 4–8 weken looptijd. Uitkomst is richtinggevend, geen bewijs. |
| **Boven ~1.000** | Een normale A/B-test op CTA-doorklik is haalbaar binnen enkele weken. Pilotaanvragen blijven ook dan te zeldzaam om op te sturen. |

De reden dat pilotaanvragen als primaire maat afvallen, staat in het ontwerpkader §1.2: dit is een
markt waarin een koper ~17% van zijn tijd bij leveranciers doorbrengt en de aankoop maanden duurt.
Het aantal aanvragen per week is daardoor per definitie klein, en een klein aantal beweegt te veel
op toeval om twee varianten mee te vergelijken.

---

## 2. Mijn oordeel over de verhaalpagina

Je vroeg wat ik ervan vind. Ik ben het deels met je eens, maar niet met weggooien als eerste stap.

### Waar je gelijk in hebt

De verhaalpagina heeft drie problemen die voor deze doelgroep zwaar wegen, en ze zijn meetbaar:

- **De pagina is ~24 schermen lang.** Opgemeten per sectie (desktop): proloog 1,4 · probleem 3,6 ·
  ontmoeting 3,4 · mila 3,2 · zelf 2,0 · docent 3,0 · bewijs 5,3 · epiloog 2,6. Met de film erbij
  ruim 25. Dat is een enorme investering te vragen van iemand die aan het inventariseren is.
- **Het Mila-hoofdstuk neemt het scrollen over** (320vh, zes tekstblokken). NN/g-onderzoek: de
  meerderheid van de deelnemers raakt gedesoriënteerd, en het is het ergst bij taakgerichte
  bezoekers, op mobiel, en met veel tekst — alle drie van toepassing.
- **De koppen dragen geen informatie.** "Het begint zoals elke maandag begint." Wie alleen koppen
  scant — en dat doet de meerderheid — houdt niets feitelijks over.

Daar komt bij: de pagina is verhalend en lineair, terwijl er 6 tot 11 mensen los van elkaar naar
kijken, elk met een eigen vraag. Een ICT'er die wil weten of dit langs zijn privacybeleid komt,
moet nu door een verhaal over Mila scrollen. Dat is een structurele mismatch met hoe deze markt
koopt.

### Waar ik het niet mee eens ben

- **Het eerste scherm is juist het sterkste deel van de site.** De Proloog doet precies wat de
  literatuur voorschrijft: doelgroep, categorie, belofte voor leerling én docent, twee heldere
  acties en een concreet stuk product — binnen vijf seconden te bevatten. Dat weggooien zou het
  beste stuk meenemen met het slechtste.
- **Weggooien vóór het meten maakt de A/B-test onmogelijk.** Je vraagt om A/B-testen én om de A
  weg te halen. Dat kan niet allebei. Als de verhaalpagina weg is, is er niets om B tegen af te
  zetten, en dan is de nieuwe pagina opnieuw een smaakbeslissing — precies wat het ontwerpkader
  moest voorkomen.
- **"Niet sterk vinden" is een hypothese, geen bevinding.** Het kan heel goed kloppen. Maar jij bent
  niet de doelgroep: jij hebt de pagina tientallen keren gezien, en dat maakt bijna elke pagina
  vermoeiend. Een teamleider die er voor het eerst komt, oordeelt anders.

### Wat ik voorstel

Behoud de verhaalpagina als **A**, bouw een nieuwe **B** volgens het ontwerpkader, laat ze naast
elkaar lopen, en verwijder daarna de verliezer. Dat kan de verhaalpagina zijn — dan heb je een
onderbouwde reden om hem op te ruimen in plaats van een onderbuikgevoel. En als B duidelijk wint,
heb je bovendien geleerd wat precies het verschil maakte.

**Er wordt in dit voorstel dus niets verwijderd.** Opruimen is de laatste stap, niet de eerste.

---

## 3. Wat is A en wat is B?

| | A (bestaand) | B (te bouwen) |
|---|---|---|
| Component | `src/features/public-site/verhaal/` | nieuw, `src/features/public-site/versie-b/` |
| Karakter | Lineair verhaal, ~24 schermen | Rolgericht en scanbaar, richtlijn ≤ 10 schermen |
| Kernidee | De bezoeker meenemen in een verhaal | De bezoeker binnen twee schermen naar zijn eigen vraag laten springen |

**B is nadrukkelijk geen herkleurde A.** Als de varianten alleen in kleur of koptekst verschillen,
meet je ruis. B moet één duidelijke, uitlegbare hypothese belichamen:

> **Hypothese B:** een homepage die de bezoeker binnen twee schermen naar zijn eigen rol
> (docent / schoolleiding / ICT & privacy) laat afslaan, en die per belofte een doorstuurbaar
> bewijsstuk toont, leidt vaker tot een betekenisvolle vervolgstap dan een lineair verhaal —
> omdat de beslissers los van elkaar onderzoeken en hun bevindingen intern moeten kunnen delen.

Wat dat concreet betekent voor B (afgeleid uit het ontwerpkader, niet uit smaak):

1. Hero blijft in opzet zoals A: dat deel is bewezen sterk. Wel: één primaire actie in plaats van
   vijf concurrerende (P3).
2. Direct onder de hero een rolkeuze die naar drie korte blokken springt.
3. Elke belofte krijgt een artefact ernaast — voorbeeld-SLO-rapport, compliance-checklist,
   ICT-dossier (P4). Die pagina's bestáán al; ze worden nu alleen onderin weggestopt.
4. Feitelijke tussenkoppen naast eventuele verhalende koppen (P2).
5. Geen scrolljacking (P10), en alle beweging uitschakelbaar (P9).
6. Bewijs- en FAQ-tekst in gewone HTML, zodat de zelfstandige, citeerbare alinea's uit de
   SEO/GEO-eisen ook echt bestaan.

---

## 4. Technische opzet

### 4.1 Verdeling van bezoekers

- **50/50, plakkend per bezoeker.** Wie eenmaal B ziet, ziet altijd B — anders vergelijk je
  bezoeken in plaats van mensen. Opslaan in `localStorage` onder één sleutel, met een cookie als
  terugval is niet nodig: de bestaande cookiebanner dekt analytics, en de variantsleutel zelf is
  een functionele voorkeur zonder persoonsgegevens.
- **Toewijzen vóór de eerste render**, in `AppRouter` of hoger — niet in een `useEffect`, want dan
  ziet de bezoeker eerst A en daarna B.
- **Handmatig overrulen** via `?variant=a` / `?variant=b` moet mogelijk zijn, zodat jij en ik een
  variant gericht kunnen bekijken. Zo'n bezoek moet als "geforceerd" gemarkeerd worden en **buiten
  de meting** vallen, anders vervuilen onze eigen bezoeken de uitkomst.

### 4.2 Twee harde constraints die we tegenkomen

Deze twee zijn tijdens het uitzoeken bevestigd in de code; ze bepalen hoe B gebouwd moet worden.

**(a) De grote kop in beeld komt uit `index.html`, niet uit React.**
In `index.html` staat een vast `<h1 id="lcp-hero">` met de tekst van A ("Digitale geletterdheid,
missie voor missie"). Die staat er bewust: hij is het LCP-element en zorgt dat de pagina snel iets
toont. Krijgt B een andere kop, dan ziet een B-bezoeker eerst de kop van A en daarna die van B —
een zichtbare flits, en een verslechtering van precies de snelheidsmaat die we bewaken.

Twee werkbare uitwegen, te kiezen bij de bouw:
- B krijgt dezelfde kop als A (dan meet je het verschil in *structuur*, niet in *belofte* — prima
  voor een eerste test, en methodisch zelfs zuiverder);
- óf een klein inline script in `index.html` leest de variantsleutel vóór de eerste verf en zet de
  juiste kop. Dat kan, maar het raakt de LCP-optimalisatie en moet dan gemeten worden.

**Besloten op 26-08-2026: B krijgt dezelfde hero-kop als A.** Eén variabele tegelijk. Daarmee meet
de eerste vergelijking het verschil in *structuur* (lineair verhaal versus rolgericht en scanbaar)
en niet in *belofte*, en blijft de kopflits uit. Wil je later de kop zelf testen, dan is dat een
losse test met een eigen beslisregel — niet iets om hier stilletjes bij te schuiven.

**(b) De meting accepteert geen los "variant"-veld.**
`analyticsService` stuurt alleen een vaste set velden door naar de database (`pageKey`, `ctaKey`,
`route`, de metric-velden, `device_class`, `nav_type`, `build_id`). Een extra veld `variant` wordt
stilzwijgend weggegooid. De variant moet dus **in een bestaand veld** worden meegegeven.

Voorstel: hang de variant achter het paginalabel, dus `verhaal-home:a` en `versie-b:b`. Dat werkt
zonder wijziging aan de edge function of het datamodel, en is in SQL met een simpele
`split_part(page_key, ':', 2)` weer uit elkaar te trekken. Alternatief — een echte
`variant`-kolom — is schoner maar vraagt een migratie plus een aanpassing aan de edge function, en
dat is voor een eerste test overkill.

### 4.3 SEO: één ding niet doen

Serveer beide varianten op **dezelfde URL** `/`, met één canonical naar `/`. Dat is de normale,
toegestane manier om A/B te testen.

Wat je **niet** moet doen: variant B op een eigen indexeerbare URL zetten en beide in de sitemap
opnemen. Dan creëer je een tweede bijna-duplicaat van je homepage — precies knelpunt 9 uit de
audit, maar dan erger. Krijgt B tijdens de bouw toch een eigen URL om op te kunnen kijken, dan
`noindex` erop en niet in de sitemap.

Let op: het prerender-script bakt de HTML van **A** in `dist/index.html`. Crawlers zien dus altijd
A. Dat is voor deze test correct en gewenst — maar het betekent ook dat een winst van B in de
meting níét automatisch doorwerkt in wat Google en AI-assistenten van je zien. Zodra B wint, moet
de prerender mee.

---

## 5. Wat we meten

De meting hiervoor is er al: sectiebereik, scrolldiepte, tijd op de pagina en CTA-kliks draaien
sinds de vorige wijziging op de verhaalpagina. B moet dezelfde events sturen, met dezelfde
sectienamen waar de secties inhoudelijk overeenkomen, anders zijn de twee niet te vergelijken.

**Primaire uitkomstmaat — één, vooraf gekozen:**

> Het aandeel bezoekers dat op een **betekenisvolle vervolgstap** klikt: `verhaal_hero_leerlingdemo`,
> `verhaal_hero_schoolpilot`, `*_nav_schoolpilot`, `*_bewijs_slo_rapport` of
> `*_bewijs_compliance_hub` (of hun B-equivalenten).

Waarom deze: het is de eerste handeling die aantoonbaar iets zegt over koopintentie, en hij komt
vaak genoeg voor om binnen weken een verschil te kunnen zien. Inloggen telt niet mee — dat zijn
bestaande gebruikers, geen kopers.

**Secundair (wel rapporteren, niet op sturen):**
- aandeel dat de bewijs-sectie bereikt;
- scrolldiepte 50% en 100%;
- ingediende pilotaanvragen (`pilot_request_success`) — waarschijnlijk te weinig om op te sturen,
  maar wel het echte doel, dus altijd melden.

**Guardrails — B wint niet als één hiervan verslechtert:**
- LCP, INP of CLS op `/` valt buiten de drempels uit het ontwerpkader (P11);
- het aantal pilotaanvragen daalt zichtbaar, ook als de doorklik stijgt;
- er komen JavaScript-fouten bij die er bij A niet zijn.

**Vooraf vastleggen, vóór de bouw:** minimale looptijd, minimaal aantal bezoekers per variant, en
welk verschil groot genoeg is om te handelen. Vul dat hieronder in zodra de bezoekcijfers uit
hoofdstuk 1 er zijn — een test zonder deze drie getallen is achteraf altijd naar de gewenste kant
uit te leggen.

| Parameter | Waarde | Ingevuld op |
|---|---|---|
| Bezoekers per week op `/` | _nog op te halen_ | |
| Minimale looptijd | _in te vullen_ | |
| Minimaal aantal bezoekers per variant | _in te vullen_ | |
| Verschil dat we "gewonnen" noemen | _in te vullen_ | |

---

## 6. Beslisregel

1. De test loopt de vooraf afgesproken periode. **Niet eerder stoppen omdat het er goed uitziet** —
   vroeg stoppen bij een gunstige tussenstand is de meest gemaakte fout in A/B-testen en levert
   structureel te optimistische uitkomsten op.
2. Daarna: haalt B de primaire maat met het afgesproken verschil, én is geen enkele guardrail
   verslechterd? Dan wordt B de homepage.
3. Zo niet, dan blijft A staan en gaat B weg. Geen "we laten het nog even lopen".
4. Bij een verschil kleiner dan afgesproken: **geen winnaar.** Dan is de structuur niet wat het
   verschil maakt en zoeken we het elders. Dat is een geldige uitkomst, geen mislukking.
5. Wat er met de verliezer gebeurt, staat in hoofdstuk 7.

---

## 7. Wat er met de verliezer gebeurt

Zodra er een winnaar is, gaat de verliezer weg — inclusief zijn componenten, zijn CSS en zijn
regels in de router. Twee homepages die allebei half onderhouden worden, is erger dan een
suboptimale homepage.

Bij het opruimen te controleren, ongeacht welke verliest:
- interne links naar de verwijderde pagina (`/scholen` wordt vanaf minstens zeven plekken gelinkt,
  onder meer vanaf alle SEO-pagina's en de footer);
- `ROUTES` in `scripts/prerender.mjs` en de gegenereerde sitemap;
- `scripts/check-homepage-buyer-contract.mjs`, dat nu nog naar `ScholenLanding` wijst en nergens
  wordt aangeroepen (knelpunt 7 uit de audit);
- de variantcode zelf — die moet mee weg, anders blijft er dode bedrading achter.

En over `/scholen`: die pagina staat **buiten deze test**. Hij is geen variant van de homepage maar
een eigen landingspagina met eigen inkomende links. Of die pagina moet blijven bestaan is een
losse vraag, die pas zinvol is als de homepage vaststaat.

---

## 8. Wat we bewust niet doen

- **Meerdere dingen tegelijk veranderen.** Kleur én kop én structuur tegelijk aanpassen levert een
  uitkomst op waar je niets van leert.
- **Meer dan twee varianten.** Bij dit bezoekvolume is zelfs twee al ambitieus.
- **De test stiekem bijsturen** door tijdens de looptijd copy of secties aan te passen. Wijzigt er
  iets aan A of B, dan begint de meting opnieuw.
- **Bezoekers verdelen op de server via aparte URL's.** Overbodig complex hier, en het introduceert
  een duplicaat-URL-probleem.
- **De uitkomst "significant" noemen** zonder dat de vooraf afgesproken aantallen zijn gehaald.
  Noem het dan wat het is: een richting.

---

## 9. Volgorde van bouwen

| Stap | Wat | Klaar wanneer |
|---|---|---|
| 0 | ~~Bezoekcijfers op `/` ophalen~~ | **Vervallen** — er zijn nog geen bezoekers. De parameters in §5 worden ingevuld zodra er verkeer is. |
| 1 | ~~Variantmechaniek~~ | **Klaar** — `homepageVariant.ts`, override via `?variant=`, variant in het meetlabel, `VARIANT_B_READY` staat uit. Gedekt door `npm run test:homepage-variant`. |
| 2 | ~~Variant B bouwen volgens §3~~ | **Klaar** — `src/features/public-site/versie-b/`. Zeven secties, 8,6 schermen desktop / 9,3 mobiel tegenover 24,4 voor A. |
| 3 | ~~Beide varianten meten~~ | **Klaar** — alle zeven secties, scrolldiepte en CTA-kliks vuren onder label `versie-b:b`, geverifieerd met de verdeling tijdelijk aan. |
| 4 | Test draaien | De afgesproken looptijd is voorbij |
| 5 | Beslissen en de verliezer opruimen | Volgens §6 en §7 |

Stap 1 en stap 2 zijn los van elkaar te bouwen en te reviewen. Stap 1 is klein en technisch;
stap 2 is het echte ontwerpwerk. Ze samen in één wijziging stoppen maakt beide moeilijker te
beoordelen.

---

## 10. Openstaande beslissingen — voor Yorin

1. ~~**Bezoekcijfers.**~~ Beantwoord: er is nog geen verkeer. Zet Vercel Web Analytics wél alvast
   aan (staat nu uit) zodat er iets te meten valt zodra de eerste bezoekers komen — dat is een
   schakelaar in het Vercel-dashboard.
2. ~~**Krijgt B dezelfde hero-kop als A?**~~ Besloten op 26-08-2026: **ja**, dezelfde kop. Zie
   §4.2(a). Gevolg voor de bouw: het vaste `<h1 id="lcp-hero">` in `index.html` hoeft niet
   variantbewust te worden, en de LCP-optimalisatie blijft ongemoeid.
3. **Ga je akkoord dat er nu niets verwijderd wordt?** Het voorstel is: verwijderen is de laatste
   stap, op basis van de uitkomst.
4. **Wat gebeurt er met `/scholen`?** Losse vraag, later, maar hij hangt er wel aan: als B een
   rolgerichte pagina wordt, overlapt die inhoudelijk sterk met wat `/scholen` nu doet.
