import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import { PORTAL_GEO } from "@/components/foyer/foyerConfig";
import PortalThresholdEffect from "@/components/foyer/PortalThresholdEffect";

// Soglia attraversabile: telaio con spessore (stipiti + architrave + recesso) e
// anteprima incassata (profondità reale). Si entra SOLO attraversando fisicamente
// il varco. Davanti, una targhetta-leggìo da museo col nome della stanza (testo
// 3D): cliccandola si apre l'approfondimento (gestito dall'host).
const { openW, openH, jamb, depth } = PORTAL_GEO;
const STONE = "#54545e";

export default function PortalFrame({ portal, near, playerPosRef, onPlaque }) {
  const tex = useTexture(portal.img);
  const plaqueX = openW / 2 + 1.3; // a lato destro dell'ingresso
  const plaqueZ = depth / 2 + 1.0; // davanti alla soglia

  return (
    <group position={portal.pos} rotation={[0, portal.facing || 0, 0]}>
      {/* Targhetta-leggìo da museo */}
      <group position={[plaqueX, 0, plaqueZ]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.3, 0.1, 24]} />
          <meshStandardMaterial color="#2b2b30" roughness={0.55} metalness={0.55} />
        </mesh>
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 1.45, 12]} />
          <meshStandardMaterial color="#3a3a40" roughness={0.45} metalness={0.65} />
        </mesh>
        {/* Placca inclinata (leggìo), cliccabile → approfondimento */}
        <group position={[0, 1.55, 0.02]} rotation={[-0.95, 0, 0]}>
          <mesh
            onClick={(e) => { e.stopPropagation(); onPlaque?.(portal); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = ""; }}
          >
            <boxGeometry args={[1.55, 0.52, 0.06]} />
            <meshStandardMaterial color={near ? "#746a58" : "#4f4a40"} roughness={0.4} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.032]}>
            <boxGeometry args={[1.4, 0.4, 0.02]} />
            <meshStandardMaterial color="#1c1c19" roughness={0.7} metalness={0.25} />
          </mesh>
          <Text position={[0, 0, 0.05]} fontSize={0.15} letterSpacing={0.16} color="#f5e9c8" anchorX="center" anchorY="middle" maxWidth={1.35}>
            {portal.label.toUpperCase()}
          </Text>
        </group>
      </group>

      {/* Stipiti */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (openW / 2 + jamb / 2), openH / 2, 0]}>
          <boxGeometry args={[jamb, openH, depth]} />
          <meshStandardMaterial color={STONE} roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
      {/* Architrave */}
      <mesh position={[0, openH + jamb / 2, 0]}>
        <boxGeometry args={[openW + jamb * 2, jamb, depth]} />
        <meshStandardMaterial color={STONE} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Pareti interne del recesso */}
      {[-1, 1].map((s) => (
        <mesh key={`w${s}`} position={[s * openW / 2, openH / 2, -depth / 2]}>
          <boxGeometry args={[0.06, openH, depth]} />
          <meshStandardMaterial color="#17171b" roughness={1} />
        </mesh>
      ))}
      {/* Soglia a pavimento */}
      <mesh position={[0, 0.03, depth / 2 - 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[openW, 0.7]} />
        <meshStandardMaterial color={near ? "#5a4c1f" : "#2a2416"} />
      </mesh>

      {/* Anteprima recessa, auto-illuminata (non interattiva: si entra solo passandoci) */}
      <mesh position={[0, openH / 2, -depth + 0.03]}>
        <planeGeometry args={[openW - 0.1, openH - 0.1]} />
        <meshBasicMaterial map={tex} transparent color={near ? "#ffffff" : "#cccccc"} side={THREE.DoubleSide} />
      </mesh>

      <PortalThresholdEffect playerPosRef={playerPosRef} portalPos={portal.pos} />
    </group>
  );
}
