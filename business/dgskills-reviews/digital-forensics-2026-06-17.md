# Review: digital-forensics
**Datum:** 2026-06-17  
**Reviewer:** Sonnet (geautomatiseerde M2-review)  
**Templatetype:** scenario-engine  
**Eén-zin verdict:** Didactisch sterk en technisch grotendeels solide — één harde blocker (SLO 21C buiten periodeScope) en één geëscaleerd platform-issue (badge-hex-kleuren in config).

---

## 🎨 Design review

### ✅ Goed

- **Duck-tokens in de engine:** `ScenarioEngine.tsx` gebruikt consequent `bg-duck-bg`, `border-duck-acid`, `text-duck-ink`, `text-duck-ink/60` — geen hardcoded hex in de template zelf.
- **Loading/error-states:** `LoadingScreen` en `ErrorScreen` zijn aanwezig met correcte aria-label op de spinner (`aria-label="Laden..."`).
- **Responsive structuur:** `min-h-screen p-4 max-w-md mx-auto` — geen vaste px-breedte.
- **Kopietekst intro:** 59 woorden — past binnen jr3-grens (<120w). Instructietekst per ronde is 1–2 zinnen, ruim onder 80w.

### ⚠️ Aandachtspunten

- **`introEmoji: '🕵️'`** — emoji's in config zijn prima voor display, maar zorg dat de `IntroScreen`-component dit via `aria-hidden` rendert zodat de screenreader de tekst niet voorleest als "detective emoji".
- **Framer Motion:** Niet aanwezig in de scenario-engine of config — neutraal (geen ongewenste animaties), maar er is ook geen visuele feedback-transitie bij ronde-overgangen. Geen blocker, maar kan de UX verbeteren.

### ❌ Blokkers

- **Hardcoded hex in badge-config:**  
  Alle vier badges bevatten `color: '#202023'` (hardcoded hex, geen duck-/lab-token).  
  `src/features/missions/templates/scenario-engine/configs/digital-forensics.ts:23,28,33,38`

  **Voorstel:**
  ```ts
  // Voor:
  { minScore: 80, emoji: '🏆', title: 'Hoofd Forensisch Analist', color: '#202023' },

  // Na (gebruik Tailwind-token-equivalent of een named constant):
  { minScore: 80, emoji: '🏆', title: 'Hoofd Forensisch Analist', color: 'var(--duck-ink)' },
  ```
  > Let op: dit vereist dat `CompletionScreen` de `color`-prop als CSS-variabele verwerkt, óf verwijder de `color`-prop als die alleen decoratief is. **ESCALATIE (niet auto-fixbaar):** controleer hoe `CompletionScreen` de `color`-prop gebruikt voordat je dit aanpast.

- **visualPreview in agents/year3.tsx gebruikt legacy `lab-` tokens:**  
  `year3.tsx:961` bevat `from-lab-coral to-lab-teal` in de JSX. Dit is buiten scope van de scenarimo-config zelf, maar beïnvloedt de kaartweergave op het dashboard.  
  `src/config/agents/year3.tsx:961`

  **Voorstel:**
  ```tsx
  // Voor:
  <div className="... bg-gradient-to-br from-lab-coral to-lab-teal ...">

  // Na (gebruik duck-tokens):
  <div className="... bg-gradient-to-br from-duck-teal to-duck-acid ...">
  ```
  > **ESCALATIE (niet auto-fixbaar):** juiste duck-tokens voor gradients vereisen verificatie met het design-systeem.

---

## 📚 Didactiek review

### ✅ Goed

1. **Helder doel aanwezig:** `missionObjective` in agents/year3.tsx (`'Lees logbestanden, reconstrueer een tijdlijn van gebeurtenissen en trek een onderbouwde conclusie.'`) is concreet en geeft een actief werkwoord voor elke stap.

2. **Doel wordt bereikt door de rondes:**  
   - Ronde 1 (herken verdachte logregels) → doelstap "lees logbestanden"  
   - Ronde 2 (bouw de tijdlijn) → doelstap "reconstrueer een tijdlijn"  
   - Ronde 3 (feit of aanname?) → doelstap "trek een onderbouwde conclusie" (Bloom: analyse)  
   - Ronde 4 (forensisch protocol) → verdieping: toepassing van professionele standaarden  
   De volgorde is didactisch logisch: herkennen → ordenen → evalueren → toepassen.

3. **Bloom-verdeling evenwichtig:**  
   - Onthouden/begrijpen: ronde 4 (protocol-items)  
   - Toepassen/analyseren: ronde 1 (patronen herkennen), ronde 2 (ordenen)  
   - Evalueren: ronde 3 (feit vs. aanname) — dit is het cognitief zwaarste onderdeel, correct geplaatst als ronde 3 na scaffolding.

4. **Leeftijdsadequate woordenschat:** `brute force`, `privilege escalation`, `chain of custody` worden alle uitgelegd in de feedbacktekst. Geen onverklaaard vakjargon.

5. **AI als copiloot:** `systemInstruction` stuurt de AI om te begeleiden met vragen ("Wat gebeurde er EERST?"), niet om antwoorden te geven. Scope guard aanwezig.

6. **Takeaways didactisch sterk:** 5 takeaways zijn concreet, forensisch correct en leeftijdsgeschikt. Geen moraliserende toon.

7. **Wellbeing/inclusiviteit:** Ziekenhuisscenario is neutraal en professioneel; geen triggerende inhoud. Leerling speelt analist, niet slachtoffer.

8. **STEP_COMPLETE aanwezig in systemInstruction:**  
   De triage-flag "STEP_COMPLETE ontbreekt" is **niet terecht**. De systemInstruction bevat expliciet:  
   ```
   - Stuur ---STEP_COMPLETE:1--- als...
   - Stuur ---STEP_COMPLETE:2--- als...
   - Stuur ---STEP_COMPLETE:3--- als...
   ```
   Dit is correct geïmplementeerd. Triage-flag kan worden afgesloten.

### ⚠️ Aandachtspunten

- **Ronde 2, items 2 + 3 slordigheid:** De `description` van item 2 noemt "22:54:17 en 22:54:19 | LOGIN FAILED" maar ronde 1 item 1 toont "22:54:10–22:54:19". De timestamps zijn intern niet 100% consistent (ronde 1: 5 pogingen vanaf 22:54:10; ronde 2: 2 pogingen vanaf 22:54:17). Dit zal een oplettende leerling verwarren.  
  `src/features/missions/templates/scenario-engine/configs/digital-forensics.ts:177`

  **Voorstel:**
  ```ts
  // Voor:
  description: '22:54:17 en 22:54:19 | LOGIN FAILED | user: dr_bakker ...',

  // Na (consistentie met ronde 1 — gebruik tijden uit de brute-force-reeks):
  description: '22:54:10–22:54:19 | LOGIN FAILED (×5) | user: dr_bakker ...',
  ```

- **`missionGoal` ontbreekt in config:** `ScenarioEngine.tsx:193` roept `config.missionGoal ?? getMissionGoal(config.missionId)` aan — maar `getMissionGoal('digital-forensics')` retourneert `undefined` (geen entry in missionGoals.ts). De introscherm toont dan waarschijnlijk geen doel-tekst. Geen harde blocker als `IntroScreen` graceful omgaat met `undefined`, maar zwak didactisch signaal.

  **Voorstel:** Voeg een `primaryGoal` toe in missionGoals.ts:
  ```ts
  // In src/config/missionGoals.ts:
  { missionId: 'digital-forensics', primaryGoal: 'Ik analyseer logbestanden en trek een onderbouwde conclusie over wat er is gebeurd.' },
  ```

### ❌ Blokkers

- **SLO 21C valt buiten de `sloFocus` van J3-P2:**  
  `curriculum.ts:267` definieert `sloFocus: ['23A', '21A']` voor Cybersecurity & Privacy (J3-P2).  
  `slo-kerndoelen-mapping.ts:168` claimt `sloKerndoelen: ['23A', '21C']`.  
  De missie claimt 21C (Data & Dataverwerking) maar de periode heeft 21A (Digitale Systemen) als tweede focus. 21C staat nergens in de J3-P2-scope.  

  **Afweging:** de keuze voor 21C is inhoudelijk verdedigbaar (logdata analyseren = dataverwerking), maar het veroorzaakt een mismatch in de teacher-dashboard-rapportage. Mogelijke oplossingen:  
  a) Pas `slo-kerndoelen-mapping.ts:168` aan naar `['23A', '21A']` om bij de periodeScope te passen.  
  b) Voeg 21C toe aan de J3-P2 `sloFocus` in curriculum.ts.  
  > **ESCALATIE (niet auto-fixbaar):** keuze a of b heeft curriculum-brede impact op teacher-rapportage. Vereist expliciete beslissing van Yorin.

---

## 🔧 Tech review

### ✅ Goed

- **`useMissionAutoSave` correct gebruikt:** `ScenarioEngine.tsx:116` — `state`, `setState`, `clearSave` worden alle drie aangeroepen. `clearSave()` wordt aangeroepen in `handleComplete` (regel 181). Restart-safe.
- **Async config-loading met error-handling:** `import('./configs/${missionId}.ts')` heeft `.catch(() => setLoadError(true))` — correct.
- **TypeScript:** `ScenarioEngine.tsx` gebruikt typed interfaces (`ScenarioEngineConfig`, `ScenarioEngineState`, `RoundState`). Geen `any` of `@ts-ignore` zichtbaar in de gelezen bestanden.
- **@/* imports:** `@/hooks/useMissionAutoSave`, `@/config/missionGoals` — correct.
- **XSS:** Alle content is statisch in de config (geen user-input in `dangerouslySetInnerHTML`). React-standaard escaping is voldoende.
- **Supabase:** De scenario-engine roept geen `supabase.functions.invoke` aan — dit template is puur client-side. Geen try/catch-risico.
- **Security:** `systemInstruction` staat server-side in `agents/year3.tsx` (niet in de client-config). `promptSanitizer` niet aanwezig in de scenario-engine zelf, maar ook niet nodig: er is geen vrij-tekst leerling-input in deze template.
- **`roleId` geregistreerd:** `agentRoleIds.ts:85` bevat `'digital-forensics'`.
- **Registry correct:** `templateRegistry.ts:18` koppelt `'digital-forensics'` aan `'scenario-engine'`.

### ⚠️ Aandachtspunten

- **`ScenarioEngine.tsx:219` — silent null return:**  
  ```tsx
  if (!currentRound || !roundState) return null;
  ```
  Als state corrupt is (bv. na een save-formaat-wijziging), rendert de component niets zonder foutmelding. Lage kans, maar onzichtbaar voor de leerling.

  **Voorstel:**
  ```tsx
  // Voor:
  if (!currentRound || !roundState) return null;

  // Na:
  if (!currentRound || !roundState) return <ErrorScreen missionId={config.missionId} onBack={onBack} />;
  ```

- **`ScenarioEngine.tsx:98` — dynamische import met template literal:** Vite bundelt dit correct als een dynamic import, maar als `missionId` ooit een waarde krijgt met een path-traversal (`../../`) kan dit een onverwacht bestand laden. In de huidige architectuur is `missionId` altijd uit de registry, dus het risico is minimaal. Toch een latent kwetsbaarheid.  
  > **ESCALATIE (niet auto-fixbaar):** overweeg een allowlist-check vóór de import, of whitelisting via de registry.

### ❌ Blokkers

- **Geen blokkers gevonden in tech.**

---

## Visuele verificatie
**Niet geverifieerd (geen screenshot)** — geen bestanden aangetroffen in `screenshots/assignments/digital-forensics/`.

---

## Samenvatting

| As | Score | Blokkers | Aandachtspunten |
|----|-------|----------|-----------------|
| 🎨 UI/UX | 2/3 | 1 (badge hex + visualPreview lab-tokens) | 2 |
| 📚 Didactiek | 2/3 | 1 (SLO 21C buiten periodeScope) | 2 |
| 🔧 Tech | 3/3 | 0 | 2 |

**Auto-fixbaar:** 3 (timestamp-inconsistentie ronde 2, `missionGoal` toevoegen, null→ErrorScreen)  
**Escalaties:** 3 (badge-color token-keuze, lab→duck gradient, SLO 21C vs. sloFocus)  
**Triage-correctie:** STEP_COMPLETE is aanwezig in systemInstruction — de triage-vlag was onterecht; sluit die bevinding.
