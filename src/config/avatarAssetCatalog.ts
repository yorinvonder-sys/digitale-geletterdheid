import type { AvatarConfig } from '@/types';

export const AVATAR_ASSET_ROOT = '/assets/avatar/v1';

export type AvatarAssetType = 'baseModel' | 'hairStyle' | 'shirtStyle' | 'pantsStyle' | 'accessory' | 'pet';

type AvatarAssetSection = 'base' | 'hair' | 'shirts' | 'pants' | 'accessories' | 'pets';

type AvatarAssetCompatibility = {
    layers: readonly string[];
    compatibleWith: readonly string[];
    riskCombos: readonly string[];
};

type AvatarAssetEntry = {
    model: string;
    thumbnail: string;
    thumbnailSource: 'same-procedural-asset-kit';
    colorSlots: readonly string[];
    visualCues: readonly string[];
    compatibility: AvatarAssetCompatibility;
    acceptanceChecks: readonly string[];
};

type AvatarAssetPart = { key: string; type: AvatarAssetType; value: string; path: string };

type AvatarAssetCatalog = Record<AvatarAssetType, Record<string, AvatarAssetEntry>>;

const CONFIGURABLE_COLOR_SLOTS = ['skin', 'shirt', 'pants', 'hair', 'shoes', 'accessory', 'glass', 'accent'] as const;

const ACCEPTANCE_CHECKS = ['recognizable-silhouette', 'color-slots', 'thumbnail-matches-asset', 'no-known-flicker-risk', 'front-three-quarter-readable'] as const;

const VISUAL_CUE_LIBRARY: Record<AvatarAssetSection, Record<string, readonly string[]>> = {
    base: {
        standard: ['round friendly head', 'wide torso proportions', 'visible face features'],
        slim: ['round friendly head', 'narrow sporty torso', 'visible face features'],
        robot: ['metal head shell', 'glowing cyan eyes', 'top antenna'],
    },
    hair: {
        short: ['front hair fringe', 'low rounded hair cap', 'forehead remains visible'],
        pigtails: ['two side hair bundles', 'rounded hair cap', 'balanced left-right silhouette'],
        spiky: ['four raised hair spikes', 'sharp top silhouette', 'forehead remains visible'],
        messy: ['asymmetric hair tufts', 'uneven top silhouette', 'front stray locks'],
        long: ['long side hair panels', 'hair drops below ears', 'rounded top cap'],
        bob: ['short side hair panels', 'chin-length bob outline', 'rounded top cap'],
        fade: ['low translucent fade layer', 'short top block', 'forehead remains visible'],
        curls: ['clustered curl bumps', 'rounded volume around head', 'side curls visible'],
        ponytail: ['rear ponytail extension', 'rounded hair cap', 'hair mass visible behind head'],
        braids: ['two hanging braids', 'side braid symmetry', 'rounded top cap'],
        buzzcut: ['thin scalp-hugging hair layer', 'low opacity cap', 'head shape remains readable'],
        mohawk: ['central vertical crest', 'narrow side profile', 'raised top silhouette'],
        afro: ['large rounded volume', 'clustered side puffs', 'oversized silhouette'],
        bun: ['top rear bun sphere', 'rounded hair cap', 'updo silhouette'],
        sidepart: ['angled front part', 'swept fringe', 'clean side-part stripe'],
    },
    shirts: {
        't-shirt': ['short sleeve torso', 'simple crew body shape', 'hands remain visible'],
        hoodie: ['raised hood behind neck', 'front pocket patch', 'drawstrings visible'],
        varsity: ['white chest stripes', 'contrast sleeve/body look', 'front letter patch'],
        polo: ['white collar tab', 'button detail', 'short sleeve torso'],
        tank: ['open shoulder straps', 'sleeveless torso', 'hands remain visible'],
        sweater: ['knit horizontal bands', 'soft wide torso', 'long sleeves'],
        flannel: ['vertical plaid lines', 'horizontal plaid lines', 'shirt grid readable'],
        denim: ['center seam stripe', 'front pocket patches', 'jacket structure'],
        jersey: ['number block detail', 'sport shirt shape', 'short sleeve torso'],
        trackjacket: ['center zipper', 'white sleeve stripes', 'athletic jacket silhouette'],
        leather: ['dark glossy jacket body', 'gold lapel lines', 'structured shoulders'],
        bomber: ['ribbed waist cuff', 'center zipper', 'rounded bomber body'],
        blazer: ['lapel panels', 'white shirt insert', 'formal center tie area'],
        puffer: ['horizontal padded ribs', 'center zipper', 'wide quilted body'],
        kimono: ['crossed wrap lines', 'waist sash', 'wide robe body'],
        suit_diamond: ['formal lapels', 'center tie', 'cyan diamond brooch'],
    },
    pants: {
        standard: ['straight pant legs', 'visible dark shoes', 'grounded stance'],
        chinos: ['light belt line', 'straight pant legs', 'visible shoes'],
        shorts: ['short leg length', 'skin visible below hem', 'visible shoes'],
        joggers: ['cuffed ankles', 'soft athletic legs', 'visible shoes'],
        cargo: ['side cargo pockets', 'wide utility legs', 'visible shoes'],
        skinny: ['narrow tapered legs', 'slim silhouette', 'visible shoes'],
        ripped: ['skin tear patches', 'distressed pant legs', 'visible shoes'],
        baggy: ['wide loose legs', 'low bulky cuffs', 'visible shoes'],
        sweatpants: ['soft cuff lines', 'relaxed pant body', 'visible shoes'],
        formal: ['pressed crease lines', 'belt line', 'straight dress legs'],
        skirt: ['single flared skirt shape', 'skin legs below hem', 'grounded shoes'],
        pleated: ['vertical pleat stripes', 'flared skirt shape', 'skin legs below hem'],
    },
    accessories: {
        none: ['intentionally empty accessory slot', 'no visible geometry', 'does not block base avatar'],
        cap: ['rounded cap crown', 'front brim', 'headwear sits above hairline'],
        glasses: ['two clear lenses', 'bridge between lenses', 'thin side arms'],
        sunglasses: ['dark lenses', 'bridge between lenses', 'thin side arms'],
        headphones: ['headband arc', 'left and right ear cups', 'headwear clears face'],
        earbuds: ['small white ear pieces', 'left and right symmetry', 'minimal head footprint'],
        backpack: ['rear bag body', 'two front straps', 'top pocket panel'],
        satchel: ['diagonal shoulder strap', 'side bag body', 'front flap line'],
        skateboard: ['long board deck', 'two dark wheels', 'angled ground prop'],
        beanie: ['soft cap dome', 'lower ribbed band', 'hair compression compatible'],
        bandana: ['forehead band strip', 'side tie tail', 'headwear sits low'],
        crown: ['gold crown band', 'three crown spikes', 'top jewel accent'],
        halo: ['glowing ring above head', 'thin floating band', 'head remains unobscured'],
        watch: ['wrist band', 'round watch face', 'arm-mounted placement'],
        smartwatch: ['dark wrist band', 'cyan screen face', 'arm-mounted placement'],
        necklace: ['neck arc chain', 'center pendant', 'rests above shirt'],
        chain: ['gold dashed chain arc', 'center pendant', 'rests above shirt'],
        scarf: ['neck wrap tube', 'hanging scarf tail', 'warm body accessory'],
        bowtie: ['two bow triangles', 'center knot', 'neck placement'],
        tie: ['long vertical tie', 'collar knot', 'formal neck placement'],
        guitar: ['round guitar body', 'long neck', 'diagonal body placement'],
        wings: ['left wing panel', 'right wing panel', 'rear body placement'],
        cape: ['large rear cape panel', 'shoulder attachment line', 'extends behind legs'],
        sword: ['long blade', 'gold crossguard', 'side hand placement'],
        shield: ['front shield plate', 'cross emblem', 'side arm placement'],
        pet_cat: ['cat head ears', 'small side pet body', 'eyes visible'],
        pet_dog: ['dog ear shapes', 'small side pet body', 'eyes visible'],
        robot_arm: ['metal forearm tube', 'cyan joint light', 'side arm replacement'],
        crown_gold: ['gold crown band', 'three crown spikes', 'cyan jewel accent'],
        jetpack: ['dual rear tanks', 'nozzle cones', 'orange flame exhaust'],
        wings_cyber: ['cyan translucent wings', 'left-right symmetry', 'tech vein lines'],
        pet_robo: ['boxy robot pet body', 'cyan robot eyes', 'metal head plate'],
    },
    pets: {
        none: ['intentionally empty pet slot', 'no visible geometry', 'does not duplicate accessory pet'],
        pet_dog: ['dog ear shapes', 'small grounded body', 'eyes visible'],
        pet_cat: ['cat triangular ears', 'small grounded body', 'eyes visible'],
        pet_robo: ['boxy robot pet body', 'cyan robot eyes', 'metal legs'],
    },
};

const visualCuesFor = (section: AvatarAssetSection, value: string): readonly string[] =>
    VISUAL_CUE_LIBRARY[section]?.[value] ?? [`${section}:${value} distinct avatar asset`, `${section}:${value} readable color slot`, `${section}:${value} thumbnail parity`];

const compatibilityFor = (section: AvatarAssetSection, value: string): AvatarAssetCompatibility => {
    if (section === 'hair') {
        return { layers: ['head', 'hair'], compatibleWith: ['baseModel', 'accessory'], riskCombos: ['cap/beanie compression', 'glasses face clearance'] };
    }
    if (section === 'shirts') {
        return { layers: ['torso', 'arms'], compatibleWith: ['baseModel', 'pantsStyle', 'accessory'], riskCombos: ['cape/wings rear overlap', 'neck accessory front overlap'] };
    }
    if (section === 'pants') {
        return { layers: ['legs', 'shoes'], compatibleWith: ['baseModel', 'shirtStyle', 'pet'], riskCombos: ['pet grounding', 'skirt leg visibility'] };
    }
    if (section === 'pets') {
        return { layers: ['ground', 'sidecar-pet'], compatibleWith: ['baseModel', 'pantsStyle'], riskCombos: ['duplicate pet accessory hidden by renderer', 'ground contact'] };
    }
    if (section === 'accessories') {
        const headwear = ['cap', 'beanie', 'bandana', 'crown', 'crown_gold', 'halo', 'headphones', 'earbuds', 'glasses', 'sunglasses'];
        const rearBody = ['backpack', 'satchel', 'cape', 'wings', 'wings_cyber', 'jetpack', 'guitar', 'skateboard'];
        return {
            layers: headwear.includes(value) ? ['head', 'accessory'] : rearBody.includes(value) ? ['torso', 'rear-accessory'] : ['torso', 'front-accessory'],
            compatibleWith: ['baseModel', 'hairStyle', 'shirtStyle', 'pantsStyle'],
            riskCombos: [
                ...(headwear.includes(value) ? ['hair clipping', 'face clearance'] : []),
                ...(rearBody.includes(value) ? ['rear body overlap', 'camera visibility'] : []),
            ],
        };
    }
    return { layers: ['base', 'head', 'face'], compatibleWith: ['hairStyle', 'shirtStyle', 'pantsStyle', 'accessory', 'pet'], riskCombos: value === 'robot' ? ['human hair over metal head'] : [] };
};

const onlyConfigurable = (slots: readonly string[]): readonly (typeof CONFIGURABLE_COLOR_SLOTS)[number][] =>
    slots.filter((slot): slot is (typeof CONFIGURABLE_COLOR_SLOTS)[number] =>
        CONFIGURABLE_COLOR_SLOTS.includes(slot as (typeof CONFIGURABLE_COLOR_SLOTS)[number])
    );

const colorSlotsFor = (section: AvatarAssetSection, value: string): readonly string[] => {
    if (value === 'none') return [];

    if (section === 'base') {
        return value === 'robot'
            ? ['glass', 'accent']
            : ['skin', 'accessory'];
    }

    if (section === 'hair') {
        const accentHair = ['pigtails', 'ponytail', 'braids', 'bun', 'sidepart'];
        return accentHair.includes(value) ? ['hair', 'accent'] : ['hair'];
    }

    if (section === 'shirts') {
        const slots = ['shirt', 'skin'];
        if (['hoodie', 'varsity', 'flannel', 'denim', 'bomber', 'puffer', 'kimono'].includes(value)) slots.push('accent');
        if (value === 'suit_diamond') slots.push('glass');
        if (value === 'leather') slots.push('accessory');
        return onlyConfigurable(slots);
    }

    if (section === 'pants') {
        const slots = ['pants', 'shoes'];
        if (['shorts', 'skirt', 'pleated', 'ripped'].includes(value)) slots.push('skin');
        if (['standard', 'chinos', 'shorts', 'joggers', 'cargo', 'sweatpants', 'formal', 'skirt', 'pleated', 'ripped'].includes(value)) slots.push('accent');
        return onlyConfigurable(slots);
    }

    if (section === 'pets') {
        if (value === 'pet_robo') return ['glass'];
        return value === 'pet_cat' ? ['accessory'] : ['accent', 'hair', 'accessory'];
    }

    if (section === 'accessories') {
        const slots = ['accessory'];
        if (['glasses', 'jetpack', 'wings_cyber', 'pet_robo', 'robot_arm', 'smartwatch', 'crown_gold'].includes(value)) slots.push('glass');
        if (['backpack', 'beanie', 'chain', 'headphones', 'cape', 'shield', 'jetpack', 'wings', 'wings_cyber', 'pet_dog'].includes(value)) slots.push('accent');
        if (['sword', 'shield', 'robot_arm', 'jetpack'].includes(value)) slots.push('glass');
        if (['guitar', 'pet_dog'].includes(value)) slots.push('hair');
        if (['pet_dog', 'pet_cat'].includes(value)) slots.push('black');
        return onlyConfigurable(slots);
    }

    return [];
};

const makeEntry = (section: AvatarAssetSection, value: string): AvatarAssetEntry => ({
    model: `${AVATAR_ASSET_ROOT}/models/${section}/${value}.glb`,
    thumbnail: `${AVATAR_ASSET_ROOT}/thumbnails/${section}/${value}.webp`,
    thumbnailSource: 'same-procedural-asset-kit',
    colorSlots: colorSlotsFor(section, value),
    visualCues: visualCuesFor(section, value),
    compatibility: compatibilityFor(section, value),
    acceptanceChecks: ACCEPTANCE_CHECKS,
});

const entries = <T extends readonly string[]>(section: AvatarAssetSection, values: T) =>
    Object.fromEntries(values.map(value => [value, makeEntry(section, value)])) as Record<T[number], AvatarAssetEntry>;

export const avatarAssetCatalog = {
    baseModel: entries('base', ['standard', 'slim', 'robot'] as const),
    hairStyle: entries('hair', ['short', 'pigtails', 'spiky', 'messy', 'long', 'bob', 'fade', 'curls', 'ponytail', 'braids', 'buzzcut', 'mohawk', 'afro', 'bun', 'sidepart'] as const),
    shirtStyle: entries('shirts', ['t-shirt', 'hoodie', 'varsity', 'polo', 'tank', 'sweater', 'flannel', 'denim', 'jersey', 'trackjacket', 'leather', 'bomber', 'blazer', 'puffer', 'kimono', 'suit_diamond'] as const),
    pantsStyle: entries('pants', ['standard', 'chinos', 'shorts', 'joggers', 'cargo', 'skinny', 'ripped', 'baggy', 'sweatpants', 'formal', 'skirt', 'pleated'] as const),
    accessory: entries('accessories', ['none', 'cap', 'glasses', 'sunglasses', 'headphones', 'earbuds', 'backpack', 'satchel', 'skateboard', 'beanie', 'bandana', 'crown', 'halo', 'watch', 'smartwatch', 'necklace', 'chain', 'scarf', 'bowtie', 'tie', 'guitar', 'wings', 'cape', 'sword', 'shield', 'pet_cat', 'pet_dog', 'robot_arm', 'crown_gold', 'jetpack', 'wings_cyber', 'pet_robo'] as const),
    pet: entries('pets', ['none', 'pet_dog', 'pet_cat', 'pet_robo'] as const),
} satisfies AvatarAssetCatalog;

export const AVATAR_ASSET_TYPES = Object.keys(avatarAssetCatalog) as AvatarAssetType[];
const SUPPORTED_EXPRESSIONS = ['neutral', 'happy', 'cool', 'surprised'] as const;
const SUPPORTED_RENDERED_SHOP_TYPES = new Set<string>([
    ...AVATAR_ASSET_TYPES,
    'gender',
    'skinColor',
    'shirtColor',
    'pantsColor',
    'expression',
]);

export const getAvatarAsset = (type: string, value: string | undefined): AvatarAssetEntry | undefined => {
    if (!value || !(type in avatarAssetCatalog)) return undefined;
    return avatarAssetCatalog[type as AvatarAssetType][value];
};

export const getAvatarAssetPath = (type: string, value: string | undefined): string | undefined =>
    getAvatarAsset(type, value)?.model;

export const getAvatarShopThumbnail = (type: string, value: string | undefined): string | undefined =>
    getAvatarAsset(type, value)?.thumbnail;

export const hasAvatarAsset = (type: string, value: string | undefined): boolean =>
    Boolean(getAvatarAsset(type, value));

export const getShopItemsWithAvatarAssets = <T extends { type: string; value: string }>(items: T[]): T[] =>
    items.filter(item => {
        if (item.type === 'pose') return false;
        if (item.type === 'expression') return SUPPORTED_EXPRESSIONS.includes(item.value as typeof SUPPORTED_EXPRESSIONS[number]);
        if (item.type in avatarAssetCatalog) return hasAvatarAsset(item.type, item.value);
        return SUPPORTED_RENDERED_SHOP_TYPES.has(item.type);
    });

export const getAvatarAssetParts = (config: AvatarConfig) => {
    const accessory = config.accessory ?? 'none';
    const pet = config.pet ?? 'none';

    const parts: Array<{ key: string; type: AvatarAssetType; value: string }> = [
        { key: `base-${config.baseModel}`, type: 'baseModel', value: config.baseModel },
        { key: `shirt-${config.shirtStyle ?? 't-shirt'}`, type: 'shirtStyle', value: config.shirtStyle ?? 't-shirt' },
        { key: `pants-${config.pantsStyle ?? 'standard'}`, type: 'pantsStyle', value: config.pantsStyle ?? 'standard' },
        { key: `hair-${config.hairStyle}`, type: 'hairStyle', value: config.hairStyle },
    ];

    if (accessory !== 'none') {
        parts.push({ key: `accessory-${accessory}`, type: 'accessory', value: accessory });
    }

    if (pet !== 'none' && pet !== accessory) {
        parts.push({ key: `pet-${pet}`, type: 'pet', value: pet });
    }

    return parts
        .map(part => ({ ...part, path: getAvatarAssetPath(part.type, part.value) }))
        .filter((part): part is AvatarAssetPart => Boolean(part.path));
};

export const getAvatarPreloadPaths = (config: AvatarConfig): string[] =>
    getAvatarAssetParts(config).map(part => part.path);

export const AVATAR_QA_PRESETS: Array<{ key: string; label: string; category: 'base' | 'hair' | 'clothes' | 'accessories' | 'pets' | 'risk'; config: AvatarConfig }> = [
    {
        key: 'base-standard',
        label: 'Basis - Standaard',
        category: 'base',
        config: {
            baseModel: 'standard',
            skinColor: '#f5d0b0',
            shirtColor: '#D97848',
            pantsColor: '#08283B',
            hairStyle: 'short',
            hairColor: '#3D2314',
            accessory: 'none',
            pet: 'none',
            gender: 'male',
        },
    },
    {
        key: 'base-slim',
        label: 'Basis - Sportief',
        category: 'base',
        config: {
            baseModel: 'slim',
            skinColor: '#d18a6a',
            shirtColor: '#5F947D',
            pantsColor: '#0B453F',
            hairStyle: 'pigtails',
            hairColor: '#08283B',
            accessory: 'none',
            pet: 'none',
            gender: 'female',
        },
    },
    {
        key: 'risk-headwear',
        label: 'Risico - Haar + hoofddeksel',
        category: 'risk',
        config: {
            baseModel: 'standard',
            skinColor: '#a0522d',
            shirtColor: '#5F947D',
            pantsColor: '#08283B',
            hairStyle: 'curls',
            hairColor: '#1A1A1A',
            accessory: 'beanie',
            accessoryColor: '#D97848',
            pet: 'pet_dog',
            gender: 'male',
        },
    },
    {
        key: 'risk-body-accessories',
        label: 'Risico - Cape + pet',
        category: 'risk',
        config: {
            baseModel: 'slim',
            skinColor: '#ffe0bd',
            shirtColor: '#D7C95F',
            pantsColor: '#445865',
            hairStyle: 'bun',
            hairColor: '#3D2314',
            accessory: 'cape',
            accessoryColor: '#D97848',
            pet: 'pet_cat',
            gender: 'female',
        },
    },
    {
        key: 'premium-cyber',
        label: 'Premium - Cyber kit',
        category: 'accessories',
        config: {
            baseModel: 'robot',
            skinColor: '#C0C0C0',
            shirtColor: '#0B453F',
            pantsColor: '#08283B',
            hairStyle: 'buzzcut',
            hairColor: '#1A1A1A',
            accessory: 'jetpack',
            accessoryColor: '#5F947D',
            pet: 'pet_robo',
            gender: 'male',
        },
    },
];
