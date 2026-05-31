import React, { Suspense, useEffect, useMemo, useRef, memo, useState, useCallback } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarConfig } from '@/types';

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
    const eyeColor = config.eyeColor ?? '#08283B';
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
                            <meshStandardMaterial color="#08283B" roughness={0.9} />
                        </mesh>
                        <mesh position={[0.15, 0.13, fz + 0.01]}>
                            <boxGeometry args={[0.14, 0.02, 0.01]} />
                            <meshStandardMaterial color="#08283B" roughness={0.9} />
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
                    <meshStandardMaterial color="#08283B" roughness={0.1} metalness={0.8} />
                </mesh>
            )}

            {/* Mouths */}
            {expression === 'happy' && (
                <group position={[0, -0.16, fz]}>
                    <mesh position={[-0.08, 0.02, 0]}>
                        <boxGeometry args={[0.04, 0.02, 0.01]} />
                        {mcMat('#D97848')}
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.12, 0.04, 0.01]} />
                        {mcMat('#D97848')}
                    </mesh>
                    <mesh position={[0.08, 0.02, 0]}>
                        <boxGeometry args={[0.04, 0.02, 0.01]} />
                        {mcMat('#D97848')}
                    </mesh>
                </group>
            )}
            {expression === 'surprised' && (
                <mesh position={[0, -0.16, fz]}>
                    <boxGeometry args={[0.08, 0.1, 0.01]} />
                    {mcMat('#D97848')}
                </mesh>
            )}
            {expression === 'neutral' && (
                <mesh position={[0, -0.15, fz]}>
                    <boxGeometry args={[0.14, 0.03, 0.01]} />
                    {mcMat('#D97848')}
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

// --- Hair Layer (grid-aligned voxel system) ---
// Head = 0.8³ cube, center y=0. Top y=0.40, front z=0.40, sides x=±0.40.
// Grid: 1 voxel = 0.10 world units. Head spans -4 to +4 in each axis.
// Hair sits on/beyond head surface. Front face (z > 0.35) NEVER covered at face level.
// Shading: top=light, sides/back=dark, crown=base. Consistent across all styles.

type VoxelBlock = [
    gx: number, gy: number, gz: number, // center position in grid units (×0.10)
    sx: number, sy: number, sz: number, // size in grid units (×0.10)
    shade: 'base' | 'dark' | 'light'
];

const V = 0.10; // voxel unit in world coords

function renderVoxelBlocks(
    blocks: VoxelBlock[],
    mat: React.ReactNode,
    matDark: React.ReactNode,
    matLight: React.ReactNode
) {
    return blocks.map(([gx, gy, gz, sx, sy, sz, shade], i) => (
        <mesh key={i} position={[gx * V, gy * V, gz * V]}>
            <boxGeometry args={[sx * V, sy * V, sz * V]} />
            {shade === 'light' ? matLight : shade === 'dark' ? matDark : mat}
        </mesh>
    ));
}

const HairLayer = memo<{ style: string; color: string }>(({ style, color }) => {
    const mat = <meshStandardMaterial color={color} roughness={0.85} />;
    const matDark = <meshStandardMaterial color={darkenColor(color, 0.8)} roughness={0.85} />;
    const matLight = <meshStandardMaterial color={darkenColor(color, 1.12)} roughness={0.8} />;
    const stubble = (opacity: number) => (
        <meshStandardMaterial color={darkenColor(color, 0.92)} roughness={0.92} transparent opacity={opacity} />
    );

    switch (style) {
        // === MALE STYLES ===

        case 'short': {
            // Final mockup: short crop with a stepped tile crown, low crown grid, square micro-bangs, and visible ears.
            const blocks: VoxelBlock[] = [
                [0, 4.22, -0.65, 8.8, 0.82, 7.35, 'base'],    // Fitted short crop cap
                [-3.35, 4.95, 1.0, 1.75, 0.72, 2.25, 'dark'],  // stepped tile crown left-front
                [-1.45, 5.18, 1.05, 1.8, 0.84, 2.35, 'base'],  // stepped tile crown front
                [0.55, 5.26, 0.95, 1.9, 0.9, 2.35, 'light'],   // stepped tile crown front highlight
                [2.65, 5.06, 0.85, 1.75, 0.76, 2.25, 'base'],  // stepped tile crown right-front
                [-3.05, 5.28, -1.05, 1.85, 0.86, 2.45, 'dark'], // low crown grid left-mid
                [-0.95, 5.48, -1.15, 1.95, 0.9, 2.55, 'light'], // low crown grid center-mid
                [1.25, 5.42, -1.15, 2.05, 0.86, 2.55, 'base'],  // low crown grid right-mid
                [3.3, 5.1, -1.25, 1.65, 0.74, 2.35, 'dark'],    // low crown grid side tile
                [-2.55, 5.18, -3.0, 2.1, 0.76, 1.8, 'dark'],    // low crown grid back-left
                [-0.2, 5.35, -3.05, 2.25, 0.82, 1.85, 'base'],  // low crown grid back-center
                [2.25, 5.15, -3.0, 2.05, 0.74, 1.8, 'dark'],    // low crown grid back-right
                [-3.85, 3.68, 1.85, 1.25, 1.35, 2.55, 'dark'],  // Left temple cap
                [3.85, 3.62, 1.8, 1.25, 1.28, 2.45, 'dark'],    // Right temple cap
                [-3.25, 3.18, 3.38, 1.05, 1.45, 0.9, 'dark'],   // square micro-bangs
                [-2.05, 2.82, 3.5, 1.0, 1.34, 0.86, 'base'],    // square micro-bangs
                [-0.75, 3.04, 3.52, 1.05, 1.55, 0.88, 'base'],  // square micro-bangs
                [0.58, 2.9, 3.5, 1.0, 1.36, 0.86, 'light'],     // square micro-bangs
                [1.85, 3.12, 3.45, 1.05, 1.5, 0.88, 'base'],    // square micro-bangs
                [3.05, 2.92, 3.35, 1.0, 1.32, 0.86, 'dark'],    // square micro-bangs
                [-4.55, 2.34, -0.2, 0.9, 3.82, 5.85, 'dark'],   // Short left side panel, visible ears
                [4.55, 2.3, -0.2, 0.9, 3.72, 5.85, 'dark'],     // Short right side panel, visible ears
                [-4.5, 0.88, 1.92, 0.78, 1.82, 1.05, 'dark'],   // Small sideburn above visible ears
                [4.5, 0.96, 1.88, 0.78, 1.72, 1.05, 'dark'],    // Small sideburn above visible ears
                [0, 1.92, -4.55, 8.1, 4.62, 0.9, 'dark'],       // Clean back panel
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'spiky':
            // Final mockup: spiky crop with a connected spike bed, distributed spike field, front row spikes, crown spikes, not a mohawk.
            return (
                <group>
                    {renderVoxelBlocks([
                        [0, 4.25, -0.5, 8.8, 0.9, 7.0, 'base'],    // Connected spike bed
                        [0, 3.22, 3.08, 6.2, 1.45, 1.0, 'base'],   // Connected front hairline bed
                        [-4.55, 2.78, 0, 0.9, 2.9, 5.55, 'dark'],  // Tidy left side
                        [4.55, 2.74, 0, 0.9, 2.82, 5.55, 'dark'],  // Tidy right side
                        [0, 2.38, -4.5, 7.4, 3.35, 0.9, 'dark'],   // Short back
                        [-3.4, 5.42, 2.1, 1.18, 2.3, 1.15, 'base'], // front row spikes
                        [-2.05, 5.82, 2.18, 1.2, 2.95, 1.18, 'dark'], // front row spikes
                        [-0.62, 6.15, 2.12, 1.24, 3.4, 1.18, 'light'], // front row spikes
                        [0.9, 5.84, 2.02, 1.18, 2.9, 1.15, 'base'], // front row spikes
                        [2.35, 5.5, 1.92, 1.18, 2.35, 1.12, 'dark'], // front row spikes
                        [3.45, 5.2, 1.5, 1.05, 1.75, 1.1, 'base'],  // distributed spike field side
                        [-3.25, 5.2, 0.4, 1.08, 1.8, 1.1, 'dark'],  // distributed spike field side
                        [-2.0, 5.72, 0.22, 1.24, 2.75, 1.2, 'base'], // crown spikes
                        [-0.55, 6.35, 0.3, 1.28, 3.65, 1.2, 'light'], // crown spikes
                        [0.98, 6.08, 0.16, 1.24, 3.15, 1.2, 'base'], // crown spikes
                        [2.55, 5.78, 0.02, 1.2, 2.55, 1.16, 'dark'], // crown spikes
                        [-2.8, 5.42, -1.45, 1.15, 2.1, 1.12, 'dark'], // distributed spike field back
                        [-1.28, 5.82, -1.55, 1.18, 2.7, 1.14, 'base'], // distributed spike field back
                        [0.25, 5.55, -1.55, 1.12, 2.2, 1.12, 'base'], // distributed spike field back
                        [1.72, 5.75, -1.55, 1.18, 2.55, 1.14, 'dark'], // distributed spike field back
                        [3.05, 5.25, -1.3, 1.05, 1.8, 1.08, 'base'],  // distributed spike field back
                        [-1.85, 5.15, -2.75, 1.1, 1.65, 1.1, 'dark'], // rear short spike
                        [0.0, 5.35, -2.82, 1.14, 1.95, 1.1, 'base'],  // rear short spike
                        [1.85, 5.12, -2.72, 1.1, 1.62, 1.08, 'dark'], // rear short spike
                        [-4.0, 4.72, 0.7, 1.0, 1.35, 1.05, 'base'],   // Side spike, not a mohawk
                        [4.0, 4.62, 0.55, 1.0, 1.25, 1.05, 'dark'],   // Side spike, not a mohawk
                    ], mat, matDark, matLight)}
                </group>
            );

        case 'messy':
            // Final mockup: wild bedhead; reference-image full voxel bedhead with oversized visible crown clumps,
            // a dense block halo, front readable bedhead clumps, layered top texture,
            // chunky side mass, asymmetric fringe, side locks, raised crown, and no floating blocks.
            return (
                <group>
                    {renderVoxelBlocks([
                        [0, 4.18, -0.6, 8.25, 0.9, 7.0, 'base'],     // Connected bedhead base, no floating blocks
                        [-2.75, 5.0, 1.35, 2.1, 1.08, 2.2, 'dark'],  // dense block halo front-left
                        [-0.75, 5.28, 1.35, 2.0, 1.18, 2.25, 'base'], // dense block halo front
                        [1.35, 5.18, 1.2, 2.15, 1.12, 2.2, 'light'], // dense block halo front
                        [3.15, 4.95, 1.05, 1.65, 0.95, 2.05, 'dark'], // dense block halo front-right
                        [-2.85, 6.64, 2.32, 1.2, 1.42, 1.12, 'dark'], // front readable bedhead clumps
                        [-1.28, 6.95, 2.42, 1.16, 1.24, 1.08, 'base'], // front readable bedhead clumps
                        [0.28, 6.82, 2.48, 1.12, 1.3, 1.04, 'dark'],  // front readable bedhead clumps
                        [1.82, 6.62, 2.32, 1.2, 1.24, 1.1, 'base'],   // front readable bedhead clumps
                        [3.05, 5.92, 2.15, 1.12, 1.1, 1.0, 'dark'],   // front readable bedhead clumps
                        [-3.35, 5.45, -0.15, 1.65, 1.3, 2.25, 'dark'], // layered top texture
                        [-1.42, 5.86, -0.22, 1.9, 1.55, 2.35, 'base'], // raised crown
                        [0.58, 6.18, -0.18, 1.82, 1.75, 2.25, 'dark'], // raised crown
                        [2.48, 5.72, -0.25, 1.75, 1.38, 2.25, 'base'], // layered top texture
                        [-3.75, 5.98, 0.65, 1.25, 1.28, 1.4, 'dark'],  // oversized visible crown clumps
                        [-1.88, 6.92, 0.82, 1.22, 1.18, 1.25, 'base'], // oversized visible crown clumps
                        [0.0, 6.98, 1.0, 1.16, 1.18, 1.22, 'dark'],    // oversized visible crown clumps
                        [1.88, 6.82, 0.78, 1.22, 1.12, 1.25, 'base'],  // oversized visible crown clumps
                        [3.82, 5.72, 0.52, 1.18, 1.18, 1.28, 'dark'],  // oversized visible crown clumps
                        [-2.55, 6.16, -1.85, 1.65, 1.35, 1.75, 'base'], // layered top texture
                        [-0.55, 6.78, -1.85, 1.55, 1.32, 1.65, 'light'], // layered top texture
                        [1.45, 6.55, -1.85, 1.62, 1.25, 1.7, 'dark'],  // layered top texture
                        [3.1, 5.85, -1.75, 1.45, 1.05, 1.55, 'base'],  // dense block halo side-top
                        [-3.28, 5.72, -3.1, 1.55, 1.12, 1.55, 'dark'], // Back crown clump
                        [-1.28, 6.08, -3.1, 1.7, 1.28, 1.55, 'base'],  // Back crown clump
                        [0.82, 5.9, -3.05, 1.75, 1.16, 1.55, 'dark'],  // Back crown clump
                        [2.82, 5.55, -3.0, 1.5, 1.0, 1.5, 'base'],     // Back crown clump
                        [-3.35, 3.62, 2.52, 1.22, 1.75, 0.98, 'dark'], // asymmetric fringe
                        [-2.05, 2.95, 3.3, 1.16, 1.52, 0.88, 'base'],  // asymmetric fringe
                        [-0.72, 3.32, 3.48, 1.18, 1.86, 0.88, 'base'], // asymmetric fringe
                        [0.58, 2.4, 3.58, 1.16, 2.35, 0.78, 'dark'],   // asymmetric fringe central hanging lock
                        [1.9, 3.08, 3.26, 1.22, 1.46, 0.88, 'base'],   // asymmetric fringe
                        [3.2, 3.42, 2.42, 1.15, 1.62, 0.98, 'dark'],   // asymmetric fringe
                        [-4.45, 2.24, -0.18, 0.92, 4.08, 5.55, 'dark'], // Left side mass
                        [4.45, 2.08, -0.18, 0.92, 3.75, 5.55, 'dark'],  // Right side mass
                        [-4.72, 4.3, 1.0, 1.02, 1.72, 2.15, 'dark'],   // chunky side mass
                        [4.72, 4.05, 0.82, 1.02, 1.52, 2.05, 'base'],  // chunky side mass
                        [-4.78, 3.0, 2.22, 0.94, 2.05, 1.15, 'base'],  // side locks
                        [4.78, 2.78, 2.05, 0.94, 1.72, 1.1, 'dark'],   // side locks
                        [-4.72, 1.0, 1.75, 0.9, 2.28, 1.1, 'dark'],    // side locks
                        [4.72, 1.18, 1.65, 0.9, 2.08, 1.1, 'dark'],    // side locks
                        [-4.65, 3.58, -1.95, 0.95, 1.9, 1.8, 'dark'],  // dense block halo side-back
                        [4.65, 3.38, -1.85, 0.95, 1.65, 1.7, 'base'],  // dense block halo side-back
                        [0, 1.78, -4.55, 7.75, 4.62, 0.9, 'dark'],     // Heavy messy back
                        [-2.9, 3.65, -4.18, 1.6, 2.3, 1.0, 'base'],    // Back layered block
                        [-0.8, 3.28, -4.28, 1.65, 1.9, 1.0, 'dark'],   // Back layered block
                        [1.25, 3.52, -4.18, 1.7, 2.2, 1.0, 'base'],    // Back layered block
                        [3.18, 3.12, -4.05, 1.35, 1.78, 1.0, 'dark'],  // Back layered block
                        [-3.8, 4.68, 0.85, 1.16, 1.32, 1.1, 'base'],   // Attached side tuft
                        [3.82, 4.36, 0.62, 1.16, 1.18, 1.05, 'dark'],  // Attached side tuft
                    ], mat, matDark, matLight)}
                </group>
            );

        case 'fade':
            // Thick top volume with graduated stubble fading down the sides.
            return (
                <group>
                    {renderVoxelBlocks([
                        [0, 5, -0.5, 7, 2, 7, 'base'],      // Thick top slab (2 voxels)
                        [0, 6.2, 0.5, 3, 0.5, 3, 'light'],  // Crown highlight
                        [0, 3, -4.5, 6, 2, 1, 'dark'],       // Back upper
                    ], mat, matDark, matLight)}
                    {/* Fade stubble — decreasing opacity down the sides */}
                    {[-1, 1].map((dir) => (
                        <group key={dir}>
                            <mesh position={[dir * 0.45, 0.25, 0]}>
                                <boxGeometry args={[0.10, 0.30, 0.50]} />
                                {stubble(0.40)}
                            </mesh>
                            <mesh position={[dir * 0.45, 0, 0]}>
                                <boxGeometry args={[0.10, 0.20, 0.40]} />
                                {stubble(0.20)}
                            </mesh>
                        </group>
                    ))}
                    <mesh position={[0, 0.10, -0.45]}>
                        <boxGeometry args={[0.60, 0.20, 0.10]} />
                        {stubble(0.30)}
                    </mesh>
                </group>
            );

        case 'curls': {
            // Curly clusters: 2×1.5×2 cube groups forming round volume.
            const blocks: VoxelBlock[] = [
                [-2, 5, 1, 2, 1.5, 2, 'base'],          // Crown front-left
                [1, 5, 0, 2, 1.5, 2, 'dark'],            // Crown center-right
                [-0.5, 5, -1.5, 2, 1.5, 2, 'base'],     // Crown back-center
                [2, 4.5, -1, 2, 1.5, 2, 'dark'],         // Crown back-right
                [-1.5, 4.5, 2, 2, 1, 2, 'base'],         // Front accent
                [0, 5.5, 0, 2, 1, 2, 'light'],           // Top highlight
                [-4.5, 2, 0.5, 1.5, 2.5, 2, 'dark'],    // Left temple
                [4.5, 2, 0.5, 1.5, 2.5, 2, 'dark'],     // Right temple
                [-4, 1, -1.5, 1.5, 2, 2, 'base'],       // Left back
                [4, 1, -1.5, 1.5, 2, 2, 'base'],        // Right back
                [0, 2, -4.5, 7, 4, 1, 'dark'],           // Back panel
                [-2, 1.5, -4, 2, 2, 1.5, 'base'],       // Back-left cluster
                [2, 1.5, -4, 2, 2, 1.5, 'base'],        // Back-right cluster
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'buzzcut':
            // Ultra-thin stubble layer: barely visible, all transparent.
            return (
                <group>
                    <mesh position={[0, 0.42, -0.05]}>
                        <boxGeometry args={[0.85, 0.05, 0.75]} />
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.65} />
                    </mesh>
                    <mesh position={[0, 0.35, 0.30]}>
                        <boxGeometry args={[0.40, 0.10, 0.05]} />
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.50} />
                    </mesh>
                    {[-1, 1].map((dir) => (
                        <mesh key={dir} position={[dir * 0.43, 0.20, 0]}>
                            <boxGeometry args={[0.05, 0.40, 0.50]} />
                            <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.45} />
                        </mesh>
                    ))}
                    <mesh position={[0, 0.20, -0.43]}>
                        <boxGeometry args={[0.70, 0.40, 0.05]} />
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.50} />
                    </mesh>
                </group>
            );

        case 'mohawk':
            // Shaved sides (stubble) with a tall center ridge.
            return (
                <group>
                    {/* Shaved sides — graduated stubble */}
                    {[-1, 1].map((dir) => (
                        <group key={dir}>
                            <mesh position={[dir * 0.45, 0.20, 0]}>
                                <boxGeometry args={[0.10, 0.30, 0.50]} />
                                {stubble(0.22)}
                            </mesh>
                            <mesh position={[dir * 0.45, 0, 0]}>
                                <boxGeometry args={[0.10, 0.20, 0.40]} />
                                {stubble(0.12)}
                            </mesh>
                        </group>
                    ))}
                    {/* Center ridge — the mohawk strip */}
                    {renderVoxelBlocks([
                        [0, 6, 1, 2, 3, 2, 'base'],         // Front ridge
                        [0, 6, -1.5, 2, 3, 2, 'dark'],      // Back ridge
                        [0, 7.5, 0, 1.5, 1, 2, 'light'],    // Top highlight
                        [0, 4.5, -4, 2, 1, 1, 'dark'],      // Back anchor
                    ], mat, matDark, matLight)}
                </group>
            );

        case 'afro': {
            // Big rounded volume: head + 2-3 voxels in every direction.
            const blocks: VoxelBlock[] = [
                [0, 6, -0.5, 10, 3, 9, 'base'],         // Top dome
                [-5.5, 2, -0.5, 2, 5, 7, 'dark'],       // Left volume
                [5.5, 2, -0.5, 2, 5, 7, 'dark'],        // Right volume
                [0, 1.5, -5, 8, 5, 2, 'dark'],           // Back volume
                [0, 4, 3, 5, 2, 1, 'base'],              // Front above face
                [-2, 7.5, 0, 2.5, 1, 2.5, 'light'],     // Left highlight
                [2, 7.5, 0, 2.5, 1, 2.5, 'light'],      // Right highlight
                [-5, 0, 1.5, 2, 4, 3, 'dark'],           // Left front volume
                [5, 0, 1.5, 2, 4, 3, 'dark'],            // Right front volume
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'sidepart': {
            // Asymmetric part: more volume left, thinner right, visible gap.
            const blocks: VoxelBlock[] = [
                [-2, 4.5, -0.5, 5, 1.5, 8, 'base'],    // Left side — more volume
                [3, 4.5, -0.5, 3, 1, 7, 'base'],        // Right side — thinner
                [1, 4.2, -0.5, 1, 0.5, 7, 'dark'],      // Part line gap
                [-1.5, 3, 3, 4, 2, 1, 'base'],           // Front sweep left
                [-4.5, 2, 0, 1, 4, 6, 'dark'],           // Left side panel
                [4.5, 2.5, 0, 1, 3, 5, 'dark'],          // Right side panel (thinner)
                [0, 2, -4.5, 8, 4, 1, 'dark'],           // Back
                [-2, 5.5, 0.5, 2, 0.5, 2, 'light'],     // Highlight on volume side
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        // === FEMALE STYLES ===

        case 'long': {
            // Long straight: top cap + side curtains + back curtain hanging down.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -0.5, 9, 1, 8, 'base'],       // Top cap
                [0, 3, 3, 5, 2, 1, 'light'],            // Bangs/fringe
                [-4.5, 3, 0, 1, 2, 5, 'base'],          // Left head coverage
                [4.5, 3, 0, 1, 2, 5, 'base'],           // Right head coverage
                [-4.5, -1, 1.5, 1, 8, 3, 'base'],       // Left curtain (hanging)
                [4.5, -1, 1.5, 1, 8, 3, 'base'],        // Right curtain (hanging)
                [0, -1, -4.5, 8, 10, 1, 'dark'],        // Back curtain (long)
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'ponytail': {
            // Sleek top + tail hanging from the back of the head.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -0.5, 9, 1, 8, 'base'],       // Top cap
                [0, 3, 3, 4, 1, 1, 'light'],            // Bangs
                [-4.5, 3, 0, 1, 2, 5, 'base'],          // Left side
                [4.5, 3, 0, 1, 2, 5, 'base'],           // Right side
                [0, 2.5, -4.5, 7, 3, 1, 'dark'],        // Back
                [0, 2, -5, 2, 2, 1, 'dark'],            // Tail attachment
                [0, -2, -5, 1.5, 6, 1, 'base'],         // Hanging tail
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'pigtails': {
            // Top cap + two side tails with tie blocks.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -0.5, 9, 1, 8, 'base'],       // Top cap
                [0, 3, 3, 4, 1, 1, 'light'],            // Bangs
                [-4.5, 2.5, 0, 1, 3, 5, 'base'],        // Left head coverage
                [4.5, 2.5, 0, 1, 3, 5, 'base'],         // Right head coverage
                [0, 2, -4.5, 7, 4, 1, 'dark'],           // Back
                [-5, 1.5, 0, 2, 1, 2, 'dark'],           // Left tie
                [5, 1.5, 0, 2, 1, 2, 'dark'],            // Right tie
                [-5, -2, 0, 1.5, 5, 1.5, 'base'],       // Left tail (hanging)
                [5, -2, 0, 1.5, 5, 1.5, 'base'],        // Right tail (hanging)
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'bob': {
            // Chin-length: top cap + wide side panels + full back.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -0.5, 9, 1, 8, 'base'],       // Top cap
                [0, 3, 3, 5, 2, 1, 'light'],            // Bangs
                [-4.5, 0, 1, 1.5, 8, 3, 'base'],        // Left side (chin-length)
                [4.5, 0, 1, 1.5, 8, 3, 'base'],         // Right side (chin-length)
                [0, 0, -4.5, 8, 8, 1.5, 'dark'],        // Back (full)
                [-3.5, -3.5, 1.5, 1.5, 1, 2, 'dark'],  // Left bottom curl-in
                [3.5, -3.5, 1.5, 1.5, 1, 2, 'dark'],   // Right bottom curl-in
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'braids': {
            // Top cap + alternating light/dark braid segments on each side.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -0.5, 9, 1, 8, 'base'],       // Top cap
                [-1.5, 3, 3, 2, 1, 1, 'light'],         // Left bangs
                [1.5, 3, 3, 2, 1, 1, 'light'],          // Right bangs
                [-4.5, 2.5, 0, 1, 3, 5, 'base'],        // Left head coverage
                [4.5, 2.5, 0, 1, 3, 5, 'base'],         // Right head coverage
                [0, 2, -4.5, 7, 4, 1, 'dark'],           // Back
                [-4, 0, 0, 1, 2, 1, 'base'],             // Left braid segment 1
                [-4, -2, 0, 1, 2, 1, 'dark'],            // Left braid segment 2
                [-4, -4, 0, 0.8, 1.5, 0.8, 'base'],    // Left braid tip
                [4, 0, 0, 1, 2, 1, 'base'],              // Right braid segment 1
                [4, -2, 0, 1, 2, 1, 'dark'],             // Right braid segment 2
                [4, -4, 0, 0.8, 1.5, 0.8, 'base'],     // Right braid tip
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        case 'bun': {
            // Pulled-back sleek top + round bun block at back of head.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -1, 9, 1, 7, 'base'],          // Top cap (pulled back)
                [0, 3, 3, 4, 1, 1, 'light'],            // Subtle bangs
                [-4.5, 2.5, -0.5, 1, 3, 5, 'base'],    // Left side
                [4.5, 2.5, -0.5, 1, 3, 5, 'base'],     // Right side
                [0, 2, -4.5, 7, 4, 1, 'dark'],           // Back
                [0, 4, -5.5, 3, 3, 2, 'base'],          // Bun
                [0, 5, -5, 1.5, 1.5, 1, 'light'],       // Bun highlight
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }

        default: {
            // Fallback: same as short.
            const blocks: VoxelBlock[] = [
                [0, 4.5, -0.5, 9, 1, 8, 'base'],
                [0, 3, 3, 5, 2, 1, 'base'],
                [-4.5, 2, 0, 1, 4, 6, 'dark'],
                [4.5, 2, 0, 1, 4, 6, 'dark'],
                [0, 2, -4.5, 8, 5, 1, 'dark'],
                [0, 5.2, 0.5, 3, 0.5, 3, 'light'],
            ];
            return <group>{renderVoxelBlocks(blocks, mat, matDark, matLight)}</group>;
        }
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
    const matBlk = <meshStandardMaterial color="#08283B" roughness={0.8} />;
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
                <group position={[0.48, 0.10, 0.26]}>
                    <mesh position={[0, 0.13, 0]}>
                        <boxGeometry args={[0.22, 0.10, 0.14]} />
                        <meshStandardMaterial color="#C96B3B" roughness={0.88} />
                    </mesh>
                    <mesh position={[0, 0.23, 0.10]}>
                        <boxGeometry args={[0.12, 0.10, 0.12]} />
                        <meshStandardMaterial color="#D77A4A" roughness={0.86} />
                    </mesh>
                    <mesh position={[0, 0.19, 0.18]}>
                        <boxGeometry args={[0.06, 0.04, 0.06]} />
                        <meshStandardMaterial color="#F2D7C6" roughness={0.9} />
                    </mesh>
                    <mesh position={[-0.04, 0.29, 0.09]} rotation={[0, 0, -0.3]}>
                        <boxGeometry args={[0.03, 0.06, 0.03]} />
                        <meshStandardMaterial color="#8C4A2A" roughness={0.88} />
                    </mesh>
                    <mesh position={[0.04, 0.29, 0.09]} rotation={[0, 0, 0.3]}>
                        <boxGeometry args={[0.03, 0.06, 0.03]} />
                        <meshStandardMaterial color="#8C4A2A" roughness={0.88} />
                    </mesh>
                    <mesh position={[-0.025, 0.23, 0.17]}>
                        <boxGeometry args={[0.015, 0.015, 0.01]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[0.025, 0.23, 0.17]}>
                        <boxGeometry args={[0.015, 0.015, 0.01]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[0, 0.20, -0.14]} rotation={[0.75, 0, 0]}>
                        <boxGeometry args={[0.025, 0.18, 0.025]} />
                        <meshStandardMaterial color="#8C4A2A" roughness={0.88} />
                    </mesh>
                    {[[-0.06, 0.04, 0.05], [0.06, 0.04, 0.05], [-0.06, 0.04, -0.04], [0.06, 0.04, -0.04]].map((pos, i) => (
                        <group key={`cat-leg-${i}`} position={pos as [number, number, number]}>
                            <mesh>
                                <boxGeometry args={[0.03, 0.08, 0.03]} />
                                <meshStandardMaterial color="#B45E32" roughness={0.9} />
                            </mesh>
                            <mesh position={[0, -0.035, 0]}>
                                <boxGeometry args={[0.04, 0.01, 0.04]} />
                                <meshStandardMaterial color="#F2D7C6" roughness={0.95} />
                            </mesh>
                        </group>
                    ))}
                </group>
            );
        case 'pet_dog':
            return (
                <group position={[-0.50, 0.10, 0.30]}>
                    <mesh position={[0, 0.13, 0]}>
                        <boxGeometry args={[0.24, 0.12, 0.16]} />
                        <meshStandardMaterial color="#B07145" roughness={0.86} />
                    </mesh>
                    <mesh position={[0, 0.23, 0.11]}>
                        <boxGeometry args={[0.13, 0.11, 0.12]} />
                        <meshStandardMaterial color="#C48153" roughness={0.84} />
                    </mesh>
                    <mesh position={[0, 0.19, 0.19]}>
                        <boxGeometry args={[0.07, 0.05, 0.08]} />
                        <meshStandardMaterial color="#F3E2C5" roughness={0.92} />
                    </mesh>
                    <mesh position={[0, 0.21, 0.24]}>
                        <boxGeometry args={[0.03, 0.03, 0.01]} />
                        {matBlk}
                    </mesh>
                    <mesh position={[-0.05, 0.27, 0.09]} rotation={[0, 0, -0.5]}>
                        <boxGeometry args={[0.04, 0.08, 0.03]} />
                        <meshStandardMaterial color="#5E3820" roughness={0.9} />
                    </mesh>
                    <mesh position={[0.05, 0.27, 0.09]} rotation={[0, 0, 0.5]}>
                        <boxGeometry args={[0.04, 0.08, 0.03]} />
                        <meshStandardMaterial color="#5E3820" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.19, -0.16]} rotation={[-0.75, 0, 0]}>
                        <boxGeometry args={[0.025, 0.16, 0.025]} />
                        <meshStandardMaterial color="#8B5A36" roughness={0.88} />
                    </mesh>
                    {[[-0.07, 0.04, 0.05], [0.07, 0.04, 0.05], [-0.07, 0.04, -0.04], [0.07, 0.04, -0.04]].map((pos, i) => (
                        <group key={`dog-leg-${i}`} position={pos as [number, number, number]}>
                            <mesh>
                                <boxGeometry args={[0.04, 0.08, 0.04]} />
                                <meshStandardMaterial color="#8B5A36" roughness={0.9} />
                            </mesh>
                            <mesh position={[0, -0.035, 0]}>
                                <boxGeometry args={[0.05, 0.01, 0.05]} />
                                <meshStandardMaterial color="#F3E2C5" roughness={0.95} />
                            </mesh>
                        </group>
                    ))}
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
                <group position={[-0.52, 0.10, 0.28]}>
                    <mesh position={[0, 0.14, 0]}>
                        <boxGeometry args={[0.22, 0.12, 0.16]} />
                        <meshStandardMaterial color="#8B949E" roughness={0.18} metalness={0.82} />
                    </mesh>
                    <mesh position={[0, 0.25, 0.04]}>
                        <boxGeometry args={[0.14, 0.10, 0.12]} />
                        <meshStandardMaterial color="#A6ADB7" roughness={0.18} metalness={0.84} />
                    </mesh>
                    <mesh position={[-0.03, 0.25, 0.11]}><boxGeometry args={[0.02, 0.02, 0.02]} />{matGlow}</mesh>
                    <mesh position={[0.03, 0.25, 0.11]}><boxGeometry args={[0.02, 0.02, 0.02]} />{matGlow}</mesh>
                    <mesh position={[0, 0.31, 0.04]}><boxGeometry args={[0.02, 0.08, 0.02]} />
                        <meshStandardMaterial color="#aaaaaa" roughness={0.1} metalness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.36, 0.04]}><boxGeometry args={[0.03, 0.03, 0.03]} />{matGlow}</mesh>
                    {[[-0.07, 0.05, 0.04], [0.07, 0.05, 0.04], [-0.07, 0.05, -0.04], [0.07, 0.05, -0.04]].map((pos, i) => (
                        <group key={`robo-leg-${i}`} position={pos as [number, number, number]}>
                            <mesh>
                                <boxGeometry args={[0.04, 0.10, 0.04]} />
                                <meshStandardMaterial color="#67707A" roughness={0.22} metalness={0.78} />
                            </mesh>
                            <mesh position={[0, -0.045, 0]}>
                                <boxGeometry args={[0.06, 0.02, 0.06]} />
                                <meshStandardMaterial color="#444C56" roughness={0.24} metalness={0.8} />
                            </mesh>
                        </group>
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
    const hairColor = config.hairColor ?? '#08283B';
    const shirtColor = config.shirtColor ?? '#D97848';
    const pantsColor = config.pantsColor ?? '#08283B';
    const shoeColor = config.shoeColor ?? '#08283B';

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
        const d = Math.min(delta, 0.1); // Cap delta to prevent animation spikes on tab-switch or frame drops

        if (headRef.current && bounceProgressRef.current > 0) {
            bounceProgressRef.current = Math.max(0, bounceProgressRef.current - d * 4);
            const p = bounceProgressRef.current;
            headRef.current.position.y = 2.0 + Math.sin((1 - p) * Math.PI * 3) * p * 0.1;
        }

        if (headRef.current) {
            const targetRotX = -state.pointer.y * 0.2;
            const targetRotY = state.pointer.x * 0.3;
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, d * 3);
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, d * 3);
        }

        if (torsoRef.current) {
            const breath = 1 + Math.sin(t * 0.9) * 0.01;
            torsoRef.current.scale.x = breath;
            torsoRef.current.scale.z = breath;
        }

        blinkTimerRef.current -= d;
        if (blinkTimerRef.current <= 0) {
            blinkTimerRef.current = 2.5 + Math.random() * 4;
            blinkProgressRef.current = 1;
        }
        if (eyeGroupRef.current && blinkProgressRef.current > 0) {
            blinkProgressRef.current = Math.max(0, blinkProgressRef.current - d * 12);
            const p = blinkProgressRef.current;
            eyeGroupRef.current.scale.y = Math.max(0.05, 1 - Math.sin((1 - p) * Math.PI));
        }

        if (leftArmRef.current && rightArmRef.current) {
            const pose = config.pose ?? 'idle';
            if (pose === 'wave') {
                const waveZ = -1.1 + Math.sin(t * 2) * 0.35;
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, waveZ, d * 8);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, d * 5);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, d * 5);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, d * 5);
            } else if (pose === 'dab') {
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.7, d * 5);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.3, d * 5);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 1.0, d * 5);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.4, d * 5);
            } else if (pose === 'peace') {
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.5, d * 5);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.5, d * 5);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, d * 5);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, d * 5);
            } else {
                const sway = Math.sin(t * 0.6) * 0.04;
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, sway, d * 2);
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -sway, d * 2);
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, d * 3);
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, d * 3);
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

    const emissive = (part: string) => hoveredPart === part && interactive ? '#D97848' : '#000000';
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
        <group position={[0, variant === 'head' ? -1.5 : -0.22, 0]}>

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
    const bgColor = useMemo(() => new THREE.Color('#FCF6EA'), []);

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
        <div className={`w-full h-full relative ${variant === 'head' ? '' : 'min-h-[300px]'}`} style={{ backgroundColor: variant === 'full' ? '#FCF6EA' : 'transparent' }}>
            <Canvas
                style={{ background: variant === 'full' ? '#FCF6EA' : 'transparent' }}
                className={variant === 'full' ? 'bg-[#FCF6EA]' : 'bg-transparent'}
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
                        const bg = new THREE.Color('#FCF6EA');
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
                <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#D97848" />
                <pointLight position={[0, -1, 2]} intensity={0.15} color="#fff0e0" />

                <AvatarModel
                    config={config}
                    variant={variant}
                    onPartClick={onPartClick}
                    interactive={interactive}
                />

                {variant === 'full' && (
                    <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[2.4, 2.4, 0.06]} />
                        <meshStandardMaterial color="#E7D8BD" roughness={0.9} metalness={0} polygonOffset polygonOffsetFactor={4} polygonOffsetUnits={4} />
                    </mesh>
                )}

                <ContactShadows
                    position={[0, -0.13, 0]}
                    opacity={0.3}
                    scale={2.2}
                    blur={2.5}
                    far={2}
                    frames={1}
                    color="#4A2518"
                />

                {variant === 'full' && (
                    <Sparkles
                        count={15}
                        scale={[4, 5, 4]}
                        size={2}
                        speed={0.3}
                        opacity={0.3}
                        color="#D97848"
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
