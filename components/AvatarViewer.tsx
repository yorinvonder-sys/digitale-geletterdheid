import React, { Suspense, useEffect, useMemo, useRef, memo, useState, useCallback } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarConfig } from '../types';

// --- Types ---

interface AvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

// --- Error Boundary for Three.js children ---
class ThreeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? null : this.props.children; }
}

// --- Shared geometry helpers (module-level for GC optimization) ---

const getBodyDimensions = (baseModel: AvatarConfig['baseModel'], gender?: AvatarConfig['gender']) => {
    const isRobot = baseModel === 'robot';
    const isFemale = gender === 'female';
    return {
        torsoRadius: isFemale ? 0.26 : 0.35,
        torsoLength: isFemale ? 0.45 : 0.5,
        armRadius: isFemale ? 0.09 : 0.13,
        armLength: isFemale ? 0.55 : 0.6,
        armSpacing: isFemale ? 0.42 : 0.55,
        legRadius: isFemale ? 0.12 : 0.15,
        legLength: isFemale ? 0.48 : 0.5,
        headScale: isFemale ? [0.92, 0.88, 0.84] as const : [1, 0.95, 0.9] as const,
        shoulderWidth: isFemale ? 0.36 : 0.55,
        hipWidth: isFemale ? 0.38 : 0.28,
        isRobot,
        isFemale,
    };
};

// Darken a hex color slightly for subtle shading
const darkenColor = (hex: string, factor: number): string => {
    const c = new THREE.Color(hex);
    c.multiplyScalar(factor);
    return '#' + c.getHexString();
};

// --- Face Layer ---

const FaceLayer = memo<{
    config: AvatarConfig;
    skinColor: string;
    isRobot: boolean;
    eyeGroupRef: React.RefObject<THREE.Group>;
}>(({ config, skinColor, eyeGroupRef }) => {
    const expression = config.expression ?? 'happy';
    const eyeColor = config.eyeColor ?? '#111111';
    const eyeY = 0.08;
    const eyeZ = 0.58;
    const noseColor = darkenColor(skinColor, 0.9);

    return (
        <group>
            {/* Ears */}
            <mesh position={[-0.6, 0, 0]}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshPhysicalMaterial color={skinColor} roughness={0.65} clearcoat={0.15} clearcoatRoughness={0.6} />
            </mesh>
            <mesh position={[0.6, 0, 0]}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshPhysicalMaterial color={skinColor} roughness={0.65} clearcoat={0.15} clearcoatRoughness={0.6} />
            </mesh>

            {/* Nose */}
            <mesh position={[0, -0.05, 0.62]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshPhysicalMaterial color={noseColor} roughness={0.7} clearcoat={0.1} />
            </mesh>

            {/* Eye group – scale.y animated for blinking via eyeGroupRef */}
            <group ref={eyeGroupRef}>
                {/* Left eye */}
                <mesh position={[-0.22, eyeY, eyeZ]} scale={[1, 1.15, 0.35]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshPhysicalMaterial color={eyeColor} roughness={0.05} metalness={0.1}
                        clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1} />
                </mesh>
                {/* Left eye highlight */}
                <mesh position={[-0.19, eyeY + 0.04, eyeZ + 0.04]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
                {/* Right eye */}
                <mesh position={[0.22, eyeY, eyeZ]} scale={[1, 1.15, 0.35]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshPhysicalMaterial color={eyeColor} roughness={0.05} metalness={0.1}
                        clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1} />
                </mesh>
                {/* Right eye highlight */}
                <mesh position={[0.25, eyeY + 0.04, eyeZ + 0.04]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                {/* Female eyelashes — blink with eyes via eyeGroupRef */}
                {config.gender === 'female' && (
                    <group>
                        {/* Left eye lashes */}
                        <group position={[-0.22, eyeY + 0.12, eyeZ + 0.01]}>
                            <mesh position={[-0.05, 0, 0]} rotation={[0.2, 0, 0.25]}>
                                <boxGeometry args={[0.015, 0.06, 0.01]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                            <mesh position={[0, 0.01, 0]} rotation={[0.2, 0, 0]}>
                                <boxGeometry args={[0.015, 0.07, 0.01]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                            <mesh position={[0.05, 0, 0]} rotation={[0.2, 0, -0.25]}>
                                <boxGeometry args={[0.015, 0.06, 0.01]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                        </group>
                        {/* Right eye lashes */}
                        <group position={[0.22, eyeY + 0.12, eyeZ + 0.01]}>
                            <mesh position={[-0.05, 0, 0]} rotation={[0.2, 0, 0.25]}>
                                <boxGeometry args={[0.015, 0.06, 0.01]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                            <mesh position={[0, 0.01, 0]} rotation={[0.2, 0, 0]}>
                                <boxGeometry args={[0.015, 0.07, 0.01]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                            <mesh position={[0.05, 0, 0]} rotation={[0.2, 0, -0.25]}>
                                <boxGeometry args={[0.015, 0.06, 0.01]} />
                                <meshBasicMaterial color="#1a1a1a" />
                            </mesh>
                        </group>
                    </group>
                )}
            </group>

            {/* Sunglasses for cool expression */}
            {expression === 'cool' && (
                <group position={[0, eyeY, eyeZ + 0.02]}>
                    {/* Left lens */}
                    <mesh position={[-0.22, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.12, 0.02, 8, 16]} />
                        <meshPhysicalMaterial color="#111" metalness={0.95} roughness={0.05}
                            clearcoat={0.8} clearcoatRoughness={0.05} envMapIntensity={1.5} />
                    </mesh>
                    {/* Right lens */}
                    <mesh position={[0.22, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.12, 0.02, 8, 16]} />
                        <meshPhysicalMaterial color="#111" metalness={0.95} roughness={0.05}
                            clearcoat={0.8} clearcoatRoughness={0.05} envMapIntensity={1.5} />
                    </mesh>
                    {/* Bridge */}
                    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <capsuleGeometry args={[0.015, 0.12, 4, 8]} />
                        <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
            )}

            {/* Mouths */}
            {expression === 'happy' && (
                <mesh position={[0, -0.2, eyeZ - 0.02]} rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} />
                    <meshStandardMaterial color="#7c3b2a" roughness={0.9} />
                </mesh>
            )}
            {expression === 'surprised' && (
                <mesh position={[0, -0.2, eyeZ]} scale={[1, 1.2, 0.4]}>
                    <sphereGeometry args={[0.06, 12, 12]} />
                    <meshStandardMaterial color="#7c3b2a" roughness={0.9} />
                </mesh>
            )}
            {expression === 'neutral' && (
                <mesh position={[0, -0.18, eyeZ]} rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.018, 0.15, 4, 8]} />
                    <meshStandardMaterial color="#7c3b2a" roughness={0.9} />
                </mesh>
            )}

            {/* Female lips */}
            {config.gender === 'female' && (
                <group position={[0, -0.22, eyeZ - 0.01]}>
                    <mesh rotation={[Math.PI, 0, 0]} scale={[1, 0.6, 0.5]}>
                        <torusGeometry args={[0.07, 0.018, 8, 16, Math.PI]} />
                        <meshStandardMaterial color="#c9746e" roughness={0.6} />
                    </mesh>
                    <mesh position={[0, -0.02, 0]} scale={[0.9, 0.7, 0.5]}>
                        <torusGeometry args={[0.065, 0.02, 8, 16, Math.PI]} />
                        <meshStandardMaterial color="#c9746e" roughness={0.6} />
                    </mesh>
                </group>
            )}

            {/* Cheek blush */}
            <mesh position={[-0.35, -0.08, 0.52]} rotation={[0, -0.3, 0]}>
                <circleGeometry args={[0.08, 16]} />
                <meshBasicMaterial color="#ff9999" transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.35, -0.08, 0.52]} rotation={[0, 0.3, 0]}>
                <circleGeometry args={[0.08, 16]} />
                <meshBasicMaterial color="#ff9999" transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
});

// --- Hair Layer (smooth sphere/capsule based) ---

const HairLayer = memo<{ style: string; color: string }>(({ style, color }) => {
    const mat = (
        <meshPhysicalMaterial color={color} roughness={0.7} metalness={0.05}
            clearcoat={0.3} clearcoatRoughness={0.4} envMapIntensity={0.4} />
    );

    // Hemisphere args: [radius, wSeg, hSeg, phiStart, phiLength, thetaStart, thetaLength]
    // thetaStart=0, thetaLength=PI/2 → top hemisphere only (no clipping into head)
    const PI = Math.PI;

    switch (style) {
        case 'short':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Full coverage cap – wraps over the top and sides of the head */}
                    <mesh position={[0, 0, -0.02]} scale={[1.12, 0.75, 1.1]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.58]} />
                        {mat}
                    </mesh>
                    {/* Front fringe – subtle volume over forehead */}
                    <mesh position={[0, 0.12, 0.35]} scale={[0.8, 0.18, 0.2]}>
                        <sphereGeometry args={[0.4, 12, 10]} />
                        {mat}
                    </mesh>
                    {/* Side coverage left – extends down to ear level */}
                    <mesh position={[-0.48, -0.12, 0]} scale={[0.22, 0.4, 0.65]}>
                        <sphereGeometry args={[0.38, 12, 10, 0, PI * 2, 0, PI * 0.65]} />
                        {mat}
                    </mesh>
                    {/* Side coverage right */}
                    <mesh position={[0.48, -0.12, 0]} scale={[0.22, 0.4, 0.65]}>
                        <sphereGeometry args={[0.38, 12, 10, 0, PI * 2, 0, PI * 0.65]} />
                        {mat}
                    </mesh>
                    {/* Back coverage – extends down the back of the head */}
                    <mesh position={[0, -0.08, -0.38]} scale={[0.8, 0.42, 0.22]}>
                        <sphereGeometry args={[0.42, 12, 10, 0, PI * 2, 0, PI * 0.65]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'spiky':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Base cap – hemisphere covering top of head */}
                    <mesh scale={[1.12, 0.68, 1.08]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.55]} />
                        {mat}
                    </mesh>
                    {/* Side coverage */}
                    <mesh position={[-0.48, -0.1, 0]} scale={[0.2, 0.35, 0.6]}>
                        <sphereGeometry args={[0.35, 12, 10, 0, PI * 2, 0, PI * 0.6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.48, -0.1, 0]} scale={[0.2, 0.35, 0.6]}>
                        <sphereGeometry args={[0.35, 12, 10, 0, PI * 2, 0, PI * 0.6]} />
                        {mat}
                    </mesh>
                    {/* Spikes – pointing upward and slightly outward */}
                    <mesh position={[-0.15, 0.38, 0.18]} rotation={[0.25, 0, -0.2]} scale={[0.13, 0.3, 0.13]}>
                        <coneGeometry args={[0.3, 0.8, 6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.18, 0.42, -0.08]} rotation={[-0.15, 0, 0.15]} scale={[0.13, 0.34, 0.13]}>
                        <coneGeometry args={[0.3, 0.8, 6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.46, 0.05]} rotation={[0.08, 0, 0]} scale={[0.14, 0.38, 0.14]}>
                        <coneGeometry args={[0.3, 0.8, 6]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.28, 0.36, -0.12]} rotation={[-0.2, 0.15, -0.25]} scale={[0.11, 0.26, 0.11]}>
                        <coneGeometry args={[0.3, 0.8, 6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.12, 0.4, -0.22]} rotation={[-0.3, 0, 0.1]} scale={[0.11, 0.24, 0.11]}>
                        <coneGeometry args={[0.3, 0.8, 6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.3, 0.34, 0.1]} rotation={[0.1, 0, 0.3]} scale={[0.1, 0.22, 0.1]}>
                        <coneGeometry args={[0.3, 0.8, 6]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'long':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Top cap – hemisphere */}
                    <mesh position={[0, 0, -0.03]} scale={[1.12, 0.7, 1.08]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.52]} />
                        {mat}
                    </mesh>
                    {/* Left curtain – flows down past shoulders */}
                    <mesh position={[-0.48, -0.35, 0.05]} scale={[0.28, 1.0, 0.3]}>
                        <capsuleGeometry args={[0.25, 0.5, 8, 12]} />
                        {mat}
                    </mesh>
                    {/* Right curtain */}
                    <mesh position={[0.48, -0.35, 0.05]} scale={[0.28, 1.0, 0.3]}>
                        <capsuleGeometry args={[0.25, 0.5, 8, 12]} />
                        {mat}
                    </mesh>
                    {/* Back panel – flows down the back */}
                    <mesh position={[0, -0.25, -0.38]} scale={[0.85, 0.95, 0.22]}>
                        <capsuleGeometry args={[0.35, 0.4, 8, 12]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'ponytail':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Top cap – hemisphere, pulled back look */}
                    <mesh position={[0, 0, -0.03]} scale={[1.08, 0.65, 1.05]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.5]} />
                        {mat}
                    </mesh>
                    {/* Ponytail band */}
                    <mesh position={[0, 0.08, -0.55]}>
                        <torusGeometry args={[0.1, 0.04, 8, 12]} />
                        {mat}
                    </mesh>
                    {/* Tail – capsule hanging down */}
                    <mesh position={[0, -0.18, -0.58]} scale={[0.6, 1, 0.6]}>
                        <capsuleGeometry args={[0.12, 0.35, 8, 10]} />
                        {mat}
                    </mesh>
                    {/* Tail tip */}
                    <mesh position={[0, -0.45, -0.52]} scale={[0.5, 0.7, 0.5]}>
                        <sphereGeometry args={[0.1, 10, 10]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'pigtails':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Top cap – hemisphere */}
                    <mesh scale={[1.1, 0.65, 1.05]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.5]} />
                        {mat}
                    </mesh>
                    {/* Left pigtail – upper */}
                    <mesh position={[-0.52, -0.05, -0.05]}>
                        <sphereGeometry args={[0.16, 12, 12]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.55, -0.25, 0]} scale={[0.85, 1, 0.85]}>
                        <capsuleGeometry args={[0.12, 0.2, 6, 10]} />
                        {mat}
                    </mesh>
                    {/* Right pigtail – upper */}
                    <mesh position={[0.52, -0.05, -0.05]}>
                        <sphereGeometry args={[0.16, 12, 12]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.55, -0.25, 0]} scale={[0.85, 1, 0.85]}>
                        <capsuleGeometry args={[0.12, 0.2, 6, 10]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'messy':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Base cap – hemisphere with full coverage */}
                    <mesh scale={[1.14, 0.72, 1.1]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.56]} />
                        {mat}
                    </mesh>
                    {/* Side coverage */}
                    <mesh position={[-0.48, -0.1, 0]} scale={[0.22, 0.38, 0.6]}>
                        <sphereGeometry args={[0.35, 12, 10, 0, PI * 2, 0, PI * 0.6]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.48, -0.1, 0]} scale={[0.22, 0.38, 0.6]}>
                        <sphereGeometry args={[0.35, 12, 10, 0, PI * 2, 0, PI * 0.6]} />
                        {mat}
                    </mesh>
                    {/* Messy chunks sticking out in various directions */}
                    <mesh position={[-0.3, 0.35, 0.2]} rotation={[0.4, 0, -0.5]} scale={[0.2, 0.25, 0.12]}>
                        <coneGeometry args={[0.25, 0.6, 5]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.25, 0.4, -0.05]} rotation={[-0.2, 0.2, 0.4]} scale={[0.18, 0.28, 0.12]}>
                        <coneGeometry args={[0.25, 0.6, 5]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.05, 0.42, 0.12]} rotation={[0.15, -0.2, 0.05]} scale={[0.15, 0.25, 0.1]}>
                        <coneGeometry args={[0.25, 0.6, 5]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.1, 0.38, -0.2]} rotation={[-0.5, 0.3, -0.2]} scale={[0.16, 0.2, 0.1]}>
                        <coneGeometry args={[0.25, 0.6, 5]} />
                        {mat}
                    </mesh>
                    {/* Strand falling over forehead */}
                    <mesh position={[0.12, 0.15, 0.52]} rotation={[0.7, 0, 0.15]} scale={[0.1, 0.25, 0.08]}>
                        <capsuleGeometry args={[0.12, 0.25, 4, 8]} />
                        {mat}
                    </mesh>
                    {/* Back coverage */}
                    <mesh position={[0, -0.05, -0.36]} scale={[0.75, 0.35, 0.2]}>
                        <sphereGeometry args={[0.4, 12, 10, 0, PI * 2, 0, PI * 0.6]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'fade':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Tall top section – hemisphere with more volume on top */}
                    <mesh position={[0, 0.05, 0.03]} scale={[0.75, 0.85, 0.8]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.45]} />
                        {mat}
                    </mesh>
                    {/* Very short sides – thin layers hugging the head (faded) */}
                    <mesh position={[-0.5, -0.08, 0]} scale={[0.15, 0.25, 0.55]}>
                        <sphereGeometry args={[0.35, 12, 10, 0, PI * 2, 0, PI * 0.55]} />
                        <meshPhysicalMaterial color={color} roughness={0.85} metalness={0.05}
                            clearcoat={0.1} clearcoatRoughness={0.6} envMapIntensity={0.3} transparent opacity={0.7} />
                    </mesh>
                    <mesh position={[0.5, -0.08, 0]} scale={[0.15, 0.25, 0.55]}>
                        <sphereGeometry args={[0.35, 12, 10, 0, PI * 2, 0, PI * 0.55]} />
                        <meshPhysicalMaterial color={color} roughness={0.85} metalness={0.05}
                            clearcoat={0.1} clearcoatRoughness={0.6} envMapIntensity={0.3} transparent opacity={0.7} />
                    </mesh>
                    {/* Short back */}
                    <mesh position={[0, -0.02, -0.42]} scale={[0.6, 0.22, 0.15]}>
                        <sphereGeometry args={[0.4, 12, 10, 0, PI * 2, 0, PI * 0.55]} />
                        <meshPhysicalMaterial color={color} roughness={0.85} metalness={0.05}
                            clearcoat={0.1} clearcoatRoughness={0.6} envMapIntensity={0.3} transparent opacity={0.7} />
                    </mesh>
                </group>
            );

        case 'curls':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Base volume – hemisphere */}
                    <mesh scale={[1.15, 0.72, 1.1]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.52]} />
                        {mat}
                    </mesh>
                    {/* Curl clusters – small spheres for texture on top */}
                    <mesh position={[-0.32, 0.35, 0.15]} scale={[0.5, 0.5, 0.5]}>
                        <sphereGeometry args={[0.2, 10, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.28, 0.37, 0.1]} scale={[0.45, 0.45, 0.45]}>
                        <sphereGeometry args={[0.2, 10, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.4, 0.05]} scale={[0.48, 0.5, 0.48]}>
                        <sphereGeometry args={[0.2, 10, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.15, 0.38, -0.15]} scale={[0.42, 0.42, 0.42]}>
                        <sphereGeometry args={[0.2, 10, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.2, 0.36, -0.18]} scale={[0.4, 0.45, 0.4]}>
                        <sphereGeometry args={[0.2, 10, 10]} />
                        {mat}
                    </mesh>
                    {/* Side volume */}
                    <mesh position={[-0.52, 0.02, 0]} scale={[0.3, 0.45, 0.4]}>
                        <sphereGeometry args={[0.22, 10, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.52, 0.02, 0]} scale={[0.3, 0.45, 0.4]}>
                        <sphereGeometry args={[0.22, 10, 10]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'buzzcut':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Full coverage – tight to head, visible as a uniform layer */}
                    <mesh scale={[1.08, 0.62, 1.04]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.56]} />
                        <meshPhysicalMaterial color={color} roughness={0.85} metalness={0.05}
                            clearcoat={0.1} clearcoatRoughness={0.6} envMapIntensity={0.3} />
                    </mesh>
                    {/* Side coverage – thin stubble extending to ears */}
                    <mesh position={[-0.45, -0.1, 0]} scale={[0.2, 0.32, 0.55]}>
                        <sphereGeometry args={[0.33, 10, 8, 0, PI * 2, 0, PI * 0.6]} />
                        <meshPhysicalMaterial color={color} roughness={0.9} metalness={0.03}
                            clearcoat={0.05} envMapIntensity={0.2} />
                    </mesh>
                    <mesh position={[0.45, -0.1, 0]} scale={[0.2, 0.32, 0.55]}>
                        <sphereGeometry args={[0.33, 10, 8, 0, PI * 2, 0, PI * 0.6]} />
                        <meshPhysicalMaterial color={color} roughness={0.9} metalness={0.03}
                            clearcoat={0.05} envMapIntensity={0.2} />
                    </mesh>
                    {/* Back coverage */}
                    <mesh position={[0, -0.05, -0.36]} scale={[0.7, 0.3, 0.18]}>
                        <sphereGeometry args={[0.38, 10, 8, 0, PI * 2, 0, PI * 0.6]} />
                        <meshPhysicalMaterial color={color} roughness={0.9} metalness={0.03}
                            clearcoat={0.05} envMapIntensity={0.2} />
                    </mesh>
                </group>
            );

        case 'mohawk':
            return (
                <group position={[0, 0.05, -0.02]}>
                    {/* Very thin base – shaved sides look */}
                    <mesh scale={[1.04, 0.5, 1.0]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.42]} />
                        <meshPhysicalMaterial color={color} roughness={0.9} metalness={0.03}
                            clearcoat={0.05} envMapIntensity={0.2} transparent opacity={0.6} />
                    </mesh>
                    {/* Mohawk ridge – tall central crest */}
                    <mesh position={[0, 0.35, 0.15]} rotation={[0.2, 0, 0]} scale={[0.12, 0.35, 0.15]}>
                        <capsuleGeometry args={[0.2, 0.3, 8, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.4, 0]} scale={[0.12, 0.4, 0.15]}>
                        <capsuleGeometry args={[0.2, 0.3, 8, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.35, -0.18]} rotation={[-0.2, 0, 0]} scale={[0.12, 0.32, 0.15]}>
                        <capsuleGeometry args={[0.2, 0.3, 8, 10]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'afro':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Large volume hemisphere */}
                    <mesh position={[0, 0.05, -0.02]} scale={[1.4, 1.1, 1.3]}>
                        <sphereGeometry args={[0.67, 32, 20, 0, PI * 2, 0, PI * 0.55]} />
                        {mat}
                    </mesh>
                    {/* Extra top volume for roundness */}
                    <mesh position={[0, 0.45, 0]} scale={[0.85, 0.4, 0.8]}>
                        <sphereGeometry args={[0.5, 16, 12]} />
                        {mat}
                    </mesh>
                    {/* Side volume left */}
                    <mesh position={[-0.55, -0.05, 0]} scale={[0.35, 0.55, 0.45]}>
                        <sphereGeometry args={[0.38, 14, 12]} />
                        {mat}
                    </mesh>
                    {/* Side volume right */}
                    <mesh position={[0.55, -0.05, 0]} scale={[0.35, 0.55, 0.45]}>
                        <sphereGeometry args={[0.38, 14, 12]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'bob':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Top cap – hemisphere */}
                    <mesh position={[0, 0, -0.03]} scale={[1.12, 0.68, 1.08]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.52]} />
                        {mat}
                    </mesh>
                    {/* Left side – chin length */}
                    <mesh position={[-0.45, -0.2, 0.05]} scale={[0.3, 0.65, 0.35]}>
                        <capsuleGeometry args={[0.25, 0.2, 8, 12]} />
                        {mat}
                    </mesh>
                    {/* Right side */}
                    <mesh position={[0.45, -0.2, 0.05]} scale={[0.3, 0.65, 0.35]}>
                        <capsuleGeometry args={[0.25, 0.2, 8, 12]} />
                        {mat}
                    </mesh>
                    {/* Back – short, rounded */}
                    <mesh position={[0, -0.1, -0.38]} scale={[0.8, 0.55, 0.22]}>
                        <capsuleGeometry args={[0.28, 0.15, 8, 12]} />
                        {mat}
                    </mesh>
                    {/* Front fringe/bangs */}
                    <mesh position={[0, 0.18, 0.48]} scale={[0.75, 0.12, 0.1]}>
                        <capsuleGeometry args={[0.2, 0.3, 6, 10]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'braids':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Top cap – hemisphere */}
                    <mesh position={[0, 0, -0.03]} scale={[1.1, 0.65, 1.05]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.5]} />
                        {mat}
                    </mesh>
                    {/* Left braid – upper */}
                    <mesh position={[-0.4, -0.12, -0.08]} rotation={[0.1, 0, 0.08]} scale={[0.16, 0.5, 0.16]}>
                        <capsuleGeometry args={[0.13, 0.35, 6, 8]} />
                        {mat}
                    </mesh>
                    {/* Left braid – lower */}
                    <mesh position={[-0.38, -0.52, -0.03]} rotation={[0.03, 0, 0.03]} scale={[0.13, 0.4, 0.13]}>
                        <capsuleGeometry args={[0.1, 0.3, 6, 8]} />
                        {mat}
                    </mesh>
                    {/* Left braid tip */}
                    <mesh position={[-0.36, -0.82, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        {mat}
                    </mesh>
                    {/* Right braid – upper */}
                    <mesh position={[0.4, -0.12, -0.08]} rotation={[0.1, 0, -0.08]} scale={[0.16, 0.5, 0.16]}>
                        <capsuleGeometry args={[0.13, 0.35, 6, 8]} />
                        {mat}
                    </mesh>
                    {/* Right braid – lower */}
                    <mesh position={[0.38, -0.52, -0.03]} rotation={[0.03, 0, -0.03]} scale={[0.13, 0.4, 0.13]}>
                        <capsuleGeometry args={[0.1, 0.3, 6, 8]} />
                        {mat}
                    </mesh>
                    {/* Right braid tip */}
                    <mesh position={[0.36, -0.82, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'bun':
            return (
                <group position={[0, 0.05, 0]}>
                    {/* Flat cap – hair pulled back tight, hemisphere */}
                    <mesh position={[0, 0, -0.03]} scale={[1.08, 0.6, 1.02]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.48]} />
                        {mat}
                    </mesh>
                    {/* Bun – sphere sitting on back of head */}
                    <mesh position={[0, 0.35, -0.4]}>
                        <sphereGeometry args={[0.18, 16, 16]} />
                        {mat}
                    </mesh>
                    {/* Bun base / hair wrap ring */}
                    <mesh position={[0, 0.35, -0.4]} rotation={[0.8, 0, 0]}>
                        <torusGeometry args={[0.12, 0.04, 8, 16]} />
                        {mat}
                    </mesh>
                </group>
            );

        case 'sidepart':
            return (
                <group position={[0, 0.05, -0.03]}>
                    {/* Main cap – hemisphere, slightly shifted for parting effect */}
                    <mesh position={[0.03, 0, 0]} scale={[1.1, 0.7, 1.05]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.52]} />
                        {mat}
                    </mesh>
                    {/* Thicker left section (swept over) */}
                    <mesh position={[-0.2, 0.18, 0.15]} rotation={[0.1, 0, 0.15]} scale={[0.5, 0.2, 0.45]}>
                        <sphereGeometry args={[0.38, 14, 12]} />
                        {mat}
                    </mesh>
                    {/* Side coverage left */}
                    <mesh position={[-0.45, -0.08, 0]} scale={[0.22, 0.3, 0.5]}>
                        <sphereGeometry args={[0.3, 12, 10, 0, PI * 2, 0, PI * 0.6]} />
                        {mat}
                    </mesh>
                    {/* Thinner right section */}
                    <mesh position={[0.32, 0.1, 0.08]} scale={[0.3, 0.15, 0.4]}>
                        <sphereGeometry args={[0.32, 12, 10]} />
                        {mat}
                    </mesh>
                </group>
            );

        default:
            // Fallback: same as short
            return (
                <group position={[0, 0.05, 0]}>
                    <mesh position={[0, 0, -0.02]} scale={[1.12, 0.75, 1.1]}>
                        <sphereGeometry args={[0.67, 24, 16, 0, PI * 2, 0, PI * 0.58]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, 0.12, 0.35]} scale={[0.8, 0.18, 0.2]}>
                        <sphereGeometry args={[0.4, 12, 10]} />
                        {mat}
                    </mesh>
                    <mesh position={[-0.48, -0.12, 0]} scale={[0.22, 0.4, 0.65]}>
                        <sphereGeometry args={[0.38, 12, 10, 0, PI * 2, 0, PI * 0.65]} />
                        {mat}
                    </mesh>
                    <mesh position={[0.48, -0.12, 0]} scale={[0.22, 0.4, 0.65]}>
                        <sphereGeometry args={[0.38, 12, 10, 0, PI * 2, 0, PI * 0.65]} />
                        {mat}
                    </mesh>
                    <mesh position={[0, -0.08, -0.38]} scale={[0.8, 0.42, 0.22]}>
                        <sphereGeometry args={[0.42, 12, 10, 0, PI * 2, 0, PI * 0.65]} />
                        {mat}
                    </mesh>
                </group>
            );
    }
});

// --- Helpers for clothing styles ---

const getArmColor = (
    shirtStyle: string | undefined,
    shirtColor: string,
    skinColor: string,
    isFemale: boolean
): string => {
    if (shirtStyle === 'tank') return skinColor;
    if (isFemale) return skinColor;
    return shirtColor;
};

// --- ShirtOverlay: visual differentiation on top of torso capsule ---

const ShirtOverlay = memo<{
    style: string;
    color: string;
    torsoRadius: number;
}>(({ style, color, torsoRadius }) => {
    const darker = darkenColor(color, 0.75);
    const lighter = darkenColor(color, 1.15);

    switch (style) {
        case 'polo':
            return (
                <group>
                    <mesh position={[0, 0.28, 0]} rotation={[0.15, 0, 0]}>
                        <torusGeometry args={[0.18, 0.035, 8, 16]} />
                        <meshStandardMaterial color={lighter} roughness={0.7} />
                    </mesh>
                </group>
            );

        case 'hoodie':
            return (
                <group>
                    <mesh scale={[1.06, 1.02, 1.06]}>
                        <capsuleGeometry args={[torsoRadius, 0.5, 8, 16]} />
                        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={0.6} />
                    </mesh>
                    <mesh position={[0, 0.4, -0.2]} scale={[0.7, 0.5, 0.55]}>
                        <sphereGeometry args={[0.3, 12, 12]} />
                        <meshStandardMaterial color={darker} roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 0.32, 0.05]} rotation={[0.3, 0, 0]}>
                        <torusGeometry args={[0.17, 0.025, 8, 16, Math.PI]} />
                        <meshStandardMaterial color={darker} roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.1, torsoRadius + 0.01]} scale={[1.4, 0.5, 0.1]}>
                        <boxGeometry args={[0.2, 0.12, 0.02]} />
                        <meshStandardMaterial color={darker} roughness={0.85} />
                    </mesh>
                </group>
            );

        case 'sweater':
            return (
                <group>
                    <mesh scale={[1.08, 1.03, 1.08]}>
                        <capsuleGeometry args={[torsoRadius, 0.5, 8, 16]} />
                        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.5} />
                    </mesh>
                    <mesh position={[0, 0.3, 0]}>
                        <torusGeometry args={[0.16, 0.03, 8, 16]} />
                        <meshStandardMaterial color={darker} roughness={0.9} />
                    </mesh>
                </group>
            );

        case 'flannel':
            return (
                <group>
                    {[-0.12, 0.12].map((x, i) => (
                        <mesh key={`v${i}`} position={[x, 0, torsoRadius + 0.005]}>
                            <boxGeometry args={[0.015, 0.7, 0.005]} />
                            <meshStandardMaterial color={darker} roughness={0.8} />
                        </mesh>
                    ))}
                    {[-0.12, 0.12].map((y, i) => (
                        <mesh key={`h${i}`} position={[0, y, torsoRadius + 0.005]}>
                            <boxGeometry args={[torsoRadius * 1.8, 0.015, 0.005]} />
                            <meshStandardMaterial color={darker} roughness={0.8} />
                        </mesh>
                    ))}
                    <mesh position={[0, 0.28, 0]} rotation={[0.15, 0, 0]}>
                        <torusGeometry args={[0.16, 0.025, 8, 16]} />
                        <meshStandardMaterial color={darker} roughness={0.8} />
                    </mesh>
                    <mesh position={[0, 0, torsoRadius + 0.005]}>
                        <boxGeometry args={[0.015, 0.55, 0.005]} />
                        <meshStandardMaterial color={lighter} roughness={0.6} />
                    </mesh>
                </group>
            );

        case 'denim':
            return (
                <group>
                    <mesh position={[0, 0.28, 0]} rotation={[0.15, 0, 0]}>
                        <torusGeometry args={[0.17, 0.03, 8, 16]} />
                        <meshStandardMaterial color={lighter} roughness={0.6} />
                    </mesh>
                    <mesh position={[-0.1, 0.26, torsoRadius * 0.7]} rotation={[0.4, 0.3, 0]}>
                        <boxGeometry args={[0.1, 0.08, 0.01]} />
                        <meshStandardMaterial color={lighter} roughness={0.6} />
                    </mesh>
                    <mesh position={[0.1, 0.26, torsoRadius * 0.7]} rotation={[0.4, -0.3, 0]}>
                        <boxGeometry args={[0.1, 0.08, 0.01]} />
                        <meshStandardMaterial color={lighter} roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0, torsoRadius + 0.005]}>
                        <boxGeometry args={[0.015, 0.6, 0.005]} />
                        <meshStandardMaterial color={darker} roughness={0.5} />
                    </mesh>
                    {[0.15, 0.05, -0.05, -0.15].map((y, i) => (
                        <mesh key={i} position={[0, y, torsoRadius + 0.01]}>
                            <sphereGeometry args={[0.015, 8, 8]} />
                            <meshStandardMaterial color={darker} roughness={0.3} metalness={0.2} />
                        </mesh>
                    ))}
                </group>
            );

        case 'jersey':
            return (
                <group>
                    <mesh position={[-0.04, 0.22, torsoRadius * 0.85]} rotation={[0.5, 0, 0.3]}>
                        <boxGeometry args={[0.015, 0.15, 0.005]} />
                        <meshStandardMaterial color={darker} roughness={0.7} />
                    </mesh>
                    <mesh position={[0.04, 0.22, torsoRadius * 0.85]} rotation={[0.5, 0, -0.3]}>
                        <boxGeometry args={[0.015, 0.15, 0.005]} />
                        <meshStandardMaterial color={darker} roughness={0.7} />
                    </mesh>
                    <mesh position={[0.02, 0, torsoRadius + 0.005]}>
                        <boxGeometry args={[0.02, 0.2, 0.005]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.1, torsoRadius + 0.005]}>
                        <boxGeometry args={[0.1, 0.02, 0.005]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                </group>
            );

        case 'trackjacket':
            return (
                <group>
                    <mesh position={[0, 0, torsoRadius + 0.005]}>
                        <boxGeometry args={[0.02, 0.65, 0.005]} />
                        <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.3, 0]}>
                        <cylinderGeometry args={[0.17, 0.17, 0.06, 12]} />
                        <meshStandardMaterial color={darker} roughness={0.7} />
                    </mesh>
                </group>
            );

        case 'leather':
            return (
                <group>
                    <mesh scale={[1.02, 1.0, 1.02]}>
                        <capsuleGeometry args={[torsoRadius, 0.5, 8, 16]} />
                        <meshPhysicalMaterial
                            color={color}
                            roughness={0.2}
                            metalness={0.15}
                            clearcoat={0.8}
                            clearcoatRoughness={0.15}
                            transparent
                            opacity={0.7}
                        />
                    </mesh>
                    <mesh position={[0, 0.28, 0]} rotation={[0.15, 0, 0]}>
                        <torusGeometry args={[0.18, 0.03, 8, 16]} />
                        <meshPhysicalMaterial color={darker} roughness={0.2} metalness={0.15} clearcoat={0.6} />
                    </mesh>
                    <mesh position={[-0.1, 0.25, torsoRadius * 0.7]} rotation={[0.4, 0.25, 0]}>
                        <boxGeometry args={[0.1, 0.08, 0.01]} />
                        <meshPhysicalMaterial color={darker} roughness={0.2} clearcoat={0.6} />
                    </mesh>
                    <mesh position={[0.1, 0.25, torsoRadius * 0.7]} rotation={[0.4, -0.25, 0]}>
                        <boxGeometry args={[0.1, 0.08, 0.01]} />
                        <meshPhysicalMaterial color={darker} roughness={0.2} clearcoat={0.6} />
                    </mesh>
                    <mesh position={[0.05, 0.05, torsoRadius + 0.005]}>
                        <boxGeometry args={[0.015, 0.5, 0.005]} />
                        <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.7} />
                    </mesh>
                </group>
            );

        case 'bomber':
            return (
                <group>
                    <mesh scale={[1.12, 1.05, 1.12]}>
                        <capsuleGeometry args={[torsoRadius, 0.5, 8, 16]} />
                        <meshStandardMaterial color={color} roughness={0.8} transparent opacity={0.5} />
                    </mesh>
                    <mesh position={[0, 0.3, 0]}>
                        <torusGeometry args={[0.18, 0.035, 8, 16]} />
                        <meshStandardMaterial color={darker} roughness={0.85} />
                    </mesh>
                    <mesh position={[0, -0.28, 0]}>
                        <torusGeometry args={[torsoRadius * 0.95, 0.03, 8, 16]} />
                        <meshStandardMaterial color={darker} roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 0, torsoRadius + 0.01]}>
                        <boxGeometry args={[0.02, 0.6, 0.005]} />
                        <meshStandardMaterial color="#aaaaaa" roughness={0.2} metalness={0.6} />
                    </mesh>
                </group>
            );

        case 'blazer':
            return (
                <group>
                    <mesh position={[-torsoRadius - 0.02, 0.22, 0]} scale={[0.35, 0.25, 0.8]}>
                        <sphereGeometry args={[0.2, 8, 8]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    <mesh position={[torsoRadius + 0.02, 0.22, 0]} scale={[0.35, 0.25, 0.8]}>
                        <sphereGeometry args={[0.2, 8, 8]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    <mesh position={[-0.08, 0.15, torsoRadius * 0.85]} rotation={[0.3, 0.2, 0.1]}>
                        <boxGeometry args={[0.1, 0.2, 0.01]} />
                        <meshStandardMaterial color={darker} roughness={0.55} />
                    </mesh>
                    <mesh position={[0.08, 0.15, torsoRadius * 0.85]} rotation={[0.3, -0.2, -0.1]}>
                        <boxGeometry args={[0.1, 0.2, 0.01]} />
                        <meshStandardMaterial color={darker} roughness={0.55} />
                    </mesh>
                    <mesh position={[0, 0.02, torsoRadius + 0.01]}>
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshStandardMaterial color={darker} roughness={0.3} metalness={0.3} />
                    </mesh>
                </group>
            );

        case 'puffer':
            return (
                <group>
                    <mesh scale={[1.18, 1.08, 1.18]}>
                        <capsuleGeometry args={[torsoRadius, 0.5, 8, 16]} />
                        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={0.5} />
                    </mesh>
                    {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
                        <mesh key={i} position={[0, y, torsoRadius * 1.08 + 0.01]}>
                            <boxGeometry args={[torsoRadius * 2.2, 0.012, 0.005]} />
                            <meshStandardMaterial color={darker} roughness={0.8} />
                        </mesh>
                    ))}
                    {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
                        <mesh key={`b${i}`} position={[0, y, -(torsoRadius * 1.08 + 0.01)]}>
                            <boxGeometry args={[torsoRadius * 2.2, 0.012, 0.005]} />
                            <meshStandardMaterial color={darker} roughness={0.8} />
                        </mesh>
                    ))}
                    <mesh position={[0, 0.32, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.08, 12]} />
                        <meshStandardMaterial color={color} roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 0, torsoRadius * 1.15 + 0.01]}>
                        <boxGeometry args={[0.02, 0.6, 0.005]} />
                        <meshStandardMaterial color="#999999" roughness={0.2} metalness={0.6} />
                    </mesh>
                </group>
            );

        case 'kimono':
            return (
                <group>
                    <mesh position={[-0.06, 0.1, torsoRadius * 0.8]} rotation={[0.4, 0.15, 0.15]}>
                        <boxGeometry args={[0.18, 0.3, 0.01]} />
                        <meshStandardMaterial color={lighter} roughness={0.75} />
                    </mesh>
                    <mesh position={[0.06, 0.1, torsoRadius * 0.75]} rotation={[0.4, -0.15, -0.15]}>
                        <boxGeometry args={[0.18, 0.3, 0.01]} />
                        <meshStandardMaterial color={color} roughness={0.75} />
                    </mesh>
                    <mesh position={[0, -0.08, 0]}>
                        <cylinderGeometry args={[torsoRadius + 0.02, torsoRadius + 0.02, 0.1, 12]} />
                        <meshStandardMaterial color={darker} roughness={0.7} />
                    </mesh>
                </group>
            );

        case 'suit_diamond':
            return (
                <group>
                    {/* Wider shoulders */}
                    <mesh position={[-torsoRadius - 0.02, 0.22, 0]} scale={[0.35, 0.25, 0.8]}>
                        <sphereGeometry args={[0.2, 8, 8]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    <mesh position={[torsoRadius + 0.02, 0.22, 0]} scale={[0.35, 0.25, 0.8]}>
                        <sphereGeometry args={[0.2, 8, 8]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    {/* Lapels */}
                    <mesh position={[-0.08, 0.15, torsoRadius * 0.85]} rotation={[0.3, 0.2, 0.1]}>
                        <boxGeometry args={[0.1, 0.2, 0.01]} />
                        <meshStandardMaterial color={darker} roughness={0.45} />
                    </mesh>
                    <mesh position={[0.08, 0.15, torsoRadius * 0.85]} rotation={[0.3, -0.2, -0.1]}>
                        <boxGeometry args={[0.1, 0.2, 0.01]} />
                        <meshStandardMaterial color={darker} roughness={0.45} />
                    </mesh>
                    {/* Diamond pin */}
                    <mesh position={[0, 0.08, torsoRadius + 0.015]} rotation={[0, 0, Math.PI / 4]}>
                        <boxGeometry args={[0.04, 0.04, 0.01]} />
                        <meshPhysicalMaterial color="#88ccff" roughness={0.05} metalness={0.8} clearcoat={1} />
                    </mesh>
                    {/* Tie line */}
                    <mesh position={[0, -0.05, torsoRadius + 0.008]}>
                        <boxGeometry args={[0.04, 0.25, 0.005]} />
                        <meshStandardMaterial color={darker} roughness={0.5} />
                    </mesh>
                </group>
            );

        default:
            return null;
    }
});

// --- ShirtArmOverlay: per-arm style details ---

const ShirtArmOverlay = memo<{
    style: string;
    color: string;
    armRadius: number;
    side: 'left' | 'right';
}>(({ style, color, armRadius, side }) => {
    const sideSign = side === 'left' ? -1 : 1;

    switch (style) {
        case 'varsity':
            return (
                <group>
                    <mesh position={[0, -0.15, 0]}>
                        <cylinderGeometry args={[armRadius + 0.005, armRadius + 0.005, 0.02, 8]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                    <mesh position={[0, -0.19, 0]}>
                        <cylinderGeometry args={[armRadius + 0.005, armRadius + 0.005, 0.02, 8]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                </group>
            );

        case 'trackjacket':
            return (
                <group>
                    <mesh position={[sideSign * (armRadius + 0.005), -0.1, 0]}>
                        <boxGeometry args={[0.015, 0.55, 0.015]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.6} />
                    </mesh>
                </group>
            );

        case 'kimono':
            return (
                <group>
                    <mesh position={[0, 0.05, 0]} scale={[1.5, 0.5, 1.5]}>
                        <capsuleGeometry args={[armRadius, 0.15, 6, 12]} />
                        <meshStandardMaterial color={color} roughness={0.75} transparent opacity={0.7} />
                    </mesh>
                </group>
            );

        case 'hoodie':
        case 'puffer':
        case 'bomber':
            return (
                <group>
                    <mesh scale={[1.15, 1.0, 1.15]}>
                        <capsuleGeometry args={[armRadius, 0.6, 6, 12]} />
                        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={0.4} />
                    </mesh>
                </group>
            );

        default:
            return null;
    }
});

// --- LegsSection: style-aware leg rendering ---

const LegsSection = memo<{
    pantsStyle: string;
    pantsColor: string;
    shoeColor: string;
    skinColor: string;
    legRadius: number;
    legLength: number;
    emissive: string;
    emissiveInt: number;
    onClickPants: (e: ThreeEvent<MouseEvent>) => void;
    onPointerEnterPants: (e: ThreeEvent<PointerEvent>) => void;
    onPointerLeave: (e: ThreeEvent<PointerEvent>) => void;
}>(({ pantsStyle, pantsColor, shoeColor, skinColor, legRadius, legLength, emissive: emissiveColor, emissiveInt: emissiveIntVal, onClickPants, onPointerEnterPants, onPointerLeave }) => {
    const style = pantsStyle || 'standard';
    const darker = darkenColor(pantsColor, 0.8);

    const shoeMat = (
        <meshPhysicalMaterial
            color={shoeColor}
            roughness={0.35}
            metalness={0.05}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
        />
    );

    if (style === 'skirt' || style === 'pleated') {
        return (
            <group
                position={[0, 0.25, 0]}
                onClick={onClickPants}
                onPointerEnter={onPointerEnterPants}
                onPointerLeave={onPointerLeave}
            >
                <mesh position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.2, 0.38, 0.6, 16]} />
                    <meshStandardMaterial
                        color={pantsColor}
                        roughness={0.75}
                        envMapIntensity={0.3}
                        emissive={emissiveColor}
                        emissiveIntensity={emissiveIntVal}
                    />
                </mesh>
                {style === 'pleated' && (
                    <group>
                        {[-0.1, 0, 0.1].map((x, i) => (
                            <mesh key={i} position={[x, 0.05, 0.28 + Math.abs(x) * -0.3]}>
                                <boxGeometry args={[0.01, 0.55, 0.005]} />
                                <meshStandardMaterial color={darker} roughness={0.7} />
                            </mesh>
                        ))}
                    </group>
                )}
                {[-0.12, 0.12].map((x, i) => (
                    <group key={i}>
                        <mesh position={[x, -0.35, 0]}>
                            <capsuleGeometry args={[0.1, 0.15, 6, 12]} />
                            <meshPhysicalMaterial color={skinColor} roughness={0.65} clearcoat={0.15} clearcoatRoughness={0.6} />
                        </mesh>
                        <mesh position={[x, -0.55, 0.06]} scale={[1.1, 0.55, 1.3]}>
                            <sphereGeometry args={[0.14, 16, 16]} />
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
                {[-0.22, 0.22].map((x, i) => (
                    <group
                        key={i}
                        position={[x, 0.25, 0]}
                        onClick={onClickPants}
                        onPointerEnter={onPointerEnterPants}
                        onPointerLeave={onPointerLeave}
                    >
                        <mesh position={[0, 0.08, 0]}>
                            <capsuleGeometry args={[legRadius + 0.01, 0.15, 6, 12]} />
                            <meshStandardMaterial
                                color={pantsColor}
                                roughness={0.75}
                                envMapIntensity={0.3}
                                emissive={emissiveColor}
                                emissiveIntensity={emissiveIntVal}
                            />
                        </mesh>
                        <mesh position={[0, -0.2, 0]}>
                            <capsuleGeometry args={[legRadius - 0.02, 0.2, 6, 12]} />
                            <meshPhysicalMaterial color={skinColor} roughness={0.65} clearcoat={0.15} clearcoatRoughness={0.6} />
                        </mesh>
                        <mesh position={[0, -0.42, 0.06]} scale={[1.1, 0.55, 1.3]}>
                            <sphereGeometry args={[0.18, 16, 16]} />
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
            case 'skinny': return [0.8, 1, 0.8];
            case 'baggy': return [1.25, 1, 1.25];
            case 'sweatpants': return [1.12, 1, 1.12];
            default: return [1, 1, 1];
        }
    };

    const legScale = getLegScale();
    const isJogger = style === 'joggers';

    return (
        <group>
            {[-0.22, 0.22].map((x, i) => (
                <group
                    key={i}
                    position={[x, 0.25, 0]}
                    onClick={onClickPants}
                    onPointerEnter={onPointerEnterPants}
                    onPointerLeave={onPointerLeave}
                >
                    {isJogger ? (
                        <mesh position={[0, 0, 0]}>
                            <cylinderGeometry args={[legRadius * 0.85, legRadius * 1.25, legLength + legRadius * 2, 12]} />
                            <meshStandardMaterial
                                color={pantsColor}
                                roughness={0.8}
                                envMapIntensity={0.3}
                                emissive={emissiveColor}
                                emissiveIntensity={emissiveIntVal}
                            />
                        </mesh>
                    ) : (
                        <mesh scale={legScale}>
                            <capsuleGeometry args={[legRadius, legLength, 6, 12]} />
                            <meshStandardMaterial
                                color={pantsColor}
                                roughness={0.75}
                                envMapIntensity={0.3}
                                emissive={emissiveColor}
                                emissiveIntensity={emissiveIntVal}
                            />
                        </mesh>
                    )}

                    {style === 'cargo' && (
                        <group>
                            <mesh position={[(i === 0 ? -1 : 1) * (legRadius + 0.02), -0.05, 0]}>
                                <boxGeometry args={[0.04, 0.1, 0.08]} />
                                <meshStandardMaterial color={darker} roughness={0.8} />
                            </mesh>
                            <mesh position={[(i === 0 ? -1 : 1) * (legRadius + 0.02), 0.01, 0]}>
                                <boxGeometry args={[0.045, 0.02, 0.085]} />
                                <meshStandardMaterial color={darker} roughness={0.75} />
                            </mesh>
                        </group>
                    )}

                    {style === 'ripped' && (
                        <group>
                            <mesh position={[0, -0.05, legRadius + 0.005]}>
                                <boxGeometry args={[0.08, 0.04, 0.01]} />
                                <meshPhysicalMaterial color={skinColor} roughness={0.65} />
                            </mesh>
                            <mesh position={[0, 0.08, legRadius + 0.005]} rotation={[0, 0, 0.15]}>
                                <boxGeometry args={[0.06, 0.03, 0.01]} />
                                <meshPhysicalMaterial color={skinColor} roughness={0.65} />
                            </mesh>
                        </group>
                    )}

                    {style === 'formal' && (
                        <mesh position={[0, 0, legRadius + 0.005]}>
                            <boxGeometry args={[0.008, legLength + 0.2, 0.005]} />
                            <meshStandardMaterial color={darkenColor(pantsColor, 1.15)} roughness={0.5} />
                        </mesh>
                    )}

                    <mesh position={[0, -0.42, 0.06]} scale={[1.1, 0.55, 1.3]}>
                        <sphereGeometry args={[0.18, 16, 16]} />
                        {shoeMat}
                    </mesh>
                </group>
            ))}
        </group>
    );
});

// --- Accessory Layer ---

const AccessoryLayer = memo<{
    accessory: AvatarConfig['accessory'];
    color: string;
    gender: AvatarConfig['gender'];
}>(({ accessory, color, gender }) => {
    if (accessory === 'none') return null;

    const matPrimary = <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} envMapIntensity={0.4} />;
    const matMetal = <meshPhysicalMaterial color={color} roughness={0.15} metalness={0.85} clearcoat={0.6} envMapIntensity={0.8} />;
    const matDark = <meshStandardMaterial color={darkenColor(color, 0.6)} roughness={0.7} />;
    const matFabric = <meshStandardMaterial color={color} roughness={0.9} metalness={0} />;
    const matLeather = <meshPhysicalMaterial color={darkenColor(color, 0.7)} roughness={0.45} clearcoat={0.2} />;
    const matGlass = <meshPhysicalMaterial color="#ffffff" roughness={0.02} metalness={0} clearcoat={1} transparent opacity={0.3} />;
    const matGlassDark = <meshPhysicalMaterial color="#222222" roughness={0.02} metalness={0.2} clearcoat={1} transparent opacity={0.65} />;
    const matGold = <meshPhysicalMaterial color="#ffd700" roughness={0.1} metalness={0.95} clearcoat={0.5} envMapIntensity={1.2} />;
    const matGlow = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />;
    const matBlack = <meshStandardMaterial color="#111111" roughness={0.8} />;
    const matWhite = <meshStandardMaterial color="#eeeeee" roughness={0.6} />;

    switch (accessory) {
        case 'cap':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.38, -0.02]} scale={[1.12, 0.35, 1.08]}>
                        <sphereGeometry args={[0.65, 16, 16]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, 0.22, 0.55]} rotation={[Math.PI / 2.5, 0, 0]} scale={[1, 0.05, 0.6]}>
                        <capsuleGeometry args={[0.3, 0.15, 4, 12]} />
                        {matDark}
                    </mesh>
                </group>
            );

        case 'beanie':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.42, -0.02]} scale={[1.1, 0.55, 1.06]}>
                        <sphereGeometry args={[0.65, 16, 16]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0, 0.08, -0.02]} rotation={[0, 0, 0]} scale={[1.13, 0.12, 1.09]}>
                        <torusGeometry args={[0.58, 0.08, 8, 24]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0, 0.72, 0]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        {matDark}
                    </mesh>
                </group>
            );

        case 'bandana':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.12, 0]} scale={[1.08, 0.18, 1.04]}>
                        <torusGeometry args={[0.58, 0.08, 6, 24]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0.45, 0.02, -0.35]} rotation={[0.3, -0.6, 0.5]} scale={[0.5, 1, 0.15]}>
                        <capsuleGeometry args={[0.08, 0.12, 4, 8]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0.42, -0.08, -0.38]} rotation={[0.4, -0.5, 0.6]} scale={[0.4, 0.8, 0.12]}>
                        <capsuleGeometry args={[0.07, 0.1, 4, 8]} />
                        {matFabric}
                    </mesh>
                </group>
            );

        case 'glasses':
            return (
                <group position={[0, 2.08, 0.58]}>
                    <mesh position={[-0.22, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.12, 0.015, 8, 16]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0.22, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.12, 0.015, 8, 16]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <capsuleGeometry args={[0.012, 0.08, 4, 8]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[-0.22, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.3, 1]}>
                        <circleGeometry args={[0.11, 16]} />
                        {matGlass}
                    </mesh>
                    <mesh position={[0.22, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.3, 1]}>
                        <circleGeometry args={[0.11, 16]} />
                        {matGlass}
                    </mesh>
                </group>
            );

        case 'sunglasses':
            return (
                <group position={[0, 2.08, 0.58]}>
                    <mesh position={[-0.22, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.13, 0.018, 8, 16]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0.22, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.13, 0.018, 8, 16]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <capsuleGeometry args={[0.015, 0.08, 4, 8]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[-0.22, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.3, 1]}>
                        <circleGeometry args={[0.12, 16]} />
                        {matGlassDark}
                    </mesh>
                    <mesh position={[0.22, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.3, 1]}>
                        <circleGeometry args={[0.12, 16]} />
                        {matGlassDark}
                    </mesh>
                </group>
            );

        case 'headphones':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.3, -0.1]} rotation={[0, 0, 0]} scale={[1, 1, 0.7]}>
                        <torusGeometry args={[0.6, 0.035, 8, 24, Math.PI]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[-0.6, 0, -0.1]} scale={[0.6, 0.9, 0.5]}>
                        <sphereGeometry args={[0.15, 12, 12]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0.6, 0, -0.1]} scale={[0.6, 0.9, 0.5]}>
                        <sphereGeometry args={[0.15, 12, 12]} />
                        {matPrimary}
                    </mesh>
                </group>
            );

        case 'earbuds':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[-0.58, -0.05, 0.08]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        {matWhite}
                    </mesh>
                    <mesh position={[-0.58, -0.15, 0.06]}>
                        <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
                        {matWhite}
                    </mesh>
                    <mesh position={[0.58, -0.05, 0.08]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        {matWhite}
                    </mesh>
                    <mesh position={[0.58, -0.15, 0.06]}>
                        <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
                        {matWhite}
                    </mesh>
                </group>
            );

        case 'crown':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.48, 0]}>
                        <torusGeometry args={[0.42, 0.06, 8, 24]} />
                        {matGold}
                    </mesh>
                    {[0, 1, 2, 3, 4].map((i) => {
                        const angle = (i / 5) * Math.PI * 2;
                        return (
                            <mesh key={i} position={[Math.sin(angle) * 0.38, 0.65, Math.cos(angle) * 0.38]}>
                                <coneGeometry args={[0.04, 0.15, 5]} />
                                {matGold}
                            </mesh>
                        );
                    })}
                </group>
            );

        case 'halo':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.45, 0.04, 8, 32]} />
                        {matGlow}
                    </mesh>
                </group>
            );

        case 'backpack':
            return (
                <group position={[0, 1.05, -0.4]}>
                    <mesh position={[0, 0, 0]} scale={[0.7, 0.85, 0.45]}>
                        <boxGeometry args={[0.45, 0.5, 0.3]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, 0.25, 0.05]} scale={[0.8, 0.2, 0.55]}>
                        <boxGeometry args={[0.52, 0.12, 0.35]} />
                        {matDark}
                    </mesh>
                    <mesh position={[-0.18, 0.15, 0.15]} rotation={[0.15, 0, 0]}>
                        <capsuleGeometry args={[0.025, 0.5, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0.18, 0.15, 0.15]} rotation={[0.15, 0, 0]}>
                        <capsuleGeometry args={[0.025, 0.5, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0, -0.08, 0.17]} scale={[0.6, 0.5, 0.1]}>
                        <boxGeometry args={[0.4, 0.3, 0.1]} />
                        {matDark}
                    </mesh>
                </group>
            );

        case 'satchel':
            return (
                <group>
                    <mesh position={[0.1, 1.35, 0.1]} rotation={[0, 0, -0.6]}>
                        <capsuleGeometry args={[0.02, 0.9, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0.4, 0.7, 0.15]} scale={[0.6, 0.7, 0.4]}>
                        <boxGeometry args={[0.35, 0.25, 0.15]} />
                        {matLeather}
                    </mesh>
                    <mesh position={[0.4, 0.75, 0.2]} scale={[0.65, 0.25, 0.45]}>
                        <boxGeometry args={[0.35, 0.08, 0.15]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0.4, 0.72, 0.26]}>
                        <sphereGeometry args={[0.025, 6, 6]} />
                        {matGold}
                    </mesh>
                </group>
            );

        case 'watch':
            return (
                <group position={[-(gender === 'female' ? 0.48 : 0.55), 0.48, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.1, 0.025, 6, 16]} />
                        {matLeather}
                    </mesh>
                    <mesh position={[0, 0, 0.1]}>
                        <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, 0.016, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.055, 12]} />
                        <meshPhysicalMaterial color="#eeeeff" roughness={0.02} metalness={0} clearcoat={1} transparent opacity={0.5} />
                    </mesh>
                </group>
            );

        case 'smartwatch':
            return (
                <group position={[-(gender === 'female' ? 0.48 : 0.55), 0.48, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.1, 0.025, 6, 16]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[0.1, 0.03, 0.12]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0, 0.017, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[0.075, 0.09, 0.002]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
                    </mesh>
                </group>
            );

        case 'necklace':
            return (
                <group position={[0, 1.42, 0]}>
                    <mesh position={[0, -0.05, 0.08]} rotation={[0.2, 0, 0]}>
                        <torusGeometry args={[0.18, 0.012, 6, 24]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, -0.24, 0.14]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        {matMetal}
                    </mesh>
                </group>
            );

        case 'chain':
            return (
                <group position={[0, 1.42, 0]}>
                    <mesh position={[0, -0.06, 0.08]} rotation={[0.2, 0, 0]}>
                        <torusGeometry args={[0.2, 0.025, 8, 24]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, -0.14, 0.1]} rotation={[0.25, 0, 0]}>
                        <torusGeometry args={[0.22, 0.02, 8, 24]} />
                        {matGold}
                    </mesh>
                </group>
            );

        case 'scarf':
            return (
                <group position={[0, 1.42, 0]}>
                    <mesh position={[0, -0.05, 0]}>
                        <torusGeometry args={[0.2, 0.065, 6, 24]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[-0.12, -0.25, 0.18]} rotation={[0.1, 0, 0.15]} scale={[0.5, 1, 0.3]}>
                        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0.08, -0.28, 0.16]} rotation={[0.15, 0, -0.1]} scale={[0.5, 1, 0.3]}>
                        <capsuleGeometry args={[0.06, 0.22, 4, 8]} />
                        {matFabric}
                    </mesh>
                </group>
            );

        case 'bowtie':
            return (
                <group position={[0, 1.35, 0.3]}>
                    <mesh position={[-0.06, 0, 0]} scale={[1.2, 0.6, 0.3]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0.06, 0, 0]} scale={[1.2, 0.6, 0.3]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0, 0, 0.01]}>
                        <sphereGeometry args={[0.025, 8, 8]} />
                        {matDark}
                    </mesh>
                </group>
            );

        case 'tie':
            return (
                <group position={[0, 1.35, 0.32]}>
                    <mesh position={[0, 0, 0]} scale={[1, 0.6, 0.5]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0, -0.15, -0.02]} rotation={[0.08, 0, 0]} scale={[0.5, 1, 0.2]}>
                        <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0, -0.33, -0.04]} rotation={[0.1, 0, 0]} scale={[0.7, 1, 0.2]}>
                        <coneGeometry args={[0.06, 0.18, 4]} />
                        {matFabric}
                    </mesh>
                </group>
            );

        case 'cape':
            return (
                <group position={[0, 1.3, -0.35]}>
                    <mesh position={[-0.25, 0.08, 0.15]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0.25, 0.08, 0.15]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, -0.45, -0.05]} scale={[1.3, 1.4, 0.15]}>
                        <capsuleGeometry args={[0.35, 0.4, 6, 12]} />
                        {matFabric}
                    </mesh>
                    <mesh position={[0, 0, 0]} scale={[1.5, 0.4, 0.15]}>
                        <capsuleGeometry args={[0.2, 0.25, 4, 10]} />
                        {matFabric}
                    </mesh>
                </group>
            );

        case 'skateboard':
            return (
                <group position={[0.35, -0.15, 0.1]} rotation={[0, 0.4, 0]}>
                    <mesh position={[0, 0, 0]} scale={[0.3, 0.04, 1]}>
                        <boxGeometry args={[0.6, 0.06, 0.8]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, -0.04, 0.25]}>
                        <boxGeometry args={[0.15, 0.03, 0.06]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, -0.04, -0.25]}>
                        <boxGeometry args={[0.15, 0.03, 0.06]} />
                        {matMetal}
                    </mesh>
                    {[[-0.07, -0.06, 0.25], [0.07, -0.06, 0.25], [-0.07, -0.06, -0.25], [0.07, -0.06, -0.25]].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.035, 0.035, 0.03, 8]} />
                            {matWhite}
                        </mesh>
                    ))}
                </group>
            );

        case 'guitar':
            return (
                <group position={[0.15, 0.95, -0.35]} rotation={[0.2, 0.5, -0.15]}>
                    <mesh position={[0, -0.2, 0]} scale={[1, 1.2, 0.3]}>
                        <sphereGeometry args={[0.2, 12, 12]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, -0.2, 0.07]}>
                        <ringGeometry args={[0.04, 0.07, 16]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0, 0.25, 0]}>
                        <boxGeometry args={[0.05, 0.5, 0.03]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0, 0.52, 0]} scale={[1.5, 0.8, 1]}>
                        <boxGeometry args={[0.05, 0.08, 0.03]} />
                        {matDark}
                    </mesh>
                    <mesh position={[-0.15, 0.2, 0.2]} rotation={[0.3, 0, 0.8]}>
                        <capsuleGeometry args={[0.015, 0.6, 4, 8]} />
                        {matDark}
                    </mesh>
                </group>
            );

        case 'wings':
            return (
                <group position={[0, 1.15, -0.38]}>
                    <mesh position={[-0.35, 0.15, -0.05]} rotation={[0.1, 0.3, 0.2]} scale={[1.5, 1.2, 0.12]}>
                        <capsuleGeometry args={[0.2, 0.25, 4, 10]} />
                        {matWhite}
                    </mesh>
                    <mesh position={[-0.45, -0.1, -0.1]} rotation={[0.15, 0.4, 0.4]} scale={[1.3, 0.9, 0.1]}>
                        <capsuleGeometry args={[0.18, 0.2, 4, 10]} />
                        {matWhite}
                    </mesh>
                    <mesh position={[0.35, 0.15, -0.05]} rotation={[0.1, -0.3, -0.2]} scale={[1.5, 1.2, 0.12]}>
                        <capsuleGeometry args={[0.2, 0.25, 4, 10]} />
                        {matWhite}
                    </mesh>
                    <mesh position={[0.45, -0.1, -0.1]} rotation={[0.15, -0.4, -0.4]} scale={[1.3, 0.9, 0.1]}>
                        <capsuleGeometry args={[0.18, 0.2, 4, 10]} />
                        {matWhite}
                    </mesh>
                </group>
            );

        case 'sword':
            return (
                <group position={[-0.45, 0.6, 0]} rotation={[0, 0, 0.15]}>
                    <mesh position={[0, 0.3, 0]} scale={[0.12, 1, 0.04]}>
                        <boxGeometry args={[0.15, 0.6, 0.04]} />
                        <meshPhysicalMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} clearcoat={1} />
                    </mesh>
                    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <capsuleGeometry args={[0.025, 0.12, 4, 8]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, -0.12, 0]}>
                        <capsuleGeometry args={[0.025, 0.1, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0, -0.2, 0]}>
                        <sphereGeometry args={[0.035, 8, 8]} />
                        {matGold}
                    </mesh>
                </group>
            );

        case 'shield':
            return (
                <group position={[0, 1.0, -0.45]} rotation={[0.15, 0, 0]}>
                    <mesh position={[0, 0, 0]} scale={[1, 1.15, 0.15]}>
                        <sphereGeometry args={[0.3, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.28, 0.025, 6, 20]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, 0.05, 0.05]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        {matGold}
                    </mesh>
                </group>
            );

        case 'pet_cat':
            return (
                <group position={[0.5, -0.05, 0.3]}>
                    <mesh position={[0, 0, 0]} scale={[0.6, 0.55, 0.9]}>
                        <sphereGeometry args={[0.15, 12, 12]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, 0.1, 0.12]} scale={[0.8, 0.75, 0.8]}>
                        <sphereGeometry args={[0.1, 12, 12]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[-0.05, 0.2, 0.12]} rotation={[0, 0, -0.3]}>
                        <coneGeometry args={[0.03, 0.06, 4]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0.05, 0.2, 0.12]} rotation={[0, 0, 0.3]}>
                        <coneGeometry args={[0.03, 0.06, 4]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[-0.05, 0.08, -0.15]} rotation={[0.8, 0.3, 0]}>
                        <capsuleGeometry args={[0.015, 0.18, 4, 8]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[-0.03, 0.12, 0.2]}>
                        <sphereGeometry args={[0.015, 6, 6]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0.03, 0.12, 0.2]}>
                        <sphereGeometry args={[0.015, 6, 6]} />
                        {matBlack}
                    </mesh>
                </group>
            );

        case 'pet_dog':
            return (
                <group position={[-0.5, -0.05, 0.35]}>
                    <mesh position={[0, 0, 0]} scale={[0.65, 0.6, 1]}>
                        <sphereGeometry args={[0.15, 12, 12]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, 0.1, 0.14]}>
                        <sphereGeometry args={[0.1, 12, 12]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[0, 0.07, 0.23]} scale={[0.7, 0.5, 0.8]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0, 0.08, 0.27]}>
                        <sphereGeometry args={[0.02, 6, 6]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[-0.08, 0.12, 0.1]} rotation={[0, 0, -0.5]} scale={[0.6, 1.2, 0.4]}>
                        <capsuleGeometry args={[0.035, 0.04, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0.08, 0.12, 0.1]} rotation={[0, 0, 0.5]} scale={[0.6, 1.2, 0.4]}>
                        <capsuleGeometry args={[0.035, 0.04, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[0, 0.12, -0.15]} rotation={[-0.8, 0, 0]}>
                        <capsuleGeometry args={[0.018, 0.12, 4, 8]} />
                        {matPrimary}
                    </mesh>
                    <mesh position={[-0.035, 0.14, 0.22]}>
                        <sphereGeometry args={[0.018, 6, 6]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0.035, 0.14, 0.22]}>
                        <sphereGeometry args={[0.018, 6, 6]} />
                        {matBlack}
                    </mesh>
                </group>
            );

        case 'robot_arm':
            return (
                <group position={[gender === 'female' ? 0.48 : 0.55, 0.9, 0]}>
                    <mesh position={[0, 0.35, 0]}>
                        <sphereGeometry args={[0.1, 10, 10]} />
                        <meshPhysicalMaterial color="#888888" roughness={0.15} metalness={0.9} clearcoat={0.6} />
                    </mesh>
                    <mesh position={[0, 0.15, 0]}>
                        <capsuleGeometry args={[0.07, 0.2, 6, 10]} />
                        <meshPhysicalMaterial color="#666666" roughness={0.2} metalness={0.85} clearcoat={0.5} />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.065, 8, 8]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, -0.17, 0]}>
                        <capsuleGeometry args={[0.06, 0.18, 6, 10]} />
                        <meshPhysicalMaterial color="#666666" roughness={0.2} metalness={0.85} clearcoat={0.5} />
                    </mesh>
                    <mesh position={[-0.04, -0.35, 0]} rotation={[0, 0, 0.25]}>
                        <boxGeometry args={[0.02, 0.1, 0.03]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0.04, -0.35, 0]} rotation={[0, 0, -0.25]}>
                        <boxGeometry args={[0.02, 0.1, 0.03]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, 0, 0.06]}>
                        <sphereGeometry args={[0.025, 6, 6]} />
                        {matGlow}
                    </mesh>
                </group>
            );

        case 'crown_gold':
            return (
                <group position={[0, 2.0, 0]}>
                    <mesh position={[0, 0.48, 0]}>
                        <torusGeometry args={[0.45, 0.08, 8, 24]} />
                        {matGold}
                    </mesh>
                    <mesh position={[0, 0.57, 0]} scale={[1, 0.25, 1]}>
                        <cylinderGeometry args={[0.45, 0.48, 0.15, 24, 1, true]} />
                        {matGold}
                    </mesh>
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                        const angle = (i / 6) * Math.PI * 2;
                        return (
                            <mesh key={i} position={[Math.sin(angle) * 0.42, 0.78, Math.cos(angle) * 0.42]}>
                                <coneGeometry args={[0.05, 0.18, 6]} />
                                {matGold}
                            </mesh>
                        );
                    })}
                    <mesh position={[0, 0.72, 0.4]}>
                        <sphereGeometry args={[0.035, 8, 8]} />
                        <meshPhysicalMaterial color="#ff1744" roughness={0.05} metalness={0.3} clearcoat={1} />
                    </mesh>
                    <mesh position={[0.35, 0.72, 0.2]}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshPhysicalMaterial color="#2979ff" roughness={0.05} metalness={0.3} clearcoat={1} />
                    </mesh>
                </group>
            );

        case 'wings_cyber':
            return (
                <group position={[0, 1.15, -0.38]}>
                    <mesh position={[-0.35, 0.15, -0.05]} rotation={[0.1, 0.3, 0.2]}>
                        <boxGeometry args={[0.5, 0.04, 0.03]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[-0.4, -0.05, -0.08]} rotation={[0.2, 0.4, 0.5]}>
                        <boxGeometry args={[0.4, 0.04, 0.03]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[-0.38, 0.05, -0.07]} rotation={[0.15, 0.35, 0.35]} scale={[1.3, 0.8, 0.05]}>
                        <boxGeometry args={[0.35, 0.25, 0.02]} />
                        <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.6} clearcoat={0.8} transparent opacity={0.6} />
                    </mesh>
                    <mesh position={[-0.35, 0.06, -0.04]} rotation={[0.12, 0.33, 0.3]}>
                        <capsuleGeometry args={[0.01, 0.35, 4, 8]} />
                        {matGlow}
                    </mesh>
                    <mesh position={[0.35, 0.15, -0.05]} rotation={[0.1, -0.3, -0.2]}>
                        <boxGeometry args={[0.5, 0.04, 0.03]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0.4, -0.05, -0.08]} rotation={[0.2, -0.4, -0.5]}>
                        <boxGeometry args={[0.4, 0.04, 0.03]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0.38, 0.05, -0.07]} rotation={[0.15, -0.35, -0.35]} scale={[1.3, 0.8, 0.05]}>
                        <boxGeometry args={[0.35, 0.25, 0.02]} />
                        <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.6} clearcoat={0.8} transparent opacity={0.6} />
                    </mesh>
                    <mesh position={[0.35, 0.06, -0.04]} rotation={[0.12, -0.33, -0.3]}>
                        <capsuleGeometry args={[0.01, 0.35, 4, 8]} />
                        {matGlow}
                    </mesh>
                </group>
            );

        case 'jetpack':
            return (
                <group position={[0, 1.05, -0.45]}>
                    <mesh position={[-0.15, 0, 0]}>
                        <capsuleGeometry args={[0.1, 0.35, 8, 12]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0.15, 0, 0]}>
                        <capsuleGeometry args={[0.1, 0.35, 8, 12]} />
                        {matMetal}
                    </mesh>
                    <mesh position={[0, 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]}>
                        <capsuleGeometry args={[0.04, 0.15, 4, 8]} />
                        {matDark}
                    </mesh>
                    <mesh position={[-0.15, -0.28, 0]}>
                        <coneGeometry args={[0.08, 0.1, 8]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[0.15, -0.28, 0]}>
                        <coneGeometry args={[0.08, 0.1, 8]} />
                        {matBlack}
                    </mesh>
                    <mesh position={[-0.15, -0.38, 0]}>
                        <coneGeometry args={[0.05, 0.15, 8]} />
                        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.7} />
                    </mesh>
                    <mesh position={[0.15, -0.38, 0]}>
                        <coneGeometry args={[0.05, 0.15, 8]} />
                        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.7} />
                    </mesh>
                    <mesh position={[0, 0.15, 0.08]}>
                        <sphereGeometry args={[0.03, 6, 6]} />
                        {matGlow}
                    </mesh>
                </group>
            );

        case 'pet_robo':
            return (
                <group position={[-0.45, -0.08, 0.35]}>
                    <mesh position={[0, 0.05, 0]}>
                        <boxGeometry args={[0.18, 0.12, 0.22]} />
                        <meshPhysicalMaterial color="#888888" roughness={0.15} metalness={0.85} clearcoat={0.5} />
                    </mesh>
                    <mesh position={[0, 0.14, 0.08]}>
                        <boxGeometry args={[0.14, 0.1, 0.12]} />
                        <meshPhysicalMaterial color="#999999" roughness={0.15} metalness={0.85} clearcoat={0.5} />
                    </mesh>
                    <mesh position={[-0.03, 0.15, 0.15]}>
                        <sphereGeometry args={[0.02, 6, 6]} />
                        {matGlow}
                    </mesh>
                    <mesh position={[0.03, 0.15, 0.15]}>
                        <sphereGeometry args={[0.02, 6, 6]} />
                        {matGlow}
                    </mesh>
                    <mesh position={[0, 0.22, 0.08]}>
                        <capsuleGeometry args={[0.008, 0.06, 4, 6]} />
                        <meshPhysicalMaterial color="#aaaaaa" roughness={0.1} metalness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.27, 0.08]}>
                        <sphereGeometry args={[0.015, 6, 6]} />
                        {matGlow}
                    </mesh>
                    {[[-0.06, -0.04, 0.06], [0.06, -0.04, 0.06], [-0.06, -0.04, -0.06], [0.06, -0.04, -0.06]].map((pos, i) => (
                        <mesh key={i} position={pos as [number, number, number]}>
                            <cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />
                            <meshPhysicalMaterial color="#666666" roughness={0.2} metalness={0.8} />
                        </mesh>
                    ))}
                </group>
            );

        default:
            return null;
    }
});

// --- AvatarModel: all animation logic lives here ---

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
    const shirtColor = config.shirtColor ?? '#3b82f6';
    const pantsColor = config.pantsColor ?? '#1e293b';
    const shoeColor = config.shoeColor ?? '#1a1a1a';

    // --- Animation refs (mutated in useFrame, never trigger re-renders) ---
    const headRef = useRef<THREE.Group>(null);
    const torsoRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const eyeGroupRef = useRef<THREE.Group>(null);

    // Bounce: expression change
    const bounceProgressRef = useRef(0);
    // Blink: countdown to next blink + progress through blink curve
    const blinkTimerRef = useRef(2 + Math.random() * 3);
    const blinkProgressRef = useRef(0);

    // Hover state triggers material emissive → needs re-render
    const [hoveredPart, setHoveredPart] = useState<string | null>(null);

    // Trigger head bounce whenever expression changes
    useEffect(() => {
        bounceProgressRef.current = 1;
    }, [config.expression]);

    // Reset blink animation on gender change to prevent stuck "closed eye" state
    useEffect(() => {
        blinkProgressRef.current = 0;
        blinkTimerRef.current = 2 + Math.random() * 3;
        if (eyeGroupRef.current) {
            eyeGroupRef.current.scale.y = 1;
        }
    }, [config.gender]);

    // Clean up cursor on unmount
    useEffect(() => {
        return () => { document.body.style.cursor = 'default'; };
    }, []);

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        // 1. Head bounce on expression change (sine wave over ~0.25 s)
        if (headRef.current && bounceProgressRef.current > 0) {
            bounceProgressRef.current = Math.max(0, bounceProgressRef.current - delta * 4);
            const p = bounceProgressRef.current;
            headRef.current.position.y = 2.0 + Math.sin((1 - p) * Math.PI * 3) * p * 0.1;
        }

        // 2. Mouse look – head gently rotates toward screen cursor
        if (headRef.current) {
            const targetRotX = -state.pointer.y * 0.25;
            const targetRotY = state.pointer.x * 0.35;
            headRef.current.rotation.x = THREE.MathUtils.lerp(
                headRef.current.rotation.x, targetRotX, delta * 3
            );
            headRef.current.rotation.y = THREE.MathUtils.lerp(
                headRef.current.rotation.y, targetRotY, delta * 3
            );
        }

        // 3. Breathing – subtle torso scale on X and Z axes
        if (torsoRef.current) {
            const breath = 1 + Math.sin(t * 0.9) * 0.012;
            torsoRef.current.scale.x = breath;
            torsoRef.current.scale.z = breath;
        }

        // 4. Blinking – periodic eye close/open using sine curve
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

        // 5. Arm pose animations – arms pivot around shoulder origin
        if (leftArmRef.current && rightArmRef.current) {
            const pose = config.pose ?? 'idle';

            if (pose === 'wave') {
                const waveZ = -1.1 + Math.sin(t * 4) * 0.35;
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.z, waveZ, delta * 8
                );
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.x, 0, delta * 5
                );
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.z, 0, delta * 5
                );
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.x, 0, delta * 5
                );
            } else if (pose === 'dab') {
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.z, -0.7, delta * 5
                );
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.x, -0.3, delta * 5
                );
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.z, 1.0, delta * 5
                );
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.x, 0.4, delta * 5
                );
            } else if (pose === 'peace') {
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.z, -0.5, delta * 5
                );
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.z, 0.5, delta * 5
                );
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.x, 0, delta * 5
                );
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.x, 0, delta * 5
                );
            } else {
                const sway = Math.sin(t * 0.6) * 0.04;
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.z, sway, delta * 2
                );
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.z, -sway, delta * 2
                );
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    leftArmRef.current.rotation.x, 0, delta * 3
                );
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
                    rightArmRef.current.rotation.x, 0, delta * 3
                );
            }
        }
    });

    // --- Interaction callbacks ---

    const handleClick = useCallback((e: ThreeEvent<MouseEvent>, part: string) => {
        if (interactive && onPartClick) {
            e.stopPropagation();
            onPartClick(part);
        }
    }, [interactive, onPartClick]);

    const handlePointerEnter = useCallback((e: ThreeEvent<PointerEvent>, part: string) => {
        if (interactive) {
            e.stopPropagation();
            setHoveredPart(part);
            document.body.style.cursor = 'pointer';
        }
    }, [interactive]);

    const handlePointerLeave = useCallback((_e: ThreeEvent<PointerEvent>) => {
        if (interactive) {
            setHoveredPart(null);
            document.body.style.cursor = 'default';
        }
    }, [interactive]);

    // Emissive helpers – only hovered part glows
    const emissive = (part: string) =>
        hoveredPart === part && interactive ? '#3355ee' : '#000000';
    const emissiveInt = (part: string) =>
        hoveredPart === part && interactive ? 0.12 : 0;

    // Skin material props (reused for head, hands, neck, arms for female)
    const skinMatProps = {
        color: skinColor,
        roughness: dims.isRobot ? 0.15 : 0.65,
        metalness: dims.isRobot ? 0.85 : 0,
        clearcoat: dims.isRobot ? 0 : 0.15,
        clearcoatRoughness: 0.6,
        envMapIntensity: 0.4,
    };

    return (
        <group position={[0, variant === 'head' ? -1.5 : -0.85, 0]}>

            {/* ── Head – sphere, mouse-look rotation + bounce ── */}
            <group ref={headRef} position={[0, 2.0, 0]}>
                <group
                    onClick={(e) => handleClick(e, 'skin')}
                    onPointerEnter={(e) => handlePointerEnter(e, 'skin')}
                    onPointerLeave={handlePointerLeave}
                >
                    <mesh scale={dims.headScale}>
                        <sphereGeometry args={[0.65, 32, 32]} />
                        <meshPhysicalMaterial
                            {...skinMatProps}
                            emissive={emissive('skin')}
                            emissiveIntensity={emissiveInt('skin')}
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
                >
                    <HairLayer style={config.hairStyle} color={hairColor} />
                </group>
            </group>

            {variant === 'full' && (
                <group>
                    {/* ── Neck – thinner for female ── */}
                    <mesh position={[0, 1.42, 0]}>
                        <cylinderGeometry args={[dims.isFemale ? 0.09 : 0.12, dims.isFemale ? 0.12 : 0.15, dims.isFemale ? 0.18 : 0.15, 12]} />
                        <meshPhysicalMaterial {...skinMatProps} />
                    </mesh>

                    {/* ── Torso – breathing scale on X/Z ── */}
                    <group ref={torsoRef}>
                        <group
                            position={[0, 1.05, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <capsuleGeometry args={[dims.torsoRadius, dims.torsoLength, 8, 16]} />
                                <meshStandardMaterial
                                    color={shirtColor}
                                    roughness={config.shirtStyle === 'leather' ? 0.25 : 0.75}
                                    metalness={config.shirtStyle === 'leather' ? 0.1 : 0}
                                    envMapIntensity={0.3}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            <ShirtOverlay
                                style={config.shirtStyle ?? 't-shirt'}
                                color={shirtColor}
                                torsoRadius={dims.torsoRadius}
                            />
                        </group>
                    </group>

                    {/* ── Left arm – pivot at shoulder ── */}
                    <group ref={leftArmRef} position={[-dims.armSpacing, 1.3, 0]}>
                        <group
                            position={[0, -0.4, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <capsuleGeometry args={[dims.armRadius, dims.armLength, 6, 12]} />
                                <meshStandardMaterial
                                    color={getArmColor(config.shirtStyle, shirtColor, skinColor, dims.isFemale)}
                                    roughness={getArmColor(config.shirtStyle, shirtColor, skinColor, dims.isFemale) === skinColor ? 0.65 : 0.75}
                                    envMapIntensity={0.3}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            <ShirtArmOverlay
                                style={config.shirtStyle ?? 't-shirt'}
                                color={shirtColor}
                                armRadius={dims.armRadius}
                                side="left"
                            />
                            {/* Hand */}
                            <mesh position={[0, -0.45, 0]}>
                                <sphereGeometry args={[dims.isFemale ? 0.08 : 0.1, 16, 16]} />
                                <meshPhysicalMaterial {...skinMatProps} />
                            </mesh>
                        </group>
                    </group>

                    {/* ── Right arm – pivot at shoulder ── */}
                    <group ref={rightArmRef} position={[dims.armSpacing, 1.3, 0]}>
                        <group
                            position={[0, -0.4, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <capsuleGeometry args={[dims.armRadius, dims.armLength, 6, 12]} />
                                <meshStandardMaterial
                                    color={getArmColor(config.shirtStyle, shirtColor, skinColor, dims.isFemale)}
                                    roughness={getArmColor(config.shirtStyle, shirtColor, skinColor, dims.isFemale) === skinColor ? 0.65 : 0.75}
                                    envMapIntensity={0.3}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            <ShirtArmOverlay
                                style={config.shirtStyle ?? 't-shirt'}
                                color={shirtColor}
                                armRadius={dims.armRadius}
                                side="right"
                            />
                            {/* Hand */}
                            <mesh position={[0, -0.45, 0]}>
                                <sphereGeometry args={[dims.isFemale ? 0.08 : 0.1, 16, 16]} />
                                <meshPhysicalMaterial {...skinMatProps} />
                            </mesh>
                        </group>
                    </group>

                    {/* ── Female hips – wider than torso for feminine silhouette ── */}
                    {dims.isFemale && (
                        <group position={[0, 0.72, 0]}>
                            <mesh scale={[1.35, 0.55, 1.0]}>
                                <sphereGeometry args={[0.3, 16, 16]} />
                                <meshStandardMaterial
                                    color={pantsColor}
                                    roughness={0.75}
                                    metalness={0}
                                    envMapIntensity={0.3}
                                    emissive={emissive('pants')}
                                    emissiveIntensity={emissiveInt('pants')}
                                />
                            </mesh>
                        </group>
                    )}

                    {/* ── Female waist pinch – narrower midsection ── */}
                    {dims.isFemale && (
                        <mesh position={[0, 0.85, 0]} scale={[0.9, 0.3, 0.85]}>
                            <cylinderGeometry args={[0.22, 0.26, 0.15, 12]} />
                            <meshStandardMaterial
                                color={shirtColor}
                                roughness={0.75}
                                envMapIntensity={0.3}
                            />
                        </mesh>
                    )}

                    {/* ── Legs + shoes (style-aware) ── */}
                    <LegsSection
                        pantsStyle={config.pantsStyle ?? 'standard'}
                        pantsColor={pantsColor}
                        shoeColor={shoeColor}
                        skinColor={skinColor}
                        legRadius={dims.legRadius}
                        legLength={dims.legLength}
                        emissive={emissive('pants')}
                        emissiveInt={emissiveInt('pants')}
                        onClickPants={(e) => handleClick(e, 'pants')}
                        onPointerEnterPants={(e) => handlePointerEnter(e, 'pants')}
                        onPointerLeave={handlePointerLeave}
                    />

                    {/* ── Accessories ── */}
                    <AccessoryLayer
                        accessory={config.accessory}
                        color={config.accessoryColor ?? config.shirtColor}
                        gender={config.gender}
                    />
                </group>
            )}
        </group>
    );
});

// --- Background gradient sphere ---

const BackgroundSphere = memo(() => (
    <mesh scale={[-20, 20, 20]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial side={THREE.BackSide} color="#ffffff">
            {/* Gradient via vertex colors would be ideal but a solid dark color
                blending with hemisphereLight gives a clean result */}
        </meshBasicMaterial>
    </mesh>
));

// --- Main Component ---

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
    config, interactive = true, onPartClick, variant = 'full',
}) => {
    const cameraPos = useMemo<[number, number, number]>(
        () => (variant === 'head' ? [0, 0.5, 1.9] : [0, 0.5, 5.5]),
        [variant]
    );

    return (
        <div className={`w-full h-full relative ${variant === 'head' ? '' : 'min-h-[300px]'}`}>
            <Canvas
                shadows={{ type: THREE.PCFSoftShadowMap }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                dpr={[1, 1.5]}
                camera={{ position: cameraPos, fov: 45 }}
            >
                {/* Soft fill – prevents pitch-black shadows */}
                <ambientLight intensity={0.3} />
                {/* Sky-to-ground gradient */}
                <hemisphereLight color="#b1e1ff" groundColor="#f0f0f0" intensity={0.55} />
                {/* Key light with tight frustum for clean avatar shadows */}
                <directionalLight
                    position={[4, 8, 4]}
                    intensity={1.8}
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
                {/* Cool blue rim light for depth separation */}
                <directionalLight position={[-3, 2, -4]} intensity={0.4} color="#6080ff" />
                {/* Warm fill from below for stage lighting feel */}
                <pointLight position={[0, -1, 2]} intensity={0.15} color="#ffd4a0" />

                <Suspense fallback={null}>
                    <ThreeErrorBoundary>
                        {/* IBL: city RGBE panorama drives PBR reflections */}
                        <Environment preset="city" />
                    </ThreeErrorBoundary>

                    {/* Background gradient (only full variant) */}
                    {variant === 'full' && <BackgroundSphere />}

                    {/* Float gives overall gentle body bob and micro-rotation */}
                    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.15}>
                        <AvatarModel
                            config={config}
                            variant={variant}
                            onPartClick={onPartClick}
                            interactive={interactive}
                        />
                    </Float>

                    {/* Platform disc – outside Float to stay stable */}
                    {variant === 'full' && (
                        <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
                            <circleGeometry args={[1.2, 32]} />
                            <meshStandardMaterial color="#e0e0e0" transparent opacity={0.4} depthWrite={false} />
                        </mesh>
                    )}

                    <ContactShadows
                        position={[0, -1.2, 0]}
                        opacity={0.35}
                        scale={6}
                        blur={3}
                        far={5}
                        color="#000020"
                    />

                    {/* Subtle sparkles (only full variant) */}
                    {variant === 'full' && (
                        <Sparkles
                            count={15}
                            scale={[4, 5, 4]}
                            size={2}
                            speed={0.3}
                            opacity={0.3}
                            color="#6366f1"
                        />
                    )}
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={variant === 'full'}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    target={variant === 'head' ? [0, 0.5, 0] : [0, 0.1, 0]}
                />
            </Canvas>
        </div>
    );
};

export default AvatarViewer;
