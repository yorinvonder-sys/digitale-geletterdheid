# audit-harness

Scratch-only Playwright driver for DGSkills learner-simulation audits.
Lives entirely under this scratchpad directory — never touches the repo or worktree.

## Requirements

Uses the repo's Playwright install via `createRequire`:
- `/Users/yorinvonder/Downloads/ai-lab---future-architect/node_modules/playwright` (^1.60.0)
- chromium-1223 cached under `~/Library/Caches/ms-playwright`

No local `node_modules` needed in this directory.

## Usage

### 1. Start a slot daemon

```
node driver.mjs serve --slot <1..6> --port <910N>
```

Example: `node driver.mjs serve --slot 1 --port 9101 &`

- Claims the slot via `mkdir locks/slot-<n>.lock` (atomic). If the lock dir already
  exists, the daemon exits immediately with a JSON error — it does not steal the slot.
- Launches one persistent Chromium context per slot at `slots/slot-<n>/profile`
  (headless, 1440x900 viewport). The context + page stay alive for the daemon's
  lifetime so in-page mission state (localStorage, chat history, game state)
  survives across actions.
- Listens on `127.0.0.1:<port>` only (never `0.0.0.0`).
- On SIGINT/SIGTERM or a `close` action: closes the browser, removes the lock dir,
  exits.

Convention: slot N → port 910N (slot 1 → 9101, slot 2 → 9102, ... slot 6 → 9106).
This isn't enforced by the driver — pass whatever port you like — but keeping the
convention makes it easy to remember which port belongs to which slot.

### 2. Send actions (one-shot client)

```
node driver.mjs act --port <910N> --json '{"action":"navigate","url":"https://example.com"}'
```

Prints the daemon's JSON response to stdout. Exit code 0 if `{ok:true}`, 1 otherwise
— safe to check `$?` from a Bash-driving agent.

### Actions

All actions have a 10s default timeout and one automatic retry on failure before
returning a JSON error (the daemon itself never crashes on a bad action).

| action | params | notes |
|---|---|---|
| `navigate` | `url` | |
| `reload` | | |
| `back` | | |
| `snapshot` | | `{url, title, ariaSnapshot, truncated}` via `body.ariaSnapshot()`, capped ~15000 chars |
| `click` | `selector` or `role`+`name`, `dblclick?`, `nth?`, `timeoutMs?`, `noRetry?` | `nth` = 0-based index over all matches (fixes strict-mode errors on identical buttons); `noRetry:true` + short `timeoutMs` for cheap "does this button exist" probes; success returns `{clicked:true}` |
| `hover` | `selector` | |
| `press` | `key`, `selector?` | selector-scoped or page-level keyboard |
| `fill` | `selector`, `value` | plain fill |
| `fill` (secret) | `selector`, `secretFrom:{file, jaar?, field}` | daemon reads the JSON secret file itself (array of `{jaar,email,password}`); the value is filled directly into the page and never appears in the response, logs, or stdout — response is `{ok:true, filledFrom:"secret"}` |
| `waitfor` | `selector?` or `text?`, `timeoutMs?` | |
| `resize` | `width`, `height` | viewport presets are the caller's job |
| `screenshot` | `path` | writes to the given absolute path (parent dirs auto-created); response contains only the path, never base64 |
| `console` | | drains and returns the console ring buffer (~200 entries) |
| `network` | | drains and returns the failed-request/4xx+ ring buffer (~100 entries) |
| `evaluate` | `js` | small reads only (scroll/measure); result JSON-serialized, capped 2000 chars |
| `freshprofile` | | closes the context, wipes `slots/slot-<n>/profile` and relaunches a clean browser — guaranteed-clean student (no cookies/localStorage). Use between profile runs; console/network buffers are cleared too |
| `close` | | closes context, releases lock, daemon exits |

### Werkregels uit de pilot-kalibratie (2026-07-02)

1. **Interactie altijd via `click`, nooit via `evaluate`** — snelle opeenvolgende
   clicks via `evaluate` landen op stale DOM vóór de React-re-render en gaan
   verloren; de ingebouwde `click` wacht correct.
2. **Schoon beginnen per profiel = `freshprofile`**, niet `?reset=1` — de
   dev-preview-reset heeft een race met de auto-save en is onbetrouwbaar
   (3× gereproduceerd op prompt-master).
3. **Persistentie testen (reload/refresh-gedrag): navigeer eerst naar de URL
   ZONDER `reset=1`** — een `reload` op een URL mét `reset=1` wist juist alle
   voortgang en meet dus niets.
4. **`back` werkt alleen met historie** — vanaf de eerste pagina van een verse
   sessie geeft `back` about:blank; bouw eerst navigatie-historie op.
5. Identieke knoppen (bv. 6× "Accepteren"): gebruik `role`+`name` met `nth`.

### Evidence convention

Screenshots and other artifacts should follow:

```
evidence/<missionId>/<profiel>/<viewport>/<stap>.png
```

e.g. `evidence/prompt-master/leerling-jaar1/mobile/01-intro.png`

## Locks

`locks/slot-<n>.lock/` is a directory used as an atomic mutex (mkdir either
succeeds or fails with EEXIST). Contains `owner.json` with `{pid, slot, port,
startedAt}` for diagnosing a stuck lock. A daemon removes its own lock dir on
clean shutdown; if a daemon is killed with SIGKILL the lock dir can be left
behind and must be removed manually before the slot can be reclaimed.

## Slots

`slots/slot-<n>/profile/` is the persistent Chromium user-data-dir for that slot.
Reusing the same slot across daemon restarts preserves cookies/localStorage for
that slot; delete the directory to reset a slot to a clean profile.
