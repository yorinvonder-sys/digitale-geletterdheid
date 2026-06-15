#!/usr/bin/env python3
"""Fix bar chart color values in simulation-lab configs and remaining standalone hex patterns."""

import os

replacements = [
    # Simulation-lab configs — bar chart color values (data, not classNames)
    ("'#D97848'", "'#ff3c21'"),
    ("'#E7D8BD'", "'#e3e2dc'"),
    ("'#5F947D'", "'#202023'"),
    ("'#0B453F'", "'#202023'"),
    ("'#D7C95F'", "'#e1ff01'"),
    ("'#445865'", "'#202023'"),
]

# Files where these literal hex colors appear as chart data (not in classNames)
files = [
    "src/features/missions/templates/simulation-lab/configs/algorithm-architect.ts",
    "src/features/missions/templates/simulation-lab/configs/bug-hunter.ts",
    "src/features/missions/templates/simulation-lab/configs/code-reviewer.ts",
    "src/features/missions/templates/simulation-lab/configs/privacy-by-design.ts",
    "src/features/missions/templates/simulation-lab/configs/ai-spiegel.ts",
    "src/features/missions/templates/simulation-lab/sub/SimulationVisuals.tsx",
    "src/features/missions/templates/simulation-lab/sub/ParameterControl.tsx",
    "src/features/missions/templates/data-viewer/sub/SimpleChart.tsx",
]

total = 0
for fp in files:
    if not os.path.exists(fp):
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    fixed = orig
    for old, new in replacements:
        fixed = fixed.replace(old, new)
    if orig != fixed:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f"  ✅ {fp}")
        total += 1

print(f"\nFixed {total} files with chart/standalone hex patterns")
