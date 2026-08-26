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
(Groen / Geel / Rood). Er is geen tweede schaal. Rood werk volgt altijd een route hieronder.

Past je wijziging in meerdere routes, loop ze alle af — ze overlappen niet.

## P-DB — database en migraties

**Wanneer:** `supabase/migrations/`, of er komt een tabel, kolom, policy of `pg_cron`-taak bij.

**Volgorde:**
1. Nieuwe migratie met tijdstempelnaam; herschrijf nooit een bestaande.
2. `CREATE TABLE` → `GRANT` → `ENABLE ROW LEVEL SECURITY` → `CREATE POLICY` per rol én per operatie.
3. Bestaande policy aanpassen met `ALTER POLICY`, nooit drop-en-hermaken.
4. Gevoelige logica in `SECURITY DEFINER` met `SET search_path = public`, daarna `REVOKE ALL`
   plus gerichte `GRANT EXECUTE`. Fail-closed: onbekend betekent geweigerd.
5. Benoem het gevolg voor rapportage, rechten en wat er zichtbaar wordt.

**Invarianten:** `supabase/CLAUDE.md` § Security rules.
**Bewijs:** zie `BEWIJS`, rij P-DB. Let op: de RLS-controle is deels handmatig.
**Stop als:** een bestaande policy zou verdwijnen of verzwakken.

## P-EDGE — edge functions en AI-keten

**Wanneer:** `supabase/functions/`, `supabase/config.toml`, of AI-instructies in `src/config/agents/`.

**Volgorde:**
1. Valideer de `Authorization`-header. Geen anonieme toegang tenzij uitdrukkelijk ontworpen.
2. Moet de function tóch publiek zijn, dan hoort daar drie keer een vastlegging bij:
   `verify_jwt = false` in `supabase/config.toml`, een regel in `publicEndpointRules` van
   `scripts/check-website-security-posture.mjs`, en een eigen bescherming (CORS, rate limit,
   moderatie). Ontbreekt er één, dan is de function niet publiek maar lek.
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
4. Een Realtime-kanaal of Storage-bucket erft géén RLS vanzelf — beperk het expliciet.

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
3. Nieuw script in `index.html` of een Vite-plugin draait mee in de pagina van de leerling en
   kan alles lezen wat daar staat. Behandel dat als een nieuwe externe dienst → ook `P-SECRETS`.

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
| P-EDGE | `npm run security:check` | Kan groen zijn terwijl een function wél een `Authorization`-string bevat maar de uitkomst niet afdwingt: het script leest de bron op markers, niet op gedrag. Aanvullend nodig: de function daadwerkelijk zonder token aanroepen. |
| P-EDGE | `npm run typecheck:edge` | Kan groen zijn terwijl de logica onveilig is: dit toetst alleen types. Aanvullend nodig: `security:check` plus een echte aanroep. |
| P-AUTH | handmatig: de flow doorlopen als leerling én als docent | Kan goed lijken terwijl een ander schoolrecord via de API wél bereikbaar is. Aanvullend nodig: de query rechtstreeks proberen met een account van een andere school. |
| P-SECRETS | Gitleaks in CI, plus `git diff` vóór commit | Kan groen zijn terwijl een sleutel al eerder is gepusht of buiten Git is gelekt. Aanvullend nodig: controle bij de bron (Supabase, Vercel, providerdashboard). |
| P-DEPLOY | `npm run audit:security` | Kan groen zijn terwijl een pakket kwaadaardig is zonder gemelde CVE, of terwijl een allowlist-uitzondering nog loopt. Aanvullend nodig: lees wat de uitzondering dekt en tot wanneer. |
| P-DEPLOY | `npm run build:prod` | Kan groen zijn terwijl de headers in productie anders zijn: de build toetst `vercel.json` niet. Aanvullend nodig: na de deploy de headers op het live domein opvragen. |
| R-DATA | `npm run check:ai-usage` | Kan groen zijn terwijl een logregel persoonsgegevens bevat: dit toetst providergebruik, niet loginhoud. Aanvullend nodig: de toegevoegde logregels zelf nalezen. |
| alle | `npm run doctor` | Kan groen zijn terwijl er een securitygat is: dit is een typecontrole op kritieke paden. Aanvullend nodig: de rij van je eigen route. |

`npm run lint` staat niet in deze tabel: het is een lege echo en bewijst niets.

## ONDERHOUD

Dit bestand bevat geen securityregel die elders al voluit staat; het benoemt de regel en wijst
naar de bron. Twee uitzonderingen, bewust: de fatale invarianten onder `STOP` en de derde kolom
in `BEWIJS` — die moeten ter plaatse leesbaar zijn.

Waar een uitvoerbaar script de waarheid is, wijst dit document naar het script. Maar een script
kan ook uitstaan, te weinig toetsen of versoepeld worden; daarom staat in `BEWIJS` per rij wat het
niet dekt, en is het versoepelen van zo'n script zelf een `STOP`-conditie.
