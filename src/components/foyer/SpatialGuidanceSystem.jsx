import * as THREE from "three";
import { PALETTE, WALL } from "@/components/foyer/foyerConfig";

// Guida spaziale discreta: una "corsia" di luce calda verso il punto di fuga
// (rinforza direzione e profondità senza clutter) e un bagliore tenue in fondo
// alla navata, che invita a proseguire. L'affordance di prossimità dei singoli
// varchi è gestita dal PortalThresholdEffect.
export default function SpatialGuidanceSystem() {
  return (
    <group>
      {/* Corsia centrale morbida sul pavimento */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -13]}>
        <planeGeometry args={[1.5, 44]} />
        <meshBasicMaterial color={PALETTE.warmLight} transparent opacity={0.06} depthWrite={false} />
      </mesh>
      {/* Bagliore in fondo (punto di fuga) */}
      <mesh position={[0, WALL.height * 0.35, WALL.to - 2]}>
        <planeGeometry args={[12, 10]} />
        <meshBasicMaterial color={PALETTE.warmLight} transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
