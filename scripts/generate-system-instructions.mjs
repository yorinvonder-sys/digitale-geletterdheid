// Genereert supabase/functions/_shared/systemInstructions.ts uit de
// rolinstructies in src/config/agents/.
//
// Waarom: de instructies stonden twee keer. De client had één gedeelde staart
// (SYSTEM_INSTRUCTION_SUFFIX), de server had die staart 84 keer letterlijk
// gedupliceerd. Beide werden met de hand bijgewerkt, dus ze liepen uiteen — en
// wat de leerling werkelijk krijgt komt van de server. Twee fouten kwamen daar
// rechtstreeks uit voort: rollen zonder welzijnsprotocol, en sjabloon-
// opdrachten met instructies over markeringen die hun sjabloon niet opruimt.
//
// Sindsdien is het serverbestand een gegenereerd artefact. Bewerk het niet met
// de hand; pas de rolinstructie aan in src/config/agents/ en draai:
//
//     node scripts/generate-system-instructions.mjs
//
// scripts/check-system-instructions-generated.mjs bewaakt in CI dat het
// bestand in de repo gelijk is aan wat deze generator oplevert.

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT = 'supabase/functions/_shared/systemInstructions.ts';

/**
 * De rolconfiguratie staat in .tsx-bestanden met JSX-iconen en pad-aliassen,
 * dus node kan ze niet rechtstreeks importeren. We transpileren ze naar
 * CommonJS en voeren ze uit met een require die alles buiten src/config/agents/
 * vervangt door een Proxy. Die Proxy dekt zowel `React.createElement` als elk
 * lucide-icoon; alleen de tekstvelden doen er hier toe.
 */
function laadAgentModules() {
    const require = createRequire(join(ROOT, 'package.json'));
    const ts = require('typescript');
    const cache = new Map();

    const stub = new Proxy(function () {}, {
        get: (_t, prop) => (prop === '__esModule' ? true : stub),
        apply: () => null,
        construct: () => ({}),
    });

    function laad(relatiefPad) {
        if (cache.has(relatiefPad)) return cache.get(relatiefPad);
        const bron = readFileSync(join(ROOT, relatiefPad), 'utf8');
        const { outputText } = ts.transpileModule(bron, {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ESNext,
                jsx: ts.JsxEmit.React,
                esModuleInterop: true,
            },
            fileName: relatiefPad,
        });
        const map = { exports: {} };
        const mapPad = relatiefPad.slice(0, relatiefPad.lastIndexOf('/'));
        const lokaleRequire = (specifier) => {
            if (!specifier.startsWith('./')) return stub;
            const basis = `${mapPad}/${specifier.slice(2)}`;
            // Binnen deze map staan zowel .tsx- als .ts-bestanden.
            for (const ext of ['.tsx', '.ts']) {
                try {
                    return laad(basis + ext);
                } catch (fout) {
                    if (fout.code !== 'ENOENT') throw fout;
                }
            }
            throw new Error(`Kan ${specifier} niet vinden vanuit ${relatiefPad}`);
        };
        // Alvast in de cache zodat een cyclus geen oneindige lus wordt.
        cache.set(relatiefPad, map.exports);
        new Function('exports', 'require', 'module', outputText)(map.exports, lokaleRequire, map);
        cache.set(relatiefPad, map.exports);
        return map.exports;
    }

    return {
        agents: laad('src/config/agents/index.tsx'),
        shared: laad('src/config/agents/shared.tsx'),
        serverOnly: laad('src/config/agents/serverOnly.ts'),
        templates: laad('src/config/templateRegistry.ts'),
    };
}

/**
 * Bepaalt of de route van deze rol de interne markeringen opruimt.
 *
 * Sjabloon-opdrachten (alles in templateRegistry) renderen het modelantwoord
 * vrijwel rechtstreeks: ---TIPS--- en ---STEP_COMPLETE:X--- zouden daar
 * letterlijk bij de leerling in beeld staan. De oude AiLab-route verwerkt ze
 * wel — useAgentLogic maakt van de tips klikbare suggesties en haalt de
 * stapmarkering weg — dus daar horen die blokken juist wel thuis.
 */
function verwerktMarkeringen(rolId, templateIds) {
    return !templateIds.has(rolId);
}

/** Bouwt de inhoud van het serverbestand. Schrijft niets. */
export function buildSystemInstructionsFile() {
    const { agents, shared, serverOnly, templates } = laadAgentModules();
    const { ROLES, SYSTEM_INSTRUCTION_SUFFIX } = agents;
    const { buildSystemInstructionSuffix } = shared;
    const templateIds = new Set(Object.keys(templates.TEMPLATE_MISSIONS));

    const regels = [];
    const gezien = new Set();

    const voegToe = (id, kaleInstructie, markeringen) => {
        if (gezien.has(id)) throw new Error(`Rol-id ${id} komt dubbel voor`);
        gezien.add(id);
        const volledig = kaleInstructie + buildSystemInstructionSuffix({ verwerktMarkeringen: markeringen });
        regels.push(`  ${JSON.stringify(id)}: ${JSON.stringify(volledig)},`);
    };

    for (const rol of ROLES) {
        if (!rol.systemInstruction) continue; // Rollen zonder chat krijgen geen serverinstructie.
        const kaal = rol.systemInstruction.endsWith(SYSTEM_INSTRUCTION_SUFFIX)
            ? rol.systemInstruction.slice(0, -SYSTEM_INSTRUCTION_SUFFIX.length)
            : rol.systemInstruction;
        voegToe(rol.id, kaal, verwerktMarkeringen(rol.id, templateIds));
    }

    for (const rol of serverOnly.SERVER_ONLY_ROLES) {
        voegToe(rol.id, rol.instruction, rol.verwerktMarkeringen);
    }

    return `/**
 * Systeeminstructies per rol, server-side.
 *
 * GEGENEREERD BESTAND — BEWERK DIT NIET MET DE HAND.
 * Bron: src/config/agents/ (year1/2/3.tsx, shared.tsx, serverOnly.ts) en
 * src/config/templateRegistry.ts.
 * Opnieuw opbouwen: node scripts/generate-system-instructions.mjs
 * CI bewaakt met: npm run check:system-instructions
 *
 * SECURITY: deze instructies staan alleen server-side. De client stuurt een
 * roleId, de server zoekt de instructie hier op. Zo kan een leerling de
 * AI-instructie niet via DevTools aanpassen.
 */

const SYSTEM_INSTRUCTIONS: Record<string, string> = {
${regels.join('\n')}
};

/**
 * Look up the system instruction for a given role ID.
 * Returns null if the roleId is not recognized.
 */
export function getSystemInstruction(roleId: string): string | null {
  return SYSTEM_INSTRUCTIONS[roleId] ?? null;
}

/**
 * Check if a role ID is valid/known.
 */
export function isValidRoleId(roleId: string): boolean {
  return roleId in SYSTEM_INSTRUCTIONS;
}
`;
}

export const OUTPUT_PATH = OUTPUT;

const draaitAlsScript = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (draaitAlsScript) {
    const inhoud = buildSystemInstructionsFile();
    writeFileSync(join(ROOT, OUTPUT), inhoud);
    const aantal = inhoud.match(/^  "/gm)?.length ?? 0;
    console.log(`${OUTPUT} opnieuw opgebouwd: ${aantal} rollen.`);
}
