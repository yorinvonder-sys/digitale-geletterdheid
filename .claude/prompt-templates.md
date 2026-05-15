# Prompt Templates — DGSkills

Kopieer een template, vul de `[placeholders]` in, en plak het als eerste bericht in een nieuwe chat.
Claude leest zelf de context uit de repo en begint direct met werken — geen extra uitleg nodig.

---

## 0. Beginner-safe AI coding

```
Gebruik de Skales beginner-safe workflow.
Voordat je code schrijft: leg het plan uit in normale taal, classificeer het risico als Groen/Geel/Rood, noem de waarschijnlijke bestanden, en vertel hoe we bewijzen dat het werkt.
Werk in één kleine stap.
Na afloop: leg uit wat er veranderde, waarom, welke bestanden zijn aangepast, welke checks zijn uitgevoerd, en wat nog onzeker is.
```

---

## 1. Nieuwe missie maken

```
Maak een nieuwe missie over [onderwerp] voor leerjaar [X].
Koppel aan SLO-doel [nummer of beschrijving] en verwerkingsvorm [lezen / kijken / interactief / quiz].
Zorg dat de AI-begeleider de rol heeft van [rolnaam, bijv. "Toekomstarchitect"] en stem de moeilijkheidsgraad af op [vmbo-t / havo / vwo].
```

---

## 2. Bug fixen

```
Er is een bug in [component of pagina, bijv. MissionCard / dashboard]:
[Beschrijving van het probleem — wat verwacht je, wat gebeurt er nu?]
Reproductiestappen: [optioneel]
Fix de bug en check of er vergelijkbare problemen elders in de code zijn.
```

---

## 3. Compliance check

```
Check de compliance status van [feature of document, bijv. de chat-edge-function / privacyverklaring].
Kijk naar: GDPR/AVG, EU AI Act (HIGH RISK classificatie), OWASP Top 10, en onze eigen DPIA.
Geef een lijst van bevindingen met prioriteit (blocker / aanbeveling / nice-to-have).
```

---

## 4. Feature toevoegen

```
Voeg [feature, bijv. een voortgangsbalk] toe aan [component of pagina, bijv. het leerling-dashboard].
De feature moet passen bij de bestaande Tailwind-stijl en lab-* kleur-tokens.
[Optioneel: specifiek gedrag of randvoorwaarden]
```

---

## 5. Security review

```
Review de security van [bestand of functie, bijv. supabase/functions/chat/index.ts].
Focus op: prompt injection, input-validatie, output-encoding, RLS-integriteit, en secret management.
Geef concrete fixes voor gevonden issues, gesorteerd op risico.
```

---

## 6. Deployment check

```
Check of alles klaar is voor deployment naar productie (dgskills.app).
Loop het LAUNCH-PLAN.md door en markeer wat nog open staat.
Check ook: build slaagt, geen console-errors, RLS policies intact, geen [invullen]-placeholders in publieke docs.
```

---

## Tips

- Voeg altijd de naam van het betrokken bestand of component toe als je dat weet — dat bespaart zoektijd.
- Je hoeft niet alles in te vullen: Claude bepaalt zelf de scope als iets ontbreekt en benoemt de aannames.
- Gebruik de templates ook als startpunt voor een complexere opdracht — vul extra context toe onder de template-tekst.
