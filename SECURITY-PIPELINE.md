# SECURITY-PIPELINE.md — poort vóór het bouwen

> **In gewone taal.** Dit bestand beantwoordt twee vragen *voordat* er code geschreven
> wordt: moet dit nu gebouwd worden, en zit er een veiligheidsrisico in? Daarna wijst het
> naar één vaste route per omgeving. Elke route eindigt met bewijs — en bij dat bewijs
> staat altijd wát het **niet** aantoont. Een groen vinkje dat niets bewijst is
> gevaarlijker dan geen vinkje.
>
> Claude leest hier alleen de sectie die `CLAUDE.md` § Security-poort aanwijst.

## POORT-0 — twee vragen

**1. Moet dit nu?** Bouw geen veld, tabel, opslag of beveiliging die nog niemand gebruikt.
Noodzaak is geen securityvraag: gebruik daarvoor de skill `functionality-complexity-tradeoff`
of `strategie-kompas`. Slaat de wijziging een persoonsgegeven op dat niet in de DPIA staat,
ga dan naar `STOP`.

**2. Zit hier risico?** Gebruik de bestaande schaal uit `AGENTS.md` § Risk Labels
(Groen / Geel / Rood). Er is geen tweede schaal.

Past je wijziging in meerdere routes, loop ze alle af; ze vullen elkaar aan. Is het werk Rood
volgens `AGENTS.md` — denk ook aan betalingen, facturen, bankgegevens, webhooks en toestemming —
maar past het bij géén route hieronder, ga dan naar `STOP` en leg het aan Yorin voor. Een Rode
wijziging zonder route is een gat in dit document, geen vrijbrief.

## P-DB — database en migraties

**Wanneer:** `supabase/migrations/`, of er komt een tabel, kolom, policy of `pg_cron`-taak bij.

**Volgorde:**
1. Nieuwe migratie met tijdstempelnaam. Een bestaande herschrijven mag alleen wanneer het
   aantoonbaar noodzakelijk is, en dan met de reden erbij (zie `supabase/CLAUDE.md` § Migration rules).
2. `CREATE TABLE` → `GRANT` → `ENABLE ROW LEVEL SECURITY` → `CREATE POLICY` per rol én per operatie.
3. Bestaande policy aanpassen bij voorkeur met `ALTER POLICY`, zodat rollen en de `USING`-clausule
   intact blijven. Verandert het commando (`SELECT`/`INSERT`/…) of permissive-versus-restrictive, dan
   kán `ALTER POLICY` dat niet en is drop-en-hermaken onvermijdelijk: doe dat in één migratie en
   schrijf erbij waarom.
4. Gevoelige logica in `SECURITY DEFINER`, met `search_path` altijd expliciet gezet — de
   repo-conventie is `SET search_path = public`. Een leeg `search_path` met volledig gekwalificeerde
   namen is strikter; wijk niet eenzijdig af van de conventie, leg het aan Yorin voor. Daarna
   `REVOKE ALL` plus gerichte `GRANT EXECUTE`. Fail-closed: onbekend betekent geweigerd.
5. Benoem het gevolg voor rapportage, rechten en wat er zichtbaar wordt.

**Invarianten:** `supabase/CLAUDE.md` § Security rules.
**Bewijs:** zie `BEWIJS`, rij P-DB. Let op: de RLS-controle is deels handmatig.
**Stop als:** een bestaande policy zou verdwijnen of verzwakken.

## P-EDGE — edge functions en AI-keten

**Wanneer:** `supabase/functions/`, `supabase/config.toml`, of AI-instructies in `src/config/agents/`
of `src/config/templateRegistry.ts` — beide zijn bron voor het gegenereerde
`supabase/functions/_shared/systemInstructions.ts`, dat je nooit met de hand bewerkt.

**Volgorde:**
1. Valideer de `Authorization`-header. Geen anonieme toegang tenzij uitdrukkelijk ontworpen.
2. Moet de function tóch publiek zijn, dan hoort daar drie keer een vastlegging bij:
   `verify_jwt = false` in `supabase/config.toml`, een regel in `publicEndpointRules` van
   `scripts/check-website-security-posture.mjs`, en een eigen bescherming (CORS, rate limit,
   moderatie). Ontbreekt alleen de `config.toml`-regel, dan blijft de default `true` gelden en is de
   function afgeschermd — dan werkt hij niet, maar lekt hij niet. Ontbreekt de eigen bescherming
   terwijl `verify_jwt = false` er wél staat, dán staat de deur open.
3. Blijft de function afgeschermd, voeg dan géén `config.toml`-entry toe — de default is `true`.
4. Gebruik `buildCorsHeaders`; nooit een wildcard-origin.
5. Sanitize alle clientinvoer vóór database of AI-model. `systemInstruction` komt van de
   server via `roleId`, nooit van de client. Behandel opgeslagen tekst van gebruikers als
   mogelijke promptinjectie, niet alleen de directe invoer.

**Invarianten:** `supabase/CLAUDE.md` § Security rules; uitvoerbaar in
`scripts/check-website-security-posture.mjs`.
**Bewijs:** zie `BEWIJS`, rijen P-EDGE.
**Stop als:** `verify_jwt` omlaag zou gaan, of een endpoint publiek wordt zonder die drie vastleggingen.

## P-AUTH — rollen, rechten en routebeveiliging

**Wanneer:** `src/services/PermissionService.ts`, inlog- of MFA-logica, routebeveiliging, of
een Realtime-subscription of Storage-bucket die gegevens van anderen kan raken.

**Volgorde:**
1. Autorisatie hoort server-side en toetst zowel rol als eigenaarschap. Een controle in de
   browser is gemak, geen beveiliging.
2. Schoolafbakening en rolgrenzen blijven intact: een docent ziet alleen de eigen school.
3. MFA (AAL2) voor docent- en adminrollen wordt niet omzeild.
4. Realtime en Storage leunen op eigen beleid: Postgres Changes volgt de RLS van de tabel, een
   privébucket volgt RLS op `storage.objects`, maar Broadcast en Presence vereisen apart
   kanaalbeleid. Ga nooit uit van overerving — stel per geval vast wat de grens afdwingt.

**Invarianten:** `AGENTS.md` § Security Baseline; `.claude/acceptance-checklist.md` § 2.
**Bewijs:** zie `BEWIJS`, rij P-AUTH. Er bestaat hier geen dekkend script.
**Stop als:** een bestaande rol-, MFA- of eigenaarschapscontrole zou verdwijnen.

## P-SECRETS — sleutels en omgevingsvariabelen

**Wanneer:** er komt een omgevingsvariabele, sleutel of externe dienst bij, of er wijzigt er één.

**Volgorde:**
1. Alles met `VITE_`-prefix belandt in de browserbundel en is dus publiek. Een secret krijgt
   die prefix nooit.
2. Serverzijdige sleutels: Supabase-functiesecrets via `Deno.env.get()`, of Vercel-projectinstellingen.
3. Scope de variabele per omgeving. Een preview-deploy krijgt geen productiesleutel.
4. Nooit in code, nooit in een logregel, nooit in een prompt.

**Invarianten:** `supabase/CLAUDE.md` § Security rules.
**Bewijs:** zie `BEWIJS`, rij P-SECRETS.
**Stop als:** een sleutel zichtbaar is geweest. Toon de waarde niet, noem alleen veld en
vindplaats, en waarschuw Yorin — roteren gebeurt bij de bron en is zijn beslissing.

## P-DEPLOY — build, deploy en afhankelijkheden

**Wanneer:** `vercel.json`, een dependency in `package.json`, `.github/workflows/`,
`index.html` of `vite.config.ts`.

**Volgorde:**
1. De headerset in `vercel.json` is een contract: CSP, HSTS, `frame-ancestors 'none'`,
   COOP/CORP. Verzwakken alleen op uitdrukkelijke opdracht van Yorin.
2. Nieuwe dependency: `audit:security` groen. Een allowlist-uitzondering krijgt een vervaldatum.
3. Een nieuw script in `index.html` draait mee in de pagina van de leerling en kan alles lezen wat
   daar staat. Een Vite-plugin draait tijdens development en build, maar kan clientcode injecteren
   die dat óók doet. Haalt het iets van buiten binnen, behandel het dan als een nieuwe externe
   dienst en loop óók `P-SECRETS` af.

**Invarianten:** `vercel.json` zelf; `scripts/check-website-security-posture.mjs` voor de headers.
**Bewijs:** zie `BEWIJS`, rijen P-DEPLOY.
**Stop als:** een beveiligingsheader of CSP-directive zwakker wordt.

## R-DATA — wat het systeem verlaat

Geldt voor logs, exports, foutmeldingen en alles wat naar een extern model gaat.

- Een logregel bevat nooit inhoud die een leerling heeft geschreven, geen geboortedatum en
  geen naam in combinatie met schoolgegevens. Identificeer met een id, niet met een persoon.
- Foutmeldingen naar de client zijn generiek. Details blijven server-side.
- Aggregaties richting AI volgen de bestaande drempel: onder een groepsgrootte van 5 gaat er
  niets naar het model (`MIN_COHORT_SIZE` in `supabase/functions/getClassInsight/index.ts`).
  Die norm geldt voor élke nieuwe aggregatie, niet alleen voor die ene function.
- Bewaartermijnen staan bindend in `business/nl-vo/compliance/verwerkingsregister.md`. Neem ze
  daar niet over — wijk je ervan af, dan is dat een compliancekwestie en ga je naar `STOP`.

## R-FRONT — weergave en invoer

- Door gebruikers ingevoerde tekst gaat gesanitized naar het scherm; AI-output net zo.
- Validatie in de browser is gebruiksgemak; de server valideert opnieuw.
- Verder: `.claude/acceptance-checklist.md` § 2 en § 3.

## STOP — niet doorbouwen, eerst Yorin vragen

**Fatale invarianten.** Deze staan hier voluit omdat je ze moet zien zonder een ander bestand
te openen:

1. Autorisatie gebeurt server-side en toetst rol én eigenaarschap.
2. Elke tabel die de app benadert, heeft RLS aan staan.
3. Secrets komen nooit in de browserbundel, een logregel of een prompt.
4. Een publiek endpoint heeft een uitdrukkelijke, vastgelegde bescherming.
5. Een vermoed lek: stop, toon de waarde niet, waarschuw Yorin.

**Stop bovendien wanneer** een bestaande beveiliging zou verzwakken, er een persoonsgegeven
bij komt dat niet in de DPIA staat, of wanneer je een controlescript uit `BEWIJS` zou
versoepelen — dat laatste maakt het bewijs stiller zonder dat iemand het merkt.

## BEWIJS

De derde kolom is verplicht en volgt één vorm: *"Kan groen zijn terwijl X. Aanvullend nodig: Y."*
Formuleringen als "geen garantie" of "bewijst niet alles" zijn niet toegestaan — noem het
concrete onveilige geval. Wijzigt een script inhoudelijk, dan wordt zijn rij hier herbeoordeeld.

| Route | Bewijs | Belangrijkste grens — niet uitputtend |
|---|---|---|
| P-DB | `npm run check:rls:throwaway` | Kan groen zijn terwijl een nieuwe tabel `relrowsecurity = false` heeft: het script toetst een vaste reeks benoemde scenario's, geen dekking over alle tabellen. Aanvullend nodig: query `pg_class` op tabellen in `public` zonder RLS, en die uitkomst moet leeg zijn. |
| P-EDGE | `npm run security:check` | **Staat vandaag al op rood** met drie bevindingen op `import-ai-cost`; een nieuwe rode regel valt daardoor niet op. Kan bovendien groen zijn terwijl een nieuwe function ongecontroleerd blijft: de inventaris komt uit `git ls-files`, dus een nog niet toegevoegd bestand telt niet mee. En hij leest de bron op markers, niet op gedrag: een function die het woord `Authorization` bevat zonder de uitkomst af te dwingen, komt erdoor. Aanvullend nodig: `git add` vóór je meet, de bestaande drie bevindingen apart afhandelen, en de function zonder token aanroepen. |
| P-EDGE | `npm run typecheck:edge` | **Faalt op deze machine** vóór de typecontrole met `TS5103`, omdat `tsconfig.base.json` TypeScript 6 eist en er 5.8 staat. Een groen resultaat is hier dus niet te halen; alleen CI meet dit echt. En zelfs groen bewijst alleen types, geen veilige logica. Aanvullend nodig: de CI-uitslag afwachten plus `security:check`. |
| P-EDGE | `npm run check:system-instructions` | Bewijst dat het gegenereerde instructiebestand gelijk loopt met `src/config/agents/` en `src/config/templateRegistry.ts`, en toetst de inhoud op afgesproken regels. Kan groen zijn terwijl de instructie zelf pedagogisch of juridisch onverstandig is — gelijkheid is geen goedkeuring. Aanvullend nodig: de gewijzigde instructietekst zelf lezen. |
| P-AUTH | handmatig: de flow doorlopen als leerling én als docent | Dekt twee rollen en één pad. Zegt niets over de adminrol, over MFA-omzeiling, over routebeveiliging, over Storage of over Realtime. Kan goed lijken terwijl een record van een andere school via de API wél bereikbaar is. Aanvullend nodig: de query rechtstreeks proberen met een account van een andere school, en elke rol die je raakt apart nalopen. |
| P-SECRETS | Gitleaks in CI, plus `git diff` vóór commit | Kan groen zijn terwijl een sleutel al eerder is gepusht, of buiten Git is gelekt — in een log, een screenshot of een prompt. Aanvullend nodig: controle bij de bron zelf (Supabase, Vercel, providerdashboard). |
| P-DEPLOY | `npm run audit:security` | Kan groen zijn terwijl een pakket kwaadaardig is zonder gemelde CVE, en blijft groen zolang een allowlist-uitzondering loopt. Aanvullend nodig: lees wat de uitzondering dekt en tot wanneer, en beoordeel het pakket zelf op herkomst en onderhoud. |
| P-DEPLOY | `npm run build:prod` plus de headers op het live domein opvragen | Kan groen zijn terwijl een nieuw script in `index.html` gegevens van leerlingen wegsluist: de build toetst geen gedrag van code van derden, en de headers zeggen niets over wat een toegelaten script doet. Aanvullend nodig: lees wat het script doet en waar het naartoe stuurt. |
| R-DATA | `npm run check:ai-usage` | Leest een vaste lijst bekende bestanden, niet je nieuwe code. Kan dus groen zijn terwijl een nieuwe function of een nieuwe logregel persoonsgegevens naar buiten brengt. Aanvullend nodig: de regels die je zelf hebt toegevoegd nalezen. |
| alle | `npm run doctor` | **Faalt op deze machine** met dezelfde `TS5103` als hierboven en bewijst op dit moment dus niets — ook de kritieke paden niet. Aanvullend nodig: de CI-uitslag, plus de bewijsrij van je eigen route. |

`npm run lint` staat niet in deze tabel: het is een lege echo en bewijst niets.

## ONDERHOUD

Dit bestand bevat geen securityregel die elders al voluit staat; het benoemt de regel en wijst
naar de bron. Uitzondering: wat je moet zien zónder een ander bestand te openen mag hier voluit
staan — de fatale invarianten onder `STOP` en de derde kolom in `BEWIJS`. Groeit die uitzondering,
dan hoort daar een reden bij.

Waar een uitvoerbaar script de waarheid is, wijst dit document naar het script. Maar een script
kan ook uitstaan, te weinig toetsen of versoepeld worden; daarom staat in `BEWIJS` per rij wat het
niet dekt, en is het versoepelen van zo'n script zelf een `STOP`-conditie.
