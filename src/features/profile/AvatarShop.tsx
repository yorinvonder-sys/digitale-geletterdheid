import React, { useMemo, useState } from 'react';
import {
    User, Zap, Bot, Palette, Scissors, Shirt, Columns as Pants, Glasses, Crown,
    Sparkles, Headphones, Backpack, Shield, Award, Heart, Star, Dumbbell, Smile,
    ShoppingBag, Lock, Trophy, Shuffle, Check, Save, RotateCcw,
} from 'lucide-react';
import { AvatarConfig, UserStats } from '@/types';
import { LazyAvatarViewer } from '@/features/profile/avatar/LazyAvatarViewer';
import {
    AvatarCatalogItem,
    AvatarIconKey,
    AvatarRarity,
    AvatarSlot,
    applyCatalogItem,
    getItemsForSlot,
    isOwned,
    normalizeAvatarConfig,
    randomizeAvatarConfig,
} from '@/config/avatarCatalog';
import { getXpBalance } from '@/utils/xp';

interface AvatarShopProps {
    stats: UserStats;
    onStatsChange: (stats: UserStats) => void;
}

const ICONS: Record<AvatarIconKey, React.ReactNode> = {
    user: <User size={22} />,
    zap: <Zap size={22} />,
    bot: <Bot size={22} />,
    palette: <Palette size={22} />,
    scissors: <Scissors size={22} />,
    shirt: <Shirt size={22} />,
    pants: <Pants size={22} />,
    glasses: <Glasses size={22} />,
    crown: <Crown size={22} />,
    sparkles: <Sparkles size={22} />,
    headphones: <Headphones size={22} />,
    backpack: <Backpack size={22} />,
    shield: <Shield size={22} />,
    award: <Award size={22} />,
    heart: <Heart size={22} />,
    star: <Star size={22} />,
    dumbbell: <Dumbbell size={22} />,
    smile: <Smile size={22} />,
};

// Alleen bestaande duck-tokens: bg, bgLight, ink, acid, gray, error.
// Een verzonnen token (duck-teal) levert stil géén rand op.
const RARITY_RING: Record<AvatarRarity, string> = {
    basis: 'border-duck-ink/10',
    zeldzaam: 'border-duck-ink/35',
    episch: 'border-duck-error/60',
    legendarisch: 'border-duck-acid',
};

const RARITY_LABEL: Record<AvatarRarity, string> = {
    basis: 'Basis',
    zeldzaam: 'Zeldzaam',
    episch: 'Episch',
    legendarisch: 'Legendarisch',
};

interface ShopCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    /** Slots die onder dit tabblad vallen, met de kop erboven. */
    sections: { slot: AvatarSlot; title: string }[];
}

const CATEGORIES: ShopCategory[] = [
    { id: 'basis', label: 'Basis', icon: <User size={20} />, sections: [{ slot: 'gender', title: 'Wie ben je' }, { slot: 'baseModel', title: 'Lichaamstype' }] },
    { id: 'huid', label: 'Huid', icon: <Palette size={20} />, sections: [{ slot: 'skinColor', title: 'Huidskleur' }] },
    { id: 'haar', label: 'Haar', icon: <Scissors size={20} />, sections: [{ slot: 'hairStyle', title: 'Kapsel' }, { slot: 'hairColor', title: 'Haarkleur' }] },
    { id: 'kleding', label: 'Kleding', icon: <Shirt size={20} />, sections: [{ slot: 'shirtStyle', title: 'Shirts & jassen' }, { slot: 'pantsStyle', title: 'Broeken & rokken' }] },
    { id: 'accessoires', label: 'Details', icon: <Backpack size={20} />, sections: [{ slot: 'accessory', title: 'Accessoires' }] },
    { id: 'huisdieren', label: 'Huisdier', icon: <Heart size={20} />, sections: [{ slot: 'pet', title: 'Huisdieren' }] },
    { id: 'emotes', label: 'Emotes', icon: <Dumbbell size={20} />, sections: [{ slot: 'expression', title: 'Gezichtsuitdrukking' }, { slot: 'pose', title: 'Houding' }] },
    { id: 'kleuren', label: 'Kleuren', icon: <Sparkles size={20} />, sections: [{ slot: 'shirtColor', title: 'Shirtkleur' }, { slot: 'pantsColor', title: 'Broekkleur' }, { slot: 'shoeColor', title: 'Schoenkleur' }, { slot: 'eyeColor', title: 'Oogkleur' }, { slot: 'accessoryColor', title: 'Accessoirekleur' }] },
];

const isColorSlot = (slot: AvatarSlot): boolean => slot.endsWith('Color');

/** Eén item in het raster. Bewust puur DOM: een 3D-canvas per tegel legt een
 *  schoolchromebook plat. De grote preview links toont het item op de avatar. */
const ShopTile: React.FC<{
    item: AvatarCatalogItem;
    owned: boolean;
    equipped: boolean;
    trying: boolean;
    affordable: boolean;
    onPick: () => void;
}> = ({ item, owned, equipped, trying, affordable, onPick }) => {
    const swatch = isColorSlot(item.slot) ? item.swatch : undefined;

    return (
        <button
            onClick={onPick}
            aria-pressed={equipped}
            title={owned ? item.label : `${item.label} — ${item.price} XP`}
            className={`relative text-left p-3 rounded-[1.25rem] border-2 transition-all flex flex-col items-center text-center gap-2 group
                ${equipped ? 'border-duck-ink bg-duck-acid/30' : trying ? 'border-duck-ink border-dashed bg-duck-acid/10' : RARITY_RING[item.rarity]}
                ${!equipped && !trying ? 'bg-white hover:border-duck-ink hover:shadow-duck-soft hover:-translate-y-1' : ''}
                ${!owned && !affordable ? 'opacity-45 grayscale' : ''}`}
        >
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border border-duck-ink/10 bg-duck-bgLight text-duck-ink transition-transform group-hover:scale-105"
                style={swatch ? { backgroundColor: swatch } : undefined}
            >
                {!swatch && (item.emoji ? <span className="text-2xl">{item.emoji}</span> : ICONS[item.iconKey ?? 'user'])}
            </div>

            <div className="w-full">
                <div className="font-black text-duck-ink text-[11px] uppercase tracking-widest truncate leading-tight">{item.label}</div>

                {equipped ? (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-black text-duck-ink">
                        <Check size={11} /> In gebruik
                    </span>
                ) : owned ? (
                    <span className="mt-1 inline-block text-[10px] font-bold text-duck-ink/55">Draag</span>
                ) : (
                    <span className={`mt-1 inline-block text-[10px] font-black ${affordable ? 'text-duck-ink' : 'text-duck-ink/45'}`}>
                        {item.price} XP
                    </span>
                )}

                {!owned && item.rarity !== 'basis' && (
                    <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-wider text-duck-ink/40">
                        {RARITY_LABEL[item.rarity]}
                    </span>
                )}
            </div>

            {!owned && !affordable && (
                <span className="absolute top-2 right-2 text-duck-ink/45"><Lock size={12} /></span>
            )}
        </button>
    );
};

export const AvatarShop: React.FC<AvatarShopProps> = ({ stats, onStatsChange }) => {
    const inventory = stats.inventory ?? [];
    const balance = getXpBalance(stats);

    const equipped = useMemo(() => normalizeAvatarConfig(stats.avatarConfig), [stats.avatarConfig]);

    const [category, setCategory] = useState<string>('basis');
    const [tryingItem, setTryingItem] = useState<AvatarCatalogItem | null>(null);
    const [itemToBuy, setItemToBuy] = useState<AvatarCatalogItem | null>(null);
    const [notEnough, setNotEnough] = useState<{ item: AvatarCatalogItem; needed: number } | null>(null);

    // Wat de leerling in de preview ziet: het gedragen setje, of het item dat
    // hij aan het passen is.
    const displayConfig: AvatarConfig = useMemo(
        () => (tryingItem ? applyCatalogItem(equipped, tryingItem, inventory) : equipped),
        [equipped, tryingItem, inventory]
    );

    const saveConfig = (config: AvatarConfig) => {
        setTryingItem(null);
        onStatsChange({ ...stats, avatarConfig: config });
    };

    /** Bezit → direct aantrekken. Niet in bezit → passen, met een koopbalk. */
    const handlePick = (item: AvatarCatalogItem) => {
        if (isOwned(item, inventory)) {
            saveConfig(applyCatalogItem(equipped, item, inventory));
            return;
        }
        setTryingItem(item);
    };

    const handleBuyIntent = (item: AvatarCatalogItem) => {
        if (balance >= item.price) setItemToBuy(item);
        else setNotEnough({ item, needed: item.price - balance });
    };

    const confirmPurchase = () => {
        if (!itemToBuy) return;
        // Bouwt bewust vanuit het GEDRAGEN setje, niet vanuit de preview: anders
        // kan een item dat je alleen aan het passen was stilletjes meegekocht
        // worden.
        const nextConfig = applyCatalogItem(equipped, itemToBuy, inventory);
        onStatsChange({
            ...stats,
            xpSpent: (stats.xpSpent ?? 0) + itemToBuy.price,
            inventory: [...inventory, itemToBuy.id],
            avatarConfig: nextConfig,
        });
        setItemToBuy(null);
        setTryingItem(null);
    };

    const handleRandomize = () => saveConfig(randomizeAvatarConfig(equipped, inventory));

    // --- Outfits ---------------------------------------------------------
    const outfits = stats.savedOutfits ?? [];

    const saveOutfit = (slot: number) => {
        const next: (AvatarConfig | undefined)[] = [outfits[0], outfits[1], outfits[2]];
        next[slot] = { ...equipped };
        onStatsChange({ ...stats, savedOutfits: next.filter(Boolean) as AvatarConfig[] });
    };

    const wearOutfit = (outfit: AvatarConfig) => saveConfig(normalizeAvatarConfig(outfit));

    const activeCategory = CATEGORIES.find(c => c.id === category) ?? CATEGORIES[0];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Live preview + saldo */}
            <div className="lg:w-[38%] shrink-0 flex flex-col gap-4">
                <div className="relative rounded-[1.5rem] overflow-hidden border border-duck-ink/10 bg-duck-bg h-[320px] lg:h-[460px]">
                    <LazyAvatarViewer config={displayConfig} interactive />
                    {tryingItem && (
                        <span className="absolute top-4 left-4 bg-duck-ink text-duck-acid px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Aan het passen
                        </span>
                    )}
                </div>

                {/* Koopbalk: verschijnt alleen tijdens passen */}
                {tryingItem ? (
                    <div className="rounded-2xl border-2 border-duck-ink bg-white p-4 space-y-3">
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="font-black text-duck-ink text-sm">{tryingItem.label}</span>
                            <span className="font-black text-duck-ink">{tryingItem.price} XP</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTryingItem(null)}
                                className="flex-1 min-h-[44px] rounded-xl border border-duck-ink/20 bg-duck-bgLight font-bold text-duck-ink transition-colors hover:border-duck-ink"
                            >
                                Terug
                            </button>
                            <button
                                onClick={() => handleBuyIntent(tryingItem)}
                                className="flex-[2] min-h-[44px] rounded-xl border border-duck-ink bg-duck-acid font-bold text-duck-ink flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
                            >
                                <ShoppingBag size={16} />
                                Kopen
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full border border-duck-ink/10">
                            <div className="bg-duck-acid border border-duck-ink w-9 h-9 rounded-full flex items-center justify-center text-duck-ink shrink-0">
                                <Trophy size={16} fill="currentColor" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[9px] font-bold text-duck-ink/60 uppercase tracking-wider">Te besteden</span>
                                <span className="font-black text-duck-ink">{balance} XP</span>
                            </div>
                        </div>
                        <button
                            onClick={handleRandomize}
                            title="Stel een willekeurige outfit samen uit wat je al hebt"
                            className="min-h-[44px] px-4 rounded-full border border-duck-ink/15 bg-white font-extrabold text-xs text-duck-ink flex items-center gap-2 transition-all hover:border-duck-ink active:scale-95"
                        >
                            <Shuffle size={14} />
                            Verras me
                        </button>
                    </div>
                )}

                {/* Outfit-plekken */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-duck-ink/55 mb-2">Opgeslagen outfits</p>
                    <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map(slot => {
                            const outfit = outfits[slot];
                            return (
                                <div key={slot} className="rounded-xl border border-duck-ink/10 bg-white p-2 flex flex-col gap-2">
                                    <div className="flex gap-1 justify-center">
                                        {outfit ? (
                                            [outfit.skinColor, outfit.shirtColor, outfit.pantsColor].map((c, i) => (
                                                <span key={i} className="w-4 h-4 rounded border border-duck-ink/10" style={{ backgroundColor: c }} />
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-duck-ink/40 py-1">Leeg</span>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => saveOutfit(slot)}
                                            title="Huidige outfit hier opslaan"
                                            className="flex-1 min-h-[32px] rounded-lg border border-duck-ink/15 text-duck-ink flex items-center justify-center transition-colors hover:border-duck-ink"
                                        >
                                            <Save size={13} />
                                        </button>
                                        <button
                                            onClick={() => outfit && wearOutfit(outfit)}
                                            disabled={!outfit}
                                            title="Deze outfit aantrekken"
                                            className="flex-1 min-h-[32px] rounded-lg border border-duck-ink/15 text-duck-ink flex items-center justify-center transition-colors hover:border-duck-ink disabled:opacity-30"
                                        >
                                            <RotateCcw size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Categorieën + raster */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-w-0">
                <aside className="flex md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-y-auto md:w-16 lg:w-44 pb-2 md:pb-0 hide-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setCategory(cat.id); setTryingItem(null); }}
                            className={`flex flex-1 md:flex-none items-center gap-3 px-4 py-3 min-h-[44px] rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap
                                ${category === cat.id ? 'bg-duck-ink text-duck-acid' : 'text-duck-ink/65 hover:bg-duck-ink/5'}`}
                        >
                            <span className="shrink-0">{cat.icon}</span>
                            <span className="hidden lg:inline">{cat.label}</span>
                        </button>
                    ))}
                </aside>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-8 min-w-0">
                    {activeCategory.sections.map(section => {
                        const items = getItemsForSlot(section.slot, equipped.gender);
                        if (items.length === 0) return null;

                        return (
                            <section key={section.slot}>
                                <h4 className="font-display font-black text-duck-ink text-sm tracking-widest uppercase mb-3">{section.title}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {items.map(item => {
                                        const owned = isOwned(item, inventory);
                                        return (
                                            <ShopTile
                                                key={item.id}
                                                item={item}
                                                owned={owned}
                                                equipped={equipped[section.slot] === item.value}
                                                trying={tryingItem?.id === item.id}
                                                affordable={owned || balance >= item.price}
                                                onPick={() => handlePick(item)}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            {/* Te weinig XP */}
            {notEnough && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-duck-ink/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[1.5rem] shadow-duck-soft w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-duck-acid border border-duck-ink rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy size={28} className="text-duck-ink" />
                        </div>
                        <h3 className="font-display text-xl font-black text-duck-ink mb-2">Nog {notEnough.needed} XP nodig</h3>
                        <p className="text-duck-ink/65 text-sm mb-6">
                            <span className="font-bold text-duck-ink">{notEnough.item.label}</span> kost {notEnough.item.price} XP. Je kunt nu {balance} XP besteden.
                            Voltooi missies om meer te verdienen.
                        </p>
                        <button
                            onClick={() => setNotEnough(null)}
                            className="w-full py-4 bg-duck-acid border border-duck-ink text-duck-ink rounded-xl font-bold transition-transform hover:-translate-y-0.5"
                        >
                            Begrepen
                        </button>
                    </div>
                </div>
            )}

            {/* Aankoop bevestigen */}
            {itemToBuy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-duck-ink/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[1.5rem] shadow-duck-soft w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="relative h-56 border-b border-duck-ink/10 bg-duck-bg">
                            <LazyAvatarViewer config={applyCatalogItem(equipped, itemToBuy, inventory)} interactive={false} />
                        </div>
                        <div className="p-8 text-center">
                            <h3 className="font-display text-2xl font-black text-duck-ink mb-2">{itemToBuy.label} kopen?</h3>
                            <p className="text-duck-ink/65 mb-8">
                                Dit kost <span className="font-bold text-duck-ink">{itemToBuy.price} XP</span>. Daarna hou je {balance - itemToBuy.price} XP over.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setItemToBuy(null)}
                                    className="flex-1 py-4 bg-duck-bgLight border border-duck-ink/20 hover:border-duck-ink text-duck-ink rounded-xl font-bold transition-colors"
                                >
                                    Nee, laat maar
                                </button>
                                <button
                                    onClick={confirmPurchase}
                                    className="flex-1 py-4 bg-duck-acid border border-duck-ink text-duck-ink rounded-xl font-bold transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={18} />
                                    Ja, kopen!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarShop;
