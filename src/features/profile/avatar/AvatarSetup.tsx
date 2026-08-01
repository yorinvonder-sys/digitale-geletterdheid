import React, { useState } from 'react';
import { Crown, ChevronRight, ChevronLeft, Sparkles, Lock, Shuffle } from 'lucide-react';
import { LazyAvatarViewer } from '@/features/profile/avatar/LazyAvatarViewer';
import { AvatarConfig } from '@/types';
import {
    AvatarCatalogItem,
    AvatarSlot,
    applyCatalogItem,
    getItemsForSlot,
    isOwned,
    normalizeAvatarConfig,
    randomizeAvatarConfig,
} from '@/config/avatarCatalog';

interface AvatarSetupProps {
    onComplete: (avatarConfig: AvatarConfig) => void;
    userName?: string;
    initialConfig?: AvatarConfig;
    /** Gekochte item-ids. Leeg voor een nieuwe leerling: alles wat geld kost
     *  staat dan op slot en is te koop in de winkel. */
    inventory?: string[];
}

const STEPS = [
    { id: 'welcome', title: 'Kies je karakter', subtitle: 'Welkom!' },
    { id: 'face', title: 'Gezicht & Haar', subtitle: 'Maak het uniek' },
    { id: 'clothing', title: 'Kleding & Accessoires', subtitle: 'Personaliseer verder' },
    { id: 'done', title: 'Klaar!', subtitle: 'Je avatar is af' },
];

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">{children}</p>
);

/** Tegelraster voor stijl-items (kapsel, shirt, broek, accessoire). */
const OptionGrid: React.FC<{
    items: AvatarCatalogItem[];
    inventory: string[];
    isSelected: (item: AvatarCatalogItem) => boolean;
    onPick: (item: AvatarCatalogItem) => void;
}> = ({ items, inventory, isSelected, onPick }) => (
    <div className="grid grid-cols-4 gap-2">
        {items.map(item => {
            const owned = isOwned(item, inventory);
            const selected = isSelected(item);
            return (
                <button
                    key={item.id}
                    onClick={() => owned && onPick(item)}
                    disabled={!owned}
                    title={owned ? item.label : `${item.label} — ${item.price} XP in de winkel`}
                    aria-pressed={selected}
                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all text-center ${!owned
                        ? 'border-duck-ink/10 bg-duck-ink/5 text-duck-ink/50 cursor-not-allowed opacity-60'
                        : selected
                            ? 'border-duck-ink bg-duck-acid text-duck-ink'
                            : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40 active:scale-95'
                        }`}
                >
                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                        {item.label}
                        {!owned && <Lock size={11} className="text-duck-ink/45" />}
                    </div>
                </button>
            );
        })}
    </div>
);

/** Kleurstalen. Kleuren zijn altijd gratis. */
const SwatchGrid: React.FC<{
    items: AvatarCatalogItem[];
    selectedValue?: string;
    onPick: (item: AvatarCatalogItem) => void;
    size?: 'sm' | 'lg';
}> = ({ items, selectedValue, onPick, size = 'sm' }) => (
    <div className="flex flex-wrap gap-2.5 justify-center">
        {items.map(item => (
            <button
                key={item.id}
                onClick={() => onPick(item)}
                aria-label={item.label}
                aria-pressed={selectedValue === item.value}
                title={item.label}
                className={`${size === 'lg' ? 'w-12 h-12 rounded-xl' : 'w-9 h-9 rounded-full border-2'} transition-all ${selectedValue === item.value
                    ? 'scale-110 ring-[3px] ring-duck-ink ring-offset-2 ring-offset-duck-bgLight border-duck-ink'
                    : 'border-transparent hover:scale-110 hover:border-duck-ink/30'
                    }`}
                style={{ backgroundColor: item.swatch }}
            />
        ))}
    </div>
);

/** Raster met emoji-tegels (geslacht, huisdier). */
const EmojiGrid: React.FC<{
    items: AvatarCatalogItem[];
    columns: 2 | 4;
    isSelected: (item: AvatarCatalogItem) => boolean;
    onPick: (item: AvatarCatalogItem) => void;
}> = ({ items, columns, isSelected, onPick }) => (
    <div className={`grid ${columns === 2 ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-2'}`}>
        {items.map(item => (
            <button
                key={item.id}
                onClick={() => onPick(item)}
                aria-pressed={isSelected(item)}
                className={`${columns === 2 ? 'p-5 rounded-2xl' : 'min-h-[44px] p-3 rounded-xl flex flex-col items-center gap-1'} border-2 transition-all active:scale-95 ${isSelected(item)
                    ? 'border-duck-ink bg-duck-acid'
                    : 'border-duck-ink/10 bg-white hover:border-duck-ink/40'
                    }`}
            >
                <div className={columns === 2 ? 'text-4xl mb-2' : 'text-xl'}>{item.emoji}</div>
                <div className={`font-bold text-duck-ink ${columns === 2 ? '' : 'text-[11px]'}`}>{item.label}</div>
            </button>
        ))}
    </div>
);

export const AvatarSetup: React.FC<AvatarSetupProps> = ({
    onComplete,
    userName,
    initialConfig,
    inventory = [],
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState<AvatarConfig>(() => normalizeAvatarConfig(initialConfig));

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) onComplete(config);
        else setCurrentStep(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const pick = (item: AvatarCatalogItem) =>
        setConfig(prev => applyCatalogItem(prev, item, inventory));

    const optionsFor = (slot: AvatarSlot) => getItemsForSlot(slot, config.gender);

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden bg-duck-bg font-sans text-duck-ink">
            {/* Progress Dots — centered within right half on desktop */}
            <div className="absolute top-6 right-6 lg:right-auto lg:left-3/4 lg:-translate-x-1/2 z-50 flex gap-2">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${i === currentStep
                            ? 'w-8 bg-duck-ink'
                            : i < currentStep ? 'w-2 bg-duck-ink/40' : 'w-2 bg-duck-ink/15'
                            }`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col lg:flex-row items-stretch overflow-hidden">
                {/* Avatar Preview — bg matches canvas to prevent flicker */}
                <div className="flex-1 relative min-h-[250px] lg:min-h-0 bg-duck-bg">
                    <LazyAvatarViewer config={config} interactive={true} />
                </div>

                {/* Controls Panel */}
                <div className="flex-1 p-5 md:p-8 lg:p-10 flex flex-col overflow-y-auto scroll-smooth bg-duck-bgLight">
                    <div className="max-w-md mx-auto w-full my-auto">
                        {/* Step Header */}
                        <div className="text-center mb-5">
                            <p className="text-xs font-extrabold uppercase tracking-[0.16em] mb-1 text-duck-ink/60">{step.subtitle}</p>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-duck-ink">{step.title}</h2>
                        </div>

                        {/* Step Content */}
                        <div className="mb-6">
                            {/* Step 0: Welcome + Gender + Skin */}
                            {currentStep === 0 && (
                                <div className="space-y-5 animate-in fade-in">
                                    <p className="font-medium text-center text-sm text-duck-ink/65">
                                        Hoi{userName ? ` ${userName}` : ''}! Maak je eigen avatar en begin je avontuur.
                                    </p>

                                    <EmojiGrid
                                        items={optionsFor('gender')}
                                        columns={2}
                                        isSelected={item => config.gender === item.value}
                                        onPick={pick}
                                    />

                                    <div>
                                        <SectionLabel>Huidskleur</SectionLabel>
                                        <SwatchGrid
                                            items={optionsFor('skinColor')}
                                            selectedValue={config.skinColor}
                                            onPick={pick}
                                            size="lg"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setConfig(prev => randomizeAvatarConfig(prev, inventory))}
                                        className="w-full min-h-[44px] rounded-full border-2 border-duck-ink/15 bg-white font-extrabold text-sm text-duck-ink flex items-center justify-center gap-2 transition-all hover:border-duck-ink active:scale-95"
                                    >
                                        <Shuffle size={16} />
                                        Verras me
                                    </button>
                                </div>
                            )}

                            {/* Step 1: Gezicht & Haar */}
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div>
                                        <SectionLabel>Gezicht</SectionLabel>
                                        <OptionGrid
                                            items={optionsFor('expression')}
                                            inventory={inventory}
                                            isSelected={item => (config.expression ?? 'neutral') === item.value}
                                            onPick={pick}
                                        />
                                    </div>

                                    <div>
                                        <SectionLabel>Oogkleur</SectionLabel>
                                        <SwatchGrid items={optionsFor('eyeColor')} selectedValue={config.eyeColor} onPick={pick} />
                                    </div>

                                    <div>
                                        <SectionLabel>Haarstijl</SectionLabel>
                                        <OptionGrid
                                            items={optionsFor('hairStyle')}
                                            inventory={inventory}
                                            isSelected={item => config.hairStyle === item.value}
                                            onPick={pick}
                                        />
                                    </div>

                                    <div>
                                        <SectionLabel>Haarkleur</SectionLabel>
                                        <SwatchGrid items={optionsFor('hairColor')} selectedValue={config.hairColor} onPick={pick} />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Kleding & Extras */}
                            {currentStep === 2 && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div>
                                        <SectionLabel>Shirt</SectionLabel>
                                        <OptionGrid
                                            items={optionsFor('shirtStyle')}
                                            inventory={inventory}
                                            isSelected={item => config.shirtStyle === item.value}
                                            onPick={pick}
                                        />
                                    </div>

                                    <div>
                                        <SectionLabel>Shirt kleur</SectionLabel>
                                        <SwatchGrid items={optionsFor('shirtColor')} selectedValue={config.shirtColor} onPick={pick} />
                                    </div>

                                    <div>
                                        <SectionLabel>Broek stijl</SectionLabel>
                                        <OptionGrid
                                            items={optionsFor('pantsStyle')}
                                            inventory={inventory}
                                            isSelected={item => config.pantsStyle === item.value}
                                            onPick={pick}
                                        />
                                    </div>

                                    <div>
                                        <SectionLabel>Broek kleur</SectionLabel>
                                        <SwatchGrid items={optionsFor('pantsColor')} selectedValue={config.pantsColor} onPick={pick} />
                                    </div>

                                    <div>
                                        <SectionLabel>Schoenen kleur</SectionLabel>
                                        <SwatchGrid items={optionsFor('shoeColor')} selectedValue={config.shoeColor} onPick={pick} />
                                    </div>

                                    <div>
                                        <SectionLabel>Accessoire</SectionLabel>
                                        <OptionGrid
                                            items={optionsFor('accessory')}
                                            inventory={inventory}
                                            isSelected={item => config.accessory === item.value}
                                            onPick={pick}
                                        />
                                    </div>

                                    <div>
                                        <SectionLabel>Huisdier</SectionLabel>
                                        <EmojiGrid
                                            items={optionsFor('pet')}
                                            columns={4}
                                            isSelected={item => (config.pet ?? 'none') === item.value}
                                            onPick={pick}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Done */}
                            {currentStep === 3 && (
                                <div className="text-center space-y-4 animate-in fade-in">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-duck-ink mx-auto shadow-duck-soft bg-duck-acid border-2 border-duck-ink">
                                        <Crown size={40} fill="currentColor" />
                                    </div>
                                    <p className="font-medium text-duck-ink/65">
                                        Je avatar ziet er geweldig uit!<br />
                                        We laten je zo zien hoe alles werkt.
                                    </p>
                                    <p className="text-sm font-medium text-duck-ink/65">
                                        In de winkel kun je later meer kleding, accessoires en emotes vrijspelen met de XP die je verdient.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-3">
                            {!isFirstStep && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-6 py-4 rounded-full font-extrabold text-duck-ink bg-duck-bgLight border border-duck-ink/20 flex items-center justify-center gap-2 transition-all hover:border-duck-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                                >
                                    <ChevronLeft size={18} />
                                    Terug
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="flex-1 py-4 rounded-full font-extrabold text-lg flex items-center justify-center gap-3 transition-all text-duck-ink bg-duck-acid border border-duck-ink shadow-duck-soft hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                            >
                                {isLastStep ? (
                                    <>
                                        <Sparkles size={18} />
                                        Start je Avontuur!
                                    </>
                                ) : (
                                    <>
                                        Volgende
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Step Counter */}
                        <p className="text-center text-sm mt-4 font-medium text-duck-ink/65">
                            Stap {currentStep + 1} van {STEPS.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarSetup;
