#!/usr/bin/env python3
"""Replace lab-* classes with duck-* classes in developer dashboard files."""
import os, re

# Context-aware replacements: match "bg-lab-X", "text-lab-X", "border-lab-X" etc.
LAB_REPLACEMENTS = [
    # bg-lab-* → bg-duck-*
    (r'bg-lab-cream(?=\b)', 'bg-duck-bg'),
    (r'bg-lab-creamDeep(?=\b)', 'bg-duck-creamDeep'),
    (r'bg-lab-ink(?=\b)', 'bg-duck-ink'),
    (r'bg-lab-muted(?=\b)', 'bg-duck-ink'),
    (r'bg-lab-line(?=\b)', 'bg-duck-line'),
    (r'bg-lab-coral(?=\b)', 'bg-duck-coral'),
    (r'bg-lab-gold(?=\b)', 'bg-duck-acid'),
    (r'bg-lab-sage(?=\b)', 'bg-duck-ink'),
    (r'bg-lab-teal(?=\b)', 'bg-duck-ink'),
    (r'bg-lab-primary(?=\b)', 'bg-duck-coral'),
    (r'bg-lab-secondary(?=\b)', 'bg-duck-ink'),

    # text-lab-* → text-duck-*
    (r'text-lab-cream(?=\b)', 'text-duck-ink'),
    (r'text-lab-creamDeep(?=\b)', 'text-duck-ink'),
    (r'text-lab-ink(?=\b)', 'text-duck-ink'),
    (r'text-lab-muted(?=\b)', 'text-duck-muted'),
    (r'text-lab-line(?=\b)', 'text-duck-line'),
    (r'text-lab-coral(?=\b)', 'text-duck-coral'),
    (r'text-lab-gold(?=\b)', 'text-duck-ink'),
    (r'text-lab-sage(?=\b)', 'text-duck-ink'),
    (r'text-lab-teal(?=\b)', 'text-duck-ink'),

    # border-lab-* → border-duck-*
    (r'border-lab-cream(?=\b)', 'border-duck-bg'),
    (r'border-lab-creamDeep(?=\b)', 'border-duck-creamDeep'),
    (r'border-lab-ink(?=\b)', 'border-duck-ink'),
    (r'border-lab-muted(?=\b)', 'border-duck-line'),
    (r'border-lab-line(?=\b)', 'border-duck-line'),
    (r'border-lab-coral(?=\b)', 'border-duck-coral'),
    (r'border-lab-gold(?=\b)', 'border-duck-acid'),
    (r'border-lab-sage(?=\b)', 'border-duck-ink'),
    (r'border-lab-teal(?=\b)', 'border-duck-ink'),

    # hover/focus with lab- prefixes
    (r'hover:bg-lab-', 'hover:bg-duck-'),
    (r'hover:text-lab-', 'hover:text-duck-'),
    (r'hover:border-lab-', 'hover:border-duck-'),
    (r'focus:ring-lab-', 'focus:ring-duck-'),
    (r'focus:border-lab-', 'focus:border-duck-'),
    (r'focus:bg-lab-', 'focus:bg-duck-'),

    # shadow/ring/from/to with lab-*
    (r'shadow-lab-', 'shadow-duck-'),
    (r'ring-lab-', 'ring-duck-'),
    (r'from-lab-', 'from-duck-'),
    (r'to-lab-', 'to-duck-'),

    # divide-lab-* → divide-duck-*
    (r'divide-lab-', 'divide-duck-'),

    # Standalone lab-X classes (used in template literals or as CSS values)
    (r"'lab-", "'duck-"),
    (r'"lab-', '"duck-'),
    (r'`lab-', '`duck-'),

    # Generic Tailwind utility colors → duck equivalents
    (r'text-gray-400(?=\b)', 'text-duck-muted'),
    (r'text-gray-500(?=\b)', 'text-duck-muted'),
    (r'text-gray-600(?=\b)', 'text-duck-muted'),
    (r'text-gray-700(?=\b)', 'text-duck-ink'),
    (r'text-gray-800(?=\b)', 'text-duck-ink'),
    (r'text-gray-900(?=\b)', 'text-duck-ink'),
    (r'text-gray-300(?=\b)', 'text-duck-muted'),
    (r'text-gray-200(?=\b)', 'text-duck-muted'),
    (r'text-gray-100(?=\b)', 'text-duck-ink/40'),

    (r'border-gray-100(?=\b)', 'border-duck-line'),
    (r'border-gray-200(?=\b)', 'border-duck-line'),
    (r'border-gray-300(?=\b)', 'border-duck-line'),
    (r'border-gray-400(?=\b)', 'border-duck-line'),

    (r'divide-gray-200(?=\b)', 'divide-duck-line'),
    (r'divide-gray-100(?=\b)', 'divide-duck-line'),

    (r'bg-gray-50(?=\b)', 'bg-duck-bg'),
    (r'bg-gray-100(?=\b)', 'bg-duck-bg'),
    (r'bg-gray-200(?=\b)', 'bg-duck-bg'),
    (r'bg-gray-300(?=\b)', 'bg-duck-line'),
    (r'bg-gray-400(?=\b)', 'bg-duck-line'),
]

files = []
for root in ['src/features/developer']:
    for dirpath, dirnames, filenames in os.walk(root):
        for fn in filenames:
            if fn.endswith(('.tsx', '.ts')):
                files.append(os.path.join(dirpath, fn))

total_files = 0
for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    fixed = orig
    for pattern, replacement in LAB_REPLACEMENTS:
        fixed = re.sub(pattern, replacement, fixed)
    
    if fixed != orig:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f'  ✅ {fp}')
        total_files += 1

print(f'\nFixed {total_files} developer dashboard files')
