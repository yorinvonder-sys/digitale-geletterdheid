import React, { useMemo, useState } from 'react';
import { AvatarViewer } from './AvatarViewer';
import { AvatarViewer2D } from './AvatarViewer2D';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types';
import { AVATAR_HAIR_CATALOG, AVATAR_PET_CATALOG } from '../config/avatarCatalog';

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
            hairColor: '#08283B',
            shirtColor: '#D97848',
            pantsColor: '#0B453F',
            expression: 'happy',
            eyeColor: '#0B453F',
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
        shirtColor: '#0B453F',
        pantsColor: '#08283B',
        expression: 'cool',
        eyeColor: '#4A3728',
        accessory: 'none',
        pet: 'none',
    };
};

const getHairColorForStyle = (style: AvatarConfig['hairStyle'], gender: AvatarConfig['gender']): string => {
    if (style === 'mohawk') return '#D97848';
    if (style === 'afro' || style === 'curls' || style === 'buzzcut') return '#1A1A1A';
    if (style === 'fade') return '#20150F';
    if (style === 'sidepart') return '#4A2A1B';
    if (gender === 'female' && style === 'bob') return '#C2410C';
    return gender === 'female' ? '#08283B' : '#3D2314';
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

const PET_PRESETS: PreviewPreset[] = AVATAR_PET_CATALOG
    .filter(item => item.value !== 'none')
    .map((item, index) => ({
        key: `pet-${item.value}`,
        label: `Pet QA — ${item.label}`,
        category: 'pets',
        config: {
            ...createBaseConfig('male'),
            hairStyle: index === 0 ? 'spiky' : index === 1 ? 'sidepart' : 'buzzcut',
            hairColor: index === 2 ? '#1A1A1A' : '#3D2314',
            shirtColor: index === 0 ? '#5F947D' : index === 1 ? '#D97848' : '#0B453F',
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
            shirtColor: '#5F947D',
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
            shirtColor: '#D7C95F',
            pet: 'pet_cat',
            expression: 'surprised',
        },
    },
];

const ALL_PRESETS = [...HAIR_PRESETS, ...PET_PRESETS, ...HEADWEAR_PRESETS];

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
            boxShadow: selected ? '0 18px 36px -18px rgba(217,119,87,0.55)' : '0 10px 28px -20px rgba(26,26,25,0.28)',
        }}
    >
        <div className={`${CARD_HEIGHT} rounded-[1.3rem] overflow-hidden`} style={{ backgroundColor: '#FCF6EA' }}>
            <AvatarViewer config={preset.config} interactive={false} />
        </div>
        <div className="pt-3 px-1">
            <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#D97848' }}>
                {SECTION_COPY[preset.category].title}
            </div>
            <div className="text-sm font-bold leading-tight mt-1" style={{ color: '#08283B' }}>
                {preset.label}
            </div>
        </div>
    </button>
);

const DevAvatarPreview: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState(ALL_PRESETS[0]?.key ?? '');

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

    return (
        <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: '#FCF6EA', color: '#08283B' }}>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Avatar 3D QA Preview
                    </h1>
                    <p className="text-sm md:text-base max-w-3xl mx-auto" style={{ color: '#445865' }}>
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
                                            onSelect={() => setSelectedKey(preset.key)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {selectedPreset && (
                        <aside className="xl:sticky xl:top-6 rounded-[2rem] p-5 md:p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 18px 40px -24px rgba(26,26,25,0.35)' }}>
                            <div className="space-y-2 mb-5">
                                <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#D97848' }}>
                                    Focus Review
                                </div>
                                <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    {selectedPreset.label}
                                </h2>
                                <p className="text-sm" style={{ color: '#445865' }}>
                                    Vergelijk de live 3D-render met de 2D fallback om silhouetteproblemen sneller te spotten.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="text-xs font-black uppercase tracking-[0.16em] mb-2" style={{ color: '#D97848' }}>
                                        3D Renderer
                                    </div>
                                    <div className="h-[420px] rounded-[1.5rem] overflow-hidden" style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}>
                                        <AvatarViewer config={selectedPreset.config} interactive={true} />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-black uppercase tracking-[0.16em] mb-2" style={{ color: '#445865' }}>
                                        2D Fallback
                                    </div>
                                    <div className="h-[360px] rounded-[1.5rem] overflow-hidden" style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}>
                                        <AvatarViewer2D config={selectedPreset.config} interactive={false} />
                                    </div>
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
