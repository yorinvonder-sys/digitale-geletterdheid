# Missie-review: Word Wizard / Wordexpert

**Mission ID:** `word-wizard`  
**Template:** `tool-guide`  
**Curriculum:** Leerjaar 1, Periode 1  
**Linear:** DGS-61  
**Datum:** 2026-08-04  
**Reviewer-pipeline:** `dgskills-mission-review`  
**Status:** reviewed, niet formeel gesloten  
**Verdict:** **FIX EERST**

## Eindoordeel

De herstelde opdracht is inhoudelijk, didactisch, technisch en responsief releasewaardig op de exacte mergecommit. Na expliciete toestemming heeft Sol de resterende productiejourney in de interne ChatGPT-browser voorbereid. De private route toonde wel de gedeelde synthetische naam, maar onverwacht een verplichte avatar-onboarding. De read-only productiedata voor het bedoelde 50-XP/2-missierecord zegt juist dat onboarding voltooid is, terwijl een tweede record met dezelfde zichtbare naam 0 XP/0 missies en onvoltooide onboarding heeft. Daardoor konden zichtbare identiteit, XP, missietelling en unlock niet samen en uniek worden bewezen. Volgens de fail-closed-regels is onmiddellijk gestopt. Er zijn exact nul Word Wizard-antwoord-, checklist-, completion-, XP- of voortgangsmutaties uitgevoerd.

De opdracht mag pas `SHIP` krijgen nadat één geserialiseerde productieflow op de synthetische account zichtbaar 55/55 bereikt, precies 25 XP toekent en completion plus XP na een volledige reload bewaart.

## Telling open bevindingen

- **Blocker: 1** — verplichte exact-once-productiecompletion en persistencebewijs ontbreken omdat de zichtbare interne-browsersessie niet uniek aan het bedoelde 50-XP/2-missierecord kon worden gekoppeld vóór de eerste mutatie.
- **High: 0**
- **Medium: 1** — fysieke iPad Safari en de fysieke Word-app blijven niet getest; versie, licentie, tenant en schermstand kunnen de zichtbare Word-interface beïnvloeden.
- **Low: 0**

De productcode zelf heeft na de fixes geen resterende blocker/high-bevindingen.

## Fixes en release

- Oorspronkelijke kandidaat: `f227626d0ae5c3e41dca02c1cd7e45455bf0dd79`, met stale parent `2401a92b859ac9b381ae013e172823463bf28756`.
- Geldige kandidaatwijzigingen schoon gereplayed op `37062155fe50b153efec591f00d06e13dce03074`.
- Aanvullende fixcommit: `97c382b1f54b7d9fb4dd1d655b96a18b399109e4`.
- Fix-PR: [#265](https://github.com/yorinvonder-sys/digitale-geletterdheid/pull/265), checks groen, gesquasht en gemerged.
- Exacte mergecommit: `58f902c856fab0b514b0565ff79b47f91fac328f`.
- Exacte productie-deployment: `dpl_Csskxcsdo5auZtZ73YEWhp2daqj6`, `READY`, target `production`, GitHub-SHA `58f902c856fab0b514b0565ff79b47f91fac328f`.

De fix bevat:

- hetzelfde-vraag-herstel na een fout antwoord, met hulp zonder visuele onthulling van het juiste antwoord;
- concreet docentbewijs bij iedere Word-actie buiten DGSkills;
- een haalbaar scorecontract van exact 55/55;
- een missiebeloning en zichtbare belofte van exact 25 XP;
- voorwaardelijke Microsoft 365-prerequisites en een fail-safe route via de docent;
- duidelijke OneDrive-opslag en bestandsnaam `Naam_Verslag_Vak.docx`;
- een neutrale, docent-aangeleverde of aantoonbaar herbruikbare afbeelding, geen persoonlijke foto's of mensen, met bronnotitie;
- correcte relatie tussen Kop 1/Kop 2 en een automatische inhoudsopgave;
- de waarheidsgetrouwe beperking dat Word voor iPad een bestaande inhoudsopgave kan openen, maar toevoegen en bijwerken op laptop of desktop gebeurt;
- gedeelde ToolGuide-ARIA-feedback en gemeten minimumtargets van 44x44 px.

## Tests en checks

- Worker-gerichte suite: 23/23 PASS.
- Sol-hercheck: `node --test tests/word-wizard-contract.test.ts tests/mission-xp-contract.test.ts tests/mission-completion-contract.test.ts` — 17/17 PASS.
- `npm run doctor` — PASS.
- `npm run build:prod` — PASS; alleen de verwachte lokale waarschuwing voor ontbrekende Supabase-envvariabelen.
- `npm run audit:security` — PASS.
- `npm audit --omit=dev` — 0 kwetsbaarheden.
- `git diff --check` — PASS.
- PR-checks: `quality-checks` PASS, `performance` PASS, Vercel PASS, Vercel Preview Comments PASS, `validate-handoff` SKIPPED.
- Aanvullende Opus-review — **geen PASS**; OAuth refresh mislukte.

## Designreview

**PASS op de vier vereiste CSS-viewports.**

- Desktop 1440x900
- iPad portrait-emulatie 820x1180
- iPad landscape-emulatie 1180x820
- Mobile 390x844

Alle vier flows zijn vers uitgevoerd vanaf een schone worktree op de exacte mergecommit. Intro, normale flow, foutfeedback, herstel, privacy-middenstap, score 55 en results zijn vastgelegd. Er is geen horizontale overflow gemeten, er zijn geen interactieve targets onder 44x44 px gevonden en er is geen overlap, clipping of onleesbare tekst waargenomen.

Dit bewijst Chromium-CSS-emulatie in de interne ChatGPT-browser. Het bewijst geen fysieke iPad Safari en geen fysieke Microsoft Word-app.

## Didactiekreview

**PASS.**

- De leerling maakt één logisch schooldocument en bouwt de vaardigheid stapsgewijs op.
- Kop 1 en Kop 2 worden inhoudelijk gekoppeld aan de automatische inhoudsopgave.
- Iedere externe handeling heeft een concrete docentcheck.
- Het foutantwoord geeft een bruikbare hint en laat de leerling dezelfde vraag herstellen.
- De afbeeldingstaak is privacyveilig en vraagt bronbewustzijn.
- De TOC-stap faalt veilig als laptop/desktop, versie, licentie of interface afwijkt: de leerling laat de kopstructuur zien en vraagt de docent om de desktopstap te demonstreren.

## Technische review

**PASS in preview; productie-persistence nog onbewezen door een fail-closed identity/onboarding-gate.**

- Zichtbare score bereikt 55/55 op ieder viewport.
- De foutstatus heeft `role=status` met `aria-live=polite`.
- Tijdens feedback is de gekozen foute optie herkenbaar; het juiste antwoord wordt niet gemarkeerd.
- `Opnieuw kiezen` activeert alle keuzes op dezelfde vraag opnieuw.
- Herstel verhoogt stap 1 van 10 naar 15 punten.
- De XP-contracttests bewaken exact 25 XP voor `word-wizard`.

Productie-award en persistence zijn niet uitgevoerd en mogen niet uit de preview worden afgeleid.

## Microsoft Word-bronnen en beperkingen

De instructies zijn afgestemd op officiële Microsoft-documentatie:

- [What's New in Word on Mobile Platforms](https://support.microsoft.com/en-US/Word/what-s-new-in-word-on-mobile-platforms): Word voor iOS kan een bestaande inhoudsopgave openen, maar niet toevoegen of bijwerken.
- [Format your Word document](https://support.microsoft.com/en-US/Word/format-your-word-document): stijlen bestaan in Word voor iPad, maar de zichtbare route kan met versie en schermstand verschillen.
- [When do I need a Microsoft 365 subscription?](https://support.microsoft.com/en-US/Microsoft-365-Activation-Licensing/when-do-i-need-a-microsoft-365-subscription): een abonnement kan nodig zijn bij grotere apparaten, zakelijke schoolopslag of premiumfuncties.

Daarom noemt de opdracht geen specifieke fysieke knop als universeel, vraagt zij bij een ontbrekende functie de docent en claimt de DGSkills-preview niet dat de fysieke Word-interface bewezen is.

## Evidence

### Geaccepteerd

- `screenshots/mission-audit/batches/j1p1/word-wizard/58f902c/final-merged-preview/sol-iab/`
  - `manifest.json`
  - `review.md`
  - `SHA256SUMS`
  - `desktop-1440x900/`
  - `ipad-portrait-820x1180/`
  - `ipad-landscape-1180x820/`
  - `mobile-390x844/`
- De vier volledige flows bereiken 55/55 en tonen één fout, feedback en succesvol herstel.

### Verworpen als finalevidence

- `screenshots/mission-audit/batches/j1p1/word-wizard/2401a92/worker-desktop-portrait/desktop-1440x900` — verkeerde antwoordkeuze schakelde herstel uit; 50/55.
- `screenshots/mission-audit/batches/j1p1/word-wizard/298c1bb/local-preview` — oud, alleen desktop/portrait, geen herstel, geen landscape/mobile/productie.
- `screenshots/mission-audit/batches/j1p1/word-wizard/f227626/worker-landscape-mobile/pre-capture-plan.md` — alleen planning/preflight.
- `screenshots/mission-audit/batches/j1p1/word-wizard/97c382b/pre-merge-preview/` — nuttige pre-merge QA, maar niet de finale mergecommit.
- `screenshots/mission-audit/batches/j1p1/word-wizard/58f902c/production/sol-authorized-blocked/` — geldige blocker-evidence, maar geen finale productieflow: de sessie stopte vóór iedere Word Wizard-mutatie wegens een niet-uniek bewijsbare accountstate.
- Alle ontbrekende, mislukte, onvolledige of wrong-commit manifests.

## Luna-resultaten

- Productie-Luna: fail-closed STOP. Directe interne-browserselectie en één gedocumenteerde reconnectpoging gaven beide `Browser is not available: iab`; exact nul mutaties.
- Desktop/iPad-portrait-Luna: fail-closed STOP wegens onbeschikbare interne browser; blocker-evidence geschreven, nul mutaties.
- Landscape/mobile/fix-Luna: kandidaat schoon gereplayed, fixes en tests uitgevoerd, PR #265 gemaakt en checks gemonitord; geen productie/auth.
- Sol: valideerde diff, tests, build, security, release en Vercel-SHA, nam de side-effect-free interne-browsercaptures over en probeerde na expliciete toestemming de productiejourney. Sol stopte vóór de missie toen de zichtbare onboardingstate niet overeenkwam met het bedoelde read-only accountrecord en dezelfde zichtbare naam op een tweede synthetisch record voorkwam.

## Productie en cleanup

- Productiecompletion: niet uitgevoerd.
- Productiescore: niet bewezen.
- Toegekende XP: niet bewezen.
- Reload-persistence: niet bewezen.
- Read-only productiebaseline van het bedoelde record: `50 XP / 2 missies`, Word Wizard niet voltooid, avatar- en nulmeting-onboarding voltooid. Deze baseline kon niet gelijktijdig zichtbaar en uniek in de browser worden bevestigd en telt daarom niet als browsergate.
- De interne browser toonde de synthetische naam met een verplichte avatar-onboarding. Omdat een tweede synthetisch record dezelfde naam heeft met `0 XP / 0 missies` en onvoltooide onboarding, is geen keuze of onboardingactie uitgevoerd.
- De gedeelde synthetische account blijft behouden tot de volledige J1P1-period cleanup.
- De Sol-productietab is gesloten; de interne-browser-tablist is leeg; het tijdelijke lokale loginhulpmiddel is verwijderd.
- Lokale preview-auth is niet gebruikt.

## Evidence-PR en batchstatus

Evidence-PR [#257](https://github.com/yorinvonder-sys/digitale-geletterdheid/pull/257) blijft open en draft. De veilige batchsamenvatting blijft **2/5**: Magister Meester en Cloud Commander zijn gesloten; Word Wizard wordt pas 3/5 na geldige productiecompletion en persistence.

## Volgende toegestane actie

Los eerst de dubbele zichtbare synthetische identiteit en de tegenstrijdige onboardingstate veilig op, zonder leerlingdata of een nieuwe account aan te maken. Daarna mag Sol in deze Word Wizard-chat opnieuw vanaf een schone interne-browsersessie de zichtbare gates bevestigen en de nog ongebruikte exact-once-productiecompletion uitvoeren. Zonder die unieke zichtbare koppeling blijft de juiste beslissing `FIX EERST` en blijft evidence-PR #257 op 2/5.

Start geen volgende opdracht in deze chat.
