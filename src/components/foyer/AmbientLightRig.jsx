import { PALETTE } from "@/components/foyer/foyerConfig";

// Rig di luce "low-key" liminale: illuminazione d'ambiente calibrata + una key
// morbida che dà forma a pavimento e pareti, e un fill caldo in profondità. Le
// pozze di luce vive vengono dai portali (PortalThresholdEffect). Niente HDRI
// esterni: tutto self-contained.
export default function AmbientLightRig() {
  return (
    <group>
      <ambientLight intensity={0.95} />
      <hemisphereLight args={[PALETTE.coolSky, PALETTE.warmGround, 0.6]} />
      {/* Key direzionale morbida dall'alto-fronte: dà volume alle superfici */}
      <directionalLight position={[3, 15, 6]} intensity={1.15} color={PALETTE.keyLight} />
      {/* Fill caldi che illuminano la navata e il fondo */}
      <pointLight position={[0, 9, -6]} intensity={80} distance={40} decay={2} color={PALETTE.warmLight} />
      <pointLight position={[0, 9, -22]} intensity={70} distance={44} decay={2} color={PALETTE.warmLight} />
    </group>
  );
}
