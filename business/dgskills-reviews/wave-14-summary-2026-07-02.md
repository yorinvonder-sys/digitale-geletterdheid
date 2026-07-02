# Batch-review wave 14 — verse reviews (2026-07-02)

Vijf missies beoordeeld: vier eindigen op fixed (met o.a. een onbereikbaar scoreplafond en een jaargroep-registratiefout hersteld), één met een drie-bronnen-SLO-conflict voor Yorin. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| spreadsheet-specialist | 8 / 9 / 5 | 2.5 | fix-eerst | 1 (zelfde-kleur-"gradient" → effen kleur; het agent-voorstel dat het uiterlijk zou veranderen is afgewezen) | fixed* | geen — ontbrekend briefing-asset hoort bij het platform-brede asset-gat |
| startup-pitch | 8.5 / 6.5 / 7 | 2.75 | fix-eerst | 2 (scoreplafond 60→55: er zijn 4 stappen + 3 vragen dus 60 was onhaalbaar — spiegelbeeld van de print-pro-vondst; jaargroep 1→3 conform mapping/curriculum — de missie telde onterecht mee in de leerjaar-1-dekking van de docent en in missie-suggesties) | fixed* | geen |
| website-bouwer | 8 / 9 / 8.5 | 1.45 | ok | 0 | fixed | geen — veilige live-preview en strakke AI-discipline geprezen |
| api-architect | 7.5 / 5.5 / 8 | 3.15 | fix-eerst | 0 | blocked | SLO-codes vertellen op 3 plekken 3 verhalen (mapping 22A/22B/21A · coach 22A/22B · periode-focus 21D/21C, geen overlap) — welke set is leidend? |
| data-handelaar | 9 / 9 / 8.5 | 1.15 | ok | 1 (antwoordchecker accepteert nu ook "data deal" mét spatie) | fixed* | geen — AVG-/welzijnscontent expliciet gecheckt |

*na Codex-gate.

## Gedeelde lijst (aanvullingen)

- **No-op zelfde-kleur-gradients** (`from-X to-X`) komen breder voor: alleen al in year2.tsx 5 instanties — veegronde-kandidaat (mechanisch, geen visuele wijziging).
- Coach-plan-desync: 6e missie (api-architect, 3/4 stappen).
- website-bouwer: `missionId === 'website-bouwer'` hardcoded in gedeelde PreviewPanel.tsx i.p.v. config-flag — architectuur-opruimkandidaat.

## Codex-gates

- spreadsheet-specialist (1), startup-pitch (2) en data-handelaar (1): uitslag in status-index en PR.
