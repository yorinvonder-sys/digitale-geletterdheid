# SEO Agent Rules

SEO-pagina's zijn publieke productclaims. Ze zijn meestal Groen/Geel, maar kunnen reputatie- of compliance-risico krijgen door te stellige claims.

## Lees Eerst

- `src/features/seo/CLAUDE.md`
- `src/features/public-site/README.md`
- Relevante business- of SLO-bronnen voordat je inhoudelijke claims wijzigt.

## Regels

- Schrijf voor Nederlandse scholen en ICT-beslissers, niet voor zoekmachines alleen.
- Houd SLO-termen exact waar relevant.
- Markeer tijdgevoelige beleids- of wetgevingsclaims voor menselijke controle.
- Geen interne paden, API-structuur of securitydetails in publieke tekst.

## Proof

Bij copy-only: path sanity check. Bij route, metadata of prerenderimpact: `npm run build:prod`.
