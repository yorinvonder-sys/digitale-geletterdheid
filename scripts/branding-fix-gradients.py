#!/usr/bin/env python3
"""Fix remaining gradient & opacity hex patterns in mission files."""
import re, os, glob

def fix_gradients(text: str) -> str:
    replacements = [
        # from-[#...] gradient stops
        (r'from-\[#D97848\]', 'from-duck-coral'),
        (r'to-\[#D97848\]', 'to-duck-coral'),
        (r'via-\[#D97848\]', 'via-duck-coral'),
        (r'from-\[#5F947D\]', 'from-duck-ink'),
        (r'to-\[#5F947D\]', 'to-duck-ink'),
        (r'from-\[#0B453F\]', 'from-duck-ink'),
        (r'to-\[#0B453F\]', 'to-duck-ink'),
        (r'from-\[#E7D8BD\]', 'from-duck-line'),
        (r'to-\[#E7D8BD\]', 'to-duck-line'),
        (r'from-\[#445865\]', 'from-duck-ink'),
        (r'to-\[#445865\]', 'to-duck-ink'),
        (r'from-\[#FCF6EA\]', 'from-duck-bg'),
        (r'to-\[#FCF6EA\]', 'to-duck-bg'),
        (r'from-\[#D7C95F\]', 'from-duck-acid'),
        (r'to-\[#D7C95F\]', 'to-duck-acid'),

        # shadow-[#...]/opacity and similar
        (r'shadow-\[#D97848\]', 'shadow-duck-coral'),
        (r'shadow-\[#5F947D\]', 'shadow-duck-ink'),
        (r'shadow-\[#D7C95F\]', 'shadow-duck-acid'),
        (r'shadow-\[#0B453F\]', 'shadow-duck-ink'),

    ]
    for old, new in replacements:
        text = re.sub(old, new, text)
    return text

# Scan all mission and preview files for remaining patterns
files = []
for root in ['src/features/missions', 'src/features/ai-lab/previews', 'src/features/ai-lab', 'src/features/student', 'src/features/dev-tools']:
    for dirpath, dirnames, filenames in os.walk(root):
        for fn in filenames:
            if fn.endswith(('.tsx', '.ts')):
                files.append(os.path.join(dirpath, fn))

total = 0
for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        orig = f.read()
    fixed = fix_gradients(orig)
    if orig != fixed:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(fixed)
        total += 1
        print(f"  ✅ {fp}")

print(f"\nFixed {total} files with remaining gradient/opacity patterns")
