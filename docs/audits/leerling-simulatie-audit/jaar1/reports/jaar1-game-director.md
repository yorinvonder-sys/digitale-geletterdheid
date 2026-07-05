## Opdracht Live Check: game-director

**Advies:** herontwerp · **Risico:** Rood · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=game-director

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Start: duidelijke blok-programmeer-puzzel (Blockly-achtig), doel en hint helder leesbaar, "Puzzel 1/5". Flow: loste Level 1 ("Robbie Ontwaakt", naar rechts lopen) correct en zonder problemen op via de klik-knoppen ("Voeg toe aan werkgebied", geen drag-and-drop nodig). Kwam vervolgens vast te zitten op Level 2 ("Over het Hek", spring bij spatiebalk): bouwde exact de door de Hint voorgeschreven configuratie (wanneer Spatiebalk ingedrukt + spring met kracht 15), maar de spatiebalk triggerde nooit een sprong — het spel reset telkens naar start. Feedback: geen foutmelding die verklaart waarom de sprong niet werkt. Eind: NIET bereikt — playthrough stopt definitief op Puzzel 2/5; Levels 3, 4 en 5 zijn niet getest.

**Speedrunner** — Start: probeerde direct blindelings te winnen met een enkel event-blok zonder actie → terecht geweigerd door START-check (geen zinloze acceptatie). Flow: los/rommelig blokgebruik (generiek "beweeg"-blok zonder richting, dubbele/tegenstrijdige blokken) werd ook terecht geweigerd — de check is dus niet triviaal te omzeilen. Met exact de juiste 2 blokken werd Level 1 wel meteen gehaald. Op Level 2 liep de Speedrunner onafhankelijk tegen dezelfde sprong-bug aan (getest met zowel de default Pijl-Rechts als Spatiebalk). Eind: ook hier stopt de playthrough op Puzzel 2/5.

**Chaoot** — Dubbelklikken op "voeg toe"-knoppen, snel conflicterende/tegenstrijdige blokken (6 stacks tegelijk), dubbelklik op START zelf, en een reload midden in het opbouwen van Level 2: geen enkele crash of JS-fout waargenomen. Puzzel-voortgang (welk level) overleeft een reload correct; alleen de tijdelijke werkgebied-blokken gaan verloren (geen auto-save, wat op zich acceptabel is). Onverwachte ontdekking: snel/herhaald klikken triggerde 2x een ongedocumenteerde melding "⚡ Snel gedaan! Hard Mode geactiveerd voor dit level!" zonder enige UI-uitleg. Ook hier bleef de bekende sprong-bug (3e onafhankelijke bevestiging) het obstakel op Level 2.

**Vastloper** — Voerde bewust 3x dezelfde fout uit op Level 1 (verkeerd bewegingsblok): geen automatische/adaptieve foutmelding verscheen, alleen het generieke "Robbie gaat terug naar start". De handmatig aangeklikte Hint zelf was wél concreet en bruikbaar. Volgde daarna de hint, loste Level 1 op, en voerde op Level 2 3x exact de door de Hint voorgeschreven configuratie uit — zonder resultaat, zonder enige verklarende foutmelding, zonder proactieve extra hulp na herhaalde mislukking. **Kernconclusie: een eerlijk spelende leerling kan hier permanent vastlopen, zonder enige in-UI uitweg.**

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Layout is verzorgd en consistent DUCK-stijl (acid-geel accent, duidelijke iconen per blok-categorie 🐾➡️🔁📊). Geen clipping, geen overlappende tekst, geen ontbrekende afbeeldingen op enige geteste viewport. Game-canvas (800x600) toont Robbie (hond-icoon), score-teller en een console-log met leesbare emoji-berichten. Blok-paneel toont bij het toevoegen geen duidelijke visuele bevestiging dat een blok WEL of NIET aan een bestaand event-blok gekoppeld is (blokken verschijnen los als aparte "stacks" met een lege "Sleep blokken hierheen"-dropzone er nog steeds zichtbaar bovenop) — verwarrend maar functioneel niet blokkerend voor Level 1.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ✅ start.png | ✅ flow-1 t/m flow-4 (BLOCK) | — (zie flow) | niet bereikt (playthrough stopt) |
| tablet-portrait (810x1080) | — | ✅ flow.png (nette tab-layout Blokken/Code/Game) | — | — |
| tablet-landscape (1080x810) | — | ✅ flow.png (3-koloms layout, consistent met desktop) | — | — |
| mobile (390x844) | — | ✅ flow.png (tab-layout, leesbaar, geen clipping) | — | — |

Responsief gedrag is op alle 3 non-desktop viewports correct: brede schermen tonen 3 kolommen naast elkaar, smalle schermen schakelen netjes over naar een tab-interface (Blokken/Code/Game). Geen visuele regressies gevonden op enige viewport.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — Level 2 ("Over het Hek"): de spatiebalk-toetsdruk triggert nooit een sprong, ook niet met de exact door de Hint voorgeschreven blokconfiguratie (wanneer Spatiebalk ingedrukt + spring met kracht 15). Spel reset telkens naar start i.p.v. te springen. **4x onafhankelijk gereproduceerd** over 3 verschillende profielen (Modelleerling, Speedrunner, Chaoot, Vastloper). — `evidence/game-director/modelleerling/desktop/flow-4-level2-space-no-jump-BLOCK.png`
2. **BLOCK** — Gevolg van #1: een eerlijk spelende leerling kan **permanent vastlopen** op Puzzel 2/5. Geen enkele in-UI uitweg (geen alternatieve hint, geen skip-optie, geen foutdiagnose) is beschikbaar. Levels 3, 4 en 5 zijn hierdoor in geen enkel profiel bereikt/getest. — `evidence/game-director/vastloper/desktop/flow-permanent-stuck.png`
3. **WARN** — Bij overgang naar een nieuw level blijven de blokken van het vorige level in het werkgebied staan (geen auto-clear); leerling moet zelf "Verwijder alles" gebruiken, wat een makkelijk te missen bevestigingsdialoog opent.
4. **WARN** — Na herhaalde identieke mislukkingen (3x) verschijnt geen adaptieve/proactieve foutmelding of extra hulp; feedback blijft het generieke "Robbie gaat terug naar start" zonder verklaring wat er mis ging.
5. **WARN** — "Hulp nodig?"-AI Coach toont bij openen een generieke, niet-passende begroeting over "Week 1 apps op je iPad (Magister, OneDrive, Word, PowerPoint)" — totaal niet relevant voor deze blokprogrammeer-puzzel.
6. **WARN** — Een concrete vraag stellen aan de AI Coach geeft "Je sessie is verlopen. Log opnieuw in." i.p.v. inhoudelijke hulp (mogelijk beperkt tot de dev-preview-zonder-login-omgeving, maar de knop is wel zichtbaar/klikbaar voor de leerling).
7. **WARN** — Herhaalde browserconsole-waarschuwing `The specified value "Waf!" cannot be parsed, or is out of range` verschijnt tientallen keren tijdens gameplay (tekstwaarde in een numeriek attribuut/veld).
8. **INFO** — Klikken op "Voeg toe aan werkgebied" plaatst blokken als losse, niet-gekoppelde "stacks" i.p.v. genest onder een bestaand event-blok; werkte toevallig voor Level 1 maar oogt verwarrend zonder duidelijke koppel-feedback.
9. **INFO** — Snel/herhaald klikken triggert een onaangekondigde systeemmelding "⚡ Snel gedaan! Hard Mode geactiveerd voor dit level!" zonder enige UI-uitleg.
10. **INFO** — Reload midden in een stap: puzzel-voortgang blijft correct behouden, alleen tijdelijke werkgebied-blokken gaan verloren — geen crash of corruptie.
11. **INFO** — Level 1's check accepteert geen zinloze/generieke input (bv. "beweeg stappen" zonder richting) en faalt ook bij te veel/dubbele blokken in het werkgebied — de puzzel is niet triviaal te omzeilen door te spammen.

### Nog onzeker

- Of de Level 2-sprongbug specifiek is aan de dev-preview-omgeving (bv. een keyboard-focus/event-listener die alleen daar anders werkt) of ook in productie zo optreedt — kon niet geverifieerd worden zonder codetoegang (buiten mijn rol).
- Of Levels 3, 4 en 5 verdere problemen bevatten — volledig ongetest omdat geen enkel profiel voorbij Level 2 kwam.
- Of de "Hard Mode"-melding een bestaande, bewust ontworpen feature is die elders wordt uitgelegd (bv. in een instructiescherm dat ik niet heb gezien) of een onbedoeld neveneffect.
