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
        // Override with duck body proportions — plumper and wider
        bodyWidth: 1.0,
        bodyHeight: 0.80,
        bodyDepth: 0.82,
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

    // Bill geometry constants — bold, protruding, clearly duck
    const beakOrange = '#F2A23C';
    const beakLower = darkenColor(beakOrange, 0.84);
    const beakNostril = darkenColor(beakOrange, 0.55);
    const expression = config.expression ?? 'happy';
    // Lower bill drops on 'surprised'
    const lowerBillOffsetY = expression === 'surprised' ? -0.22 : -0.13;

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

                    {/* Eyes / blink — FaceLayer with species=duck to suppress human face features */}
                    <FaceLayer
                        config={config}
                        skinColor={skinColor}
                        isRobot={dims.isRobot}
                        eyeGroupRef={eyeGroupRef as React.RefObject<THREE.Group>}
                        species="duck"
                    />

                    {/* Bold duck bill — protrudes well forward; bill top at y≈+0.06 so eyes remain above */}
                    {/* Upper bill */}
                    <mesh position={[0, 0.00, 0.65]}>
                        <boxGeometry args={[0.50, 0.12, 0.48]} />
                        <meshStandardMaterial color={beakOrange} roughness={0.55} />
                    </mesh>
                    {/* Lower bill (drops more on 'surprised') */}
                    <mesh position={[0, lowerBillOffsetY, 0.62]}>
                        <boxGeometry args={[0.46, 0.08, 0.42]} />
                        <meshStandardMaterial color={beakLower} roughness={0.60} />
                    </mesh>
                    {/* Nostrils — 2 tiny dark boxes on top of upper bill near base */}
                    <mesh position={[-0.09, 0.07, 0.47]}>
                        <boxGeometry args={[0.06, 0.03, 0.06]} />
                        <meshStandardMaterial color={beakNostril} roughness={0.7} />
                    </mesh>
                    <mesh position={[0.09, 0.07, 0.47]}>
                        <boxGeometry args={[0.06, 0.03, 0.06]} />
                        <meshStandardMaterial color={beakNostril} roughness={0.7} />
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

                            {/* Rounded belly — skinColor blob bulging at lower front for chubby duck look */}
                            <mesh position={[0, -0.08, dims.bodyDepth / 2 + 0.02]}>
                                <boxGeometry args={[dims.bodyWidth * 0.7, 0.42, 0.18]} />
                                <meshStandardMaterial {...skinMatProps} />
                            </mesh>

                            {/* Shirt front — wide enough to read as clothing, not a stark bib */}
                            <mesh position={[0, 0.04, dims.bodyDepth / 2 + 0.01]}>
                                <boxGeometry args={[dims.bodyWidth * 0.82, dims.bodyHeight * 0.92, 0.04]} />
                                <meshStandardMaterial
                                    color={shirtColor}
                                    roughness={config.shirtStyle === 'leather' ? 0.3 : 0.85}
                                    metalness={config.shirtStyle === 'leather' ? 0.1 : 0}
                                    emissive={emissive('shirt')}
                                    emissiveIntensity={emissiveInt('shirt')}
                                />
                            </mesh>

                            {/* ShirtOverlay on top of shirt front */}
                            <ShirtOverlay
                                style={config.shirtStyle ?? 't-shirt'}
                                color={shirtColor}
                                bodyWidth={dims.bodyWidth}
                                bodyDepth={dims.bodyDepth}
                            />
                        </group>
                    </group>

                    {/* Wings — longer, flatter paddles hugging body sides, swept slightly down/back */}
                    {/* Left wing */}
                    <group ref={leftArmRef} position={[-(dims.bodyWidth / 2 + dims.armWidth / 2 - 0.01), 1.35, 0]}>
                        {/* Slight outward base tilt so wing reads as a swept paddle, not an arm */}
                        <group rotation={[0, 0, 0.15]}>
                            <group
                                position={[0, -0.25, 0]}
                                onClick={(e) => handleClick(e, 'shirt')}
                                onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                                onPointerLeave={handlePointerLeave}
                            >
                                {/* Main wing paddle — thin, longer, deeper in Z to hug body side */}
                                <mesh>
                                    <boxGeometry args={[0.12, 0.62, 0.42]} />
                                    <meshStandardMaterial
                                        color={armColor}
                                        roughness={0.85}
                                        emissive={emissive('shirt')}
                                        emissiveIntensity={emissiveInt('shirt')}
                                    />
                                </mesh>
                                {/* Stepped feather tip 1 */}
                                <mesh position={[0, -0.37, 0.05]}>
                                    <boxGeometry args={[0.10, 0.08, 0.30]} />
                                    <meshStandardMaterial color={darkenColor(armColor, 0.88)} roughness={0.85} />
                                </mesh>
                                {/* Stepped feather tip 2 */}
                                <mesh position={[0, -0.46, 0.08]}>
                                    <boxGeometry args={[0.08, 0.06, 0.22]} />
                                    <meshStandardMaterial color={darkenColor(armColor, 0.82)} roughness={0.85} />
                                </mesh>
                            </group>
                        </group>
                    </group>

                    {/* Right wing */}
                    <group ref={rightArmRef} position={[(dims.bodyWidth / 2 + dims.armWidth / 2 - 0.01), 1.35, 0]}>
                        <group rotation={[0, 0, -0.15]}>
                            <group
                                position={[0, -0.25, 0]}
                                onClick={(e) => handleClick(e, 'shirt')}
                                onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                                onPointerLeave={handlePointerLeave}
                            >
                                <mesh>
                                    <boxGeometry args={[0.12, 0.62, 0.42]} />
                                    <meshStandardMaterial
                                        color={armColor}
                                        roughness={0.85}
                                        emissive={emissive('shirt')}
                                        emissiveIntensity={emissiveInt('shirt')}
                                    />
                                </mesh>
                                <mesh position={[0, -0.37, 0.05]}>
                                    <boxGeometry args={[0.10, 0.08, 0.30]} />
                                    <meshStandardMaterial color={darkenColor(armColor, 0.88)} roughness={0.85} />
                                </mesh>
                                <mesh position={[0, -0.46, 0.08]}>
                                    <boxGeometry args={[0.08, 0.06, 0.22]} />
                                    <meshStandardMaterial color={darkenColor(armColor, 0.82)} roughness={0.85} />
                                </mesh>
                            </group>
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

                    {/* Tail — stepped blocks behind the body, clearly angled upward */}
                    <group position={[0, 1.0, -0.42]}>
                        {/* Base tail block — wide and low, attached to back */}
                        <mesh position={[0, 0.06, -0.06]} rotation={[-0.42, 0, 0]}>
                            <boxGeometry args={[0.38, 0.18, 0.28]} />
                            <meshStandardMaterial color={darkenColor(skinColor, 0.90)} roughness={0.88} />
                        </mesh>
                        {/* Mid tail block — narrower, more upward tilt */}
                        <mesh position={[0, 0.22, -0.14]} rotation={[-0.70, 0, 0]}>
                            <boxGeometry args={[0.26, 0.14, 0.22]} />
                            <meshStandardMaterial color={darkenColor(skinColor, 0.84)} roughness={0.88} />
                        </mesh>
                        {/* Tip tail block — small, most upward */}
                        <mesh position={[0, 0.36, -0.20]} rotation={[-1.0, 0, 0]}>
                            <boxGeometry args={[0.16, 0.10, 0.14]} />
                            <meshStandardMaterial color={darkenColor(skinColor, 0.78)} roughness={0.88} />
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
