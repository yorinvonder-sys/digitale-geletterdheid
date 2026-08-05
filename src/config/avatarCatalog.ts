import type { AvatarConfig } from '@/types';
import { DEFAULT_AVATAR_CONFIG } from '@/types';

/**
 * Centrale onderdelenlijst voor de avatar.
 *
 * Dit bestand is de ENIGE bron van waarheid voor wat een leerling kan dragen.
 * De instelwizard en de winkel lezen er allebei uit, zodat "vergrendeld"
 * altijd betekent "nog niet in bezit" en nooit een hardgecodeerde vlag is.
 *
 * WAARSCHUWING — `id` is het aankoopbewijs. Elke id staat in
 * `stats.inventory` van leerlingen die het item gekocht hebben. Een id
 * hernoemen of verwijderen ontkoopt dat item bij iedereen. Voeg nieuwe items
 * toe met nieuwe ids; wijzig bestaande ids nooit.
 *
 * Geen JSX in dit bestand: iconen zijn stringsleutels (`iconKey`) die de
 * UI-laag omzet naar een component.
 */

export type AvatarSlot =
    | 'gender'
    | 'baseModel'
    | 'skinColor'
    | 'hairStyle'
    | 'hairColor'
    | 'shirtStyle'
    | 'shirtColor'
    | 'pantsStyle'
    | 'pantsColor'
    | 'shoeColor'
    | 'eyeColor'
    | 'accessoryColor'
    | 'accessory'
    | 'pet'
    | 'expression'
    | 'pose';

/** Koppelt elk slot aan het toegestane waardetype, zodat een typefout in
 *  `value` een compileerfout wordt in plaats van een stille no-op. */
interface AvatarSlotValue {
    gender: AvatarConfig['gender'];
    baseModel: AvatarConfig['baseModel'];
    skinColor: string;
    hairStyle: AvatarConfig['hairStyle'];
    hairColor: string;
    shirtStyle: NonNullable<AvatarConfig['shirtStyle']>;
    shirtColor: string;
    pantsStyle: NonNullable<AvatarConfig['pantsStyle']>;
    pantsColor: string;
    shoeColor: string;
    eyeColor: string;
    accessoryColor: string;
    accessory: AvatarConfig['accessory'];
    pet: NonNullable<AvatarConfig['pet']>;
    expression: NonNullable<AvatarConfig['expression']>;
    pose: NonNullable<AvatarConfig['pose']>;
}

export type AvatarRarity = 'basis' | 'zeldzaam' | 'episch' | 'legendarisch';

export type AvatarIconKey =
    | 'user' | 'zap' | 'bot' | 'palette' | 'scissors' | 'shirt' | 'pants'
    | 'glasses' | 'crown' | 'sparkles' | 'headphones' | 'backpack'
    | 'shield' | 'award' | 'heart' | 'star' | 'dumbbell' | 'smile';

export type AvatarCatalogItem = {
    [S in AvatarSlot]: {
        /** STABIELE SLEUTEL — staat in stats.inventory. Nooit hernoemen. */
        id: string;
        slot: S;
        value: AvatarSlotValue[S];
        /** Nederlandse naam zoals de leerling hem ziet. */
        label: string;
        /** Prijs in XP. 0 = iedereen bezit dit. */
        price: number;
        rarity: AvatarRarity;
        /** Alleen zichtbaar voor dit geslacht. Weglaten = beide. */
        gender?: AvatarConfig['gender'];
        /** Hex-kleur voor kleurslots, gebruikt als staal in de UI. */
        swatch?: string;
        iconKey?: AvatarIconKey;
        emoji?: string;
    };
}[AvatarSlot];

// ---------------------------------------------------------------------------
// Kleurpaletten
// ---------------------------------------------------------------------------

/** Gedeeld kledingpalet. De oude wizard-arrays bevatten dezelfde hex-waarde
 *  tot zes keer, wat dubbele React-keys en schijnkeuzes opleverde. */
const GARMENT_PALETTE: { key: string; hex: string; label: string }[] = [
    { key: 'terracotta', hex: '#D97848', label: 'Terracotta' },
    { key: 'mosterd', hex: '#D7C95F', label: 'Mosterd' },
    { key: 'zeegroen', hex: '#5F947D', label: 'Zeegroen' },
    { key: 'donkergroen', hex: '#0B453F', label: 'Donkergroen' },
    { key: 'nachtblauw', hex: '#08283B', label: 'Nachtblauw' },
    { key: 'leisteen', hex: '#445865', label: 'Leisteen' },
    { key: 'zand', hex: '#E7D8BD', label: 'Zand' },
    { key: 'wit', hex: '#ffffff', label: 'Wit' },
];

type ColorSlot = 'shirtColor' | 'pantsColor' | 'shoeColor' | 'accessoryColor';

const colorItems = (slot: ColorSlot, prefix: string): AvatarCatalogItem[] =>
    GARMENT_PALETTE.map((c): AvatarCatalogItem => ({
        id: `${prefix}_${c.key}`,
        slot,
        value: c.hex,
        label: c.label,
        price: 0,
        rarity: 'basis',
        swatch: c.hex,
        iconKey: 'palette',
    }));

// ---------------------------------------------------------------------------
// De catalogus
// ---------------------------------------------------------------------------

export const AVATAR_CATALOG: AvatarCatalogItem[] = [
    // --- Basis -------------------------------------------------------------
    { id: 'gender_male', slot: 'gender', value: 'male', label: 'Jongen', price: 0, rarity: 'basis', emoji: '👦' },
    { id: 'gender_female', slot: 'gender', value: 'female', label: 'Meisje', price: 0, rarity: 'basis', emoji: '👧' },

    { id: 'model_std', slot: 'baseModel', value: 'standard', label: 'Standaard', price: 0, rarity: 'basis', iconKey: 'user' },
    { id: 'model_slim', slot: 'baseModel', value: 'slim', label: 'Sportief', price: 0, rarity: 'basis', iconKey: 'zap' },
    { id: 'model_bot', slot: 'baseModel', value: 'robot', label: 'Robot', price: 500, rarity: 'episch', iconKey: 'bot' },

    // --- Huidskleur (gratis: identiteit koop je niet) ----------------------
    { id: 'skin_pale', slot: 'skinColor', value: '#f5d0b0', label: 'Licht', price: 0, rarity: 'basis', swatch: '#f5d0b0' },
    { id: 'skin_fair', slot: 'skinColor', value: '#ffe0bd', label: 'Crème', price: 0, rarity: 'basis', swatch: '#ffe0bd' },
    { id: 'skin_tan', slot: 'skinColor', value: '#d18a6a', label: 'Getint', price: 0, rarity: 'basis', swatch: '#d18a6a' },
    { id: 'skin_olive', slot: 'skinColor', value: '#c68642', label: 'Olijf', price: 0, rarity: 'basis', swatch: '#c68642' },
    { id: 'skin_brown', slot: 'skinColor', value: '#a0522d', label: 'Bruin', price: 0, rarity: 'basis', swatch: '#a0522d' },
    { id: 'skin_dark', slot: 'skinColor', value: '#8d5524', label: 'Donker', price: 0, rarity: 'basis', swatch: '#8d5524' },
    { id: 'skin_ebony', slot: 'skinColor', value: '#614335', label: 'Ebben', price: 0, rarity: 'basis', swatch: '#614335' },

    // --- Kapsels (ids uit de oude AVATAR_HAIR_CATALOG) ---------------------
    { id: 'hair_short', slot: 'hairStyle', value: 'short', label: 'Kort', price: 0, rarity: 'basis', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_spiky', slot: 'hairStyle', value: 'spiky', label: 'Stekeltjes', price: 0, rarity: 'basis', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_buzzcut', slot: 'hairStyle', value: 'buzzcut', label: 'Buzz Cut', price: 50, rarity: 'basis', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_messy', slot: 'hairStyle', value: 'messy', label: 'Wild', price: 75, rarity: 'basis', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_curls', slot: 'hairStyle', value: 'curls', label: 'Krullen', price: 75, rarity: 'basis', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_fade', slot: 'hairStyle', value: 'fade', label: 'Opscheer', price: 100, rarity: 'zeldzaam', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_sidepart', slot: 'hairStyle', value: 'sidepart', label: 'Zijscheiding', price: 100, rarity: 'zeldzaam', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_afro_m', slot: 'hairStyle', value: 'afro', label: 'Afro', price: 125, rarity: 'zeldzaam', gender: 'male', iconKey: 'scissors' },
    { id: 'hair_mohawk', slot: 'hairStyle', value: 'mohawk', label: 'Mohawk', price: 200, rarity: 'zeldzaam', gender: 'male', iconKey: 'scissors' },

    { id: 'hair_pigtails', slot: 'hairStyle', value: 'pigtails', label: 'Staartjes', price: 0, rarity: 'basis', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_long', slot: 'hairStyle', value: 'long', label: 'Lang Sluik', price: 0, rarity: 'basis', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_bob', slot: 'hairStyle', value: 'bob', label: 'Boblijn', price: 75, rarity: 'basis', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_braids', slot: 'hairStyle', value: 'braids', label: 'Vlechtjes', price: 75, rarity: 'basis', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_curls_f', slot: 'hairStyle', value: 'curls', label: 'Krullen', price: 75, rarity: 'basis', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_ponytail', slot: 'hairStyle', value: 'ponytail', label: 'Paardenstaart', price: 100, rarity: 'zeldzaam', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_bun', slot: 'hairStyle', value: 'bun', label: 'Knotje', price: 125, rarity: 'zeldzaam', gender: 'female', iconKey: 'scissors' },
    { id: 'hair_afro_f', slot: 'hairStyle', value: 'afro', label: 'Afro', price: 125, rarity: 'zeldzaam', gender: 'female', iconKey: 'scissors' },

    // --- Haarkleur ---------------------------------------------------------
    { id: 'haircol_black', slot: 'hairColor', value: '#08283B', label: 'Zwart', price: 0, rarity: 'basis', swatch: '#08283B' },
    { id: 'haircol_darkbrown', slot: 'hairColor', value: '#8B4513', label: 'Donkerbruin', price: 0, rarity: 'basis', swatch: '#8B4513' },
    { id: 'haircol_chestnut', slot: 'hairColor', value: '#A0522D', label: 'Kastanje', price: 0, rarity: 'basis', swatch: '#A0522D' },
    { id: 'haircol_lightbrown', slot: 'hairColor', value: '#D4A574', label: 'Lichtbruin', price: 0, rarity: 'basis', swatch: '#D4A574' },
    { id: 'haircol_blond', slot: 'hairColor', value: '#E8C07D', label: 'Blond', price: 0, rarity: 'basis', swatch: '#E8C07D' },
    { id: 'haircol_platinum', slot: 'hairColor', value: '#FFF8DC', label: 'Platinablond', price: 0, rarity: 'basis', swatch: '#FFF8DC' },
    { id: 'haircol_red', slot: 'hairColor', value: '#C41E3A', label: 'Rood', price: 0, rarity: 'basis', swatch: '#C41E3A' },
    { id: 'haircol_coral', slot: 'hairColor', value: '#FF6B6B', label: 'Koraal', price: 0, rarity: 'basis', swatch: '#FF6B6B' },
    { id: 'haircol_orange', slot: 'hairColor', value: '#D97848', label: 'Oranje', price: 0, rarity: 'basis', swatch: '#D97848' },
    { id: 'haircol_green', slot: 'hairColor', value: '#5F947D', label: 'Groen', price: 0, rarity: 'basis', swatch: '#5F947D' },

    // --- Oogkleur ----------------------------------------------------------
    { id: 'eyecol_dark', slot: 'eyeColor', value: '#08283B', label: 'Donker', price: 0, rarity: 'basis', swatch: '#08283B' },
    { id: 'eyecol_brown', slot: 'eyeColor', value: '#8B4513', label: 'Bruin', price: 0, rarity: 'basis', swatch: '#8B4513' },
    { id: 'eyecol_green', slot: 'eyeColor', value: '#5F947D', label: 'Groen', price: 0, rarity: 'basis', swatch: '#5F947D' },
    { id: 'eyecol_blue', slot: 'eyeColor', value: '#445865', label: 'Blauwgrijs', price: 0, rarity: 'basis', swatch: '#445865' },
    { id: 'eyecol_amber', slot: 'eyeColor', value: '#D7C95F', label: 'Amber', price: 0, rarity: 'basis', swatch: '#D7C95F' },

    // --- Shirts ------------------------------------------------------------
    { id: 'shirt_basic', slot: 'shirtStyle', value: 't-shirt', label: 'Basis T-Shirt', price: 0, rarity: 'basis', iconKey: 'shirt' },
    { id: 'shirt_tank', slot: 'shirtStyle', value: 'tank', label: 'Tanktop', price: 50, rarity: 'basis', iconKey: 'shirt' },
    { id: 'shirt_polo', slot: 'shirtStyle', value: 'polo', label: 'Polo Shirt', price: 75, rarity: 'basis', iconKey: 'shirt' },
    { id: 'shirt_sweater', slot: 'shirtStyle', value: 'sweater', label: 'Trui', price: 125, rarity: 'basis', iconKey: 'shirt' },
    { id: 'shirt_hoodie', slot: 'shirtStyle', value: 'hoodie', label: 'Hoodie', price: 150, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'shirt_flannel', slot: 'shirtStyle', value: 'flannel', label: 'Flanellen Hemd', price: 150, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'shirt_varsity', slot: 'shirtStyle', value: 'varsity', label: 'College Jacket', price: 175, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'shirt_jersey', slot: 'shirtStyle', value: 'jersey', label: 'Sport Jersey', price: 175, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'shirt_denim', slot: 'shirtStyle', value: 'denim', label: 'Denim Jasje', price: 200, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'shirt_track', slot: 'shirtStyle', value: 'trackjacket', label: 'Trainingsjack', price: 200, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'shirt_blazer', slot: 'shirtStyle', value: 'blazer', label: 'Blazer', price: 300, rarity: 'episch', iconKey: 'shirt' },
    { id: 'shirt_bomber', slot: 'shirtStyle', value: 'bomber', label: 'Bomber Jacket', price: 350, rarity: 'episch', iconKey: 'shirt' },
    { id: 'shirt_puffer', slot: 'shirtStyle', value: 'puffer', label: 'Puffer Jacket', price: 375, rarity: 'episch', iconKey: 'shirt' },
    { id: 'shirt_leather', slot: 'shirtStyle', value: 'leather', label: 'Leren Jas', price: 400, rarity: 'episch', iconKey: 'shirt' },
    { id: 'shirt_kimono', slot: 'shirtStyle', value: 'kimono', label: 'Kimono', price: 450, rarity: 'episch', iconKey: 'shirt' },
    { id: 'acc_suit_diamond', slot: 'shirtStyle', value: 'suit_diamond', label: 'Diamanten Pak', price: 5000, rarity: 'legendarisch', iconKey: 'award' },

    // --- Broeken -----------------------------------------------------------
    { id: 'pants_jeans', slot: 'pantsStyle', value: 'standard', label: 'Jeans', price: 0, rarity: 'basis', iconKey: 'pants' },
    { id: 'pants_shorts', slot: 'pantsStyle', value: 'shorts', label: 'Korte Broek', price: 50, rarity: 'basis', iconKey: 'pants' },
    { id: 'pants_chinos', slot: 'pantsStyle', value: 'chinos', label: 'Chino', price: 75, rarity: 'basis', iconKey: 'pants' },
    { id: 'pants_joggers', slot: 'pantsStyle', value: 'joggers', label: 'Joggingbroek', price: 100, rarity: 'basis', iconKey: 'pants' },
    { id: 'pants_sweat', slot: 'pantsStyle', value: 'sweatpants', label: 'Sweatpants', price: 100, rarity: 'basis', iconKey: 'pants' },
    { id: 'pants_skinny', slot: 'pantsStyle', value: 'skinny', label: 'Skinny Jeans', price: 125, rarity: 'zeldzaam', iconKey: 'pants' },
    { id: 'pants_skirt', slot: 'pantsStyle', value: 'skirt', label: 'Rok', price: 125, rarity: 'zeldzaam', iconKey: 'pants' },
    { id: 'pants_cargo', slot: 'pantsStyle', value: 'cargo', label: 'Cargo Broek', price: 150, rarity: 'zeldzaam', iconKey: 'pants' },
    { id: 'pants_baggy', slot: 'pantsStyle', value: 'baggy', label: 'Baggy Pants', price: 150, rarity: 'zeldzaam', iconKey: 'pants' },
    { id: 'pants_ripped', slot: 'pantsStyle', value: 'ripped', label: 'Gescheurde Jeans', price: 175, rarity: 'zeldzaam', iconKey: 'pants' },
    { id: 'pants_pleated', slot: 'pantsStyle', value: 'pleated', label: 'Plooirok', price: 175, rarity: 'zeldzaam', iconKey: 'pants' },
    { id: 'pants_formal', slot: 'pantsStyle', value: 'formal', label: 'Nette Broek', price: 200, rarity: 'zeldzaam', iconKey: 'pants' },

    // --- Accessoires -------------------------------------------------------
    { id: 'acc_none', slot: 'accessory', value: 'none', label: 'Geen', price: 0, rarity: 'basis', iconKey: 'user' },
    { id: 'acc_bandana', slot: 'accessory', value: 'bandana', label: 'Bandana', price: 75, rarity: 'basis', iconKey: 'crown' },
    { id: 'acc_glasses', slot: 'accessory', value: 'glasses', label: 'Coole Bril', price: 100, rarity: 'basis', iconKey: 'glasses' },
    { id: 'acc_beanie', slot: 'accessory', value: 'beanie', label: 'Muts', price: 100, rarity: 'basis', iconKey: 'crown' },
    { id: 'acc_scarf', slot: 'accessory', value: 'scarf', label: 'Sjaal', price: 100, rarity: 'basis', iconKey: 'shirt' },
    { id: 'acc_cap', slot: 'accessory', value: 'cap', label: 'Pet', price: 125, rarity: 'basis', iconKey: 'crown' },
    { id: 'acc_bowtie', slot: 'accessory', value: 'bowtie', label: 'Vlinderdas', price: 125, rarity: 'basis', iconKey: 'shirt' },
    { id: 'acc_sunglasses', slot: 'accessory', value: 'sunglasses', label: 'Zonnebril', price: 150, rarity: 'zeldzaam', iconKey: 'glasses' },
    { id: 'acc_satchel', slot: 'accessory', value: 'satchel', label: 'Schoudertas', price: 150, rarity: 'zeldzaam', iconKey: 'backpack' },
    { id: 'acc_tie', slot: 'accessory', value: 'tie', label: 'Stropdas', price: 150, rarity: 'zeldzaam', iconKey: 'shirt' },
    { id: 'acc_backpack', slot: 'accessory', value: 'backpack', label: 'Rugzak', price: 175, rarity: 'zeldzaam', iconKey: 'backpack' },
    { id: 'acc_necklace', slot: 'accessory', value: 'necklace', label: 'Ketting', price: 175, rarity: 'zeldzaam', iconKey: 'sparkles' },
    { id: 'acc_earbuds', slot: 'accessory', value: 'earbuds', label: 'Oordopjes', price: 200, rarity: 'zeldzaam', iconKey: 'headphones' },
    { id: 'acc_watch', slot: 'accessory', value: 'watch', label: 'Horloge', price: 200, rarity: 'zeldzaam', iconKey: 'zap' },
    { id: 'acc_headphones', slot: 'accessory', value: 'headphones', label: 'Koptelefoon', price: 250, rarity: 'zeldzaam', iconKey: 'headphones' },
    { id: 'acc_smartwatch', slot: 'accessory', value: 'smartwatch', label: 'Smartwatch', price: 350, rarity: 'episch', iconKey: 'zap' },
    { id: 'acc_chain', slot: 'accessory', value: 'chain', label: 'Gouden Ketting', price: 400, rarity: 'episch', iconKey: 'sparkles' },
    { id: 'acc_shield', slot: 'accessory', value: 'shield', label: 'Schild', price: 400, rarity: 'episch', iconKey: 'shield' },
    { id: 'acc_sword', slot: 'accessory', value: 'sword', label: 'Zwaard', price: 450, rarity: 'episch', iconKey: 'zap' },
    { id: 'acc_skate', slot: 'accessory', value: 'skateboard', label: 'Skateboard', price: 500, rarity: 'episch', iconKey: 'zap' },
    { id: 'acc_cape', slot: 'accessory', value: 'cape', label: 'Cape', price: 500, rarity: 'episch', iconKey: 'sparkles' },
    { id: 'acc_halo', slot: 'accessory', value: 'halo', label: 'Halo', price: 600, rarity: 'episch', iconKey: 'sparkles' },
    { id: 'acc_guitar', slot: 'accessory', value: 'guitar', label: 'Gitaar', price: 600, rarity: 'episch', iconKey: 'zap' },
    { id: 'acc_robot_arm', slot: 'accessory', value: 'robot_arm', label: 'Robot Arm', price: 650, rarity: 'episch', iconKey: 'bot' },
    { id: 'acc_wings', slot: 'accessory', value: 'wings', label: 'Vleugels', price: 750, rarity: 'episch', iconKey: 'sparkles' },
    { id: 'acc_crown', slot: 'accessory', value: 'crown', label: 'Kroon', price: 800, rarity: 'episch', iconKey: 'crown' },
    { id: 'acc_crown_gold', slot: 'accessory', value: 'crown_gold', label: 'Gouden Kroon', price: 2500, rarity: 'legendarisch', iconKey: 'crown' },
    { id: 'acc_wings_cyber', slot: 'accessory', value: 'wings_cyber', label: 'Cyber Vleugels', price: 3000, rarity: 'legendarisch', iconKey: 'sparkles' },
    { id: 'acc_jetpack', slot: 'accessory', value: 'jetpack', label: 'Jetpack', price: 3500, rarity: 'legendarisch', iconKey: 'zap' },

    // --- Huisdieren --------------------------------------------------------
    // Bewust allemaal gratis: in de instelwizard waren ze dat altijd al, en de
    // winkel verkocht dezelfde dieren als "accessoire" voor 700-4000 XP. Dat
    // dubbelspoor is opgeheven; huisdieren zijn een vrije keuze, de economie
    // draait op kleding en accessoires.
    { id: 'pet_none', slot: 'pet', value: 'none', label: 'Geen', price: 0, rarity: 'basis', emoji: '🚫' },
    { id: 'pet_dog_free', slot: 'pet', value: 'pet_dog', label: 'Hond', price: 0, rarity: 'basis', emoji: '🐕' },
    { id: 'pet_cat_free', slot: 'pet', value: 'pet_cat', label: 'Kat', price: 0, rarity: 'basis', emoji: '🐱' },
    { id: 'pet_duck_free', slot: 'pet', value: 'pet_duck', label: 'Eendje', price: 0, rarity: 'basis', emoji: '🦆' },
    { id: 'pet_robo_free', slot: 'pet', value: 'pet_robo', label: 'Robot', price: 0, rarity: 'basis', emoji: '🤖' },

    // --- Gezichtsuitdrukkingen --------------------------------------------
    { id: 'expr_neutral', slot: 'expression', value: 'neutral', label: 'Neutraal', price: 0, rarity: 'basis', iconKey: 'smile' },
    { id: 'expr_happy', slot: 'expression', value: 'happy', label: 'Blij', price: 0, rarity: 'basis', iconKey: 'smile' },
    { id: 'expr_cool', slot: 'expression', value: 'cool', label: 'Cool', price: 100, rarity: 'basis', iconKey: 'glasses' },
    { id: 'expr_surprised', slot: 'expression', value: 'surprised', label: 'Verrast', price: 100, rarity: 'basis', iconKey: 'smile' },

    // --- Poses -------------------------------------------------------------
    { id: 'pose_idle', slot: 'pose', value: 'idle', label: 'Standaard', price: 0, rarity: 'basis', iconKey: 'user' },
    { id: 'pose_wave', slot: 'pose', value: 'wave', label: 'Zwaaien', price: 75, rarity: 'basis', iconKey: 'heart' },
    { id: 'pose_peace', slot: 'pose', value: 'peace', label: 'Peace', price: 100, rarity: 'basis', iconKey: 'star' },
    { id: 'pose_dab', slot: 'pose', value: 'dab', label: 'Dab', price: 150, rarity: 'zeldzaam', iconKey: 'dumbbell' },

    // --- Kledingkleuren ----------------------------------------------------
    ...colorItems('shirtColor', 'shirtcol'),
    ...colorItems('pantsColor', 'pantscol'),
    ...colorItems('shoeColor', 'shoecol'),
    ...colorItems('accessoryColor', 'acccol'),
];

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const isOwned = (item: AvatarCatalogItem, inventory: readonly string[] = []): boolean =>
    item.price === 0 || inventory.includes(item.id);

export const isAvailableFor = (item: AvatarCatalogItem, gender: AvatarConfig['gender']): boolean =>
    !item.gender || item.gender === gender;

/** Generiek over het slot, zodat `item.value` versmald blijft tot het type dat
 *  bij dat slot hoort (`getItemsForSlot('pet', …)[0].value` is een pet-waarde). */
export const getItemsForSlot = <S extends AvatarSlot>(
    slot: S,
    gender: AvatarConfig['gender']
): Extract<AvatarCatalogItem, { slot: S }>[] =>
    AVATAR_CATALOG.filter(
        (item): item is Extract<AvatarCatalogItem, { slot: S }> =>
            item.slot === slot && isAvailableFor(item, gender)
    );

export const getCatalogItemById = (id: string): AvatarCatalogItem | undefined =>
    AVATAR_CATALOG.find(item => item.id === id);

/** Het item dat op dit moment in het slot gedragen wordt. */
export const getEquippedItem = (
    slot: AvatarSlot,
    config: AvatarConfig
): AvatarCatalogItem | undefined =>
    getItemsForSlot(slot, config.gender).find(item => item.value === config[slot]);

// ---------------------------------------------------------------------------
// Toepassen
// ---------------------------------------------------------------------------

/** Kiest een kapsel dat bij het nieuwe geslacht past: bij voorkeur het huidige,
 *  anders het goedkoopste dat de leerling al bezit. Zo gooit een geslachtswissel
 *  nooit een betaald kapsel weg. */
const pickHairStyleForGender = (
    config: AvatarConfig,
    gender: AvatarConfig['gender'],
    inventory: readonly string[]
): AvatarConfig['hairStyle'] => {
    const options = getItemsForSlot('hairStyle', gender);
    if (options.some(item => item.value === config.hairStyle)) return config.hairStyle;

    const owned = options
        .filter(item => isOwned(item, inventory))
        .sort((a, b) => a.price - b.price);

    return owned[0]?.value ?? options[0]?.value ?? 'short';
};

/** De enige plek waar een item "aangetrokken" wordt. */
export function applyCatalogItem(
    config: AvatarConfig,
    item: AvatarCatalogItem,
    inventory: readonly string[] = []
): AvatarConfig {
    switch (item.slot) {
        case 'gender':
            return {
                ...config,
                gender: item.value,
                hairStyle: pickHairStyleForGender(config, item.value, inventory),
            };
        case 'baseModel': return { ...config, baseModel: item.value };
        case 'skinColor': return { ...config, skinColor: item.value };
        case 'hairStyle': return { ...config, hairStyle: item.value };
        case 'hairColor': return { ...config, hairColor: item.value };
        case 'shirtStyle': return { ...config, shirtStyle: item.value };
        case 'shirtColor': return { ...config, shirtColor: item.value };
        case 'pantsStyle': return { ...config, pantsStyle: item.value };
        case 'pantsColor': return { ...config, pantsColor: item.value };
        case 'shoeColor': return { ...config, shoeColor: item.value };
        case 'eyeColor': return { ...config, eyeColor: item.value };
        case 'accessoryColor': return { ...config, accessoryColor: item.value };
        case 'accessory': return { ...config, accessory: item.value };
        case 'pet': return { ...config, pet: item.value };
        case 'expression': return { ...config, expression: item.value };
        case 'pose': return { ...config, pose: item.value };
        default: {
            // Nieuw slot toegevoegd zonder tak hierboven => compileerfout.
            const exhaustive: never = item;
            return exhaustive;
        }
    }
}

// ---------------------------------------------------------------------------
// Normaliseren (migratie van opgeslagen configuraties)
// ---------------------------------------------------------------------------

/** Verenkleuren van de oude eend-avatar naar een menselijke huidtint.
 *  Alleen deze zeven waarden; bewust gekozen kleuren blijven ongemoeid. */
const DUCK_FEATHER_TO_SKIN: Record<string, string> = {
    '#e1ff01': '#ffe0bd',
    '#f2a23c': '#d18a6a',
    '#a8e6cf': '#f5d0b0',
    '#87ceeb': '#f5d0b0',
    '#c9b1ff': '#ffe0bd',
    '#ff6b6b': '#c68642',
    '#f8f8f0': '#f5d0b0',
};

const PET_ACCESSORY_VALUES = new Set(['pet_cat', 'pet_dog', 'pet_robo', 'pet_duck']);

/**
 * Maakt een opgeslagen avatarconfiguratie geschikt voor de mensfiguur.
 *
 * Draait in het geheugen bij het inlezen; het resultaat persisteert vanzelf
 * zodra de leerling iets opslaat. Er is dus geen database-migratie nodig.
 */
export function normalizeAvatarConfig(raw?: Partial<AvatarConfig> | null): AvatarConfig {
    const merged = { ...DEFAULT_AVATAR_CONFIG, ...(raw ?? {}) } as AvatarConfig & { avatarKind?: unknown };

    // De eend bestaat niet meer als lichaam; het veld wordt genegeerd.
    delete merged.avatarKind;

    const feather = DUCK_FEATHER_TO_SKIN[String(merged.skinColor).toLowerCase()];
    if (feather) merged.skinColor = feather;

    // Huisdieren stonden vroeger óók in het accessoire-slot, waardoor een
    // leerling twee dieren tegelijk kon dragen. Ze horen in het pet-slot.
    if (merged.accessory && PET_ACCESSORY_VALUES.has(merged.accessory)) {
        merged.pet = merged.accessory as NonNullable<AvatarConfig['pet']>;
        merged.accessory = 'none';
    }

    return merged;
}

/** Normaliseert de avatarconfiguratie binnen een stats-object. */
export function normalizeStatsAvatarConfig<T extends { avatarConfig?: AvatarConfig }>(stats: T): T {
    if (!stats?.avatarConfig) return stats;
    return { ...stats, avatarConfig: normalizeAvatarConfig(stats.avatarConfig) };
}

// ---------------------------------------------------------------------------
// Verrassen
// ---------------------------------------------------------------------------

const RANDOMIZABLE_SLOTS: AvatarSlot[] = [
    'skinColor', 'hairStyle', 'hairColor', 'eyeColor',
    'shirtStyle', 'shirtColor', 'pantsStyle', 'pantsColor',
    'shoeColor', 'accessory', 'expression',
];

/** Zet een willekeurige outfit samen uit uitsluitend items die de leerling
 *  al bezit — nooit iets tonen dat hij niet mag houden. */
export function randomizeAvatarConfig(
    config: AvatarConfig,
    inventory: readonly string[] = []
): AvatarConfig {
    return RANDOMIZABLE_SLOTS.reduce<AvatarConfig>((acc, slot) => {
        const owned = getItemsForSlot(slot, acc.gender).filter(item => isOwned(item, inventory));
        if (owned.length === 0) return acc;
        return applyCatalogItem(acc, owned[Math.floor(Math.random() * owned.length)], inventory);
    }, config);
}

// ---------------------------------------------------------------------------
// Afgeleide weergaven (tijdelijk)
// ---------------------------------------------------------------------------
// De winkel in UserProfile.tsx draait nog op het oude ShopItem-formaat. Deze
// afgeleide lijsten houden dat werkend tot de winkel wordt herbouwd; ze zijn
// afgeleid van AVATAR_CATALOG, dus er kan geen drift ontstaan.

export interface AvatarHairCatalogItem {
    id: string;
    value: AvatarConfig['hairStyle'];
    label: string;
    price: number;
    locked: boolean;
    gender: AvatarConfig['gender'];
}

export const AVATAR_HAIR_CATALOG: AvatarHairCatalogItem[] = AVATAR_CATALOG
    .filter((item): item is Extract<AvatarCatalogItem, { slot: 'hairStyle' }> => item.slot === 'hairStyle')
    .map(item => ({
        id: item.id,
        value: item.value,
        label: item.label,
        price: item.price,
        locked: item.price > 0,
        gender: item.gender ?? 'male',
    }));

export const getAvatarHairOptionsForGender = (
    gender: AvatarConfig['gender']
): AvatarHairCatalogItem[] => AVATAR_HAIR_CATALOG.filter(item => item.gender === gender);
