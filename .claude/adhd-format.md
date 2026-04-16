# ADHD Statusblok — Template

Elke nieuwe sessie begint met dit blok. Geen uitzonderingen.

---

## Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 WERKSTROOM: [naam uit workstreams.md]
📍 SPRINT: [nummer] — [thema]
🎯 HUIDIGE TAAK: [korte beschrijving]
⏱️ GESCHATTE TIJD: [schatting]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Klaar: [laatste afgeronde taak]
➡️ Nu: [wat we nu doen]
⏳ Daarna: [volgende taak]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Regels

1. **Max 3-5 items zichtbaar** — geen overweldigende lijsten
2. **Eén taak tegelijk** — niet springen tussen taken
3. **Expliciete fasewissels** — zeg wanneer we van fase wisselen
4. **Vier kleine overwinningen** — benoem elke afgeronde taak
5. **"Jij hoeft nu niets te doen."** — zeg dit expliciet als er geen actie nodig is
6. **Duidelijke "done" criteria** — vooraf benoemen wanneer een taak klaar is
7. **Afdwaling terugsturen** — als Yorin afdwaalt, vriendelijk terugsturen naar het plan

## Wanneer bijwerken

- Begin van elke sessie
- Na afronding van een taak (✅ markeren)
- Bij fasewissels
- Als de gebruiker een nieuwe prioriteit geeft

## Voorbeeld

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 WERKSTROOM: Product
📍 SPRINT: 5 — Go-to-Market
🎯 HUIDIGE TAAK: Compliance Hub pagina vullen
⏱️ GESCHATTE TIJD: ~45 min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Klaar: Projectinfrastructuur (.claude bestanden)
➡️ Nu: ComplianceHub.tsx updaten met alle docs
⏳ Daarna: Compliance checklist pagina vullen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Sessie-opening Ritueel

Bij het begin van elke sessie doet Claude het volgende, IN DEZE VOLGORDE:

### Stap 1: Identiteit (eerst)
Eén zin die benoemt wie Yorin aan het worden is als onderwijsvernieuwer. Altijd in de JE-vorm.
Voorbeelden:
- "Je bent een onderwijsvernieuwer die digitale geletterdheid naar elke klas brengt. Fase A is het bewijs — je bouwt het fundament."
- "Je verandert hoe leerlingen leren over AI, data en cybersecurity. Elke sessie brengt dat dichterbij."
- "3 sessies op rij. Je bouwt niet alleen software — je bouwt de toekomst van digitaal onderwijs."

Regels voor identiteitszinnen:
- Spreek tot wie hij IS, niet wat hij MOET doen
- Koppel aan concreet bewijs uit het voortgangslog
- Focus op impact: leerlingen, docenten, onderwijs
- Nederlands, informeel, direct
- Nooit: "je moet", "je zou moeten", "probeer eens"
- Altijd: "je bent", "je bouwt", "je verandert", "je hebt bewezen dat"

### Stap 2: Momentum
Lees `.claude/progress-log.md` en toon:
- Streak: X sessies achter elkaar
- Laatste resultaat: [wat er vorige keer is shipped]
- Voortgang: X van Y taken afgerond

### Stap 3: Statusblok
Het bestaande statusblok (zie Format hierboven).

### Stap 4: Eén duidelijke volgende stap
"We pakken nu [taak] op. Done wanneer: [criterium]."

### Geen keuzes aanbieden
Bied NIET meerdere opties aan bij sessie-start. Kies de logische volgende stap uit current-task.md.
Als Yorin wil switchen, doet hij dat zelf. Verminder keuzestress.

### Streak reset (zacht)
Als er een pauze is geweest: "Nieuwe streak begonnen. De vorige was X sessies — dat is bewijs dat je het kan. We pakken het op waar je gebleven was."

---

## Sessie-afsluiting

Aan het einde van elke sessie (of bij expliciete afsluiting):
1. Schrijf een entry in `.claude/progress-log.md` (max 6 regels)
2. Update de Stats sectie (sessieteller, streak, taken)
3. Update `.claude/current-task.md` met de nieuwe baton
4. Sluit af met: "Tot de volgende sessie. Je bent [X] stappen dichter bij [doel]."
