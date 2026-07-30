## Opdracht Live Check: layout-doctor

**Advies:** herontwerp · **Risico:** Rood · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=layout-doctor

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Start toont Casus 1/4: Word-document met een afbeelding waar de tekst dwars doorheen loopt (bewust rommelig, past bij de klacht van "Meneer Jansen"). Opdracht: tekstomloop op 'Vierkant' zetten en het plaatje naar rechts slepen. Bij het proberen de afbeelding te selecteren (klik, dubbelklik, hover) blijft een overlappende `<div>` alle pointer-events onderscheppen — de afbeelding is niet aan te klikken. Bij het tabblad Indeling staat de knop 'Vierkant' bevestigd `disabled`, want zonder selectie kan de tekstomloop niet gewijzigd worden. Geen "feedback" of "eind" bereikt: de missie stopt hard op Casus 1/4, stap 1.

**Speedrunner** — Zelfde blocker, direct getroffen. Klikte snel door Bestand-menu (Nieuw/Openen/Opslaan, geen skip-route) en andere ribbon-tabs; geen enkele manier gevonden om de selectie/tekstomloop-stap te omzeilen. Geen voortgang mogelijk.

**Chaoot** — Dubbelklik-spam op meerdere ribbon-tabs, undo/redo-spam, reload midden-in-sessie, back-navigatie: alles bleef stabiel, geen crash, geen corrupte staat, console/network schoon. De 'Verwijder'-knop (afbeelding verwijderen) bleek ook correct `disabled` zonder selectie — consistent gedrag, geen exploit gevonden om de blocker te omzeilen.

**Vastloper** — 3× identieke poging om de afbeelding te selecteren, telkens dezelfde timeout. De statische tip ("Selecteer het plaatje en kijk bij 'Indeling' naar 'Tekstomloop'") verandert niet en er verschijnt geen extra/adaptieve hulp na herhaald falen. Omdat het beschreven pad zelf niet uitvoerbaar is, loopt de leerling hier permanent en oplosbaar vast.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
- Desktop (1440x900) en tablet (810x1080, 1080x810): ribbon en documentgebied ogen normaal, geen afgekapte elementen in de a11y-snapshot.
- Mobiel (390x844): de Word-ribbon wordt afgekapt (tabs Verzendlijsten/Controleren/Beeld vallen buiten beeld) en het documentgebied met de afbeelding schuift grotendeels van het scherm. Geen zichtbare horizontale scroll-affordance voor het canvas.
- De casus-content zelf (klacht, opdracht, tip, docent-avatar) blijft op alle viewports leesbaar en compleet.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| Desktop 1440x900 | ✅ evidence/modelleerling/desktop/start.png | ✅ evidence/modelleerling/desktop/flow.png (blocker zichtbaar) | ✅ evidence/vastloper/desktop/feedback.png | ✅ evidence/modelleerling/desktop/eind.png (= blocker-staat, geen echte afronding bereikt) |
| Tablet portrait 810x1080 | ✅ evidence/modelleerling/tablet-portrait/start.png | — (blocker is viewport-onafhankelijk, niet apart getest) | — | ✅ evidence/modelleerling/tablet-portrait/eind.png |
| Tablet landscape 1080x810 | ✅ evidence/modelleerling/tablet-landscape/start.png | — | — | ✅ evidence/modelleerling/tablet-landscape/eind.png |
| Mobile 390x844 | ✅ evidence/modelleerling/mobile/start.png (ribbon afgekapt) | — | — | ✅ evidence/modelleerling/mobile/eind.png |

Noot: omdat de kerninteractie op geen enkele viewport lukt, is er geen apart "flow"/"feedback"-moment per viewport om vast te leggen — de blocker-staat bij start is representatief voor de hele sessie.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** (modelleerling, desktop, flow) — De afbeelding is niet aan te klikken/hoveren: een overlappende `<div>` onderschept alle pointer-events, consistent bij single-klik, dubbelklik én hover. Bewijs: `evidence/layout-doctor/modelleerling/desktop/flow.png`
2. **BLOCK** (modelleerling, desktop, flow) — Catch-22 bevestigd: 'Vierkant' (Tekstomloop) staat `disabled` zolang niets geselecteerd is, maar selecteren lukt niet. Bewijs: a11y-snapshot bij dezelfde stap.
3. **BLOCK** (speedrunner, desktop, flow) — Blocker is universeel (niet profiel-specifiek); geen alternatieve/snelle route gevonden. Bewijs: a11y-snapshot.
4. **BLOCK** (vastloper, desktop, feedback) — Na herhaald falen blijft de tip statisch en ongewijzigd; geen adaptieve hulp; leerling loopt permanent en oplosbaar vast. Bewijs: `evidence/layout-doctor/vastloper/desktop/feedback.png`
5. **WARN** (modelleerling, mobile, start) — Ribbon wordt afgekapt (tabs buiten beeld) en documentgebied valt grotendeels van het scherm; geen zichtbare horizontale scroll. Bewijs: `evidence/layout-doctor/modelleerling/mobile/start.png`
6. **INFO** (chaoot, desktop, flow) — Chaotisch gedrag (dubbelklik-spam, undo/redo-spam, reload, back) leidt niet tot crash/corruptie; console en network blijven schoon. Positief technisch signaal.

### Nog onzeker
- Of de blocker specifiek is voor deze ene afbeelding/casus (Casus 1/4) of ook casus 2, 3 en 4 treft — kon niet getest worden omdat casus 1 al blokkeert en er geen "volgende casus"-knop bereikbaar was zonder casus 1 op te lossen.
- Of er een alternatieve, niet-muis-gebaseerde selectiemethode bestaat (bv. toetsenbord-navigatie/Tab naar de afbeelding) — buiten de beschikbare acties van dit testharnas (geen `press`-navigatie naar het canvas geprobeerd op dit specifieke element).
- De exacte technische oorzaak (welke div precies de klik onderschept) is niet onderzocht — dat vereist code-inspectie, wat buiten de scope van deze leerling-simulatie valt.
