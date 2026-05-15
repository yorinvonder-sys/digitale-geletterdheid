import type { AvatarConfig } from '@/types';

export interface AvatarHairCatalogItem {
    id: string;
    value: AvatarConfig['hairStyle'];
    label: string;
    price: number;
    locked: boolean;
    gender: AvatarConfig['gender'];
}

export interface AvatarPetCatalogItem {
    value: AvatarConfig['pet'];
    label: string;
    emoji: string;
    locked: boolean;
}

export const AVATAR_HAIR_CATALOG: AvatarHairCatalogItem[] = [
    { id: 'hair_short', value: 'short', label: 'Kort', price: 0, locked: false, gender: 'male' },
    { id: 'hair_spiky', value: 'spiky', label: 'Stekeltjes', price: 0, locked: false, gender: 'male' },
    { id: 'hair_messy', value: 'messy', label: 'Wild', price: 75, locked: false, gender: 'male' },
    { id: 'hair_fade', value: 'fade', label: 'Opscheer', price: 100, locked: true, gender: 'male' },
    { id: 'hair_curls', value: 'curls', label: 'Krullen', price: 75, locked: true, gender: 'male' },
    { id: 'hair_buzzcut', value: 'buzzcut', label: 'Buzz Cut', price: 50, locked: true, gender: 'male' },
    { id: 'hair_mohawk', value: 'mohawk', label: 'Mohawk', price: 200, locked: true, gender: 'male' },
    { id: 'hair_afro_m', value: 'afro', label: 'Afro', price: 125, locked: true, gender: 'male' },
    { id: 'hair_sidepart', value: 'sidepart', label: 'Zijscheiding', price: 100, locked: true, gender: 'male' },

    { id: 'hair_pigtails', value: 'pigtails', label: 'Staartjes', price: 0, locked: false, gender: 'female' },
    { id: 'hair_long', value: 'long', label: 'Lang Sluik', price: 0, locked: false, gender: 'female' },
    { id: 'hair_bob', value: 'bob', label: 'Boblijn', price: 75, locked: false, gender: 'female' },
    { id: 'hair_ponytail', value: 'ponytail', label: 'Paardenstaart', price: 100, locked: false, gender: 'female' },
    { id: 'hair_braids', value: 'braids', label: 'Vlechtjes', price: 75, locked: true, gender: 'female' },
    { id: 'hair_bun', value: 'bun', label: 'Knotje', price: 125, locked: true, gender: 'female' },
    { id: 'hair_afro_f', value: 'afro', label: 'Afro', price: 125, locked: true, gender: 'female' },
    { id: 'hair_curls_f', value: 'curls', label: 'Krullen', price: 75, locked: true, gender: 'female' },
];

export const AVATAR_PET_CATALOG: AvatarPetCatalogItem[] = [
    { value: 'none', label: 'Geen', emoji: '🚫', locked: false },
    { value: 'pet_dog', label: 'Hond', emoji: '🐕', locked: false },
    { value: 'pet_cat', label: 'Kat', emoji: '🐱', locked: false },
    { value: 'pet_robo', label: 'Robot', emoji: '🤖', locked: false },
];

export const getAvatarHairOptionsForGender = (
    gender: AvatarConfig['gender']
): AvatarHairCatalogItem[] => AVATAR_HAIR_CATALOG.filter(item => item.gender === gender);
