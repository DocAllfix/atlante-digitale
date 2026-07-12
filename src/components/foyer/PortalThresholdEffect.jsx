import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, PORTAL_GEO, THRESHOLD_RANGE } from "@/components/foyer/foyerConfig";

// Effetto-soglia guidato dalla prossimità graduale t (0..1): la luce nel varco
// "respira" e cresce avvicinandosi, un alone additivo pulsa (più da vicino).
// Fa sembrare la soglia viva senza shader pesanti. Va reso DENTRO il gruppo
// del PortalFrame (coordinate locali); riceve la posizione del giocatore e la
// posizione mondiale del portale per calcolare t.
const { openW, openH } = PORTAL_GEO;

export default function PortalThresholdEffect({ playerPosRef, portalPos }) {
  const glowRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const p = playerPosRef.current;
    const dist = Math.hypot(portalPos[0] - p.x, portalPos[2] - p.z);
    const t = Math.max(0, Math.min(1, (THRESHOLD_RANGE - dist) / THRESHOLD_RANGE));
    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * (2 + 2 * t));
    if (glowRef.current) glowRef.current.material.opacity = (0.06 + 0.5 * t) * (0.55 + 0.45 * pulse);
    if (lightRef.current) lightRef.current.intensity = 6 + 46 * t;
  });

  return (
    <group>
      {/* Luce che respira dentro il varco */}
      <pointLight ref={lightRef} position={[0, openH / 2, -0.6]} intensity={6} distance={16} decay={2} color={PALETTE.warmLight} />
      {/* Alone additivo alla bocca della soglia */}
      <mesh ref={glowRef} position={[0, openH / 2, 0.08]}>
        <planeGeometry args={[openW + 1.6, openH + 1.6]} />
        <meshBasicMaterial color={PALETTE.amber} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
