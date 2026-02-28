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
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#1e293b', '#64748b', '#ffffff'
];

const HAIR_COLORS = [
    '#1a1a1a', '#3d2314', '#5D4037', '#8B4513', '#A0522D', '#D4A574',
    '#E8C07D', '#FFF8DC', '#C41E3A', '#FF6B6B', '#6366f1', '#22c55e'
];

const SHOE_COLORS = [
    '#1a1a1a', '#3d2314', '#5D4037', '#ffffff', '#ef4444', '#3b82f6',
    '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#1e293b'
];

const EXPRESSIONS = [
    { value: 'happy', label: 'Blij', emoji: '😊' },
    { value: 'cool', label: 'Cool', emoji: '😎' },
    { value: 'neutral', label: 'Neutraal', emoji: '🙂' },
    { value: 'surprised', label: 'Verrast', emoji: '😮' },
] as const;

export const AvatarSetup: React.FC<AvatarSetupProps> = ({ onComplete, userName, initialConfig }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState<AvatarConfig>(initialConfig || DEFAULT_AVATAR_CONFIG);

    const STEPS = [
        { id: 'welcome', title: 'Kies je karakter', subtitle: 'Welkom!' },
        { id: 'style', title: 'Style je avatar', subtitle: 'Maak het uniek' },
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
        <div className="fixed inset-0 z-[200] bg-slate-900 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Progress Dots */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-white' : i < currentStep ? 'w-2 bg-white/50' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col lg:flex-row items-stretch overflow-hidden">
                {/* Avatar Preview */}
                <div className="flex-1 relative min-h-[250px] lg:min-h-0">
                    <LazyAvatarViewer config={config} interactive={true} />
                </div>

                {/* Controls Panel */}
                <div className="flex-1 p-5 md:p-8 lg:p-10 flex flex-col justify-center bg-slate-900/50 backdrop-blur-xl overflow-y-auto">
                    <div className="max-w-md mx-auto w-full">
                        {/* Step Header */}
                        <div className="text-center mb-5">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">{step.subtitle}</p>
                            <h2 className="text-2xl md:text-3xl font-black text-white">{step.title}</h2>
                        </div>

                        {/* Step Content */}
                        <div className="mb-6">
                            {/* Step 0: Welcome + Gender Selection */}
                            {currentStep === 0 && (
                                <div className="space-y-5 animate-in fade-in">
                                    <p className="text-slate-400 font-medium text-center text-sm">
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
                                                shirtColor: '#0ea5e9',
                                                pantsColor: '#1e293b',
                                                shoeColor: '#0f172a',
                                                hairColor: '#3d2314',
                                                pantsStyle: 'standard',
                                                expression: 'cool',
                                            })}
                                            className={`p-5 rounded-2xl border-4 transition-all ${config.gender === 'male' ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="text-4xl mb-2">👦</div>
                                            <div className="font-bold text-white">Jongen</div>
                                        </button>
                                        <button
                                            onClick={() => setConfig({
                                                ...config,
                                                gender: 'female',
                                                hairStyle: 'pigtails',
                                                baseModel: 'slim',
                                                shirtColor: '#ec4899',
                                                pantsColor: '#8b5cf6',
                                                shoeColor: '#1f2937',
                                                hairColor: '#5D4037',
                                                pantsStyle: 'skirt',
                                                expression: 'happy',
                                            })}
                                            className={`p-5 rounded-2xl border-4 transition-all ${config.gender === 'female' ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="text-4xl mb-2">👧</div>
                                            <div className="font-bold text-white">Meisje</div>
                                        </button>
                                    </div>

                                    {/* Skin Color Selection */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Huidskleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SKIN_COLORS.map(skin => (
                                                <button
                                                    key={skin.id}
                                                    onClick={() => setConfig({ ...config, skinColor: skin.value })}
                                                    className={`w-10 h-10 rounded-xl transition-all ${config.skinColor === skin.value
                                                        ? 'ring-4 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-110'
                                                        : 'hover:scale-105'
                                                        }`}
                                                    style={{ backgroundColor: skin.value }}
                                                    title={skin.label}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Full Style Customization */}
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-in fade-in">
                                    {/* Expression */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gezicht</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {EXPRESSIONS.map(expression => (
                                                <button
                                                    key={expression.value}
                                                    onClick={() => setConfig({ ...config, expression: expression.value })}
                                                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 active:scale-95 ${config.expression === expression.value
                                                        ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20'
                                                        : 'border-white/10 text-slate-300 hover:border-white/30'
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
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kapsel</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {hairStyles.map(hair => (
                                                <button
                                                    key={hair.value}
                                                    onClick={() => !hair.locked && setConfig({ ...config, hairStyle: hair.value as any })}
                                                    disabled={hair.locked}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${hair.locked
                                                        ? 'border-white/5 bg-white/5 text-slate-600 cursor-not-allowed opacity-50'
                                                        : config.hairStyle === hair.value
                                                            ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20'
                                                            : 'border-white/10 text-slate-300 hover:border-white/30 active:scale-95'
                                                        }`}
                                                >
                                                    <div className="font-bold text-xs flex items-center justify-center gap-1">
                                                        {hair.label}
                                                        {hair.locked && <Lock size={11} className="text-amber-500/70" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hair Color */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Haar kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {HAIR_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, hairColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.hairColor === color
                                                        ? 'ring-3 ring-white ring-offset-2 ring-offset-slate-900 scale-110 border-white'
                                                        : 'border-transparent hover:scale-110 hover:border-white/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shirt Color */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Shirt kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHIRT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, shirtColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.shirtColor === color
                                                        ? 'ring-3 ring-white ring-offset-2 ring-offset-slate-900 scale-110 border-white'
                                                        : 'border-transparent hover:scale-110 hover:border-white/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pants Color */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Broek kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHIRT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, pantsColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.pantsColor === color
                                                        ? 'ring-3 ring-white ring-offset-2 ring-offset-slate-900 scale-110 border-white'
                                                        : 'border-transparent hover:scale-110 hover:border-white/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shoe Color */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Schoenen kleur</p>
                                        <div className="flex flex-wrap gap-2.5 justify-center">
                                            {SHOE_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, shoeColor: color })}
                                                    className={`w-9 h-9 rounded-full transition-all border-2 ${config.shoeColor === color
                                                        ? 'ring-3 ring-white ring-offset-2 ring-offset-slate-900 scale-110 border-white'
                                                        : 'border-transparent hover:scale-110 hover:border-white/30'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Done */}
                            {currentStep === 2 && (
                                <div className="text-center space-y-4 animate-in fade-in">
                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl">
                                        <Crown size={40} fill="currentColor" />
                                    </div>
                                    <p className="text-slate-400 font-medium">
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
                                    className="px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white/10 text-white hover:bg-white/20 active:scale-95"
                                >
                                    <ChevronLeft size={20} />
                                    Terug
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95"
                            >
                                {isLastStep ? (
                                    <>
                                        <Sparkles size={20} />
                                        Start je Avontuur!
                                    </>
                                ) : (
                                    <>
                                        Volgende
                                        <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Step Counter */}
                        <p className="text-center text-slate-500 text-sm mt-4 font-medium">
                            Stap {currentStep + 1} van {STEPS.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarSetup;
