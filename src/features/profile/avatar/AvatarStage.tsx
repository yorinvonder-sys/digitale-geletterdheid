import React, { Suspense, memo, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '@/types';
import { getAvatarAssetParts, getAvatarPreloadPaths } from '@/config/avatarAssetCatalog';

interface AvatarStageProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

type AvatarAssetPart = ReturnType<typeof getAvatarAssetParts>[number];

const PART_TO_CLICK_TARGET: Record<string, string> = {
    baseModel: 'skin',
    hairStyle: 'hair',
    shirtStyle: 'shirt',
    pantsStyle: 'pants',
    accessory: 'accessory',
    pet: 'accessory',
};

const RESTING_THREE_QUARTER_YAW = 0.28;
const EXPRESSION_FACE_Z = 0.68;
const COOL_EXPRESSION_GLASSES_Y = 2.44;
const COOL_EXPRESSION_LENS_SCALE: [number, number, number] = [0.18, 0.07, 0.018];
const SUPPORTED_EXPRESSIONS = ['neutral', 'happy', 'cool', 'surprised'] as const;

export const preloadAvatarAssets = (config: AvatarConfig) => {
    for (const path of getAvatarPreloadPaths(config)) {
        useGLTF.preload(path);
    }
};

class AvatarStageErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

const getSlotColor = (slot: string, config: AvatarConfig) => {
    switch (slot) {
        case 'skin':
            return config.baseModel === 'robot' ? '#C0C0C0' : config.skinColor;
        case 'shirt':
            return config.shirtColor;
        case 'pants':
            return config.pantsColor;
        case 'hair':
            return config.hairColor ?? '#3D2314';
        case 'shoes':
            return config.shoeColor ?? '#08283B';
        case 'accessory':
        case 'accent':
            return config.accessoryColor ?? config.shirtColor ?? '#D7C95F';
        case 'glass':
            return config.eyeColor ?? '#9CE7FF';
        default:
            return undefined;
    }
};

const applyAvatarMaterials = (root: THREE.Object3D, config: AvatarConfig, hovered: boolean) => {
    root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const nextMaterials = materials.map((material) => {
            const nextMaterial = material.clone();
            const standard = nextMaterial as THREE.MeshStandardMaterial;
            const slot = nextMaterial.name?.startsWith('slot:') ? nextMaterial.name.replace('slot:', '') : '';
            const slotColor = getSlotColor(slot, config);
            if (slotColor && standard.color) standard.color = new THREE.Color(slotColor);
            if (hovered && standard.emissive) {
                standard.emissive = new THREE.Color('#D97848');
                standard.emissiveIntensity = 0.08;
            }
            return nextMaterial;
        });

        mesh.material = Array.isArray(mesh.material) ? nextMaterials : nextMaterials[0];
    });
};

const AssetPart = memo<{
    part: AvatarAssetPart;
    config: AvatarConfig;
    interactive: boolean;
    hoveredPart: string | null;
    onClickPart: (event: ThreeEvent<MouseEvent>, type: string) => void;
    onHoverPart: (event: ThreeEvent<PointerEvent>, type: string) => void;
    onLeavePart: () => void;
}>(({ part, config, interactive, hoveredPart, onClickPart, onHoverPart, onLeavePart }) => {
    const gltf = useGLTF(part.path);
    const clickTarget = PART_TO_CLICK_TARGET[part.type] ?? part.type;
    const hovered = hoveredPart === clickTarget;

    const scene = useMemo(() => {
        const clone = gltf.scene.clone(true);
        applyAvatarMaterials(clone, config, hovered);
        return clone;
    }, [config, gltf.scene, hovered]);

    if (part.type === 'hairStyle' && (config.accessory === 'cap' || config.accessory === 'beanie')) {
        scene.scale.y = config.accessory === 'beanie' ? 0.72 : 0.82;
        scene.position.y = config.accessory === 'beanie' ? -0.08 : -0.04;
    }

    return (
        <primitive
            object={scene}
            onClick={interactive ? (event: ThreeEvent<MouseEvent>) => onClickPart(event, part.type) : undefined}
            onPointerEnter={interactive ? (event: ThreeEvent<PointerEvent>) => onHoverPart(event, part.type) : undefined}
            onPointerLeave={interactive ? onLeavePart : undefined}
        />
    );
});

const FaceBox = ({
    position,
    scale,
    color,
    rotation = [0, 0, 0],
}: {
    position: [number, number, number];
    scale: [number, number, number];
    color: string;
    rotation?: [number, number, number];
}) => (
    <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
);

const ExpressionFeatures = memo<{ config: AvatarConfig }>(({ config }) => {
    const expression = SUPPORTED_EXPRESSIONS.includes((config.expression ?? 'happy') as typeof SUPPORTED_EXPRESSIONS[number])
        ? (config.expression ?? 'happy')
        : 'happy';
    const browColor = config.hairColor ?? '#3D2314';
    const mouthColor = config.baseModel === 'robot' ? (config.eyeColor ?? '#76E4FF') : '#D97848';

    if (expression === 'cool') {
        return (
            <group>
                <FaceBox position={[-0.18, COOL_EXPRESSION_GLASSES_Y, EXPRESSION_FACE_Z]} scale={COOL_EXPRESSION_LENS_SCALE} color="#08283B" rotation={[0, 0, -0.04]} />
                <FaceBox position={[0.18, COOL_EXPRESSION_GLASSES_Y, EXPRESSION_FACE_Z]} scale={COOL_EXPRESSION_LENS_SCALE} color="#08283B" rotation={[0, 0, 0.04]} />
                <FaceBox position={[0, COOL_EXPRESSION_GLASSES_Y, EXPRESSION_FACE_Z]} scale={[0.09, 0.02, 0.016]} color="#08283B" />
                <FaceBox position={[0, 2.23, EXPRESSION_FACE_Z]} scale={[0.15, 0.03, 0.018]} color={mouthColor} rotation={[0, 0, -0.1]} />
            </group>
        );
    }

    return (
        <group>
            <FaceBox
                position={[-0.18, expression === 'surprised' ? 2.66 : 2.61, EXPRESSION_FACE_Z]}
                scale={[0.19, 0.04, 0.018]}
                color={browColor}
                rotation={[0, 0, expression === 'surprised' ? 0.22 : -0.12]}
            />
            <FaceBox
                position={[0.18, expression === 'surprised' ? 2.66 : 2.61, EXPRESSION_FACE_Z]}
                scale={[0.19, 0.04, 0.018]}
                color={browColor}
                rotation={[0, 0, expression === 'surprised' ? -0.22 : 0.12]}
            />
            {expression === 'surprised' ? (
                <mesh position={[0, 2.25, EXPRESSION_FACE_Z]} scale={[1, 1.1, 0.32]}>
                    <torusGeometry args={[0.065, 0.018, 16, 36]} />
                    <meshStandardMaterial color={mouthColor} roughness={0.62} />
                </mesh>
            ) : expression === 'neutral' ? (
                <FaceBox position={[0, 2.24, EXPRESSION_FACE_Z]} scale={[0.18, 0.028, 0.018]} color={mouthColor} />
            ) : (
                <>
                    <FaceBox position={[-0.055, 2.235, EXPRESSION_FACE_Z]} scale={[0.12, 0.032, 0.018]} color={mouthColor} rotation={[0, 0, -0.18]} />
                    <FaceBox position={[0.055, 2.235, EXPRESSION_FACE_Z]} scale={[0.12, 0.032, 0.018]} color={mouthColor} rotation={[0, 0, 0.18]} />
                </>
            )}
        </group>
    );
});

const AvatarLoadingModel = () => (
    <group position={[0, 0.2, 0]}>
        <mesh position={[0, 1.7, 0]}>
            <capsuleGeometry args={[0.38, 1.0, 16, 24]} />
            <meshStandardMaterial color="#E7D8BD" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.55, 0]}>
            <sphereGeometry args={[0.45, 32, 16]} />
            <meshStandardMaterial color="#F5D0B0" roughness={0.9} />
        </mesh>
    </group>
);

type AvatarModelProps = AvatarStageProps & {
    onReady?: () => void;
};

const AvatarModel = memo<AvatarModelProps>(({ config, interactive = true, onPartClick, variant = 'full', onReady }) => {
    const rootRef = useRef<THREE.Group>(null);
    const [hoveredPart, setHoveredPart] = useState<string | null>(null);
    const parts = useMemo(() => getAvatarAssetParts(config), [config]);
    const partSignature = useMemo(() => parts.map(part => part.key).join('|'), [parts]);
    const readyFrameCountRef = useRef(0);
    const reportedReadySignatureRef = useRef('');

    useEffect(() => {
        preloadAvatarAssets(config);
    }, [config]);

    useEffect(() => {
        readyFrameCountRef.current = 0;
        reportedReadySignatureRef.current = '';
    }, [partSignature]);

    useEffect(() => () => {
        document.body.style.cursor = 'default';
    }, []);

    useFrame((state) => {
        if (!rootRef.current) return;
        const t = state.clock.getElapsedTime();
        rootRef.current.rotation.y = RESTING_THREE_QUARTER_YAW + Math.sin(t * 0.35) * 0.035;
        rootRef.current.position.y = Math.sin(t * 0.9) * 0.018;
        if (reportedReadySignatureRef.current !== partSignature) {
            readyFrameCountRef.current += 1;
            if (readyFrameCountRef.current >= 3) {
                reportedReadySignatureRef.current = partSignature;
                onReady?.();
            }
        }
    });

    const onClickPart = useCallback((event: ThreeEvent<MouseEvent>, type: string) => {
        if (!interactive || !onPartClick) return;
        event.stopPropagation();
        onPartClick(PART_TO_CLICK_TARGET[type] ?? type);
    }, [interactive, onPartClick]);

    const onHoverPart = useCallback((event: ThreeEvent<PointerEvent>, type: string) => {
        if (!interactive) return;
        event.stopPropagation();
        setHoveredPart(PART_TO_CLICK_TARGET[type] ?? type);
        document.body.style.cursor = 'pointer';
    }, [interactive]);

    const onLeavePart = useCallback(() => {
        if (!interactive) return;
        setHoveredPart(null);
        document.body.style.cursor = 'default';
    }, [interactive]);

    return (
        <group ref={rootRef} position={[0, variant === 'head' ? -1.45 : -0.45, 0]} scale={variant === 'head' ? 1.45 : 1}>
            {parts.map(part => (
                <AssetPart
                    key={part.key}
                    part={part}
                    config={config}
                    interactive={interactive}
                    hoveredPart={hoveredPart}
                    onClickPart={onClickPart}
                    onHoverPart={onHoverPart}
                    onLeavePart={onLeavePart}
                />
            ))}
            <ExpressionFeatures config={config} />
        </group>
    );
});

const normalizeConfig = (config: AvatarConfig): AvatarConfig => ({
    ...DEFAULT_AVATAR_CONFIG,
    ...config,
    shirtStyle: config.shirtStyle ?? DEFAULT_AVATAR_CONFIG.shirtStyle,
    pantsStyle: config.pantsStyle ?? 'standard',
    pet: config.pet ?? 'none',
    expression: config.expression ?? 'happy',
});

export const AvatarStage: React.FC<AvatarStageProps> = ({
    config,
    interactive = true,
    onPartClick,
    variant = 'full',
}) => {
    const avatarConfig = useMemo(() => normalizeConfig(config), [config]);
    const preloadSignature = useMemo(() => getAvatarPreloadPaths(avatarConfig).join('|'), [avatarConfig]);
    const [isReady, setIsReady] = useState(false);
    const cameraPosition = useMemo<[number, number, number]>(
        () => (variant === 'head' ? [0, 1.65, 3.25] : [0, 1.45, 5.6]),
        [variant]
    );
    const handleReady = useCallback(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        setIsReady(false);
        preloadAvatarAssets(avatarConfig);
    }, [preloadSignature]);

    return (
        <div
            className={`relative h-full w-full ${variant === 'head' ? '' : 'min-h-[300px]'}`}
            data-avatar-stage-ready={isReady ? 'true' : 'false'}
            data-avatar-expression-support={avatarConfig.expression ?? 'happy'}
            style={{ backgroundColor: variant === 'head' ? 'transparent' : '#FCF6EA' }}
        >
            <Canvas
                camera={{ position: cameraPosition, fov: 38 }}
                dpr={[1, 1.5]}
                shadows
                style={{ opacity: isReady ? 1 : 0 }}
                gl={{
                    alpha: variant === 'head',
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1,
                    outputColorSpace: THREE.SRGBColorSpace,
                    powerPreference: 'high-performance',
                }}
                onCreated={({ gl, scene }) => {
                    if (variant === 'head') {
                        gl.setClearColor('#000000', 0);
                        scene.background = null;
                    } else {
                        const bg = new THREE.Color('#FCF6EA');
                        gl.setClearColor(bg, 1);
                        scene.background = bg;
                    }
                }}
            >
                <ambientLight intensity={0.48} color="#fff8f0" />
                <hemisphereLight color="#f5e6d0" groundColor="#E7D8BD" intensity={0.6} />
                <directionalLight
                    position={[3.5, 6, 4]}
                    intensity={1.25}
                    color="#fff4e8"
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-near={0.1}
                    shadow-camera-far={18}
                    shadow-camera-left={-4}
                    shadow-camera-right={4}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-2}
                    shadow-bias={-0.0008}
                />
                <directionalLight position={[-3, 2, 2]} intensity={0.35} color="#D97848" />
                <AvatarStageErrorBoundary fallback={<AvatarLoadingModel />}>
                    <Suspense fallback={<AvatarLoadingModel />}>
                        <AvatarModel
                            config={avatarConfig}
                            interactive={interactive}
                            onPartClick={onPartClick}
                            variant={variant}
                            onReady={handleReady}
                        />
                    </Suspense>
                </AvatarStageErrorBoundary>
                {variant === 'full' && (
                    <>
                        <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <circleGeometry args={[1.55, 64]} />
                            <meshStandardMaterial color="#E7D8BD" roughness={0.9} />
                        </mesh>
                        <ContactShadows position={[0, -0.01, 0]} opacity={0.32} scale={3} blur={2.2} far={2.5} frames={1} color="#4A2518" />
                    </>
                )}
                <OrbitControls
                    enablePan={false}
                    enableZoom={variant === 'full'}
                    minDistance={3.4}
                    maxDistance={7}
                    minPolarAngle={Math.PI / 3.2}
                    maxPolarAngle={Math.PI / 1.55}
                    target={variant === 'head' ? [0, 2.28, 0] : [0, 1.45, 0]}
                />
            </Canvas>
        </div>
    );
};

export default AvatarStage;
