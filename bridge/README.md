# GitHub Agent Bridge

Deze prototype-opzet gebruikt de repository zelf als gedeelde inbox en outbox voor ChatGPT en Claude.

## Structuur

```text
bridge/
  inbox/
    chatgpt/
    claude/
  outbox/
    chatgpt/
    claude/
  processed/
    chatgpt/
    claude/
  examples/
```

- `inbox/<agent>/`: nieuwe berichten die door een agent verwerkt moeten worden
- `outbox/<agent>/`: antwoorden van die agent
- `processed/<agent>/`: originele inbox-berichten nadat ze verwerkt zijn
- `examples/`: voorbeeldberichten die je kunt gebruiken als startpunt

## Berichtformaat

Een inbox-bericht is een JSON-bestand zoals:

```json
{
  "id": "thread-001-human-to-chatgpt",
  "threadId": "thread-001",
  "from": "human",
  "to": "chatgpt",
  "subject": "Ontwerp een repo-protocol",
  "body": "Stel een veilig protocol voor waarmee ChatGPT en Claude via GitHub kunnen samenwerken.",
  "context": [
    "Gebruik de repo als gedeelde waarheid.",
    "Houd het antwoord praktisch en kort."
  ],
  "handoff": {
    "to": "claude",
    "instruction": "Beoordeel het voorstel kritisch en verbeter zwakke punten."
  }
}
```

Verplichte velden:

- `id`
- `from`
- `to`
- `body`

Optionele velden:

- `threadId`
- `subject`
- `context`
- `handoff`

## Hoe de flow werkt

1. Plaats een JSON-bericht in `bridge/inbox/chatgpt/` of `bridge/inbox/claude/`.
2. De bridge leest het bestand, roept de juiste API aan en schrijft een reply naar `bridge/outbox/<agent>/`.
3. Het originele bericht verhuist naar `bridge/processed/<agent>/`.
4. Als `handoff.to` is opgegeven, maakt de bridge automatisch een nieuw inbox-bericht aan voor de andere agent.

De workflow gebruikt bewust één pipeline-run voor beide agents. Dat voorkomt problemen met GitHub Actions die niet automatisch opnieuw triggeren op pushes die met `GITHUB_TOKEN` zijn gemaakt.

## Lokale test

Gebruik eerst een dry run:

```bash
cp bridge/examples/human-to-chatgpt.json bridge/inbox/chatgpt/2026-03-28-demo.json
npm run bridge:dry
```

Daarna kun je echte API-calls doen:

```bash
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
npm run bridge:pipeline
```

Optionele model-variabelen:

```bash
export OPENAI_MODEL="gpt-4o-mini"
export ANTHROPIC_MODEL="claude-3-5-sonnet-latest"
```

## GitHub Actions instellen

Voeg deze repository secrets toe:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

Optioneel kun je repository variables toevoegen:

- `OPENAI_MODEL`
- `ANTHROPIC_MODEL`
- `AGENT_BRIDGE_ALLOWED_ASSOCIATIONS`
- `AGENT_BRIDGE_MAX_COMMENT_PAGES`

De workflow staat in [`.github/workflows/github-agent-bridge.yml`](/home/yorin-vonder/digitale-geletterdheid/.github/workflows/github-agent-bridge.yml).

## Issues, PR-comments en inline review comments

Je kunt dezelfde bridge ook via issue comments, PR-conversation comments en inline review comments laten lopen. Daarvoor is er een tweede workflow en script:

- [`.github/workflows/github-agent-comments.yml`](/home/yorin-vonder/digitale-geletterdheid/.github/workflows/github-agent-comments.yml)
- [`scripts/github-agent-comments.mjs`](/home/yorin-vonder/digitale-geletterdheid/scripts/github-agent-comments.mjs)

Gebruik in een issue body of comment bijvoorbeeld:

```md
/chatgpt
/handoff claude

Kunnen jullie dit plan reviewen voor een repo-bridge tussen twee agents?
Noem vooral de risico's rond contextverlies, race conditions en secrets.
```

Protocol:

- `/chatgpt` of `/claude` kiest de eerste agent
- `/handoff claude` of `/handoff chatgpt` laat de tweede agent in dezelfde workflow-run reageren
- de workflow plaatst antwoorden als normale issue comments terug in dezelfde thread
- dezelfde flow werkt ook op PR-conversation comments, omdat die onder `issue_comment` vallen
- inline codecomments in `Files changed` lopen via het `pull_request_review_comment` event en worden als echte thread-replies teruggeplaatst
- GitHub ondersteunt geen replies op replies via de review-comment API; de bridge antwoordt daarom altijd op de top-level review comment van de thread
- verborgen `agent-bridge` markers met een dedupe-key voorkomen dubbele replies bij herhaalde webhook-runs of ongewijzigde edits
- standaard mogen alleen `OWNER`, `MEMBER` en `COLLABORATOR` slash-commands uitvoeren; dat is optioneel aanpasbaar via `AGENT_BRIDGE_ALLOWED_ASSOCIATIONS`
- dedupe zoekt paginagewijs door GitHub comments heen; `AGENT_BRIDGE_MAX_COMMENT_PAGES` begrenst hoeveel pagina's per run worden opgehaald

Voor lokale tests zonder GitHub API-calls kun je deze voorbeeldpayload gebruiken:

```bash
npm run bridge:comments:dry -- --event-path bridge/examples/github-issue-comment-event.json
npm run bridge:comments:dry -- --event-path bridge/examples/github-review-comment-event.json
```
