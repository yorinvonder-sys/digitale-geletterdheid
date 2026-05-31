# Consent Agent Rules

Consent is Rood-risico. Dit domein raakt minderjarigen, ouders/verzorgers, privacy en bewaarplicht.

## Lees Eerst

- `src/features/consent/README.md`
- `src/services/consentService.ts`
- `src/types/database.types.ts`
- `SECURITY.md`

## Regels

- Houd Nederlandse copy helder, juridisch voorzichtig en niet stelliger dan het product kan bewijzen.
- Wijzig geen datamodel, bewaartermijn of RLS-aanname als onderdeel van een UI-taak.
- Controleer altijd wie iets mag zien of goedkeuren voordat je data zichtbaar maakt.
- Behandel publieke goedkeuringslinks als privacygevoelig.

## Proof

Minimaal `npm run doctor` en `npm run build:prod`. Bij flowwijzigingen hoort een browsercheck van de toestemmingsflow.
