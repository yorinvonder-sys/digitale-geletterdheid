import React, { useEffect, useMemo, memo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import { RotateCw } from 'lucide-react';
import * as THREE from 'three';

/** Zowel de OS-voorkeur als de in-app toegankelijkheidsschakelaar, die zijn
 *  stand als class op <html> zet. Bewust géén useAccessibility(): de avatar
 *  wordt ook gerenderd buiten die provider (dev-route). */
const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return (
        document.documentElement.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
};

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

export const AvatarScene: React.FC<{
    variant?: 'full' | 'head';
    interactive?: boolean;
    children: React.ReactNode;
}> = ({ variant = 'full', interactive = true, children }) => {
    const cameraPos = useMemo<[number, number, number]>(
        () => (variant === 'head' ? [0, 0.5, 2.1] : [0, 0.85, 5.8]),
        [variant]
    );

    const showcase = variant === 'full' && interactive;
    // Langzaam ronddraaien tot de leerling zelf sleept; daarna niet meer, want
    // een bewegend doelwit is vervelend als je iets wilt bekijken.
    const [spinning, setSpinning] = useState(() => showcase && !prefersReducedMotion());
    const [hasInteracted, setHasInteracted] = useState(false);

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
                    makeDefault
                    enablePan={false}
                    enableZoom={variant === 'full'}
                    enableDamping
                    dampingFactor={0.08}
                    rotateSpeed={0.75}
                    zoomSpeed={0.6}
                    // Horizontaal is bewust onbegrensd: volledige 360 graden.
                    // Verticaal was een smalle band van 60 graden; nu van
                    // schuin boven tot net boven de vloerplaat — daaronder
                    // kijk je tegen de onverlichte onderkant aan.
                    minPolarAngle={Math.PI * 0.18}
                    maxPolarAngle={Math.PI * 0.62}
                    // Zonder deze grenzen kon een leerling het hoofd in zoomen.
                    minDistance={variant === 'head' ? 1.4 : 3.2}
                    maxDistance={variant === 'head' ? 3.0 : 9.0}
                    target={variant === 'head' ? [0, 0.5, 0] : [0, 1.0, 0]}
                    autoRotate={spinning}
                    autoRotateSpeed={0.6}
                    onStart={() => { setSpinning(false); setHasInteracted(true); }}
                />
            </Canvas>

            {showcase && !hasInteracted && (
                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-duck-ink/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-duck-acid">
                    <RotateCw size={12} />
                    Sleep me rond
                </div>
            )}
        </div>
    );
};
