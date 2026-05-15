# Auth

Deze folder bevat login, wachtwoordwijziging en MFA-gate UI.

Belangrijke ingangen:

- `Login.tsx`
- `ChangePassword.tsx`
- `MfaGate.tsx`
- `src/hooks/useAuth.ts`
- `src/services/authService.ts`
- `src/services/supabase.ts`

Authwijzigingen zijn hoog risico: ze kunnen sessies, rollen, MFA, leerlingtoegang en docenttoegang raken. Verifieer minimaal met `npm run doctor`, `npm run build:prod` en een handmatige login-flow waar mogelijk.
