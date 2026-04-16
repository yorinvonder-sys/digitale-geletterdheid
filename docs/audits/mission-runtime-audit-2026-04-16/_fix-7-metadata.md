# Fix-rapport 7 — Metadata + types
- Datum: 2026-04-16

## ROLES slug-fixes (4 missies)

| Missie | Status | Titel | Bestand |
|--------|--------|-------|---------|
| `notificatie-ninja` | ADDED | "Notificatie Ninja" | `config/agents/year1.tsx` |
| `digitale-balans-coach` | ADDED | "Digitale Balans Coach" | `config/agents/year1.tsx` |
| `online-helden` | ADDED | "Online Helden" | `config/agents/year2.tsx` |
| `welzijnsonderzoeker` | ADDED | "Welzijnsonderzoeker" | `config/agents/year3.tsx` |

Tevens toegevoegd aan:
- `config/agentRoleIds.ts` — slugs waren niet in de const array opgenomen
- `types.ts` (RoleId union) — slugs waren niet in de union type opgenomen

Yeargroups zijn gebaseerd op `config/slo-kerndoelen-mapping.ts`:
- `notificatie-ninja` → yearGroup: 1
- `digitale-balans-coach` → yearGroup: 1
- `online-helden` → yearGroup: 2
- `welzijnsonderzoeker` → yearGroup: 3

## phishing-fighter wrongFeedback

Optie gekozen: **A**

`wrongFeedback?: string` toegevoegd aan `ScenarioItem` interface.

Bevinding: render-code was al aanwezig in beide sub-componenten die dit veld gebruiken:
- `SelectCorrectRound.tsx` (regel 26): `const feedbackText = isWrong && item.wrongFeedback ? item.wrongFeedback : item.explanation;`
- `BinaryChoiceRound.tsx` (regel 24): idem patroon

Het ontbrekende type was het enige probleem. Geen nieuwe render-code nodig.

Files gewijzigd:
- `components/missions/templates/scenario-engine/types.ts`

## RoundState type-gap

Drie optionele velden toegevoegd aan `RoundState`:
- `confidence?: number`
- `followUpAnswered?: boolean`
- `followUpCorrect?: boolean`

Files gewijzigd:
- `components/missions/templates/scenario-engine/types.ts`

## Verificatie

TypeScript: **PASS** (voor gewijzigde bestanden)

Pre-existing errors (buiten scope):
- `ScenarioRound` mist `followUp` en `showConfidence` velden (gebruikt door ScenarioEngine.tsx)
- `AgentRole` heeft strict verplichte velden die bestaande minimale entries al niet bevatten (cloud-cleaner etc.)
- Deze fouten bestonden al vóór deze fix en zijn niet geïntroduceerd door de wijzigingen

## Risico's

- Minimale ROLES entries (zonder `systemInstruction` content, `visualPreview` etc.) volgen het bestaande patroon van `cloud-cleaner`, `layout-doctor`, `pitch-police` — geen nieuw risico.
- `wrongFeedback` rendering was al geïmplementeerd maar zonder type-dekking; toevoeging is non-breaking.
- `RoleId` uitbreiding is additief en backward-compatible.
