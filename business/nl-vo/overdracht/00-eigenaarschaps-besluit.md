# Eigenaarschapsbesluit DGSkills — Vóór alles

**Status:** Ter beslissing door schoolleiding Almere College
**Datum:** juni 2026
**Opgesteld door:** Yorin Vonder, initiatiefnemer DGSkills

---

## Waarom dit het eerste is

Het platform DGSkills.app is gebouwd door en op naam van een eenmanszaak (Yorin Vonder, KvK 81819889). Die eenmanszaak is in de verwerkersovereenkomst (DPA) de formele **verwerker** van leerlingdata. Yorin is ook degene die de hosting (Supabase, Vercel) betaalt en de accounts beheert.

Nu Yorin zijn coördinatorrol teruggeeft, valt deze constructie weg. Een collega-docent kan de verwerkerrol niet privé overnemen — dat schept persoonlijke AVG-aansprakelijkheid. Zonder een beslissing op één van de drie onderstaande opties mag het platform **niet verder gebruikt worden**.

Dit document moet schriftelijk beantwoord worden vóórdat de juridische toets, kostenplan of pilot-propositie ingaan.

---

## De drie opties

### Optie A — School neemt eigenaarschap over (self-host)

**Wat het betekent:** De school (Almere College / stichting bevoegd gezag) wordt zowel verwerkingsverantwoordelijke áls beheerder van de technische infrastructuur. Supabase-account, Vercel-account en alle API-sleutels worden overgeschreven naar een school-e-mailadres.

**Juridisch:** School sluit zelf DPA's met Supabase, Vercel, Mistral AI en Black Forest Labs. De bestaande verwerkersovereenkomst met DGSkills vervalt; school treedt zelf op als verantwoordelijke in de zin van art. 4(7) AVG.

**Praktisch:**
- School-IT of een nieuwe coordinator beheert de accounts
- Yorin draagt technisch over (runbook, wachtwoorden, repo-toegang)
- Eenmalig ~2 uur om accounts over te dragen

**Kosten voor school:** ~€25-50/maand (zie `02-kosten-overdracht.md`)

**Risico:** School-IT moet basiskennis hebben van Supabase en Vercel, of een externe beheerder regelen.

---

### Optie B — Nieuwe rechtspersoon wordt verwerker

**Wat het betekent:** Er wordt een rechtspersoon opgericht (BV of Stichting DGSkills) die de verwerkersrol overneemt. De school tekent een DPA met deze entiteit. Yorin of een andere initiatiefnemer draagt de entiteit.

**Juridisch:** Biedt volledige scheiding van persoonlijke aansprakelijkheid. Meest houdbare constructie als DGSkills op meer scholen ingezet wordt.

**Praktisch:**
- Oprichting BV: ~€300-500 via notaris of online (bijv. Ligo, Firm24)
- Tijdlijn: 2-4 weken
- Vereist actieve eigenaar/bestuurder van de entiteit

**Kosten voor school:** Kosten via pilotcontract of licentie (zie `03-pilot-propositie-school.md`)

**Risico:** Vereist iemand die de entiteit wil dragen. Als Yorin dat niet meer wil, moet er een andere initiatiefnemer zijn.

---

### Optie C — Platform stopzetten

**Wat het betekent:** Het platform wordt gepauzeerd of definitief afgesloten. Alle leerlingdata wordt geëxporteerd en verwijderd conform DPA art. 14 (teruggave/vernietiging bij beëindiging).

**Juridisch:** Schone afsluiting. Geen resterende verwerkersverplichtingen.

**Praktisch:**
- Supabase data-export via MCP of dashboard (JSON-export beschikbaar per DPA)
- Supabase-project pauzeren of verwijderen
- Vercel-project verwijderen of archiveren

**Kosten:** €0 na afronding. Eenmalig ~2 uur voor ordentelijke afsluiting.

**Risico:** Alle leerlingvoortgang, missies en resultaten zijn niet meer beschikbaar.

---

## Beslisboom

```
Wil de school DGSkills gebruiken in 2026-2027?
│
├─ JA → Wie beheert de verwerkerrol?
│        ├─ School-IT kan accounts beheren → Optie A
│        └─ Beter via aparte entiteit → Optie B
│
└─ NEE → Optie C (ordentelijk stoppen)
```

---

## Tijdlijn

| Stap | Optie A | Optie B | Optie C |
|---|---|---|---|
| Besluit schoolleiding | Nu | Nu | Nu |
| Juridische stap | DPA's aanpassen | Entiteit oprichten (~2-4 wk) | Data-export starten |
| Technische overdracht | ~2 uur met Yorin | ~2 uur met Yorin | ~2 uur met Yorin |
| Platform operationeel | Meteen na overdracht | Na oprichting entiteit | Niet meer |
| Uiterste deadline | 1 september 2026 | 1 september 2026 | Zo snel mogelijk |

---

## Wat Yorin biedt in alle opties

Ongeacht de keuze is Yorin beschikbaar voor:
- Technische overdracht (repo-toegang, wachtwoorden, runbook)
- Toelichting compliance-documenten aan FG
- Vragen in de eerste 3 maanden na overdracht

---

## Schriftelijke beslissing

> De schoolleiding van Almere College kiest voor **Optie \_\_\_** en wijst **\_\_\_\_\_\_\_\_\_\_** aan als verantwoordelijke voor de verdere uitvoering.
>
> Handtekening: \_\_\_\_\_\_\_\_\_\_ Datum: \_\_\_\_\_\_\_\_\_\_

---

*Dit document is een interne beslisboom, geen juridisch bindend document. Na beslissing op Optie A of B volgt een formeel overdrachtsprotocol.*
