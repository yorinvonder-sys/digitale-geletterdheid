import React, { Suspense, useEffect, useMemo, useRef, memo, useState, useCallback } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarConfig } from '../types';

// --- Types ---

interface AvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

interface BlockProps {
    args: [number, number, number];
    position: [number, number, number];
    rotation?: [number, number, number];
    color: string;
    onClick?: (e: ThreeEvent<MouseEvent>) => void;
    onPointerEnter?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerLeave?: (e: ThreeEvent<PointerEvent>) => void;
    radius?: number;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    emissiveIntensity?: number;
    children?: React.ReactNode;
}

// Static geometry args defined outside components for referential stability
const SHOE_ARGS: [number, number, number] = [0.45, 0.2, 0.6];
const EYE_GEOM_ARGS: [number, number, number] = [0.15, 0.15, 0.02];
const MOUTH_HAPPY_ARGS: [number, number, number] = [0.4, 0.1, 0.02];
const MOUTH_SURPRISED_ARGS: [number, number, number] = [0.15, 0.15, 0.02];
const MOUTH_NEUTRAL_ARGS: [number, number, number] = [0.3, 0.05, 0.02];
const GLASSES_ARGS: [number, number, number] = [0.8, 0.2, 0.02];

// --- Helpers ---

const getBodyDimensions = (baseModel: AvatarConfig['baseModel'], gender?: AvatarConfig['gender']) => {
    const isSlim = baseModel === 'slim';
    const isRobot = baseModel === 'robot';
    const isFemale = gender === 'female';
    return {
        headSize: [1, 1, 1] as [number, number, number],
        torsoSize: isFemale ? [0.8, 1.2, 0.48] as [number, number, number] : [1, 1.2, 0.5] as [number, number, number],
        armSize: isFemale
            ? [0.25, 1.2, 0.28] as [number, number, number]
            : [isSlim ? 0.25 : 0.35, 1.2, 0.35] as [number, number, number],
        legSize: [0.4, 1.2, 0.4] as [number, number, number],
        armSpacing: isFemale ? 0.55 : 0.7,
        isRobot,
    };
};

// --- Error Boundary for Three.js children ---
class ThreeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? null : this.props.children; }
}

// --- Sub-components ---

const BodyBlock = memo<BlockProps>(({
    args, position, rotation = [0, 0, 0], color, onClick, onPointerEnter, onPointerLeave,
    radius = 0.05, metalness = 0, roughness = 0.65,
    emissive = '#000000', emissiveIntensity = 0, children,
}) => (
    <group
        position={position}
        rotation={rotation}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
    >
        <RoundedBox args={args} radius={radius} smoothness={4}>
            <meshStandardMaterial
                color={color}
                metalness={metalness}
                roughness={roughness}
                envMapIntensity={0.6}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
            />
        </RoundedBox>
        {children}
    </group>
));

// Eye group ref passed in so AvatarModel can animate blinking without prop drilling state
const FaceLayer = memo<{
    config: AvatarConfig;
    skinColor: string;
    isRobot: boolean;
    eyeGroupRef: React.RefObject<THREE.Group>;
}>(({ config, eyeGroupRef }) => {
    const expression = config.expression ?? 'happy';
    const eyeColor = config.eyeColor ?? '#111111';
    const eyeY = 0.1;
    const eyeZ = 0.51;

    return (
        <group>
            {/* Eye group – scale.y animated for blinking via eyeGroupRef */}
            <group ref={eyeGroupRef}>
                <mesh position={[-0.25, eyeY, eyeZ]}>
                    <boxGeometry args={EYE_GEOM_ARGS} />
                    {/* clearcoat simulates moist cornea highlight */}
                    <meshPhysicalMaterial color={eyeColor} roughness={0.05} metalness={0.1}
                        clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1} />
                </mesh>
                <mesh position={[0.25, eyeY, eyeZ]}>
                    <boxGeometry args={EYE_GEOM_ARGS} />
                    <meshPhysicalMaterial color={eyeColor} roughness={0.05} metalness={0.1}
                        clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1} />
                </mesh>
            </group>

            {/* Sunglasses overlay for cool expression */}
            {expression === 'cool' && (
                <mesh position={[0, eyeY, eyeZ + 0.01]}>
                    <boxGeometry args={GLASSES_ARGS} />
                    <meshPhysicalMaterial color="#111" metalness={0.95} roughness={0.05}
                        reflectivity={1} clearcoat={0.8} clearcoatRoughness={0.05} envMapIntensity={1.5} />
                </mesh>
            )}
            {expression === 'happy' && (
                <mesh position={[0, -0.2, eyeZ]}>
                    <boxGeometry args={MOUTH_HAPPY_ARGS} />
                    <meshStandardMaterial color="#7c3b2a" roughness={0.9} />
                </mesh>
            )}
            {expression === 'surprised' && (
                <mesh position={[0, -0.2, eyeZ]}>
                    <boxGeometry args={MOUTH_SURPRISED_ARGS} />
                    <meshStandardMaterial color="#7c3b2a" roughness={0.9} />
                </mesh>
            )}
            {expression === 'neutral' && (
                <mesh position={[0, -0.2, eyeZ]}>
                    <boxGeometry args={MOUTH_NEUTRAL_ARGS} />
                    <meshStandardMaterial color="#7c3b2a" roughness={0.9} />
                </mesh>
            )}
        </group>
    );
});

const HairLayer = memo<{ style: string; color: string }>(({ style, color }) => {
    const mat = (
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.03} envMapIntensity={0.3} />
    );
    switch (style) {
        case 'short':
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh position={[0, 0.1, 0]}><boxGeometry args={[1.05, 0.2, 1.05]} />{mat}</mesh>
                </group>
            );
        case 'spiky':
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh position={[0, 0.1, 0]}><boxGeometry args={[1.05, 0.2, 1.05]} />{mat}</mesh>
                    <mesh position={[-0.3, 0.25, 0.3]}><boxGeometry args={[0.2, 0.2, 0.2]} />{mat}</mesh>
                    <mesh position={[0.3, 0.25, -0.3]}><boxGeometry args={[0.2, 0.2, 0.2]} />{mat}</mesh>
                    <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.2, 0.2, 0.2]} />{mat}</mesh>
                </group>
            );
        case 'long':
            return (
                <group position={[0, 0.1, 0]}>
                    <mesh position={[0, 0.4, 0]}><boxGeometry args={[1.05, 0.2, 1.05]} />{mat}</mesh>
                    <mesh position={[0, 0, -0.45]}><boxGeometry args={[1.05, 1, 0.2]} />{mat}</mesh>
                    <mesh position={[-0.45, 0, 0]}><boxGeometry args={[0.2, 1, 1.05]} />{mat}</mesh>
                    <mesh position={[0.45, 0, 0]}><boxGeometry args={[0.2, 1, 1.05]} />{mat}</mesh>
                </group>
            );
        case 'ponytail':
            return (
                <group position={[0, 0.1, 0]}>
                    {/* Hair cap */}
                    <mesh position={[0, 0.4, 0]}><boxGeometry args={[1.05, 0.2, 1.05]} />{mat}</mesh>
                    {/* Ponytail band */}
                    <mesh position={[0, 0.18, -0.52]}><boxGeometry args={[0.42, 0.14, 0.12]} />{mat}</mesh>
                    {/* Tail upper */}
                    <mesh position={[0, 0.0, -0.58]}><boxGeometry args={[0.32, 0.4, 0.18]} />{mat}</mesh>
                    {/* Tail lower */}
                    <mesh position={[0, -0.3, -0.54]}><boxGeometry args={[0.25, 0.28, 0.2]} />{mat}</mesh>
                </group>
            );
        default:
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh position={[0, 0.1, 0]}><boxGeometry args={[1.05, 0.2, 1.05]} />{mat}</mesh>
                </group>
            );
    }
});

// --- AvatarModel: all animation logic lives here ---

const AvatarModel = memo<{
    config: AvatarConfig;
    variant: 'full' | 'head';
    onPartClick?: (part: string) => void;
    interactive: boolean;
}>(({ config, variant, onPartClick, interactive }) => {
    const { headSize, torsoSize, armSize, legSize, armSpacing, isRobot } = useMemo(
        () => getBodyDimensions(config.baseModel, config.gender),
        [config.baseModel, config.gender]
    );

    const skinColor = isRobot ? '#C0C0C0' : config.skinColor;
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
            headRef.current.position.y = 2.2 + Math.sin((1 - p) * Math.PI * 3) * p * 0.1;
        }

        // 2. Mouse look – head gently rotates toward screen cursor
        if (headRef.current) {
            const targetRotX = -state.pointer.y * 0.25; // tilt up/down
            const targetRotY = state.pointer.x * 0.35;  // turn left/right
            headRef.current.rotation.x = THREE.MathUtils.lerp(
                headRef.current.rotation.x, targetRotX, delta * 3
            );
            headRef.current.rotation.y = THREE.MathUtils.lerp(
                headRef.current.rotation.y, targetRotY, delta * 3
            );
        }

        // 3. Breathing – subtle torso scale on X and Z axes (chest expansion)
        if (torsoRef.current) {
            const breath = 1 + Math.sin(t * 0.9) * 0.012;
            torsoRef.current.scale.x = breath;
            torsoRef.current.scale.z = breath;
        }

        // 4. Blinking – periodic eye close/open using sine curve
        blinkTimerRef.current -= delta;
        if (blinkTimerRef.current <= 0) {
            blinkTimerRef.current = 2.5 + Math.random() * 4; // next blink in 2.5–6.5 s
            blinkProgressRef.current = 1;
        }
        if (eyeGroupRef.current && blinkProgressRef.current > 0) {
            blinkProgressRef.current = Math.max(0, blinkProgressRef.current - delta * 12);
            const p = blinkProgressRef.current;
            // sin curve: scale=1 at p=1 and p=0, scale=0 at p=0.5
            eyeGroupRef.current.scale.y = Math.max(0.05, 1 - Math.sin((1 - p) * Math.PI));
        }

        // 5. Arm pose animations – arms pivot around shoulder origin
        if (leftArmRef.current && rightArmRef.current) {
            const pose = config.pose ?? 'idle';

            if (pose === 'wave') {
                // Right arm raises and oscillates – left arm hangs
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
                // Right arm diagonal up, left arm sweeps across body
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
                // Both arms slightly raised outward
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
                // Idle – very gentle arm sway
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

    return (
        <group position={[0, variant === 'head' ? -1.5 : -0.85, 0]}>

            {/* ── Head – mouse-look rotation + bounce ── */}
            <group ref={headRef} position={[0, 2.2, 0]}>
                <BodyBlock
                    args={headSize}
                    position={[0, 0, 0]}
                    color={skinColor}
                    metalness={isRobot ? 0.85 : 0}
                    roughness={isRobot ? 0.15 : 0.75}
                    emissive={emissive('skin')}
                    emissiveIntensity={emissiveInt('skin')}
                    onClick={(e) => handleClick(e, 'skin')}
                    onPointerEnter={(e) => handlePointerEnter(e, 'skin')}
                    onPointerLeave={handlePointerLeave}
                >
                    <FaceLayer
                        config={config}
                        skinColor={skinColor}
                        isRobot={isRobot}
                        eyeGroupRef={eyeGroupRef as React.RefObject<THREE.Group>}
                    />
                    <group
                        onClick={(e) => handleClick(e, 'hair')}
                        onPointerEnter={(e) => handlePointerEnter(e, 'hair')}
                        onPointerLeave={handlePointerLeave}
                    >
                        <HairLayer style={config.hairStyle} color={hairColor} />
                    </group>
                </BodyBlock>
            </group>

            {variant === 'full' && (
                <group>
                    {/* ── Torso – breathing scale on X/Z ── */}
                    <group ref={torsoRef}>
                        <BodyBlock
                            args={torsoSize}
                            position={[0, 1.1, 0]}
                            color={shirtColor}
                            roughness={0.72}
                            emissive={emissive('shirt')}
                            emissiveIntensity={emissiveInt('shirt')}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        />
                    </group>

                    {/* ── Left arm – pivot at shoulder so rotation is anatomically correct ── */}
                    <group ref={leftArmRef} position={[-armSpacing, 1.7, 0]}>
                        <BodyBlock
                            args={armSize}
                            position={[0, -0.6, 0]}
                            color={config.gender === 'female' ? skinColor : shirtColor}
                            roughness={config.gender === 'female' ? 0.75 : 0.72}
                            emissive={emissive('shirt')}
                            emissiveIntensity={emissiveInt('shirt')}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        />
                    </group>

                    {/* ── Right arm – pivot at shoulder ── */}
                    <group ref={rightArmRef} position={[armSpacing, 1.7, 0]}>
                        <BodyBlock
                            args={armSize}
                            position={[0, -0.6, 0]}
                            color={config.gender === 'female' ? skinColor : shirtColor}
                            roughness={config.gender === 'female' ? 0.75 : 0.72}
                            emissive={emissive('shirt')}
                            emissiveIntensity={emissiveInt('shirt')}
                            onClick={(e) => handleClick(e, 'shirt')}
                            onPointerEnter={(e) => handlePointerEnter(e, 'shirt')}
                            onPointerLeave={handlePointerLeave}
                        />
                    </group>

                    {/* ── Left leg + shoe ── */}
                    <group
                        position={[-0.3, -0.1, 0]}
                        onClick={(e) => handleClick(e, 'pants')}
                        onPointerEnter={(e) => handlePointerEnter(e, 'pants')}
                        onPointerLeave={handlePointerLeave}
                    >
                        <BodyBlock
                            args={legSize}
                            position={[0, 0.6, 0]}
                            color={pantsColor}
                            roughness={0.75}
                            emissive={emissive('pants')}
                            emissiveIntensity={emissiveInt('pants')}
                        />
                        <BodyBlock
                            args={SHOE_ARGS}
                            position={[0, -0.1, 0.1]}
                            color={shoeColor}
                            roughness={0.45}
                            metalness={0.1}
                        />
                    </group>

                    {/* ── Right leg + shoe ── */}
                    <group
                        position={[0.3, -0.1, 0]}
                        onClick={(e) => handleClick(e, 'pants')}
                        onPointerEnter={(e) => handlePointerEnter(e, 'pants')}
                        onPointerLeave={handlePointerLeave}
                    >
                        <BodyBlock
                            args={legSize}
                            position={[0, 0.6, 0]}
                            color={pantsColor}
                            roughness={0.75}
                            emissive={emissive('pants')}
                            emissiveIntensity={emissiveInt('pants')}
                        />
                        <BodyBlock
                            args={SHOE_ARGS}
                            position={[0, -0.1, 0.1]}
                            color={shoeColor}
                            roughness={0.45}
                            metalness={0.1}
                        />
                    </group>
                </group>
            )}
        </group>
    );
});

// --- Main Component ---

export const AvatarViewer: React.FC<AvatarViewerProps> = ({
    config, interactive = true, onPartClick, variant = 'full',
}) => {
    const cameraPos = useMemo<[number, number, number]>(
        () => (variant === 'head' ? [0, 0.7, 1.9] : [0, 0.5, 7.5]),
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
                dpr={[1, 2]}
                camera={{ position: cameraPos, fov: 45 }}
            >
                {/* Soft fill – prevents pitch-black shadows */}
                <ambientLight intensity={0.25} />
                {/* Sky-to-ground gradient */}
                <hemisphereLight color="#b1e1ff" groundColor="#232136" intensity={0.55} />
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

                <Suspense fallback={null}>
                    <ThreeErrorBoundary>
                        {/* IBL: city RGBE panorama drives PBR reflections */}
                        <Environment preset="city" />
                    </ThreeErrorBoundary>

                    {/* Float gives overall gentle body bob and micro-rotation */}
                    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.15}>
                        <AvatarModel
                            config={config}
                            variant={variant}
                            onPartClick={onPartClick}
                            interactive={interactive}
                        />
                    </Float>

                    <ContactShadows
                        position={[0, -1.17, 0]}
                        opacity={0.5}
                        scale={8}
                        blur={2.5}
                        far={5}
                        color="#000020"
                    />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={variant === 'full'}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    target={variant === 'head' ? [0, 0.7, 0] : [0, 0.1, 0]}
                />
            </Canvas>
        </div>
    );
};

export default AvatarViewer;
