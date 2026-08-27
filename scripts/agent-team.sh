#!/usr/bin/env bash
# Start het DGSkills agent team: een tmux-sessie met een baas en vier werkers,
# elk in een eigen git worktree op een eigen tak.
#
# Gebruik:
#   scripts/agent-team.sh            start het team en hang eraan vast
#   scripts/agent-team.sh --dry-run  toon wat er zou gebeuren, verander niets
#
# Ontwerp: docs/superpowers/specs/2026-08-27-agent-teams-design.md

set -euo pipefail

DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_DIR="$REPO_ROOT/.claude/worktrees"
SESSION="agents"

# rol:model
ROLLEN=(
  "bouwer:sonnet"
  "nakijker:sonnet"
  "techniek:opus"
  "website:sonnet"
)

run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf 'ZOU DRAAIEN: %s\n' "$*"
  else
    "$@"
  fi
}

# Controleer dat alle rolbestanden bestaan voordat we iets aanmaken.
ONTBREEKT=0
for f in team-baas team-bouwer team-nakijker team-techniek team-website; do
  if [ ! -f "$REPO_ROOT/.claude/agents/$f.md" ]; then
    echo "ONTBREEKT: .claude/agents/$f.md" >&2
    ONTBREEKT=1
  fi
done
if [ ! -f "$REPO_ROOT/.claude/team/grenzen.md" ]; then
  echo "ONTBREEKT: .claude/team/grenzen.md" >&2
  ONTBREEKT=1
fi
if [ "$ONTBREEKT" -eq 1 ]; then
  echo "Start afgebroken: rolbestanden ontbreken." >&2
  exit 1
fi

# De werkers vertakken vanaf de huidige HEAD, want daar staan de rolbestanden.
# Loopt die basis achter op origin/main, dan moeten ze dat weten voordat ze
# beginnen te bouwen — anders bouwen ze op verouderde code.
BASIS="$(git rev-parse --short HEAD)"
BASIS_TAK="$(git rev-parse --abbrev-ref HEAD)"
echo "Werkers vertakken vanaf $BASIS_TAK ($BASIS)"

if git rev-parse --verify --quiet origin/main >/dev/null; then
  ACHTER=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
  if [ "$ACHTER" -gt 0 ]; then
    echo
    echo "LET OP: deze basis loopt $ACHTER commits achter op origin/main."
    echo "De werkers bouwen dus op verouderde code. Overweeg eerst"
    echo "  git merge origin/main"
    echo "voordat je het team aan het werk zet."
    echo
  fi
fi

# Maak worktrees aan. Bestaande worktrees worden hergebruikt, nooit verwijderd.
for entry in "${ROLLEN[@]}"; do
  rol="${entry%%:*}"
  wt="$WORKTREE_DIR/team-$rol"
  tak="team/$rol"

  if [ -d "$wt" ]; then
    echo "worktree bestaat al: $wt"
    continue
  fi

  run mkdir -p "$WORKTREE_DIR"
  if git show-ref --verify --quiet "refs/heads/$tak"; then
    run git worktree add "$wt" "$tak"
  else
    run git worktree add -b "$tak" "$wt"
  fi

  # node_modules is gitignored en dus leeg in een verse worktree. Koppel hem aan
  # die van de hoofdmap in plaats van per worktree opnieuw te installeren.
  if [ ! -e "$wt/node_modules" ] && [ -d "$REPO_ROOT/node_modules" ]; then
    run ln -s "$REPO_ROOT/node_modules" "$wt/node_modules"
  fi
done

if [ "$DRY_RUN" -eq 1 ]; then
  echo "ZOU DRAAIEN: tmux-sessie '$SESSION' met 5 panes"
  echo "  pane 0  BAAS      opus     $REPO_ROOT"
  for entry in "${ROLLEN[@]}"; do
    rol="${entry%%:*}"; model="${entry##*:}"
    naam=$(echo "$rol" | tr '[:lower:]' '[:upper:]')
    printf '  pane .  %-9s %-8s %s\n' "$naam" "$model" "$WORKTREE_DIR/team-$rol"
  done
  exit 0
fi

# Een bestaande sessie hergebruiken in plaats van doodmaken: er kan werk in
# staan dat nog niet is vastgelegd.
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "tmux-sessie '$SESSION' draait al. Koppel aan met: tmux attach -t $SESSION"
  exit 0
fi

# De startprompt bevat bewust geen aanhalingstekens, backticks of dollartekens.
# Hij wordt in enkele aanhalingstekens naar de pane gestuurd, zodat de shell in
# die pane er niets aan kan uitvoeren. Wijzig deze zin niet zonder dat te
# controleren.
start_regel() {
  # $1 = naam (BAAS/BOUWER/...), $2 = model, $3 = repo-relatief rolbestand
  printf "claude -n %s --model %s 'Lees %s. Dat is jouw rol voor deze sessie. Voer de eerste handeling uit die daar staat.'" \
    "$1" "$2" "$3"
}

tmux new-session -d -s "$SESSION" -c "$REPO_ROOT" -n team
tmux select-pane -t "$SESSION:team.0" -T "BAAS"
tmux send-keys -t "$SESSION:team.0" \
  "$(start_regel BAAS opus .claude/agents/team-baas.md)" C-m

for entry in "${ROLLEN[@]}"; do
  rol="${entry%%:*}"
  model="${entry##*:}"
  naam=$(echo "$rol" | tr '[:lower:]' '[:upper:]')
  wt="$WORKTREE_DIR/team-$rol"

  tmux split-window -t "$SESSION:team" -c "$wt"
  tmux select-layout -t "$SESSION:team" tiled
  pane=$(tmux list-panes -t "$SESSION:team" -F '#{pane_index}' | tail -1)
  tmux select-pane -t "$SESSION:team.$pane" -T "$naam"
  tmux send-keys -t "$SESSION:team.$pane" \
    "$(start_regel "$naam" "$model" ".claude/agents/team-$rol.md")" C-m
done

tmux select-layout -t "$SESSION:team" tiled
tmux select-pane -t "$SESSION:team.0"
tmux attach-session -t "$SESSION"
