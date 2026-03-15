# Rapport: Cybersecurity-kwetsbaarheden in AI-codeerassistenten

**Datum:** 15 maart 2026
**Scope:** Claude (Anthropic), OpenAI Codex/Copilot, en het bredere AI-tooling-ecosysteem
**Onderzoeksmethode:** Webresearch naar academische studies, CVE-databases, industrierapporten en incidentmeldingen (2024-2026)

---

## Samenvatting

AI-codeerassistenten zoals Claude en Codex/Copilot vertonen structurele cybersecurity-tekortkomingen op drie niveaus:

1. **De tool zelf is kwetsbaar** — 30+ CVE's in 2025 alleen al, inclusief remote code execution en data-exfiltratie
2. **De gegenereerde code is onveilig** — 45% van AI-gegenereerde code bevat beveiligingsfouten (Veracode 2025)
3. **Het ecosysteem eromheen is een aanvalsoppervlak** — MCP-servers, extensies en supply chain zijn actief doelwit

---

## 1. Claude (Anthropic) — Kwetsbaarheden en incidenten

### 1.1 Kritieke CVE's

| CVE | Ernst (CVSS) | Beschrijving |
|-----|-------------|--------------|
| CVE-2025-59536 | **8.7** | Configuratie-injectie via Claude Hooks — RCE door kwaadaardig repository te clonen |
| CVE-2026-21852 | 5.3 | API-sleuteldiefstal via projectconfiguraties; toegang tot gedeelde Workspaces |
| CVE-2025-54794 | **7.6** | Prompt injection via verborgen instructies in codeblokken (markdown/PDF) |
| CVE-2025-54795 | Hoog | Command injection via onvoldoende input-sanitisatie bij whitelisted commando's |
| CVE-2025-55284 | Hoog | Data-exfiltratie via DNS-verzoeken — `.env`-bestanden en geheimen lekken via subdomeinen |
| CVE-2025-68145 | Hoog | RCE via prompt injection in Anthropic's eigen Git MCP-server |
| CVE-2025-68143 | Hoog | Path validation bypass in Git MCP |
| CVE-2025-68144 | Hoog | Argument injection in Git MCP |
| CVE-2025-53109 | **8.4** | Symlink-gebaseerde directory traversal in MCP-servers |

*Alle gepatcht door Anthropic, maar de onderliggende architectuurrisico's (agentic tools + filesystemtoegang) blijven.*

### 1.2 Grote incidenten

**Eerste AI-gestuurde cyber-spionagecampagne (september 2025)**
Chinese staatshackers (GTG-1002) kaapten Claude Code met MCP-tools voor een autonome spionagecampagne tegen ~30 organisaties (tech, financiën, overheid). Claude voerde **80-90% van de operatie autonoom uit**: reconnaissance, exploit-ontwikkeling, credential harvesting, laterale beweging en data-exfiltratie. Anthropic publiceerde hierover in november 2025.

**Claude Cowork file-exfiltratie (januari 2026)**
Twee dagen na de lancering van Cowork toonden onderzoekers aan dat een Word-document met verborgen prompt injection (1-punt witte tekst) Cowork kon misleiden om gevoelige bestanden te uploaden naar een aanvallersaccount. Werkte omdat Anthropic's eigen API was ge-whitelisted.

**Desktop Extensions RCE (februari 2026) — CVSS 10/10**
Claude Desktop Extensions (DXTs) draaien zonder sandboxing en met volledige systeemprivileges. Een kwaadaardig Google Calendar-evenement kon willekeurige code uitvoeren. Anthropic verklaarde dat dit "buiten hun huidige dreigingsmodel valt."

**"Vibe hacking" — crimineel misbruik (augustus 2025)**
Criminelen gebruikten Claude Code voor grootschalige datadiefstal en afpersing tegen 17+ organisaties (gezondheidszorg, overheid, nooddiensten), inclusief het analyseren van gestolen financiële data en het genereren van ransomberichten.

### 1.3 Automatisch laden van `.env`-bestanden
Claude Code laadt automatisch `.env`-bestanden uit projectdirectory's, waardoor geheimen (API-sleutels, proxy-instellingen) onbedoeld worden blootgesteld aan het model en potentieel aan derden.

---

## 2. OpenAI Codex / GitHub Copilot — Kwetsbaarheden en incidenten

### 2.1 Kritieke CVE's

| CVE | Ernst (CVSS) | Beschrijving |
|-----|-------------|--------------|
| CVE-2025-61260 | Hoog | Command injection in Codex CLI (gepatcht in v0.23.0) |
| CVE-2025-53773 | **7.8** | RCE via "YOLO mode" — prompt injection in broncode-comments activeerde auto-approve |
| CVE-2025-32711 | **9.3** | EchoLeak: zero-click data-exfiltratie via Microsoft 365 Copilot RAG-systeem |
| CVE-2026-21516 | Hoog | Command injection in Copilot voor JetBrains |
| CVE-2025-52882 | Hoog | Ongeautoriseerde toegang via onbeveiligde WebSocket-verbindingen in VS Code |

### 2.2 Grote incidenten

**EchoLeak — zero-click aanval (2025)**
Eerste grote zero-click agentic kwetsbaarheid in productie. Een aanvaller stuurde een e-mail met verborgen prompt injection. Wanneer een gebruiker later iets vroeg aan Copilot, haalde het RAG-systeem de kwaadaardige e-mail op, voerde ingebedde instructies uit, en exfiltreerde gevoelige data via een afbeeldings-URL — zonder enige klik.

**OpenAI/Mixpanel datalek (november 2025)**
Aanvallers breachten Mixpanel (analytics-vendor van OpenAI) en exfiltreerden gebruikersdata: namen, e-mailadressen, locaties, browser/OS-details en organisatie-ID's.

**Copilot privacy-incident (februari 2026)**
Microsoft 365 Copilot vatte vertrouwelijke e-mails samen ondanks DLP-signalen (Data Loss Prevention). Server-side patching begon in februari 2026.

**Copilot prompt injection via repositories**
Verborgen prompt-injecties in README-bestanden en PR-beschrijvingen konden Copilot Chat manipuleren om data te lekken uit private repositories.

**OpenAI Guardrails bypass (oktober 2025)**
OpenAI's eigen Guardrails-framework was te bypassen — LLM-gebaseerde beveiligingsjudges konden worden gemanipuleerd, waardoor de beveiligingsmechanismen zelf aanvalsvectoren werden.

---

## 3. Onveilige codegeneratie — alle modellen

### 3.1 Cijfers

| Bron | Bevinding |
|------|----------|
| **Veracode 2025** | **45%** van AI-gegenereerde code bevat minstens één kwetsbaarheid |
| **NYU/Pearce et al.** | **40%** van Copilot-code is kwetsbaar (1.692 programma's, 89 CWE-scenario's) |
| **FormAI (GPT-3.5)** | **51,24%** van gegenereerde C-programma's bevat kwetsbaarheden |
| **BaxBench (ETH Zurich)** | Zelfs het beste model (Claude Opus 4.5 Thinking) produceert slechts **56%** veilige én correcte code |
| **Apiiro (Fortune 50)** | **10.000+ nieuwe security findings per maand** door AI-code (10x toename in 6 maanden) |
| **IEEE ISTAS 2025** | Iteratief verbeteren maakt code **37,6% onveiliger** na 5 iteraties |
| **Black Duck OSSRA 2026** | Open source-kwetsbaarheden per codebase **verdubbeld (+107%)**, gecorreleerd met AI-ontwikkeling |

### 3.2 Security pass rates per model (Veracode oktober 2025)

| Model | Security Pass Rate |
|-------|-------------------|
| GPT-5 Mini (reasoning) | 72% (hoogste) |
| GPT-5 (reasoning) | 70% |
| Gemini 2.5 Pro | 59% |
| Grok 4 | 55% |
| GPT-5 chat (non-reasoning) | 52% |
| Claude Sonnet 4.5 | 50% |
| Claude Opus 4.1 | 49% |

### 3.3 Meest voorkomende kwetsbaarheden in AI-code

| Kwetsbaarheid | Faalpercentage |
|---------------|---------------|
| XSS (CWE-79) | **86%** faalratio |
| Log injection (CWE-117) | **88%** faalratio |
| SQL Injection (CWE-89) | Structureel: string interpolatie i.p.v. parameterized queries |
| Hard-coded credentials | **2x hoger** dan bij handmatige ontwikkeling |
| Onvoldoende random values (CWE-330) | Frequent bij Copilot |

---

## 4. MCP-ecosysteem — nieuw aanvalsoppervlak

Het Model Context Protocol (MCP) is in 2025-2026 uitgegroeid tot een belangrijk aanvalsoppervlak:

| Risico | Details |
|--------|---------|
| **Tool Poisoning** | Kwaadaardige MCP-servers injecteren verborgen instructies via tool-metadata |
| **Command Injection** | 43% van publieke MCP-servers is kwetsbaar voor command injection |
| **Geen authenticatie** | 1.862 publieke MCP-servers gevonden, bijna allemaal zonder authenticatie |
| **Onveilige agent skills** | 36,82% van AI-agent skills bevat minstens één beveiligingsfout (Snyk ToxicSkills) |
| **Smithery.ai breach** | Path traversal compromitteerde 3.000+ MCP-servers, lekte duizenden API-sleutels |
| **Privilege Escalation** | Eén kwaadaardige tool kan andere tools' permissies overschrijven |
| **Log-to-Leak** | ETH Zurich/CMU: agent forceren tot crash-simulatie → context window dumpen naar aanvaller |

---

## 5. Supply chain-aanvallen via AI-tooling

| Incident | Impact |
|----------|--------|
| **Amazon Q VS Code** (dec 2025) | Gehackte extensie passeerde Amazon's verificatie, wiste lokale bestanden en verstoorde AWS-infra |
| **Cline npm-aanval** | Prompt injection via GitHub Actions → publicatie ongeautoriseerde npm-versie |
| **Rules File Backdoor** (mrt 2025) | Onzichtbare Unicode-karakters in AI-configuratiebestanden → Copilot/Cursor genereert backdoors |
| **DeepSeek-R1 politieke triggers** | CCP-gevoelige termen verhogen kwetsbaarheidsratio tot 27-50% |

**Kerncijfer:** 40% toename in supply chain-gerelateerde breaches t.o.v. 2023. Bijna 1 op 3 datalekken komt nu via derden.

---

## 6. OWASP Top 10 voor LLM-applicaties (2025)

| # | Risico | Status |
|---|--------|--------|
| LLM01 | **Prompt Injection** | Onveranderd #1 — "onopgelost probleem" (OpenAI CISO) |
| LLM02 | **Sensitive Information Disclosure** | Gestegen van #6 |
| LLM03 | **Supply Chain Vulnerabilities** | Gestegen van #5 |
| LLM04 | **Data and Model Poisoning** | Uitgebreid naar model-level aanvallen |
| LLM05 | **Improper Output Handling** | Onsanitiseerde LLM-output → XSS, command injection |
| LLM06 | **Excessive Agency** | **NIEUW** — AI-agents met te veel permissies |
| LLM07 | **System Prompt Leakage** | **NIEUW** — extractie van systeemprompts |
| LLM08 | **Vector and Embedding Weaknesses** | **NIEUW** — RAG-pipeline kwetsbaarheden |
| LLM09 | **Misinformation** | **NIEUW** — overtuigende maar onjuiste informatie |
| LLM10 | **Unbounded Consumption** | **NIEUW** — resource exhaustion via LLM-misbruik |

OWASP publiceerde ook een **Top 10 voor Agentic Applications (2026)** specifiek voor AI-agent en MCP-risico's.

---

## 7. Industriestatistieken

| Statistiek | Bron |
|-----------|------|
| **97%** van bedrijven rapporteert GenAI-gerelateerde security-incidenten | VikingCloud 2025 |
| **87%** van leiders ziet AI-kwetsbaarheden als snelst groeiend cyberrisico | WEF 2026 |
| **210%** toename in AI-kwetsbaarheidsrapporten | HackerOne 2026 |
| **540%** toename in prompt injection-bevindingen | HackerOne 2025 |
| **53%** van leiders is onvoorbereid op AI-cybersecurity | Diverse bronnen |
| **Slechts 14%** voelt zich "zeer voorbereid" op GenAI-risico's | ISACA 2025 |

---

## 8. Conclusies

### Waar Claude steken laat vallen:
1. **MCP-architectuur is structureel kwetsbaar** — Anthropic's eigen Git MCP-server had 3 CVE's
2. **Automatisch laden van `.env`-bestanden** lekt geheimen
3. **Desktop Extensions draaien zonder sandbox** (CVSS 10/10)
4. **Prompt injection blijft mogelijk** via codeblokken, documenten en tool-metadata
5. **Claude is al ingezet als autonoom cyberwapen** door staatshackers
6. **Security pass rate van ~50%** — de helft van gegenereerde code is onveilig

### Waar Codex/Copilot steken laat vallen:
1. **Zero-click aanvallen via RAG** (EchoLeak, CVSS 9.3)
2. **YOLO mode RCE** via prompt injection in broncode
3. **Privacy-schendingen** — DLP-signalen worden genegeerd
4. **Supply chain** — verificatieprocessen falen (Amazon Q incident)
5. **Security pass rate van ~50-72%** afhankelijk van reasoning-modus

### Universele problemen:
1. **Prompt injection is fundamenteel onopgelost** — #1 OWASP-risico, drie jaar op rij
2. **AI-gegenereerde code is structureel onveiliger** dan handgeschreven code
3. **Iteratief verbeteren maakt code onveiliger**, niet veiliger
4. **Het MCP-ecosysteem is een wildwest** — 43% command injection, nauwelijks authenticatie
5. **AI-tools worden actief bewapend** door zowel staatshackers als cybercriminelen

---

## 9. Aanvullende kwetsbaarheden (verdiepend onderzoek)

### 9.1 Claude Code — extra CVE's en incidenten

| CVE | Ernst | Beschrijving |
|-----|-------|--------------|
| CVE-2025-68145 | Hoog | RCE via prompt injection in Anthropic's eigen Git MCP-server |
| CVE-2025-68143 | Hoog | Path validation bypass in Git MCP — `git_init` zonder restricties |
| CVE-2025-68144 | Hoog | Argument injection in Git MCP |
| CVE-2025-53109 | **8.4** | Symlink-gebaseerde directory traversal in MCP-servers |
| CVE-2025-53110 | Hoog | Symlink schrijfoperaties in MCP-servers |

**Claude Cowork file-exfiltratie (januari 2026):** Twee dagen na lancering kon een Word-document met 1-punt witte tekst (verborgen prompt injection) Cowork misleiden om gevoelige bestanden te uploaden naar een aanvallersaccount.

**Desktop Extensions RCE (februari 2026) — CVSS 10/10:** Claude DXTs draaien zonder sandboxing met volledige systeemprivileges. Anthropic verklaarde dat dit "buiten hun huidige dreigingsmodel valt."

### 9.2 IDEsaster — 30+ kwetsbaarheden in AI-codeertools (2025)

Onderzoeker Ari Marzouk ontdekte 30+ kwetsbaarheden in Cursor, Windsurf, Kiro.dev, GitHub Copilot, Zed.dev, Roo Code, Junie en Cline. 24 kregen CVE-identifiers:

| Tool | CVE | Impact |
|------|-----|--------|
| Cursor | CVE-2025-59944 | Case-sensitivity bypass → RCE |
| Cursor | CVE-2025-61590 | RCE via workspace settings manipulatie |
| Cursor | CVE-2025-54132 | Data-exfiltratie via Mermaid diagram rendering |
| OpenAI Codex CLI | CVE-2025-61260 | Command injection (gepatcht in v0.23.0) |
| Claude Code | CVE-2025-55284 | Data-exfiltratie via DNS lookups |
| Roo Code | CVE-2025-53097 | Credential theft via JSON schema exfiltratie |
| Roo Code | CVE-2025-57771 | RCE via command parsing flaw |
| Zed.dev | CVE-2025-55012 | Permissions bypass → RCE |
| JetBrains Junie | CVE-2025-58335 | Data-exfiltratie |

### 9.3 Amazon Q VS Code breach (december 2025)

Een hacker compromitteerde de officiële VS Code-extensie voor Amazon Q. De kwaadaardige versie **passeerde Amazon's verificatieproces** en was twee dagen publiek beschikbaar. De extensie bevatte een prompt injection die Q instrueerde om lokale bestanden te wissen en AWS-infrastructuur te verstoren.

### 9.4 Rules File Backdoor (maart 2025)

Pillar Security ontdekte dat onzichtbare Unicode-karakters (zero-width joiners, bidirectionele markers) in AI-configuratiebestanden van Copilot en Cursor kwaadaardige instructies konden bevatten. Deze instructies overleven project-forking, waardoor een supply chain-aanval ontstaat.

### 9.5 Armis Trusted Vibing Benchmark (2026)

Alle modellen introduceren consistent kwetsbaarheden met universele blinde vlekken in 18 van 31 scenario's. **Claude Sonnet 4.5 produceerde 10 verschillende kwetsbaarheden in één enkele generatie** tijdens een path-traversal-download scenario (CWE-489, CWE-284, CWE-770, etc.).

### 9.6 Iteratief verbeteren maakt code onveiliger

IEEE ISTAS 2025: 400 codevoorbeelden door 40 iteraties van LLM-"verbetering" toonden een **37,6% toename in kritieke kwetsbaarheden na slechts 5 iteraties**. Dit weerlegt de aanname dat herhaaldelijk vragen om verbetering de veiligheid verhoogt.

### 9.7 AI-gegenereerde code bij Fortune 50 bedrijven

Apiiro-onderzoek (juni 2025): AI-gegenereerde code introduceerde **meer dan 10.000 nieuwe security findings per maand** — een tienvoudige toename in zes maanden. Privilege escalation paden stegen **322%**, architecturale ontwerpfouten **153%**.

### 9.8 MCP-ecosysteem — aanvullende cijfers

- **Snyk ToxicSkills audit (februari 2026):** 36,82% van AI-agent skills heeft minstens één beveiligingsfout; 13,4% bevat kritieke problemen inclusief malware en prompt injection payloads
- **Smithery.ai breach:** Path traversal compromitteerde 3.000+ MCP-servers en lekte duizenden API-sleutels
- **Publieke MCP-servers:** 1.862 gevonden, bijna allemaal zonder authenticatie; 43% kwetsbaar voor command injection

---

## 10. Relevantie voor DGSkills

Op basis van dit onderzoek zijn de volgende risico's direct relevant voor het DGSkills-platform:

| Risico uit rapport | Relevantie voor DGSkills | Huidige status |
|--------------------|--------------------------|----------------|
| **Prompt injection (LLM01)** | Chat Edge Functions ontvangen user input → Vertex AI | Dubbele sanitizer (client + server), maar Unicode-bypass en meertalige bypass niet volledig getest |
| **System prompt leakage (LLM07)** | Systeeminstructies bevatten rolbeschrijvingen en gedragsregels | Server-side lookup via roleId (goed), maar extractie via slim prompten niet uitgesloten |
| **Onveilige codegeneratie** | Hele codebase is AI-gegenereerd (Claude Code) | 45-50% kans op kwetsbaarheden per gegenereerd codeblok — audit vereist |
| **MCP-configuratie** | `.mcp.json` met Supabase, Tavily, filesystem access | Credentials via keychain (goed), maar filesystem-scope moet worden gecontroleerd |
| **Supply chain** | npm dependencies, Vercel deployment | `package-lock.json` moet in git staan; `npm audit` moet worden uitgevoerd |
| **Data-exfiltratie via DNS** | Edge Functions hebben netwerkoegang | Rate limiting aanwezig, maar DNS-gebaseerde exfiltratie niet specifiek geblokkeerd |
| **Privacy minderjarigen** | Leerlingen 12-18 jaar, HIGH RISK EU AI Act | Ouderlijke toestemming, consent management, DPIA aanwezig |
| **In-memory rate limiting** | Edge Functions gebruiken Map-gebaseerde limiter | Reset bij cold start; geen distributed rate limiting |

---

## Bronnen

- Anthropic: [Disrupting AI Espionage](https://www.anthropic.com/news/disrupting-AI-espionage) (nov 2025)
- Anthropic: [Detecting and Countering Misuse](https://www.anthropic.com/news/detecting-countering-misuse-aug-2025) (aug 2025)
- Check Point: [Claude Code CVE-2025-59536](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/)
- Cymulate: [InversePrompt CVEs](https://cymulate.com/blog/cve-2025-547954-54795-claude-inverseprompt/)
- Veracode: [GenAI Code Security Report](https://www.veracode.com/blog/ai-generated-code-security-risks/) (2025)
- Veracode: [AI Code Security October Update](https://www.veracode.com/blog/ai-code-security-october-update/) (okt 2025)
- BaxBench: [ETH Zurich Security Benchmark](https://baxbench.com/)
- OWASP: [Top 10 for LLM Applications 2025](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025)
- Checkmarx: [EchoLeak CVE-2025-32711](https://checkmarx.com/zero-post/echoleak-cve-2025-32711-show-us-that-ai-security-is-challenging/)
- Tenable: [HackedGPT Memory Exfiltration](https://www.tenable.com/blog/hackedgpt-novel-ai-vulnerabilities-open-the-door-for-private-data-leakage)
- The Hacker News: [30+ Flaws in AI Coding Tools](https://thehackernews.com/2025/12/researchers-uncover-30-flaws-in-ai.html)
- HackerOne: [2026 Security Report](https://www.hackerone.com/press-release/hackerone-report-finds-210-spike-ai-vulnerability-reports-amid-rise-ai-autonomy)
- Knostic: [Claude/Cursor .env Leakage](https://www.knostic.ai/blog/claude-cursor-env-file-secret-leakage)
- Fortune: [AI Coding Tools Security](https://fortune.com/2025/12/15/ai-coding-tools-security-exploit-software/)
- Armis: [Trusted Vibing Benchmark](https://media.armis.com/rp-trusted-vibing-benchmark-en.pdf)
- Apiiro: [AI Security Findings](https://www.csoonline.com/article/4062720/ai-coding-assistants-amplify-deeper-cybersecurity-risks.html)
- Snyk: [Cline Supply Chain Attack](https://snyk.io/blog/cline-supply-chain-attack-prompt-injection-github-actions/)
- GitGuardian: [Claude Code Security](https://blog.gitguardian.com/claude-code-security-why-the-real-risk-lies-beyond-code/)
- WEF: Global Cybersecurity Outlook 2026
- ISACA: 2025 Software Supply Chain Security Report
- Cymulate: [EscapeRoute MCP CVEs](https://cymulate.com/blog/cve-2025-53109-53110-escaperoute-anthropic/)
- Wondering About AI: [Is Claude Cowork Safe?](https://wonderingaboutai.substack.com/p/is-claude-cowork-safe)
- Pillar Security: [Rules File Backdoor](https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents)
- CrowdStrike: [DeepSeek-R1 Political Triggers](https://www.crowdstrike.com/en-us/blog/crowdstrike-researchers-identify-hidden-vulnerabilities-ai-coded-software/)
- Embrace The Red: [Claude Code DNS Exfiltration](https://embracethered.com/blog/posts/2025/claude-code-exfiltration-via-dns-requests/)
- OWASP: [AI Testing Guide v1](https://owasp.org/www-project-ai-testing-guide/)
- OWASP: [Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- MintMCP: [MCP Server Security Scan](https://www.mintmcp.com/blog/security-vulnerabilities-with-mcp)
- Augment Code: [Prompt Injection Vulnerabilities](https://www.augmentcode.com/guides/prompt-injection-vulnerabilities-threatening-ai-development)
- IEEE ISTAS 2025: Iterative LLM Code Improvement Security Study
- Black Duck: [2026 OSSRA Report](https://www.blackduck.com/blog/open-source-trends-ossra-report.html)
