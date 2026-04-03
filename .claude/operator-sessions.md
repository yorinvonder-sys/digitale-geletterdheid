# Operatorsessies — Standaard werkpatronen

> Vaste patronen voor hoe Claude verschillende soorten sessies afhandelt.

---

## 1. Implementatiesessie

- **Doel:** Code schrijven of feature bouwen
- **Typische duur:** 30-90 min
- **Patroon:** Lees → Plan → Bouw → Test → Commit
- **Verwacht resultaat:** Werkende code, gecommit op feature branch
- **Stop wanneer:** Feature werkt, build slaagt, acceptance-checklist doorlopen
- **Let op:** Geen afdwaling naar refactoring of "verbeteringen" buiten scope

## 2. Review/Audit sessie

- **Doel:** Code of documenten doorlopen en bevindingen rapporteren
- **Typische duur:** 15-45 min
- **Patroon:** Scope afbakenen → Systematisch doorlopen → Bevindingen rapporteren
- **Verwacht resultaat:** Lijst van bevindingen met prioriteit (blocker/belangrijk/nice-to-have)
- **Stop wanneer:** Alle bestanden in scope zijn bekeken
- **Let op:** Rapporteer, maar fix niet automatisch (tenzij gevraagd)

## 3. Planningsessie

- **Doel:** Taken prioriteren, sprint plannen
- **Typische duur:** 15-30 min
- **Patroon:** Status lezen → Opties bespreken → Prioriteren → Plan vastleggen
- **Verwacht resultaat:** Bijgewerkte current-task.md en task-queue.md
- **Stop wanneer:** Volgende 3-5 taken helder zijn
- **Let op:** Geen code schrijven, alleen plannen

## 4. Debug sessie

- **Doel:** Bug isoleren en fixen
- **Typische duur:** 15-60 min
- **Patroon:** Reproductie begrijpen → Hypothese → Onderzoek → Fix → Verifieer
- **Verwacht resultaat:** Bug gefixt, root cause uitgelegd
- **Stop wanneer:** Bug is opgelost en build slaagt
- **Let op:** Minimale fix, geen scope creep

## 5. Compliance sessie

- **Doel:** Documenten en code checken tegen regelgeving
- **Typische duur:** 30-60 min
- **Patroon:** Checklist doorlopen → Gaps identificeren → Rapporteren of fixen
- **Verwacht resultaat:** Compliance-status per item, actiepunten
- **Stop wanneer:** Alle items op de checklist zijn beoordeeld
- **Let op:** Geen claims maken die niet door de code worden ondersteund
