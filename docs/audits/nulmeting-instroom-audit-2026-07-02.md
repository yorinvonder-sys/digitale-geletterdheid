# Audit nulmeting — geschikt als instroom-screening groep 8 → brugklas?

**Datum:** 2 juli 2026 · **Auditor:** Claude (Fable) met Sonnet-playthrough, DeepSeek-tekstconcepten en webbronverificatie · **Basis:** main `cfb97ed` · **Scope:** de Digitale Escaperoom-nulmeting (`src/features/assessment/escaperoom/`) + eindmeting-variant, opslag en docentweergave. De losse periode-toetsjes die óók "Nulmeting Periode 1-4" heten zijn een ander subsysteem en vallen buiten deze audit (zie §9, naamgeving).

**Toetsvraag waaraan dit hele rapport is afgemeten:**
> "Kan een docent op basis van deze nulmeting per binnenkomende brugklasleerling (11-12 jaar, vers uit groep 8) betrouwbaar zien wat die al wel/niet kan per domein van digitale geletterdheid, om het onderwijs daarop af te stemmen?"

---

## 1. Kernoordeel

**Geschikt-met-fixes.** In de huidige vorm is de nulmeting **niet bruikbaar om per leerling te bepalen wat hij of zij al kan**: de uitslag leunt op te weinig vragen per domein (welzijn: één vraag), op vragen die het antwoord voorzeggen (nepnieuws-hints) en op voorkennis die een kind uit groep 8 niet hoort te hebben (programmeersyntax). Daarbovenop vond het live doorspelen twee productiebugs die los van de meetkwaliteit gefixt moeten worden: **de eindmeting stelt exact dezelfde vragen als de nulmeting** (de tweede vragenset wordt nooit gebruikt) en **op een telefoon is kamer 1 vrijwel zeker niet correct te bedienen**. Als **globaal klassignaal** ("waar staat deze klas ongeveer?") is de nulmeting wél bruikbaar. De benodigde fixes zijn klein en concreet (§9).

## 2. Wat dit betekent voor leerlingen en docenten

**Voor de leerling:** een kind dat net voor het eerst inlogt, krijgt na een verplicht kwartier puzzelen direct een stempel te zien: Starter, Basis of Gevorderd. Dat stempel is deels gebaseerd op toeval (één vraag bepaalt een heel domein), op leesvaardigheid en op of de basisschool toevallig programmeerles gaf. Een kind dat "Starter" ziet kan dus prima digitaal vaardig zijn — en andersom. De app belooft bovendien: *"Je reflectie wordt bewaard zodat je docent het kan lezen"* — die belofte wordt niet waargemaakt: geen enkele docent kan de reflectie ergens zien.

**Voor de docent:** het klasoverzicht (spinnenweb + tabel) en het advies "uw klas scoort het laagst op X, plan dat blok eerder" zijn bruikbaar als **eerste indruk van de klas**. Vertrouw de losse domeincijfers per leerling niet als diagnose: "Programmeren 63" of "Welzijn 75" zegt bij dit ontwerp bijna niets over het individuele kind. De groei-weergave (nulmeting vs. eindmeting) blijft voor nieuwe lichtingen bovendien leeg door een opslagfout.

**Voor de schoolbeloftes:** "nulmeting + eindmeting" wordt aan scholen verkocht als onderdeel van het pakket ([01-offer-packages-and-sla.md:19](../../business/nl-vo/01-offer-packages-and-sla.md); het strategisch implementatieplan citeert de escaperoom-code letterlijk als bewijs van marktklaarheid). De nulmeting draait en de eindmeting ook — maar de vergelijking ertussen (de kern van de belofte) werkt voor nieuwe cohorten niet, en de eindmeting hermeeet met identieke vragen.

## 3. Oordeel per deelvraag

| Deelvraag | Oordeel | Kern van het bewijs |
|---|---|---|
| Dekt hij alle 9 leerdoel-domeinen? | ✗ Nee | Op papier 9/9 (ongebruikte constante), feitelijk eigen meetpunten voor 5; Data (21C), AI (21D) en Maatschappij (23C) hebben er nul — zie bijlage A |
| Meet hij op het niveau van een groep-8-verlater? | ⚠ Gemengd | K1 te makkelijk (plafond), K3 toetst niet-onderwezen voorkennis (landelijk zwakste domein: 3,9/10), K2 kunstmatig makkelijk door hints; taal deels boven niveau 1F/A2 — zie §4 |
| Is de uitslag per leerling betrouwbaar? | ✗ Nee | 1-2 vragen per domein bij programmeren/welzijn; gokken loont (altijd-"Echt" = 60); herproberen alleen in K3; ongewogen middeling — zie §5 en bijlage B |
| Kan de docent er iets mee? | ⚠ Deels | Klas-radar + klas-advies: ja; per-leerling kan/kan-niet-uitspraken, export en reflectie-inzage ontbreken |
| Is de afname voor iedereen gelijk? | ✗ Nee | Verplicht op het spannendste moment (eerste login), verversen = alles kwijt, mobiel wezenlijk anders dan desktop — zie §7 |

## 4. Per kamer: wat het meet vs. wat het zou moeten meten

### Kamer 1 — Vergrendelde Laptop (claimt: digitale systemen, 21A)
**Wat het meet:** of een kind 8 bestandsnamen aan het juiste type kan koppelen (Werkstuk_Nederlands.docx → Documenten) door te slepen ([KamerVergrendeldeLaptop.tsx:25-41](../../src/features/assessment/escaperoom/KamerVergrendeldeLaptop.tsx)).
**Past het bij een kind uit groep 8?** Ja, en waarschijnlijk zelfs te makkelijk: praktische ICT-vaardigheden zijn landelijk het stérkste onderdeel bij basisschoolverlaters (5,7/10, Monitor PO 2023) en de woorden zijn alledaagse schooltaal. Verwacht een **plafond-effect**: veel leerlingen halen (bijna) alles goed, waardoor de kamer bovenin niets onderscheidt. Onderin geeft hij wél signaal.
**Grootste probleem (live bevestigd):** op een touchscreen is deze kamer vrijwel zeker niet correct te maken. De sleepfunctie gebruikt kale HTML5-drag zonder touch-ondersteuning, en het bedoelde klik-alternatief is feitelijk onbereikbaar: de eerste klik plaatst een bestand **altijd in de eerste map** (Documenten), en een geplaatst bestand is daarna niet meer aanklikbaar (alleen te verwijderen) — de wissel-logica bestaat in de code maar kan nooit draaien ([KamerVergrendeldeLaptop.tsx:83-89](../../src/features/assessment/escaperoom/KamerVergrendeldeLaptop.tsx#L83), mechanisme bevestigd door de Codex-tegencheck). Nergens staat uitleg over de bediening. *Controle op een echte telefoon wordt aanbevolen; de code laat geen werkende touch-route zien.*
**Verbetersuggestie:** klik-alternatief repareren (of touch-drag toevoegen) + één regel bedieningsuitleg; daarnaast 2-3 items die een ander stukje van 21A raken (bijv. een veilig wachtwoord kiezen — past bij het verhaal, dat nu belooft dat je "het wachtwoord vindt" maar nergens op uitloopt).

### Kamer 2 — Nepnieuwsfabriek (claimt: media & informatie 21B + AI 21D)
**Wat het meet:** bedoeld: echt van nep onderscheiden. Feitelijk: hint-labels lezen — bij elk bericht staan vóór het antwoorden labels in beeld ("Onbekende bron (.biz)", "Overdreven taal en hoofdletters", "Bekende, betrouwbare bron") die het antwoord grotendeels voorzeggen ([KamerNepnieuwsfabriek.tsx:164-173](../../src/features/assessment/escaperoom/KamerNepnieuwsfabriek.tsx#L164); live bevestigd met screenshot).
**Past het bij een kind uit groep 8?** Het onderwerp past goed. Maar door de hints én de karikaturale nepberichten ("De kinderen zijn DOLBLIJ en leren 500% sneller!!!") is de kamer kunstmatig makkelijk: hij onderscheidt vooral wie de hints niet leest. AI wordt niet gemeten — het is alleen het ónderwerp van twee berichten.
**Grootste probleem:** wie zonder na te denken overal "Echt" klikt scoort al 60 van de 100 (3 van de 5 berichten zijn echt). Live doorspelen vond bovendien dat de tekst op de "Nep"-knop **onzichtbaar** is (oranje tekst op oranje knop, `bg-lab-coral` + `text-lab-coral`, [KamerNepnieuwsfabriek.tsx:207-212](../../src/features/assessment/escaperoom/KamerNepnieuwsfabriek.tsx#L207)) — een leerling ziet één leesbare knop ("Echt") en één lege knop, wat antwoorden richting "Echt" duwt... precies het antwoord dat gratis punten oplevert.
**Verbetersuggestie:** hints pas ná het antwoord tonen, de knop-kleuren repareren, 1-2 subtielere berichten toevoegen. NB: de eindmeting-set heeft een ándere echt/nep-verhouding (2/3) dan de nulmeting (3/2), terwijl het codecommentaar "zelfde verhouding" belooft ([kamer2Data.ts:2-3](../../src/features/assessment/escaperoom/data/kamer2Data.ts)).

### Kamer 3 — Codekluis (claimt: digitale producten 22A + programmeren 22B)
**Wat het meet:** bedoeld: logisch ordenen van programmastappen + een passend digitaal product kiezen. Feitelijk fase 1: of het kind ooit programmeerles heeft gehad — de blokken gebruiken echte programmeersyntax ("ALS deur == open", inspringing) en fase 2 de termen "broncode" en ".py" ([KamerCodekluis.tsx:13-22,41-70](../../src/features/assessment/escaperoom/KamerCodekluis.tsx)).
**Past het bij een kind uit groep 8?** Nee. Programmeren is het zwákste domein van basisschoolverlaters (3,9/10, Monitor PO 2023), het was nooit een verplicht vak, en zelfs Nederlandse 14-jarigen scoren op dit denken significant ónder het internationale gemiddelde (ICILS 2023). Voor een instromer zonder programmeerles is "==" betekenisloos. Verwacht bij eerlijke afname een **bodem-effect** — maar de onbeperkte herkansing ([KamerCodekluis.tsx:310-317](../../src/features/assessment/escaperoom/KamerCodekluis.tsx#L310)) maskeert dat: doorzetters proberen tot de volgorde klopt en krijgen alsnog 100. De score is dus dubbel onbetrouwbaar: te laag voor wie het nooit zag, kunstmatig hoog voor wie bleef klikken.
**Grootste probleem:** deze kamer meet of de basisschool toevallig programmeerles gaf — niet wat het kind kan leren. Klein maar veelzeggend: na "Ga door" (met een gedeeltelijke score) opent fase 2 tóch met "Goed gedaan! Je hebt het alarmsysteem geprogrammeerd" ([KamerCodekluis.tsx:162](../../src/features/assessment/escaperoom/KamerCodekluis.tsx#L162)); en de kop zegt "Sleep de codeblokken" terwijl de bediening klikken is. Ook hier vond het live doorspelen onzichtbare tekst: de foutmelding na een verkeerde volgorde is oranje-op-oranje.
**Verbetersuggestie:** syntax vervangen door gewone taal ("ALS de deur opengaat → zet het alarm aan"), "broncode (.py)" schrappen, herkansingsbeleid gelijktrekken met de andere kamers.

### Kamer 4 — Datalek! (claimt: veiligheid & privacy 23A + data 21C)
**Wat het meet:** gevoelige gegevens herkennen (8 items, als enige kamer mét gok-aftrek — meettechnisch de netste kamer, [KamerDatalek.tsx:74-83](../../src/features/assessment/escaperoom/KamerDatalek.tsx#L74)) en de beste eerste actie kiezen bij een datalek.
**Past het bij een kind uit groep 8?** Het onderwerp wel, de taal niet helemaal: "datalek" en "BSN (burgerservicenummer)" worden nergens uitgelegd, terwijl een instromer op taalniveau 1F (vergelijkbaar met A2) zit. Een fout op het BSN-item kan dus woordkennis zijn, geen digitale onvaardigheid — en landelijk hangt de digitale-geletterdheidsscore aantoonbaar samen met leesvaardigheid (Peil.). "Dataverwerking" (21C) wordt hier overigens helemaal niet gemeten.
**Grootste probleem:** taal vervuilt de meting; de sleutel is op de randen streng (e-mailadres en volledige naam tellen als "fout vergeten" — daar valt didactisch over te twisten). Live bevestigd: de tussentekst juicht "Goed, je hebt de gevoelige gegevens geidentificeerd" ongeacht wat er is aangekruist (plus taalfout: "geïdentificeerd"), en de labels van aangekruiste items worden onzichtbaar (zelfde oranje-op-oranje-familie).
**Verbetersuggestie:** één regel kindertaal per moeilijk woord ("BSN: het persoonlijke nummer dat je van de overheid krijgt"), kleuren repareren, tussentekst neutraal maken.

### Kamer 5 — Het Dilemma (claimt: digitaal welzijn 23B + maatschappij 23C)
**Wat het meet:** één meerkeuzevraag over een vriend die online gepest wordt, plus een verplichte open reflectie die niet wordt gescoord ([KamerDilemma.tsx:15-40,62-79](../../src/features/assessment/escaperoom/KamerDilemma.tsx)).
**Past het bij een kind uit groep 8?** Het scenario is herkenbaar en de taal is goed. Qua toon de beste kamer.
**Grootste probleem:** een compleet domeincijfer ("Welzijn & Maatschappij: 75") hangt aan één antwoord — en de sleutel is discutabel: "eerst met je vriend praten" krijgt 100, "melden bij een leraar of vertrouwenspersoon" 75, terwijl veel scholen kinderen juist leren om pesten te mélden. Een kind dat precies doet wat de mentor leert, krijgt puntenaftrek. De rijkste informatie — de eigen redenering van het kind — telt niet mee en wordt (§8) ook nooit door iemand gelezen. "Vertrouwenspersoon" is bovendien formele taal voor deze leeftijd.
**Verbetersuggestie:** 2 scenario's toevoegen, "praten" en "melden" beide vol krediet geven, en de reflectie daadwerkelijk bij de docent laten aankomen.

### De eindmeting-variant (live ontdekt, in code bevestigd)
De eindmeting hoort dezelfde kamers met **nieuwe opgaven** te tonen (v2-vragensets bestaan in `data/kamer*Data.ts` en elke kamer ondersteunt ze). Maar `renderKamer()` geeft de variant nooit door aan de kamers ([EscaperoomNulmeting.tsx:366-381](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L366) — vijf ontbrekende `variant={variant}`-props), dus **de eindmeting stelt exact dezelfde vragen als de nulmeting**. Gevolg: "groei" is deels geheugeneffect en de tweede vragenset is dood gewicht. Na afloop krijgt de leerling bovendien geen GroeiPaspoort maar een permanente bouwplaats: *"Je GroeiPaspoort is bijna klaar. Vergelijking met je nulmeting volgt binnenkort."* ([EindmetingFlow.tsx:35-38](../../src/features/assessment/escaperoom/EindmetingFlow.tsx#L35); het GroeiPaspoort-component bestaat maar wordt nergens gerenderd).

## 5. Meetkwaliteit in gewone taal

1. **Een heel domein op één vraag (kamer 5).** Of een leerling het domein "welzijn" beheerst, hangt af van die ene vraag. Dat is alsof je de rekenvaardigheid van een kind beoordeelt met één enkele som: vul je die net verkeerd in, dan is het hele oordeel meteen onderuit. Eén vraag kan nooit een domein dekken; toeval speelt een veel te grote rol.
2. **Ongewogen gemiddelde over de vijf kamers.** De eindscore is een gewoon gemiddelde van de vijf kamerscores ([EscaperoomNulmeting.tsx:136](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L136)). Kamer 5 (één vraag) telt daardoor even zwaar als kamer 1 (acht opgaven). Vergelijk het met een rapport waarin het cijfer voor gym — één keer beoordeeld met een spelletje — net zo zwaar meetelt als wiskunde, opgebouwd uit acht toetsen.
3. **Gokken zonder correctie én hints die verklappen (kamer 2).** Wie overal "Echt" aanklikt scoort al 60 van de 100, en de hint-labels staan vóór het antwoorden in beeld. Dit is alsof je een verkeersexamen afneemt waarbij je vlak voor elke kruising het verkeersbord uitlegt en fout gokken niet bestraft wordt. Je meet dan niet of een kind nepnieuws begrijpt, maar of het hints kan lezen en durft te gokken.
4. **Onbeperkt opnieuw proberen in kamer 3, één kans elders.** Dat is alsof de ene leerling een proefwerk net zo lang mag herkansen tot hij een 10 heeft, terwijl een ander het in één keer goed moet doen. Twee leerlingen met "100" op kamer 3 kunnen totaal verschillende dingen hebben laten zien: meteen raak, of twintig pogingen.
5. **Zelfbedachte niveaugrenzen zonder landelijke norm.** De labels (Starter <40, Basis 40-74, Gevorderd ≥75) zijn eigen keuzes van het platform; de Onderwijsinspectie heeft expliciet géén streefniveaus vastgesteld (haar eigen peiling heet letterlijk een nulmeting). Het is alsof je zelf streepjes op een meetlat zet en zegt: onder de 40 ben je "beginner". De labels wekken een schijn van zekerheid die er niet is.
6. **Tegenstrijdige boodschap: "geen toets" tegenover scores en labels.** De intro zegt letterlijk *"Dit is geen toets — er zijn geen foute antwoorden"* ([EscaperoomNulmeting.tsx:227](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L227)), waarna elke beslissing goed/fout wordt gescoord en er een niveaulabel uitrolt. Dat is alsof je zegt "dit is gewoon een oefengesprek, niks officieels" en daarna een beoordelingssticker op het werk plakt. Verwarrend, en het ondermijnt vertrouwen.

## 6. Eerlijkheid: wie heeft voor- of nadeel?

Een instroom-meting moet elk kind een gelijke kans geven om te laten zien wat het kan. Op drie punten lukt dat nu niet:

**1. Voorkennis-nadeel: de programmeerkamer meet je oude school, niet jou.** Digitale geletterdheid — en programmeren in het bijzonder — was op de basisschool geen verplicht vak; het is landelijk het zwakste domein (3,9/10) en Nederland scoort er internationaal onder de maat (ICILS 2023). Of een kind "ALS deur == open" herkent, hangt er vooral van af of zijn basisschool toevallig een codeclub had. Twee kinderen met dezelfde aanleg krijgen zo een verschillend stempel, puur door hun schoolgeschiedenis.

**2. Taal-nadeel: wie minder goed leest, lijkt digitaal zwakker.** De landelijke peiling laat zien dat scores op digitale geletterdheid samenhangen met begrijpend lezen en woordenschat. Deze nulmeting versterkt dat: "BSN (burgerservicenummer)", "datalek" en "broncode" worden niet uitgelegd, terwijl een groep-8-verlater rond taalniveau 1F (vergelijkbaar met A2) zit — B1 wordt pas eind vmbo verwacht. Voor zwakke lezers en leerlingen met Nederlands als tweede taal is het aannemelijk (niet gemeten, wel logisch uit de taal-samenhang) dat een deel van hun "digitale achterstand" in werkelijkheid een leesdrempel is.

**3. Apparaat-nadeel: hetzelfde kind, ander apparaat, andere score.** Op een laptop sleep je de bestanden van kamer 1 vlot naar de juiste map; op een telefoon werkt HTML5-slepen niet en is het klik-alternatief kapot (alles belandt in de eerste map). Wie de meting op een telefoon of tablet maakt, kán kamer 1 simpelweg niet goed maken. Dit is geen subtiel nadeel maar een harde blokkade — en wie thuis geen laptop heeft (aanname, geen gemeten cijfer) loopt hier het eerst tegenaan.

**Waarom dit zwaar weegt:** de landelijke peiling laat óók zien dat 91% van de verschillen in digitale geletterdheid tussen individuele leerlingen zit (niet tussen scholen) én dat de spreiding enorm is (zwakste 10% haalt hooguit 43% van de punten, sterkste 10% minstens 82%). Grote individuele verschillen zijn dus normáál bij instroom. Juist dan moet een label als "Starter" een echte meting weerspiegelen — niet iemands oude school, leesniveau of telefoon.

## 7. Betrouwbaarheid van de afname

1. **Verplicht moment, direct bij de allereerste login.** De nulmeting blokkeert het complete dashboard tot hij af is; de enige uitweg is uitloggen ([AuthenticatedApp.tsx:380-402](../../src/app/AuthenticatedApp.tsx#L380)). Dit is alsof een nieuwe leerling op haar allereerste schooldag, nog vóór ze haar lokaal heeft gezien, meteen een proefwerk moet maken. Spanning en haast horen niet bij de vaardigheid die je wilt meten. (De eindmeting is wél sluitbaar — inconsistent.)
2. **Geen tussentijds opslaan — live bevestigd.** Pagina verversen halverwege = terug naar het intro-scherm, alles kwijt, zonder waarschuwing vooraf (voortgang staat alleen in het werkgeheugen van de browser, [EscaperoomNulmeting.tsx:48-49](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L48); opslag en `localStorage` aantoonbaar leeg). Voor een 11-jarige is dat alsof je bouwwerk wordt omgestoten en je opnieuw moet beginnen — en bij de tweede poging antwoordt een kind anders (slordiger of juist voorzichtiger).
3. **De "~15 minuten"-belofte is haalbaar — het risico zit elders.** Een schone doorloop kostte in de test ~5 minuten; de marge is dus ruim. Het echte tijdsrisico is opnieuw móéten beginnen (punt 2) en eindeloos herkansen in kamer 3.
4. **Mobiel versus desktop is geen nuance maar een breuk.** Zie §6, punt 3: kamer 1 is op touch vrijwel zeker niet correct te maken en nergens wordt bediening uitgelegd.

**Gevolg voor vergelijkbaarheid:** het ene kind zit rustig op een laptop, het andere maakt de meting gehaast op een telefoon direct na de eerste login — de labels meten dan mede omgeving, apparaat en moment, niet alleen digitale geletterdheid.

**Technische bevindingen uit het live doorspelen** (relevant voor QA, niet voor leerlingen in productie):
- In lokale ontwikkelmodus blokkeert kamer 1 → kamer 2 permanent door een bekend React-antipatroon: een `mountedRef` die door StrictMode (aan in [main.tsx:22](../../src/main.tsx#L22)) definitief op `false` komt te staan ([EscaperoomNulmeting.tsx:53-60](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L53) + guard op regel 107). In productie (zonder StrictMode-dubbelmontage) treedt dit niet op — leerlingen ronden de nulmeting aantoonbaar af — maar het patroon hoort opgeruimd en blokkeert nu elke lokale QA.
- Een familie "onzichtbare tekst"-bugs door gelijke kleur-tokens op tekst én achtergrond (`bg-lab-coral`+`text-lab-coral`; gradient `from-lab-sage to-lab-sage`): de Nep-knop (K2), de foutmelding (K3), aangekruiste labels (K4), het icoon op het eindmeting-eindscherm. Deze staan gewoon in productie. Ook: alle voortgangsbalkjes op het resultaatscherm hebben dezelfde kleur ongeacht score ([EscaperoomNulmeting.tsx:327-333](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L327)) en 2 van de 5 aslabels van het spinnenweb worden afgekapt ("/elzijn").

## 8. Data, privacy en beloftes

**Wat goed geregeld is:**
- Docenten zien alleen resultaten van hun **eigen school** — in mei-juni 2026 expliciet aangescherpt voor alle relevante tabellen ([20260505120000](../../supabase/migrations/20260505120000_teacher_dashboard_school_scope_hardening.sql), [20260509165658:395-401](../../supabase/migrations/20260509165658_security_report_core_auth_rls.sql)).
- De AI-groeiaanbeveling is pas zichtbaar voor de leerling na docent-goedkeuring, via een beveiligde route met logboekregistratie — netjes in lijn met menselijk toezicht (AI-verordening).
- Een leerling met een verwerkingsbeperking (AVG-recht) kan geen nieuwe meetresultaten wegschrijven ([20260625151836](../../supabase/migrations/20260625151836_enforce_processing_restriction.sql)).
- Het klasoverzicht verbergt gemiddelden bij minder dan 5 leerlingen — al is dat alleen in het scherm geregeld, niet in de databank.

**Wat niet klopt:**
1. **De reflectie-belofte aan het kind is drievoudig gebroken.** Het kind typt verplicht een persoonlijke reflectie over een pestsituatie en leest: "Je reflectie wordt bewaard zodat je docent het kan lezen" ([KamerDilemma.tsx:167-169](../../src/features/assessment/escaperoom/KamerDilemma.tsx#L167)). Feitelijk: (a) de nulmeting slaat nooit op in de tabel die daarvoor gebouwd is — `saveNulmetingResult` heeft nul aanroepers ([nulmetingService.ts:97](../../src/services/nulmetingService.ts#L97)); het resultaat gaat alleen naar het gebruikersprofiel ([AuthenticatedApp.tsx:381-393](../../src/app/AuthenticatedApp.tsx#L381)); (b) zelfs bij de eindmeting, die wél naar de databank schrijft, komt de reflectie in de verkeerde sleutel terecht — de code bewaart `reflectieTekst`, de opslag zoekt `reflectie` ([assessmentService.ts:78](../../src/services/assessmentService.ts#L78) vs [KamerDilemma.tsx:75](../../src/features/assessment/escaperoom/KamerDilemma.tsx#L75)) — dus het speciale reflectie-veld blijft altijd leeg; (c) geen enkel docentscherm toont een reflectie (0 treffers op "reflectie" in `src/features/teacher/`). Er wordt dus gevoelige kindertekst verzameld die **niemand ooit gebruikt** — dat wringt met de belofte én met dataminimalisatie (alleen verzamelen wat je gebruikt). Kies: repareren en tonen, of stoppen met verzamelen en de belofte-zin weghalen.
2. **De groeivergelijking is voor nieuwe cohorten structureel leeg.** De docent-groeiweergave leest de nulmeting uit de databanktabel ([GrowthOverviewPanel.tsx:42](../../src/features/teacher/GrowthOverviewPanel.tsx#L42) → `getKlasGroeiData`, [assessmentService.ts:217-247](../../src/services/assessmentService.ts#L217)), maar de app schrijft nulmetingen daar nooit heen — alleen het oude cohort staat erin via een eenmalige overzetting (schooljaar 2025, [20260403100000:91-149](../../supabase/migrations/20260403100000_assessment_results.sql)). Elke leerling die vanaf nu de nulmeting doet, krijgt straks een lege groeivergelijking. (Het nulmeting-tabblad van de docent werkt wél — dat leest uit het profiel, [TeacherDashboard.tsx:772-777](../../src/features/teacher/TeacherDashboard.tsx#L772).)
3. **De AVG-inzage-export pakt de verkeerde bron.** "Download mijn gegevens" exporteert de nulmeting uit de (altijd lege) tabel ([exportMyData/index.ts:85,120](../../supabase/functions/exportMyData/index.ts#L85)); de echte resultaten staan in het profiel. Een leerling die inzage vraagt krijgt zijn nulmetingdata dus niet (of alleen indirect) mee.
4. **Een dode tabel met echte leerlingdata blijft staan.** `nulmeting_results` bevat overgezette resultaten van het 2025-cohort, wordt door niets beschreven en door vrijwel niets gelezen. Zonder opruim- of bewaarbeleid blijft die kinderdata onbeperkt staan → opschonen of archiveren, met korte jurist-check (bewaartermijn).
5. **Geen bewaartermijn gezien** voor assessment-resultaten in de bekeken migraties — punt voor verwerkingsregister/FG, geen acute fout.

**Advies:** bevindingen 1 en 4 kort langs de jurist/FG; de rest is bouwwerk.

## 9. Fixlijst (P0 = misleidend label, gebroken kindbelofte of kapotte kernfunctie)

> **Statusupdate (2 juli 2026, zelfde PR):** P0-1 t/m P0-7 én P1-16 zijn uitgevoerd en live geverifieerd (build groen; playthrough desktop + mobiel, beide varianten). Daarbij extra ontdekt en meegefixt: de dev-preview-route laadde het app-stylesheet niet (waardoor sommige kleurklassen alléén dáár niet renderden — productie had dit probleem niet) en de kamer-3-productteksten verwezen in de eindmeting nog naar het nulmeting-scenario ("alarmsysteem"). Nieuw P1-punt uit de verificatie: de volgorde-sleutel van kamer 3 keurt een logisch gelijkwaardige blokvolgorde af (TOON/ZET binnen het ALS-blok moet exact de sleutel volgen) — meenemen bij P1-9. Nog open: P1-8 t/m P1-15, P1-17 en alle P2-items.

> **Statusupdate 2 (2 juli 2026, zelfde PR):** ook P1-8 t/m P1-15, P1-17, P2-18, P2-19, P2-20 en het gros van P2-22 zijn uitgevoerd en live geverifieerd: hints pas ná het antwoord (K2), kamer 3 zonder programmeersyntax, mét gelijkwaardige-volgorde-sleutel (ZET/TOON beide goed) en zonder herkansing ná het scoren (Reset blijft beschikbaar tijdens het bouwen), BSN/datalek in kindertaal, "melden bij een leraar" volle punten, gewogen eindscore naar meetpunten 8/5/2/9/1 (narekening klopt op beide varianten), eerlijke intro-tekst ("geen toets voor een cijfer"), hervatten na verversen (voortgang per kamer, gewist na afronden), radar-labels binnen beeld, GroeiPaspoort rendert nu écht na de eindmeting (dode stub weg), periode-toetsjes heten "Periodetoets N", en de AVG-export leest ook `assessment_results` (code klaar; edge-deploy volgt na merge). Bewust nog open: P2-21 (dode tabel — wacht op jurist), P2-23 (type-generatie), de K2 v1/v2-verhouding (auteurskeuze), de onderbouwing van de niveaugrenzen 40/75, de echte-toestel-check en de twee jurist-flags uit §8.

### P0
1. **Eindmeting-vragenset activeren:** geef `variant={variant}` door aan alle 5 kamers in `renderKamer()` — [EscaperoomNulmeting.tsx:366-381](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L366). *Zonder dit meet de eindmeting met identieke vragen en is "groei" deels geheugeneffect.*
2. **Mobiele bediening kamer 1 repareren:** klik-alternatief bereikbaar maken (de wissel-logica bestaat, maar geplaatste bestanden zijn niet meer aanklikbaar; alles belandt in map 1) of echte touch-ondersteuning toevoegen + één regel bedieningsuitleg — [KamerVergrendeldeLaptop.tsx:83-89](../../src/features/assessment/escaperoom/KamerVergrendeldeLaptop.tsx#L83). *Nu kan een leerling op een telefoon deze kamer niet goed maken.* Eerst op een echt toestel verifiëren.
3. **Nulmeting óók in de databank opslaan** (`saveAssessmentResult(..., 'nulmeting', ...)` in `handleNulmetingComplete`) — [AuthenticatedApp.tsx:381-393](../../src/app/AuthenticatedApp.tsx#L381). *Repareert het lege groeirapport voor alle nieuwe cohorten én de export-bron (samen met fix 4/9.3).*
4. **Reflectie-belofte waarmaken of intrekken:** sleutel `reflectie` → `reflectieTekst` ([assessmentService.ts:78](../../src/services/assessmentService.ts#L78)) + reflectie tonen in het docent-leerlingvenster, óf de belofte-zin verwijderen ([KamerDilemma.tsx:167-169](../../src/features/assessment/escaperoom/KamerDilemma.tsx#L167)).
5. **Onzichtbare teksten repareren** (zelfde-kleur-tokens): Nep-knop [KamerNepnieuwsfabriek.tsx:207-212](../../src/features/assessment/escaperoom/KamerNepnieuwsfabriek.tsx#L207), K3-foutmelding [KamerCodekluis.tsx:292-296](../../src/features/assessment/escaperoom/KamerCodekluis.tsx#L292), K4-geselecteerde labels, eindmeting-icoon [EindmetingFlow.tsx:32](../../src/features/assessment/escaperoom/EindmetingFlow.tsx#L32), resultaat-balkjes [EscaperoomNulmeting.tsx:327-333](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L327). *De onzichtbare Nep-knop duwt antwoorden richting "Echt" — dat vertekent de meting.*
6. **Welzijn-domein niet als los cijfer tonen** zolang het op één vraag rust: markeer als "indicatie" of voeg 2 scenario's toe — [KamerDilemma.tsx](../../src/features/assessment/escaperoom/KamerDilemma.tsx), [DigitaalPaspoort/Teacher](../../src/features/assessment/escaperoom/DigitaalPaspoortTeacher.tsx).
7. **Niveaulabel-presentatie aan het kind verzachten:** geen "Starter"-stempel bij eerste login; formuleer als startpunt ("Dit is jouw startfoto — hier ga je groeien") — [EscaperoomNulmeting.tsx:300-303](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L300), DigitaalPaspoort.

### P1
8. K2-hints pas ná het antwoord tonen ([KamerNepnieuwsfabriek.tsx:164-173](../../src/features/assessment/escaperoom/KamerNepnieuwsfabriek.tsx#L164)).
9. K3 zonder programmeersyntax/jargon, of expliciet als ongescoorde kennismaking ([KamerCodekluis.tsx](../../src/features/assessment/escaperoom/KamerCodekluis.tsx)); herkansingsbeleid gelijktrekken (regel 310-317).
10. K4-jargon uitleggen in kindertaal (BSN, datalek) ([KamerDatalek.tsx:14-23,116](../../src/features/assessment/escaperoom/KamerDatalek.tsx)).
11. K5-sleutel herzien: "melden bij een leraar" en "eerst praten" beide vol krediet ([KamerDilemma.tsx:15-40](../../src/features/assessment/escaperoom/KamerDilemma.tsx#L15)).
12. Overall-score wegen naar aantal opgaven, of geen overall-label; grenzen 40/75 onderbouwen of als "indicatief" labelen ([EscaperoomNulmeting.tsx:136-138](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L136)).
13. Intro-copy eerlijk maken: schrap "er zijn geen foute antwoorden" ([EscaperoomNulmeting.tsx:227](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L227)).
14. Tussentijds opslaan per kamer (bijv. localStorage) zodat verversen niet alles wist ([EscaperoomNulmeting.tsx:48-49](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L48)).
15. AVG-export uit de juiste bron laten lezen ([exportMyData/index.ts:85](../../supabase/functions/exportMyData/index.ts#L85); wordt deels opgelost door P0-3).
16. `mountedRef`-antipatroon vervangen (blokkeert alle lokale QA onder StrictMode) ([EscaperoomNulmeting.tsx:53-60](../../src/features/assessment/escaperoom/EscaperoomNulmeting.tsx#L53)).
17. Spinnenweb-aslabels niet afkappen (DigitaalPaspoort radar).

### P2
18. `KAMER_KERNDOELEN` echt aansluiten op de docent-SLO-weergave of verwijderen (dode claim, [types.ts:55-61](../../src/features/assessment/escaperoom/types.ts#L55)).
19. GroeiPaspoort renderen na de eindmeting of verwijderen; "volgt binnenkort"-stub weg ([EindmetingFlow.tsx:28-48](../../src/features/assessment/escaperoom/EindmetingFlow.tsx#L28)).
20. Naamgeving ontwarren: periode-toetsjes niet "Nulmeting Periode N" noemen ([slo-kerndoelen-mapping.ts:41-91](../../src/config/slo-kerndoelen-mapping.ts#L41)).
21. Dode tabel `nulmeting_results` opschonen/archiveren ná P0-3 (jurist-check bewaartermijn).
22. Copy-fixes: K1-verhaal ("wachtwoord") afmaken of schrappen; K2 v1/v2-verhouding gelijktrekken ([kamer2Data.ts:2-3](../../src/features/assessment/escaperoom/data/kamer2Data.ts)); "geidentificeerd" → "geïdentificeerd" + neutrale tussentekst ([KamerDatalek.tsx:118](../../src/features/assessment/escaperoom/KamerDatalek.tsx#L118)); K3 "Sleep" → "Klik" + productfase-intro niet laten juichen na falen ([KamerCodekluis.tsx:162,228](../../src/features/assessment/escaperoom/KamerCodekluis.tsx#L162)).
23. `as any`-casts op de assessment-tabellen vervangen door gegenereerde types ([assessmentService.ts:12-13](../../src/services/assessmentService.ts#L12)).

**Aanbevolen volgorde:** P0-1 t/m P0-5 vóór de volgende afnameronde (instroom schooljaar 2026-2027); P0-6/7 + P1 in dezelfde sprint; P2 als opruimwerk.

## 10. Bijlagen

### A. Dekkingsmatrix: 9 SLO-kerndoelen × kamers × echte meetpunten

| SLO-kerndoel (VO-onderbouw) | Kamer die het claimt | Eigen meetpunten | Wat er feitelijk gemeten wordt |
|---|---|---|---|
| 21A Digitale systemen | K1 | 8 | Bestandstypen herkennen en in mappen plaatsen |
| 21B Media & informatie | K2 | 5 (gedeeld met 21D) | Echt/nep-oordeel — met vooraf zichtbare hints |
| 21C Data & dataverwerking | K4 (alleen label) | 0 | Niets — K4 meet privacy-herkenning, geen dataverwerking |
| 21D AI | K2 (alleen label) | 0 | Niets eigenstandigs — AI is slechts onderwerp van 2 berichten |
| 22A Digitale producten | K3 fase B | 1 | Eén meerkeuzevraag (productkeuze) |
| 22B Programmeren | K3 fase A | 1 (samengesteld: 6-bloks volgorde) | Pseudo-code ordenen; onbeperkt herproberen |
| 23A Veiligheid & privacy | K4 | 9 | Gevoelige gegevens aankruisen + actie kiezen |
| 23B Digitaal welzijn | K5 | 1 | Eén cyberpest-meerkeuzevraag |
| 23C Maatschappij | K5 (alleen label) | 0 | Dezelfde ene vraag telt voor beide kerndoelen |

De code-constante `KAMER_KERNDOELEN` claimt 9/9-dekking "voor voortgangsrapportage in het docentdashboard" maar wordt nergens gebruikt, en 3 kerndoelen hebben nul eigen meetpunten.

### B. Rapporteerbaarheid per domein (vuistregel: <4-5 opgaven = geen los cijfer tonen)

| Gerapporteerd domein | Opgaven | Bijzonderheden | Verdict |
|---|---|---|---|
| Digitale systemen (21A) | 8 | prestatietaak, geen gokcorrectie | Scoorbaar als indicatie |
| Media & AI (21B/21D) | 5 | binair; hints verklappen; altijd-"Echt" = 60 | Hooguit indicatief |
| Programmeren (22A/22B) | 2 | onbeperkt herproberen + 1 meerkeuze | Niet rapporteerbaar als cijfer |
| Veiligheid & privacy (23A/21C) | 9 | enige kamer mét gokcorrectie; weging 60/40 | Scoorbaar als indicatie |
| Welzijn & maatschappij (23B/23C) | 1 | één meerkeuzevraag; reflectie ongescoord | Niet rapporteerbaar als cijfer |
| **Overall + niveaulabel** | 25 | ongewogen middeling; zelfgekozen grenzen 40/75 | Alleen met zware kanttekening; als individueel label niet verdedigbaar |

### C. Benchmark groep-8-instroom (alle regels zelf geverifieerd op de bronpagina)

| Feit | Bron |
|---|---|
| Kerndoelen DG basisonderwijs = "definitieve conceptkerndoelen" (sept 2025), nog niet in de wet → geen garantie op eerdere DG-les | [SLO](https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/actualisatie-kerndoelen/definitieve-conceptkerndoelen-digitale/) |
| Docenten PO geven digitale geletterdheid leerlingen een 4,7 (2023; was 6,0 in 2021) | [Monitor Digitale Geletterdheid PO 2023](https://expertisepuntdigitalegeletterdheid.nl/@24107/monitor-digitale-geletterdheid-po-2023/) |
| Sterkste PO-domein: praktische ICT (5,7/10); zwakste: computational thinking (3,9/10) | idem |
| Peiling eind PO: gemiddeld 67% van de punten; zwakste 10% ≤43%, sterkste 10% ≥82%; "geen prestatiestandaarden... een nulmeting" | [Onderwijsinspectie, Peil. prestaties](https://www.onderwijsinspectie.nl/onderwerpen/peil-onderwijs/peil.digitale-geletterdheid-po/onderzoeksresultaten-in-het-kort/prestaties-digitale-geletterdheid) |
| 9% van de verschillen tussen klassen/scholen; 91% tussen leerlingen; samenhang met begrijpend lezen/woordenschat en schooladvies | [Onderwijsinspectie, Peil. verschillen](https://www.onderwijsinspectie.nl/onderwerpen/peil-onderwijs/peil.digitale-geletterdheid-po/onderzoeksresultaten-in-het-kort/verschillen-in-digitale-geletterdheid) |
| NL 14-jarigen: rond int. gemiddelde op computer-/informatievaardigheden, significant erónder op computational thinking | [ICILS 2023](https://www.icils2023.nl/resultaten-internationaal-peilingsonderzoek-digitale-geletterdheid-icils-2023/) |
| Eind groep 8 = referentieniveau 1F (≈A2, vergelijkbaar maar niet identiek); B1 ≈ 2F = eind vmbo | [Rijksoverheid referentieniveaus](https://www.rijksoverheid.nl/onderwerpen/basisvaardigheden/referentieniveaus-taal-en-rekenen), [Stichting Lezen & Schrijven](https://www.lezenenschrijven.nl/sites/default/files/2020-08/Verschil_in_niveau-aanduidingen_Nederlandstaligen_en_anderstaligen_LS_V201701.pdf) |
| Schrijfrichtlijn 10-12 jr: zinnen ~10-12 woorden, geen formele woorden | [Netwerk Mediawijsheid](https://netwerkmediawijsheid.nl/8-vuistregels-om-begrijpelijke-teksten-voor-kinderen-te-schrijven/) |

*Integriteitsnoot: vier claims uit het bronnenonderzoek sneuvelden bij handmatige verificatie en zijn bewust NIET gebruikt (o.a. een SES/NT2-uitsplitsing in Peil. en een wettelijke invoeringsdatum).*

### D. Methode & bewijs
- **Code-verificatie:** elke feitelijke claim in dit rapport is door de eindredacteur zelf in de broncode nagelezen (file:line bij elke claim); "bestaat niet"-claims zijn met eigen zoekopdrachten bevestigd.
- **Live doorspelen:** beide varianten, desktop (1280×800) en mobiel viewport (375×812), via een nieuwe DEV-only route `/dev/nulmeting-preview` (geen login, geen database-writes; route is mee-gecommit). Screenshots staan lokaal in `.playwright-mcp/` (bewust niet gecommit). Kanttekening: door de StrictMode-blokkade (§7) is kamer 2-5 bereikt via React-state-injectie; het mobiele sleep-oordeel is code-gebaseerd en verdient een echte-toestel-check.
- **Benchmarkonderzoek:** webresearch met bronverificatie per regel (bijlage C).
- **Rubric-lens (docs/pedagogy/rubric.md, indicatief — gebouwd voor missies):** V1 authenticiteit ⚠ · V3 denkorde ⚠/✗ · V5 competentie-signaal ✗ · V6 feedbackdiepte ⚠ · V7 leerbaar bewijs ⚠ (de reflectie ís bewijs, maar telt niet en wordt niet gelezen).
- **Modelinzet:** analyse/oordeel/eindredactie: Fable (high) · playthrough: Sonnet-subagent · benchmark-research: Sonnet-subagent (websearch) · §5/§7-concepten: DeepSeek Pro (high), volledig gereviewd en op 3 punten gecorrigeerd · kamer-oordelen/§6: Fable (DeepSeek weigerde deze prompt structureel) · tegencheck: Codex — geen MAJOR-bezwaren; alle dragende claims (a-h: variant-bug, klik-fallback, schrijfpad, reflectie-sleutel, groei-bron, StrictMode-scope, scoring, export-bron) bevestigd; één mechanisme-formulering (K1-klikgedrag) op zijn aanwijzing aangescherpt.
- **Blinde vlek gedicht:** dit is de eerste kwaliteitscontrole ooit op dit onderdeel — de batch-review (98 missies), taalniveau-audit (97), UI/UX-review (109) en missie-inventaris ("excl. assessments") sloten de escaperoom allemaal structureel uit.
