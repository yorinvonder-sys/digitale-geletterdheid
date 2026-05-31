# Feature Agent Rules

Deze regels gelden voor alle code onder `src/features/`.

## Werk Per Domein

- Begin met de lokale `README.md` van het feature-domein.
- Als er een lokale `AGENTS.md` of `CLAUDE.md` bestaat, volg die boven deze algemene regels.
- Houd wijzigingen binnen het kleinste passende domein.
- Verplaats geen bestanden tussen domeinen als de taak ook lokaal opgelost kan worden.

## Waar Code Hoort

- Domeinspecifieke UI blijft in `src/features/<domain>/`.
- Breed herbruikbare UI gaat naar `src/components/ui/` of `src/components/app-shell/`.
- Supabase, AI, analytics, exports en auth-integratie blijven in `src/services/` tenzij de logica aantoonbaar feature-lokaal is.
- Gedeelde React state hoort alleen in `src/contexts/` wanneer meerdere domeinen die state echt nodig hebben.

## AI-Vriendelijke Werkwijze

- Gebruik path-scoped searches zoals `rg "zoekterm" src/features/teacher src/services/teacherService.ts`.
- Lees geen brede generated of artifact folders voor featurewerk.
- Noteer nieuwe cross-feature afhankelijkheden in de lokale README als ze niet vanzelfsprekend zijn.
- Maak geen brede styling- of naamgevingsrefactors mee met productwijzigingen.

## Risico En Proof

- Groen: copy, statische content, kleine visuele polish.
- Geel: feature UI, dashboards, API reads, gewone productlogica.
- Rood: auth, consent, rollen, leerlingdata, Supabase/RLS, AI-endpoints, exports, admin-achtige workflows.

Gebruik minimaal:

- Docs-only: `npm run context:budget` plus path/link sanity check.
- UI/productlogica: `npm run doctor` en gerichte browsercheck waar relevant.
- Rood werk: `npm run doctor`, `npm run build:prod` en expliciete permission/privacy-flow verificatie.
