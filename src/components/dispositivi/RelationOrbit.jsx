import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { FOCUS } from "@/components/dispositivi/dispositiviConfig";
import {
  getRelatedAuthorsOfDevice, getRelatedDevicesOfDevice, getRelatedThemesOfDevice,
} from "@/lib/dispositivo-selectors";

// I quattro tipi di connessione (AuthorNode / ParallelSheetNode /
// ThematicPathNode / AtlasMapNode) come un nodo unico parametrizzato per tipo.
function buildItems(device) {
  const authors = getRelatedAuthorsOfDevice(device.id).map((a) => ({ key: `a-${a.id}`, kind: "author", tag: "Autore", label: a.name, id: a.id, color: "#facc15" }));
  const devices = getRelatedDevicesOfDevice(device.id).map((d) => ({ key: `d-${d.id}`, kind: "device", tag: "Collegato", label: d.name, id: d.id, color: "#93c5fd" }));
  const themes = getRelatedThemesOfDevice(device.id).map((th) => ({ key: `t-${th.id}`, kind: "theme", tag: "Percorso", label: th.label, id: th.id, color: "#fca5a5" }));
  const atlas = [{ key: "atlas", kind: "atlas", tag: "Mappa", label: "Atlante", color: "#a7f3d0" }];
  return [...authors, ...devices, ...themes, ...atlas];
}

function RelationNode({ item, pos, onPick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={pos}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onPick(item); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}
      >
        <sphereGeometry args={[hovered ? 0.2 : 0.16, 16, 16]} />
        <meshBasicMaterial color={item.color} />
      </mesh>
      <Html position={[0, 0.42, 0]} center distanceFactor={7} pointerEvents="none">
        <div className="whitespace-nowrap select-none text-center">
          <div className="text-[8px] uppercase tracking-[0.25em] text-amber-300/50">{item.tag}</div>
          <div className={`text-[12px] ${hovered ? "text-amber-100" : "text-amber-100/65"}`}>{item.label}</div>
        </div>
      </Html>
    </group>
  );
}

// Orbita delle connessioni attorno al dispositivo in focus: nodi cliccabili in un
// arco a sinistra (lo spazio a destra resta al pannello). Segue l'àncora del focus.
export default function RelationOrbit({ device, onPick }) {
  const ref = useRef();
  const items = useMemo(() => buildItems(device), [device]);

  useFrame((state) => {
    if (!ref.current) return;
    const cam = state.camera;
    ref.current.position.set(cam.position.x + FOCUS.offsetX, cam.position.y, cam.position.z - FOCUS.dist);
  });

  const positions = items.map((_, k) => {
    const frac = items.length > 1 ? k / (items.length - 1) : 0.5;
    const a = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(128, 232, frac)); // arco sinistro
    const r = 3.1;
    return [Math.cos(a) * r, Math.sin(a) * r, (k % 2 ? 0.5 : -0.5)];
  });

  return (
    <group ref={ref}>
      {items.map((it, k) => (
        <RelationNode key={it.key} item={it} pos={positions[k]} onPick={onPick} />
      ))}
    </group>
  );
}
