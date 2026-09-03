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


// eslint-plugin-boundaries v7 has two classification kinds. Element
// descriptors match FOLDERS (settings 'boundaries/elements', selected by
// `element.type`); file descriptors match individual FILES (settings
// 'boundaries/files', selected by `file.categories`). The schema's
// stack-agnostic `mode: 'file'` maps onto the latter -- using an element
// descriptor for a file pattern silently classifies nothing.
const FILE_COMPONENTS = COMPONENTS.filter((c) => c.mode === 'file');
const ELEMENT_COMPONENTS = COMPONENTS.filter((c) => c.mode !== 'file');

const fileCategories = new Set(FILE_COMPONENTS.map((c) => c.name));
// The file catch-all exists ONLY so that `noneOf` has something to match a
// production file against. It must never be SELECTABLE: every file carries it,
// so including it in a `*` expansion makes the file arm match everything and
// silently defeats any element exclusion on the same rule.
const CATCH_ALL_CATEGORY = FILE_COMPONENTS.at(-1)?.pattern === '**'
    ? FILE_COMPONENTS.at(-1).name
    : null;
const names = COMPONENTS.map((c) => c.name).filter((n) => n !== CATCH_ALL_CATEGORY);

function resolveNames(spec, except) {
    if (spec && typeof spec === 'object' && !Array.isArray(spec)) return spec; // parametric
    const resolveList = (list) =>
        list.flatMap((t) =>
            t === '*'
                ? names
                : t.endsWith('*')
                  ? names.filter((n) => n.startsWith(t.slice(0, -1)))
                  : [t],
        );
    let types = resolveList(Array.isArray(spec) ? spec : [spec]);
    if (CATCH_ALL_CATEGORY && types.includes(CATCH_ALL_CATEGORY)) {
        throw new Error(
            `eslint.architecture.mjs: '${CATCH_ALL_CATEGORY}' is a reserved implementation ` +
            `detail (it matches every file so that \`noneOf\` can exclude categories) and ` +
            `cannot be named by a rule. Select the element types you mean instead.`,
        );
    }
    if (except?.length) {
        const excluded = new Set(resolveList(except));
        types = types.filter((t) => !excluded.has(t));
    }
    return types;
}

// A file carries BOTH a file category and the element type of its directory:
// src/features/foo/x.test.ts is `test-unit` AND `feature`. Dropping a category
// via `except` therefore does not stop the surviving element selector matching
// those same files. The fix is a COMPOSITE selector: element condition plus
// `file.categories: { noneOf: [...] }` in one entity selector, which works only
// because every file also carries the `non-test` catch-all category.
function selectors(spec, except) {
    const resolved = resolveNames(spec, except);
    if (!Array.isArray(resolved)) {
        const sel = { captured: resolved.captured ?? {} };
        return [fileCategories.has(resolved.type)
            ? { file: { categories: resolved.type, ...sel } }
            : { element: { type: resolved.type, ...sel } }];
    }
    const excludedCategories = except?.length
        ? resolveNames(except).filter((n) => fileCategories.has(n))
        : [];
    const elementTypes = resolved.filter((n) => !fileCategories.has(n));
    const categories = resolved.filter((n) => fileCategories.has(n));

    // The element arm carries the category exclusion; the positive category arm
    // is kept alongside it, because dropping it would silently stop enforcing
    // components the spec still selects.
    //
    // When the `except` removed ELEMENTS, that arm has to carry the surviving
    // element list too: a categorized file inside an excluded element would
    // otherwise be selected straight back through its category.
    const excludedElements = except?.length
        ? resolveNames(except).filter((n) => !fileCategories.has(n))
        : [];
    const out = [];
    if (elementTypes.length) {
        out.push(excludedCategories.length
            ? { element: { type: elementTypes }, file: { categories: { noneOf: excludedCategories } } }
            : { element: { type: elementTypes } });
    }
    if (categories.length) {
        out.push(excludedElements.length && elementTypes.length
            ? { element: { type: elementTypes }, file: { categories } }
            : { file: { categories } });
    }
    return out;
}

const elements = ELEMENT_COMPONENTS.map((c) => ({
    type: c.name,
    pattern: c.pattern,
    ...(c.capture && { capture: c.capture }),
}));

const files = FILE_COMPONENTS.map((c) => ({
    category: c.name,
    pattern: c.pattern,
}));

const policies = FORBIDDEN.map((e) => ({
    from: selectors(e.from, e.except),
    disallow: selectors(e.to, e.except_to).map((to) => ({ to })),
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
        files: ['src/**/*.{ts,tsx,js,jsx,mjs}'],
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
            'boundaries/files': files,
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
            // Without checkInternals the plugin skips dependencies inside one element,
            // which is exactly where a co-located test file sits.
            'boundaries/dependencies': ['error', { default: 'allow', policies, checkInternals: true }],
        },
    },
];
