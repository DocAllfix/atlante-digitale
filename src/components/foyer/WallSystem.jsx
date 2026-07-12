import { WALL, WALL_SEGMENTS } from "@/components/foyer/foyerConfig";

// Sistema di pareti liminali: lastre verticali alte e sobrie ai lati della
// navata, a ritmo verso il punto di fuga. Materiale matte (intonaco/cemento);
// gli apici, poco illuminati, si perdono nel buio → confini che sfumano, non una
// scatola. Data-driven da WALL_SEGMENTS (in sync con le collisioni).
export default function WallSystem() {
  return (
    <group>
      {WALL_SEGMENTS.map((s, i) => (
        <mesh key={i} position={[s.x, WALL.height / 2, s.z]} castShadow>
          <boxGeometry args={[WALL.width, WALL.height, WALL.depth]} />
          <meshStandardMaterial color="#2c2c29" roughness={0.95} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}
