# Coordinator

Deze folder bevat het beheer van leerlijnen op schoolniveau: containers samenstellen, de planning configureren en zien welke SLO-kerndoelen daarmee gedekt worden.

Belangrijke ingangen:

- `ContainerEditor.tsx`
- `SchedulingConfigurator.tsx`
- `SLOCoverageIndicator.tsx`
- `src/config/containerTypes.ts`
- `src/config/slo-kerndoelen-mapping.ts`
- `src/hooks/useSchoolContainers.ts`

Wijzigingen hier bepalen wat leerlingen te zien krijgen en welke dekking een school kan aantonen. De SLO-koppeling is een inhoudelijke claim richting scholen, geen weergavedetail: pas `src/config/slo-kerndoelen-mapping.ts` niet aan zonder onderbouwing uit `docs/SLO-kerndoelen-mapping.md`.
