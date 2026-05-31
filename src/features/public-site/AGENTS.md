# Public Site Agent Rules

Public-site werk is meestal Groen/Geel. Let vooral op performance, SEO, prerendering en productwaarheid.

## Lees Eerst

- `src/features/public-site/README.md`
- `src/features/public-site/CLAUDE.md`
- `src/features/seo/CLAUDE.md` wanneer SEO-pagina's geraakt worden
- `scripts/prerender.mjs` bij route- of prerenderwijzigingen

## Regels

- Public pages mogen geen authenticated-only, dashboard-, game- of AI-heavy code onnodig preloaden.
- Houd claims over scholen, compliance, SLO en inspectie feitelijk en voorzichtig.
- Gebruik bestaande public-site componentpatronen voordat je nieuwe layoutsystemen toevoegt.
- Bij SEO-copy: benoem geen interne API-structuur, securitydetails of niet-bewezen garanties.

## Proof

Voor copy-only is een path sanity check genoeg. Bij layout, route, asset of prerenderimpact: `npm run build:prod` en browsercheck van de geraakte publieke route.
