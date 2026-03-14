import React, { useState } from 'react';
import { Crown, ChevronRight, ChevronLeft, Sparkles, User, Lock } from 'lucide-react';
import { LazyAvatarViewer } from './LazyAvatarViewer';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types';

interface AvatarSetupProps {
    onComplete: (avatarConfig: AvatarConfig) => void;
    userName?: string;
    initialConfig?: AvatarConfig;
}

const SKIN_COLORS = [
    { id: 'pale', value: '#f5d0b0', label: 'Licht' },
    { id: 'fair', value: '#ffe0bd', label: 'Crème' },
    { id: 'tan', value: '#d18a6a', label: 'Getint' },
    { id: 'olive', value: '#c68642', label: 'Olijf' },
    { id: 'brown', value: '#a0522d', label: 'Bruin' },
    { id: 'dark', value: '#8d5524', label: 'Donker' },
    { id: 'ebony', value: '#614335', label: 'Ebben' },
];

const HAIR_STYLES_MALE = [
    { value: 'short', label: 'Kort', locked: false },
    { value: 'spiky', label: 'Stekeltjes', locked: false },
    { value: 'messy', label: 'Wild', locked: false },
    { value: 'fade', label: 'Opscheer', locked: true },
    { value: 'curls', label: 'Krullen', locked: true },
    { value: 'buzzcut', label: 'Buzz Cut', locked: true },
    { value: 'mohawk', label: 'Mohawk', locked: true },
    { value: 'afro', label: 'Afro', locked: true },
];

const HAIR_STYLES_FEMALE = [
    { value: 'pigtails', label: 'Staartjes', locked: false },
    { value: 'long', label: 'Lang', locked: false },
    { value: 'bob', label: 'Boblijn', locked: false },
    { value: 'ponytail', label: 'Paardenstaart', locked: false },
    { value: 'braids', label: 'Vlechtjes', locked: true },
    { value: 'bun', label: 'Knotje', locked: true },
    { value: 'afro', label: 'Afro', locked: true },
    { value: 'curls', label: 'Krullen', locked: true },
];

const SHIRT_COLORS = [
    '#D97757', '#E8956F', '#C46849', '#2A9D8F', '#8B6F9E', '#ef4444',
    '#f97316', '#f59e0b', '#22c55e', '#3b82f6', '#0ea5e9', '#a855f7',
    '#ec4899', '#1e293b', '#64748b', '#ffffff'
];

const HAIR_COLORS = [
    '#1a1a1a', '#3d2314', '#5D4037', '#8B4513', '#A0522D', '#D4A574',
    '#E8C07D', '#FFF8DC', '#C41E3A', '#FF6B6B', '#D97757', '#22c55e'
];

const SHOE_COLORS = [
    '#1a1a1a', '#3d2314', '#5D4037', '#ffffff', '#D97757', '#C46849',
    '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#64748b', '#1e293b'
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
    { value: 'pet_cat', label: 'Kat', locked: true },
    { value: 'pet_dog', label: 'Hond', locked: true },
    { value: 'sword', label: 'Zwaard', locked: true },
];

const POSES = [
    { value: 'idle', label: 'Relaxed', emoji: '🧍' },
    { value: 'wave', label: 'Zwaaien', emoji: '👋' },
    { value: 'peace', label: 'Peace', emoji: '✌️' },
    { value: 'dab', label: 'Dab', emoji: '💃' },
] as const;

export const AvatarSetup: React.FC<AvatarSetupProps> = ({ onComplete, userName, initialConfig }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState<AvatarConfig>(initialConfig || DEFAULT_AVATAR_CONFIG);

    const STEPS = [
        { id: 'welcome', title: 'Kies je karakter', subtitle: 'Welkom!' },
        { id: 'face', title: 'Gezicht & Haar', subtitle: 'Maak het uniek' },
        { id: 'clothing', title: 'Kleding & Extras', subtitle: 'Personaliseer verder' },
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

    const hairStyles = config.gender === 'female' ? HAIR_STYLES_FEMALE : HAIR_STYLES_MALE;

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden" style={{ backgroundColor: '#FAF9F0' }}>
            {/* Progress Dots — centered within right half on desktop */}
            <div className="absolute top-6 right-6 lg:right-auto lg:left-3/4 lg:-translate-x-1/2 z-50 flex gap-2">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className="h-2 rounded-full transition-all duration-500"
                        style={i === currentStep
                            ? { width: 32, backgroundColor: '#D97757' }
                            : { width: 8, backgroundColor: i < currentStep ? '#D9775780' : '#E8E6DF' }
                        }
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col lg:flex-row items-stretch overflow-hidden">
                {/* Avatar Preview — bg matches canvas to prevent flicker */}
                <div className="flex-1 relative min-h-[250px] lg:min-h-0" style={{ backgroundColor: '#FAF9F0' }}>
                    <LazyAvatarViewer config={config} interactive={true} />
                </div>

                {/* Controls Panel */}
                <div className="flex-1 p-5 md:p-8 lg:p-10 flex flex-col overflow-y-auto scroll-smooth" style={{ background: 'linear-gradient(135deg, #FAF9F0 0%, #F5E6DC 50%, #F0D5C4 100%)' }}>
                    <div className="max-w-md mx-auto w-full my-auto">
                        {/* Step Header */}
                        <div className="text-center mb-5">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#D97757' }}>{step.subtitle}</p>
                            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>{step.title}</h2>
                        </div>

                        {/* Step Content */}
                        <div className="mb-6">
                            {/* Step 0: Welcome + Gender Selection */}
                            {currentStep === 0 && (
                                <div className="space-y-5 animate-in fade-in">
                                    <p className="font-medium text-center text-sm" style={{ color: '#6B6B66' }}>
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
                                                shirtColor: '#D97757',
                                                pantsColor: '#1e293b',
                                                shoeColor: '#0f172a',
                                                hairColor: '#3d2314',
                                                expression: 'cool',
                                            })}
                                            className="p-5 rounded-2xl transition-all"
                                            style={config.gender === 'male'
                                                ? { border: '3px solid #D97757', backgroundColor: '#D9775720' }
                                                : { border: '3px solid #D5D3CC' }
                                            }
                                        >
                                            <div className="text-4xl mb-2">👦</div>
                                            <div className="font-bold" style={{ color: '#1A1A19' }}>Jongen</div>
                                        </button>
                                        <button
                                            onClick={() => setConfig({
                                                ...config,
                                                gender: 'female',
                                                hairStyle: 'pigtails',
                                                baseModel: 'slim',
                                                shirtColor: '#D97757',
                                                pantsColor: '#1e293b',
                                                shoeColor: '#1f2937',
                                                hairColor: '#5D4037',
                                                expression: 'happy',
                                            })}
                                            className="p-5 rounded-2xl transition-all"
                                            style={config.gender === 'female'
                                                ? { border: '3px solid #D97757', backgroundColor: '#D9775720' }
                                                : { border: '3px solid #D5D3CC' }
                                            }
                                        >
                                            <div className="text-4xl mb-2">👧</div>
                                            <div className="font-bold" style={{ color: '#1A1A19' }}>Meisje</div>
                                        </button>
                                    </div>

                                    {/* Skin Color Selection */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Huidskleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SKIN_COLORS.map(skin => (
                                                <button
                                                    key={skin.id}
                                                    onClick={() => setConfig({ ...config, skinColor: skin.value })}
                                                    className={`w-10 h-10 rounded-xl transition-all ${config.skinColor === skin.value
                                                        ? 'scale-110'
                                                        : 'hover:scale-105'
                                                        }`}
                                                    style={config.skinColor === skin.value
                                                        ? { backgroundColor: skin.value, boxShadow: '0 0 0 3px #D97757, 0 0 0 5px #FAF9F0' }
                                                        : { backgroundColor: skin.value }
                                                    }
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
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Gezicht</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {EXPRESSIONS.map(expression => (
                                                <button
                                                    key={expression.value}
                                                    onClick={() => setConfig({ ...config, expression: expression.value })}
                                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 active:scale-95 ${config.expression === expression.value
                                                        ? 'border-[#D97757] bg-[#D97757]/15 text-[#3D3D38]'
                                                        : 'border-[#D5D3CC] text-[#6B6B66] hover:border-[#D97757]/40'
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
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Kapsel</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {hairStyles.map(hair => (
                                                <button
                                                    key={hair.value}
                                                    onClick={() => !hair.locked && setConfig({ ...config, hairStyle: hair.value as any })}
                                                    disabled={hair.locked}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${hair.locked
                                                        ? 'border-[#E8E6DF] bg-[#E8E6DF]/50 text-[#9C9C95] cursor-not-allowed opacity-50'
                                                        : config.hairStyle === hair.value
                                                            ? 'border-[#D97757] bg-[#D97757]/15 text-[#3D3D38]'
                                                            : 'border-[#D5D3CC] text-[#6B6B66] hover:border-[#D97757]/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {hair.label}
                                                        {hair.locked && <Lock size={11} className="text-[#D97757]/70" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hair Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Haar kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {HAIR_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, hairColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.hairColor === color
                                                        ? 'ring-3 ring-[#D97757] ring-offset-2 ring-offset-[#FAF9F0] scale-110 border-[#3D3D38]'
                                                        : 'border-transparent hover:scale-110 hover:border-[#3D3D38]/30'
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
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Shirt stijl</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {SHIRT_STYLES.map(shirt => (
                                                <button
                                                    key={shirt.value}
                                                    onClick={() => !shirt.locked && setConfig({ ...config, shirtStyle: shirt.value as any })}
                                                    disabled={shirt.locked}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${shirt.locked
                                                        ? 'border-[#E8E6DF] bg-[#E8E6DF]/50 text-[#9C9C95] cursor-not-allowed opacity-50'
                                                        : config.shirtStyle === shirt.value
                                                            ? 'border-[#D97757] bg-[#D97757]/15 text-[#3D3D38]'
                                                            : 'border-[#D5D3CC] text-[#6B6B66] hover:border-[#D97757]/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {shirt.label}
                                                        {shirt.locked && <Lock size={11} className="text-[#D97757]/70" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shirt Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Shirt kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHIRT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, shirtColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.shirtColor === color
                                                        ? 'ring-3 ring-[#D97757] ring-offset-2 ring-offset-[#FAF9F0] scale-110 border-[#3D3D38]'
                                                        : 'border-transparent hover:scale-110 hover:border-[#3D3D38]/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pants Style */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Broek stijl</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {PANTS_STYLES.map(pants => (
                                                <button
                                                    key={pants.value}
                                                    onClick={() => !pants.locked && setConfig({ ...config, pantsStyle: pants.value as any })}
                                                    disabled={pants.locked}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${pants.locked
                                                        ? 'border-[#E8E6DF] bg-[#E8E6DF]/50 text-[#9C9C95] cursor-not-allowed opacity-50'
                                                        : config.pantsStyle === pants.value
                                                            ? 'border-[#D97757] bg-[#D97757]/15 text-[#3D3D38]'
                                                            : 'border-[#D5D3CC] text-[#6B6B66] hover:border-[#D97757]/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {pants.label}
                                                        {pants.locked && <Lock size={11} className="text-[#D97757]/70" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pants Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Broek kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHIRT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, pantsColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.pantsColor === color
                                                        ? 'ring-3 ring-[#D97757] ring-offset-2 ring-offset-[#FAF9F0] scale-110 border-[#3D3D38]'
                                                        : 'border-transparent hover:scale-110 hover:border-[#3D3D38]/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shoe Color */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Schoenen kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHOE_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, shoeColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.shoeColor === color
                                                        ? 'ring-3 ring-[#D97757] ring-offset-2 ring-offset-[#FAF9F0] scale-110 border-[#3D3D38]'
                                                        : 'border-transparent hover:scale-110 hover:border-[#3D3D38]/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accessory */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Accessoire</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {ACCESSORIES.map(acc => (
                                                <button
                                                    key={acc.value}
                                                    onClick={() => !acc.locked && setConfig({ ...config, accessory: acc.value as any })}
                                                    disabled={acc.locked}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${acc.locked
                                                        ? 'border-[#E8E6DF] bg-[#E8E6DF]/50 text-[#9C9C95] cursor-not-allowed opacity-50'
                                                        : config.accessory === acc.value
                                                            ? 'border-[#D97757] bg-[#D97757]/15 text-[#3D3D38]'
                                                            : 'border-[#D5D3CC] text-[#6B6B66] hover:border-[#D97757]/40 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {acc.label}
                                                        {acc.locked && <Lock size={11} className="text-[#D97757]/70" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pose */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Pose</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {POSES.map(pose => (
                                                <button
                                                    key={pose.value}
                                                    onClick={() => setConfig({ ...config, pose: pose.value })}
                                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 active:scale-95 ${config.pose === pose.value
                                                        ? 'border-[#D97757] bg-[#D97757]/15 text-[#3D3D38]'
                                                        : 'border-[#D5D3CC] text-[#6B6B66] hover:border-[#D97757]/40'
                                                        }`}
                                                >
                                                    <span className="text-xl">{pose.emoji}</span>
                                                    <span className="font-bold text-[11px]">{pose.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Done */}
                            {currentStep === 3 && (
                                <div className="text-center space-y-4 animate-in fade-in">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl" style={{ backgroundColor: '#D97757' }}>
                                        <Crown size={40} fill="currentColor" />
                                    </div>
                                    <p className="font-medium" style={{ color: '#6B6B66' }}>
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
                                    className="px-6 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                                    style={{ backgroundColor: '#E8E6DF', color: '#3D3D38' }}
                                >
                                    <ChevronLeft size={18} />
                                    Terug
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="flex-1 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 transition-all text-white hover:scale-[1.02] active:scale-95"
                                style={{ backgroundColor: '#D97757', boxShadow: '0 8px 24px rgba(217,119,87,0.3)' }}
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
                        <p className="text-center text-sm mt-4 font-medium" style={{ color: '#6B6B66' }}>
                            Stap {currentStep + 1} van {STEPS.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarSetup;
