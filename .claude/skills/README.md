# DGSkills — Claude Agent Skills

Map met DGSkills-specifieke Claude Skills (Anthropic SKILL.md format). Elke skill is een gespecialiseerd playbook dat Claude automatisch oppakt op basis van de `description` in de YAML-frontmatter.

## Aanwezige skills

| Skill | Wanneer | Doel |
|---|---|---|
| `dgskills-mission-author` | Bij toevoegen/wijzigen van een leerling-missie | Zorgt voor complete SLO-koppeling, curriculum-plaatsing, template-registratie en didactische onderbouwing |
| `dgskills-compliance-check` | Vóór elke "done"-markering of PR | Draait acceptance-checklist + AI Act HIGH RISK Annex III 3(b) verplichtingen |
| `dgskills-supabase-edge` | Bij werk aan Supabase edge functions | Security-first playbook voor Deno edge functions (CORS, auth, AI, secrets, RLS) |

## Triggering

Claude activeert een skill op basis van de `description` in de YAML-frontmatter. Vaag = nooit getriggerd. Daarom zijn de descriptions hier expliciet en noemen ze trigger-phrases, bestandspaden en scenarios.

## Anti-patronen

- ❌ Installeer geen community-skills zonder eerst de SKILL.md regel voor regel te reviewen (Snyk ToxicSkills: 13,4% van community-skills heeft critical issues).
- ❌ Breid deze skills niet uit met speculatieve scenario's — houd ze scherp en DGSkills-specifiek.
- ❌ Skills zijn geen vervanging voor CLAUDE.md. Ze zijn een aanvulling.

## Onderhoud

- Bij grote wijzigingen in de stack (bv. Vertex → ander model, of nieuwe template-type): werk de relevante skill bij.
- Bij nieuwe compliance-eisen (AI Act-updates): werk `dgskills-compliance-check` bij.
- Bij nieuwe edge-function-patronen: werk `dgskills-supabase-edge` bij.

## Referenties (onderzoeksbasis)

- Anthropic Agent Skills specificatie: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Officiële Supabase agent-skills: https://github.com/supabase/agent-skills
- Privacy/AI Act skills library: https://github.com/mukul975/Privacy-Data-Protection-Skills
- GRC skills library: https://github.com/Sushegaad/Claude-Skills-Governance-Risk-and-Compliance
- Education skills library: https://github.com/GarethManning/claude-education-skills
- Skills security audit: https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/
