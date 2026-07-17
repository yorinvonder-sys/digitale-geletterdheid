# Frontpage interactions redesign

## Goal

Make the frontpage demonstrate two authentic DGSkills workflows without unexplained visual controls: a teacher responding to a stalled student and a student modifying and playing the existing Game Programmeur assignment.

## Brand mascot

- Keep the duck inside the official DGSkills logo in the header and footer.
- Remove every decorative or repeated duck from the frontpage, including the current Kees narrator blocks, the school-pilot decoration, and the duck used as the mini-game player.
- Use the mascot once outside the logo: a single functional assignment-introduction image generated with Image 2.0. It gives one concrete instruction and then leaves the interaction visually to the learner.
- The generated narrator image must use the established hand-drawn DGSkills style, transparent or plain warm-paper background, and must not resemble a sticker or a random floating mascot.

## Teacher dashboard interaction

### Problem being solved

The current grid of 28 squares does not explain what the visitor is looking at or what clicking a square accomplishes. Toggling arbitrary students between two states is not a meaningful teacher workflow.

### New flow

1. The dashboard clearly states: **“Vier leerlingen zijn nog niet gestart.”**
2. A legend explains the states: **Bouwen**, **Leest uitleg**, and **Hint gestuurd**.
3. The 24 students who are already building remain a compact class overview and are not presented as a task.
4. The four actionable students are visually distinguishable and labelled with student numbers.
5. The instruction says: **“Tik op een lichte tegel en help één leerling starten.”**
6. Selecting an actionable tile opens a detail card with a specific signal, for example: **“Leerling 25 leest stap 1 al drie minuten.”**
7. The visitor clicks **“Stuur gerichte hint”**.
8. The selected student changes to **Hint gestuurd**, the count changes from 24/28 to 25/28, and a short confirmation explains what the teacher just achieved.

### Interaction rules

- Only students who need attention can be selected.
- The selected tile has a clear focus and selected state.
- The action is available by touch, mouse, and keyboard.
- The state change is announced with `aria-live`.
- The interaction can be reset so it remains demonstrable.

## Game Programmeur demo

### Problem being solved

The current command-sequence game and pixel-art background do not represent the existing Game Programmeur assignment. The duck player and command icons make the interaction feel invented for the landing page.

### Authentic assignment model

The replacement follows the existing Game Programmeur mission in `src/config/agents/year1.tsx`:

- a side-scrolling platform game;
- a player that jumps over pipe-like obstacles;
- tap/click or Space to jump;
- score, collision, game over, and restart;
- student changes to player colour, jump force, and obstacle speed.

### New visitor flow

1. The one-time narrator introduces the task: **“Kies één codewijziging. Speel daarna direct het verschil.”**
2. The visitor selects one of three explicit modifications:
   - **Speler groen** — changes `playerColor`;
   - **Hoger springen** — changes `jumpForce`;
   - **Snellere obstakels** — changes `obstacleSpeed`.
3. The interface names the variable that changed and describes its visible effect.
4. The visitor starts the game.
5. The game accepts tap/click and Space, keeps score, detects collision, and supports immediate restart.
6. The visitor can choose another modification and replay.

### Visual direction

- Replace the photographic/pixel-art background with a purpose-built responsive game scene rendered from simple React/SVG shapes.
- Use the existing DGSkills palette: warm paper, ink, acid lime, red accent, and restrained green.
- Match the real assignment’s platform, player, clouds, ground, and pipe obstacles without embedding the full authenticated mission or an unsafe iframe.
- Keep controls outside important gameplay space on small screens.
- The player is a simple game character, not the DGSkills duck.
- Motion respects `prefers-reduced-motion`.

## Component boundaries

- `TeacherActionDemo`: owns the selectable-student and hint-sent states.
- `GameProgrammerDemo`: composes modification controls, game status, and playfield.
- `PlatformGame`: owns the animation loop, input, score, collision, restart, and responsive dimensions.
- `AssignmentGuide`: displays the single Image 2.0 narrator introduction and is not reused elsewhere on the page.
- Pure state modules contain reducer logic so the core flows can be tested without a browser.

## Error and edge handling

- Repeated clicks on the same teacher action do not increase the active count more than once.
- Space only controls the game while its playfield is focused or active and does not unexpectedly scroll the page.
- The game pauses cleanly after collision and resets all transient objects on restart.
- Touch input uses a sufficiently large playfield and button targets.
- If the narrator image cannot load, its instruction remains fully available as text.

## Responsive requirements

- No component may create horizontal page overflow at 320, 360, 375, 390, 768, or 1024 CSS pixels.
- Dashboard instructions and action controls remain visible without relying on hover.
- On mobile, the modification choices precede the playfield and the jump instruction remains inside its safe area.
- On tablet and desktop, controls and playfield may sit side by side.

## Verification

- Reducer tests cover selecting a stalled student, sending a hint once, resetting the demo, selecting each game modification, starting, game over, and restart.
- Source contracts ensure decorative DuckMark and Kees narrator instances are removed while the header/footer brand logos remain.
- TypeScript critical check and production build must pass.
- The Vercel preview must reach `READY` on `codex/frontpage-story-preview`; the live branch and production domain remain untouched.
