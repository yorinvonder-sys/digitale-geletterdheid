#!/usr/bin/env python3
"""Brute-force final pass: replace ALL remaining old hex colors across mission scope files."""

import os
import re

# Map old hex -> new hex value (for standalone hex strings, not classNames)
HEX_MAP = {
    '#D97848': '#ff3c21',
    '#FCF6EA': '#f2f1ec',
    '#FFFDF7': '#ffffff',
    '#08283B': '#202023',
    '#445865': '#6f6e69',
    '#E7D8BD': '#e3e2dc',
    '#D7C95F': '#e1ff01',
    '#5F947D': '#202023',
    '#0B453F': '#202023',
    '#F3E4CB': '#e8e3d8',
    '#CBC04F': '#c8e000',
}

# All files in scope
scope_dirs = [
    'src/features/missions',
    'src/features/ai-lab',
    'src/features/student',
    'src/features/dev-tools',
    'src/features/dashboard',
]

total_replaced = 0
for sd in scope_dirs:
    for root, dirs, files in os.walk(sd):
        if any(x in root for x in ['node_modules']): continue
        for fn in files:
            if not fn.endswith(('.tsx', '.ts')): continue
            fp = os.path.join(root, fn)
            with open(fp, 'r', encoding='utf-8') as f:
                orig = f.read()

            fixed = orig
            file_changed = False

            # Strategy: Replace hex values that appear within quoted strings
            # Pattern: hex after =, :, ? or inside classname construct
            # Avoid replacing in: designTokens.ts, types.ts, config files where they define the mapping

            for old_hex, new_hex in HEX_MAP.items():
                # Replace standalone 'HEX' or "HEX" patterns
                # Need to handle both single and double quotes
                for q in ["'", '"']:
                    old_str = f'{q}{old_hex}{q}'
                    new_str = f'{q}{new_hex}{q}'
                    if old_str in fixed:
                        fixed = fixed.replace(old_str, new_str)
                        file_changed = True

                # Also replace hex in template literals: `...${...}...#HEX...`
                # No, template literals are less common

            if file_changed:
                # Only write if actually changed
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(fixed)
                # Count how many were replaced
                changes = sum(
                    orig.count(f'{q}{h}{q}')
                    for q in ["'", '"']
                    for h in HEX_MAP
                ) - sum(
                    fixed.count(f'{q}{h}{q}')
                    for q in ["'", '"']
                    for h in HEX_MAP
                )
                total_replaced += changes
                print(f"  ✅ {fp} ({changes} replacements)")

print(f"\nTotal replacements: {total_replaced}")
