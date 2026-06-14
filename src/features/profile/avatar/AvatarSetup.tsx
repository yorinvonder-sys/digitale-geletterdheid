import React, { useState } from 'react';
import { Crown, ChevronRight, ChevronLeft, Sparkles, User, Lock } from 'lucide-react';
import { LazyAvatarViewer } from '@/features/profile/avatar/LazyAvatarViewer';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '@/types';
import { AVATAR_PET_CATALOG, getAvatarHairOptionsForGender } from '@/config/avatarCatalog';

interface AvatarSetupProps {
    onComplete: (avatarConfig: AvatarConfig) => void;
    userName?: string;
    initialConfig?: AvatarConfig;
}

const SKIN_COLORS = [
    { id: 'acid', value: '#e1ff01', label: 'Acid Geel' },
    { id: 'orange', value: '#F2A23C', label: 'Oranje' },
    { id: 'mint', value: '#A8E6CF', label: 'Mint' },
    { id: 'sky', value: '#87CEEB', label: 'Hemelsblauw' },
    { id: 'lavender', value: '#C9B1FF', label: 'Lavendel' },
    { id: 'coral', value: '#FF6B6B', label: 'Koraal' },
    { id: 'white', value: '#F8F8F0', label: 'Wit' },
];

const SHIRT_COLORS = [
    '#D97848', '#D97848', '#D97848', '#5F947D', '#0B453F', '#D97848',
    '#D97848', '#D7C95F', '#5F947D', '#0B453F', '#0B453F', '#0B453F',
    '#D97848', '#08283B', '#445865', '#ffffff'
];

const HAIR_COLORS = [
    '#08283B', '#08283B', '#08283B', '#8B4513', '#A0522D', '#D4A574',
    '#E8C07D', '#FFF8DC', '#C41E3A', '#FF6B6B', '#D97848', '#5F947D'
];

const SHOE_COLORS = [
    '#08283B', '#08283B', '#08283B', '#ffffff', '#D97848', '#D97848',
    '#D97848', '#0B453F', '#5F947D', '#D7C95F', '#445865', '#08283B'
];

const EXPRESSIONS = [
    { value: 'happy', label: 'Blij', emoji: '😊' },
    { value: 'cool', label: 'Cool', emoji: '😎' },
    { value: 'neutral', label: 'Neutraal', emoji: '🙂' },
    { value: 'surprised', label: 'Verrast', emoji: '😮' },
] as const;

const SHIRT_STYLES = [
    { value: 't-shirt', label: 'T-Shirt', locked: false },
    { value: 'hoodie', label: 'Hoodie', locked: false },
    { value: 'varsity', label: 'Varsity', locked: false },
    { value: 'polo', label: 'Polo', locked: false },
    { value: 'tank', label: 'Tanktop', locked: false },
    { value: 'sweater', label: 'Trui', locked: false },
    { value: 'denim', label: 'Denim', locked: true },
    { value: 'jersey', label: 'Jersey', locked: true },
    { value: 'trackjacket', label: 'Trainingsjack', locked: true },
    { value: 'leather', label: 'Leer', locked: true },
    { value: 'bomber', label: 'Bomber', locked: true },
    { value: 'blazer', label: 'Blazer', locked: true },
    { value: 'puffer', label: 'Puffer', locked: true },
    { value: 'kimono', label: 'Kimono', locked: true },
    { value: 'suit_diamond', label: 'Pak', locked: true },
];

const PANTS_STYLES = [
    { value: 'standard', label: 'Standaard', locked: false },
    { value: 'chinos', label: 'Chino', locked: false },
    { value: 'shorts', label: 'Korte broek', locked: false },
    { value: 'joggers', label: 'Joggers', locked: false },
    { value: 'skirt', label: 'Rok', locked: false },
    { value: 'cargo', label: 'Cargo', locked: true },
    { value: 'skinny', label: 'Skinny', locked: true },
    { value: 'ripped', label: 'Gescheurd', locked: true },
    { value: 'baggy', label: 'Baggy', locked: true },
    { value: 'sweatpants', label: 'Joggingbroek', locked: true },
    { value: 'formal', label: 'Formeel', locked: true },
    { value: 'pleated', label: 'Plooirok', locked: true },
];

const ACCESSORIES = [
    { value: 'none', label: 'Geen', locked: false },
    { value: 'cap', label: 'Pet', locked: false },
    { value: 'beanie', label: 'Muts', locked: false },
    { value: 'glasses', label: 'Bril', locked: false },
    { value: 'headphones', label: 'Koptelefoon', locked: false },
    { value: 'backpack', label: 'Rugzak', locked: false },
    { value: 'watch', label: 'Horloge', locked: true },
    { value: 'chain', label: 'Ketting', locked: true },
    { value: 'scarf', label: 'Sjaal', locked: true },
    { value: 'skateboard', label: 'Skateboard', locked: true },
    { value: 'cape', label: 'Cape', locked: true },
    { value: 'wings', label: 'Vleugels', locked: true },
    { value: 'crown', label: 'Kroon', locked: true },
    { value: 'sword', label: 'Zwaard', locked: true },
];

// Poses removed — animations were inaccurate

export const AvatarSetup: React.FC<AvatarSetupProps> = ({ onComplete, userName, initialConfig }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState<AvatarConfig>(initialConfig || DEFAULT_AVATAR_CONFIG);

    const STEPS = [
        { id: 'welcome', title: 'Kies je karakter', subtitle: 'Welkom!' },
        { id: 'face', title: 'Snavel & Kuif', subtitle: 'Maak het uniek' },
        { id: 'clothing', title: 'Outfit & Accessoires', subtitle: 'Personaliseer verder' },
        { id: 'done', title: 'Klaar!', subtitle: 'Je avatar is af' },
    ];

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            onComplete(config);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const hairStyles = getAvatarHairOptionsForGender(config.gender);

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
                            {/* Step 0: Welcome + Gender Selection */}
                            {currentStep === 0 && (
                                <div className="space-y-5 animate-in fade-in">
                                    <p className="font-medium text-center text-sm text-duck-ink/65">
                                        Hoi{userName ? ` ${userName}` : ''}! Maak je eigen avatar en begin je avontuur.
                                    </p>

                                    {/* Gender Selection */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setConfig({
                                                ...config,
                                                gender: 'male',
                                                hairStyle: 'spiky',
                                                baseModel: 'standard',
                                                shirtColor: '#D97848',
                                                pantsColor: '#08283B',
                                                shoeColor: '#0B453F',
                                                hairColor: '#08283B',
                                                expression: 'cool',
                                            })}
                                            className={`p-5 rounded-2xl border-2 transition-all ${config.gender === 'male'
                                                ? 'border-duck-ink bg-duck-acid'
                                                : 'border-duck-ink/10 bg-white hover:border-duck-ink/40'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">👦</div>
                                            <div className="font-bold text-duck-ink">Jongen</div>
                                        </button>
                                        <button
                                            onClick={() => setConfig({
                                                ...config,
                                                gender: 'female',
                                                hairStyle: 'pigtails',
                                                baseModel: 'slim',
                                                shirtColor: '#D97848',
                                                pantsColor: '#08283B',
                                                shoeColor: '#1f2937',
                                                hairColor: '#08283B',
                                                expression: 'happy',
                                            })}
                                            className={`p-5 rounded-2xl border-2 transition-all ${config.gender === 'female'
                                                ? 'border-duck-ink bg-duck-acid'
                                                : 'border-duck-ink/10 bg-white hover:border-duck-ink/40'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">👧</div>
                                            <div className="font-bold text-duck-ink">Meisje</div>
                                        </button>
                                    </div>

                                    {/* Skin Color Selection */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Verenkleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SKIN_COLORS.map(skin => (
                                                <button
                                                    key={skin.id}
                                                    onClick={() => setConfig({ ...config, skinColor: skin.value })}
                                                    className={`w-12 h-12 rounded-xl transition-all ${config.skinColor === skin.value
                                                        ? 'scale-110 ring-[3px] ring-duck-ink ring-offset-2 ring-offset-duck-bgLight'
                                                        : 'hover:scale-105'
                                                        }`}
                                                    style={{ backgroundColor: skin.value }}
                                                    aria-label={`Selecteer huidskleur: ${skin.label}`}
                                                    aria-pressed={config.skinColor === skin.value}
                                                    title={skin.label}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Gezicht & Haar */}
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-in fade-in">
                                    {/* Expression */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Snavel & Ogen</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {EXPRESSIONS.map(expression => (
                                                <button
                                                    key={expression.value}
                                                    onClick={() => setConfig({ ...config, expression: expression.value })}
                                                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 active:scale-95 ${config.expression === expression.value
                                                        ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                        : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40'
                                                        }`}
                                                >
                                                    <span className="text-xl">{expression.emoji}</span>
                                                    <span className="font-bold text-[11px]">{expression.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hair Style */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Kuif</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {hairStyles.map(hair => (
                                                <button
                                                    key={hair.value}
                                                    onClick={() => !hair.locked && setConfig({ ...config, hairStyle: hair.value as any })}
                                                    disabled={hair.locked}
                                                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all text-center relative ${hair.locked
                                                        ? 'border-duck-ink/10 bg-duck-ink/5 text-duck-ink/50 cursor-not-allowed opacity-60'
                                                        : config.hairStyle === hair.value
                                                            ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                            : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {hair.label}
                                                        {hair.locked && <Lock size={11} className="text-duck-ink/45" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hair Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Kuifkleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {HAIR_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, hairColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.hairColor === color
                                                        ? 'ring-[3px] ring-duck-ink ring-offset-2 ring-offset-duck-bgLight scale-110 border-duck-ink'
                                                        : 'border-transparent hover:scale-110 hover:border-duck-ink/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Kleding & Extras */}
                            {currentStep === 2 && (
                                <div className="space-y-4 animate-in fade-in">
                                    {/* Shirt Style */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Outfit</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {SHIRT_STYLES.map(shirt => (
                                                <button
                                                    key={shirt.value}
                                                    onClick={() => !shirt.locked && setConfig({ ...config, shirtStyle: shirt.value as any })}
                                                    disabled={shirt.locked}
                                                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all text-center relative ${shirt.locked
                                                        ? 'border-duck-ink/10 bg-duck-ink/5 text-duck-ink/50 cursor-not-allowed opacity-60'
                                                        : config.shirtStyle === shirt.value
                                                            ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                            : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {shirt.label}
                                                        {shirt.locked && <Lock size={11} className="text-duck-ink/45" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shirt Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Outfit kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHIRT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, shirtColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.shirtColor === color
                                                        ? 'ring-[3px] ring-duck-ink ring-offset-2 ring-offset-duck-bgLight scale-110 border-duck-ink'
                                                        : 'border-transparent hover:scale-110 hover:border-duck-ink/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pants Style */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Broek stijl</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {PANTS_STYLES.map(pants => (
                                                <button
                                                    key={pants.value}
                                                    onClick={() => !pants.locked && setConfig({ ...config, pantsStyle: pants.value as any })}
                                                    disabled={pants.locked}
                                                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all text-center relative ${pants.locked
                                                        ? 'border-duck-ink/10 bg-duck-ink/5 text-duck-ink/50 cursor-not-allowed opacity-60'
                                                        : config.pantsStyle === pants.value
                                                            ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                            : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {pants.label}
                                                        {pants.locked && <Lock size={11} className="text-duck-ink/45" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pants Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Broek kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHIRT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, pantsColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.pantsColor === color
                                                        ? 'ring-[3px] ring-duck-ink ring-offset-2 ring-offset-duck-bgLight scale-110 border-duck-ink'
                                                        : 'border-transparent hover:scale-110 hover:border-duck-ink/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shoe Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Voetjes kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHOE_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, shoeColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.shoeColor === color
                                                        ? 'ring-[3px] ring-duck-ink ring-offset-2 ring-offset-duck-bgLight scale-110 border-duck-ink'
                                                        : 'border-transparent hover:scale-110 hover:border-duck-ink/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accessory */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Accessoire</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {ACCESSORIES.map(acc => (
                                                <button
                                                    key={acc.value}
                                                    onClick={() => !acc.locked && setConfig({ ...config, accessory: acc.value as any })}
                                                    disabled={acc.locked}
                                                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all text-center relative ${acc.locked
                                                        ? 'border-duck-ink/10 bg-duck-ink/5 text-duck-ink/50 cursor-not-allowed opacity-60'
                                                        : config.accessory === acc.value
                                                            ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                            : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {acc.label}
                                                        {acc.locked && <Lock size={11} className="text-duck-ink/45" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Huisdier */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-duck-ink/65">Huisdier</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {AVATAR_PET_CATALOG.map(pet => (
                                                <button
                                                    key={pet.value}
                                                    onClick={() => setConfig({ ...config, pet: pet.value as any })}
                                                    className={`min-h-[44px] p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 active:scale-95 ${config.pet === pet.value || (!config.pet && pet.value === 'pet_dog')
                                                        ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                        : 'border-duck-ink/10 bg-white text-duck-ink hover:border-duck-ink/40'
                                                        }`}
                                                >
                                                    <span className="text-xl">{pet.emoji}</span>
                                                    <span className="font-bold text-[11px]">{pet.label}</span>
                                                </button>
                                            ))}
                                        </div>
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
