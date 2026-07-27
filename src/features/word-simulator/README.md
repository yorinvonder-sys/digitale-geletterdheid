# Word Simulator

Deze folder bevat een nagebootste tekstverwerker waarin leerlingen opmaakvaardigheden oefenen: een lint met knoppen, een documentcanvas en versleepbare afbeeldingen.

Belangrijke ingangen:

- `WordSimulator.tsx`
- `Ribbon.tsx`
- `DocumentCanvas.tsx`
- `DraggableImage.tsx`
- `types.ts`
- `index.tsx`

Deze folder is zelfstandig: hij wordt vanuit een missie aangeroepen, niet vanuit een eigen route. `index.tsx` is een van de weinige barrel-bestanden in `src/`; importeer daarvandaan in plaats van uit losse bestanden.

De simulator beoordeelt of een leerling een opmaakstap correct heeft uitgevoerd. Controleer bij wijzigingen aan die detectie dat bestaande missiedoelen in `src/config/missionGoals.ts` nog gehaald kunnen worden.
