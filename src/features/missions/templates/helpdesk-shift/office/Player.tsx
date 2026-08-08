import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type { OfficeConfig, Spot } from './officeTypes';

/**
 * Het platformpalet. De speler draagt zuurgeel: hij is degene die je volgt, en
 * in dit kantoor is zuurgeel de kleur van aandacht.
 */
const JIJ_SHIRT = '#e1ff01';
const JIJ_HUID = '#c2c1bd';
const JIJ_BROEK = '#202023';

interface Props {
    config: OfficeConfig;
    positie: Spot;
    /** Kijkrichting in radialen. */
    richting: number;
    /** Of de leerling op dit moment beweegt. */
    loopt: boolean;
}

/** Hoek naar het dichtstbijzijnde equivalent van `doel`, gezien vanaf `van`. */
function kortsteHoekPad(van: number, doel: number): number {
    let verschil = (doel - van) % (Math.PI * 2);
    if (verschil > Math.PI) verschil -= Math.PI * 2;
    if (verschil < -Math.PI) verschil += Math.PI * 2;
    return van + verschil;
}

/** Een simpel ledemaat: een langwerpig blokje op een scharnierpunt. */
const Ledemaat: React.FC<{
    groepRef: React.RefObject<THREE.Group | null>;
    positie: [number, number, number];
    afmeting: [number, number, number];
    kleur: string;
}> = ({ groepRef, positie, afmeting, kleur }) => (
    <group ref={groepRef} position={positie}>
        <mesh position={[0, -afmeting[1] / 2, 0]}>
            <boxGeometry args={afmeting} />
            <meshStandardMaterial color={kleur} />
        </mesh>
    </group>
);

/**
 * Het figuurtje van de leerling in de 3D-scene. Rekent zelf geen beweging
 * uit — het volgt alleen `positie` en `richting` die van buiten komen.
 */
export const Player: React.FC<Props> = ({ positie, richting, loopt }) => {
    const wortel = useRef<THREE.Group>(null);
    const linkerArm = useRef<THREE.Group>(null);
    const rechterArm = useRef<THREE.Group>(null);
    const linkerBeen = useRef<THREE.Group>(null);
    const rechterBeen = useRef<THREE.Group>(null);
    const lichaam = useRef<THREE.Group>(null);
    const looptijd = useRef(0);

    useFrame((_, delta) => {
        // Soepel naar de gevraagde kijkrichting draaien, niet met een sprong.
        if (wortel.current) {
            const huidig = wortel.current.rotation.y;
            const doel = kortsteHoekPad(huidig, richting);
            wortel.current.rotation.y = THREE.MathUtils.damp(huidig, doel, 12, delta);
        }

        looptijd.current += delta;
        const t = looptijd.current;

        if (loopt) {
            // Rustige loopcyclus: armen en benen tegengesteld zwaaien.
            const zwaai = Math.sin(t * 8) * 0.6;
            if (linkerArm.current) linkerArm.current.rotation.x = zwaai;
            if (rechterArm.current) rechterArm.current.rotation.x = -zwaai;
            if (linkerBeen.current) linkerBeen.current.rotation.x = -zwaai;
            if (rechterBeen.current) rechterBeen.current.rotation.x = zwaai;
            if (lichaam.current) lichaam.current.position.y = Math.abs(Math.sin(t * 8)) * 0.03;
        } else {
            // Stilstand: geen zwaai, alleen een subtiele ademhaling.
            const adem = Math.sin(t * 1.6) * 0.015;
            if (linkerArm.current) linkerArm.current.rotation.x = THREE.MathUtils.damp(linkerArm.current.rotation.x, 0, 8, delta);
            if (rechterArm.current) rechterArm.current.rotation.x = THREE.MathUtils.damp(rechterArm.current.rotation.x, 0, 8, delta);
            if (linkerBeen.current) linkerBeen.current.rotation.x = THREE.MathUtils.damp(linkerBeen.current.rotation.x, 0, 8, delta);
            if (rechterBeen.current) rechterBeen.current.rotation.x = THREE.MathUtils.damp(rechterBeen.current.rotation.x, 0, 8, delta);
            if (lichaam.current) lichaam.current.position.y = adem;
        }
    });

    return (
        <group ref={wortel} position={[positie.x, 0, positie.z]}>
            <group ref={lichaam}>
                {/* Lichaam */}
                <mesh position={[0, 0.9, 0]}>
                    <boxGeometry args={[0.4, 0.6, 0.22]} />
                    <meshStandardMaterial color={JIJ_SHIRT} />
                </mesh>
                {/* Hoofd */}
                <mesh position={[0, 1.35, 0]}>
                    <boxGeometry args={[0.3, 0.3, 0.3]} />
                    <meshStandardMaterial color={JIJ_HUID} />
                </mesh>
                <Ledemaat groepRef={linkerArm} positie={[-0.28, 1.15, 0]} afmeting={[0.12, 0.5, 0.12]} kleur="#e8b98a" />
                <Ledemaat groepRef={rechterArm} positie={[0.28, 1.15, 0]} afmeting={[0.12, 0.5, 0.12]} kleur="#e8b98a" />
                <Ledemaat groepRef={linkerBeen} positie={[-0.12, 0.6, 0]} afmeting={[0.15, 0.55, 0.15]} kleur={JIJ_BROEK} />
                <Ledemaat groepRef={rechterBeen} positie={[0.12, 0.6, 0]} afmeting={[0.15, 0.55, 0.15]} kleur={JIJ_BROEK} />
            </group>
        </group>
    );
};
