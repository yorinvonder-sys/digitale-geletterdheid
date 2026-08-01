import React, { useMemo, useState } from 'react';
import { AvatarViewer } from '@/features/profile/avatar/AvatarViewer';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '@/types';
import { AVATAR_HAIR_CATALOG, getItemsForSlot } from '@/config/avatarCatalog';

/** Dev-only preview voor avatar QA. Verwijder voor productie. */

type PreviewPreset = {
    key: string;
    label: string;
    category: 'hair' | 'pets' | 'headwear';
    config: AvatarConfig;
};

const createBaseConfig = (gender: AvatarConfig['gender']): AvatarConfig => {
    if (gender === 'female') {
        return {
            ...DEFAULT_AVATAR_CONFIG,
            gender: 'female',
            baseModel: 'slim',
            hairStyle: 'pigtails',
            hairColor: '#202023',
            shirtColor: '#ff3c21',
            pantsColor: '#202023',
            expression: 'happy',
            eyeColor: '#202023',
            accessory: 'none',
            pet: 'none',
        };
    }

    return {
        ...DEFAULT_AVATAR_CONFIG,
        gender: 'male',
        baseModel: 'standard',
        hairStyle: 'short',
        hairColor: '#3D2314',
        shirtColor: '#202023',
        pantsColor: '#202023',
        expression: 'cool',
        eyeColor: '#4A3728',
        accessory: 'none',
        pet: 'none',
    };
};

const getHairColorForStyle = (style: AvatarConfig['hairStyle'], gender: AvatarConfig['gender']): string => {
    if (style === 'mohawk') return '#ff3c21';
    if (style === 'afro' || style === 'curls' || style === 'buzzcut') return '#1A1A1A';
    if (style === 'fade') return '#20150F';
    if (style === 'sidepart') return '#4A2A1B';
    if (gender === 'female' && style === 'bob') return '#C2410C';
    return gender === 'female' ? '#202023' : '#3D2314';
};

const HAIR_PRESETS: PreviewPreset[] = AVATAR_HAIR_CATALOG.map(item => ({
    key: item.id,
    label: `${item.gender === 'male' ? 'Jongen' : 'Meisje'} — ${item.label}`,
    category: 'hair',
    config: {
        ...createBaseConfig(item.gender),
        hairStyle: item.value,
        hairColor: getHairColorForStyle(item.value, item.gender),
        expression: item.gender === 'male' ? 'cool' : 'happy',
    },
}));

const PET_PRESETS: PreviewPreset[] = getItemsForSlot('pet', 'male')
    .filter(item => item.value !== 'none')
    .map((item, index) => ({
        key: `pet-${item.value}`,
        label: `Pet QA — ${item.label}`,
        category: 'pets',
        config: {
            ...createBaseConfig('male'),
            hairStyle: index === 0 ? 'spiky' : index === 1 ? 'sidepart' : 'buzzcut',
            hairColor: index === 2 ? '#1A1A1A' : '#3D2314',
            shirtColor: index === 0 ? '#202023' : index === 1 ? '#ff3c21' : '#202023',
            pet: item.value,
            accessory: 'none',
            expression: 'happy',
        },
    }));

const HEADWEAR_PRESETS: PreviewPreset[] = [
    {
        key: 'headwear-fade-cap',
        label: 'Headwear QA — Fade + Cap',
        category: 'headwear',
        config: {
            ...createBaseConfig('male'),
            hairStyle: 'fade',
            hairColor: '#1A1A1A',
            accessory: 'cap',
            shirtColor: '#202023',
            pet: 'pet_dog',
        },
    },
    {
        key: 'headwear-curls-beanie',
        label: 'Headwear QA — Krullen + Muts',
        category: 'headwear',
        config: {
            ...createBaseConfig('female'),
            hairStyle: 'curls',
            hairColor: '#2F211B',
            accessory: 'beanie',
            shirtColor: '#e1ff01',
            pet: 'pet_cat',
            expression: 'surprised',
        },
    },
];

const ALL_PRESETS = [...HAIR_PRESETS, ...PET_PRESETS, ...HEADWEAR_PRESETS];

const getInitialPresetKey = (): string => {
    const fallbackKey = ALL_PRESETS[0]?.key ?? '';
    if (typeof window === 'undefined') return fallbackKey;

    const searchParams = new URLSearchParams(window.location.search);
    const presetKey = searchParams.get('preset');
    return presetKey && ALL_PRESETS.some(preset => preset.key === presetKey)
        ? presetKey
        : fallbackKey;
};

const SECTION_COPY: Record<PreviewPreset['category'], { title: string; description: string }> = {
    hair: {
        title: 'Kapsel QA',
        description: 'Controleer silhouette, haarbanden, clipping en verschillen tussen stijlen.',
    },
    pets: {
        title: 'Pet QA',
        description: 'Controleer grounding, zichtbare poten en kleurconsistentie los van kleding.',
    },
    headwear: {
        title: 'Headwear QA',
        description: 'Controleer cap- en beanie-combinaties op flattening, clipping en halo’s.',
    },
};

const CARD_HEIGHT = 'h-[220px]';

const PreviewCard = ({
    preset,
    selected,
    onSelect,
}: {
    preset: PreviewPreset;
    selected: boolean;
    onSelect: () => void;
}) => (
    <button
        type="button"
        onClick={onSelect}
        className={`group rounded-[1.75rem] p-3 text-left transition-all ${selected ? 'scale-[1.02]' : 'hover:-translate-y-1'}`}
        style={{
            backgroundColor: '#FFFFFF',
            border: selected ? '3px solid #D97848' : '1px solid #E7D8BD',
            boxShadow: selected ? '0 18px 36px -18px rgba(217, 120, 72,0.55)' : '0 10px 28px -20px rgba(26,26,25,0.28)',
        }}
    >
        {/* Geen avatar per kaart: 25+ WebGL-canvassen lopen vast op een Chromebook.
            De kaart vat de configuratie samen; rechts staat de echte 3D-render. */}
        <div className={`${CARD_HEIGHT} rounded-[1.3rem] overflow-hidden flex flex-col justify-center gap-3 p-4`} style={{ backgroundColor: '#f2f1ec' }}>
            <div className="flex flex-wrap gap-2">
                {([
                    ['Huid', preset.config.skinColor],
                    ['Haar', preset.config.hairColor],
                    ['Shirt', preset.config.shirtColor],
                    ['Broek', preset.config.pantsColor],
                ] as const).map(([label, color]) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded" style={{ backgroundColor: color, border: '1px solid rgba(32,32,35,0.15)' }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#445865' }}>{label}</span>
                    </div>
                ))}
            </div>
            <dl className="text-[11px] leading-snug" style={{ color: '#445865' }}>
                <div><dt className="inline font-bold">Kapsel: </dt><dd className="inline">{preset.config.hairStyle}</dd></div>
                <div><dt className="inline font-bold">Accessoire: </dt><dd className="inline">{preset.config.accessory}</dd></div>
                <div><dt className="inline font-bold">Huisdier: </dt><dd className="inline">{preset.config.pet ?? 'none'}</dd></div>
                <div><dt className="inline font-bold">Expressie: </dt><dd className="inline">{preset.config.expression ?? 'neutral'}</dd></div>
            </dl>
        </div>
        <div className="pt-3 px-1">
            <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#ff3c21' }}>
                {SECTION_COPY[preset.category].title}
            </div>
            <div className="text-sm font-bold leading-tight mt-1" style={{ color: '#202023' }}>
                {preset.label}
            </div>
        </div>
    </button>
);

const DevAvatarPreview: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState(getInitialPresetKey);

    const selectedPreset = useMemo(
        () => ALL_PRESETS.find(preset => preset.key === selectedKey) ?? ALL_PRESETS[0],
        [selectedKey]
    );

    const groupedPresets = useMemo(
        () => ({
            hair: HAIR_PRESETS,
            pets: PET_PRESETS,
            headwear: HEADWEAR_PRESETS,
        }),
        []
    );

    const handleSelectPreset = (key: string) => {
        setSelectedKey(key);

        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        url.searchParams.set('preset', key);
        window.history.replaceState(null, '', url.toString());
    };

    return (
        <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: '#f2f1ec', color: '#202023' }}>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Avatar 3D QA Preview
                    </h1>
                    <p className="text-sm md:text-base max-w-3xl mx-auto" style={{ color: '#202023' }}>
                        Dev-only route om alle kapsels, pets en headwear-combinaties visueel te controleren in de echte 3D renderer.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] gap-8 items-start">
                    <div className="space-y-8">
                        {(Object.keys(groupedPresets) as Array<keyof typeof groupedPresets>).map(sectionKey => (
                            <section key={sectionKey} className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                        {SECTION_COPY[sectionKey].title}
                                    </h2>
                                    <p className="text-sm mt-1" style={{ color: '#202023' }}>
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
                        <aside className="xl:sticky xl:top-6 rounded-[2rem] p-5 md:p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 18px 40px -24px rgba(26,26,25,0.35)' }}>
                            <div className="space-y-2 mb-5">
                                <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#ff3c21' }}>
                                    Focus Review
                                </div>
                                <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    {selectedPreset.label}
                                </h2>
                                <p className="text-sm" style={{ color: '#202023' }}>
                                    Sleep de avatar rond om clipping en grounding vanuit elke hoek te controleren.
                                </p>
                            </div>

                            <div>
                                <div className="text-xs font-black uppercase tracking-[0.16em] mb-2" style={{ color: '#ff3c21' }}>
                                    3D Renderer
                                </div>
                                <div className="h-[420px] rounded-[1.5rem] overflow-hidden" style={{ backgroundColor: '#f2f1ec', border: '1px solid #E7D8BD' }}>
                                    <AvatarViewer config={selectedPreset.config} interactive={true} />
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DevAvatarPreview;
