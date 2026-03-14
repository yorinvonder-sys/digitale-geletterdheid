import React, { useState } from 'react';
import { AvatarViewer2D } from './AvatarViewer2D';
import { LazyAvatarViewer } from './LazyAvatarViewer';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types';

/** Dev-only preview voor avatar styling. Verwijder voor productie. */

const PRESETS: { label: string; config: AvatarConfig }[] = [
    {
        label: 'Jongen — Spiky',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', hairStyle: 'spiky', hairColor: '#3d2314', shirtColor: '#0ea5e9', expression: 'cool', pose: 'idle', eyeColor: '#4a3728' },
    },
    {
        label: 'Meisje — Pigtails',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', hairStyle: 'pigtails', hairColor: '#5D4037', shirtColor: '#ec4899', pantsColor: '#8b5cf6', expression: 'happy', pose: 'peace', eyeColor: '#2563eb' },
    },
    {
        label: 'Jongen — Afro',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#8d5524', hairStyle: 'afro', hairColor: '#1a1a1a', shirtColor: '#ef4444', expression: 'happy', accessory: 'beanie', pose: 'dab', shoeColor: '#ffffff' },
    },
    {
        label: 'Meisje — Bob',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', hairStyle: 'bob', hairColor: '#C41E3A', shirtColor: '#6366f1', pantsColor: '#ec4899', expression: 'neutral', eyeColor: '#22c55e' },
    },
    {
        label: 'Jongen — Fade + Cap',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#a0522d', hairStyle: 'fade', hairColor: '#1a1a1a', shirtColor: '#22c55e', accessory: 'cap', expression: 'cool', shoeColor: '#ef4444' },
    },
    {
        label: 'Meisje — Curls',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', skinColor: '#d18a6a', hairStyle: 'curls', hairColor: '#3E2723', shirtColor: '#f59e0b', pantsColor: '#3b82f6', accessory: 'headphones', expression: 'surprised', pose: 'wave' },
    },
    {
        label: 'Jongen — Messy',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', hairStyle: 'messy', hairColor: '#8B4513', shirtColor: '#a855f7', expression: 'happy', accessory: 'glasses' },
    },
    {
        label: 'Meisje — Bun',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', skinColor: '#c68642', hairStyle: 'bun', hairColor: '#1a1a1a', shirtColor: '#10b981', pantsColor: '#1e293b', expression: 'happy', pose: 'wave' },
    },
    {
        label: 'Jongen — Mohawk',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#ffe0bd', hairStyle: 'mohawk', hairColor: '#ef4444', shirtColor: '#1e293b', expression: 'cool', pose: 'dab' },
    },
    {
        label: 'Meisje — Long + Braids',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', hairStyle: 'braids', hairColor: '#5D4037', shirtColor: '#d946ef', expression: 'happy', accessory: 'none' },
    },
    {
        label: 'Head Only',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', hairStyle: 'spiky', hairColor: '#FF6B35', expression: 'surprised', eyeColor: '#22c55e' },
    },
    {
        label: 'Jongen — Buzzcut',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#614335', hairStyle: 'buzzcut', hairColor: '#292524', shirtColor: '#0ea5e9', expression: 'happy', shoeColor: '#3b82f6' },
    },
];

const DevAvatarPreview: React.FC = () => {
    const [selected, setSelected] = useState(0);

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF9F0', color: '#1A1A19' }}>
            <h1 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Avatar 2D Preview</h1>
            <p className="text-sm text-center mb-6" style={{ color: '#6B6B66' }}>DEV ONLY — verwijder voor productie</p>

            {/* Full body grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {PRESETS.map((preset, i) => (
                    <div
                        key={i}
                        className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${selected === i ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setSelected(i)}
                    >
                        <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden transition-all" style={{
                            border: selected === i ? '4px solid #D97757' : '4px solid transparent',
                            boxShadow: selected === i ? '0 10px 25px -5px rgba(217, 119, 87, 0.3)' : undefined
                        }}>
                            <AvatarViewer2D
                                config={preset.config}
                                variant={preset.label === 'Head Only' ? 'head' : 'full'}
                                interactive={false}
                            />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#3D3D38' }}>{preset.label}</span>
                    </div>
                ))}
            </div>

            {/* Large selected preview: 3D (left) + 2D (right) */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                    <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-[#FAF9F0]" style={{ border: '4px solid rgba(217, 119, 87, 0.3)' }}>
                        <LazyAvatarViewer
                            config={PRESETS[selected].config}
                            variant={PRESETS[selected].label === 'Head Only' ? 'head' : 'full'}
                            interactive={true}
                            onPartClick={(part) => console.log('Clicked:', part)}
                        />
                    </div>
                    <p className="text-center mt-3 font-bold" style={{ color: '#D97757' }}>3D Minecraft — {PRESETS[selected].label}</p>
                </div>
                <div>
                    <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl" style={{ border: '4px solid #E8E6DF' }}>
                        <AvatarViewer2D
                            config={PRESETS[selected].config}
                            variant={PRESETS[selected].label === 'Head Only' ? 'head' : 'full'}
                            interactive={true}
                            onPartClick={(part) => console.log('Clicked:', part)}
                        />
                    </div>
                    <p className="text-center mt-3 font-bold" style={{ color: '#6B6B66' }}>2D — {PRESETS[selected].label}</p>
                </div>
            </div>
        </div>
    );
};

export default DevAvatarPreview;
