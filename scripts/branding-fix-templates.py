#!/usr/bin/env python3
"""Batch-replace old brand hex colors with duck tokens in all template files."""

import re
import os

FILES = [
    "src/features/missions/templates/TemplateMissionRouter.tsx",

    # builder-canvas
    "src/features/missions/templates/builder-canvas/BuilderCanvas.tsx",
    "src/features/missions/templates/builder-canvas/sub/ChecklistItem.tsx",
    "src/features/missions/templates/builder-canvas/sub/MilestoneToast.tsx",
    "src/features/missions/templates/builder-canvas/sub/MobileTabBar.tsx",
    "src/features/missions/templates/builder-canvas/sub/PreviewPanel.tsx",
    "src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx",

    # data-viewer
    "src/features/missions/templates/data-viewer/DataViewer.tsx",
    "src/features/missions/templates/data-viewer/sub/InteractiveTable.tsx",
    "src/features/missions/templates/data-viewer/sub/SimpleChart.tsx",

    # debate-arena
    "src/features/missions/templates/debate-arena/DebateArena.tsx",
    "src/features/missions/templates/debate-arena/sub/ArguePhase.tsx",
    "src/features/missions/templates/debate-arena/sub/ChallengePhase.tsx",
    "src/features/missions/templates/debate-arena/sub/ExplorePhase.tsx",
    "src/features/missions/templates/debate-arena/sub/PositionPhase.tsx",
    "src/features/missions/templates/debate-arena/sub/ReflectPhase.tsx",

    # puzzle-lab
    "src/features/missions/templates/puzzle-lab/PuzzleLab.tsx",

    # review-arena
    "src/features/missions/templates/review-arena/ReviewArena.tsx",
    "src/features/missions/templates/review-arena/sub/Categorize.tsx",
    "src/features/missions/templates/review-arena/sub/DragSort.tsx",
    "src/features/missions/templates/review-arena/sub/MatchPairs.tsx",
    "src/features/missions/templates/review-arena/sub/RapidFire.tsx",

    # scenario-engine
    "src/features/missions/templates/scenario-engine/ScenarioEngine.tsx",
    "src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx",
    "src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx",
    "src/features/missions/templates/scenario-engine/sub/OrderPriorityRound.tsx",
    "src/features/missions/templates/scenario-engine/sub/SelectCorrectRound.tsx",

    # shared
    "src/features/missions/templates/shared/ConfidenceRating.tsx",
    "src/features/missions/templates/shared/FollowUpCard.tsx",
    "src/features/missions/templates/shared/MissionGoalBanner.tsx",
    "src/features/missions/templates/shared/PhaseCard.tsx",
    "src/features/missions/templates/shared/PhaseHeader.tsx",
    "src/features/missions/templates/shared/StreakIndicator.tsx",

    # simulation-lab
    "src/features/missions/templates/simulation-lab/SimulationLab.tsx",
    "src/features/missions/templates/simulation-lab/sub/ParameterControl.tsx",
    "src/features/missions/templates/simulation-lab/sub/QuestionCard.tsx",
    "src/features/missions/templates/simulation-lab/sub/SimulationVisuals.tsx",
]

def fix_colors_in_classnames_and_styles(text: str) -> str:
    """Replace old hex colors in JSX className strings and style props."""

    replacements = [
        # === COLOR MAPPINGS (must go from most specific to least) ===

        # #CBC04F (old gold hover) → duck-acid/80
        (r'bg-\[#CBC04F\]', 'bg-duck-acid/80'),

        # #F3E4CB (old cream deep) → duck-creamDeep
        (r'bg-\[#F3E4CB\]', 'bg-duck-creamDeep'),

        # #5F947D (old sage) — check context
        # bg-[#5F947D] → bg-duck-ink
        (r'bg-\[#5F947D\]', 'bg-duck-ink'),
        # text-[#5F947D] → text-duck-ink
        (r'text-\[#5F947D\]', 'text-duck-ink'),
        # border-[#5F947D] → border-duck-ink
        (r'border-\[#5F947D\]', 'border-duck-ink'),
        # ring-[#5F947D] → ring-duck-ink
        (r'ring-\[#5F947D\]', 'ring-duck-ink'),

        # #0B453F (old teal) — check context
        (r'bg-\[#0B453F\]', 'bg-duck-ink'),
        (r'text-\[#0B453F\]', 'text-duck-ink'),
        (r'border-\[#0B453F\]', 'border-duck-ink'),
        (r'ring-\[#0B453F\]', 'ring-duck-ink'),

        # #08283B (old ink) — check context
        (r'bg-\[#08283B\]', 'bg-duck-ink'),
        (r'text-\[#08283B\]', 'text-duck-ink'),

        # #445865 (old muted) — check context
        (r'bg-\[#445865\]', 'bg-duck-ink'),
        (r'text-\[#445865\]', 'text-duck-muted'),
        (r'border-\[#445865\]', 'border-duck-line'),
        (r'ring-\[#445865\]', 'ring-duck-ink'),

        # #FCF6EA (old cream) → duck-bg
        (r'bg-\[#FCF6EA\]', 'bg-duck-bg'),

        # #FFFDF7 (old paper) → white
        (r'bg-\[#FFFDF7\]', 'bg-white'),

        # #E7D8BD (old line) → duck-line
        (r'bg-\[#E7D8BD\]', 'bg-duck-line'),
        (r'text-\[#E7D8BD\]', 'text-duck-line'),
        (r'border-\[#E7D8BD\]', 'border-duck-line'),

        # #D97848 (old coral) — check context
        (r'bg-\[#D97848\]', 'bg-duck-coral'),
        (r'text-\[#D97848\]', 'text-duck-coral'),
        (r'border-\[#D97848\]', 'border-duck-coral'),
        (r'ring-\[#D97848\]', 'ring-duck-coral'),
        (r'hover:border-\[#D97848\]', 'hover:border-duck-coral'),
        (r'focus:ring-\[#D97848\]', 'focus:ring-duck-coral'),

        # #D7C95F (old gold) → duck-acid — check context
        (r'bg-\[#D7C95F\]', 'bg-duck-acid'),
        (r'text-\[#D7C95F\]', 'text-duck-ink'),
        (r'border-\[#D7C95F\]', 'border-duck-acid'),
        (r'shadow-\[#D7C95F\]', 'shadow-duck-acid'),
        (r'hover:bg-\[#CBC04F\]', 'hover:bg-duck-acid/80'),

        # Also handle inline style props with these colors
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
        (r"color: '#FFFFFF'", "color: '#FFFFFF'"),  # keep white

        # Raw hex in strings (like "text-[#...]") which may appear as string templates
        (r'"border-\[#E7D8BD\]"', '"border-duck-line"'),
        (r'"bg-\[#FCF6EA\]"', '"bg-duck-bg"'),
    ]

    for old_pattern, new_str in replacements:
        text = re.sub(old_pattern, new_str, text)

    return text


def process_file(filepath: str) -> tuple[int, int]:
    """Process a single file, return (replacements_made, error_code)."""
    if not os.path.exists(filepath):
        return (0, 1)

    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    fixed = fix_colors_in_classnames_and_styles(original)

    if original == fixed:
        return (0, 0)

    # Count differences
    import difflib
    diff = list(difflib.unified_diff(original.splitlines(), fixed.splitlines()))
    changes = len([l for l in diff if l.startswith('-')]) // 2 + 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed)

    return (changes, 0)


# Run
total_changes = 0
errors = 0
for fp in FILES:
    changes, err = process_file(fp)
    if err:
        print(f"❌ NOT FOUND: {fp}")
        errors += 1
    elif changes:
        print(f"✅ {changes} changes in {fp}")
        total_changes += changes

print(f"\n---\nTotal: {total_changes} replacements across {len(FILES)} files, {errors} errors")
