import React from 'react';

/**
 * DuckMark — renders the DGSkills duck logo.
 *
 * ⚠️ Source of truth: /assets/brand/dgskills-duck-logo-mark.webp
 *    Do NOT replace this with public/favicon.svg or public/logo.svg —
 *    those are legacy wrapper SVGs pointing to the same raster, not vector sources.
 *    For new sizes/formats, resize from the WebP above, not from any SVG.
 */
export function DuckMark({ className }: { className?: string }) {
    return (
        <img
            src="/assets/brand/dgskills-duck-logo-mark.webp"
            alt="DGSkills"
            className={className}
            aria-hidden="true"
            width={64}
            height={64}
            decoding="async"
        />
    );
}
