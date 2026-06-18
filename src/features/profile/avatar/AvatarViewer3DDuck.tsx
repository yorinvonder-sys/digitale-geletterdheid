import React, { useEffect, useMemo, useRef, memo, useState, useCallback } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarConfig } from '@/types';
import { AvatarScene } from './AvatarScene';
import {
    FaceLayer,
    HairLayer,
    ShirtOverlay,
    LegsSection,
    AccessoryLayer,
    getArmColor,
    getBodyDimensions,
    darkenColor,
    mcMat,
} from './AvatarViewer';

// --- DuckModel: mirrors AvatarModel, swaps geometry for a voxel duck ---

const DuckModel = memo<{
    config: AvatarConfig;
    variant: 'full' | 'head';
    onPartClick?: (part: string) => void;
    interactive: boolean;
}>(({ config, variant, onPartClick, interactive }) => {
    // --- Dimensions: duck-specific overrides, preserve headSize=0.8 for HairLayer alignment ---
    const dims = useMemo(() => ({
        ...getBodyDimensions(config.baseModel, config.gender),
        // Override with duck body proportions
        bodyWidth: 0.92,
        bodyHeight: 0.80,
        bodyDepth: 0.72,
        legWidth: 0.24,
        legHeight: 0.30,
        legSpacing: 0.14,
        armWidth: 0.18,
        // headSize intentionally NOT overridden — stays 0.8 from getBodyDimensions
    }), [config.baseModel, config.gender]);

    const skinColor = dims.isRobot ? '#C0C0C0' : (config.skinColor ?? '#e1ff01');
    const hairColor = config.hairColor ?? '#08283B';
    const shirtColor = config.shirtColor ?? '#D97848';
    const pantsColor = config.pantsColor ?? '#08283B';
    const shoeColor = config.shoeColor ?? '#F2A23C'; // duck feet default: orange

    // --- Refs (verbatim from AvatarModel) ---
    const headRef = useRef<THREE.Group>(null);
    const torsoRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const eyeGroupRef = useRef<THREE.Group>(null);

    const bounceProgressRef = useRef(0);
    const blinkTimerRef = useRef(2 + Math.random() * 3);
    const blinkProgressRef = useRef(0);

    const [hoveredPart, setHoveredPart] = useState<string | null>(null);

    // --- useEffect hooks (verbatim from AvatarModel) ---
    useEffect(() => { bounceProgressRef.current = 1; }, [config.expression]);

    useEffect(() => {
        blinkProgressRef.current = 0;
        blinkTimerRef.current = 2 + Math.random() * 3;
        if (eyeGroupRef.current) eyeGroupRef.current.scale.y = 1;
    }, [config.gender]);

    useEffect(() => {
        return () => { document.body.style.cursor = 'default'; };
    }, []);

    // --- useFrame (verbatim from AvatarModel) ---
    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();
        const d = Math.min(delta, 0.1);

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

    // --- Click/hover handlers (verbatim from AvatarModel) ---
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

    // Flatten crest under headwear (cap/beanie) — same logic as AvatarModel hair
    const hasHeadCover = config.accessory === 'cap' || config.accessory === 'beanie';
    const hairScale: [number, number, number] = hasHeadCover
        ? [1, config.accessory === 'beanie' ? 0.35 : 0.5, 1]
        : [1, 1, 1];
    const hairOffset: [number, number, number] = hasHeadCover
        ? [0, config.accessory === 'beanie' ? -0.10 : -0.06, 0]
        : [0, 0, 0];

    // Beak geometry constants
    const beakOrange = '#F2A23C';
    const beakLower = darkenColor(beakOrange, 0.88);
    const expression = config.expression ?? 'happy';
    // Lower bill drops on 'surprised'
    const lowerBillOffsetY = expression === 'surprised' ? -0.17 : -0.13;

    return (
        <group position={[0, variant === 'head' ? -1.5 : -0.22, 0]}>

            {/* Head – duck head cube with mouse-look */}
            <group ref={headRef} position={[0, 2.0, 0]}>
                <group
                    onClick={(e) => handleClick(e, 'skin')}
                    onPointerEnter={(e) => handlePointerEnter(e, 'skin')}
                    onPointerLeave={handlePointerLeave}
                >
                    {/* Duck head — slightly flatter than a cube (0.94 height) */}
                    <mesh>
                        <boxGeometry args={[dims.headSize, dims.headSize * 0.94, dims.headSize]} />
                        <meshStandardMaterial
                            {...skinMatProps}
                            emissive={emissive('skin')}
                            emissiveIntensity={emissiveInt('skin')}
                            polygonOffset
                            polygonOffsetFactor={2}
                            polygonOffsetUnits={2}
                        />
                    </mesh>

                    {/* Eyes / blink — reuse FaceLayer verbatim */}
                    <FaceLayer
                        config={config}
                        skinColor={skinColor}
                        isRobot={dims.isRobot}
                        eyeGroupRef={eyeGroupRef as React.RefObject<THREE.Group>}
                    />

                    {/* Beak — upper bill */}
                    <mesh position={[0, -0.04, 0.46]}>
                        <boxGeometry args={[0.42, 0.10, 0.34]} />
                        <meshStandardMaterial color={beakOrange} roughness={0.6} />
                    </mesh>

                    {/* Beak — lower bill (drops on 'surprised') */}
                    <mesh position={[0, lowerBillOffsetY, 0.44]}>
                        <boxGeometry args={[0.40, 0.07, 0.30]} />
                        <meshStandardMaterial color={beakLower} roughness={0.65} />
                    </mesh>
                </group>

                {/* Crest — HairLayer verbatim (maps to hairstyle wardrobe) */}
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
                    {/* Short neck */}
                    <mesh position={[0, 1.56, 0]}>
                        <boxGeometry args={[0.26, 0.14, 0.30]} />
                        <meshStandardMaterial {...skinMatProps} />
                    </mesh>

                    {/* Torso — duck body: wider, deeper, shorter than human */}
                    <group ref={torsoRef}>
                        <group
                            position={[0, 1.1, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            {/* Feather body base in skinColor */}
                            <mesh>
                                <boxGeometry args={[dims.bodyWidth, dims.bodyHeight, dims.bodyDepth]} />
                                <meshStandardMaterial
                                    {...skinMatProps}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                    polygonOffset
                                    polygonOffsetFactor={2}
                                    polygonOffsetUnits={2}
                                />
                            </mesh>

                            {/* Bib/vest in shirtColor — sits just in front of body */}
                            <mesh position={[0, 0.02, dims.bodyDepth / 2 + 0.01]}>
                                <boxGeometry args={[dims.bodyWidth * 0.72, dims.bodyHeight * 0.82, 0.02]} />
                                <meshStandardMaterial
                                    color={shirtColor}
                                    roughness={config.shirtStyle === 'leather' ? 0.3 : 0.85}
                                    metalness={config.shirtStyle === 'leather' ? 0.1 : 0}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>

                            {/* ShirtOverlay on top of bib */}
                            <ShirtOverlay
                                style={config.shirtStyle ?? 't-shirt'}
                                color={shirtColor}
                                bodyWidth={dims.bodyWidth}
                                bodyDepth={dims.bodyDepth}
                            />
                        </group>
                    </group>

                    {/* Wings as arms — same anchor formula as human arms so cape/backpack/wings accessories align */}
                    {/* Left wing */}
                    <group ref={leftArmRef} position={[-(dims.bodyWidth / 2 + dims.armWidth / 2 - 0.01), 1.35, 0]}>
                        <group
                            position={[0, -0.25, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            {/* Wing paddle — thin, wide, slightly elongated in z */}
                            <mesh>
                                <boxGeometry args={[0.16, 0.55, 0.55]} />
                                <meshStandardMaterial
                                    color={armColor}
                                    roughness={0.85}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            {/* Stepped feather tip */}
                            <mesh position={[0, -0.32, 0.06]}>
                                <boxGeometry args={[0.12, 0.06, 0.28]} />
                                <meshStandardMaterial color={darkenColor(armColor, 0.88)} roughness={0.85} />
                            </mesh>
                        </group>
                    </group>

                    {/* Right wing */}
                    <group ref={rightArmRef} position={[(dims.bodyWidth / 2 + dims.armWidth / 2 - 0.01), 1.35, 0]}>
                        <group
                            position={[0, -0.25, 0]}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        >
                            <mesh>
                                <boxGeometry args={[0.16, 0.55, 0.55]} />
                                <meshStandardMaterial
                                    color={armColor}
                                    roughness={0.85}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>
                            <mesh position={[0, -0.32, 0.06]}>
                                <boxGeometry args={[0.12, 0.06, 0.28]} />
                                <meshStandardMaterial color={darkenColor(armColor, 0.88)} roughness={0.85} />
                            </mesh>
                        </group>
                    </group>

                    {/* Legs + webbed feet */}
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
                        footShape="web"
                    />

                    {/* Tail — stepped blocks behind the body, angled up */}
                    <group position={[0, 1.0, -0.42]}>
                        <mesh position={[0, 0.08, -0.06]} rotation={[-0.38, 0, 0]}>
                            <boxGeometry args={[0.28, 0.14, 0.22]} />
                            <meshStandardMaterial color={darkenColor(skinColor, 0.92)} roughness={0.88} />
                        </mesh>
                        <mesh position={[0, 0.18, -0.12]} rotation={[-0.62, 0, 0]}>
                            <boxGeometry args={[0.18, 0.10, 0.16]} />
                            <meshStandardMaterial color={darkenColor(skinColor, 0.85)} roughness={0.88} />
                        </mesh>
                    </group>

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

// --- Main exported component ---

export const AvatarViewer3DDuck: React.FC<{
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}> = ({ config, interactive = true, onPartClick, variant = 'full' }) => {
    return (
        <AvatarScene variant={variant}>
            <DuckModel
                config={config}
                variant={variant}
                onPartClick={onPartClick}
                interactive={interactive}
            />
        </AvatarScene>
    );
};

export default AvatarViewer3DDuck;
