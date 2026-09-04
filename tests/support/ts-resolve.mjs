// Laat `node --test` de app-modules laden die Vite normaal oplost.
//
// De testrunner van Node kan TypeScript strippen, maar lost geen extensieloze
// imports (`./sloKerndoelen`) of het `@/`-alias uit tsconfig.base.json op. Deze
// hook doet dat alsnog, zodat een test src-code kan importeren zonder dat die
// src-code voor de test aangepast hoeft te worden.
//
// Gebruik: node --import ./tests/support/ts-resolve.mjs --test tests/<map>/*.test.ts

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

const SRC_ROOT = resolvePath(fileURLToPath(new URL('../../src', import.meta.url)));
const CANDIDATE_SUFFIXES = ['.ts', '.tsx', '.js', '/index.ts', '/index.tsx'];

/** Eerste bestaande variant van `basePath` met een van de bekende suffixen. */
function firstExisting(basePath) {
    if (existsSync(basePath) && !existsSync(`${basePath}/`)) return basePath;
    for (const suffix of CANDIDATE_SUFFIXES) {
        const candidate = `${basePath}${suffix}`;
        if (existsSync(candidate)) return candidate;
    }
    return undefined;
}

registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@/')) {
            const found = firstExisting(resolvePath(SRC_ROOT, specifier.slice(2)));
            if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
        }

        if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
            const parentDir = dirname(fileURLToPath(context.parentURL));
            const found = firstExisting(resolvePath(parentDir, specifier));
            if (found) return { url: pathToFileURL(found).href, shortCircuit: true };
        }

        return nextResolve(specifier, context);
    },
});
