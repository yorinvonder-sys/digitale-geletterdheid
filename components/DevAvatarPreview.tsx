import React, { useState } from 'react';
import { AvatarViewer2D } from './AvatarViewer2D';
import { LazyAvatarViewer } from './LazyAvatarViewer';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types';

/** Dev-only preview voor avatar styling. Verwijder voor productie. */

const PRESETS: { label: string; config: AvatarConfig }[] = [
    {
        label: 'Jongen — Spiky',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', hairStyle: 'spiky', hairColor: '#08283B', shirtColor: '#0B453F', expression: 'cool', pose: 'idle', eyeColor: '#4a3728' },
    },
    {
        label: 'Meisje — Pigtails',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', hairStyle: 'pigtails', hairColor: '#08283B', shirtColor: '#D97848', pantsColor: '#8b5cf6', expression: 'happy', pose: 'peace', eyeColor: '#2563eb' },
    },
    {
        label: 'Jongen — Afro',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#8d5524', hairStyle: 'afro', hairColor: '#08283B', shirtColor: '#D97848', expression: 'happy', accessory: 'beanie', pose: 'dab', shoeColor: '#ffffff' },
    },
    {
        label: 'Meisje — Bob',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', hairStyle: 'bob', hairColor: '#C41E3A', shirtColor: '#0B453F', pantsColor: '#D97848', expression: 'neutral', eyeColor: '#5F947D' },
    },
    {
        label: 'Jongen — Fade + Cap',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#a0522d', hairStyle: 'fade', hairColor: '#08283B', shirtColor: '#5F947D', accessory: 'cap', expression: 'cool', shoeColor: '#D97848' },
    },
    {
        label: 'Meisje — Curls',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', skinColor: '#d18a6a', hairStyle: 'curls', hairColor: '#3E2723', shirtColor: '#D7C95F', pantsColor: '#0B453F', accessory: 'headphones', expression: 'surprised', pose: 'wave' },
    },
    {
        label: 'Jongen — Messy',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', hairStyle: 'messy', hairColor: '#8B4513', shirtColor: '#0B453F', expression: 'happy', accessory: 'glasses' },
    },
    {
        label: 'Meisje — Bun',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', skinColor: '#c68642', hairStyle: 'bun', hairColor: '#08283B', shirtColor: '#5F947D', pantsColor: '#08283B', expression: 'happy', pose: 'wave' },
    },
    {
        label: 'Jongen — Mohawk',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#ffe0bd', hairStyle: 'mohawk', hairColor: '#D97848', shirtColor: '#08283B', expression: 'cool', pose: 'dab' },
    },
    {
        label: 'Meisje — Long + Braids',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'female', baseModel: 'slim', hairStyle: 'braids', hairColor: '#08283B', shirtColor: '#D97848', expression: 'happy', accessory: 'none' },
    },
    {
        label: 'Head Only',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', hairStyle: 'spiky', hairColor: '#FF6B35', expression: 'surprised', eyeColor: '#5F947D' },
    },
    {
        label: 'Jongen — Buzzcut',
        config: { ...DEFAULT_AVATAR_CONFIG, gender: 'male', skinColor: '#614335', hairStyle: 'buzzcut', hairColor: '#292524', shirtColor: '#0B453F', expression: 'happy', shoeColor: '#0B453F' },
    },
];

const DevAvatarPreview: React.FC = () => {
    const [selected, setSelected] = useState(0);

    return (
        <div className="min-h-screen bg-lab-muted text-white p-6">
            <h1 className="text-2xl font-bold mb-2 text-center">Avatar 2D Preview</h1>
            <p className="text-lab-muted text-sm text-center mb-6">DEV ONLY — verwijder voor productie</p>

            {/* Full body grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {PRESETS.map((preset, i) => (
                    <div
                        key={i}
                        className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${selected === i ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setSelected(i)}
                    >
                        <div className={`w-full aspect-[2/3] rounded-2xl overflow-hidden border-4 transition-all ${selected === i ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-transparent'}`}>
                            <AvatarViewer2D
                                config={preset.config}
                                variant={preset.label === 'Head Only' ? 'head' : 'full'}
                                interactive={false}
                            />
                        </div>
                        <span className="text-xs font-medium text-lab-muted">{preset.label}</span>
                    </div>
                ))}
            </div>

            {/* Large selected preview: 3D (left) + 2D (right) */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                    <div className="h-[500px] rounded-3xl overflow-hidden border-4 border-indigo-500/50 shadow-2xl bg-[#FCF6EA]">
                        <LazyAvatarViewer
                            config={PRESETS[selected].config}
                            variant={PRESETS[selected].label === 'Head Only' ? 'head' : 'full'}
                            interactive={true}
                            onPartClick={(part) => console.log('Clicked:', part)}
                        />
                    </div>
                    <p className="text-center mt-3 text-indigo-300 font-bold">3D Minecraft — {PRESETS[selected].label}</p>
                </div>
                <div>
                    <div className="h-[500px] rounded-3xl overflow-hidden border-4 border-lab-muted/50 shadow-2xl">
                        <AvatarViewer2D
                            config={PRESETS[selected].config}
                            variant={PRESETS[selected].label === 'Head Only' ? 'head' : 'full'}
                            interactive={true}
                            onPartClick={(part) => console.log('Clicked:', part)}
                        />
                    </div>
                    <p className="text-center mt-3 text-lab-muted font-bold">2D — {PRESETS[selected].label}</p>
                </div>
            </div>
        </div>
    );
};

export default DevAvatarPreview;
