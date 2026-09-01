// Architecture-as-code assembler.
//
// Discovers every eslint.architecture.mjs in the repo, merges their component
// registries and forbidden edges, expands wildcards against the live registry,
// and emits one eslint-plugin-boundaries config.
//
// This config intentionally enables ONLY architecture rules. It is not a style
// or code-quality lint; adding rulesets here is a separate decision.
//
// See .claude/skills/architecture-as-code/ (pattern) and
// .claude/skills/architecture-as-code-javascript/ (this encoding).

import { readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';

const REPO_ROOT = import.meta.dirname;
const ARCH_FILE = 'eslint.architecture.mjs';
const SKIP = new Set([
    'node_modules', 'dist', '.git', '.claude', '.agents', '.agent', '.codex',
    'public', 'coverage', 'playwright-report', '.vercel',
]);

function findArchFiles(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        if (SKIP.has(entry)) continue;
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) findArchFiles(p, out);
        else if (entry === ARCH_FILE) out.push(p);
    }
    return out;
}

// Deeper files first, so a module's own file precedes its ancestor's catch-all.
const archFiles = findArchFiles(REPO_ROOT).sort(
    (a, b) => b.split(sep).length - a.split(sep).length,
);
const archs = await Promise.all(archFiles.map((f) => import(pathToFileURL(f).href)));
const COMPONENTS = archs.flatMap((m) => m.default.components ?? []);
const FORBIDDEN = archs.flatMap((m) => m.default.forbidden ?? []);

const names = COMPONENTS.map((c) => c.name);

// eslint-plugin-boundaries v7 selector syntax: an element selector is
// { element: { type: [...] } }, and disallow entries need an explicit `to`
// wrapper. The skill's generic example predates this shape.
function selector(spec, except) {
    if (spec && typeof spec === 'object' && !Array.isArray(spec)) {
        return { element: { type: spec.type, captured: spec.captured ?? {} } };
    }
    const resolveList = (list) =>
        list.flatMap((t) =>
            t === '*'
                ? names
                : t.endsWith('*')
                  ? names.filter((n) => n.startsWith(t.slice(0, -1)))
                  : [t],
        );
    let types = resolveList(Array.isArray(spec) ? spec : [spec]);
    if (except?.length) {
        const excluded = new Set(resolveList(except));
        types = types.filter((t) => !excluded.has(t));
    }
    return { element: { type: types } };
}

// The schema's stack-agnostic `mode` is translated here: v7 element
// descriptors deprecate it, and `mode: 'file'` (match the whole path, not a
// containing folder) is expressed as `partialMatch: false`.
const elements = COMPONENTS.map((c) => ({
    type: c.name,
    pattern: c.pattern,
    ...(c.mode === 'file' && { partialMatch: false }),
    ...(c.capture && { capture: c.capture }),
}));

const policies = FORBIDDEN.map((e) => ({
    from: [selector(e.from, e.except)],
    disallow: [{ to: selector(e.to, e.except_to) }],
    message: e.why,
}));

export default [
    {
        ignores: [
            'dist/**', 'node_modules/**', 'coverage/**', 'public/**',
            'playwright-report/**', '.vercel/**',
        ],
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        // src/ carries `eslint-disable` comments for typescript-eslint and
        // react-hooks rules. Those plugins are registered so the comments
        // resolve to known rules, but NONE of their rules are enabled: this
        // config enforces architecture only. Enabling a code-quality ruleset
        // here is a separate decision with its own violation backlog.
        linterOptions: { reportUnusedDisableDirectives: 'off' },
        plugins: {
            boundaries,
            '@typescript-eslint': tsPlugin,
            'react-hooks': reactHooks,
        },
        settings: {
            'boundaries/elements': elements,
            // supabase/functions is listed here but NOT in `files` above: edge
            // code is never linted itself (it is Deno), yet it must be a known
            // element so that a client import of it resolves to `edge-functions`
            // instead of silently passing as an unmatched external module.
            'boundaries/include': ['src/**/*', 'supabase/functions/**/*', 'tests/**/*'],
            'import/resolver': {
                typescript: { project: './tsconfig.base.json' },
            },
        },
        rules: {
            'boundaries/dependencies': ['error', { default: 'allow', policies }],
        },
    },
];
