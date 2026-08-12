# Independent final review — avatar grounding and cosmetic distinction

You are the independent Claude Fable 5 outcome reviewer. Work read-only. Do not edit, commit, push, merge, deploy, create accounts, or call production APIs.

## Review target

- Repository: current working directory.
- Branch: `codex/avatar-ground-cosmetics-final-20260812`.
- Base SHA: `b9a3fbee65d738a733926ab456aae886da1f321f`.
- Exact artifact: the complete uncommitted diff against that base plus the feature spec under `specs/2026-08-12-avatar-ground-cosmetics/`.
- Inspect the exact diff with `git diff --no-ext-diff --find-renames` and untracked spec files with `find specs/2026-08-12-avatar-ground-cosmetics -type f -maxdepth 3 -print` followed by bounded `sed` reads.

## Goal and invariant excerpt

The single supported 3D avatar must stand on the platform. Clothing must have readable large-form differences at normal preview scale. Each companion pet must touch the same platform. Catalog IDs/prices, ownership, inventory, purchase RPCs, auth, RLS, migrations, and learner data are out of scope and must remain unchanged.

The implementation should:

1. Derive platform top, contact shadow, human root, and exact per-pet compensation from named geometry constants.
2. Keep human soles at platform top plus a small anti-z-fighting clearance.
3. Give every paid shirt and pants style a large readable silhouette or geometry cue, while retaining explicit renderer support for every current paid accessory and every non-none pet.
4. Keep one persistent 3D canvas with DOM-only QA cards.
5. Make catalog/grounding checks fail closed rather than pass on missing, reordered, commented, or tautological source.
6. Preserve the protected catalog/economy files with zero diff.

## Earlier Claude findings to re-test

- MEDIUM: grounding assertions were tautological.
- MEDIUM: paid catalog coverage was order-dependent/vacuous and could accept comments rather than renderer branches.
- LOW: one shared pet anchor left small ground gaps.
- LOW: full typecheck evidence was missing.
- LOW: pet values were absent from renderer coverage.
- LOW: QA buttons lacked `aria-pressed`.
- OPTIONAL: male slim QA preset was absent.

Do not assume these are fixed; inspect and attempt to disprove the final implementation.

## Recorded evidence

- PASS: fail-closed avatar contract — one 3D canvas, 54 paid values, 4 pets, exact human/pet grounding, accessible presets.
- PASS: full `npm run typecheck`.
- PASS: `npm run doctor`.
- PASS: avatar hair mockup contract.
- PASS: `npm run check:avatar-shop` — 146 items, 73 paid, one seed migration.
- PASS: `npm run build:prod` — 3,607 modules, prerender complete; local Supabase keys absent by design and an existing react-three chunk-size warning remains.
- PASS: zero diff in `src/config/avatarCatalog.ts`, `src/services/avatarShopService.ts`, and `src/features/profile/AvatarShop.tsx`.
- PASS: `git diff --check`.
- FAIL before avatar assertions: `npm run test:avatar-shop` stops in historical migration `20260805104252_enforce_processing_restriction_in_rls.sql` with SQLSTATE `42804` (`COALESCE` text/uuid mismatch). This branch changes no migration/database code. Evaluate release impact, but do not silently call it PASS.
- PASS: native in-app browser at 1440x900, 820x1180, 1180x820, and 390x844 for robot/human grounding, duck grounding, puffer, cargo, and diamond suit. No app errors; existing `THREE.Clock` warning only.
- PASS: native button pointer activation and `aria-pressed` state change.
- CANNOT VERIFY: complete Tab/Enter automation due in-app driver dispatch failure; controls are native buttons.
- CANNOT VERIFY: physical iPad/Safari and post-merge production.

## Required output

Return:

1. Findings first, each labeled `BLOCKER`, `HIGH`, `MEDIUM`, `LOW`, or `OPTIONAL`, with exact file/line evidence, impact, and bounded remediation.
2. A finding-by-finding verdict on the seven earlier Claude items.
3. An explicit release verdict: `PASS`, `FAIL`, or `CANNOT VERIFY` for the exact final diff, distinguishing implementation quality from production readiness.

Any `BLOCKER` or `HIGH` must make the implementation verdict `FAIL`. Missing evidence must remain `CANNOT VERIFY`; do not invent browser, database, merge, or production proof.
