# Auth Agent Rules

Auth is Rood-risico. Wijzigingen kunnen sessies, MFA, rollen, leerlingtoegang en docenttoegang raken.

## Lees Eerst

- `src/features/auth/README.md`
- `src/hooks/useAuth.ts`
- `src/services/authService.ts`
- `src/services/supabase.ts`
- `src/types/database.types.ts`

## Regels

- Gebruik geen user-editable metadata voor autorisatiebeslissingen.
- Verplaats sessie-, refresh- of redirectlogica niet zonder aparte verificatie.
- Houd foutmeldingen begrijpelijk en veilig; lek geen technische details naar leerlingen.
- Raak Supabase keys, storage of RLS-verwachtingen niet aan vanuit auth-UI werk.

## Proof

Minimaal `npm run doctor` en `npm run build:prod`. Bij gedrag rond login, logout, MFA of redirects is ook een handmatige browserflow nodig.
