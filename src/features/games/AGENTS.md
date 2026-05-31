# Games Agent Rules

Games zijn meestal Geel-risico. Let op performance, inputbediening, toegankelijkheid en bundle-impact.

## Lees Eerst

- `src/features/games/README.md`
- De specifieke gamefolder, bijvoorbeeld `Bomberman/`, `DrawingDuel/` of `TypingTrainer/`
- `src/features/games/TeacherGameToggle.tsx` als docentinstellingen geraakt worden

## Regels

- Houd game-state lokaal bij de game tenzij voortgang expliciet opgeslagen moet worden.
- Controleer keyboard, touch en narrow viewport gedrag.
- Voeg geen zware game-import toe aan publieke routes.
- Teacher toggles of voortgangsopslag kunnen leerlingzichtbaarheid raken en moeten als Geel/Rood worden behandeld.

## Proof

Minimaal `npm run doctor`. Bij visuele/gameplaywijzigingen hoort een browsercheck. Bij opslag of teacher toggle wijzigingen ook `npm run build:prod`.
