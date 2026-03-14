#!/usr/bin/env bash
# Lighthouse Performance Audit voor ai-lab---future-architect
# Routes: /, /login, /scholen

set -e
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

PORT=${PORT:-4173}
HOST=${HOST:-127.0.0.1}
BASE="http://$HOST:$PORT"

# Start preview server als die niet draait
if ! curl -s -o /dev/null -w "%{http_code}" "$BASE" 2>/dev/null | grep -q "200"; then
  echo "Starting preview server on $HOST:$PORT..."
  npm run build --silent 2>/dev/null || true
  npx vite preview --host "$HOST" --port "$PORT" &
  PREVIEW_PID=$!
  # Wait up to 15s for server to respond (CI can be slow)
  for i in $(seq 1 15); do
    if curl -s -o /dev/null -w "%{http_code}" "$BASE" 2>/dev/null | grep -q "200"; then
      break
    fi
    sleep 1
  done
  if ! curl -s -o /dev/null -w "%{http_code}" "$BASE" 2>/dev/null | grep -q "200"; then
    echo "Preview server kon niet starten op $HOST:$PORT. Stop Lighthouse-run."
    [ -n "$PREVIEW_PID" ] && kill "$PREVIEW_PID" 2>/dev/null || true
    exit 1
  fi
fi

# Warm up: pre-load static assets into OS file cache to prevent cold-start NO_FCP
echo "Warming up file cache..."
curl -s "$BASE" > /dev/null
curl -s "$BASE/login" > /dev/null
curl -s "$BASE/scholen" > /dev/null

echo "Running Lighthouse on $BASE..."
mkdir -p "$PROJECT_DIR/lighthouse-reports"

for ROUTE in "/" "/login" "/scholen"; do
  NAME=$(echo "$ROUTE" | sed 's/^\///' | sed 's/\/$//')
  [ -z "$NAME" ] && NAME="root"
  echo "  → $ROUTE"
  npx lighthouse "$BASE$ROUTE" \
    --only-categories=performance \
    --output=json \
    --output-path="$PROJECT_DIR/lighthouse-reports/$NAME.json" \
    --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage --window-size=1350,940" \
    --quiet || true
done

[ -n "$PREVIEW_PID" ] && kill $PREVIEW_PID 2>/dev/null || true
echo "Done. Reports in lighthouse-reports/"
