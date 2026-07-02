# Opdracht Live Check: mail-detective

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=mail-detective&reset=1

> Procesnotitie: de testrun is één keer onderbroken door een externe verbindingsstoring (geen app-fout). Profielen 1–3 waren op dat moment afgerond en gedocumenteerd; het vastloper-profiel is daarna volledig opnieuw van voren af aan gespeeld. Nevenbevinding van de storing: een reload op de dev-URL mét `reset=1` wist alle voortgang (verwacht gedrag van de reset-parameter; in de echte app zonder die parameter blijft voortgang juist behouden, zie chaoot-profiel).

## Student-playthrough (per profiel)

**Modelleerling** — Start: helder intro-scherm met leerdoel, bewijs-criterium en 4-stappenpreview; Start-knop werkt direct. Flow: 4 fases (multi-select signalen → rangschikken → 6× accepteren/weigeren → multi-select acties + verdiepingsvraag), overal duidelijke "geselecteerd"-status en per-item-uitleg na inleveren. Fout-feedback: bewust 1 fout (Weigeren op legitieme magister.net-mail) gaf een warm-geformuleerde ✕-uitleg ("Je bent extra voorzichtig — goed instinct! Maar…") en exact −4 punten. Eind: CompletionScreen 96/100 (96%) met per-fase-scores, "Wat je hebt geleerd"-lijst (5 concrete lessen) en Kees-compliment.

**Speedrunner** — Start: direct doorklikken werkt. Flow: blind de eerste optie kiezen komt overal doorheen; de "Controleer"-knop blijft correct disabled tot het minimum (3 selecties) en een geforceerde JS-klik op de disabled-knop deed niets — lege/premature indiening is effectief geblokkeerd. Fout-feedback: partial credit overal correct (13/25 per gemengde ronde). Eind: 64/100 met een adaptieve lagere-score-variant ("Waakzame Lezer" / "Goed bezig — en nu weet je precies wat er nog beter kan."). Missie in ~2 minuten "doorklikbaar" maar de scores maken het niet-lezen zichtbaar.

**Chaoot** — Dubbelklik op "Start de missie" veroorzaakte een ghost-click: op het volgende scherm stond meteen één optie voorgeselecteerd (WARN). Browser-back midden in Fase 1 leidde naar een volledig lege pagina (about:blank, randgeval zonder eerdere historie; WARN) — maar opnieuw navigeren herstelde de voortgang exact. Reload midden in een half-ingevulde rangschikking behield alles. Dubbelklikken op toggle-/rangschik-items veroorzaakte geen dubbeltellingen; "Accepteren + Weigeren op dezelfde rij" gaf voorspelbaar laatste-klik-wint. Multiple-choice disablet alle opties direct na de eerste klik (dubbelklik-veilig). Eind: 70/100, geen enkele console-error over de hele chaos-run. NB: deze missie heeft géén vrije tekstvelden (0 input/textarea) — de plak-onzin-test is niet van toepassing.

**Vastloper** — Er is géén retry per stap: elke fase wordt precies één keer beoordeeld, daarna is "Volgende ronde →" de enige weg (WARN) — 3× fout op dezelfde stap kan binnen één run letterlijk niet. Geen hint-/hulpmechanisme in de fases; Kees belooft in de intro "ik wijs je onderweg de weg" maar verschijnt tijdens de fases niet. Bij 3× exact dezelfde foute inzending (via dev-reset) is de feedback 100% identiek — geen escalerende hulp. Permanent vastlopen is onmogelijk: alles wordt met partial credit geaccepteerd, eindscore 31/100 volstond voor voltooiing. Het lage-score-eindscherm ("Blijf Oefenen") zegt "Probeer 'm gerust nog eens" maar heeft geen opnieuw-knop (WARN). De Fase 2-tip "Bijna goed" verscheen bij de slechtst mogelijke (exact omgekeerde) volgorde, 5/25 (WARN). De verdiepingsvraag na Fase 4 verschijnt alleen bij hogere ronde-score — de zwakste leerling krijgt die extra oefenkans niet.

## Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

- Kees-mascotte (eend-avatar) rendert netjes op intro- en eindscherm; geen ontbrekende afbeeldingen of gebroken logo's waargenomen in vier volledige playthroughs.
- Layout blijft intact op alle vier geteste viewports; op mobiel (390×844) is het eindscherm visueel geverifieerd via screenshot: scorekaart, per-fase-lijst en gele "Missie voltooid!"-knop netjes gecentreerd, geen clipping of overlap.
- Knopteksten zijn consistent en duidelijk ("Controleer mijn keuze", "Volgende ronde →", "Bekijk eindresultaat"); de "geselecteerd"-status is ook in de accessibility-tree aanwezig (goed voor screenreaders).
- Aandachtspunt: in Fase 3 (accepteren/weigeren) is er géén zichtbare per-item-bevestiging na een klik — je ziet pas bij "Controleer keuzes" wat je gekozen hebt (WARN 1).
- Emoji-iconen (📧📎🔗📬 etc.) dragen betekenis en renderen overal correct.

## Browserbewijs

| Viewport | Start | Flow | Feedback | Eind |
|---|---|---|---|---|
| Desktop 1440×900 | gezien/OK | gezien/OK | gezien/OK (issue: geen per-item-status F3) | gezien/OK |
| Tablet staand 810×1080 | — (zelfde render als desktop) | gezien/OK | — | gezien/OK |
| Tablet liggend 1080×810 | — | gezien/OK | — | gezien/OK |
| Mobiel 390×844 | — | gezien/OK | — | gezien/OK (visueel geverifieerd) |

Viewport-matrix is per opdracht alleen bij het modelleerling-profiel uitgevoerd; a11y-inhoud was op alle formaten identiek, geen afgekapte of onbereikbare interactie-elementen.

## Bevindingen

**BLOCK** — geen.

**WARN**
1. Fase 3 (6× accepteren/weigeren) toont geen enkele tussentijdse visuele bevestiging per beantwoord item; pas na "Controleer keuzes" zie je wat je koos. Leerling kan niet checken of een klik geregistreerd is. — `evidence/mail-detective/modelleerling/desktop/feedback.png`
2. Dubbelklik op "Start de missie" lekt een ghost-click naar het volgende scherm: één optie stond daar meteen voorgeselecteerd. — `evidence/mail-detective/chaoot/desktop/start.png`
3. Browser-back zonder eerdere historie leidt naar een kale lege pagina (about:blank) zonder vangnet of herstel-knop; voortgang bleef wel behouden bij terugkeren. — `evidence/mail-detective/chaoot/desktop/flow.png`
4. Geen retry-mogelijkheid per stap: feedback kan niet direct op dezelfde stap toegepast worden; systeem forceert altijd door. — `evidence/mail-detective/vastloper/desktop/feedback.png`
5. Fase 2-tip "💡 Bijna goed" verschijnt óók bij de slechtst mogelijke (exact omgekeerde) volgorde (5/25) — misleidend rooskleurig. — a11y-snapshot
6. Lage-score-eindscherm zegt "Probeer 'm gerust nog eens" maar biedt geen "Opnieuw proberen"-knop. — `evidence/mail-detective/vastloper/desktop/eind.png`

**INFO (selectie van 28; volledige lijst in JSONL)**
7. Disabled-guard op "Controleer"-knoppen blokkeert premature indiening effectief, ook bij geforceerde JS-klik.
8. State-persistentie is robuust: reload en weg-en-terug-navigeren behouden voortgang exact (incl. half-ingevulde rangschikking).
9. Partial-credit-scoring klopt in alle fases; rangschik-feedback toont per item de juiste positie "(#N)".
10. Vier adaptieve eindscherm-varianten (96/70/64/31% → "Mail Detective"/"Waakzame Lezer"×2/"Blijf Oefenen").
11. Foutfeedback is pedagogisch warm geformuleerd en inhoudelijk concreet per item.
12. Geen hints/hulp tijdens de fases; verdiepingsvraag alleen bij hoge Fase 4-score; feedback statisch bij herhaald identiek antwoord.
13. Geen console-errors of gefaalde netwerkrequests in alle vier de runs.
14. "Terug"-knop is in dev-preview een no-op (vermoedelijk contextgebonden; in echte app niet geverifieerd).
15. Missie bevat geen vrije tekstvelden — volledig knop-gebaseerd.

## Nog onzeker

- Gedrag van de "Terug"-knop en de "Missie voltooid!"-knop in de échte app-context (met login/dashboard): in dev-preview doen beide niets zichtbaars; XP-toekenning (+50 XP) en voortgangsregistratie richting dashboard zijn hier niet verifieerbaar.
- Of de ghost-click bij dubbelklik (WARN 2) ook op productie-hardware/touch-apparaten optreedt; getest in headless Chromium met Playwright-dblclick.
- De exacte score-drempel waarbij de verdiepingsvraag wel/niet verschijnt (waargenomen: wel bij 21–25/25, niet bij 13/25).
- Het about:blank-randgeval (WARN 3) trad op zonder eerdere browser-historie; in een normale leerlingsessie (met historie) gaat back vermoedelijk naar de vorige pagina — niet hier getest.

**Beslisregel toegepast:** geen BLOCK en de missie is op alle geteste viewports volledig start- én afmaakbaar met werkende kern-CTA's → geen herontwerp. Meerdere WARNs (6) → **fix-eerst**. Kwalitatief is de missie sterk (robuuste state, correcte scoring, adaptieve feedback); de zes WARNs zijn gerichte, kleine verbeteringen — vooral per-item-bevestiging in Fase 3, de "Bijna goed"-tip in Fase 2 en een opnieuw-knop op het eindscherm.
