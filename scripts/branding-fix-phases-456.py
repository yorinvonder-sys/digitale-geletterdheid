#!/usr/bin/env python3
"""Fix phases 4-6: config badge colors, agent configs, preview components."""

import re, os, glob

def fix_colors(text: str) -> str:
    """Replace old hex colors with duck tokens — className first, then inline styles."""
    replacements = [
        # === ClassName patterns (most common) ===
        (r'bg-\[#CBC04F\]', 'bg-duck-acid/80'),
        (r'bg-\[#F3E4CB\]', 'bg-duck-creamDeep'),
        (r'bg-\[#5F947D\]', 'bg-duck-ink'),
        (r'text-\[#5F947D\]', 'text-duck-ink'),
        (r'border-\[#5F947D\]', 'border-duck-ink'),
        (r'ring-\[#5F947D\]', 'ring-duck-ink'),
        (r'bg-\[#0B453F\]', 'bg-duck-ink'),
        (r'text-\[#0B453F\]', 'text-duck-ink'),
        (r'border-\[#0B453F\]', 'border-duck-ink'),
        (r'ring-\[#0B453F\]', 'ring-duck-ink'),
        (r'bg-\[#08283B\]', 'bg-duck-ink'),
        (r'text-\[#08283B\]', 'text-duck-ink'),
        (r'bg-\[#445865\]', 'bg-duck-ink'),
        (r'text-\[#445865\]', 'text-duck-muted'),
        (r'border-\[#445865\]', 'border-duck-line'),
        (r'ring-\[#445865\]', 'ring-duck-ink'),
        (r'bg-\[#FCF6EA\]', 'bg-duck-bg'),
        (r'bg-\[#FFFDF7\]', 'bg-white'),
        (r'bg-\[#E7D8BD\]', 'bg-duck-line'),
        (r'text-\[#E7D8BD\]', 'text-duck-line'),
        (r'border-\[#E7D8BD\]', 'border-duck-line'),
        (r'bg-\[#D97848\]', 'bg-duck-coral'),
        (r'text-\[#D97848\]', 'text-duck-coral'),
        (r'border-\[#D97848\]', 'border-duck-coral'),
        (r'ring-\[#D97848\]', 'ring-duck-coral'),
        (r'hover:border-\[#D97848\]', 'hover:border-duck-coral'),
        (r'focus:ring-\[#D97848\]', 'focus:ring-duck-coral'),
        (r'hover:bg-\[#D97848\]', 'hover:bg-duck-coral'),
        (r'hover:text-\[#D97848\]', 'hover:text-duck-coral'),
        (r'bg-\[#D7C95F\]', 'bg-duck-acid'),
        (r'text-\[#D7C95F\]', 'text-duck-ink'),
        (r'border-\[#D7C95F\]', 'border-duck-acid'),
        (r'shadow-\[#D7C95F\]', 'shadow-duck-acid'),
        (r'hover:bg-\[#CBC04F\]', 'hover:bg-duck-acid/80'),

        # Raw hex values in configs / agent configs / props
        # color: '...' — could be accent color or inline style
        (r"color: '#0B453F'", "color: '#202023'"),
        (r"color: '#08283B'", "color: '#202023'"),
        (r"color: '#5F947D'", "color: '#202023'"),
        (r"color: '#D7C95F'", "color: '#e1ff01'"),
        (r"color: '#D97848'", "color: '#ff3c21'"),
        # For #445865: in agent configs it's an accent → #202023
        # In inline styles it was muted text → keep as duck-muted
        (r"color: '#445865'", "color: '#202023'"),

        # backgroundColor: '...'
        (r"backgroundColor: '#0B453F'", "backgroundColor: '#202023'"),
        (r"backgroundColor: '#5F947D'", "backgroundColor: '#202023'"),
        (r"backgroundColor: '#445865'", "backgroundColor: '#202023'"),
        (r"backgroundColor: '#D97848'", "backgroundColor: '#ff3c21'"),
        (r"backgroundColor: '#D7C95F'", "backgroundColor: '#e1ff01'"),
        (r"backgroundColor: '#FCF6EA'", "backgroundColor: '#f2f1ec'"),

        # borderColor: '...'
        (r"borderColor: '#D97848'", "borderColor: '#ff3c21'"),
        (r"borderColor: '#E7D8BD'", "borderColor: '#e3e2dc'"),
        (r"borderColor: '#5F947D'", "borderColor: '#202023'"),

    ]
    for old, new in replacements:
        text = re.sub(old, new, text)
    return text


# === Phase 4: Mission configs ===
config_files = []
for root in [
    "src/features/missions/templates/tool-guide/configs",
    "src/features/missions/templates/builder-canvas/configs",
    "src/features/missions/templates/data-viewer/configs",
    "src/features/missions/templates/debate-arena/configs",
    "src/features/missions/templates/puzzle-lab/configs",
    "src/features/missions/templates/review-arena/configs",
    "src/features/missions/templates/scenario-engine/configs",
    "src/features/missions/templates/simulation-lab/configs",
]:
    if os.path.isdir(root):
        config_files.extend(glob.glob(f"{root}/*.ts"))

total = 0
changed = 0
for fp in config_files:
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    fixed = fix_colors(orig)
    if orig != fixed:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(fixed)
        changed += 1; total += 1

print(f"Phase 4 (configs): {changed} files updated")

# === Phase 5: Agent configs ===
for fp in ["src/config/agents/year1.tsx", "src/config/agents/year2.tsx", "src/config/agents/year3.tsx"]:
    if not os.path.exists(fp): continue
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    fixed = fix_colors(orig)
    if orig != fixed:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f"  ✅ {fp}")
        changed += 1; total += 1

print(f"Phase 5 (agents): {changed - (changed - (changed if fp else 0))} agent files updated")

# === Phase 6: Preview & dev components ===
preview_files = []
for root in [
    "src/features/ai-lab",
    "src/features/dev-tools",
    "src/features/student",
    "src/features/developer",
    "src/features/public-site",
    "src/features/dashboard",
    "src/features/profile",
    "src/features/assessment",
]:
    if os.path.isdir(root):
        for f in os.listdir(root):
            fp = os.path.join(root, f)
            if os.path.isfile(fp) and fp.endswith(('.tsx', '.ts')):
                preview_files.append(fp)

p_changed = 0
for fp in preview_files:
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    fixed = fix_colors(orig)
    if orig != fixed:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(fixed)
        p_changed += 1
        total += 1

print(f"Phase 6 (preview/dev): {p_changed} files updated")
print(f"\nTotal files updated: {total}")
