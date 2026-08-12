# Verification

## Baseline

- Base SHA: `b9a3fbee65d738a733926ab456aae886da1f321f` (`origin/main` at worktree creation).
- Clean isolated worktree: PASS.
- Relevant avatar paths did not change between the original reviewed base `d6bed8c0` and this base: PASS.
- Prior production evidence showed the deployed soles intersecting the platform and paid jackets sharing the free torso silhouette. Fresh post-merge production evidence is required.

## Post-change

- `node scripts/check-dev-avatar-preview-contract.mjs`: PASS — one 3D canvas, 54 paid renderer values, 4 pets, exact human and pet grounding, accessible QA presets.
- `npm run typecheck`: PASS — full application TypeScript configuration.
- `npm run doctor`: PASS.
- `node scripts/check-avatar-hair-mockup-cues.mjs`: PASS.
- `npm run check:avatar-shop`: PASS — 146 catalog items, 73 paid items, one seed migration.
- `npm run build:prod`: PASS — 3,607 modules and prerender completed. Local Supabase client keys were absent; the build deliberately continued. Existing `vendor-react-three` size warning remains.
- Protected catalog/economy diff (`avatarCatalog.ts`, `avatarShopService.ts`, `AvatarShop.tsx`): PASS — no diff.
- `git diff --check`: PASS.
- `npm run test:avatar-shop`: FAIL before feature assertions — historical migration `20260805104252_enforce_processing_restriction_in_rls.sql` raises SQLSTATE `42804` because `COALESCE` combines `text` and `uuid`. No migration or database file is changed by this branch.
- Native in-app browser, exact working diff: PASS at 1440x900, 820x1180, 1180x820, and 390x844. Human and robot soles touch the platform; duck grounding uses its own anchor; puffer, cargo pants, and diamond suit have distinct large-form cues. No application errors; existing `THREE.Clock` deprecation warning only.
- Native button activation and `aria-pressed` change by pointer: PASS.
- Full keyboard Tab/Enter flow: CANNOT VERIFY — the in-app automation driver could not reliably dispatch the key sequence. The controls remain native `button` elements.
- Physical iPad/Safari: CANNOT VERIFY.
- Exact merged-SHA production deployment and live visual verification: pending release.
- Claude Fable 5 full exact-diff review (`8bfbe18c-e650-459d-a780-69c1778bd0a2`): implementation PASS; one true LOW contract-hardening finding and one inherited migration-replay fact.
- Claude Fable 5 full re-review after the first hardening (`83bbe9de-cb9f-46a9-95b1-54eea4375cec`): implementation PASS; two residual contract-only gaps identified.
- Claude Fable 5 targeted exact-final contract review (`358c2ea4-985a-4d3e-81a6-9cb91752684e`): implementation PASS; both residual gaps closed; no BLOCKER/HIGH/MEDIUM findings.
- Sol integrated exact-final-diff review: implementation PASS. Grounding math, renderer coverage, catalog/economy boundary, build/type evidence, visual evidence, and inherited migration failure were independently reconciled. Production remains CANNOT VERIFY until merge/deployment evidence exists.

## Evidence files

Git-ignored evidence is under `screenshots/mission-audit/avatar-environment/20260812-final/` in the isolated worktree:

- `desktop-1440x900-robot.jpg`
- `desktop-1440x900-duck.jpg`
- `tablet-portrait-820x1180-puffer.jpg`
- `tablet-landscape-1180x820-cargo.jpg`
- `mobile-390x844-diamond.jpg`
