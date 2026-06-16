import React, { useState, lazy, Suspense } from 'react';
import { User, Shield, Trophy, ChevronLeft, Sparkles, ShoppingBag, Palette, Crown, Headphones, Shirt, Columns as Pants, Smile, Glasses, Bot, Backpack, Zap, Scissors, X, Award, Gamepad2, BookOpen, BrainCircuit, Search, RotateCcw, Calendar, Printer, Projector, FileText, Cloud, Share2, MessageSquare, Scale, Save, Star, Heart, Laugh, Meh, Dumbbell, CheckCircle2, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';
import { ParentUser, UserStats, AvatarConfig, DEFAULT_AVATAR_CONFIG, EducationLevel } from '../types';
import { LazyAvatarViewer } from './LazyAvatarViewer';
import { AvatarViewer2D } from './AvatarViewer2D';
import { AVATAR_HAIR_CATALOG, getAvatarHairOptionsForGender } from '../config/avatarCatalog';

const ConsentManager = lazy(() => import('./consent/ConsentManager').then(m => ({ default: m.ConsentManager })));

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
            {label && <span className="text-[10px] font-black text-lab-muted uppercase tracking-widest">{label}</span>}
            <div
                className={`relative ${sizeClasses} rounded-full cursor-crosshair shadow-xl border-2 border-white overflow-hidden group transition-transform active:scale-95`}
                style={{ background: 'conic-gradient(from 180deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
                onClick={handlePick}
            >
                <div className={`absolute ${indicatorInset} rounded-full bg-white/20 backdrop-blur-sm pointer-events-none border border-white/30`} />
                <div className={`absolute ${previewInset} rounded-full shadow-inner pointer-events-none flex items-center justify-center`} style={{ backgroundColor: selectedColor }}>
                    <div className={`${size === 'sm' ? 'w-3 h-3' : 'w-6 h-6'} rounded-full bg-white/40 border border-white/50 animate-pulse`} />
                </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded shadow-sm border border-lab-muted" style={{ backgroundColor: selectedColor }} />
                <span className="text-[9px] font-mono font-bold text-lab-muted uppercase">{selectedColor}</span>
            </div>
        </div>
    );
};

type ShopItem = {
    id: string;
    type: 'gender' | 'baseModel' | 'skinColor' | 'shirtColor' | 'pantsColor' | 'hairStyle' | 'shirtStyle' | 'pantsStyle' | 'accessory' | 'expression' | 'pose';
    value: string;
    label: string;
    price: number;
    icon: React.ReactNode;
    gender?: AvatarConfig['gender'];
};

const HAIR_SHOP_ITEMS: ShopItem[] = AVATAR_HAIR_CATALOG.map(item => ({
    id: item.id,
    type: 'hairStyle',
    value: item.value,
    label: item.label,
    price: item.price,
    icon: <Scissors size={16} />,
    gender: item.gender,
}));

// Expanded Shop Catalog
// BALANCE: Students earn ~5-10 XP per interaction. After 90 min (~40 actions), they should afford 2-3 items.
// Target: 300-400 XP after 90 min. Cheap items: 75-100 XP. Medium: 150-200 XP. Premium: 300-500+ XP.
const SHOP_ITEMS: ShopItem[] = [
    // ═══════════════════════════════════════════════════════════════════════════════
    // LICHAAM & BASIS - Gratis basis opties voor iedereen
    // ═══════════════════════════════════════════════════════════════════════════════
    { id: 'gender_male', type: 'gender', value: 'male', label: 'Jongen', price: 0, icon: <Smile size={16} /> },
    { id: 'gender_female', type: 'gender', value: 'female', label: 'Meisje', price: 0, icon: <Smile size={16} /> },
    { id: 'model_std', type: 'baseModel', value: 'standard', label: 'Standaard', price: 0, icon: <User size={16} /> },
    { id: 'model_slim', type: 'baseModel', value: 'slim', label: 'Sportief', price: 0, icon: <Zap size={16} /> },
    { id: 'model_bot', type: 'baseModel', value: 'robot', label: 'Robot', price: 500, icon: <Bot size={16} /> },

    // --- HUIDSKLEUR (Uitgebreid!) ---
    { id: 'skin_pale', type: 'skinColor', value: '#f5d0b0', label: 'Huid: Licht', price: 0, icon: <Palette size={16} /> },
    { id: 'skin_fair', type: 'skinColor', value: '#ffe0bd', label: 'Huid: Crème', price: 0, icon: <Palette size={16} /> },
    { id: 'skin_tan', type: 'skinColor', value: '#d18a6a', label: 'Huid: Getint', price: 0, icon: <Palette size={16} /> },
    { id: 'skin_olive', type: 'skinColor', value: '#c68642', label: 'Huid: Olijf', price: 0, icon: <Palette size={16} /> },
    { id: 'skin_brown', type: 'skinColor', value: '#a0522d', label: 'Huid: Bruin', price: 0, icon: <Palette size={16} /> },
    { id: 'skin_dark', type: 'skinColor', value: '#8d5524', label: 'Huid: Donker', price: 0, icon: <Palette size={16} /> },
    { id: 'skin_ebony', type: 'skinColor', value: '#614335', label: 'Huid: Ebben', price: 0, icon: <Palette size={16} /> },

    // ═══════════════════════════════════════════════════════════════════════════════
    // KAPSELS
    // ═══════════════════════════════════════════════════════════════════════════════
    ...HAIR_SHOP_ITEMS,

    // ═══════════════════════════════════════════════════════════════════════════════
    // SHIRTS & BOVENKLEDING (15+ opties!)
    // ═══════════════════════════════════════════════════════════════════════════════
    // --- BASIC (Gratis/Goedkoop) ---
    { id: 'shirt_basic', type: 'shirtStyle', value: 't-shirt', label: 'Basis T-Shirt', price: 0, icon: <Shirt size={16} /> },
    { id: 'shirt_polo', type: 'shirtStyle', value: 'polo', label: 'Polo Shirt', price: 75, icon: <Shirt size={16} /> },
    { id: 'shirt_tank', type: 'shirtStyle', value: 'tank', label: 'Tanktop', price: 50, icon: <Shirt size={16} /> },

    // --- CASUAL (Medium) ---
    { id: 'shirt_hoodie', type: 'shirtStyle', value: 'hoodie', label: 'Hoodie', price: 150, icon: <Shirt size={16} /> },
    { id: 'shirt_varsity', type: 'shirtStyle', value: 'varsity', label: 'College Jacket', price: 175, icon: <Shirt size={16} /> },
    { id: 'shirt_sweater', type: 'shirtStyle', value: 'sweater', label: 'Trui', price: 125, icon: <Shirt size={16} /> },
    { id: 'shirt_flannel', type: 'shirtStyle', value: 'flannel', label: 'Flanellen Hemd', price: 150, icon: <Shirt size={16} /> },
    { id: 'shirt_denim', type: 'shirtStyle', value: 'denim', label: 'Denim Jasje', price: 200, icon: <Shirt size={16} /> },

    // --- SPORTY ---
    { id: 'shirt_jersey', type: 'shirtStyle', value: 'jersey', label: 'Sport Jersey', price: 175, icon: <Shirt size={16} /> },
    { id: 'shirt_track', type: 'shirtStyle', value: 'trackjacket', label: 'Trainingsjack', price: 200, icon: <Shirt size={16} /> },

    // --- PREMIUM ---
    { id: 'shirt_leather', type: 'shirtStyle', value: 'leather', label: 'Leren Jas', price: 400, icon: <Shirt size={16} /> },
    { id: 'shirt_bomber', type: 'shirtStyle', value: 'bomber', label: 'Bomber Jacket', price: 350, icon: <Shirt size={16} /> },
    { id: 'shirt_blazer', type: 'shirtStyle', value: 'blazer', label: 'Blazer', price: 300, icon: <Shirt size={16} /> },
    { id: 'shirt_puffer', type: 'shirtStyle', value: 'puffer', label: 'Puffer Jacket', price: 375, icon: <Shirt size={16} /> },
    { id: 'shirt_kimono', type: 'shirtStyle', value: 'kimono', label: 'Kimono', price: 450, icon: <Shirt size={16} /> },

    // ═══════════════════════════════════════════════════════════════════════════════
    // BROEKEN (10+ opties!)
    // ═══════════════════════════════════════════════════════════════════════════════
    { id: 'pants_jeans', type: 'pantsStyle', value: 'standard', label: 'Jeans', price: 0, icon: <Pants size={16} /> },
    { id: 'pants_chinos', type: 'pantsStyle', value: 'chinos', label: 'Chino', price: 75, icon: <Pants size={16} /> },
    { id: 'pants_shorts', type: 'pantsStyle', value: 'shorts', label: 'Korte Broek', price: 50, icon: <Pants size={16} /> },
    { id: 'pants_joggers', type: 'pantsStyle', value: 'joggers', label: 'Joggingbroek', price: 100, icon: <Pants size={16} /> },
    { id: 'pants_cargo', type: 'pantsStyle', value: 'cargo', label: 'Cargo Broek', price: 150, icon: <Pants size={16} /> },
    { id: 'pants_skinny', type: 'pantsStyle', value: 'skinny', label: 'Skinny Jeans', price: 125, icon: <Pants size={16} /> },
    { id: 'pants_ripped', type: 'pantsStyle', value: 'ripped', label: 'Gescheurde Jeans', price: 175, icon: <Pants size={16} /> },
    { id: 'pants_baggy', type: 'pantsStyle', value: 'baggy', label: 'Baggy Pants', price: 150, icon: <Pants size={16} /> },
    { id: 'pants_sweat', type: 'pantsStyle', value: 'sweatpants', label: 'Sweatpants', price: 100, icon: <Pants size={16} /> },
    { id: 'pants_formal', type: 'pantsStyle', value: 'formal', label: 'Nette Broek', price: 200, icon: <Pants size={16} /> },
    { id: 'pants_skirt', type: 'pantsStyle', value: 'skirt', label: 'Rok', price: 125, icon: <Pants size={16} /> },
    { id: 'pants_pleated', type: 'pantsStyle', value: 'pleated', label: 'Plooirok', price: 175, icon: <Pants size={16} /> },

    // ═══════════════════════════════════════════════════════════════════════════════
    // ACCESSOIRES (20+ opties!)
    // ═══════════════════════════════════════════════════════════════════════════════
    // --- HOOFD ---
    { id: 'acc_none', type: 'accessory', value: 'none', label: 'Geen', price: 0, icon: <Smile size={16} /> },
    { id: 'acc_glasses', type: 'accessory', value: 'glasses', label: 'Coole Bril', price: 100, icon: <Glasses size={16} /> },
    { id: 'acc_sunglasses', type: 'accessory', value: 'sunglasses', label: 'Zonnebril', price: 150, icon: <Glasses size={16} /> },
    { id: 'acc_cap', type: 'accessory', value: 'cap', label: 'Pet', price: 125, icon: <Crown size={16} /> },
    { id: 'acc_beanie', type: 'accessory', value: 'beanie', label: 'Muts', price: 100, icon: <Crown size={16} /> },
    { id: 'acc_bandana', type: 'accessory', value: 'bandana', label: 'Bandana', price: 75, icon: <Crown size={16} /> },
    { id: 'acc_headphones', type: 'accessory', value: 'headphones', label: 'Koptelefoon', price: 250, icon: <Headphones size={16} /> },
    { id: 'acc_earbuds', type: 'accessory', value: 'earbuds', label: 'Oordopjes', price: 200, icon: <Headphones size={16} /> },
    { id: 'acc_crown', type: 'accessory', value: 'crown', label: 'Kroon', price: 800, icon: <Crown size={16} /> },
    { id: 'acc_halo', type: 'accessory', value: 'halo', label: 'Halo', price: 600, icon: <Sparkles size={16} /> },

    // --- LICHAAM ---
    { id: 'acc_backpack', type: 'accessory', value: 'backpack', label: 'Rugzak', price: 175, icon: <Backpack size={16} /> },
    { id: 'acc_satchel', type: 'accessory', value: 'satchel', label: 'Schoudertas', price: 150, icon: <Backpack size={16} /> },
    { id: 'acc_watch', type: 'accessory', value: 'watch', label: 'Horloge', price: 200, icon: <Zap size={16} /> },
    { id: 'acc_smartwatch', type: 'accessory', value: 'smartwatch', label: 'Smartwatch', price: 350, icon: <Zap size={16} /> },
    { id: 'acc_necklace', type: 'accessory', value: 'necklace', label: 'Ketting', price: 175, icon: <Sparkles size={16} /> },
    { id: 'acc_chain', type: 'accessory', value: 'chain', label: 'Gouden Ketting', price: 400, icon: <Sparkles size={16} /> },
    { id: 'acc_scarf', type: 'accessory', value: 'scarf', label: 'Sjaal', price: 100, icon: <Shirt size={16} /> },
    { id: 'acc_bowtie', type: 'accessory', value: 'bowtie', label: 'Vlinderdas', price: 125, icon: <Shirt size={16} /> },
    { id: 'acc_tie', type: 'accessory', value: 'tie', label: 'Stropdas', price: 150, icon: <Shirt size={16} /> },

    // --- SPECIAAL ---
    { id: 'acc_skate', type: 'accessory', value: 'skateboard', label: 'Skateboard', price: 500, icon: <Zap size={16} /> },
    { id: 'acc_guitar', type: 'accessory', value: 'guitar', label: 'Gitaar', price: 600, icon: <Zap size={16} /> },
    { id: 'acc_wings', type: 'accessory', value: 'wings', label: 'Vleugels', price: 750, icon: <Sparkles size={16} /> },
    { id: 'acc_cape', type: 'accessory', value: 'cape', label: 'Cape', price: 500, icon: <Sparkles size={16} /> },
    { id: 'acc_sword', type: 'accessory', value: 'sword', label: 'Zwaard', price: 450, icon: <Zap size={16} /> },
    { id: 'acc_shield', type: 'accessory', value: 'shield', label: 'Schild', price: 400, icon: <Shield size={16} /> },
    { id: 'acc_pet_cat', type: 'accessory', value: 'pet_cat', label: 'Huisdier: Kat', price: 700, icon: <Sparkles size={16} /> },
    { id: 'acc_pet_dog', type: 'accessory', value: 'pet_dog', label: 'Huisdier: Hond', price: 700, icon: <Sparkles size={16} /> },
    { id: 'acc_robot_arm', type: 'accessory', value: 'robot_arm', label: 'Robot Arm', price: 650, icon: <Bot size={16} /> },

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXCLUSIEF & VIP (Expensive!)
    // ═══════════════════════════════════════════════════════════════════════════════
    { id: 'acc_crown_gold', type: 'accessory', value: 'crown_gold', label: 'Gouden Kroon', price: 2500, icon: <Crown size={16} /> },
    { id: 'acc_wings_cyber', type: 'accessory', value: 'wings_cyber', label: 'Cyber Vleugels', price: 3000, icon: <Sparkles size={16} /> },
    { id: 'acc_jetpack', type: 'accessory', value: 'jetpack', label: 'Jetpack', price: 3500, icon: <Zap size={16} /> },
    { id: 'acc_suit_diamond', type: 'shirtStyle', value: 'suit_diamond', label: 'Diamanten Pak', price: 5000, icon: <Award size={16} /> },
    { id: 'acc_pet_robo', type: 'accessory', value: 'pet_robo', label: 'Robo-Pet', price: 4000, icon: <Bot size={16} /> },

    // ═══════════════════════════════════════════════════════════════════════════════
    // UITDRUKKINGEN - Gezichtsuitdrukkingen
    // ═══════════════════════════════════════════════════════════════════════════════
    { id: 'expr_neutral', type: 'expression', value: 'neutral', label: 'Neutraal', price: 0, icon: <Meh size={16} /> },
    { id: 'expr_happy', type: 'expression', value: 'happy', label: 'Blij', price: 0, icon: <Smile size={16} /> },
    { id: 'expr_cool', type: 'expression', value: 'cool', label: 'Cool', price: 100, icon: <Glasses size={16} /> },
    { id: 'expr_surprised', type: 'expression', value: 'surprised', label: 'Verrast', price: 100, icon: <Laugh size={16} /> },

    // ═══════════════════════════════════════════════════════════════════════════════
    // POSES - Lichaamshoudingen
    // ═══════════════════════════════════════════════════════════════════════════════
    { id: 'pose_idle', type: 'pose', value: 'idle', label: 'Standaard', price: 0, icon: <User size={16} /> },
    { id: 'pose_wave', type: 'pose', value: 'wave', label: 'Zwaaien', price: 75, icon: <Heart size={16} /> },
    { id: 'pose_dab', type: 'pose', value: 'dab', label: 'Dab', price: 150, icon: <Dumbbell size={16} /> },
    { id: 'pose_peace', type: 'pose', value: 'peace', label: 'Peace', price: 100, icon: <Star size={16} /> },
];

// ═══════════════════════════════════════════════════════════════════════════════
// BADGES & TROPHIES
// ═══════════════════════════════════════════════════════════════════════════════
const BADGES = [
    { id: 'game-programmeur', title: 'Code Krijger', icon: <Gamepad2 size={24} />, description: 'Je hebt de game code gehackt!', color: 'bg-lab-sage' },
    { id: 'verhalen-ontwerper', title: 'Meester Verteller', icon: <BookOpen size={24} />, description: 'Een prachtig verhaal gecreëerd.', color: 'bg-pink-500' },
    { id: 'ai-trainer', title: 'Data Trainer', icon: <BrainCircuit size={24} />, description: 'De AI slim getraind.', color: 'bg-indigo-500' },
    { id: 'nepnieuws-speurder', title: 'Waarheidszoeker', icon: <Search size={24} />, description: 'Fake news ontmaskerd.', color: 'bg-red-500' },
    { id: 'review-week-1', title: 'Tijdreiziger', icon: <RotateCcw size={24} />, description: 'De tijdlijn hersteld.', color: 'bg-lab-gold' },
    { id: 'magister-master', title: 'Planner Pro', icon: <Calendar size={24} />, description: 'De school app getemd.', color: 'bg-blue-500' },
    { id: 'print-pro', title: 'Print Meester', icon: <Printer size={24} />, description: 'De printer verslagen.', color: 'bg-lab-muted' },
    { id: 'slide-specialist', title: 'Slide Ster', icon: <Projector size={24} />, description: 'Een top presentatie gemaakt.', color: 'bg-orange-500' },
    { id: 'word-wizard', title: 'Woord Tovenaar', icon: <FileText size={24} />, description: 'Een magisch document gemaakt.', color: 'bg-cyan-500' },
    { id: 'cloud-commander', title: 'Cloud Kapitein', icon: <Cloud size={24} />, description: 'De cloud beheerst.', color: 'bg-sky-500' },
    { id: 'social-media-psychologist', title: 'Filter Breker', icon: <Share2 size={24} />, description: 'De bubbel doorgeprikt.', color: 'bg-lab-teal' },
    { id: 'ai-tekengame', title: 'Kunstenaar', icon: <Palette size={24} />, description: 'AI kunst gemaakt.', color: 'bg-purple-500' },
    { id: 'chatbot-trainer', title: 'Chatbot Expert', icon: <MessageSquare size={24} />, description: 'Een chatbot gebouwd.', color: 'bg-green-500' },
    { id: 'ai-beleid-brainstorm', title: 'Beleidsmaker', icon: <Scale size={24} />, description: 'Nieuwe regels bedacht.', color: 'bg-lab-teal' },
];

const TrophyRoom = ({ completedMissions }: { completedMissions: string[] }) => {
    const earnedCount = BADGES.filter(b => completedMissions.includes(b.id)).length;
    const progress = Math.round((earnedCount / BADGES.length) * 100);

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="mb-8 bg-gradient-to-r from-amber-100 to-yellow-50 p-6 rounded-3xl border border-lab-gold">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-black text-lab-gold uppercase tracking-tight flex items-center gap-2">
                            <Trophy className="text-lab-gold" /> Jouw Trofeeënhal
                        </h3>
                        <p className="text-lab-gold/80 font-medium text-sm">Verzamel badges door missies te voltooien!</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-lab-gold">{earnedCount}/{BADGES.length}</div>
                        <div className="text-[10px] font-bold text-lab-gold uppercase tracking-widest">Verzameld</div>
                    </div>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-lab-gold">
                    <div className="h-full bg-lab-gold transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {BADGES.map(badge => {
                    const isUnlocked = completedMissions.includes(badge.id);
                    return (
                        <div key={badge.id} className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 ${isUnlocked ? 'bg-white border-lab-muted shadow-lg hover:scale-105 hover:shadow-xl hover:border-indigo-100' : 'bg-lab-muted border-lab-muted opacity-60 grayscale'}`}>
                            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white shadow-md ${isUnlocked ? badge.color : 'bg-lab-muted'}`}>
                                {badge.icon}
                            </div>
                            <div className="text-center">
                                <h4 className={`font-black text-sm mb-1 ${isUnlocked ? 'text-lab-muted' : 'text-lab-muted'}`}>{badge.title}</h4>
                                <p className="text-[10px] font-medium text-lab-muted leading-tight">{badge.description}</p>
                            </div>
                            {isUnlocked && (
                                <div className="absolute top-2 right-2 text-lab-sage animate-in zoom-in spin-in-90 duration-500">
                                    <Award size={16} />
                                </div>
                            )}
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-lab-muted/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-lab-muted text-white text-[10px] font-bold px-2 py-1 rounded">Nog niet behaald</span>
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
        avatarConfig: user.stats?.avatarConfig ? { ...DEFAULT_AVATAR_CONFIG, ...user.stats.avatarConfig } : DEFAULT_AVATAR_CONFIG
    };

    const hasDoneOnboarding = stats.hasCompletedOnboarding;
    const [activeTab, setActiveTab] = useState<'profile' | 'shop' | 'trophies' | 'privacy'>(initialTab || 'profile');
    const [shopCategory, setShopCategory] = useState<'all' | 'gender' | 'body' | 'hair' | 'clothes' | 'acc' | 'colors' | 'emotes'>('all');
    const [onboardingStep, setOnboardingStep] = useState<number | null>(hasDoneOnboarding ? null : 0);
    const [previewConfig, setPreviewConfig] = useState<AvatarConfig>(stats.avatarConfig || DEFAULT_AVATAR_CONFIG);
    const [activePart, setActivePart] = useState<'shirt' | 'pants' | 'hair' | 'accessory' | 'skin' | 'eyes'>('shirt');
    const [itemToPurchase, setItemToPurchase] = useState<typeof SHOP_ITEMS[0] | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [xpLockInfo, setXpLockInfo] = useState<{ item: typeof SHOP_ITEMS[0]; needed: number } | null>(null);
    const equippedConfigRef = React.useRef<AvatarConfig>(stats.avatarConfig || DEFAULT_AVATAR_CONFIG);
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

        // Always switch to shop -> colors when clicking a part
        setActiveTab('shop');
        setShopCategory('colors');
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

    const initiatePurchase = (item: typeof SHOP_ITEMS[0]) => {
        if (stats.xp >= item.price) {
            setItemToPurchase(item);
        } else {
            setXpLockInfo({ item, needed: item.price - stats.xp });
        }
    };

    const confirmPurchase = () => {
        if (!itemToPurchase) return;

        const newStats = {
            ...stats,
            xp: stats.xp - itemToPurchase.price,
            inventory: [...stats.inventory, itemToPurchase.id]
        };

        // Also auto-equip the new item
        const newConfig = { ...previewConfig } as AvatarConfig;
        const item = itemToPurchase;

        if (item.type === 'baseModel') newConfig.baseModel = item.value as any;
        if (item.type === 'shirtColor') newConfig.shirtColor = item.value;
        if (item.type === 'pantsColor') newConfig.pantsColor = item.value;
        if (item.type === 'pantsStyle') newConfig.pantsStyle = item.value as any;
        if (item.type === 'skinColor') newConfig.skinColor = item.value;
        if (item.type === 'accessory') newConfig.accessory = item.value as any;
        if (item.type === 'hairStyle') newConfig.hairStyle = item.value as any;
        if (item.type === 'shirtStyle') newConfig.shirtStyle = item.value as any;
        if (item.type === 'gender') newConfig.gender = item.value as any;
        if (item.type === 'expression') newConfig.expression = item.value as any;
        if (item.type === 'pose') newConfig.pose = item.value as any;

        newStats.avatarConfig = newConfig;

        onUpdateProfile({ stats: newStats });
        setPreviewConfig(newConfig);
        equippedConfigRef.current = newConfig;
        setItemToPurchase(null);
    };

    const handleEquip = (item: typeof SHOP_ITEMS[0]) => {
        const newConfig = { ...stats.avatarConfig } as AvatarConfig;

        if (item.type === 'baseModel') newConfig.baseModel = item.value as any;
        if (item.type === 'shirtColor') newConfig.shirtColor = item.value;
        if (item.type === 'pantsColor') newConfig.pantsColor = item.value;
        if (item.type === 'pantsStyle') newConfig.pantsStyle = item.value as any;
        if (item.type === 'skinColor') newConfig.skinColor = item.value;
        if (item.type === 'accessory') newConfig.accessory = item.value as any;
        if (item.type === 'hairStyle') newConfig.hairStyle = item.value as any;
        if (item.type === 'shirtStyle') {
            newConfig.shirtStyle = item.value as any;
        }
        if (item.type === 'expression') newConfig.expression = item.value as any;
        if (item.type === 'pose') newConfig.pose = item.value as any;
        if (item.type === 'accessory') {
            newConfig.accessory = item.value as any;
            if (!newConfig.accessoryColor) newConfig.accessoryColor = '#D97848';
        }
        if (item.type === 'gender') {
            newConfig.gender = item.value as any;
            if (item.value === 'female') {
                newConfig.hairStyle = 'pigtails';
                newConfig.baseModel = 'slim';
            } else {
                newConfig.hairStyle = 'short';
                newConfig.baseModel = 'standard';
            }
        }

        const newStats = { ...stats, avatarConfig: newConfig };
        onUpdateProfile({ stats: newStats });
        setPreviewConfig(newConfig);
        equippedConfigRef.current = newConfig;
    };

    // Outfit Save/Load
    const handleSaveOutfit = (slotIndex: number) => {
        const currentOutfits = stats.savedOutfits ? [...stats.savedOutfits] : [undefined, undefined, undefined];
        while (currentOutfits.length < 3) currentOutfits.push(undefined as any);
        currentOutfits[slotIndex] = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG) };
        onUpdateProfile({ stats: { ...stats, savedOutfits: currentOutfits as AvatarConfig[] } });
    };

    const handleLoadOutfit = (outfit: AvatarConfig) => {
        onUpdateProfile({ stats: { ...stats, avatarConfig: outfit } });
        setPreviewConfig(outfit);
    };

    // Helper to get preview config for purchase modal
    const getPurchasePreviewConfig = () => {
        if (!itemToPurchase) return previewConfig;
        const tempConfig = { ...previewConfig };
        if (itemToPurchase.type === 'baseModel') tempConfig.baseModel = itemToPurchase.value as any;
        if (itemToPurchase.type === 'shirtColor') tempConfig.shirtColor = itemToPurchase.value;
        if (itemToPurchase.type === 'pantsColor') tempConfig.pantsColor = itemToPurchase.value;
        if (itemToPurchase.type === 'pantsStyle') tempConfig.pantsStyle = itemToPurchase.value as any;
        if (itemToPurchase.type === 'skinColor') tempConfig.skinColor = itemToPurchase.value;
        if (itemToPurchase.type === 'accessory') tempConfig.accessory = itemToPurchase.value as any;
        if (itemToPurchase.type === 'hairStyle') tempConfig.hairStyle = itemToPurchase.value as any;
        if (itemToPurchase.type === 'shirtStyle') tempConfig.shirtStyle = itemToPurchase.value as any;
        if (itemToPurchase.type === 'gender') tempConfig.gender = itemToPurchase.value as any;
        if (itemToPurchase.type === 'expression') tempConfig.expression = itemToPurchase.value as any;
        if (itemToPurchase.type === 'pose') tempConfig.pose = itemToPurchase.value as any;
        return tempConfig;
    };

    return (
        <div className="min-h-screen bg-[#FCF6EA] font-sans overflow-y-auto pt-safe pl-safe pr-safe pb-20">

            <div className="w-full max-w-[95%] lg:max-w-[1920px] mx-auto p-4 lg:p-8">

                {/* Header Nav */}
                {onboardingStep === null && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-lab-muted hover:text-indigo-600 font-bold uppercase tracking-widest text-xs transition-colors self-start sm:self-auto"
                        >
                            <ChevronLeft size={16} /> Terug naar Dashboard
                        </button>

                        <div className="flex items-center gap-3 bg-white pl-2 pr-6 py-2 rounded-full shadow-lg border border-lab-muted">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md">
                                <Trophy size={20} fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-lab-muted uppercase tracking-wider">Jouw Saldo</span>
                                <span className="font-black text-lab-muted leading-none">{stats.xp} XP</span>
                            </div>
                        </div>
                    </div>
                )}

                {onboardingStep !== null ? (
                    <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-lab-muted overflow-hidden flex flex-col md:flex-row h-[85dvh] min-h-[600px] animate-in zoom-in duration-500 relative">
                        {/* Close Button */}
                        <button
                            onClick={onBack}
                            className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/80 backdrop-blur border border-lab-muted rounded-full flex items-center justify-center text-lab-muted hover:text-lab-muted hover:bg-white transition-all shadow-lg"
                            title="Sluiten"
                        >
                            <X size={20} />
                        </button>

                        <div className="md:w-1/2 relative border-r border-lab-muted" style={{ backgroundColor: '#FCF6EA' }}>
                            <LazyAvatarViewer
                                config={previewConfig}
                                onPartClick={handlePartClick}
                            />
                            <div className="absolute top-6 left-6">
                                <span className="bg-indigo-600 text-white px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg">Stap {onboardingStep + 1} / 5</span>
                            </div>
                        </div>

                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto custom-scrollbar bg-white">
                            {onboardingStep === 0 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h2 className="text-4xl font-black text-lab-muted leading-tight">Hoi {user.displayName}! 👋<br /><span className="text-indigo-600">Klaar voor de start?</span></h2>
                                    <p className="text-lab-muted font-medium text-lg">Laten we samen jouw avatar maken. Dit is hoe jij eruit ziet in het digitale lab.</p>
                                    <button onClick={() => setOnboardingStep(1)} className="w-full py-5 bg-lab-muted text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all">Laten we beginnen!</button>
                                </div>
                            )}

                            {onboardingStep === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h3 className="text-2xl font-black text-lab-muted">Wie ben jij?</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setPreviewConfig({ ...previewConfig, gender: 'male', hairStyle: 'short', baseModel: 'standard' })} className={`p-6 rounded-2xl border-4 transition-all ${previewConfig.gender === 'male' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50' : 'border-lab-muted'}`}>
                                            <div className="text-4xl mb-2">👦</div>
                                            <div className="font-bold text-lab-muted">Jongen</div>
                                        </button>
                                        <button onClick={() => setPreviewConfig({ ...previewConfig, gender: 'female', hairStyle: 'pigtails', baseModel: 'slim' })} className={`p-6 rounded-2xl border-4 transition-all ${previewConfig.gender === 'female' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50' : 'border-lab-muted'}`}>
                                            <div className="text-4xl mb-2">👧</div>
                                            <div className="font-bold text-lab-muted">Meisje</div>
                                        </button>
                                    </div>
                                    <button onClick={() => setOnboardingStep(2)} className="w-full py-4 bg-lab-muted text-white rounded-xl font-bold hover:bg-lab-muted transition-all active:scale-95 shadow-lg mt-4">Volgende stap</button>
                                </div>
                            )}

                            {onboardingStep === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h3 className="text-2xl font-black text-lab-muted">Kies je kapsel</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {onboardingHairStyles.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => !item.locked && setPreviewConfig({ ...previewConfig, hairStyle: item.value })}
                                                disabled={item.locked}
                                                className={`p-3 rounded-xl border-2 transition-all relative ${item.locked
                                                    ? 'border-lab-muted bg-lab-muted text-lab-muted cursor-not-allowed'
                                                    : previewConfig.hairStyle === item.value
                                                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                                                        : 'border-lab-muted hover:border-lab-muted'
                                                    }`}
                                            >
                                                <div className={`text-xs font-bold truncate flex items-center justify-center gap-1 ${item.locked ? 'text-lab-muted' : 'text-lab-muted'}`}>
                                                    {item.label}
                                                    {item.locked && <Lock size={11} className="text-indigo-400" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => setOnboardingStep(1)} className="flex-1 py-4 bg-lab-muted text-lab-muted rounded-xl font-bold">Terug</button>
                                        <button onClick={() => setOnboardingStep(3)} className="flex-2 py-4 bg-lab-muted text-white rounded-xl font-bold px-8 shadow-lg">Kleur kiezen</button>
                                    </div>
                                </div>
                            )}

                            {onboardingStep === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 text-center">
                                    <h3 className="text-2xl font-black text-lab-muted">Kies je kleuren!</h3>
                                    <p className="text-lab-muted font-medium text-sm">Klik op je avatar om een onderdeel te kiezen.</p>

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
                                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 ${activePart === part.id
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                                                    : 'bg-white text-lab-muted border-lab-muted hover:border-lab-muted'
                                                    }`}
                                            >
                                                <span className="mr-2">{part.icon}</span> {part.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-lab-muted rounded-[2rem] p-4 border border-lab-muted shadow-inner min-h-[200px] flex flex-col justify-center">
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
                                            <div className="text-center py-4 text-lab-muted font-medium">
                                                Selecteer een ander onderdeel om te kleuren.
                                            </div>
                                        )}
                                        {activePart === 'skin' && (
                                            <div className="text-center py-4 text-lab-muted font-medium">
                                                Huidskleur kun je bij stap 2 kiezen!
                                                <button
                                                    onClick={() => setOnboardingStep(1)}
                                                    className="block mx-auto mt-2 text-indigo-600 font-bold hover:underline"
                                                >
                                                    Ga terug
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => setOnboardingStep(2)} className="flex-1 py-4 bg-lab-muted text-lab-muted rounded-xl font-bold">Terug</button>
                                        <button onClick={() => setOnboardingStep(4)} className="flex-2 py-4 bg-lab-muted text-white rounded-xl font-bold px-8 shadow-lg">Laatste stap</button>
                                    </div>
                                </div>
                            )}

                            {onboardingStep === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
                                    <div className="w-20 h-20 bg-lab-sage rounded-full flex items-center justify-center text-lab-sage mx-auto shadow-xl border-4 border-white mb-4">
                                        <Crown size={40} fill="currentColor" />
                                    </div>
                                    <h3 className="text-3xl font-black text-lab-muted">Helemaal klaar! 🚀</h3>
                                    <p className="text-lab-muted font-medium text-lg max-w-sm mx-auto">Je avatar ziet er geweldig uit. Je bent nu een echte Future Architect.</p>
                                    <div className="flex flex-col gap-3 mt-8">
                                        <button onClick={completeOnboarding} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 transition-all active:scale-95 ring-4 ring-indigo-50">Start je Avontuur!</button>
                                        <button onClick={() => setOnboardingStep(3)} className="w-full py-3 text-lab-muted font-bold hover:text-lab-muted transition-colors">Kleur aanpassen</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100dvh-180px)] min-h-[600px]">
                        <div className="lg:col-span-5 flex flex-col gap-6 max-h-[50vh] lg:max-h-[calc(100dvh-220px)]">
                            <div className="flex-1 bg-gradient-to-b from-slate-200 to-white rounded-[2.5rem] p-1 shadow-xl relative overflow-hidden border border-white">
                                <div className="w-full h-full relative rounded-[2.3rem] overflow-hidden" style={{ backgroundColor: '#FCF6EA' }}>
                                    <div className="absolute top-0 w-full p-6 z-10 flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lab-muted font-black text-3xl">{user.displayName}</h2>
                                            <p className="text-lab-muted font-bold text-xs uppercase tracking-widest mt-1">Level {stats.level} Architect</p>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-indigo-200">3D</div>
                                            <button
                                                onClick={() => setShowResetConfirm(true)}
                                                className="bg-white/50 backdrop-blur text-lab-muted p-2 rounded-full hover:bg-white hover:text-red-500 transition-colors shadow-sm"
                                                title="Reset Avatar"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                            {showResetConfirm && (
                                                <div className="absolute top-16 right-4 z-20 bg-white rounded-2xl shadow-2xl border border-lab-muted p-4 w-56 animate-in zoom-in-95 duration-200">
                                                    <p className="text-xs font-bold text-lab-muted mb-3">Avatar resetten naar standaard?</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowResetConfirm(false)}
                                                            className="flex-1 py-2 bg-lab-muted text-lab-muted rounded-lg text-xs font-bold hover:bg-lab-muted transition-colors"
                                                        >Nee</button>
                                                        <button
                                                            onClick={() => {
                                                                const resetConfig = { ...DEFAULT_AVATAR_CONFIG, gender: stats.avatarConfig?.gender || 'male' };
                                                                onUpdateProfile({ stats: { ...stats, avatarConfig: resetConfig } });
                                                                setPreviewConfig(resetConfig);
                                                                setShowResetConfirm(false);
                                                            }}
                                                            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
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

                        <div className="lg:col-span-7 flex flex-col gap-4 h-full">
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-lab-muted flex gap-2 shrink-0">
                                <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-[#D97848] text-white shadow-lg' : 'text-lab-muted hover:bg-lab-muted'}`}><User size={16} /> Stats</button>
                                <button onClick={() => setActiveTab('shop')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'shop' ? 'bg-[#D97848] text-white shadow-lg' : 'text-lab-muted hover:bg-lab-muted'}`}><ShoppingBag size={16} /> Winkel</button>
                                <button onClick={() => setActiveTab('trophies')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'trophies' ? 'bg-[#D97848] text-white shadow-lg' : 'text-lab-muted hover:bg-lab-muted'}`}><Trophy size={16} /> Trofeeën</button>
                                <button onClick={() => setActiveTab('privacy')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'privacy' ? 'bg-[#D97848] text-white shadow-lg' : 'text-lab-muted hover:bg-lab-muted'}`}><ShieldCheck size={16} /> Privacy</button>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-lab-muted overflow-y-auto custom-scrollbar flex-1">
                            {activeTab === 'privacy' ? (
                                <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>}>
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
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Award size={24} /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-lab-muted">Jouw Prestaties</h3>
                                            <p className="text-sm text-lab-muted font-medium">Badges verdiend in het lab.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <BadgeDisplay icon="🚀" label="Startklaar" unlocked={true} color="bg-red-50 text-red-500" />
                                        <BadgeDisplay icon="🤖" label="AI Expert" unlocked={stats.missionsCompleted?.includes('ai-lab')} color="bg-cyan-50 text-cyan-500" />
                                        <BadgeDisplay icon="🛡️" label="Verdediger" unlocked={stats.missionsCompleted?.includes('digitale-wereld')} color="bg-blue-50 text-blue-500" />
                                        <BadgeDisplay icon="💎" label="Verzamelaar" unlocked={stats.xp > 500} color="bg-purple-50 text-purple-500" />
                                    </div>
                                    <div className="h-px bg-lab-muted my-8"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-lab-muted rounded-3xl p-6">
                                            <div className="text-lab-muted font-bold text-[10px] uppercase tracking-widest mb-2">Missies</div>
                                            <div className="text-4xl font-black text-lab-muted">{stats.missionsCompleted?.length || 0}</div>
                                        </div>
                                        <div className="bg-lab-muted rounded-3xl p-6">
                                            <div className="text-lab-muted font-bold text-[10px] uppercase tracking-widest mb-2">XP Totaal</div>
                                            <div className="text-4xl font-black text-lab-muted">{stats.xp}</div>
                                        </div>
                                    </div>

                                    {/* VSO Profile Selection */}
                                    <div className="mt-10 p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100/50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Scale size={20} /></div>
                                            <div>
                                                <h4 className="font-black text-lab-muted uppercase tracking-tight">Mijn Leerprofiel</h4>
                                                <p className="text-xs text-lab-muted">Kies je uitstroomprofiel voor aangepaste leerdoelen.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => onUpdateProfile({ stats: { ...stats, vsoProfile: 'dagbesteding' } })}
                                                className={`p-5 rounded-2xl border-2 transition-all text-left ${stats.vsoProfile === 'dagbesteding' ? 'bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50' : 'bg-white/50 border-lab-muted hover:border-indigo-200'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-2xl">🌱</span>
                                                    {stats.vsoProfile === 'dagbesteding' && <CheckCircle2 size={16} className="text-indigo-600" />}
                                                </div>
                                                <div className="font-black text-lab-muted text-sm">Dagbesteding</div>
                                                <p className="text-[10px] text-lab-muted mt-1 leading-tight">Focus op verkennen en samendoen.</p>
                                            </button>

                                            <button 
                                                onClick={() => onUpdateProfile({ stats: { ...stats, vsoProfile: 'arbeidsmarkt' } })}
                                                className={`p-5 rounded-2xl border-2 transition-all text-left ${stats.vsoProfile === 'arbeidsmarkt' ? 'bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50' : 'bg-white/50 border-lab-muted hover:border-indigo-200'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-2xl">💼</span>
                                                    {stats.vsoProfile === 'arbeidsmarkt' && <CheckCircle2 size={16} className="text-indigo-600" />}
                                                </div>
                                                <div className="font-black text-lab-muted text-sm">Arbeidsmarkt</div>
                                                <p className="text-[10px] text-lab-muted mt-1 leading-tight">Focus op zelfstandigheid en beheersing.</p>
                                            </button>
                                        </div>
                                        
                                        {!stats.vsoProfile && (
                                            <div className="mt-4 flex items-center gap-2 text-lab-gold bg-lab-gold p-3 rounded-xl border border-lab-gold">
                                                <AlertTriangle size={14} />
                                                <span className="text-[10px] font-bold">Kies een profiel om je voortgang beter te volgen!</span>
                                            </div>
                                        )}
                                    </div>


                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6 h-full">
                                    {/* Boutique Sidebar */}
                                    <aside className="w-full md:w-20 lg:w-48 flex md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0 h-auto md:h-full hide-scrollbar">
                                        {[
                                            { id: 'all', label: 'Alles', icon: <ShoppingBag size={20} /> },
                                            { id: 'gender', label: 'Geslacht', icon: <Smile size={20} /> },
                                            { id: 'body', label: 'Lichaam', icon: <User size={20} /> },
                                            { id: 'hair', label: 'Kapsels', icon: <Scissors size={20} /> },
                                            { id: 'clothes', label: 'Kleding', icon: <Shirt size={20} /> },
                                            { id: 'acc', label: 'Details', icon: <Backpack size={20} /> },
                                            { id: 'colors', label: 'Kleuren', icon: <Palette size={20} /> }
                                        ].map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setShopCategory(cat.id as any)}
                                                className={`
                                                        flex flex-1 md:flex-none items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                                                        ${shopCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-lab-muted hover:bg-lab-muted'}
                                                    `}
                                            >
                                                <span className="shrink-0">{cat.icon}</span>
                                                <span className="hidden lg:inline">{cat.label}</span>
                                            </button>
                                        ))}
                                    </aside>

                                    {/* Shop Content Area */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-12">
                                        {(shopCategory === 'all' || shopCategory === 'gender') && (
                                            <CategorySection title="Geslacht" items={SHOP_ITEMS.filter(i => i.type === 'gender')} stats={stats} handlePurchase={initiatePurchase} handleEquip={handleEquip} previewConfig={previewConfig} setPreviewConfig={setPreviewConfig} equippedConfigRef={equippedConfigRef} />
                                        )}

                                        {(shopCategory === 'all' || shopCategory === 'body') && (
                                            <CategorySection title="Lichaam & Basis" items={SHOP_ITEMS.filter(i => i.type === 'baseModel' || i.type === 'skinColor')} stats={stats} handlePurchase={initiatePurchase} handleEquip={handleEquip} previewConfig={previewConfig} setPreviewConfig={setPreviewConfig} equippedConfigRef={equippedConfigRef} />
                                        )}

                                        {(shopCategory === 'all' || shopCategory === 'hair') && (
                                            <CategorySection title="Kapsels" items={SHOP_ITEMS.filter(i => i.type === 'hairStyle' && (!i.gender || i.gender === previewConfig.gender))} stats={stats} handlePurchase={initiatePurchase} handleEquip={handleEquip} previewConfig={previewConfig} setPreviewConfig={setPreviewConfig} equippedConfigRef={equippedConfigRef} />
                                        )}

                                        {(shopCategory === 'all' || shopCategory === 'clothes') && (
                                            <CategorySection title="Broeken" items={SHOP_ITEMS.filter(i => i.type === 'pantsStyle')} stats={stats} handlePurchase={initiatePurchase} handleEquip={handleEquip} previewConfig={previewConfig} setPreviewConfig={setPreviewConfig} equippedConfigRef={equippedConfigRef} />
                                        )}

                                        {(shopCategory === 'all' || shopCategory === 'colors') && (
                                            <div className="space-y-6 animate-in fade-in duration-500">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Palette size={20} /></div>
                                                    <h4 className="font-black text-lab-muted uppercase tracking-widest text-sm">Kleuren & Stijl</h4>
                                                </div>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 bg-lab-muted/50 p-6 rounded-[2.5rem] border border-lab-muted">
                                                    <CircularColorPicker
                                                        size="sm"
                                                        selectedColor={activeTab === 'shop' ? previewConfig.shirtColor : (stats.avatarConfig?.shirtColor || '#0B453F')}
                                                        onSelect={(c) => {
                                                            const newConfig = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG), shirtColor: c };
                                                            onUpdateProfile({ stats: { ...stats, avatarConfig: newConfig } });
                                                            setPreviewConfig(newConfig);
                                                        }}
                                                        label="Shirt"
                                                    />
                                                    <CircularColorPicker
                                                        size="sm"
                                                        selectedColor={activeTab === 'shop' ? previewConfig.pantsColor : (stats.avatarConfig?.pantsColor || '#08283B')}
                                                        onSelect={(c) => {
                                                            const newConfig = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG), pantsColor: c };
                                                            onUpdateProfile({ stats: { ...stats, avatarConfig: newConfig } });
                                                            setPreviewConfig(newConfig);
                                                        }}
                                                        label="Broek"
                                                    />
                                                    <CircularColorPicker
                                                        size="sm"
                                                        selectedColor={activeTab === 'shop' ? (previewConfig.hairColor || '#08283B') : (stats.avatarConfig?.hairColor || '#08283B')}
                                                        onSelect={(c) => {
                                                            const newConfig = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG), hairColor: c };
                                                            onUpdateProfile({ stats: { ...stats, avatarConfig: newConfig } });
                                                            setPreviewConfig(newConfig);
                                                        }}
                                                        label="Haar"
                                                    />
                                                    <CircularColorPicker
                                                        size="sm"
                                                        selectedColor={activeTab === 'shop' ? (previewConfig.shoeColor || '#08283B') : (stats.avatarConfig?.shoeColor || '#08283B')}
                                                        onSelect={(c) => {
                                                            const newConfig = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG), shoeColor: c };
                                                            onUpdateProfile({ stats: { ...stats, avatarConfig: newConfig } });
                                                            setPreviewConfig(newConfig);
                                                        }}
                                                        label="Schoenen"
                                                    />
                                                    {previewConfig.accessory !== 'none' && (
                                                        <CircularColorPicker
                                                            size="sm"
                                                            selectedColor={activeTab === 'shop' ? (previewConfig.accessoryColor || '#D97848') : (stats.avatarConfig?.accessoryColor || '#D97848')}
                                                            onSelect={(c) => {
                                                                const newConfig = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG), accessoryColor: c };
                                                                onUpdateProfile({ stats: { ...stats, avatarConfig: newConfig } });
                                                                setPreviewConfig(newConfig);
                                                            }}
                                                            label="Detail"
                                                        />
                                                    )}
                                                    <CircularColorPicker
                                                        size="sm"
                                                        selectedColor={activeTab === 'shop' ? (previewConfig.eyeColor || '#08283B') : (stats.avatarConfig?.eyeColor || '#08283B')}
                                                        onSelect={(c) => {
                                                            const newConfig = { ...(stats.avatarConfig || DEFAULT_AVATAR_CONFIG), eyeColor: c };
                                                            onUpdateProfile({ stats: { ...stats, avatarConfig: newConfig } });
                                                            setPreviewConfig(newConfig);
                                                        }}
                                                        label="Ogen"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {(shopCategory === 'all' || shopCategory === 'clothes') && (
                                            <CategorySection
                                                title="Kleding (Stijl)"
                                                items={SHOP_ITEMS.filter(i => i.type === 'shirtStyle')}
                                                stats={stats}
                                                handlePurchase={initiatePurchase}
                                                handleEquip={handleEquip}
                                                previewConfig={previewConfig}
                                                setPreviewConfig={setPreviewConfig}
                                                equippedConfigRef={equippedConfigRef}
                                                onEditColor={handlePartClick}
                                            />
                                        )}

                                        {(shopCategory === 'all' || shopCategory === 'acc') && (
                                            <CategorySection
                                                title="Accessoires"
                                                items={SHOP_ITEMS.filter(i => i.type === 'accessory')}
                                                stats={stats}
                                                handlePurchase={initiatePurchase}
                                                handleEquip={handleEquip}
                                                previewConfig={previewConfig}
                                                setPreviewConfig={setPreviewConfig}
                                                equippedConfigRef={equippedConfigRef}
                                                onEditColor={handlePartClick}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                )}
            </div>
            {/* XP LOCK INFO MODAL — duidelijke benodigde XP indicatie i.p.v. generiek alert */}
            {xpLockInfo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-lab-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy size={28} className="text-lab-gold" />
                            </div>
                            <h3 className="text-xl font-black text-lab-muted mb-2">
                                Nog {xpLockInfo.needed} XP nodig
                            </h3>
                            <p className="text-lab-muted text-sm mb-4">
                                <span className="font-bold text-lab-gold">{xpLockInfo.item.label}</span> kost {xpLockInfo.item.price} XP. Je hebt nu {stats.xp} XP.
                            </p>
                            <p className="text-lab-muted text-xs mb-6">
                                Voltooi missies en verdien XP om dit item te ontgrendelen.
                            </p>
                            <button
                                onClick={() => setXpLockInfo(null)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Begrepen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PURCHASE CONFIRMATION MODAL */}
            {itemToPurchase && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="relative h-64 border-b border-lab-muted" style={{ backgroundColor: '#FCF6EA' }}>
                            <LazyAvatarViewer config={getPurchasePreviewConfig()} />
                            <div className="absolute top-4 right-4">
                                <span className="bg-lab-gold text-lab-gold px-3 py-1 rounded-full text-xs font-bold border border-lab-gold">
                                    Preview
                                </span>
                            </div>
                        </div>
                        <div className="p-8 text-center">
                            <h3 className="text-2xl font-black text-lab-muted mb-2">
                                {itemToPurchase.label} kopen?
                            </h3>
                            <p className="text-lab-muted mb-8">
                                Weet je zeker dat je dit item wilt kopen voor <span className="font-bold text-lab-gold">{itemToPurchase.price} XP</span>?
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setItemToPurchase(null)}
                                    className="flex-1 py-4 bg-lab-muted hover:bg-lab-muted text-lab-muted rounded-xl font-bold transition-colors"
                                >
                                    Nee, laat maar
                                </button>
                                <button
                                    onClick={confirmPurchase}
                                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={18} />
                                    Ja, kopen!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

const BadgeDisplay = ({ icon, label, unlocked, color }: { icon: string, label: string, unlocked: boolean, color: string }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${unlocked ? 'border-lab-muted bg-white hover:border-indigo-100 hover:shadow-lg' : 'border-dashed border-lab-muted bg-lab-muted opacity-50'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${color} shadow-sm`}>
            {icon}
        </div>
        <div className="text-[10px] font-black text-lab-muted uppercase tracking-widest text-center leading-tight">{label}</div>
    </div>
);

const HEAD_TYPES = ['hairStyle', 'skinColor', 'expression', 'gender'];

const getItemPreviewConfig = (item: any, baseConfig: AvatarConfig): AvatarConfig => {
    const config = { ...baseConfig };
    if (item.type === 'baseModel') config.baseModel = item.value;
    if (item.type === 'shirtColor') config.shirtColor = item.value;
    if (item.type === 'pantsColor') config.pantsColor = item.value;
    if (item.type === 'pantsStyle') config.pantsStyle = item.value;
    if (item.type === 'skinColor') config.skinColor = item.value;
    if (item.type === 'accessory') config.accessory = item.value;
    if (item.type === 'hairStyle') config.hairStyle = item.value;
    if (item.type === 'shirtStyle') config.shirtStyle = item.value;
    if (item.type === 'gender') config.gender = item.value;
    if (item.type === 'pose') config.pose = item.value;
    if (item.type === 'expression') config.expression = item.value;
    return config;
};

const CategorySection = ({ title, items, stats, handlePurchase, handleEquip, previewConfig, setPreviewConfig, equippedConfigRef, ...props }: any) => {
    const baseConfig = equippedConfigRef?.current || stats.avatarConfig || DEFAULT_AVATAR_CONFIG;

    return (
    <div>
        <h4 className="font-bold text-lab-muted mb-4 px-1">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item: any) => {
                const isOwned = item.price === 0 || stats.inventory.includes(item.id);
                const notEnoughMoney = !isOwned && stats.xp < item.price;
                const isEquipped =
                    (item.type === 'baseModel' && stats.avatarConfig?.baseModel === item.value) ||
                    (item.type === 'shirtColor' && stats.avatarConfig?.shirtColor === item.value) ||
                    (item.type === 'pantsColor' && stats.avatarConfig?.pantsColor === item.value) ||
                    (item.type === 'pantsStyle' && stats.avatarConfig?.pantsStyle === item.value) ||
                    (item.type === 'skinColor' && stats.avatarConfig?.skinColor === item.value) ||
                    (item.type === 'accessory' && stats.avatarConfig?.accessory === item.value) ||
                    (item.type === 'hairStyle' && stats.avatarConfig?.hairStyle === item.value) ||
                    (item.type === 'shirtStyle' && stats.avatarConfig?.shirtStyle === item.value) ||
                    (item.type === 'gender' && stats.avatarConfig?.gender === item.value);

                const itemPreviewConfig = getItemPreviewConfig(item, baseConfig);
                const useHeadVariant = HEAD_TYPES.includes(item.type);

                return (
                    <button
                        key={item.id}
                        onClick={() => isOwned ? handleEquip(item) : handlePurchase(item)}
                        onMouseEnter={() => {
                            const newConfig = { ...previewConfig };
                            if (item.type === 'baseModel') newConfig.baseModel = item.value;
                            if (item.type === 'shirtColor') newConfig.shirtColor = item.value;
                            if (item.type === 'pantsColor') newConfig.pantsColor = item.value;
                            if (item.type === 'pantsStyle') newConfig.pantsStyle = item.value;
                            if (item.type === 'skinColor') newConfig.skinColor = item.value;
                            if (item.type === 'accessory') newConfig.accessory = item.value;
                            if (item.type === 'hairStyle') newConfig.hairStyle = item.value;
                            if (item.type === 'shirtStyle') newConfig.shirtStyle = item.value;
                            if (item.type === 'gender') newConfig.gender = item.value;
                            setPreviewConfig(newConfig);
                        }}
                        onMouseLeave={() => setPreviewConfig(equippedConfigRef?.current || stats.avatarConfig || DEFAULT_AVATAR_CONFIG)}
                        disabled={notEnoughMoney}
                        className={`
                            relative text-left p-3 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-2 group
                            ${isEquipped ? 'border-indigo-600 bg-indigo-50/30' : 'border-lab-muted bg-white hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1'}
                            ${!isEquipped && isOwned ? '' : ''}
                            ${!isOwned && !notEnoughMoney ? 'border-indigo-50 bg-indigo-50/20' : ''}
                            ${notEnoughMoney ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                        `}
                    >
                        <div className={`w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 ${isOwned ? 'bg-gradient-to-b from-indigo-50 to-white' : 'bg-gradient-to-b from-slate-50 to-white opacity-60'}`}>
                            <AvatarViewer2D
                                config={itemPreviewConfig}
                                interactive={false}
                                variant={useHeadVariant ? 'head' : 'full'}
                            />
                        </div>

                        <div className="w-full">
                            <div className="font-black text-lab-muted text-xs uppercase tracking-widest truncate leading-tight mb-2">{item.label}</div>
                            {isOwned ? (
                                <div className={`py-1.5 px-3 rounded-full text-[9px] font-black uppercase tracking-widest mx-auto inline-block ${isEquipped ? 'bg-indigo-600 text-white' : 'bg-lab-muted text-lab-muted'}`}>
                                    {isEquipped ? 'In gebruik' : 'Draag'}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1 bg-lab-gold text-lab-gold py-1.5 px-3 rounded-full text-[10px] font-black">
                                    <Trophy size={10} fill="currentColor" /> {item.price} XP
                                </div>
                            )}
                        </div>

                        {/* Color Edit Button (Top Right) */}
                        {isOwned && (item.type === 'accessory' || item.type === 'shirtStyle' || item.type === 'pantsStyle' || item.type === 'hairStyle') ? (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEquip(item); // Ensure it's equipped
                                    // Switch to color mode
                                    const partMap: Record<string, string> = {
                                        'accessory': 'accessory',
                                        'shirtStyle': 'shirt',
                                        'pantsStyle': 'pants',
                                        'hairStyle': 'hair'
                                    };
                                    if ((props as any).onEditColor) {
                                        (props as any).onEditColor(partMap[item.type]);
                                    }
                                }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border border-lab-muted shadow-sm flex items-center justify-center text-lab-muted hover:text-indigo-600 hover:border-indigo-200 cursor-pointer z-10"
                                title="Pas kleur aan"
                            >
                                <Palette size={12} />
                            </div>
                        ) : (isOwned && !isEquipped && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lab-sage" />
                        ))}
                    </button>
                );
            })}
        </div>
    </div>
    );
};
