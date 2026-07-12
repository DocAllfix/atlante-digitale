import { Html } from "@react-three/drei";

// Nodo-tema fluttuante: cliccandolo avvia il percorso guidato (conductor).
export default function ThemeNode({ node, onTheme }) {
  return (
    <group position={node.pos}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onTheme(node.id); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
      >
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#fff7cc" emissive="#facc15" emissiveIntensity={1.1} />
      </mesh>
      <Html position={[0, 0.75, 0]} center distanceFactor={18} pointerEvents="none">
        <div className="whitespace-nowrap text-[11px] font-prompt uppercase tracking-[0.1em] text-amber-100/70 select-none">{node.label}</div>
      </Html>
    </group>
  );
}
