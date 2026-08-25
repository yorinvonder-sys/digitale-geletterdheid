# Rubric-review: meesterproef

Datum: 2026-08-25 · templateType: builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10

- **Blocking**: geen (overgenomen van engine-bevinding): de afrondknop in `CompletionScreen.tsx` mist een pending-/disabled-state tijdens `onComplete`, en `meesterproef` gebruikt dit scherm zonder eigen bescherming — dubbele XP-toekenning is hier reproduceerbaar bij een snelle dubbelklik na de laatste stap.
- **Warning**: kleurcontrast. `StepInstructionPanel.tsx` en `ChecklistItem.tsx` gebruiken structureel `/70`-opacity ink-tokens voor zowel leerling-invoer als placeholder — bij een tekst-zware missie als meesterproef (5 lange instructieblokken, invoervelden tot 500+ tekens) is dit relevanter dan bij kortere builder-canvas-missies, want leerlingen typen hier het langst in hetzelfde veld.
- **Warning**: mijlpaal-toast (`showMilestone`) kan bij snel herladen (<2s) permanent blijven hangen — bij een missie met 4 stappen en relatief lange schrijftijd per stap is de kans op een toevallige herlaad-timing binnen 2s laag maar niet nul.
- **Info**: iconenlijst in het stapoverzicht herhaalt zich vanaf stap 5 — raakt meesterproef niet, want deze missie heeft slechts 4 stappen.
- Config-specifiek: `introFeatures` (4 items) en `takeaways` (5 items) zijn consistent qua toon en lengte met vergelijkbare builder-canvas-missies; geen eigen designfouten in de config gevonden.

## Didactiek — score 7/10

- Sterke opbouw: voorstel → ontwikkellog → eindproduct → verdediging dekt een volledige projectcyclus en sluit aan bij de SLO's 21A-23C (onderzoek, ontwerp, realisatie, evaluatie/presentatie).
- `missionGoals.ts`-entry (`min: 4` van 4 stappen, dus alle stappen verplicht) is consistent met `criteria.description` en met de 4 stappen in de config — geen mismatch.
- **Warning (overgenomen, missie-relevant)**: scoring is presence-based (checklist + 40 tekens plausibele tekst). Bij een eindproject-missie met hoog gewicht (`maxScore: 100`, badges tot "Meesterproef Geslaagd" bij 90+) is dit zwaarder dan bij een korte oefenmissie: een leerling kan met oppervlakkige, generieke antwoorden per stap (bijv. "Ik heb getest met twee gebruikers en het werkte" zonder concrete namen/bevindingen) toch een hoge badge halen. De enige inhoudelijke discriminator is de optionele evidence-vraag in stap 1 (SLO-bewijsmatrix, `minLength: 55`) — de overige 3 stappen hebben geen evidence-veld.
- **Info**: stap "eindproduct" vraagt expliciet om eerlijke zelfreflectie ("wat werkt niet") — didactisch sterk, maar wordt ook alleen tekstueel gecontroleerd, niet inhoudelijk beoordeeld door de engine. Dat is inherent aan het template en geen missie-specifiek gebrek.
- Jury-vragen in stap 4 zijn goed gekozen (uitdaging, technologiekeuze, zelfreflectie) en sluiten aan bij het beslissingenlog uit stap 2 — goede interne samenhang tussen stappen.

## Tech — score 7/10

- Config is intern consistent: 4 steps, `maxScore: 100`, badges van 0 tot 90 dekkend, geen gaten.
- `templateRegistry.ts`, `slo-kerndoelen-mapping.ts` (week 4, yearGroup 3, 9 SLO-kerndoelen) en `curriculum.ts` (leerjaar 3, periode/afsluiting) zijn onderling consistent qua identiteit — geen mismatch tussen UI-zichtbaarheid en SLO-mapping.
- `missionGoals.ts`-entry correct gekoppeld (`type: 'steps-complete', min: 4`).
- **Warning (overgenomen engine-bevinding, van toepassing)**: `completedSteps` wordt nooit teruggedraaid na Vorige-stap + wijzigen. Bij meesterproef — een missie waarin leerlingen expliciet worden aangemoedigd terug te gaan en bij te werken (ontwikkellog, beslissingenlog) — is de kans reëel dat een leerling na afronding tekst wijzigt die de docent nooit als "voltooid werk" te zien krijgt terwijl de punten al toegekend zijn.
- **Info**: enige config-eigen tech-bevinding buiten de engine: geen. De config zelf bevat geen bugs (geen ontbrekende velden, geen inconsistente ids).

## Voorstellen

Alle onderstaande voorstellen raken gedeelde engine-bestanden en vallen dus buiten de whitelist voor `autoFixable` — worden als escalation gemeld, niet automatisch toegepast.

**1) Afrondknop dubbelklik-bescherming** (`src/features/missions/templates/builder-canvas/BuilderCanvas.tsx`, rond regel 264):
```tsx
// voor
const handleComplete = async () => {
  await onComplete(...);
  clearSave();
};

// na
const [isCompleting, setIsCompleting] = useState(false);
const handleComplete = async () => {
  if (isCompleting) return;
  setIsCompleting(true);
  await onComplete(...);
  clearSave();
};
```
En in `CompletionScreen.tsx` de knop `disabled={isCompleting}` meegeven.

**2) Mijlpaal-toast niet persisteren** (`BuilderCanvas.tsx`, rond regel 229):
```tsx
// voor: showMilestone zit in de gepersisteerde state

// na: forceer bij mount op false, sluit uit van save-payload
useEffect(() => { setShowMilestone(false); }, []);
```

## Samenvatting en verdict

Meesterproef is didactisch de sterkste van de builder-canvas-missies (volledige projectcyclus, goede SLO-dekking, sterke jury-voorbereiding), maar draagt de bekende engine-risico's (dubbele voltooiing, presence-based scoring, hangende toast, contrast) zwaarder dan kortere missies vanwege het hoge gewicht (badge "Meesterproef Geslaagd") en de lange schrijfsessies per stap. Geen missie-specifieke config-fouten gevonden; alle bevindingen zijn engine-niveau en al bekend uit de gedeelde beoordeling.

**Verdict: fix-eerst** (blocking dubbelklik-issue in gedeelde engine moet vóór brede uitrol worden opgelost; de missie-config zelf is verder klaar).
