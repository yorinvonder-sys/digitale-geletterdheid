# Prompt Templates — DGSkills

Kopieer een template, vul de `[placeholders]` in, en plak het als eerste bericht in een nieuwe chat.
Claude leest zelf de context uit de repo en begint direct met werken — geen extra uitleg nodig.

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

## 7. Missie-audit leerlingperspectief

```
Voer een systematische review uit van missie [MISSIE_ID] alsof je een leerling bent
die deze missie voor het eerst opent.

Beoordeel op 9 dimensies: eerste indruk, visueel, didactische flow, inhoudelijke
correctheid, AI-coach kwaliteit, interactiviteit, afronding & feedback,
SLO-aansluiting, en toegankelijkheid.

Gebruik het audit-template in docs/audits/audit-plan-template-leerling.md.
Schrijf het ingevulde rapport naar docs/audits/leerling-audit/[MISSIE_ID].md
en update de samenvattingstabel in docs/audits/leerling-audit/README.md.

Referentiemissies: privacy-by-design (goudstandaard), data-verzamelaar, network-navigator.
```

### Batch-variant

```
Voer een batch leerling-audit uit voor alle missies in leerjaar [X] periode [Y].
Gebruik het template in docs/audits/audit-plan-template-leerling.md.
Schrijf per missie een rapport naar docs/audits/leerling-audit/[MISSIE_ID].md
en update de samenvattingstabel in docs/audits/leerling-audit/README.md.
Sorteer de resultaten op score (laagste eerst) zodat de urgentste missies bovenaan staan.
```

---

## Tips

- Voeg altijd de naam van het betrokken bestand of component toe als je dat weet — dat bespaart zoektijd.
- Je hoeft niet alles in te vullen: Claude bepaalt zelf de scope als iets ontbreekt en benoemt de aannames.
- Gebruik de templates ook als startpunt voor een complexere opdracht — vul extra context toe onder de template-tekst.
