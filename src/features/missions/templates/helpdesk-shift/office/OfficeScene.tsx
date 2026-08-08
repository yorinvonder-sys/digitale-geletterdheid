import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Desk, OfficeConfig, OfficeLive, Station, StationSoort } from './officeTypes';

interface Props {
    config: OfficeConfig;
    live: OfficeLive;
    /** Kindcomponenten: het spelersfiguurtje wordt hierin gehangen. */
    children?: React.ReactNode;
}

/**
 * De vijf kleuren van het platform. Zuurgeel is een accent voor alles wat
 * aandacht vraagt, rood is uitsluitend voor gevaar en schade — nergens anders.
 */
const CREME = '#f2f1ec';
const CREME_LICHT = '#f8f8f5';
const INKT = '#202023';
const ZUURGEEL = '#e1ff01';
const GRIJS = '#c2c1bd';
const ROOD = '#ff3c21';

/**
 * Vaste camera-afstand schuin achter de speler, in meters. Ruim genoeg naar
 * achteren en omhoog zodat bureaus rondom de speler niet aan de bovenrand
 * worden afgesneden.
 */
const CAMERA_OFFSET = new THREE.Vector3(0, 9, 10);
/** Hoe snel de camera bijtrekt naar zijn doelpositie (per seconde-fractie). */
const CAMERA_LERP = 0.06;

/** Volgt `live.positie` op een vaste afstand schuin van boven, zonder schokken. */
const FollowCamera: React.FC<{ live: OfficeLive }> = ({ live }) => {
    const targetRef = useRef(new THREE.Vector3());
    const lookAtRef = useRef(new THREE.Vector3());

    useFrame(({ camera }) => {
        const doel = targetRef.current.set(
            live.positie.x + CAMERA_OFFSET.x,
            CAMERA_OFFSET.y,
            live.positie.z + CAMERA_OFFSET.z
        );
        camera.position.lerp(doel, CAMERA_LERP);
        // Iets lager kijkpunt dan het midden van de speler, zodat de camera
        // meer van de ruimte boven de speler in beeld houdt.
        const kijkPunt = lookAtRef.current.set(live.positie.x, 0.3, live.positie.z);
        camera.lookAt(kijkPunt);
    });

    return null;
};

/** Vloer plus vier lage muren, zodat de rand van de ruimte duidelijk is. */
const RoomShell: React.FC<{ afmeting: OfficeConfig['afmeting'] }> = ({ afmeting }) => {
    const breedte = afmeting.breedte * 2;
    const diepte = afmeting.diepte * 2;
    const muurHoogte = 1.4;
    const muurDikte = 0.2;

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
                <planeGeometry args={[breedte, diepte]} />
                <meshStandardMaterial color={CREME_LICHT} />
            </mesh>
            {/* Noord- en zuidmuur */}
            {[-1, 1].map((zijde) => (
                <mesh key={`nz-${zijde}`} position={[0, muurHoogte / 2, (zijde * diepte) / 2]}>
                    <boxGeometry args={[breedte, muurHoogte, muurDikte]} />
                    <meshStandardMaterial color={CREME} />
                </mesh>
            ))}
            {/* Oost- en westmuur */}
            {[-1, 1].map((zijde) => (
                <mesh key={`ow-${zijde}`} position={[(zijde * breedte) / 2, muurHoogte / 2, 0]}>
                    <boxGeometry args={[muurDikte, muurHoogte, diepte]} />
                    <meshStandardMaterial color={CREME} />
                </mesh>
            ))}
        </group>
    );
};

/**
 * Zwevend leesbaar label boven een bureau of station. `Billboard` draait het
 * label elk frame naar de camera, zodat het nooit ondersteboven of gespiegeld
 * staat — ook niet op een gedraaid bureau.
 */
const VloerLabel: React.FC<{ tekst: string; y?: number }> = ({ tekst, y = 1.9 }) => (
    <Billboard position={[0, y, 0]}>
        <Text
            fontSize={0.22}
            color={INKT}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor={CREME_LICHT}
        >
            {tekst}
        </Text>
    </Billboard>
);

/**
 * Hoe hoog de aandachtmarkering gemiddeld zweeft, en hoe rustig hij op-en-neer
 * beweegt — geen felle knippering, wel over andere meubels heen zichtbaar.
 */
const MARKER_HOOGTE = 2.6;
const MARKER_AMPLITUDE = 0.15;
const MARKER_SNELHEID = 1.2;
const MARKER_GEOM = new THREE.ConeGeometry(0.22, 0.4, 4);

/**
 * Rustig zwevende markering boven een plek die om aandacht vraagt: het
 * doelbureau met onbehandelde post, of een afleverplek voor een gedragen
 * bericht.
 */
const AandachtMarker: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        groupRef.current.position.y = MARKER_HOOGTE + Math.sin(clock.elapsedTime * MARKER_SNELHEID) * MARKER_AMPLITUDE;
    });

    return (
        <group ref={groupRef} position={[0, MARKER_HOOGTE, 0]}>
            <mesh geometry={MARKER_GEOM} rotation={[Math.PI, 0, 0]}>
                <meshStandardMaterial color={ZUURGEEL} emissive={ZUURGEEL} emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
};

// Gedeelde geometrie voor elk bureau: één instantie, hergebruikt over alle
// bureaus en hun ringen zodat het aantal geometrieën niet meeschaalt.
const DESK_POOT_GEOM = new THREE.BoxGeometry(0.1, 0.7, 0.1);
const DESK_BLAD_GEOM = new THREE.BoxGeometry(1.2, 0.05, 0.7);
const DESK_SCHERM_GEOM = new THREE.BoxGeometry(0.55, 0.4, 0.04);
const DESK_SCHERM_RAND_GEOM = new THREE.BoxGeometry(0.63, 0.48, 0.02);
const STOEL_ZITTING_GEOM = new THREE.BoxGeometry(0.4, 0.05, 0.4);
const STOEL_RUG_GEOM = new THREE.BoxGeometry(0.4, 0.5, 0.05);
const RING_DICHTBIJ_DESK_GEOM = new THREE.RingGeometry(0.85, 1, 32);
const RING_AANDACHT_DESK_GEOM = new THREE.RingGeometry(1.15, 1.35, 32);

// Gedeelde geometrie voor de zittende collega — één torso en één hoofd,
// hergebruikt bij elk bureau en bij de rondlopende collega.
const COLLEGA_ROMP_GEOM = new THREE.BoxGeometry(0.34, 0.4, 0.22);
const COLLEGA_HOOFD_GEOM = new THREE.SphereGeometry(0.14, 12, 8);

/** Een zittende collega op de stoel: romp en hoofd, in neutrale kleuren. */
const Collega: React.FC<{ getroffen: boolean }> = ({ getroffen }) => {
    // Bij een overgenomen account zakt de collega zichtbaar onderuit.
    const rompY = getroffen ? 0.5 : 0.68;
    const rompRotatieX = getroffen ? 0.55 : 0;
    const hoofdY = getroffen ? 0.72 : 1.0;
    const hoofdZ = getroffen ? -0.14 : -0.04;

    return (
        <>
            <mesh geometry={COLLEGA_ROMP_GEOM} position={[0, rompY, -0.04]} rotation={[rompRotatieX, 0, 0]}>
                <meshStandardMaterial color={GRIJS} />
            </mesh>
            <mesh geometry={COLLEGA_HOOFD_GEOM} position={[0, hoofdY, hoofdZ]}>
                <meshStandardMaterial color={INKT} />
            </mesh>
        </>
    );
};

/** Eén bureau: blad, poot, beeldscherm, stoel en de collega die erop zit. */
const DeskModel: React.FC<{
    desk: Desk;
    heeftPost: boolean;
    dichtbij: boolean;
    isAfleverplek: boolean;
    getroffen: boolean;
}> = ({ desk, heeftPost, dichtbij, isAfleverplek, getroffen }) => {
    const rotatieRad = (desk.rotatie * Math.PI) / 180;
    // Rood gaat altijd voor: een overgenomen account is schade, geen aandachtspuntje.
    const vraagtAandacht = heeftPost || isAfleverplek;
    const schermKleur = getroffen ? ROOD : vraagtAandacht ? ZUURGEEL : GRIJS;
    const schermEmissief = getroffen ? ROOD : vraagtAandacht ? ZUURGEEL : '#000000';
    const schermIntensiteit = getroffen ? 1 : vraagtAandacht ? 0.9 : 0;

    return (
        <>
            {/* Label buiten de gedraaide groep: anders erft het de bureaurotatie en staat het scheef/gespiegeld */}
            <group position={[desk.positie.x, 0, desk.positie.z]}>
                <VloerLabel tekst={desk.naam} />
            </group>
            <group position={[desk.positie.x, 0, desk.positie.z]} rotation={[0, rotatieRad, 0]}>
                {/* Extra rand op de vloer als dit bureau nu bedienbaar is */}
                {dichtbij && (
                    <mesh geometry={RING_DICHTBIJ_DESK_GEOM} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color={GRIJS} transparent opacity={0.6} />
                    </mesh>
                )}
                {/* Opvallende ring op de vloer rond een plek die aandacht vraagt */}
                {vraagtAandacht && (
                    <mesh geometry={RING_AANDACHT_DESK_GEOM} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color={ZUURGEEL} transparent opacity={0.6} />
                    </mesh>
                )}
                {/* Poot */}
                <mesh geometry={DESK_POOT_GEOM} position={[0, 0.35, 0]}>
                    <meshStandardMaterial color={INKT} />
                </mesh>
                {/* Blad */}
                <mesh geometry={DESK_BLAD_GEOM} position={[0, 0.72, 0]}>
                    <meshStandardMaterial color={INKT} />
                </mesh>
                {/* Schermrand, iets groter en donkerder achter het scherm zelf */}
                <mesh geometry={DESK_SCHERM_RAND_GEOM} position={[0, 1.05, -0.225]}>
                    <meshStandardMaterial color={INKT} />
                </mesh>
                {/* Beeldscherm */}
                <mesh geometry={DESK_SCHERM_GEOM} position={[0, 1.05, -0.22]}>
                    <meshStandardMaterial color={schermKleur} emissive={schermEmissief} emissiveIntensity={schermIntensiteit} />
                </mesh>
                {/* Rustig zwevende markering hoog boven de plek, ook over andere meubels heen zichtbaar */}
                {vraagtAandacht && <AandachtMarker />}
                {/* Stoel: zitting + rugleuning + de collega die erop zit */}
                <group position={[0, 0, 0.55]}>
                    <mesh geometry={STOEL_ZITTING_GEOM} position={[0, 0.4, 0]}>
                        <meshStandardMaterial color={GRIJS} />
                    </mesh>
                    <mesh geometry={STOEL_RUG_GEOM} position={[0, 0.65, 0.18]}>
                        <meshStandardMaterial color={GRIJS} />
                    </mesh>
                    <Collega getroffen={getroffen} />
                </group>
            </group>
        </>
    );
};

const STATION_KLEUR: Record<StationSoort, string> = {
    koffie: GRIJS,
    telefoon: GRIJS,
    usb: INKT,
    itkast: GRIJS,
    versnipperaar: INKT,
};

// Gedeelde geometrie per stationsoort, hergebruikt over alle stations.
const KOFFIE_GEOM = new THREE.BoxGeometry(0.5, 1.4, 0.45);
const TELEFOON_BASIS_GEOM = new THREE.BoxGeometry(0.35, 0.9, 0.35);
const TELEFOON_TOP_GEOM = new THREE.BoxGeometry(0.25, 0.1, 0.15);
const USB_GEOM = new THREE.BoxGeometry(0.18, 0.06, 0.06);
const ITKAST_GEOM = new THREE.BoxGeometry(0.7, 1.8, 0.6);
const VERSNIPPERAAR_GEOM = new THREE.BoxGeometry(0.35, 0.8, 0.35);
const PRULLENBAK_GEOM = new THREE.CylinderGeometry(0.22, 0.18, 0.5, 12);
const RING_DICHTBIJ_STATION_GEOM = new THREE.RingGeometry(0.7, 0.85, 32);
const RING_AANDACHT_STATION_GEOM = new THREE.RingGeometry(1.0, 1.2, 32);

/** Herkenbaar object per stationsoort: automaat, toestel, usb-stickje, serverkast, versnipperaar. */
const StationModel: React.FC<{ station: Station; dichtbij: boolean; isAfleverplek: boolean }> = ({
    station,
    dichtbij,
    isAfleverplek,
}) => {
    const kleur = STATION_KLEUR[station.soort];

    return (
        <group position={[station.positie.x, 0, station.positie.z]}>
            <VloerLabel tekst={station.label} y={station.soort === 'usb' ? 0.7 : 1.9} />
            {dichtbij && (
                <mesh geometry={RING_DICHTBIJ_STATION_GEOM} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color={GRIJS} transparent opacity={0.6} />
                </mesh>
            )}
            {/* Deze plek is nu een afleverplek voor het gedragen bericht */}
            {isAfleverplek && (
                <>
                    <mesh geometry={RING_AANDACHT_STATION_GEOM} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color={ZUURGEEL} transparent opacity={0.6} />
                    </mesh>
                    <AandachtMarker />
                </>
            )}
            {station.soort === 'koffie' && (
                <mesh geometry={KOFFIE_GEOM} position={[0, 0.7, 0]}>
                    <meshStandardMaterial color={kleur} />
                </mesh>
            )}
            {station.soort === 'telefoon' && (
                <group>
                    <mesh geometry={TELEFOON_BASIS_GEOM} position={[0, 0.45, 0]}>
                        <meshStandardMaterial color={GRIJS} />
                    </mesh>
                    <mesh geometry={TELEFOON_TOP_GEOM} position={[0, 0.95, 0]}>
                        <meshStandardMaterial color={INKT} />
                    </mesh>
                </group>
            )}
            {station.soort === 'usb' && (
                <mesh geometry={USB_GEOM} position={[0, 0.08, 0]}>
                    <meshStandardMaterial color={kleur} />
                </mesh>
            )}
            {station.soort === 'itkast' && (
                <mesh geometry={ITKAST_GEOM} position={[0, 0.9, 0]}>
                    <meshStandardMaterial color={kleur} />
                </mesh>
            )}
            {station.soort === 'versnipperaar' && (
                <group>
                    {/* Papierversnipperaar */}
                    <mesh geometry={VERSNIPPERAAR_GEOM} position={[-0.15, 0.4, 0]}>
                        <meshStandardMaterial color={kleur} />
                    </mesh>
                    {/* Prullenbak ernaast */}
                    <mesh geometry={PRULLENBAK_GEOM} position={[0.35, 0.25, 0]}>
                        <meshStandardMaterial color={GRIJS} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

/** Hoe rustig de rondlopende collega heen en weer beweegt tussen twee punten. */
const LOOP_SNELHEID = 0.25;
/** Klein blokje op het whiteboard per getroffen collega. */
const WHITEBOARD_STREEP_GEOM = new THREE.BoxGeometry(0.08, 0.12, 0.02);
const WHITEBOARD_BORD_GEOM = new THREE.BoxGeometry(1.6, 1.0, 0.03);
const WHITEBOARD_LIJST_GEOM = new THREE.BoxGeometry(1.68, 1.08, 0.02);
const WHITEBOARD_STREEP_PER_RIJ = 5;

/** Eén collega die rustig heen en weer loopt tussen twee vaste punten, als achtergrondleven. */
const RondlopendeCollega: React.FC<{ afmeting: OfficeConfig['afmeting'] }> = ({ afmeting }) => {
    const groupRef = useRef<THREE.Group>(null);
    const puntA = useRef(new THREE.Vector3(-afmeting.breedte * 0.75, 0, afmeting.diepte * 0.85)).current;
    const puntB = useRef(new THREE.Vector3(afmeting.breedte * 0.75, 0, afmeting.diepte * 0.85)).current;
    const huidigePositie = useRef(new THREE.Vector3()).current;

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const fase = clock.elapsedTime * LOOP_SNELHEID;
        const t = (Math.sin(fase) + 1) / 2;
        groupRef.current.position.copy(huidigePositie.lerpVectors(puntA, puntB, t));
        groupRef.current.rotation.y = Math.cos(fase) >= 0 ? Math.PI / 2 : -Math.PI / 2;
    });

    return (
        <group ref={groupRef} position={puntA}>
            <mesh geometry={COLLEGA_ROMP_GEOM} position={[0, 0.68, 0]}>
                <meshStandardMaterial color={GRIJS} />
            </mesh>
            <mesh geometry={COLLEGA_HOOFD_GEOM} position={[0, 1.0, 0]}>
                <meshStandardMaterial color={INKT} />
            </mesh>
        </group>
    );
};

/**
 * Whiteboard tegen de noordmuur: één blokje per collega van wie het account
 * is overgenomen. Geen tekst nodig, de streepjes tellen zichtbaar op.
 */
const Whiteboard: React.FC<{ afmeting: OfficeConfig['afmeting']; aantalGetroffen: number }> = ({
    afmeting,
    aantalGetroffen,
}) => {
    const x = -afmeting.breedte * 0.7;
    const z = -afmeting.diepte + 0.15;

    return (
        <group position={[x, 1.5, z]}>
            <mesh geometry={WHITEBOARD_LIJST_GEOM} position={[0, 0, -0.02]}>
                <meshStandardMaterial color={INKT} />
            </mesh>
            <mesh geometry={WHITEBOARD_BORD_GEOM}>
                <meshStandardMaterial color={CREME_LICHT} />
            </mesh>
            {Array.from({ length: aantalGetroffen }).map((_, i) => {
                const rij = Math.floor(i / WHITEBOARD_STREEP_PER_RIJ);
                const kolom = i % WHITEBOARD_STREEP_PER_RIJ;
                return (
                    <mesh
                        key={i}
                        geometry={WHITEBOARD_STREEP_GEOM}
                        position={[-0.6 + kolom * 0.16, 0.32 - rij * 0.18, 0.03]}
                    >
                        <meshStandardMaterial color={ROOD} />
                    </mesh>
                );
            })}
        </group>
    );
};

/** De 3D-kantoorruimte: vloer, bureaus, stations, collega's, licht en een volgcamera. */
export const OfficeScene: React.FC<Props> = ({ config, live, children }) => {
    return (
        <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true }}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, CAMERA_OFFSET.y, CAMERA_OFFSET.z], fov: 45 }}
        >
            <FollowCamera live={live} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 8, 4]} intensity={0.9} />

            <RoomShell afmeting={config.afmeting} />
            <Whiteboard afmeting={config.afmeting} aantalGetroffen={live.getroffenDesks.length} />
            <RondlopendeCollega afmeting={config.afmeting} />

            {config.desks.map((desk) => (
                <DeskModel
                    key={desk.id}
                    desk={desk}
                    heeftPost={live.desksMetPost.includes(desk.id)}
                    dichtbij={live.dichtbij === desk.id}
                    isAfleverplek={live.draagtBericht && live.afleverplekken.includes(desk.id)}
                    getroffen={live.getroffenDesks.includes(desk.id)}
                />
            ))}

            {config.stations.map((station) => (
                <StationModel
                    key={station.id}
                    station={station}
                    dichtbij={live.dichtbij === station.id}
                    isAfleverplek={live.draagtBericht && live.afleverplekken.includes(station.id)}
                />
            ))}

            {children}
        </Canvas>
    );
};
