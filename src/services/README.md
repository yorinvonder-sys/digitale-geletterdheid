# Services

Deze folder bevat gedeelde service-lagen voor Supabase, auth, AI, analytics, teacher flows, exports en productlogica.

Rood-risico services:

- `supabase.ts`
- `authService.ts`
- `aiProviderService.ts`
- `teacherService.ts`
- `analyticsService.ts`
- `mfaTrustService.ts`
- `consentService.ts`

Services blijven bewust centraal omdat ze door meerdere features gedeeld worden. Verplaats servicecode alleen als de eigenaar en alle callsites duidelijk zijn. Voor auth, RLS, AI endpoints, consent of leerlingdata altijd `npm run doctor` en `npm run build:prod` draaien.
