## Opdracht Live Check: cloud-cleaner

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=cloud-cleaner

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (verse start, serieus meespelen, 1 bewuste fout, viewport-matrix)
- Start: OneDrive-bestandsbeheer-interface met 9 bestanden en 6 mappen, doel duidelijk zichtbaar bovenaan.
- Flow: bestand selecteren (klik) → map aanklikken → correcte plaatsing geeft +10 XP en een multiple-choice reflectievraag ("Even nadenken over..."); foutieve plaatsing wordt afgekeurd (fout-teller +1, bestand blijft liggen). Bewuste fout op Meme_Collectie.zip in "Nederlands": correct afgekeurd. Tweede poging "School Algemeen": ook afgekeurd (onverwacht — zie WARN). Derde poging "Privé & Foto's": correct.
- Feedback: multiple-choice reflectievragen na élke juiste plaatsing zijn goed en on-topic (schoolvak-redenering, privacy-redenering, cybersecurity-redenering bij verdachte bestanden). Geen tekstuele foutmelding bij foutieve plaatsing, alleen impliciete fout-teller.
- Eind: alle 9 bestanden verwerkt, 90/90 XP, 2 fouten. Eindscherm "Opgeruimd Staat Netjes!" verschijnt, maar **Voltooien-knop doet niets** (2x getest).
- Viewport-matrix: tablet-portrait (810×1080) toont een responsive drawer-patroon voor de mappen-sidebar; tablet-landscape (1080×810) en mobile (390×844) tonen consistent dezelfde Voltooien-blocker op het eindscherm.

**Speedrunner** (klikt snel, geen nadenken, eerste optie, probeert te skippen)
- Systeem accepteerde geen zinloze input: foutieve map-plaatsingen (incl. een verdacht .exe-bestand in een gewone map dumpen) werden steeds afgekeurd, score bleef gelijk, fout-teller liep op. Geen scoring-exploit gevonden.
- "Overslaan"-knop op reflectievragen werkt correct (sluit modal, geen straf/bonus).
- Eind: 90/90 XP, 3 fouten. **Zelfde Voltooien-blocker reproduceert.**

**Chaoot** (dubbelklikken, conflicterende kliks, reload midden in stap, back/vooruit)
- Dubbelklikken op bestanden/mappen/knoppen: geen crash, geen dubbele state-mutatie.
- Snelle conflicterende bestand-selecties: nette override (laatste klik wint), geen dubbele selectie.
- Reload midden in een selectie-stap (2x): voortgang (score/fouten/resterende bestanden) persisteert correct, geen dataverlies, geen ongecontroleerde fout-oploop.
- Geen tekstvelden aanwezig in deze missie (0 input/textarea) — "onzin+emoji"-tactiek niet van toepassing.
- Eind: 90/90 XP, 2 fouten. **Zelfde Voltooien-blocker reproduceert (3e keer), ook na dubbelklik-gedrag.**

**Vastloper** (≥3x dezelfde fout, zoekt hulp)
- 3x achtereen identiek fout ("Nederlands") op Meme_Collectie.zip, daarna een 4e andere foute poging ("School Algemeen"): **geen hint, geen aanwijzing, geen highlight verscheen ooit** — alleen een oplopende fout-teller (1→2→3→4).
- Herhaald op een 2e bestand (Boekverslag_NL.docx → "Wiskunde"): zelfde patroon, geen hint bij 5e fout totaal.
- Positief: **geen harde lock-out**. De leerling kan onbeperkt doorproberen; uiteindelijk correcte plaatsing werkt altijd, en de missie blijft volledig afmaakbaar.
- Eind: 90/90 XP ondanks 5 fouten totaal — geen strafpunten, geruststellende afsluittekst "5 foutjes gemaakt, maar dat geeft niet!". **Zelfde Voltooien-blocker reproduceert (4e keer, over alle profielen).**

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
- Duidelijke, opgeruimde OneDrive-nabootsing met herkenbare bestandstype-iconen; verdachte bestanden krijgen een consistente rode waarschuwings-styling (rode rand + uitroepteken-icoon) die al vóór selectie zichtbaar is — goed signaal voor cybersecurity-bewustzijn.
- Score-widget (XP + voortgangsbalk + fout-teller) linksonder blijft de hele sessie zichtbaar en actueel.
- Op tablet-portrait (810×1080) verandert de vaste sidebar in een overlay-drawer die je opent via een floating knop linksonder; deze knop mist een accessible naam (geen aria-label), en de open drawer onderschept clicks op het bestandenraster totdat hij weer gesloten wordt.
- Op mobile (390×844) wordt de header enigszins afgesneden (elementen overflowen de viewport-breedte), maar de kern-modals (reflectievraag, eindscherm) zijn zelf goed responsive.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ start.png | ✅ feedback.png (dient ook als flow) | ✅ feedback.png | ✅ eind.png (Voltooien-blocker) |
| tablet-portrait (810×1080) | — niet apart vastgelegd | ✅ flow.png / flow-2.png / flow-3.png (drawer-overlay) | — niet apart vastgelegd | — (zie tablet-landscape voor evenknie) |
| tablet-landscape (1080×810) | — niet apart vastgelegd | — niet apart vastgelegd | — niet apart vastgelegd | ✅ eind.png (Voltooien-blocker) |
| mobile (390×844) | — niet apart vastgelegd | — niet apart vastgelegd | — niet apart vastgelegd | ✅ eind.png (Voltooien-blocker, header overflow) |

*Beperking: de viewport-matrix is uitgevoerd op de sleutelmomenten "flow" (tablet-portrait) en "eind" (alle 3 non-desktop viewports), maar niet meer met terugwerkende kracht op "start" en "feedback" voor tablet-landscape/mobile — de speelsessie was op dat moment al voorbij die stappen. Desktop dekt alle 4 states.*

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **[BLOCK]** Voltooien-knop op het eindscherm "Opgeruimd Staat Netjes!" doet niets bij klik. Reproduceert consistent in **alle 4 profielen** (Modelleerling, Speedrunner, Chaoot, Vastloper) en op **alle 4 geteste viewports** (desktop, tablet-portrait, tablet-landscape, mobile). Root-oorzaak (browser-observatie, geen code-analyse): de laatste reflectievraag-modal en het voltooiingsscherm renderen **gelijktijdig in de DOM** op hetzelfde moment; het voltooiingsscherm ligt visueel overheen met een hogere z-index/backdrop en onderschept alle klikken, maar de onderliggende reflectievraag-modal (technisch nog aanwezig, optisch verborgen) lijkt de klik op "Voltooien" op te vangen zonder er iets mee te doen. Geen console-errors, geen netwerkfouten. **Leerling voltooit de missie inhoudelijk (90/90 XP) maar zit vast op het eindscherm zonder duidelijke terugweg naar het opdrachtenoverzicht.**
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/cloud-cleaner/modelleerling/desktop/eind.png`, `.../vastloper/desktop/eind.png`, `.../modelleerling/tablet-landscape/eind.png`, `.../modelleerling/mobile/eind.png`

2. **[WARN]** Geen hint-functie of escalerende hulp na herhaalde fouten. Als Vastloper 5x achtereen fout gegokt (3x identiek, 2x verschillend) zonder dat ooit een hint, aanwijzing of visuele highlight van de juiste map verscheen — alleen een oplopende fout-teller. Voor de doelgroep (12-15 jaar) kan dit frustrerend zijn bij een lastig bestand zoals Meme_Collectie.zip. Positief tegenwicht: geen harde lock-out, de missie blijft volledig afmaakbaar en geeft zelfs volle XP ondanks fouten.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/cloud-cleaner/vastloper/desktop/flow.png`

3. **[WARN]** Overlay-conflict tussen de laatste reflectievraag-modal en het voltooiingsscherm (technische kant van bevinding 1) — beide zijn tegelijk in de a11y-tree aanwezig, wat duidt op een render-race rond het moment dat het laatste bestand wordt geplaatst.
   Bewijs: a11y-snapshot in sessielog (geen los screenshot, zie bevinding 1's evidence voor het visuele resultaat)

4. **[WARN]** Mappen-toggle-knop op tablet-portrait (opent de mappen-sidebar als overlay op smal scherm) mist een accessible naam/aria-label — de knop verschijnt in de a11y-tree als anoniem `button` zonder tekst. Daarnaast onderschept de geopende overlay clicks op het bestandenraster totdat hij weer wordt gesloten, wat een extra tik kost die op desktop niet nodig is.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/cloud-cleaner/modelleerling/tablet-portrait/flow-2.png`

5. **[INFO]** Meme_Collectie.zip heeft een plausibele-maar-foute afleider: zowel "Nederlands" als "School Algemeen" worden afgekeurd vóór de correcte map "Privé & Foto's" wordt gevonden. "School Algemeen" is voor een leerling een redelijke gok voor een niet-vak-specifiek bestand, en het ontbreken van directe foutfeedback (geen tekst, alleen de fout-teller) maakt niet duidelijk waaróm dat fout is.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/cloud-cleaner/modelleerling/desktop/feedback.png`

6. **[INFO]** Systeem is robuust tegen speedrun- en chaosgedrag: geen scoring-exploits, geen crashes bij dubbelklikken/snelle conflicterende kliks/reload-midden-in-stap, voortgang persisteert correct over meerdere reloads.
   Bewijs: sessielog (console/network-drains, geen JS-errors behalve een onschuldige font-preload-waarschuwing die los staat van deze missie)

### Nog onzeker
- De exacte technische oorzaak van bevinding 1 (waarom de reflectie-modal en het voltooiingsscherm gelijktijdig renderen) is niet onderzocht — dit rapport beschrijft alleen het waargenomen browsergedrag, geen code-analyse (conform opdracht).
- Niet getest: wat er gebeurt als een leerling de pagina handmatig sluit/ververst nádat hij vast zit op het Voltooien-scherm — of de voltooiing dan als "afgerond" wordt vastgelegd richting een eventueel dashboard/docentoverzicht, ondanks de niet-functionerende knop.
- Start- en feedback-viewport-screenshots op tablet-landscape en mobile ontbreken (zie beperking bij de bewijstabel) — desktop dekt deze states wel volledig.
