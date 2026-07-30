# Opdracht Live Check: prompt-master

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=prompt-master&reset=1

Getest op 2026-07-02 met 4 gedragsprofielen (Modelleerling, Speedrunner, Chaoot, Vastloper) via een headless-Chromium-harnas (a11y-snapshots als primaire waarneming + screenshots op 4 viewports). Geen BLOCK-bevindingen; drie unieke WARN-issues → volgens de beslisregel "fix-eerst". De missie zelf is functioneel sterk en overal start- en afmaakbaar.

## Student-playthrough (per profiel)

**Modelleerling** — Intro is helder (doel, werkwijze in 4 stappen, 3 niveaus). Volledige run: 6/6 rondes over 3 niveaus (Beginner → Gevorderd → Expert), eindscore 250 pts, duidelijk eindscherm "Prompt Master!" met per-niveau-overzicht (2/2 elk) en 4 learnings. Bewust zwak antwoord in ronde 1 ("Teken een hond") gaf uitstekende feedback: 4 ontbrekende elementen elk met uitleg + 3 concrete tips; na verbetering "Missie Geslaagd!" met alle elementen herkend. Feedback-analyse is deterministisch/regel-gebaseerd op elementherkenning in de prompttekst en werkt betrouwbaar.

**Speedrunner** — Kan de missie NIET doorlopen met lege of zinloze invoer. Verstuur-knop is disabled bij <5 tekens (leeg, ".", "ja" geblokkeerd; drempel bevestigd in code: `trim().length < 5`). Bij 5+ tekens onzin ("jajaj") wordt versturen mogelijk maar herkent de analyse correct 0/5 elementen → "Nog niet helemaal", en "Bekijk resultaat"/"Volgende uitdaging" blijft disabled tot een geslaagde poging. Herhaald opnieuw versturen zonder verbetering verandert daar niets aan — geen bypass gevonden.

**Chaoot** — ~320 tekens onzin met emoji, symbolen en een `<script>alert(1)</script>`-payload: veilig als platte tekst verwerkt, geen script-executie, geen console-errors. Dubbelklikken op verstuur/verbeter-knoppen: geen dubbele state-sprongen. Reload midden in een stap: score + niveau blijven behouden (auto-save vangnet werkt), alleen niet-verstuurde veldinhoud gaat verloren (normaal browsergedrag). Browser-back naar about:blank en terug: voortgang intact. Rare klikvolgordes: geen crash. NB: de allerlaatste verificatie (ronde netjes afronden ná de chaos-reeks) is niet afgemaakt door een storing in het test-harnas zelf (browser-daemon viel weg) — alle kern-chaos-checks waren op dat moment al afgerond en toonden geen enkele breuk.

**Vastloper** — 3× achter elkaar zwakke prompt ("maak iets" 2×, "doe maar wat" 1×) op dezelfde stap: feedback legt telkens concreet uit WAT beter moet (per element een gerichte vraag: "Wat wil je?", "In welk format?", enz. + 3 niveau-tips + omschrijving van het ideale resultaat) — dus géén kaal "niet goed". Feedback blijft over pogingen identiek: stabiel, maar geen escalerende hulp na N mislukkingen. Permanent vastzitten kan niet: de getoonde "Ideaal Resultaat"-tekst is bijna letterlijk een werkende prompt; die overtypen geeft direct "Missie Geslaagd!" (zie WARN 3).

## Visuele UI/UX

- Layout op alle 4 viewports netjes: duidelijke hiërarchie, DUCK-stijl (acid-gele CTA's, afgeronde kaarten), goed leesbare tekst op mobiel 390px.
- Goed/slecht-promptvergelijking ("Bekijk eerst het verschil") is didactisch sterk en rendert side-by-side op desktop/tablet, gestapeld op mobiel.
- Voortgang in de header (niveau-badge, ronde-bolletjes, score) is compact en duidelijk.
- Afbeeldingen: de AI-beeldgeneratie (Black Forest Labs FLUX) leverde in deze dev-preview geen echte afbeeldingen — nette fallback-tekst zichtbaar ("De afbeelding kon nu niet worden gemaakt. Probeer het straks opnieuw."), skeleton-placeholders op mobiel. Faalt netjes, geen kapotte image-tags. Vermoedelijk ontbrekende provider-key in lokale dev; in productie via edge function te verifiëren.
- Teken-rondes (1 en 3) tonen alt-teksten voor de voorbeeld-afbeeldingen (a11y in orde); tekst-rondes (2, 4-6) werken volledig zonder beelddependentie.

## Browserbewijs

| Viewport | Start | Flow | Feedback | Eind |
|---|---|---|---|---|
| Desktop (1440×900) | gezien/OK | gezien/OK | gezien/OK | gezien/OK |
| Tablet staand (810×1080) | gezien/OK | gezien/OK | gezien/OK | gezien/OK |
| Tablet liggend (1080×810) | gezien/OK | gezien/OK (visueel geïnspecteerd) | gezien/OK | gezien/OK |
| Mobiel (390×844) | gezien/OK (visueel geïnspecteerd) | gezien/OK | gezien/OK (visueel geïnspecteerd) | gezien/OK (visueel geïnspecteerd) |

Alle 16 cellen als screenshot vastgelegd onder `evidence/prompt-master/modelleerling/<viewport>/<stap>.png`; 4 screenshots ook daadwerkelijk visueel geopend en beoordeeld (geen layout-issues). Kern-CTA ("Verstuur naar AI" / "Volgende uitdaging") bruikbaar op elk formaat.

## Bevindingen

**WARN**
1. **Inconsistente slaag-drempel tussen rondes.** Ronde 1 (Beginner) wijst een prompt met ontbrekende elementen af ("Nog niet helemaal"), maar rondes 2, 5 en 6 tellen 3-van-4 of 4-van-5 elementen als "Missie Geslaagd!" terwijl één element expliciet rood als ontbrekend gemarkeerd staat. Mogelijk bewust soepeler ontwerp, maar het contrast verwart: "geslaagd" + rode ontbrekende-element-markering in hetzelfde scherm. — bewijs: `evidence/prompt-master/modelleerling/desktop/flow-2.png`, `flow-3.png`, `mobile/feedback.png`
2. **`reset=1` van de dev-preview werkt niet betrouwbaar** (3× onafhankelijk gereproduceerd, ook na verse browserstart met bestaande voortgang): de reset-`useEffect` in `src/features/dev-tools/DevMissionPreview.tsx` (regel 67-74) draait ná de eerste render, terwijl `src/hooks/useMissionAutoSave.ts` de oude localStorage al tijdens die render in state heeft geladen; de debounced save (1s) en de unmount-flush (regel 116-123) schrijven de oude state daarna terug. Raakt alleen de dev-preview/test-flow, niet een normale leerlingsessie. Fix-richting: reset synchroon vóór de eerste render, of missie-component pas mounten na voltooide reset. — bewijs: reproductie-log in JSONL (3 entries)
3. **De uitweg voor vastlopers is te letterlijk.** De feedback toont bij falen een "Ideaal Resultaat"-tekst die bijna woordelijk een werkende prompt is; die overtypen geeft direct "Missie Geslaagd!". Goed tegen frustratie (nooit permanent vast), maar een leerling kan zo elke ronde halen zonder zelf te leren formuleren. — bewijs: `evidence/prompt-master/vastloper/desktop/eind.png`

**INFO**
4. Beeldgeneratie (FLUX) geeft in dev-preview geen echte afbeeldingen; nette fallback, geen console/network-errors. In productie verifiëren. — `evidence/prompt-master/modelleerling/desktop/feedback.png`
5. Feedback-kwaliteit op zwakke prompts is sterk: per ontbrekend element een gerichte vraag + concrete tips. — `evidence/prompt-master/modelleerling/desktop/feedback.png`, `vastloper/desktop/feedback.png`
6. Anti-speedrun-mechanismen werken: 5-tekens-minimum + inhoudelijke elementanalyse + disabled doorgaan-knop tot succes. — `evidence/prompt-master/speedrunner/desktop/flow.png`
7. Chaos-bestendig: XSS-payload inert, dubbelklik-veilig, reload-veilig (voortgang behouden via auto-save), back/forward-veilig. — `evidence/prompt-master/chaoot/desktop/flow.png`
8. Geen escalerende hulp na herhaald falen (feedback blijft identiek) — overweeg een extra hint of voorbeeldknop na 3 mislukkingen. — `evidence/prompt-master/vastloper/desktop/feedback.png`
9. Laatste Chaoot-verificatie afgebroken door harnas-storing (browser-daemon), niet door de missie; kern-checks waren al afgerond.

## Nog onzeker

- Werkt de FLUX-beeldgeneratie in productie wél? (dev-preview had geen geldig provider-antwoord; het datapad zelf gaf geen errors)
- Is de soepelere slaag-drempel in latere rondes (WARN 1) bewust ontwerp (progressieve tolerantie) of een bug? Code-check van de per-ronde `passed`-logica nodig.
- Persistentie/score-integratie met het echte leerling-dashboard (XP, missie-voltooiing) is buiten deze dev-preview niet te testen zonder login.
- De Chaoot-slotverificatie (ronde afronden ná chaos) is door de harnas-storing niet formeel afgemaakt; alle individuele chaos-checks slaagden wél.

**Beslisregel toegepast:** geen BLOCK, wel 3 WARNs (meerdere) → **fix-eerst**. Niets hiervan blokkeert leerlingen hard; WARN 1 en 3 zijn kleine gerichte fixes in de missie-logica, WARN 2 is een dev-tooling-fix.
