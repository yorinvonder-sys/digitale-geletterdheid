import React, { Suspense, useEffect, useMemo, memo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- Error boundary (scene-only) ---

class ThreeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? null : this.props.children; }
}

// --- Background sync ---

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

// --- Demand-frameloop invalidation driver ---
// Calls invalidate() each rAF while the canvas is visible (intersection) AND
// the document tab is in the foreground. Costs 0 GPU when off-screen or tabbed away.

const InvalidateWhileVisible: React.FC = () => {
    const { gl } = useThree();
    const rafRef = useRef<number | null>(null);
    const visibleRef = useRef(true);

    useEffect(() => {
        const canvas = gl.domElement;

        // Intersection observer: only drive rAF while canvas is in the viewport
        const observer = new IntersectionObserver(
            ([entry]) => { visibleRef.current = entry.isIntersecting; },
            { threshold: 0.01 }
        );
        observer.observe(canvas);

        const loop = () => {
            if (visibleRef.current && document.visibilityState === 'visible') {
                invalidate();
            }
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        return () => {
            observer.disconnect();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [gl]);

    return null;
};

// --- Reusable scene shell ---

export const AvatarScene: React.FC<{ variant?: 'full' | 'head'; children: React.ReactNode }> = ({ variant = 'full', children }) => {
    const cameraPos = useMemo<[number, number, number]>(
        () => (variant === 'head' ? [0, 0.5, 2.1] : [0, 0.85, 5.8]),
        [variant]
    );

    return (
        <div className={`w-full h-full relative ${variant === 'head' ? '' : 'min-h-[300px]'}`} style={{ backgroundColor: variant === 'full' ? '#FCF6EA' : 'transparent' }}>
            <Canvas
                style={{ background: variant === 'full' ? '#FCF6EA' : 'transparent' }}
                className={variant === 'full' ? 'bg-[#FCF6EA]' : 'bg-transparent'}
                shadows={false}
                frameloop="demand"
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
                <InvalidateWhileVisible />
                <SceneSurface variant={variant} />

                {/* 3 lights instead of 5: removed fill directionalLight (#D97848) and pointLight.
                    Bumped ambient and hemisphere to compensate for lost Environment preset + fill. */}
                <ambientLight intensity={0.6} color="#fff8f0" />
                <hemisphereLight color="#f5e6d0" groundColor="#f0ebe0" intensity={0.75} />
                <directionalLight
                    position={[4, 8, 4]}
                    intensity={1.5}
                    color="#fff5ee"
                />

                {children}

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
