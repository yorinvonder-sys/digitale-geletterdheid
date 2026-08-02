import React, { useState, lazy, Suspense } from 'react';
import { User, Shield, Trophy, ChevronLeft, Sparkles, ShoppingBag, Palette, Crown, Headphones, Shirt, Columns as Pants, Glasses, Bot, Backpack, Zap, Scissors, X, Award, Gamepad2, BookOpen, BrainCircuit, Search, RotateCcw, Calendar, Printer, Projector, FileText, Cloud, Share2, MessageSquare, Scale, Save, Star, Heart, Dumbbell, CheckCircle2, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';
import { ParentUser, UserStats, AvatarConfig, DEFAULT_AVATAR_CONFIG, EducationLevel } from '@/types';
import { LazyAvatarViewer } from '@/features/profile/avatar/LazyAvatarViewer';
import { AvatarShop } from '@/features/profile/AvatarShop';
import { getAvatarHairOptionsForGender, normalizeAvatarConfig } from '@/config/avatarCatalog';

const ConsentManager = lazy(() => import('@/features/consent/ConsentManager').then(m => ({ default: m.ConsentManager })));

/** Schat leeftijd op basis van leerjaar en onderwijsniveau.
 *  VO klas 1 = ~12 jaar, klas 2 = ~13, etc.
 *  Zonder data: 14 (conservatief — onder de 16, dus ouderlijke toestemming vereist). */
function estimateStudentAge(yearGroup?: number, _educationLevel?: EducationLevel): number {
  if (yearGroup && yearGroup >= 1 && yearGroup <= 6) {
    return 11 + yearGroup; // klas 1 → 12, klas 2 → 13, ..., klas 6 → 17
  }
  return 14; // fallback: onder 16, dus ouderlijke toestemming vereist
}

interface UserProfileProps {
    user: ParentUser;
    onBack: () => void;
    onUpdateProfile: (data: Partial<ParentUser>) => void;
    onLogout?: () => void;
    initialTab?: 'profile' | 'shop' | 'trophies' | 'privacy';
}

const PALETTE_COLORS = [
    '#D97848', '#D97848', '#D7C95F', '#D7C95F', '#99984D', '#5F947D', '#5F947D', '#0B453F',
    '#0B453F', '#0B453F', '#0B453F', '#D97848', '#D97848', '#0B453F', '#D97848', '#D97848',
    '#D97848', '#08283B', '#445865', '#E7D8BD', '#ffffff'
];

const CircularColorPicker = ({ selectedColor, onSelect, label, size = 'md' }: { selectedColor: string, onSelect: (color: string) => void, label?: string, size?: 'sm' | 'md' }) => {
    const handlePick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 180;
        onSelect(`hsl(${Math.round(angle)}, 70%, 50%)`);
    };

    const sizeClasses = size === 'sm' ? 'w-24 h-24' : 'w-48 h-48 md:w-56 md:h-56';
    const indicatorInset = size === 'sm' ? 'inset-1.5' : 'inset-4';
    const previewInset = size === 'sm' ? 'inset-5' : 'inset-12';

    return (
        <div className="flex flex-col items-center gap-2 py-2">
            {label && <span className="text-[10px] font-black text-duck-ink/65 uppercase tracking-widest">{label}</span>}
            <div
                className={`relative ${sizeClasses} rounded-full cursor-crosshair shadow-duck-soft border-2 border-white overflow-hidden group transition-transform active:scale-95`}
                style={{ background: 'conic-gradient(from 180deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
                onClick={handlePick}
            >
                <div className={`absolute ${indicatorInset} rounded-full bg-white/20 backdrop-blur-sm pointer-events-none border border-white/30`} />
                <div className={`absolute ${previewInset} rounded-full shadow-inner pointer-events-none flex items-center justify-center`} style={{ backgroundColor: selectedColor }}>
                    <div className={`${size === 'sm' ? 'w-3 h-3' : 'w-6 h-6'} rounded-full bg-white/40 border border-white/50 animate-pulse`} />
                </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded shadow-sm border border-duck-ink/10" style={{ backgroundColor: selectedColor }} />
                <span className="text-[9px] font-mono font-bold text-duck-ink/65 uppercase">{selectedColor}</span>
            </div>
        </div>
    );
};


// ═══════════════════════════════════════════════════════════════════════════════
// BADGES & TROPHIES
// ═══════════════════════════════════════════════════════════════════════════════
const BADGES = [
    { id: 'game-programmeur', title: 'Code Krijger', icon: <Gamepad2 size={24} />, description: 'Je hebt de game code gehackt!', color: 'bg-duck-acid text-duck-ink' },
    { id: 'verhalen-ontwerper', title: 'Meester Verteller', icon: <BookOpen size={24} />, description: 'Een prachtig verhaal gecreëerd.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'ai-trainer', title: 'Data Trainer', icon: <BrainCircuit size={24} />, description: 'De AI slim getraind.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'nepnieuws-speurder', title: 'Waarheidszoeker', icon: <Search size={24} />, description: 'Fake news ontmaskerd.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'review-week-1', title: 'Tijdreiziger', icon: <RotateCcw size={24} />, description: 'De tijdlijn hersteld.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'magister-master', title: 'Planner Pro', icon: <Calendar size={24} />, description: 'De school app getemd.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'print-pro', title: 'Print Meester', icon: <Printer size={24} />, description: 'De printer verslagen.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'slide-specialist', title: 'Slide Ster', icon: <Projector size={24} />, description: 'Een top presentatie gemaakt.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'word-wizard', title: 'Woord Tovenaar', icon: <FileText size={24} />, description: 'Een magisch document gemaakt.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'cloud-commander', title: 'Cloud Kapitein', icon: <Cloud size={24} />, description: 'De cloud beheerst.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'social-media-psychologist', title: 'Filter Breker', icon: <Share2 size={24} />, description: 'De bubbel doorgeprikt.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'ai-tekengame', title: 'Kunstenaar', icon: <Palette size={24} />, description: 'AI kunst gemaakt.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'chatbot-trainer', title: 'Chatbot Expert', icon: <MessageSquare size={24} />, description: 'Een chatbot gebouwd.', color: 'bg-duck-acid text-duck-ink' },
    { id: 'ai-beleid-brainstorm', title: 'Beleidsmaker', icon: <Scale size={24} />, description: 'Nieuwe regels bedacht.', color: 'bg-duck-ink text-duck-acid' },
];

const TrophyRoom = ({ completedMissions }: { completedMissions: string[] }) => {
    const earnedCount = BADGES.filter(b => completedMissions.includes(b.id)).length;
    const progress = Math.round((earnedCount / BADGES.length) * 100);

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="mb-8 bg-duck-ink p-6 rounded-[1.5rem]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-display text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <Trophy className="text-duck-acid" /> Jouw Trofeeënhal
                        </h3>
                        <p className="text-white/65 font-medium text-sm">Verzamel badges door missies te voltooien!</p>
                    </div>
                    <div className="text-right">
                        <div className="font-display text-3xl font-black text-duck-acid">{earnedCount}/{BADGES.length}</div>
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Verzameld</div>
                    </div>
                </div>
                <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-duck-acid transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {BADGES.map(badge => {
                    const isUnlocked = completedMissions.includes(badge.id);
                    return (
                        <div key={badge.id} className={`relative group p-4 rounded-[1.25rem] border-2 transition-all duration-300 ${isUnlocked ? 'bg-white border-duck-ink/10 shadow-duck-soft hover:scale-105 hover:border-duck-ink' : 'bg-duck-bgLight border-duck-ink/10 opacity-60 grayscale'}`}>
                            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center shadow-sm ${isUnlocked ? badge.color : 'bg-duck-ink/10 text-duck-ink/40'}`}>
                                {badge.icon}
                            </div>
                            <div className="text-center">
                                <h4 className={`font-black text-sm mb-1 ${isUnlocked ? 'text-duck-ink' : 'text-duck-ink/55'}`}>{badge.title}</h4>
                                <p className="text-[10px] font-medium text-duck-ink/65 leading-tight">{badge.description}</p>
                            </div>
                            {isUnlocked && (
                                <div className="absolute top-2 right-2 text-duck-ink/55 animate-in zoom-in spin-in-90 duration-500">
                                    <Award size={16} />
                                </div>
                            )}
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-duck-bg/50 backdrop-blur-[1px] rounded-[1.25rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-duck-ink text-duck-acid text-[10px] font-bold px-2 py-1 rounded">Nog niet behaald</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onUpdateProfile, onLogout, initialTab }) => {
    const defaultStats: UserStats = { xp: 0, level: 1, missionsCompleted: [], inventory: [], avatarConfig: DEFAULT_AVATAR_CONFIG };
    const stats: UserStats = {
        ...defaultStats,
        ...user.stats,
        inventory: user.stats?.inventory || [],
        avatarConfig: normalizeAvatarConfig(user.stats?.avatarConfig)
    };

    const hasDoneOnboarding = stats.hasCompletedOnboarding;
    const [activeTab, setActiveTab] = useState<'profile' | 'shop' | 'trophies' | 'privacy'>(initialTab || 'profile');
    const [onboardingStep, setOnboardingStep] = useState<number | null>(hasDoneOnboarding ? null : 0);
    const [previewConfig, setPreviewConfig] = useState<AvatarConfig>(stats.avatarConfig || DEFAULT_AVATAR_CONFIG);
    const [activePart, setActivePart] = useState<'shirt' | 'pants' | 'hair' | 'accessory' | 'skin' | 'eyes'>('shirt');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const onboardingHairStyles = getAvatarHairOptionsForGender(previewConfig.gender);

    const handlePartClick = (part: string) => {
        // Map clicked parts to customizable categories
        if (part === 'shoes') setActivePart('pants');
        else if (part === 'shirt') setActivePart('shirt');
        else if (part === 'pants') setActivePart('pants');
        else if (part === 'hair' || part === 'hat') setActivePart('hair');
        else if (part === 'accessory') setActivePart('accessory');
        else if (part === 'eyes' || part === 'face') setActivePart('eyes');
        else if (part === 'skin') setActivePart('skin');

        // Klikken op een lichaamsdeel opent de winkel; die kiest zelf de
        // juiste categorie via zijn eigen tabbladen.
        setActiveTab('shop');
    };


    const completeOnboarding = () => {
        onUpdateProfile({
            stats: {
                ...stats,
                hasCompletedOnboarding: true,
                avatarConfig: previewConfig
            }
        });
        setOnboardingStep(null);
    };




    return (
        <div className="min-h-screen bg-duck-bg font-sans text-duck-ink overflow-y-auto pt-safe pl-safe pr-safe pb-20">

            <div className="w-full max-w-[95%] lg:max-w-[1920px] mx-auto p-4 lg:p-8">

                {/* Header Nav */}
                {onboardingStep === null && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 min-h-[44px] text-duck-ink/65 hover:text-duck-ink font-bold uppercase tracking-widest text-xs transition-colors self-start sm:self-auto"
                        >
                            <ChevronLeft size={16} /> Terug naar Dashboard
                        </button>

                        <div className="flex items-center gap-3 bg-white pl-2 pr-6 py-2 rounded-full shadow-duck-soft border border-duck-ink/10">
                            <div className="bg-duck-acid border border-duck-ink w-10 h-10 rounded-full flex items-center justify-center text-duck-ink">
                                <Trophy size={20} fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-duck-ink/65 uppercase tracking-wider">Jouw Saldo</span>
                                <span className="font-black text-duck-ink leading-none">{stats.xp} XP</span>
                            </div>
                        </div>
                    </div>
                )}

                {onboardingStep !== null ? (
                    <div className="flex-1 bg-white rounded-[1.5rem] shadow-duck-soft border border-duck-ink/10 overflow-hidden flex flex-col md:flex-row h-[85dvh] min-h-[600px] animate-in zoom-in duration-500 relative">
                        {/* Close Button */}
                        <button
                            onClick={onBack}
                            className="absolute top-6 right-6 z-50 w-11 h-11 bg-white/80 backdrop-blur border border-duck-ink/15 rounded-full flex items-center justify-center text-duck-ink/65 hover:text-duck-ink hover:bg-white transition-all shadow-duck-soft"
                            title="Sluiten"
                        >
                            <X size={20} />
                        </button>

                        <div className="md:w-1/2 relative border-r border-duck-ink/10 bg-duck-bg">
                            <LazyAvatarViewer
                                config={previewConfig}
                                onPartClick={handlePartClick}
                            />
                            <div className="absolute top-6 left-6">
                                <span className="bg-duck-acid text-duck-ink border border-duck-ink px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-duck-soft">Stap {onboardingStep + 1} / 5</span>
                            </div>
                        </div>

                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto custom-scrollbar bg-white">
                            {onboardingStep === 0 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h2 className="font-display text-4xl font-black text-duck-ink leading-tight">Hoi {user.displayName}! 👋<br /><span className="italic">Klaar voor de start?</span></h2>
                                    <p className="text-duck-ink/65 font-medium text-lg">Laten we samen jouw avatar maken. Dit is hoe jij eruit ziet in het digitale lab.</p>
                                    <button onClick={() => setOnboardingStep(1)} className="w-full py-5 bg-duck-acid text-duck-ink border border-duck-ink rounded-2xl font-bold text-lg shadow-duck-soft active:scale-95 transition-all hover:-translate-y-0.5">Laten we beginnen!</button>
                                </div>
                            )}

                            {onboardingStep === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h3 className="font-display text-2xl font-black text-duck-ink">Wie ben jij?</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setPreviewConfig({ ...previewConfig, gender: 'male', hairStyle: 'short', baseModel: 'standard' })} className={`p-6 rounded-2xl border-2 transition-all ${previewConfig.gender === 'male' ? 'border-duck-ink bg-duck-acid' : 'border-duck-ink/10 bg-white hover:border-duck-ink/40'}`}>
                                            <div className="text-4xl mb-2">👦</div>
                                            <div className="font-bold text-duck-ink">Jongen</div>
                                        </button>
                                        <button onClick={() => setPreviewConfig({ ...previewConfig, gender: 'female', hairStyle: 'pigtails', baseModel: 'slim' })} className={`p-6 rounded-2xl border-2 transition-all ${previewConfig.gender === 'female' ? 'border-duck-ink bg-duck-acid' : 'border-duck-ink/10 bg-white hover:border-duck-ink/40'}`}>
                                            <div className="text-4xl mb-2">👧</div>
                                            <div className="font-bold text-duck-ink">Meisje</div>
                                        </button>
                                    </div>
                                    <button onClick={() => setOnboardingStep(2)} className="w-full py-4 bg-duck-ink text-duck-acid rounded-xl font-bold hover:-translate-y-0.5 transition-all active:scale-95 shadow-duck-soft mt-4">Volgende stap</button>
                                </div>
                            )}

                            {onboardingStep === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h3 className="font-display text-2xl font-black text-duck-ink">Kies je kapsel</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {onboardingHairStyles.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => !item.locked && setPreviewConfig({ ...previewConfig, hairStyle: item.value })}
                                                disabled={item.locked}
                                                className={`min-h-[44px] p-3 rounded-xl border-2 transition-all relative ${item.locked
                                                    ? 'border-duck-ink/10 bg-duck-ink/5 text-duck-ink/50 cursor-not-allowed opacity-60'
                                                    : previewConfig.hairStyle === item.value
                                                        ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                        : 'border-duck-ink/10 bg-white hover:border-duck-ink/40'
                                                    }`}
                                            >
                                                <div className={`text-xs font-bold truncate flex items-center justify-center gap-1 ${previewConfig.hairStyle === item.value && !item.locked ? 'text-duck-ink' : 'text-duck-ink/65'}`}>
                                                    {item.label}
                                                    {item.locked && <Lock size={11} className="text-duck-ink/45" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => setOnboardingStep(1)} className="flex-1 py-4 bg-duck-bgLight border border-duck-ink/20 text-duck-ink rounded-xl font-bold hover:border-duck-ink transition-all">Terug</button>
                                        <button onClick={() => setOnboardingStep(3)} className="flex-2 py-4 bg-duck-ink text-duck-acid rounded-xl font-bold px-8 shadow-duck-soft hover:-translate-y-0.5 transition-all active:scale-95">Kleur kiezen</button>
                                    </div>
                                </div>
                            )}

                            {onboardingStep === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 text-center">
                                    <h3 className="font-display text-2xl font-black text-duck-ink">Kies je kleuren!</h3>
                                    <p className="text-duck-ink/65 font-medium text-sm">Klik op je avatar om een onderdeel te kiezen.</p>

                                    {/* Active Part Indicator */}
                                    <div className="flex justify-center gap-2 mb-2 flex-wrap">
                                        {[
                                            { id: 'hair', label: 'Haar', icon: '💇' },
                                            { id: 'eyes', label: 'Ogen', icon: '👁️' },
                                            { id: 'shirt', label: 'Shirt', icon: '👕' },
                                            { id: 'pants', label: 'Broek', icon: '👖' },
                                        ].map(part => (
                                            <button
                                                key={part.id}
                                                onClick={() => setActivePart(part.id as any)}
                                                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 ${activePart === part.id
                                                    ? 'bg-duck-ink text-duck-acid border-duck-ink'
                                                    : 'bg-white text-duck-ink/65 border-duck-ink/10 hover:border-duck-ink/40'
                                                    }`}
                                            >
                                                <span className="mr-2">{part.icon}</span> {part.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-duck-bgLight rounded-[1.5rem] p-4 border border-duck-ink/10 min-h-[200px] flex flex-col justify-center">
                                        {activePart === 'hair' && (
                                            <CircularColorPicker
                                                selectedColor={previewConfig.hairColor || '#08283B'}
                                                onSelect={(c) => setPreviewConfig({ ...previewConfig, hairColor: c })}
                                                label="Kleur van je Haar"
                                            />
                                        )}
                                        {activePart === 'eyes' && (
                                            <CircularColorPicker
                                                selectedColor={previewConfig.eyeColor || '#08283B'}
                                                onSelect={(c) => setPreviewConfig({ ...previewConfig, eyeColor: c })}
                                                label="Kleur van je Ogen"
                                            />
                                        )}
                                        {activePart === 'shirt' && (
                                            <CircularColorPicker
                                                selectedColor={previewConfig.shirtColor}
                                                onSelect={(c) => setPreviewConfig({ ...previewConfig, shirtColor: c })}
                                                label="Kleur van je Shirt"
                                            />
                                        )}
                                        {activePart === 'pants' && (
                                            <CircularColorPicker
                                                selectedColor={previewConfig.pantsColor}
                                                onSelect={(c) => setPreviewConfig({ ...previewConfig, pantsColor: c })}
                                                label="Kleur van je Broek"
                                            />
                                        )}
                                        {activePart === 'accessory' && (
                                            <div className="text-center py-4 text-duck-ink/65 font-medium">
                                                Selecteer een ander onderdeel om te kleuren.
                                            </div>
                                        )}
                                        {activePart === 'skin' && (
                                            <div className="text-center py-4 text-duck-ink/65 font-medium">
                                                Huidskleur kun je bij stap 2 kiezen!
                                                <button
                                                    onClick={() => setOnboardingStep(1)}
                                                    className="block mx-auto mt-2 text-duck-ink font-bold hover:underline"
                                                >
                                                    Ga terug
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => setOnboardingStep(2)} className="flex-1 py-4 bg-duck-bgLight border border-duck-ink/20 text-duck-ink rounded-xl font-bold hover:border-duck-ink transition-all">Terug</button>
                                        <button onClick={() => setOnboardingStep(4)} className="flex-2 py-4 bg-duck-ink text-duck-acid rounded-xl font-bold px-8 shadow-duck-soft hover:-translate-y-0.5 transition-all active:scale-95">Laatste stap</button>
                                    </div>
                                </div>
                            )}

                            {onboardingStep === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
                                    <div className="w-20 h-20 bg-duck-acid rounded-full flex items-center justify-center text-duck-ink mx-auto shadow-duck-soft border-2 border-duck-ink mb-4">
                                        <Crown size={40} fill="currentColor" />
                                    </div>
                                    <h3 className="font-display text-3xl font-black text-duck-ink">Helemaal klaar! 🚀</h3>
                                    <p className="text-duck-ink/65 font-medium text-lg max-w-sm mx-auto">Je avatar ziet er geweldig uit. Je bent nu een echte Future Architect.</p>
                                    <div className="flex flex-col gap-3 mt-8">
                                        <button onClick={completeOnboarding} className="w-full py-5 bg-duck-acid text-duck-ink border border-duck-ink rounded-2xl font-black text-xl shadow-duck-soft transition-all active:scale-95 hover:-translate-y-0.5">Start je Avontuur!</button>
                                        <button onClick={() => setOnboardingStep(3)} className="w-full py-3 text-duck-ink/65 font-bold hover:text-duck-ink transition-colors">Kleur aanpassen</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100dvh-180px)] min-h-[600px]">
                        {/* De winkel brengt zijn eigen, grotere preview mee en
                            krijgt daarom de volle breedte. */}
                        <div className={`${activeTab === 'shop' ? 'hidden' : 'lg:col-span-5'} flex flex-col gap-6 max-h-[50vh] lg:max-h-[calc(100dvh-220px)]`}>
                            <div className="flex-1 bg-white rounded-[1.5rem] p-1 shadow-duck-soft relative overflow-hidden border border-duck-ink/10">
                                <div className="w-full h-full relative rounded-[1.4rem] overflow-hidden bg-duck-bg">
                                    <div className="absolute top-0 w-full p-6 z-10 flex justify-between items-start">
                                        <div>
                                            <h2 className="font-display text-duck-ink font-black text-3xl">{user.displayName}</h2>
                                            <p className="text-duck-ink/65 font-bold text-xs uppercase tracking-widest mt-1">Level {stats.level} Architect</p>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <div className="bg-duck-ink text-duck-acid px-3 py-1 rounded-full text-xs font-bold">3D</div>
                                            <button
                                                onClick={() => setShowResetConfirm(true)}
                                                className="bg-white/70 backdrop-blur text-duck-ink/65 w-11 h-11 flex items-center justify-center rounded-full hover:bg-white hover:text-duck-ink transition-colors shadow-sm"
                                                title="Reset Avatar"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                            {showResetConfirm && (
                                                <div className="absolute top-16 right-4 z-20 bg-white rounded-[1.25rem] shadow-duck-soft border border-duck-ink/10 p-4 w-56 animate-in zoom-in-95 duration-200">
                                                    <p className="text-xs font-bold text-duck-ink/65 mb-3">Avatar resetten naar standaard?</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowResetConfirm(false)}
                                                            className="flex-1 py-2 bg-duck-bgLight border border-duck-ink/20 text-duck-ink rounded-lg text-xs font-bold hover:border-duck-ink transition-colors"
                                                        >Nee</button>
                                                        <button
                                                            onClick={() => {
                                                                const resetConfig = { ...DEFAULT_AVATAR_CONFIG, gender: stats.avatarConfig?.gender || 'male' };
                                                                onUpdateProfile({ stats: { ...stats, avatarConfig: resetConfig } });
                                                                setPreviewConfig(resetConfig);
                                                                setShowResetConfirm(false);
                                                            }}
                                                            className="flex-1 py-2 bg-duck-error text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                                        >Reset</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <LazyAvatarViewer config={activeTab === 'shop' ? previewConfig : (stats.avatarConfig || DEFAULT_AVATAR_CONFIG)} />
                                </div>
                            </div>
                        </div>

                        <div className={`${activeTab === 'shop' ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col gap-4 h-full`}>
                            <div className="bg-white p-2 rounded-2xl shadow-duck-soft border border-duck-ink/10 flex gap-2 shrink-0">
                                <button onClick={() => setActiveTab('profile')} className={`flex-1 min-h-[44px] py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-duck-ink text-duck-acid' : 'text-duck-ink/65 hover:bg-duck-ink/5'}`}><User size={16} /> Stats</button>
                                <button onClick={() => setActiveTab('shop')} className={`flex-1 min-h-[44px] py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'shop' ? 'bg-duck-ink text-duck-acid' : 'text-duck-ink/65 hover:bg-duck-ink/5'}`}><ShoppingBag size={16} /> Winkel</button>
                                <button onClick={() => setActiveTab('trophies')} className={`flex-1 min-h-[44px] py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'trophies' ? 'bg-duck-ink text-duck-acid' : 'text-duck-ink/65 hover:bg-duck-ink/5'}`}><Trophy size={16} /> Trofeeën</button>
                                <button onClick={() => setActiveTab('privacy')} className={`flex-1 min-h-[44px] py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'privacy' ? 'bg-duck-ink text-duck-acid' : 'text-duck-ink/65 hover:bg-duck-ink/5'}`}><ShieldCheck size={16} /> Privacy</button>
                            </div>
                            <div className="bg-white rounded-[1.5rem] p-8 shadow-duck-soft border border-duck-ink/10 overflow-y-auto custom-scrollbar flex-1">
                            {activeTab === 'privacy' ? (
                                <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-duck-ink/20 border-t-duck-ink rounded-full animate-spin" /></div>}>
                                    <ConsentManager
                                        studentId={user.uid}
                                        schoolId={user.schoolId || 'unknown'}
                                        studentAge={estimateStudentAge(user.yearGroup, user.educationLevel)}
                                        studentName={user.displayName || ''}
                                        schoolName={user.schoolId || ''}
                                    />
                                </Suspense>
                            ) : activeTab === 'trophies' ? (
                                <TrophyRoom completedMissions={stats.missionsCompleted || []} />
                            ) : activeTab === 'profile' ? (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-duck-acid border border-duck-ink text-duck-ink rounded-xl"><Award size={24} /></div>
                                        <div>
                                            <h3 className="font-display text-xl font-black text-duck-ink">Jouw Prestaties</h3>
                                            <p className="text-sm text-duck-ink/65 font-medium">Badges verdiend in het lab.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <BadgeDisplay icon="🚀" label="Startklaar" unlocked={true} color="bg-duck-acid text-duck-ink" />
                                        <BadgeDisplay icon="🤖" label="AI Expert" unlocked={stats.missionsCompleted?.includes('ai-lab')} color="bg-duck-ink text-duck-acid" />
                                        <BadgeDisplay icon="🛡️" label="Verdediger" unlocked={stats.missionsCompleted?.includes('digitale-wereld')} color="bg-duck-ink text-duck-acid" />
                                        <BadgeDisplay icon="💎" label="Verzamelaar" unlocked={stats.xp > 500} color="bg-duck-ink text-duck-acid" />
                                    </div>
                                    <div className="h-px bg-duck-ink/10 my-8"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-duck-bgLight rounded-[1.5rem] p-6">
                                            <div className="text-duck-ink/65 font-bold text-[10px] uppercase tracking-widest mb-2">Missies</div>
                                            <div className="font-display text-4xl font-black text-duck-ink">{stats.missionsCompleted?.length || 0}</div>
                                        </div>
                                        <div className="bg-duck-bgLight rounded-[1.5rem] p-6">
                                            <div className="text-duck-ink/65 font-bold text-[10px] uppercase tracking-widest mb-2">XP Totaal</div>
                                            <div className="font-display text-4xl font-black text-duck-ink">{stats.xp}</div>
                                        </div>
                                    </div>

                                    {/* VSO Profile Selection */}
                                    <div className="mt-10 p-8 bg-duck-bgLight rounded-[1.5rem] border border-duck-ink/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-duck-acid border border-duck-ink rounded-lg text-duck-ink"><Scale size={20} /></div>
                                            <div>
                                                <h4 className="font-display font-black text-duck-ink tracking-tight">Mijn Leerprofiel</h4>
                                                <p className="text-xs text-duck-ink/65">Kies je uitstroomprofiel voor aangepaste leerdoelen.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => onUpdateProfile({ stats: { ...stats, vsoProfile: 'dagbesteding' } })}
                                                className={`p-5 rounded-2xl border-2 transition-all text-left ${stats.vsoProfile === 'dagbesteding' ? 'bg-white border-duck-ink ring-4 ring-duck-acid' : 'bg-white border-duck-ink/10 hover:border-duck-ink/40'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-2xl">🌱</span>
                                                    {stats.vsoProfile === 'dagbesteding' && <CheckCircle2 size={16} className="text-duck-ink" />}
                                                </div>
                                                <div className="font-black text-duck-ink text-sm">Dagbesteding</div>
                                                <p className="text-[10px] text-duck-ink/65 mt-1 leading-tight">Focus op verkennen en samendoen.</p>
                                            </button>

                                            <button
                                                onClick={() => onUpdateProfile({ stats: { ...stats, vsoProfile: 'arbeidsmarkt' } })}
                                                className={`p-5 rounded-2xl border-2 transition-all text-left ${stats.vsoProfile === 'arbeidsmarkt' ? 'bg-white border-duck-ink ring-4 ring-duck-acid' : 'bg-white border-duck-ink/10 hover:border-duck-ink/40'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-2xl">💼</span>
                                                    {stats.vsoProfile === 'arbeidsmarkt' && <CheckCircle2 size={16} className="text-duck-ink" />}
                                                </div>
                                                <div className="font-black text-duck-ink text-sm">Arbeidsmarkt</div>
                                                <p className="text-[10px] text-duck-ink/65 mt-1 leading-tight">Focus op zelfstandigheid en beheersing.</p>
                                            </button>
                                        </div>
                                        
                                        {!stats.vsoProfile && (
                                            <div className="mt-4 flex items-center gap-2 text-duck-ink bg-duck-acid p-3 rounded-xl border border-duck-ink">
                                                <AlertTriangle size={14} />
                                                <span className="text-[10px] font-bold">Kies een profiel om je voortgang beter te volgen!</span>
                                            </div>
                                        )}
                                    </div>


                                </div>
                            ) : (
                                <AvatarShop
                                    stats={stats}
                                    onStatsChange={(next) => onUpdateProfile({ stats: next })}
                                />
                            )}
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

const BadgeDisplay = ({ icon, label, unlocked, color }: { icon: string, label: string, unlocked: boolean, color: string }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${unlocked ? 'border-duck-ink/10 bg-white hover:border-duck-ink hover:shadow-duck-soft' : 'border-dashed border-duck-ink/15 bg-duck-bgLight opacity-50'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${color} shadow-sm`}>
            {icon}
        </div>
        <div className="text-[10px] font-black text-duck-ink uppercase tracking-widest text-center leading-tight">{label}</div>
    </div>
);
