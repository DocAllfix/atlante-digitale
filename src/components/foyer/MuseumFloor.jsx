import { Grid, MeshReflectorMaterial } from "@react-three/drei";
import { PALETTE } from "@/components/foyer/foyerConfig";

// Pavimento museale: una superficie scura a riflesso MOLTO tenue (lucentezza da
// galleria, non specchio) + la griglia prospettica a piastrelle che fugge verso
// il punto di fuga. Discreto e leggibile.
export default function MuseumFloor() {
  return (
    <group>
      {/* Superficie riflettente sobria */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <planeGeometry args={[90, 100]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[400, 200]}
          mixBlur={1}
          mixStrength={2.2}
          mirror={0}
          roughness={0.95}
          metalness={0.15}
          color={PALETTE.floor}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
        />
      </mesh>

      {/* Piastrelle / linee prospettiche */}
      <Grid
        position={[0, 0.02, -12]}
        args={[70, 90]}
        cellSize={1.1}
        cellThickness={0.6}
        cellColor="#332916"
        sectionSize={4.4}
        sectionThickness={1.1}
        sectionColor="#5a481e"
        fadeDistance={42}
        fadeStrength={1.3}
        followCamera={false}
        infiniteGrid={false}
      />
    </group>
  );
}
