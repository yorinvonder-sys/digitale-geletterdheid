# Acceptance Checklist — DGSkills

Loop deze checklist door **voor elke taak als "done" markeren**.
Doel: geen regressions, geen security-gaten, geen stijlafwijkingen.

---

## 0. Beginner-safe AI-workflow

- [ ] Vooraf uitgelegd in gewone taal: plan, risico, waarschijnlijke bestanden, bewijs/testplan
- [ ] Taak is klein genoeg gehouden; grote verzoeken zijn opgesplitst in één duidelijke stap
- [ ] Risico gelabeld als Groen / Geel / Rood
- [ ] Rood werk? Expliciet benoemd: wat kan misgaan, welke data/geldstroom raakt dit, welke review is nodig
- [ ] Achteraf teach-back gegeven: wat veranderde, waarom, bestanden, checks, resterend risico
- [ ] Geen claim "klaar/veilig/productie-klaar" zonder uitgevoerde verificatie of expliciete beperking

---

## 1. Codekwaliteit

- [ ] TypeScript strict: geen `any`, geen impliciete `any`
- [ ] Componenten: PascalCase, named export, `React.FC<Props>`
- [ ] Services: camelCase bestandsnaam, geen default exports
- [ ] Hooks: prefix `use`, camelCase
- [ ] Types/interfaces: PascalCase, in `types/`
- [ ] Imports: `@/*` alias gebruikt, geen relatieve `../../`-paden
- [ ] Geen ongebruikte imports, variabelen, of dode code
- [ ] Edge functions: Deno runtime, `esm.sh` imports, gedeelde code in `_shared/`

---

## 2. Security (HIGH RISK AI-context — minderjarigen)

- [ ] Geen XSS: dynamische HTML geëscaped, user-generated content via DOMPurify
- [ ] Geen SQL injection: Supabase query builder gebruikt, geen raw SQL met user input
- [ ] Geen secrets in code, logs, of client bundle — alleen env vars / Supabase secrets
- [ ] RLS policies intact: schema-wijziging? Check dat bestaande policies nog kloppen
- [ ] Nieuwe dependency? Controleer CVE-status en onderhoud (`npm audit`)
- [ ] Auth/CORS/permission-logica gewijzigd? Expliciet benoemd in de PR/rapportage
- [ ] Error responses: geen stack traces, interne paden, of DB-structuur naar client
- [ ] CSP headers onaangetast: geen `unsafe-inline` of `unsafe-eval` geïntroduceerd
- [ ] MFA (AAL2) niet omzeild voor docent- of adminrollen

---

## 3. AI-veiligheid

- [ ] `systemInstruction` wordt **server-side** bepaald via `roleId` + `getSystemInstruction()` — nooit door client
- [ ] User input naar AI-prompt: prompt injection check (40+ patronen, NL + EN)
- [ ] Edge function ontvangt client-data? Server-side validatie aanwezig
- [ ] AI-output wordt niet ongesanitized aan de DOM meegegeven

---

## 4. Styling

- [ ] Tailwind inline in `className`, geen losse CSS-bestanden, geen `@apply`
- [ ] Conditionele klassen via template literals (niet via object-spread)
- [ ] Kleuren via `lab-*` tokens, geen hardcoded hex-waarden
- [ ] Responsive: getest op mobiel (min. 375 px) en desktop
- [ ] Framer Motion alleen voor intentionele animaties, niet als standaard-wrapper

---

## 5. Compliance & AI Act

- [ ] Geen nieuwe PII verzameld die niet in de DPIA staat
- [ ] Data minimalisatie: sla alleen op wat nodig is voor de functie
- [ ] HIGH RISK AI Act (Annex III 3b): wijziging raakt audit logging of transparantie? Benoem het
- [ ] Compliance-docs of privacy-claims aangepast? Check dat ze overeenkomen met de code
- [ ] Geen `[invullen]` placeholders in productie-zichtbare teksten

---

## 6. Toegankelijkheid (basis)

- [ ] Interactieve elementen hebben een zichtbaar focus-state
- [ ] Afbeeldingen hebben een `alt`-attribuut (of `alt=""` als decoratief)
- [ ] Formuliervelden hebben een gekoppeld `<label>` of `aria-label`
- [ ] Kleurcontrast voldoet aan WCAG AA (tekst op achtergrond)
- [ ] Geen informatie uitsluitend via kleur overgebracht

---

## 7. Taal

- [ ] UI-teksten en foutmeldingen in het **Nederlands**
- [ ] Code, variabelenamen, commentaar en commits in het **Engels**
- [ ] Geen Engelstalige termen in gebruikersgerichte teksten tenzij gangbaar (bijv. "AI", "dashboard")

---

## 8. Build & deploy

- [ ] `npm run build:prod` slaagt zonder fouten of waarschuwingen
- [ ] Geen TypeScript-compilatiefouten (`tsc --noEmit`)
- [ ] Vercel preview-deploy werkt (check na push naar branch)
- [ ] Edge functions getest via `supabase functions serve` of staging

---

## Snelle blokkade-check (stop als dit niet klopt)

| Blokkade | Check |
|---|---|
| Secrets in code | `git diff` bevat geen keys, tokens, wachtwoorden |
| RLS omzeild | Elke nieuwe tabel heeft RLS enabled + policies |
| systemInstruction via client | Niet aanwezig — server bepaalt altijd de instructie |
| `npm run build:prod` faalt | Oplossen voor markering als done |
| Prompt injection mogelijk | Input gevalideerd en gesanitized server-side |

---

> **Done-criterium:** alle relevante vakjes zijn aangevinkt, of er is een expliciete, gedocumenteerde reden waarom een item niet van toepassing is.
