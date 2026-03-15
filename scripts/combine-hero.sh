#!/bin/bash
# Combine real screenshots slideshow + Pip green screen overlay
# Usage: bash scripts/combine-hero.sh

FFMPEG="/tmp/ffmpeg-arm/ffmpeg"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCREENSHOTS="$ROOT/public/screenshots"
VIDEOS="$ROOT/public/videos"
OUTPUT="$VIDEOS/hero-hybrid.mp4"

echo "🎬 Creating hybrid hero video..."
echo "   Screenshots + Pip green screen overlay"
echo ""

# Create slideshow from 4 screenshots (2 seconds each = 8 seconds total)
# Scale all to 1280x720 with padding to maintain aspect ratio
# Then overlay Pip green screen with chromakey

$FFMPEG -y \
  -loop 1 -t 2 -i "$SCREENSHOTS/student-mission-overview.png" \
  -loop 1 -t 2 -i "$SCREENSHOTS/avatar-customization.png" \
  -loop 1 -t 2 -i "$SCREENSHOTS/student-progress-xp.png" \
  -loop 1 -t 2 -i "$SCREENSHOTS/student-dashboard.png" \
  -i "$VIDEOS/pip-greenscreen.mp4" \
  -filter_complex "
    [0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#FAF9F0,setsar=1[s0];
    [1:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#FAF9F0,setsar=1[s1];
    [2:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#FAF9F0,setsar=1[s2];
    [3:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#FAF9F0,setsar=1[s3];
    [s0][s1]xfade=transition=fade:duration=0.3:offset=1.7[t01];
    [t01][s2]xfade=transition=fade:duration=0.3:offset=3.4[t02];
    [t02][s3]xfade=transition=fade:duration=0.3:offset=5.1[slideshow];
    [4:v]chromakey=0x00FF00:0.25:0.1,scale=1280:720[pip];
    [slideshow][pip]overlay=0:0:shortest=1[out]
  " \
  -map "[out]" \
  -c:v libx264 -preset medium -crf 23 \
  -pix_fmt yuv420p \
  -t 8 \
  "$OUTPUT"

echo ""
if [ -f "$OUTPUT" ]; then
  SIZE=$(du -h "$OUTPUT" | cut -f1)
  echo "✅ Saved: $OUTPUT ($SIZE)"
  echo "🎉 Open with: open $OUTPUT"
else
  echo "❌ Failed to create video"
  exit 1
fi
