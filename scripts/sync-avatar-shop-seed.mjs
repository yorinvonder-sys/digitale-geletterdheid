#!/usr/bin/env node
/**
 * Houdt de SQL-prijzenlijst gelijk aan de TypeScript-catalogus.
 *
 * De TypeScript-catalogus (src/config/avatarCatalog.ts) is de bron van
 * waarheid: daar staan ook labels, iconen en zeldzaamheid die de UI nodig
 * heeft. De database heeft alleen de prijs nodig, maar die moet er wél staan —
 * anders zou de aankoop-functie de prijs van de client moeten geloven.
 *
 *   node scripts/sync-avatar-shop-seed.mjs           # genereert de migratie
 *   node scripts/sync-avatar-shop-seed.mjs --check   # faalt bij drift (CI)
 *
 * Prijswijzigingen horen in een NIEUWE migratie: dit script herschrijft de
 * bestaande seed, dus draai het en commit het resultaat onder een nieuwe datum
 * wanneer prijzen wijzigen.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import ts from 'typescript';

const CATALOG_SRC = 'src/config/avatarCatalog.ts';
const SEED_PATH = 'supabase/migrations/20260802090100_avatar_shop_catalogue_seed.sql';

/** Laadt de catalogus door de TypeScript in het geheugen te transpileren.
 *  `@/types` wordt gestubd: de catalogusdata hangt er niet van af. */
function loadCatalogue() {
    const source = readFileSync(CATALOG_SRC, 'utf8');
    const js = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;

    const module = { exports: {} };
    const stubRequire = (id) => {
        if (id === '@/types') return { DEFAULT_AVATAR_CONFIG: {} };
        throw new Error(`Onverwachte import in ${CATALOG_SRC}: ${id}`);
    };
    new Function('exports', 'require', 'module', js)(module.exports, stubRequire, module);

    const catalogue = module.exports.AVATAR_CATALOG;
    if (!Array.isArray(catalogue) || catalogue.length === 0) {
        throw new Error('AVATAR_CATALOG is leeg of ontbreekt');
    }
    return catalogue;
}

const sqlText = (value) =>
    value === undefined || value === null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`;

function buildSeed(catalogue) {
    const rows = catalogue.map((item, index) => {
        if (!/^[a-z0-9_]{1,64}$/.test(item.id)) {
            throw new Error(`Ongeldige item-id (alleen a-z, 0-9, _): ${item.id}`);
        }
        return `  (${sqlText(item.id)}, ${sqlText(item.slot)}, ${sqlText(item.value)}, ` +
            `${sqlText(item.label)}, ${item.price}, ${sqlText(item.gender)}, ${index})`;
    });

    return `-- GEGENEREERD DOOR scripts/sync-avatar-shop-seed.mjs — NIET MET DE HAND BEWERKEN.
-- Bron: ${CATALOG_SRC}
--
-- Alleen de prijs is hier gezaghebbend. Labels staan erbij zodat een beheerder
-- in de database kan zien wat een id voorstelt; de UI leest ze uit TypeScript.

INSERT INTO public.avatar_shop_items (id, slot, value, label, price, gender, sort_order) VALUES
${rows.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  slot       = EXCLUDED.slot,
  value      = EXCLUDED.value,
  label      = EXCLUDED.label,
  price      = EXCLUDED.price,
  gender     = EXCLUDED.gender,
  sort_order = EXCLUDED.sort_order,
  is_active  = true,
  updated_at = now();

-- Items die uit de catalogus verdwenen zijn worden gedeactiveerd, nooit
-- verwijderd: leerlingen kunnen ze bezitten en dat bezit moet blijven kloppen.
UPDATE public.avatar_shop_items
   SET is_active = false, updated_at = now()
 WHERE id <> ALL (ARRAY[${catalogue.map(i => sqlText(i.id)).join(', ')}]);
`;
}

const catalogue = loadCatalogue();
const expected = buildSeed(catalogue);
const isCheck = process.argv.includes('--check');

if (isCheck) {
    if (!existsSync(SEED_PATH)) {
        console.error(`Seed-migratie ontbreekt: ${SEED_PATH}\nDraai: node scripts/sync-avatar-shop-seed.mjs`);
        process.exit(1);
    }
    if (readFileSync(SEED_PATH, 'utf8') !== expected) {
        console.error(
            'Avatar-winkel: de SQL-prijzenlijst loopt uit de pas met de TypeScript-catalogus.\n' +
            'Draai: node scripts/sync-avatar-shop-seed.mjs en commit het resultaat.'
        );
        process.exit(1);
    }
    console.log(`Avatar-winkel-catalogus in sync (${catalogue.length} items, ${catalogue.filter(i => i.price > 0).length} betaald).`);
} else {
    writeFileSync(SEED_PATH, expected);
    console.log(`Seed geschreven: ${SEED_PATH} (${catalogue.length} items).`);
}
