import React, { Suspense, useEffect, useMemo, useRef, memo, useState, useCallback } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarConfig } from '../types';

// --- Types ---

interface AvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

class ThreeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? null : this.props.children; }
}

// --- Minecraft body dimensions ---

const getBodyDimensions = (baseModel: AvatarConfig['baseModel'], gender?: AvatarConfig['gender']) => {
    const isRobot = baseModel === 'robot';
    const isSlim = baseModel === 'slim';
    const isFemale = gender === 'female';
    return {
        headSize: 0.8,
        bodyWidth: isFemale ? (isSlim ? 0.52 : 0.58) : (isSlim ? 0.58 : 0.65),
        bodyHeight: 0.70,
        bodyDepth: isFemale ? 0.30 : 0.35,
        armWidth: isFemale ? (isSlim ? 0.20 : 0.22) : (isSlim ? 0.22 : 0.25),
        armHeight: 0.65,
        armSpacing: isFemale ? (isSlim ? 0.38 : 0.41) : (isSlim ? 0.41 : 0.46),
        legWidth: isFemale ? (isSlim ? 0.22 : 0.24) : (isSlim ? 0.24 : 0.26),
        legHeight: 0.65,
        legSpacing: 0.15,
        hipWidth: isFemale ? 0.56 : 0,
        isRobot,
        isSlim,
        isFemale,
    };
};

const darkenColor = (hex: string, factor: number): string => {
    const c = new THREE.Color(hex);
    c.multiplyScalar(factor);
    return '#' + c.getHexString();
};

// Shared flat material for Minecraft look
const mcMat = (color: string, emissive = '#000000', emissiveIntensity = 0) => (
    <meshStandardMaterial color={color} roughness={0.85} metalness={0} emissive={emissive} emissiveIntensity={emissiveIntensity} />
);

// --- Face Layer (flat boxes on front of head cube) ---

const FaceLayer = memo<{
    config: AvatarConfig;
    skinColor: string;
    isRobot: boolean;
    eyeGroupRef: React.RefObject<THREE.Group>;
}>(({ config, skinColor, eyeGroupRef }) => {
    const expression = config.expression ?? 'happy';
    const eyeColor = config.eyeColor ?? '#111111';
    const fz = 0.425; // front face z position (outside head cube, enough gap to prevent z-fighting)

    return (
        <group>
            {/* Eyes */}
            <group ref={eyeGroupRef}>
                {/* Left eye */}
                <mesh position={[-0.15, 0.06, fz]}>
                    <boxGeometry args={[0.12, 0.12, 0.02]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.9} />
                </mesh>
                <mesh position={[-0.15, 0.06, fz + 0.01]}>
                    <boxGeometry args={[0.08, 0.08, 0.02]} />
                    <meshStandardMaterial color={eyeColor} roughness={0.3} />
                </mesh>
                <mesh position={[-0.12, 0.09, fz + 0.02]}>
                    <boxGeometry args={[0.03, 0.03, 0.01]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </mesh>

                {/* Right eye */}
                <mesh position={[0.15, 0.06, fz]}>
                    <boxGeometry args={[0.12, 0.12, 0.02]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.9} />
                </mesh>
                <mesh position={[0.15, 0.06, fz + 0.01]}>
                    <boxGeometry args={[0.08, 0.08, 0.02]} />
                    <meshStandardMaterial color={eyeColor} roughness={0.3} />
                </mesh>
                <mesh position={[0.18, 0.09, fz + 0.02]}>
                    <boxGeometry args={[0.03, 0.03, 0.01]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </mesh>

                {/* Female eyelashes */}
                {config.gender === 'female' && (
                    <group>
                        <mesh position={[-0.15, 0.13, fz + 0.01]}>
                            <boxGeometry args={[0.14, 0.02, 0.01]} />
                            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                        </mesh>
                        <mesh position={[0.15, 0.13, fz + 0.01]}>
                            <boxGeometry args={[0.14, 0.02, 0.01]} />
                            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                        </mesh>
                    </group>
                )}
            </group>

            {/* Nose */}
            <mesh position={[0, -0.04, fz]}>
                <boxGeometry args={[0.06, 0.06, 0.04]} />
                {mcMat(darkenColor(skinColor, 0.92))}
            </mesh>

            {/* Cool expression sunglasses (if no glasses/sunglasses accessory) */}
            {expression === 'cool' && config.accessory !== 'sunglasses' && config.accessory !== 'glasses' && (
                <mesh position={[0, 0.06, fz + 0.02]}>
                    <boxGeometry args={[0.38, 0.1, 0.03]} />
                    <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
                </mesh>
            )}

            {/* Mouths */}
            {expression === 'happy' && (
                <group position={[0, -0.16, fz]}>
                    <mesh position={[-0.08, 0.02, 0]}>
                        <boxGeometry args={[0.04, 0.02, 0.01]} />
                        {mcMat('#7c3b2a')}
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.12, 0.04, 0.01]} />
                        {mcMat('#7c3b2a')}
                    </mesh>
                    <mesh position={[0.08, 0.02, 0]}>
                        <boxGeometry args={[0.04, 0.02, 0.01]} />
                        {mcMat('#7c3b2a')}
                    </mesh>
                </group>
            )}
            {expression === 'surprised' && (
                <mesh position={[0, -0.16, fz]}>
                    <boxGeometry args={[0.08, 0.1, 0.01]} />
                    {mcMat('#7c3b2a')}
                </mesh>
            )}
            {expression === 'neutral' && (
                <mesh position={[0, -0.15, fz]}>
                    <boxGeometry args={[0.14, 0.03, 0.01]} />
                    {mcMat('#7c3b2a')}
                </mesh>
            )}

            {/* Female lips */}
            {config.gender === 'female' && expression !== 'cool' && (
                <mesh position={[0, -0.18, fz + 0.005]}>
                    <boxGeometry args={[0.1, 0.03, 0.01]} />
                    {mcMat('#c9746e')}
                </mesh>
            )}

            {/* Female blush pixels */}
            {config.gender === 'female' && (
                <group>
                    <mesh position={[-0.25, -0.04, fz]}>
                        <boxGeometry args={[0.08, 0.04, 0.01]} />
                        <meshStandardMaterial color="#ffb4b4" transparent opacity={0.35} roughness={0.9} />
                    </mesh>
                    <mesh position={[0.25, -0.04, fz]}>
                        <boxGeometry args={[0.08, 0.04, 0.01]} />
                        <meshStandardMaterial color="#ffb4b4" transparent opacity={0.35} roughness={0.9} />
                    </mesh>
                </group>
            )}
        </group>
    );
});

// --- Hair Layer (box-based Minecraft hair) ---

const HairLayer = memo<{ style: string; color: string }>(({ style, color }) => {
    const mat = <meshStandardMaterial color={color} roughness={0.85} />;
    const hs = 0.4; // half head size

    switch (style) {
        case 'short':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.35, 0.08]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.25, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.25, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.15, 0.3]}>
                        <boxGeometry args={[0.6, 0.08, 0.15]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'spiky':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.25, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.25, 0.7]} />
                        {mat}
                    </mesh>
                    {/* Spikes */}
                    <mesh position={[-0.12, 0.42, 0.1]} rotation={[0.2, 0, -0.15]}>
                        <boxGeometry args={[0.12, 0.22, 0.12]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.1, 0.48, -0.05]} rotation={[-0.1, 0, 0.1]}>
                        <boxGeometry args={[0.12, 0.28, 0.12]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.45, 0.05]} rotation={[0.1, 0, 0]}>
                        <boxGeometry args={[0.14, 0.25, 0.14]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.22, 0.38, -0.08]} rotation={[-0.15, 0, -0.2]}>
                        <boxGeometry args={[0.1, 0.18, 0.1]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.22, 0.36, 0.08]} rotation={[0.1, 0, 0.2]}>
                        <boxGeometry args={[0.1, 0.16, 0.1]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'long':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, -0.15, 0.02]}>
                        <boxGeometry args={[0.12, 0.7, 0.6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, -0.15, 0.02]}>
                        <boxGeometry args={[0.12, 0.7, 0.6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, -0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.65, 0.08]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'ponytail':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.35, 0.08]} />
                        {mat}
                    </mesh>
                    {/* Ponytail */}
                    <mesh position={[0, 0.1, -0.48]}>
                        <boxGeometry args={[0.15, 0.12, 0.12]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, -0.15, -0.48]}>
                        <boxGeometry args={[0.12, 0.4, 0.1]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'pigtails':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.3, 0.08]} />
                        {mat}
                    </mesh>
                    {/* Left pigtail — tie knot */}
                    <mesh position={[-0.44, 0.05, 0.05]}>
                        <boxGeometry args={[0.14, 0.16, 0.16]} />
                        {mat}
                    </mesh>
                    {/* Left pigtail — hanging */}
                    <mesh position={[-0.46, -0.22, 0.02]}>
                        <boxGeometry args={[0.12, 0.4, 0.12]} />
                        {mat}
                    </mesh>
                    {/* Right pigtail — tie knot */}
                    <mesh position={[0.44, 0.05, 0.05]}>
                        <boxGeometry args={[0.14, 0.16, 0.16]} />
                        {mat}
                    </mesh>
                    {/* Right pigtail — hanging */}
                    <mesh position={[0.46, -0.22, 0.02]}>
                        <boxGeometry args={[0.12, 0.4, 0.12]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'messy':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.86, 0.2, 0.86]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, 0.05, 0]}>
                        <boxGeometry args={[0.1, 0.3, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, 0.05, 0]}>
                        <boxGeometry args={[0.1, 0.3, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.2, 0.38, 0.12]} rotation={[0.3, 0, -0.4]}>
                        <boxGeometry args={[0.12, 0.18, 0.1]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.18, 0.4, -0.05]} rotation={[-0.2, 0, 0.3]}>
                        <boxGeometry args={[0.1, 0.2, 0.1]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.08, 0.15, 0.38]} rotation={[0.5, 0, 0.1]}>
                        <boxGeometry args={[0.08, 0.15, 0.06]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.35, 0.08]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'fade':
            return (
                <group>
                    <mesh position={[0, 0.25, 0.02]}>
                        <boxGeometry args={[0.6, 0.25, 0.65]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, 0.02, 0]}>
                        <boxGeometry args={[0.06, 0.2, 0.6]} />
                        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} />
                    </mesh>
                    <mesh position={[0.38, 0.02, 0]}>
                        <boxGeometry args={[0.06, 0.2, 0.6]} />
                        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} />
                    </mesh>
                    <mesh position={[0, 0.02, -0.38]}>
                        <boxGeometry args={[0.7, 0.18, 0.06]} />
                        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.6} />
                    </mesh>
                </group>
            );

        case 'curls':
            return (
                <group>
                    <mesh position={[0, 0.24, -0.02]}>
                        <boxGeometry args={[0.88, 0.22, 0.88]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.4, 0.08, 0]}>
                        <boxGeometry args={[0.12, 0.35, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.4, 0.08, 0]}>
                        <boxGeometry args={[0.12, 0.35, 0.7]} />
                        {mat}
                    </mesh>
                    {/* Curl bumps */}
                    {[[-0.22, 0.38, 0.1], [0.18, 0.4, 0.05], [0, 0.42, 0], [-0.1, 0.38, -0.12], [0.12, 0.37, -0.1]].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]}>
                            <boxGeometry args={[0.14, 0.12, 0.14]} />
                            {mat}
                        </mesh>
                    ))}
                </group>
            );

        case 'buzzcut':
            return (
                <group>
                    <mesh position={[0, 0.2, -0.02]}>
                        <boxGeometry args={[0.82, 0.12, 0.82]} />
                        <meshStandardMaterial color={color} roughness={0.95} />
                    </mesh>
                    <mesh position={[-0.38, 0.02, 0]}>
                        <boxGeometry args={[0.06, 0.18, 0.65]} />
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.7} />
                    </mesh>
                    <mesh position={[0.38, 0.02, 0]}>
                        <boxGeometry args={[0.06, 0.18, 0.65]} />
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.7} />
                    </mesh>
                </group>
            );

        case 'mohawk':
            return (
                <group>
                    <mesh position={[0, 0.18, -0.02]}>
                        <boxGeometry args={[0.82, 0.1, 0.82]} />
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.5} />
                    </mesh>
                    {/* Mohawk ridge */}
                    <mesh position={[0, 0.38, 0.1]}>
                        <boxGeometry args={[0.1, 0.35, 0.14]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.4, -0.05]}>
                        <boxGeometry args={[0.1, 0.38, 0.14]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.35, -0.18]}>
                        <boxGeometry args={[0.1, 0.28, 0.14]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'afro':
            return (
                <group>
                    {/* Back shell */}
                    <mesh position={[0, 0.1, -0.28]}>
                        <boxGeometry args={[0.95, 0.85, 0.35]} />
                        {mat}
                    </mesh>
                    {/* Left side */}
                    <mesh position={[-0.38, 0.1, 0]}>
                        <boxGeometry args={[0.22, 0.85, 0.6]} />
                        {mat}
                    </mesh>
                    {/* Right side */}
                    <mesh position={[0.38, 0.1, 0]}>
                        <boxGeometry args={[0.22, 0.85, 0.6]} />
                        {mat}
                    </mesh>
                    {/* Top puff */}
                    <mesh position={[0, 0.42, -0.05]}>
                        <boxGeometry args={[0.9, 0.3, 0.8]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'bob':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, -0.08, 0.05]}>
                        <boxGeometry args={[0.1, 0.45, 0.55]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, -0.08, 0.05]}>
                        <boxGeometry args={[0.1, 0.45, 0.55]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, -0.02, -0.38]}>
                        <boxGeometry args={[0.84, 0.4, 0.08]} />
                        {mat}
                    </mesh>
                    {/* Bangs */}
                    <mesh position={[0, 0.15, 0.38]}>
                        <boxGeometry args={[0.65, 0.08, 0.08]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'braids':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    {/* Left braid */}
                    <mesh position={[-0.32, -0.1, -0.15]}>
                        <boxGeometry args={[0.1, 0.45, 0.1]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.3, -0.45, -0.12]}>
                        <boxGeometry args={[0.08, 0.3, 0.08]} />
                        {mat}
                    </mesh>
                    {/* Right braid */}
                    <mesh position={[0.32, -0.1, -0.15]}>
                        <boxGeometry args={[0.1, 0.45, 0.1]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.3, -0.45, -0.12]}>
                        <boxGeometry args={[0.08, 0.3, 0.08]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'bun':
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.35, 0.08]} />
                        {mat}
                    </mesh>
                    {/* Bun */}
                    <mesh position={[0, 0.3, -0.42]}>
                        <boxGeometry args={[0.2, 0.2, 0.2]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'sidepart':
            return (
                <group>
                    <mesh position={[0.03, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    {/* Swept side */}
                    <mesh position={[-0.18, 0.28, 0.2]}>
                        <boxGeometry args={[0.35, 0.12, 0.35]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, 0.05, 0]}>
                        <boxGeometry args={[0.1, 0.28, 0.65]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.2, 0.55]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.3, 0.08]} />
                        {mat}
                    </mesh>
                </group>
            );

        default:
            return (
                <group>
                    <mesh position={[0, 0.22, -0.02]}>
                        <boxGeometry args={[0.84, 0.18, 0.84]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.1, -0.38]}>
                        <boxGeometry args={[0.84, 0.35, 0.08]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.25, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.38, 0.05, 0]}>
                        <boxGeometry args={[0.08, 0.25, 0.7]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.15, 0.3]}>
                        <boxGeometry args={[0.6, 0.08, 0.15]} />
                        {mat}
                    </mesh>
                </group>
            );
    }
});

// --- Arm color helper ---

const getArmColor = (
    shirtStyle: string | undefined,
    shirtColor: string,
    skinColor: string,
): string => {
    const shortSleeveStyles = ['tank', 't-shirt', 'polo'];
    if (shortSleeveStyles.includes(shirtStyle ?? 't-shirt')) return skinColor;
    return shirtColor;
};

// --- ShirtOverlay: box details on top of torso ---

const ShirtOverlay = memo<{
    style: string;
    color: string;
    bodyWidth: number;
    bodyDepth: number;
}>(({ style, color, bodyWidth, bodyDepth }) => {
    const darker = darkenColor(color, 0.75);
    const lighter = darkenColor(color, 1.15);
    const fz = bodyDepth / 2 + 0.02;

    switch (style) {
        case 'varsity':
            return (
                <group>
                    {/* Contrasting chest letter */}
                    <mesh position={[-0.06, 0.08, fz]}>
                        <boxGeometry args={[0.1, 0.12, 0.005]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                    {/* Collar stripe */}
                    <mesh position={[0, 0.3, 0]}>
                        <boxGeometry args={[bodyWidth + 0.02, 0.05, bodyDepth + 0.02]} />
                        {mcMat(lighter)}
                    </mesh>
                    {/* Bottom band */}
                    <mesh position={[0, -0.28, 0]}>
                        <boxGeometry args={[bodyWidth + 0.02, 0.05, bodyDepth + 0.02]} />
                        {mcMat(lighter)}
                    </mesh>
                </group>
            );
        case 'polo':
            return (
                <mesh position={[0, 0.28, 0]}>
                    <boxGeometry args={[bodyWidth * 0.6, 0.06, bodyDepth + 0.04]} />
                    {mcMat(lighter)}
                </mesh>
            );
        case 'hoodie':
            return (
                <group>
                    <mesh position={[0, 0.38, -bodyDepth / 2 - 0.02]} scale={[0.65, 0.4, 0.5]}>
                        <boxGeometry args={[0.4, 0.3, 0.25]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0, -0.05, fz]}>
                        <boxGeometry args={[0.12, 0.1, 0.01]} />
                        {mcMat(darker)}
                    </mesh>
                </group>
            );
        case 'sweater':
            return (
                <mesh position={[0, 0.28, 0]}>
                    <boxGeometry args={[bodyWidth * 0.7, 0.05, bodyDepth + 0.02]} />
                    {mcMat(darker)}
                </mesh>
            );
        case 'flannel':
            return (
                <group>
                    {[-0.08, 0.08].map((x, i) => (
                        <mesh key={`v${i}`} position={[x, 0, fz]}>
                            <boxGeometry args={[0.015, 0.6, 0.005]} />
                            {mcMat(darker)}
                        </mesh>
                    ))}
                    {[-0.1, 0.1].map((y, i) => (
                        <mesh key={`h${i}`} position={[0, y, fz]}>
                            <boxGeometry args={[bodyWidth * 0.9, 0.015, 0.005]} />
                            {mcMat(darker)}
                        </mesh>
                    ))}
                    <mesh position={[0, 0, fz]}>
                        <boxGeometry args={[0.015, 0.55, 0.005]} />
                        {mcMat(lighter)}
                    </mesh>
                </group>
            );
        case 'denim':
            return (
                <group>
                    <mesh position={[0, 0, fz]}>
                        <boxGeometry args={[0.015, 0.55, 0.005]} />
                        {mcMat(darker)}
                    </mesh>
                    {[0.12, 0.04, -0.04, -0.12].map((y, i) => (
                        <mesh key={i} position={[0, y, fz + 0.005]}>
                            <boxGeometry args={[0.03, 0.03, 0.005]} />
                            <meshStandardMaterial color={darker} roughness={0.3} metalness={0.2} />
                        </mesh>
                    ))}
                </group>
            );
        case 'jersey':
            return (
                <group>
                    <mesh position={[0.02, 0.02, fz]}>
                        <boxGeometry args={[0.02, 0.15, 0.005]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.08, fz]}>
                        <boxGeometry args={[0.08, 0.02, 0.005]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                </group>
            );
        case 'trackjacket':
            return (
                <mesh position={[0, 0, fz]}>
                    <boxGeometry args={[0.02, 0.6, 0.005]} />
                    <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.5} />
                </mesh>
            );
        case 'leather':
            return (
                <group>
                    <mesh position={[0.04, 0, fz]}>
                        <boxGeometry args={[0.015, 0.45, 0.005]} />
                        <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.6} />
                    </mesh>
                    <mesh position={[-0.06, 0.18, fz]}>
                        <boxGeometry args={[0.08, 0.06, 0.005]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0.06, 0.18, fz]}>
                        <boxGeometry args={[0.08, 0.06, 0.005]} />
                        {mcMat(darker)}
                    </mesh>
                </group>
            );
        case 'bomber':
            return (
                <group>
                    <mesh position={[0, 0.3, 0]}>
                        <boxGeometry args={[bodyWidth + 0.02, 0.06, bodyDepth + 0.02]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0, -0.28, 0]}>
                        <boxGeometry args={[bodyWidth + 0.02, 0.06, bodyDepth + 0.02]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0, 0, fz]}>
                        <boxGeometry args={[0.02, 0.55, 0.005]} />
                        <meshStandardMaterial color="#aaaaaa" roughness={0.2} metalness={0.5} />
                    </mesh>
                </group>
            );
        case 'blazer':
            return (
                <group>
                    <mesh position={[-0.06, 0.12, fz]}>
                        <boxGeometry args={[0.08, 0.16, 0.01]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0.06, 0.12, fz]}>
                        <boxGeometry args={[0.08, 0.16, 0.01]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0, 0.02, fz + 0.005]}>
                        <boxGeometry args={[0.03, 0.03, 0.005]} />
                        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.3} />
                    </mesh>
                </group>
            );
        case 'puffer':
            return (
                <group>
                    {[-0.12, -0.04, 0.04, 0.12].map((y, i) => (
                        <mesh key={i} position={[0, y, fz]}>
                            <boxGeometry args={[bodyWidth * 0.95, 0.012, 0.005]} />
                            {mcMat(darker)}
                        </mesh>
                    ))}
                    <mesh position={[0, 0, fz]}>
                        <boxGeometry args={[0.02, 0.55, 0.005]} />
                        <meshStandardMaterial color="#999999" roughness={0.2} metalness={0.5} />
                    </mesh>
                </group>
            );
        case 'kimono':
            return (
                <group>
                    <mesh position={[-0.04, 0.08, fz]} rotation={[0, 0, 0.1]}>
                        <boxGeometry args={[0.15, 0.25, 0.01]} />
                        {mcMat(lighter)}
                    </mesh>
                    <mesh position={[0.04, 0.08, fz]} rotation={[0, 0, -0.1]}>
                        <boxGeometry args={[0.15, 0.25, 0.01]} />
                        {mcMat(color)}
                    </mesh>
                    <mesh position={[0, -0.08, 0]}>
                        <boxGeometry args={[bodyWidth + 0.02, 0.08, bodyDepth + 0.02]} />
                        {mcMat(darker)}
                    </mesh>
                </group>
            );
        case 'suit_diamond':
            return (
                <group>
                    <mesh position={[-0.06, 0.12, fz]}>
                        <boxGeometry args={[0.08, 0.16, 0.01]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0.06, 0.12, fz]}>
                        <boxGeometry args={[0.08, 0.16, 0.01]} />
                        {mcMat(darker)}
                    </mesh>
                    <mesh position={[0, 0.06, fz + 0.01]} rotation={[0, 0, Math.PI / 4]}>
                        <boxGeometry args={[0.04, 0.04, 0.01]} />
                        <meshStandardMaterial color="#88ccff" roughness={0.05} metalness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.08, fz]}>
                        <boxGeometry args={[0.04, 0.2, 0.005]} />
                        {mcMat(darker)}
                    </mesh>
                </group>
            );
        case 'tank':
            return (
                <group>
                    {/* Visible strap left */}
                    <mesh position={[-bodyWidth * 0.28, 0.3, 0]}>
                        <boxGeometry args={[0.06, 0.08, bodyDepth + 0.02]} />
                        {mcMat(darker)}
                    </mesh>
                    {/* Visible strap right */}
                    <mesh position={[bodyWidth * 0.28, 0.3, 0]}>
                        <boxGeometry args={[0.06, 0.08, bodyDepth + 0.02]} />
                        {mcMat(darker)}
                    </mesh>
                    {/* Wider neckline scoop (darker inset) */}
                    <mesh position={[0, 0.28, fz]}>
                        <boxGeometry args={[bodyWidth * 0.45, 0.08, 0.005]} />
                        {mcMat(darker)}
                    </mesh>
                    {/* Bottom hem */}
                    <mesh position={[0, -0.3, 0]}>
                        <boxGeometry args={[bodyWidth + 0.02, 0.04, bodyDepth + 0.02]} />
                        {mcMat(darker)}
                    </mesh>
                </group>
            );
        default:
            return null;
    }
});

// --- LegsSection: box-based legs ---

const LegsSection = memo<{
    pantsStyle: string;
    pantsColor: string;
    shoeColor: string;
    skinColor: string;
    legWidth: number;
    legHeight: number;
    legSpacing: number;
    emissive: string;
    emissiveInt: number;
    onClickPants: (e: ThreeEvent<MouseEvent>) => void;
    onPointerEnterPants: (e: ThreeEvent<PointerEvent>) => void;
    onPointerLeave: (e: ThreeEvent<PointerEvent>) => void;
}>(({ pantsStyle, pantsColor, shoeColor, skinColor, legWidth, legHeight, legSpacing, emissive: emissiveColor, emissiveInt: emissiveIntVal, onClickPants, onPointerEnterPants, onPointerLeave }) => {
    const style = pantsStyle || 'standard';
    const darker = darkenColor(pantsColor, 0.8);

    const shoeMat = <meshStandardMaterial color={shoeColor} roughness={0.5} />;

    if (style === 'skirt' || style === 'pleated') {
        const skirtWidth = legSpacing * 2 + legWidth + 0.15;
        return (
            <group
                position={[0, 0.5, 0]}
                onClick={onClickPants}
                onPointerEnter={onPointerEnterPants}
                onPointerLeave={onPointerLeave}
            >
                <mesh position={[0, 0.05, 0]}>
                    <boxGeometry args={[skirtWidth, 0.5, legWidth + 0.08]} />
                    {mcMat(pantsColor, emissiveColor, emissiveIntVal)}
                </mesh>
                {style === 'pleated' && (
                    <group>
                        {[-0.08, 0, 0.08].map((x, i) => (
                            <mesh key={i} position={[x, 0.05, legWidth / 2 + 0.045]}>
                                <boxGeometry args={[0.01, 0.45, 0.005]} />
                                {mcMat(darker)}
                            </mesh>
                        ))}
                    </group>
                )}
                {[-legSpacing, legSpacing].map((x, i) => (
                    <group key={i}>
                        <mesh position={[x, -0.245, 0]}>
                            <boxGeometry args={[legWidth * 0.8, 0.15, legWidth * 0.8]} />
                            {mcMat(skinColor)}
                        </mesh>
                        <mesh position={[x, -0.365, 0.02]}>
                            <boxGeometry args={[legWidth + 0.04, 0.1, legWidth + 0.06]} />
                            {shoeMat}
                        </mesh>
                    </group>
                ))}
            </group>
        );
    }

    if (style === 'shorts') {
        return (
            <group>
                {[-legSpacing, legSpacing].map((x, i) => (
                    <group
                        key={i}
                        position={[x, 0.5, 0]}
                        onClick={onClickPants}
                        onPointerEnter={onPointerEnterPants}
                        onPointerLeave={onPointerLeave}
                    >
                        <mesh position={[0, 0.05, 0]}>
                            <boxGeometry args={[legWidth + 0.02, 0.22, legWidth + 0.02]} />
                            {mcMat(pantsColor, emissiveColor, emissiveIntVal)}
                        </mesh>
                        <mesh position={[0, -0.18, 0]}>
                            <boxGeometry args={[legWidth * 0.9, 0.28, legWidth * 0.9]} />
                            {mcMat(skinColor)}
                        </mesh>
                        <mesh position={[0, -0.365, 0.02]}>
                            <boxGeometry args={[legWidth + 0.04, 0.1, legWidth + 0.06]} />
                            {shoeMat}
                        </mesh>
                    </group>
                ))}
            </group>
        );
    }

    const getLegScale = (): [number, number, number] => {
        switch (style) {
            case 'chinos': return [0.9, 1, 0.9];
            case 'joggers': return [1.08, 1, 1.08];
            case 'skinny': return [0.82, 1, 0.82];
            case 'baggy': return [1.25, 1, 1.25];
            case 'sweatpants': return [1.12, 1, 1.12];
            default: return [1, 1, 1];
        }
    };

    const legScale = getLegScale();

    return (
        <group>
            {[-legSpacing, legSpacing].map((x, i) => (
                <group
                    key={i}
                    position={[x, 0.5, 0]}
                    onClick={onClickPants}
                    onPointerEnter={onPointerEnterPants}
                    onPointerLeave={onPointerLeave}
                >
                    <mesh scale={legScale}>
                        <boxGeometry args={[legWidth, legHeight, legWidth]} />
                        {mcMat(pantsColor, emissiveColor, emissiveIntVal)}
                    </mesh>

                    {style === 'cargo' && (
                        <mesh position={[(i === 0 ? -1 : 1) * (legWidth / 2 + 0.02), -0.05, 0]}>
                            <boxGeometry args={[0.04, 0.08, 0.06]} />
                            {mcMat(darker)}
                        </mesh>
                    )}

                    {style === 'ripped' && (
                        <group>
                            <mesh position={[0, -0.05, legWidth / 2 + 0.005]}>
                                <boxGeometry args={[0.08, 0.03, 0.01]} />
                                {mcMat(skinColor)}
                            </mesh>
                            <mesh position={[0, 0.08, legWidth / 2 + 0.005]}>
                                <boxGeometry args={[0.06, 0.025, 0.01]} />
                                {mcMat(skinColor)}
                            </mesh>
                        </group>
                    )}

                    {style === 'formal' && (
                        <mesh position={[0, 0, legWidth / 2 + 0.005]}>
                            <boxGeometry args={[0.008, legHeight * 0.9, 0.005]} />
                            {mcMat(darkenColor(pantsColor, 1.15))}
                        </mesh>
                    )}

                    {/* Shoe */}
                    <mesh position={[0, -(legHeight / 2 + 0.04), 0.02]}>
                        <boxGeometry args={[legWidth + 0.04, 0.1, legWidth + 0.06]} />
                        {shoeMat}
                    </mesh>
                </group>
            ))}
        </group>
    );
});

// --- Accessory Layer (box-based) ---

const HEAD_ACCESSORIES = new Set([
    'cap', 'beanie', 'bandana', 'glasses', 'sunglasses',
    'headphones', 'earbuds', 'crown', 'halo', 'crown_gold',
]);

const AccessoryLayer = memo<{
    accessory: AvatarConfig['accessory'];
    color: string;
    gender: AvatarConfig['gender'];
    headMount?: boolean;
}>(({ accessory, color, gender, headMount }) => {
    if (accessory === 'none') return null;
    const isHead = HEAD_ACCESSORIES.has(accessory);
    if (headMount === true && !isHead) return null;
    if (headMount === false && isHead) return null;

    const matP = <meshStandardMaterial color={color} roughness={0.6} />;
    const matDk = <meshStandardMaterial color={darkenColor(color, 0.6)} roughness={0.8} />;
    const matFab = <meshStandardMaterial color={color} roughness={0.95} />;
    const matMet = <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />;
    const matGold = <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.9} />;
    const matGlow = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />;
    const matBlk = <meshStandardMaterial color="#111111" roughness={0.8} />;
    const matWht = <meshStandardMaterial color="#eeeeee" roughness={0.6} />;
    const matGlass = <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.3} />;
    const matGlassDk = <meshStandardMaterial color="#222222" roughness={0.1} transparent opacity={0.65} />;

    switch (accessory) {
        case 'cap':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.30, -0.02]}>
                        <boxGeometry args={[0.88, 0.18, 0.88]} />
                        {matP}
                    </mesh>
                    <mesh position={[0, 0.22, 0.48]}>
                        <boxGeometry args={[0.65, 0.06, 0.22]} />
                        {matDk}
                    </mesh>
                </group>
            );
        case 'beanie':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.32, -0.02]}>
                        <boxGeometry args={[0.86, 0.3, 0.86]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0, 0.15, 0]}>
                        <boxGeometry args={[0.88, 0.08, 0.88]} />
                        {matDk}
                    </mesh>
                </group>
            );
        case 'bandana':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.12, 0]}>
                        <boxGeometry args={[0.86, 0.12, 0.86]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0.35, 0.02, -0.3]} rotation={[0.3, -0.5, 0.4]}>
                        <boxGeometry args={[0.08, 0.15, 0.04]} />
                        {matFab}
                    </mesh>
                </group>
            );
        case 'glasses':
            return (
                <group position={[0, 2.06, 0.42]}>
                    <mesh position={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.14, 0.12, 0.02]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0.15, 0, 0]}>
                        <boxGeometry args={[0.14, 0.12, 0.02]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.06, 0.02, 0.02]} />
                        {matMet}
                    </mesh>
                    <mesh position={[-0.15, 0, -0.005]}>
                        <boxGeometry args={[0.1, 0.08, 0.005]} />
                        {matGlass}
                    </mesh>
                    <mesh position={[0.15, 0, -0.005]}>
                        <boxGeometry args={[0.1, 0.08, 0.005]} />
                        {matGlass}
                    </mesh>
                </group>
            );
        case 'sunglasses':
            return (
                <group position={[0, 2.06, 0.42]}>
                    <mesh position={[-0.15, 0, 0]}>
                        <boxGeometry args={[0.16, 0.12, 0.02]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[0.15, 0, 0]}>
                        <boxGeometry args={[0.16, 0.12, 0.02]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.06, 0.02, 0.02]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[-0.15, 0, -0.005]}>
                        <boxGeometry args={[0.12, 0.08, 0.005]} />
                        {matGlassDk}
                    </mesh>
                    <mesh position={[0.15, 0, -0.005]}>
                        <boxGeometry args={[0.12, 0.08, 0.005]} />
                        {matGlassDk}
                    </mesh>
                </group>
            );
        case 'headphones':
            return (
                <group position={[0, 2.0, 0]}>
                    {/* Headband */}
                    <mesh position={[0, 0.38, 0]}>
                        <boxGeometry args={[1.04, 0.07, 0.14]} />
                        {matBlk}
                    </mesh>
                    {/* Left earcup */}
                    <mesh position={[-0.50, 0.05, 0.05]}>
                        <boxGeometry args={[0.16, 0.22, 0.22]} />
                        {matP}
                    </mesh>
                    {/* Right earcup */}
                    <mesh position={[0.50, 0.05, 0.05]}>
                        <boxGeometry args={[0.16, 0.22, 0.22]} />
                        {matP}
                    </mesh>
                    {/* Left band */}
                    <mesh position={[-0.50, 0.22, 0]}>
                        <boxGeometry args={[0.07, 0.26, 0.07]} />
                        {matBlk}
                    </mesh>
                    {/* Right band */}
                    <mesh position={[0.50, 0.22, 0]}>
                        <boxGeometry args={[0.07, 0.26, 0.07]} />
                        {matBlk}
                    </mesh>
                </group>
            );
        case 'earbuds':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[-0.42, -0.02, 0.08]}>
                        <boxGeometry args={[0.06, 0.06, 0.06]} />
                        {matWht}
                    </mesh>
                    <mesh position={[-0.42, -0.1, 0.06]}>
                        <boxGeometry args={[0.03, 0.08, 0.03]} />
                        {matWht}
                    </mesh>
                    <mesh position={[0.42, -0.02, 0.08]}>
                        <boxGeometry args={[0.06, 0.06, 0.06]} />
                        {matWht}
                    </mesh>
                    <mesh position={[0.42, -0.1, 0.06]}>
                        <boxGeometry args={[0.03, 0.08, 0.03]} />
                        {matWht}
                    </mesh>
                </group>
            );
        case 'crown':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.42, 0]}>
                        <boxGeometry args={[0.7, 0.12, 0.7]} />
                        {matGold}
                    </mesh>
                    {[[-0.25, 0, 0.25], [0.25, 0, 0.25], [0, 0, -0.25], [-0.25, 0, -0.25], [0.25, 0, -0.25]].map((pos, i) => (
                        <mesh key={i} position={[pos[0], 0.58, pos[2]]}>
                            <boxGeometry args={[0.06, 0.14, 0.06]} />
                            {matGold}
                        </mesh>
                    ))}
                </group>
            );
        case 'halo':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.65, 0]}>
                        <boxGeometry args={[0.7, 0.06, 0.7]} />
                        {matGlow}
                    </mesh>
                    <mesh position={[0, 0.65, 0]}>
                        <boxGeometry args={[0.5, 0.08, 0.5]} />
                        <meshStandardMaterial color="#000000" transparent opacity={0} />
                    </mesh>
                </group>
            );
        case 'backpack':
            return (
                <group position={[0, 1.1, -0.32]}>
                    <mesh>
                        <boxGeometry args={[0.32, 0.4, 0.18]} />
                        {matP}
                    </mesh>
                    <mesh position={[0, 0.22, 0.02]}>
                        <boxGeometry args={[0.34, 0.06, 0.2]} />
                        {matDk}
                    </mesh>
                    <mesh position={[-0.12, 0.12, 0.1]}>
                        <boxGeometry args={[0.03, 0.35, 0.03]} />
                        {matDk}
                    </mesh>
                    <mesh position={[0.12, 0.12, 0.1]}>
                        <boxGeometry args={[0.03, 0.35, 0.03]} />
                        {matDk}
                    </mesh>
                </group>
            );
        case 'satchel':
            return (
                <group>
                    <mesh position={[0.1, 1.35, 0.08]} rotation={[0, 0, -0.6]}>
                        <boxGeometry args={[0.03, 0.7, 0.03]} />
                        {matDk}
                    </mesh>
                    <mesh position={[0.35, 0.75, 0.12]}>
                        <boxGeometry args={[0.2, 0.15, 0.1]} />
                        <meshStandardMaterial color={darkenColor(color, 0.7)} roughness={0.5} />
                    </mesh>
                    <mesh position={[0.35, 0.8, 0.18]}>
                        <boxGeometry args={[0.22, 0.04, 0.11]} />
                        {matDk}
                    </mesh>
                </group>
            );
        case 'watch':
            return (
                <group position={[-(gender === 'female' ? 0.36 : 0.42), 0.58, 0]}>
                    <mesh>
                        <boxGeometry args={[0.08, 0.04, 0.14]} />
                        <meshStandardMaterial color={darkenColor(color, 0.7)} roughness={0.5} />
                    </mesh>
                    <mesh position={[0.01, 0.025, 0]}>
                        <boxGeometry args={[0.06, 0.01, 0.08]} />
                        {matMet}
                    </mesh>
                </group>
            );
        case 'smartwatch':
            return (
                <group position={[-(gender === 'female' ? 0.36 : 0.42), 0.58, 0]}>
                    <mesh>
                        <boxGeometry args={[0.08, 0.04, 0.14]} />
                        {matP}
                    </mesh>
                    <mesh position={[0.01, 0.025, 0]}>
                        <boxGeometry args={[0.07, 0.01, 0.09]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[0.015, 0.03, 0]}>
                        <boxGeometry args={[0.05, 0.005, 0.065]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
                    </mesh>
                </group>
            );
        case 'necklace':
            return (
                <group position={[0, 1.42, 0]}>
                    <mesh position={[0, -0.05, 0.15]}>
                        <boxGeometry args={[0.25, 0.03, 0.03]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0, -0.12, 0.16]}>
                        <boxGeometry args={[0.06, 0.06, 0.03]} />
                        {matMet}
                    </mesh>
                </group>
            );
        case 'chain':
            return (
                <group position={[0, 1.42, 0]}>
                    <mesh position={[0, -0.05, 0.15]}>
                        <boxGeometry args={[0.3, 0.04, 0.04]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, -0.12, 0.16]}>
                        <boxGeometry args={[0.32, 0.03, 0.03]} />
                        {matGold}
                    </mesh>
                </group>
            );
        case 'scarf':
            return (
                <group position={[0, 1.42, 0]}>
                    <mesh position={[0, -0.04, 0]}>
                        <boxGeometry args={[0.42, 0.12, 0.4]} />
                        {matFab}
                    </mesh>
                    <mesh position={[-0.08, -0.22, 0.15]}>
                        <boxGeometry args={[0.08, 0.22, 0.06]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0.05, -0.24, 0.14]}>
                        <boxGeometry args={[0.08, 0.25, 0.06]} />
                        {matFab}
                    </mesh>
                </group>
            );
        case 'bowtie':
            return (
                <group position={[0, 1.35, 0.2]}>
                    <mesh position={[-0.05, 0, 0]}>
                        <boxGeometry args={[0.08, 0.06, 0.03]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0.05, 0, 0]}>
                        <boxGeometry args={[0.08, 0.06, 0.03]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0, 0, 0.01]}>
                        <boxGeometry args={[0.03, 0.03, 0.02]} />
                        {matDk}
                    </mesh>
                </group>
            );
        case 'tie':
            return (
                <group position={[0, 1.35, 0.2]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.06, 0.05, 0.02]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0, -0.1, 0]}>
                        <boxGeometry args={[0.05, 0.12, 0.02]} />
                        {matFab}
                    </mesh>
                    <mesh position={[0, -0.22, 0]}>
                        <boxGeometry args={[0.06, 0.1, 0.02]} />
                        {matFab}
                    </mesh>
                </group>
            );
        case 'cape':
            return (
                <group position={[0, 1.1, -0.22]}>
                    {/* Shoulder bar */}
                    <mesh position={[0, 0.1, 0.1]}>
                        <boxGeometry args={[0.55, 0.04, 0.04]} />
                        {matFab}
                    </mesh>
                    {/* Cape body — wider to peek past shoulders */}
                    <mesh position={[0, -0.3, -0.02]}>
                        <boxGeometry args={[0.6, 0.85, 0.04]} />
                        {matFab}
                    </mesh>
                    {/* Left shoulder clasp — visible from front */}
                    <mesh position={[-0.25, 0.1, 0.16]}>
                        <boxGeometry args={[0.07, 0.07, 0.07]} />
                        {matGold}
                    </mesh>
                    {/* Right shoulder clasp — visible from front */}
                    <mesh position={[0.25, 0.1, 0.16]}>
                        <boxGeometry args={[0.07, 0.07, 0.07]} />
                        {matGold}
                    </mesh>
                    {/* Side drapes visible from front — left */}
                    <mesh position={[-0.3, -0.05, 0.06]}>
                        <boxGeometry args={[0.06, 0.35, 0.03]} />
                        {matFab}
                    </mesh>
                    {/* Side drapes visible from front — right */}
                    <mesh position={[0.3, -0.05, 0.06]}>
                        <boxGeometry args={[0.06, 0.35, 0.03]} />
                        {matFab}
                    </mesh>
                </group>
            );
        case 'skateboard':
            return (
                <group position={[0.3, -0.12, 0.1]} rotation={[0, 0.4, 0]}>
                    <mesh>
                        <boxGeometry args={[0.12, 0.03, 0.5]} />
                        {matP}
                    </mesh>
                    <mesh position={[0, -0.03, 0.18]}>
                        <boxGeometry args={[0.1, 0.02, 0.04]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0, -0.03, -0.18]}>
                        <boxGeometry args={[0.1, 0.02, 0.04]} />
                        {matMet}
                    </mesh>
                    {[[-0.04, -0.05, 0.18], [0.04, -0.05, 0.18], [-0.04, -0.05, -0.18], [0.04, -0.05, -0.18]].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]}>
                            <boxGeometry args={[0.04, 0.04, 0.04]} />
                            {matWht}
                        </mesh>
                    ))}
                </group>
            );
        case 'guitar':
            return (
                <group position={[0.12, 0.95, -0.25]} rotation={[0.2, 0.4, -0.12]}>
                    <mesh position={[0, -0.15, 0]}>
                        <boxGeometry args={[0.25, 0.3, 0.06]} />
                        {matP}
                    </mesh>
                    <mesh position={[0, 0.15, 0]}>
                        <boxGeometry args={[0.06, 0.35, 0.03]} />
                        {matDk}
                    </mesh>
                    <mesh position={[0, 0.35, 0]}>
                        <boxGeometry args={[0.08, 0.06, 0.03]} />
                        {matDk}
                    </mesh>
                </group>
            );
        case 'wings':
            return (
                <group position={[0, 1.15, -0.2]}>
                    {/* Upper wing feathers — extend far past body silhouette */}
                    <mesh position={[-0.42, 0.1, -0.02]} rotation={[0, 0.3, 0.2]}>
                        <boxGeometry args={[0.5, 0.4, 0.03]} />
                        {matWht}
                    </mesh>
                    <mesh position={[0.42, 0.1, -0.02]} rotation={[0, -0.3, -0.2]}>
                        <boxGeometry args={[0.5, 0.4, 0.03]} />
                        {matWht}
                    </mesh>
                    {/* Lower wing feathers */}
                    <mesh position={[-0.48, -0.15, -0.04]} rotation={[0, 0.4, 0.35]}>
                        <boxGeometry args={[0.38, 0.28, 0.03]} />
                        {matWht}
                    </mesh>
                    <mesh position={[0.48, -0.15, -0.04]} rotation={[0, -0.4, -0.35]}>
                        <boxGeometry args={[0.38, 0.28, 0.03]} />
                        {matWht}
                    </mesh>
                    {/* Wing tips — outermost, clearly visible from front */}
                    <mesh position={[-0.6, 0.22, -0.06]} rotation={[0, 0.4, 0.35]}>
                        <boxGeometry args={[0.2, 0.18, 0.02]} />
                        {matWht}
                    </mesh>
                    <mesh position={[0.6, 0.22, -0.06]} rotation={[0, -0.4, -0.35]}>
                        <boxGeometry args={[0.2, 0.18, 0.02]} />
                        {matWht}
                    </mesh>
                </group>
            );
        case 'sword':
            return (
                <group position={[-0.42, 0.6, 0.08]} rotation={[0, 0, 0.12]}>
                    {/* Blade — wider and more visible */}
                    <mesh position={[0, 0.28, 0]}>
                        <boxGeometry args={[0.07, 0.5, 0.03]} />
                        <meshStandardMaterial color="#d8d8d8" roughness={0.08} metalness={0.95} />
                    </mesh>
                    {/* Blade tip */}
                    <mesh position={[0, 0.56, 0]}>
                        <boxGeometry args={[0.05, 0.08, 0.02]} />
                        <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={1} />
                    </mesh>
                    {/* Crossguard */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.2, 0.05, 0.05]} />
                        {matGold}
                    </mesh>
                    {/* Handle/grip */}
                    <mesh position={[0, -0.12, 0]}>
                        <boxGeometry args={[0.05, 0.16, 0.05]} />
                        {matDk}
                    </mesh>
                    {/* Pommel */}
                    <mesh position={[0, -0.22, 0]}>
                        <boxGeometry args={[0.06, 0.04, 0.06]} />
                        {matGold}
                    </mesh>
                </group>
            );
        case 'shield':
            return (
                <group position={[0, 1.0, -0.38]} rotation={[0.1, 0, 0]}>
                    <mesh>
                        <boxGeometry args={[0.35, 0.4, 0.04]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0, 0, 0.025]}>
                        <boxGeometry args={[0.25, 0.04, 0.01]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, 0, 0.025]}>
                        <boxGeometry args={[0.04, 0.3, 0.01]} />
                        {matGold}
                    </mesh>
                </group>
            );
        case 'pet_cat':
            return (
                <group position={[0.4, -0.02, 0.25]}>
                    <mesh><boxGeometry args={[0.12, 0.1, 0.2]} />{matP}</mesh>
                    <mesh position={[0, 0.08, 0.08]}><boxGeometry args={[0.1, 0.1, 0.1]} />{matP}</mesh>
                    <mesh position={[-0.04, 0.15, 0.08]}><boxGeometry args={[0.03, 0.05, 0.02]} />{matP}</mesh>
                    <mesh position={[0.04, 0.15, 0.08]}><boxGeometry args={[0.03, 0.05, 0.02]} />{matP}</mesh>
                    <mesh position={[-0.02, 0.09, 0.14]}><boxGeometry args={[0.02, 0.02, 0.01]} />{matBlk}</mesh>
                    <mesh position={[0.02, 0.09, 0.14]}><boxGeometry args={[0.02, 0.02, 0.01]} />{matBlk}</mesh>
                    <mesh position={[-0.04, 0.04, -0.12]} rotation={[0.6, 0.3, 0]}>
                        <boxGeometry args={[0.02, 0.15, 0.02]} />{matP}
                    </mesh>
                </group>
            );
        case 'pet_dog':
            return (
                <group position={[-0.4, -0.02, 0.3]}>
                    <mesh><boxGeometry args={[0.14, 0.1, 0.2]} />{matP}</mesh>
                    <mesh position={[0, 0.08, 0.1]}><boxGeometry args={[0.1, 0.1, 0.1]} />{matP}</mesh>
                    <mesh position={[0, 0.06, 0.18]}><boxGeometry args={[0.06, 0.04, 0.06]} />{matDk}</mesh>
                    <mesh position={[0, 0.07, 0.21]}><boxGeometry args={[0.03, 0.03, 0.01]} />{matBlk}</mesh>
                    <mesh position={[-0.06, 0.12, 0.08]} rotation={[0, 0, -0.4]}>
                        <boxGeometry args={[0.04, 0.06, 0.02]} />{matDk}
                    </mesh>
                    <mesh position={[0.06, 0.12, 0.08]} rotation={[0, 0, 0.4]}>
                        <boxGeometry args={[0.04, 0.06, 0.02]} />{matDk}
                    </mesh>
                    <mesh position={[0, 0.08, -0.12]} rotation={[-0.6, 0, 0]}>
                        <boxGeometry args={[0.02, 0.1, 0.02]} />{matP}
                    </mesh>
                </group>
            );
        case 'robot_arm':
            return (
                <group position={[gender === 'female' ? 0.38 : 0.44, 0.95, 0]}>
                    <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.1, 0.1, 0.1]} />
                        <meshStandardMaterial color="#888888" roughness={0.15} metalness={0.85} />
                    </mesh>
                    <mesh position={[0, 0.08, 0]}><boxGeometry args={[0.08, 0.18, 0.08]} />
                        <meshStandardMaterial color="#666666" roughness={0.2} metalness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.06, 0]}><boxGeometry args={[0.06, 0.06, 0.06]} />{matMet}</mesh>
                    <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.07, 0.14, 0.07]} />
                        <meshStandardMaterial color="#666666" roughness={0.2} metalness={0.8} />
                    </mesh>
                    <mesh position={[-0.03, -0.26, 0]} rotation={[0, 0, 0.2]}>
                        <boxGeometry args={[0.02, 0.08, 0.03]} />{matMet}
                    </mesh>
                    <mesh position={[0.03, -0.26, 0]} rotation={[0, 0, -0.2]}>
                        <boxGeometry args={[0.02, 0.08, 0.03]} />{matMet}
                    </mesh>
                    <mesh position={[0, -0.02, 0.04]}><boxGeometry args={[0.03, 0.03, 0.02]} />{matGlow}</mesh>
                </group>
            );
        case 'crown_gold':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.45, 0]}>
                        <boxGeometry args={[0.75, 0.14, 0.75]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, 0.56, 0]}>
                        <boxGeometry args={[0.76, 0.08, 0.76]} />
                        {matGold}
                    </mesh>
                    {[[-0.28, 0, 0.28], [0.28, 0, 0.28], [0, 0, -0.28], [-0.28, 0, -0.28], [0.28, 0, -0.28], [0, 0, 0.28]].map((pos, i) => (
                        <mesh key={i} position={[pos[0], 0.7, pos[2]]}>
                            <boxGeometry args={[0.06, 0.14, 0.06]} />
                            {matGold}
                        </mesh>
                    ))}
                    <mesh position={[0, 0.65, 0.35]}>
                        <boxGeometry args={[0.04, 0.04, 0.04]} />
                        <meshStandardMaterial color="#ff1744" roughness={0.1} metalness={0.3} />
                    </mesh>
                </group>
            );
        case 'wings_cyber':
            return (
                <group position={[0, 1.15, -0.2]}>
                    {/* Left cyber wing frame — extends past body */}
                    <mesh position={[-0.45, 0.1, -0.02]}>
                        <boxGeometry args={[0.5, 0.04, 0.03]} />
                        {matMet}
                    </mesh>
                    <mesh position={[-0.48, -0.06, -0.04]}>
                        <boxGeometry args={[0.44, 0.04, 0.03]} />
                        {matMet}
                    </mesh>
                    <mesh position={[-0.45, 0.02, -0.03]}>
                        <boxGeometry args={[0.44, 0.2, 0.02]} />
                        <meshStandardMaterial color={color} roughness={0.1} metalness={0.5} transparent opacity={0.5} />
                    </mesh>
                    {/* Right cyber wing frame — extends past body */}
                    <mesh position={[0.45, 0.1, -0.02]}>
                        <boxGeometry args={[0.5, 0.04, 0.03]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0.48, -0.06, -0.04]}>
                        <boxGeometry args={[0.44, 0.04, 0.03]} />
                        {matMet}
                    </mesh>
                    <mesh position={[0.45, 0.02, -0.03]}>
                        <boxGeometry args={[0.44, 0.2, 0.02]} />
                        <meshStandardMaterial color={color} roughness={0.1} metalness={0.5} transparent opacity={0.5} />
                    </mesh>
                </group>
            );
        case 'jetpack':
            return (
                <group position={[0, 1.05, -0.28]}>
                    {/* Main tanks */}
                    <mesh position={[-0.1, 0, 0]}><boxGeometry args={[0.14, 0.32, 0.14]} />{matMet}</mesh>
                    <mesh position={[0.1, 0, 0]}><boxGeometry args={[0.14, 0.32, 0.14]} />{matMet}</mesh>
                    {/* Center connector */}
                    <mesh position={[0, 0.04, 0.04]}><boxGeometry args={[0.08, 0.04, 0.04]} />{matDk}</mesh>
                    {/* Shoulder straps visible from front — left */}
                    <mesh position={[-0.12, 0.16, 0.2]}>
                        <boxGeometry args={[0.04, 0.04, 0.35]} />{matDk}
                    </mesh>
                    {/* Shoulder straps visible from front — right */}
                    <mesh position={[0.12, 0.16, 0.2]}>
                        <boxGeometry args={[0.04, 0.04, 0.35]} />{matDk}
                    </mesh>
                    {/* Nozzles */}
                    <mesh position={[-0.1, -0.2, 0]}><boxGeometry args={[0.08, 0.08, 0.08]} />{matBlk}</mesh>
                    <mesh position={[0.1, -0.2, 0]}><boxGeometry args={[0.08, 0.08, 0.08]} />{matBlk}</mesh>
                    {/* Flames */}
                    <mesh position={[-0.1, -0.28, 0]}>
                        <boxGeometry args={[0.06, 0.12, 0.06]} />
                        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.7} />
                    </mesh>
                    <mesh position={[0.1, -0.28, 0]}>
                        <boxGeometry args={[0.06, 0.12, 0.06]} />
                        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.7} />
                    </mesh>
                </group>
            );
        case 'pet_robo':
            return (
                <group position={[-0.38, -0.05, 0.3]}>
                    <mesh><boxGeometry args={[0.16, 0.1, 0.2]} />
                        <meshStandardMaterial color="#888888" roughness={0.15} metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.08, 0.06]}><boxGeometry args={[0.12, 0.08, 0.1]} />
                        <meshStandardMaterial color="#999999" roughness={0.15} metalness={0.8} />
                    </mesh>
                    <mesh position={[-0.03, 0.1, 0.12]}><boxGeometry args={[0.02, 0.02, 0.02]} />{matGlow}</mesh>
                    <mesh position={[0.03, 0.1, 0.12]}><boxGeometry args={[0.02, 0.02, 0.02]} />{matGlow}</mesh>
                    <mesh position={[0, 0.15, 0.06]}><boxGeometry args={[0.02, 0.06, 0.02]} />
                        <meshStandardMaterial color="#aaaaaa" roughness={0.1} metalness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.19, 0.06]}><boxGeometry args={[0.03, 0.03, 0.03]} />{matGlow}</mesh>
                    {[[-0.05, -0.08, 0.06], [0.05, -0.08, 0.06], [-0.05, -0.08, -0.06], [0.05, -0.08, -0.06]].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]}>
                            <boxGeometry args={[0.03, 0.06, 0.03]} />
                            <meshStandardMaterial color="#666666" roughness={0.2} metalness={0.8} />
                        </mesh>
                    ))}
                </group>
            );
        default:
            return null;
    }
});

// --- AvatarModel: animation + layout ---

const AvatarModel = memo<{
    config: AvatarConfig;
    variant: 'full' | 'head';
    onPartClick?: (part: string) => void;
    interactive: boolean;
}>(({ config, variant, onPartClick, interactive }) => {
    const dims = useMemo(
        () => getBodyDimensions(config.baseModel, config.gender),
        [config.baseModel, config.gender]
    );

    const skinColor = dims.isRobot ? '#C0C0C0' : config.skinColor;
    const hairColor = config.hairColor ?? '#5D4037';
    const shirtColor = config.shirtColor ?? '#D97757';
    const pantsColor = config.pantsColor ?? '#1e293b';
    const shoeColor = config.shoeColor ?? '#1a1a1a';

    const headRef = useRef<THREE.Group>(null);
    const torsoRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const eyeGroupRef = useRef<THREE.Group>(null);

    const bounceProgressRef = useRef(0);
    const blinkTimerRef = useRef(2 + Math.random() * 3);
    const blinkProgressRef = useRef(0);

    const [hoveredPart, setHoveredPart] = useState<string | null>(null);

    useEffect(() => { bounceProgressRef.current = 1; }, [config.expression]);

    useEffect(() => {
        blinkProgressRef.current = 0;
        blinkTimerRef.current = 2 + Math.random() * 3;
        if (eyeGroupRef.current) eyeGroupRef.current.scale.y = 1;
    }, [config.gender]);

    useEffect(() => {
        return () => { document.body.style.cursor = 'default'; };
    }, []);

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        if (headRef.current && bounceProgressRef.current > 0) {
            bounceProgressRef.current = Math.max(0, bounceProgressRef.current - delta * 4);
            const p = bounceProgressRef.current;
            headRef.current.position.y = 2.0 + Math.sin((1 - p) * Math.PI * 3) * p * 0.1;
        }

        if (headRef.current) {
            const targetRotX = -state.pointer.y * 0.2;
            const targetRotY = state.pointer.x * 0.3;
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, delta * 3);
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, delta * 3);
        }

        if (torsoRef.current) {
            const breath = 1 + Math.sin(t * 0.9) * 0.01;
            torsoRef.current.scale.x = breath;
            torsoRef.current.scale.z = breath;
        }

        blinkTimerRef.current -= delta;
        if (blinkTimerRef.current <= 0) {
            blinkTimerRef.current = 2.5 + Math.random() * 4;
            blinkProgressRef.current = 1;
        }
        if (eyeGroupRef.current && blinkProgressRef.current > 0) {
            blinkProgressRef.current = Math.max(0, blinkProgressRef.current - delta * 12);
            const p = blinkProgressRef.current;
            eyeGroupRef.current.scale.y = Math.max(0.05, 1 - Math.sin((1 - p) * Math.PI));
        }

        if (leftArmRef.current && rightArmRef.current) {
            const pose = config.pose ?? 'idle';
            if (pose === 'wave') {
                const waveZ = -1.1 + Math.sin(t * 2) * 0.35;
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, waveZ, delta * 8);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, delta * 5);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, delta * 5);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, delta * 5);
            } else if (pose === 'dab') {
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.7, delta * 5);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.3, delta * 5);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 1.0, delta * 5);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.4, delta * 5);
            } else if (pose === 'peace') {
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.5, delta * 5);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.5, delta * 5);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, delta * 5);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, delta * 5);
            } else {
                const sway = Math.sin(t * 0.6) * 0.04;
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, sway, delta * 2);
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -sway, delta * 2);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, delta * 3);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, delta * 3);
            }
        }
    });

    const handleClick = useCallback((e: ThreeEvent<MouseEvent>, part: string) => {
        if (interactive && onPartClick) { e.stopPropagation(); onPartClick(part); }
    }, [interactive, onPartClick]);

    const handlePointerEnter = useCallback((e: ThreeEvent<PointerEvent>, part: string) => {
        if (interactive) { e.stopPropagation(); setHoveredPart(part); document.body.style.cursor = 'pointer'; }
    }, [interactive]);

    const handlePointerLeave = useCallback((_e: ThreeEvent<PointerEvent>) => {
        if (interactive) { setHoveredPart(null); document.body.style.cursor = 'default'; }
    }, [interactive]);

    const emissive = (part: string) => hoveredPart === part && interactive ? '#D97757' : '#000000';
    const emissiveInt = (part: string) => hoveredPart === part && interactive ? 0.12 : 0;

    const skinMatProps = {
        color: skinColor,
        roughness: dims.isRobot ? 0.15 : 0.85,
        metalness: dims.isRobot ? 0.85 : 0,
    };

    const armColor = getArmColor(config.shirtStyle, shirtColor, skinColor);

    // Flatten hair under headwear (cap/beanie)
    const hasHeadCover = config.accessory === 'cap' || config.accessory === 'beanie';
    const hairScale: [number, number, number] = hasHeadCover
        ? [1, config.accessory === 'beanie' ? 0.35 : 0.5, 1]
        : [1, 1, 1];
    const hairOffset: [number, number, number] = hasHeadCover
        ? [0, config.accessory === 'beanie' ? -0.10 : -0.06, 0]
        : [0, 0, 0];

    return (
        <group position={[0, variant === 'head' ? -1.5 : -0.105, 0]}>

            {/* Head – cube with mouse-look */}
            <group ref={headRef} position={[0, 2.0, 0]}>
                <group
                    onClick={(e) => handleClick(e, 'skin')}
                    onPointerEnter={(e) => handlePointerEnter(e, 'skin')}
                    onPointerLeave={handlePointerLeave}
                >
                    <mesh>
                        <boxGeometry args={[dims.headSize, dims.headSize, dims.headSize]} />
                        <meshStandardMaterial
                            {...skinMatProps}
                            emissive={emissive('skin')}
                            emissiveIntensity={emissiveInt('skin')}
                            polygonOffset
                            polygonOffsetFactor={2}
                            polygonOffsetUnits={2}
                        />
                    </mesh>

                    <FaceLayer
                        config={config}
                        skinColor={skinColor}
                        isRobot={dims.isRobot}
                        eyeGroupRef={eyeGroupRef as React.RefObject<THREE.Group>}
                    />
                </group>

                <group
                    onClick={(e) => handleClick(e, 'hair')}
                    onPointerEnter={(e) => handlePointerEnter(e, 'hair')}
                    onPointerLeave={handlePointerLeave}
                    scale={hairScale}
                    position={hairOffset}
                >
                    <HairLayer style={config.hairStyle} color={hairColor} />
                </group>

                {/* Head-mounted accessories (follow head rotation) */}
                <group position={[0, -2.0, 0]}>
                    <AccessoryLayer
                        accessory={config.accessory}
                        color={config.accessoryColor ?? config.shirtColor}
                        gender={config.gender}
                        headMount={true}
                    />
                </group>
            </group>

            {variant === 'full' && (
                <group>
                    {/* Neck */}
                    <mesh position={[0, 1.52, 0]}>
                        <boxGeometry args={[dims.isFemale ? 0.26 : 0.30, 0.2, dims.isFemale ? 0.22 : 0.26]} />
                        <meshStandardMaterial {...skinMatProps} />
                    </mesh>

                    {/* Torso */}
                    <group ref={torsoRef}>
                        <group
                            position={[0, 1.1, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <boxGeometry args={[dims.bodyWidth, dims.bodyHeight, dims.bodyDepth]} />
                                <meshStandardMaterial
                                    color={shirtColor}
                                    roughness={config.shirtStyle === 'leather' ? 0.3 : 0.85}
                                    metalness={config.shirtStyle === 'leather' ? 0.1 : 0}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                    polygonOffset
                                    polygonOffsetFactor={2}
                                    polygonOffsetUnits={2}
                                />
                            </mesh>
                            <ShirtOverlay
                                style={config.shirtStyle ?? 't-shirt'}
                                color={shirtColor}
                                bodyWidth={dims.bodyWidth}
                                bodyDepth={dims.bodyDepth}
                            />
                        </group>
                    </group>

                    {/* Left arm — overlap torso by 0.01 to prevent z-fighting at joint */}
                    <group ref={leftArmRef} position={[-(dims.bodyWidth / 2 + dims.armWidth / 2 - 0.01), 1.35, 0]}>
                        <group
                            position={[0, -0.3, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <boxGeometry args={[dims.armWidth, dims.armHeight, dims.armWidth]} />
                                <meshStandardMaterial
                                    color={armColor}
                                    roughness={0.85}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            {/* Hand */}
                            <mesh position={[0, -(dims.armHeight / 2 + 0.04), 0]}>
                                <boxGeometry args={[dims.armWidth * 0.8, 0.08, dims.armWidth * 0.8]} />
                                <meshStandardMaterial {...skinMatProps} />
                            </mesh>
                        </group>
                    </group>

                    {/* Right arm — overlap torso by 0.01 to prevent z-fighting at joint */}
                    <group ref={rightArmRef} position={[(dims.bodyWidth / 2 + dims.armWidth / 2 - 0.01), 1.35, 0]}>
                        <group
                            position={[0, -0.3, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <boxGeometry args={[dims.armWidth, dims.armHeight, dims.armWidth]} />
                                <meshStandardMaterial
                                    color={armColor}
                                    roughness={0.85}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            <mesh position={[0, -(dims.armHeight / 2 + 0.04), 0]}>
                                <boxGeometry args={[dims.armWidth * 0.8, 0.08, dims.armWidth * 0.8]} />
                                <meshStandardMaterial {...skinMatProps} />
                            </mesh>
                        </group>
                    </group>

                    {/* Female hips (wider box) */}
                    {dims.isFemale && (
                        <mesh position={[0, 0.72, 0]}>
                            <boxGeometry args={[dims.hipWidth, 0.15, dims.bodyDepth + 0.02]} />
                            <meshStandardMaterial
                                color={pantsColor}
                                roughness={0.85}
                                emissive={emissive('pants')}
                                emissiveIntensity={emissiveInt('pants')}
                            />
                        </mesh>
                    )}

                    {/* Legs + shoes */}
                    <LegsSection
                        pantsStyle={config.pantsStyle ?? 'standard'}
                        pantsColor={pantsColor}
                        shoeColor={shoeColor}
                        skinColor={skinColor}
                        legWidth={dims.legWidth}
                        legHeight={dims.legHeight}
                        legSpacing={dims.legSpacing}
                        emissive={emissive('pants')}
                        emissiveInt={emissiveInt('pants')}
                        onClickPants={(e) => handleClick(e, 'pants')}
                        onPointerEnterPants={(e) => handlePointerEnter(e, 'pants')}
                        onPointerLeave={handlePointerLeave}
                    />

                    {/* Body-mounted accessories */}
                    <AccessoryLayer
                        accessory={config.accessory}
                        color={config.accessoryColor ?? config.shirtColor}
                        gender={config.gender}
                        headMount={false}
                    />

                    {/* Companion pet (separate from accessory) */}
                    {config.pet && config.pet !== 'none' && config.accessory !== config.pet && (
                        <AccessoryLayer
                            accessory={config.pet}
                            color={config.accessoryColor ?? config.shirtColor}
                            gender={config.gender}
                            headMount={false}
                        />
                    )}
                </group>
            )}
        </group>
    );
});

// --- Background ---

const SceneSurface = memo<{ variant: 'full' | 'head' }>(({ variant }) => {
    const { gl, scene } = useThree();
    const bgColor = useMemo(() => new THREE.Color('#FAF9F0'), []);

    useEffect(() => {
        if (variant === 'head') {
            gl.setClearColor('#000000', 0);
            scene.background = null;
        } else {
            gl.setClearColor(bgColor, 1);
            scene.background = bgColor;
        }
    }, [gl, scene, variant, bgColor]);

    return null;
});

// --- Main Component ---

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
    config, interactive = true, onPartClick, variant = 'full',
}) => {
    const cameraPos = useMemo<[number, number, number]>(
        () => (variant === 'head' ? [0, 0.5, 2.1] : [0, 0.85, 5.8]),
        [variant]
    );

    return (
        <div className={`w-full h-full relative ${variant === 'head' ? '' : 'min-h-[300px]'}`} style={{ backgroundColor: variant === 'full' ? '#FAF9F0' : 'transparent' }}>
            <Canvas
                style={{ background: variant === 'full' ? '#FAF9F0' : 'transparent' }}
                className={variant === 'full' ? 'bg-[#FAF9F0]' : 'bg-transparent'}
                shadows={{ type: THREE.PCFSoftShadowMap }}
                gl={{
                    alpha: true,
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.15,
                    outputColorSpace: THREE.SRGBColorSpace,
                    powerPreference: 'high-performance',
                }}
                onCreated={({ gl, scene }) => {
                    if (variant === 'full') {
                        const bg = new THREE.Color('#FAF9F0');
                        gl.setClearColor(bg, 1);
                        scene.background = bg;
                    } else {
                        gl.setClearColor('#000000', 0);
                        scene.background = null;
                    }
                }}
                dpr={[1, 1.5]}
                camera={{ position: cameraPos, fov: 45 }}
            >
                <SceneSurface variant={variant} />
                <ambientLight intensity={0.4} color="#fff8f0" />
                <hemisphereLight color="#f5e6d0" groundColor="#f0ebe0" intensity={0.55} />
                <directionalLight
                    position={[4, 8, 4]}
                    intensity={1.5}
                    color="#fff5ee"
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-near={0.1}
                    shadow-camera-far={20}
                    shadow-camera-left={-4}
                    shadow-camera-right={4}
                    shadow-camera-top={6}
                    shadow-camera-bottom={-2}
                    shadow-bias={-0.0005}
                />
                <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#D97757" />
                <pointLight position={[0, -1, 2]} intensity={0.15} color="#fff0e0" />

                <ThreeErrorBoundary>
                    <Suspense fallback={null}>
                        <Environment preset="sunset" />
                    </Suspense>
                </ThreeErrorBoundary>

                <AvatarModel
                    config={config}
                    variant={variant}
                    onPartClick={onPartClick}
                    interactive={interactive}
                />

                {variant === 'full' && (
                    <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[2.4, 2.4, 0.06]} />
                        <meshStandardMaterial color="#E8E6DF" roughness={0.9} metalness={0} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
                    </mesh>
                )}

                <ContactShadows
                    position={[0, -0.028, 0]}
                    opacity={0.35}
                    scale={6}
                    blur={2.5}
                    far={4}
                    color="#4A2518"
                />

                {variant === 'full' && (
                    <Sparkles
                        count={15}
                        scale={[4, 5, 4]}
                        size={2}
                        speed={0.3}
                        opacity={0.3}
                        color="#D97757"
                    />
                )}

                <OrbitControls
                    enablePan={false}
                    enableZoom={variant === 'full'}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    target={variant === 'head' ? [0, 0.5, 0] : [0, 1.0, 0]}
                />
            </Canvas>
        </div>
    );
};

export default AvatarViewer;
