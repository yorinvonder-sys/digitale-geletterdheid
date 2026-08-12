# Avatar grounding and cosmetic distinction

## Goal

The single supported 3D avatar must stand on the platform. Clothing must have readable large-form differences at normal shop-preview scale, and companion pets must touch the same platform without sinking or floating.

## Requirements

1. Platform top, contact shadow, human root, and per-pet compensation derive from named geometry constants.
2. Human soles retain a small anti-z-fighting clearance across body, gender, and pants variants.
3. Each current companion pet uses its measured lowest point.
4. Every paid shirt and pants style has a readable silhouette or large geometry cue; current accessories and pets retain explicit renderer cases.
5. The shop and dev route retain one persistent WebGL canvas; QA cards stay DOM-only.
6. The dev route covers standard, female slim, male slim, robot, all clothing, all accessories, and all pets with native accessible buttons.
7. Active source contains no 2D avatar renderer or 2D environment claim.
8. Regression checks must fail closed when catalog parsing or geometry expressions drift.
9. Catalog, price, ownership, inventory, purchase RPC, auth, and database behavior remain unchanged.

## Done when

- Targeted contracts, full typecheck, doctor, production build, and catalog/economy checks have honest results.
- Native browser evidence covers desktop, tablet portrait, tablet landscape, and mobile on the exact final diff.
- Sol and a fresh Claude Fable 5 session inspect that exact final diff and evidence with no BLOCKER/HIGH.
- The branch merges through a passing PR and production is tied to the merged SHA before live claims are made.
