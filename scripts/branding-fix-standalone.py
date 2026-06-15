#!/usr/bin/env python3
"""Batch-replace old brand hex colors in standalone mission components."""

import re, os

# All standalone mission files and other mission-related files with old colors
FILES = [
    "src/features/missions/DataDetectiveMission.tsx",
    "src/features/missions/DataVoorDataMission.tsx",
    "src/features/missions/DatalekkenRampenplanMission.tsx",
    "src/features/missions/DeepfakeDetectorMission.tsx",
    "src/features/missions/FilterBubbleBreakerMission.tsx",
    "src/features/missions/GameDirectorMission.tsx",
    "src/features/missions/MLTrainerMission.tsx",
    "src/features/missions/NeuralNavigatorMission.tsx",
    "src/features/missions/PrintInstructiesMission.tsx",
    "src/features/missions/PromptMasterMission.tsx",
    "src/features/missions/AccessControlEngineerMission.tsx",
    "src/features/missions/MissionExitConfirm.tsx",
    "src/features/missions/PeerFeedbackPanel.tsx",
    "src/features/missions/ReceivedFeedbackCard.tsx",

    # Review missions  
    "src/features/missions/review/CloudCleanerMission.tsx",
    "src/features/missions/review/LayoutDoctorMission.tsx",
    "src/features/missions/review/PitchPoliceMission.tsx",

    # Shared mission components
    "src/features/missions/shared/MissionConclusion.tsx",
    "src/features/missions/shared/MissionIntro.tsx",

    # Game director sub-components
    "src/features/missions/game-director/BlockPalette.tsx",
    "src/features/missions/game-director/CodeWorkspace.tsx",
    "src/features/missions/game-director/CodeBlock.tsx",
]

def fix_colors(text: str) -> str:
    replacements = [
        # #CBC04F
        (r'bg-\[#CBC04F\]', 'bg-duck-acid/80'),
        # #F3E4CB
        (r'bg-\[#F3E4CB\]', 'bg-duck-creamDeep'),
        # #5F947D
        (r'bg-\[#5F947D\]', 'bg-duck-ink'),
        (r'text-\[#5F947D\]', 'text-duck-ink'),
        (r'border-\[#5F947D\]', 'border-duck-ink'),
        # #0B453F
        (r'bg-\[#0B453F\]', 'bg-duck-ink'),
        (r'text-\[#0B453F\]', 'text-duck-ink'),
        (r'border-\[#0B453F\]', 'border-duck-ink'),
        # #08283B
        (r'bg-\[#08283B\]', 'bg-duck-ink'),
        (r'text-\[#08283B\]', 'text-duck-ink'),
        # #445865
        (r'bg-\[#445865\]', 'bg-duck-ink'),
        (r'text-\[#445865\]', 'text-duck-muted'),
        (r'border-\[#445865\]', 'border-duck-line'),
        (r'placeholder-\[#445865\]', 'placeholder-duck-muted'),
        # #FCF6EA
        (r'bg-\[#FCF6EA\]', 'bg-duck-bg'),
        # #FFFDF7
        (r'bg-\[#FFFDF7\]', 'bg-white'),
        # #E7D8BD
        (r'bg-\[#E7D8BD\]', 'bg-duck-line'),
        (r'text-\[#E7D8BD\]', 'text-duck-line'),
        (r'border-\[#E7D8BD\]', 'border-duck-line'),
        # #D97848
        (r'bg-\[#D97848\]', 'bg-duck-coral'),
        (r'text-\[#D97848\]', 'text-duck-coral'),
        (r'border-\[#D97848\]', 'border-duck-coral'),
        (r'ring-\[#D97848\]', 'ring-duck-coral'),
        (r'hover:border-\[#D97848\]', 'hover:border-duck-coral'),
        (r'focus:ring-\[#D97848\]', 'focus:ring-duck-coral'),
        (r'hover:bg-\[#D97848\]', 'hover:bg-duck-coral'),
        # #D7C95F
        (r'bg-\[#D7C95F\]', 'bg-duck-acid'),
        (r'text-\[#D7C95F\]', 'text-duck-ink'),
        (r'border-\[#D7C95F\]', 'border-duck-acid'),
        (r'shadow-\[#D7C95F\]', 'shadow-duck-acid'),
        (r'hover:bg-\[#CBC04F\]', 'hover:bg-duck-acid/80'),
        # Inline styles
        (r"backgroundColor: '#0B453F'", "backgroundColor: '#202023'"),
        (r"backgroundColor: '#5F947D'", "backgroundColor: '#202023'"),
        (r"backgroundColor: '#445865'", "backgroundColor: '#202023'"),
        (r"backgroundColor: '#D97848'", "backgroundColor: '#ff3c21'"),
        (r"backgroundColor: '#D7C95F'", "backgroundColor: '#e1ff01'"),
        (r"backgroundColor: '#FCF6EA'", "backgroundColor: '#f2f1ec'"),
        (r"color: '#0B453F'", "color: '#202023'"),
        (r"color: '#445865'", "color: '#6f6e69'"),
        (r"color: '#08283B'", "color: '#202023'"),
        (r"color: '#D97848'", "color: '#ff3c21'"),
        (r"borderColor: '#D97848'", "borderColor: '#ff3c21'"),
        (r"borderColor: '#E7D8BD'", "borderColor: '#e3e2dc'"),
        (r"borderColor: '#5F947D'", "borderColor: '#202023'"),
    ]
    for old, new in replacements:
        text = re.sub(old, new, text)
    return text


total = 0
for fp in FILES:
    if not os.path.exists(fp):
        print(f"❌ NOT FOUND: {fp}")
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    fixed = fix_colors(orig)
    if orig == fixed:
        print(f"  SKIP {fp} (no changes)")
        continue
    changes = sum(1 for _ in re.finditer(r'bg-\[#|text-\[#|border-\[#|shadow-\[#|ring-\[#|backgroundColor|borderColor|color:', orig))
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(fixed)
    print(f"✅ ~{changes} changes in {fp}")
    total += changes

print(f"\n---\nTotal replacements: ~{total}")
