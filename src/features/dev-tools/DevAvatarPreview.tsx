import React, { useMemo, useState } from 'react';
import { AvatarStage } from '@/features/profile/avatar/AvatarStage';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '@/types';
import { AVATAR_QA_PRESETS, avatarAssetCatalog, getAvatarShopThumbnail } from '@/config/avatarAssetCatalog';

/** Dev-only preview voor avatar QA. Verwijder voor productie. */

type PreviewCategory = 'base' | 'hair' | 'clothes' | 'pants' | 'accessories' | 'pets' | 'risk';

const QA_CATEGORIES = ['base', 'hair', 'clothes', 'pants', 'accessories', 'pets', 'risk'] as const satisfies readonly PreviewCategory[];

type PreviewPreset = {
    key: string;
    label: string;
    category: PreviewCategory;
    config: AvatarConfig;
    assetType?: string;
    assetValue?: string;
};

const baseConfig = (gender: AvatarConfig['gender'] = 'male'): AvatarConfig => ({
    ...DEFAULT_AVATAR_CONFIG,
    gender,
    baseModel: gender === 'female' ? 'slim' : 'standard',
    hairStyle: gender === 'female' ? 'pigtails' : 'short',
    hairColor: gender === 'female' ? '#08283B' : '#3D2314',
    shirtColor: gender === 'female' ? '#D97848' : '#5F947D',
    pantsColor: gender === 'female' ? '#445865' : '#08283B',
    shoeColor: '#08283B',
    accessory: 'none',
    pet: 'none',
});

const labelize = (value: string) => value
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

const toPreset = (
    category: PreviewCategory,
    assetType: keyof typeof avatarAssetCatalog,
    value: string,
    configPatch: Partial<AvatarConfig>
): PreviewPreset => ({
    key: `${category}-${value}`,
    label: `${labelize(category)} - ${labelize(value)}`,
    category,
    assetType,
    assetValue: value,
    config: {
        ...baseConfig(category === 'hair' && ['pigtails', 'long', 'bob', 'ponytail', 'braids', 'bun'].includes(value) ? 'female' : 'male'),
        ...configPatch,
    },
});

const FLOW_REVIEW_CONFIGS = {
    setup: {
        ...baseConfig('female'),
        hairStyle: 'curls',
        hairColor: '#3D2314',
        shirtStyle: 'hoodie',
        shirtColor: '#D97848',
        pantsStyle: 'joggers',
        pantsColor: '#445865',
        accessory: 'glasses',
        accessoryColor: '#D7C95F',
        pet: 'none',
    },
    profile: {
        ...baseConfig('male'),
        hairStyle: 'sidepart',
        shirtStyle: 'varsity',
        shirtColor: '#5F947D',
        pantsStyle: 'chinos',
        accessory: 'headphones',
        accessoryColor: '#D97848',
        pet: 'pet_dog',
    },
    purchase: {
        ...baseConfig('female'),
        hairStyle: 'bun',
        shirtStyle: 'puffer',
        shirtColor: '#D7C95F',
        pantsStyle: 'pleated',
        pantsColor: '#0B453F',
        accessory: 'wings_cyber',
        accessoryColor: '#5F947D',
        pet: 'pet_robo',
    },
} satisfies Record<string, AvatarConfig>;

const FLOW_SHOP_ITEMS = [
    { type: 'hairStyle', value: 'curls', label: 'Krullen' },
    { type: 'shirtStyle', value: 'hoodie', label: 'Hoodie' },
    { type: 'pantsStyle', value: 'joggers', label: 'Joggers' },
    { type: 'accessory', value: 'glasses', label: 'Bril' },
    { type: 'accessory', value: 'headphones', label: 'Koptelefoon' },
    { type: 'accessory', value: 'backpack', label: 'Rugzak' },
    { type: 'shirtStyle', value: 'puffer', label: 'Puffer' },
    { type: 'accessory', value: 'wings_cyber', label: 'Cybervleugels' },
] as const;

const EXPRESSION_QA_PRESETS: PreviewPreset[] = [
    {
        key: 'expression-neutral',
        label: 'Expression - Neutral',
        category: 'risk',
        assetType: 'expression',
        assetValue: 'neutral',
        config: { ...baseConfig('female'), expression: 'neutral', hairStyle: 'curls', accessory: 'glasses', accessoryColor: '#D7C95F' },
    },
    {
        key: 'expression-happy',
        label: 'Expression - Happy',
        category: 'risk',
        assetType: 'expression',
        assetValue: 'happy',
        config: { ...baseConfig('female'), expression: 'happy', hairStyle: 'curls', accessory: 'glasses', accessoryColor: '#D7C95F' },
    },
    {
        key: 'expression-cool',
        label: 'Expression - Cool',
        category: 'risk',
        assetType: 'expression',
        assetValue: 'cool',
        config: { ...baseConfig('female'), expression: 'cool', hairStyle: 'sidepart', accessory: 'none', accessoryColor: '#D7C95F' },
    },
    {
        key: 'expression-surprised',
        label: 'Expression - Surprised',
        category: 'risk',
        assetType: 'expression',
        assetValue: 'surprised',
        config: { ...baseConfig('female'), expression: 'surprised', hairStyle: 'curls', accessory: 'glasses', accessoryColor: '#D7C95F' },
    },
];

const GENERATED_PRESETS: PreviewPreset[] = [
    ...Object.keys(avatarAssetCatalog.baseModel).map(value => toPreset('base', 'baseModel', value, { baseModel: value as AvatarConfig['baseModel'] })),
    ...Object.keys(avatarAssetCatalog.hairStyle).map(value => toPreset('hair', 'hairStyle', value, { hairStyle: value as AvatarConfig['hairStyle'] })),
    ...Object.keys(avatarAssetCatalog.shirtStyle).map(value => toPreset('clothes', 'shirtStyle', value, { shirtStyle: value as AvatarConfig['shirtStyle'] })),
    ...Object.keys(avatarAssetCatalog.pantsStyle).map(value => toPreset('pants', 'pantsStyle', value, { pantsStyle: value as AvatarConfig['pantsStyle'] })),
    ...EXPRESSION_QA_PRESETS,
    ...Object.keys(avatarAssetCatalog.accessory)
        .filter(value => value !== 'none')
        .map(value => toPreset('accessories', 'accessory', value, { accessory: value as AvatarConfig['accessory'], accessoryColor: value.includes('crown') ? '#D7C95F' : '#D97848' })),
    ...Object.keys(avatarAssetCatalog.pet)
        .filter(value => value !== 'none')
        .map(value => toPreset('pets', 'pet', value, { pet: value as AvatarConfig['pet'] })),
    ...AVATAR_QA_PRESETS.map(preset => ({
        key: `qa-${preset.key}`,
        label: preset.label,
        category: preset.category === 'base' ? 'base' : preset.category === 'hair' ? 'hair' : preset.category === 'clothes' ? 'clothes' : preset.category === 'pets' ? 'pets' : preset.category === 'accessories' ? 'accessories' : 'risk',
        config: preset.config,
    } satisfies PreviewPreset)),
];

const SECTION_COPY: Record<PreviewCategory, { title: string; description: string }> = {
    base: {
        title: 'Basislichamen',
        description: 'Controleer hoofd, huid, robotdetails en body proportions.',
    },
    hair: {
        title: 'Kapsels',
        description: 'Controleer silhouette, clipping met hoofd en kleurkanaal.',
    },
    clothes: {
        title: 'Bovenkleding',
        description: 'Controleer kledingdetails, mouwen, handen en kleurkanalen.',
    },
    pants: {
        title: 'Broeken & schoenen',
        description: 'Controleer beenvormen, rokken, schoenen en grounding.',
    },
    accessories: {
        title: 'Accessoires',
        description: 'Controleer hoofd- en body-accessoires op zichtbaarheid en schaal.',
    },
    pets: {
        title: 'Pets',
        description: 'Controleer grounding, positie naast avatar en dubbele pet-logica.',
    },
    risk: {
        title: 'Risicocombinaties',
        description: 'Controleer combinaties met de meeste kans op clipping of flikkering.',
    },
};

const getInitialPresetKey = (): string => {
    const fallbackKey = GENERATED_PRESETS[0]?.key ?? '';
    if (typeof window === 'undefined') return fallbackKey;

    const searchParams = new URLSearchParams(window.location.search);
    const presetKey = searchParams.get('preset');
    return presetKey && GENERATED_PRESETS.some(preset => preset.key === presetKey)
        ? presetKey
        : fallbackKey;
};

const PreviewCard = ({
    preset,
    selected,
    onSelect,
}: {
    preset: PreviewPreset;
    selected: boolean;
    onSelect: () => void;
}) => {
    const thumbnail = preset.assetType && preset.assetValue
        ? getAvatarShopThumbnail(preset.assetType, preset.assetValue)
        : getAvatarShopThumbnail('baseModel', preset.config.baseModel);

    return (
        <button
            type="button"
            onClick={onSelect}
            data-avatar-qa-preset-card
            data-avatar-qa-preset-key={preset.key}
            data-avatar-qa-asset-type={preset.assetType ?? 'qa-preset'}
            data-avatar-qa-asset-value={preset.assetValue ?? preset.key}
            className={`group rounded-[1.25rem] p-3 text-left transition-all ${selected ? 'scale-[1.02]' : 'hover:-translate-y-1'}`}
            style={{
                backgroundColor: '#FFFFFF',
                border: selected ? '3px solid #D97848' : '1px solid #E7D8BD',
                boxShadow: selected ? '0 18px 36px -18px rgba(217, 120, 72,0.55)' : '0 10px 28px -20px rgba(26,26,25,0.28)',
            }}
        >
            <div className="h-[150px] rounded-[1rem] overflow-hidden" style={{ backgroundColor: '#FCF6EA' }}>
                {thumbnail && <img src={thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />}
            </div>
            <div className="pt-3 px-1">
                <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#D97848' }}>
                    {SECTION_COPY[preset.category].title}
                </div>
                <div className="text-sm font-bold leading-tight mt-1" style={{ color: '#08283B' }}>
                    {preset.label}
                </div>
            </div>
        </button>
    );
};

const FlowSurfaceCard = ({
    surface,
    eyebrow,
    title,
    description,
    children,
}: {
    surface: 'setup' | 'profile' | 'shop' | 'purchase';
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) => (
    <section
        data-avatar-qa-surface={surface}
        className="rounded-[1.25rem] border p-4 md:p-5"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E7D8BD', boxShadow: '0 16px 34px -26px rgba(8,40,59,0.32)' }}
    >
        <div className="mb-4">
            <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: '#D97848' }}>
                {eyebrow}
            </div>
            <h3 className="mt-1 text-xl font-bold leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                {title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: '#445865' }}>
                {description}
            </p>
        </div>
        {children}
    </section>
);

const FlowReviewPanel = () => (
    <section className="space-y-4" data-avatar-qa-flow-grid>
        <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                Leerlingflow QA
            </h2>
            <p className="text-sm mt-1" style={{ color: '#445865' }}>
                Dezelfde visuele bouwstenen gecontroleerd in eerste login, profielpreview, winkel en aankooppreview.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FlowSurfaceCard
                surface="setup"
                eyebrow="Eerste login"
                title="Avatar aanmaken"
                description="Controleert de setup-preview met kapsel, hoodie, bril en kleurkanalen zonder cold-load flits."
            >
                <div className="h-[300px] overflow-hidden rounded-[1rem]" style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}>
                    <AvatarStage config={FLOW_REVIEW_CONFIGS.setup} interactive={false} />
                </div>
            </FlowSurfaceCard>

            <FlowSurfaceCard
                surface="profile"
                eyebrow="Profiel"
                title="Profielpreview"
                description="Controleert een opgeslagen avatar met headwear/body-accessoire en pet in de compacte profielcontext."
            >
                <div className="h-[300px] overflow-hidden rounded-[1rem]" style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}>
                    <AvatarStage config={FLOW_REVIEW_CONFIGS.profile} interactive={false} />
                </div>
            </FlowSurfaceCard>

            <FlowSurfaceCard
                surface="shop"
                eyebrow="Winkel"
                title="Shopgrid thumbnails"
                description="Controleert dat shopkaarten statische asset-thumbnails gebruiken en geen extra live WebGL-canvassen aanmaken."
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {FLOW_SHOP_ITEMS.map(item => {
                        const thumbnail = getAvatarShopThumbnail(item.type, item.value);
                        return (
                            <div key={`${item.type}-${item.value}`} className="rounded-[1rem] border p-2" style={{ borderColor: '#E7D8BD', backgroundColor: '#FCF6EA' }}>
                                <div className="aspect-square overflow-hidden rounded-[0.8rem] bg-white">
                                    {thumbnail && <img src={thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />}
                                </div>
                                <div className="mt-2 truncate text-xs font-bold" style={{ color: '#08283B' }}>
                                    {item.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </FlowSurfaceCard>

            <FlowSurfaceCard
                surface="purchase"
                eyebrow="Aankoop"
                title="Purchase preview"
                description="Controleert een premium combinatie met puffer, cybervleugels, plooirok en robotpet in modalformaat."
            >
                <div className="rounded-[1rem] border p-3" style={{ backgroundColor: '#FCF6EA', borderColor: '#E7D8BD' }}>
                    <div className="h-[260px] overflow-hidden rounded-[0.85rem]" style={{ backgroundColor: '#FCF6EA' }}>
                        <AvatarStage config={FLOW_REVIEW_CONFIGS.purchase} interactive={false} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-[0.85rem] bg-white px-3 py-2">
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: '#D97848' }}>
                                Preview item
                            </div>
                            <div className="text-sm font-bold" style={{ color: '#08283B' }}>
                                Cyber kit combinatie
                            </div>
                        </div>
                        <div className="text-sm font-black" style={{ color: '#0B453F' }}>
                            450 XP
                        </div>
                    </div>
                </div>
            </FlowSurfaceCard>
        </div>
    </section>
);

const DevAvatarPreview: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState(getInitialPresetKey);

    const selectedPreset = useMemo(
        () => GENERATED_PRESETS.find(preset => preset.key === selectedKey) ?? GENERATED_PRESETS[0],
        [selectedKey]
    );

    const groupedPresets = useMemo(() => {
        return GENERATED_PRESETS.reduce<Record<PreviewCategory, PreviewPreset[]>>((groups, preset) => {
            groups[preset.category].push(preset);
            return groups;
        }, {
            base: [],
            hair: [],
            clothes: [],
            pants: [],
            accessories: [],
            pets: [],
            risk: [],
        });
    }, []);

    const handleSelectPreset = (key: string) => {
        setSelectedKey(key);

        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        url.searchParams.set('preset', key);
        window.history.replaceState(null, '', url.toString());
    };

    return (
        <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: '#FCF6EA', color: '#08283B' }}>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Avatar Asset QA Matrix
                    </h1>
                    <p className="text-sm md:text-base max-w-3xl mx-auto" style={{ color: '#445865' }}>
                        Controleer de GLB-assetkit in dezelfde renderer als eerste login, profielpreview en winkelpreview.
                    </p>
                </div>

                <FlowReviewPanel />

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] gap-8 items-start">
                    <div className="space-y-8">
                        {QA_CATEGORIES.map(sectionKey => (
                            <section
                                key={sectionKey}
                                className="space-y-4"
                                data-avatar-qa-category={sectionKey}
                                data-avatar-qa-category-count={groupedPresets[sectionKey].length}
                            >
                                <div>
                                    <h2 className="text-2xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                        {SECTION_COPY[sectionKey].title}
                                    </h2>
                                    <p className="text-sm mt-1" style={{ color: '#445865' }}>
                                        {SECTION_COPY[sectionKey].description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {groupedPresets[sectionKey].map(preset => (
                                        <PreviewCard
                                            key={preset.key}
                                            preset={preset}
                                            selected={selectedPreset?.key === preset.key}
                                            onSelect={() => handleSelectPreset(preset.key)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {selectedPreset && (
                        <aside
                            className="xl:sticky xl:top-6 rounded-[1.5rem] p-5 md:p-6"
                            data-avatar-qa-selected-preset={selectedPreset.key}
                            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 18px 40px -24px rgba(26,26,25,0.35)' }}
                        >
                            <div className="space-y-2 mb-5">
                                <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#D97848' }}>
                                    Focus Review
                                </div>
                                <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    {selectedPreset.label}
                                </h2>
                                <p className="text-sm" style={{ color: '#445865' }}>
                                    De geselecteerde preset rendert met dezelfde `AvatarStage` als de leerlingomgeving.
                                </p>
                            </div>

                            <div
                                className="h-[520px] rounded-[1.25rem] overflow-hidden"
                                data-avatar-qa-focus-stage
                                style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}
                            >
                                <AvatarStage config={selectedPreset.config} interactive={true} />
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DevAvatarPreview;
