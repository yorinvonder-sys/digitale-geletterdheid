// Root architecture declaration — see .claude/skills/architecture-as-code/
//
// This file composes rules BETWEEN top-level modules (afferent + sibling
// isolation). Rules about a module's own internals belong in that module's
// own eslint.architecture.mjs, not here.
//
// Every edge declared below currently has ZERO violations in src/. This file
// is a ratchet: it locks in boundaries the codebase already respects, so a
// regression fails CI. Boundaries the codebase does NOT yet respect are
// recorded under "Not yet enforced" and must not be added here until the
// existing violations are resolved.
//
// Not yet enforced:
//   - Cross-feature isolation (src/features/A -> src/features/B): 101 current
//     imports. features/ is not a set of bounded contexts today. Resolving
//     this is a topology decision (morphogenetic-architecture), not a lint fix.
//   - services -> features: 2 imports, both of
//     @/features/assessment/escaperoom/types. Enforceable once those types
//     move to a location services may own.
//   - Literal-only dynamic import paths: 10 mission templates deliberately use
//     import(`./configs/${missionId}.ts`) behind a validated id allowlist.

export default {
    // Narrowest first; catch-all last (pattern directive #5).
    components: [
        { name: 'test-unit', pattern: 'src/**/*.{test,spec}.{ts,tsx}', mode: 'file' },
        { name: 'test-support', pattern: 'tests/**', mode: 'file' },
        { name: 'edge-functions', pattern: 'supabase/functions/**', mode: 'file' },
        { name: 'components-ui', pattern: 'src/components/ui/**', mode: 'file' },
        { name: 'components-shell', pattern: 'src/components/app-shell/**', mode: 'file' },
        { name: 'services', pattern: 'src/services/**', mode: 'file' },
        { name: 'feature', pattern: 'src/features/*/**', mode: 'file', capture: ['domain'] },
        { name: 'src-other', pattern: 'src/**', mode: 'file' }, // catch-all, last
    ],
    forbidden: [
        {
            from: '*',
            except: ['edge-functions'],
            to: 'edge-functions',
            why: 'Client code must not import Supabase Edge Function source. AI and secret-bearing work runs server-side only (ARCHITECTURE.md, "AI-Assistenten En Edge Functions").',
        },
        {
            from: ['components-ui', 'components-shell'],
            to: 'feature',
            why: 'src/components/ui and src/components/app-shell are reusable building blocks without domain ownership (ARCHITECTURE.md, "Feature Map"). Lift shared state into the feature or pass it in as props.',
        },
        {
            from: 'services',
            to: ['components-ui', 'components-shell'],
            why: 'Services sit below the UI layer; a service importing a React component inverts the dependency direction.',
        },
        {
            from: '*',
            except: ['test-unit', 'test-support'],
            to: ['test-unit', 'test-support'],
            why: 'Production code must not import test-only code.',
        },
    ],
};
