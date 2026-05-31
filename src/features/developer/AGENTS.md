# Developer Tooling Agent Rules

Developer tooling is intern, maar vaak Geel/Rood-risico door beheerdata, exports en admin-achtige workflows.

## Lees Eerst

- `src/features/developer/README.md`
- `src/features/developer/DeveloperDashboard.tsx`
- `src/features/developer/accountant/` wanneer boekhouding/export geraakt wordt
- `src/services/developerService.ts`
- `src/services/accountantService.ts`

## Regels

- Behandel exports, facturen, uren, abonnementen en assets als gevoelig.
- Maak interne tooling niet zichtbaar via publieke of leerlingroutes.
- Controleer role/permission verwachtingen voordat je nieuwe panelen of data toevoegt.
- Houd accountantachtige logica gescheiden van leerling- en docentflows.

## Proof

Minimaal `npm run doctor`. Bij exports, betalingen, abonnementen, facturen, rollen of data-mutaties ook `npm run build:prod` en expliciete permission/privacy-check.
