import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function ImagePlane({ image, matRef }) {
  const tex = useTexture(image);
  tex.colorSpace = THREE.SRGBColorSpace;
  const aspect = tex.image ? tex.image.width / tex.image.height : 1;
  return (
    <mesh scale={[aspect, 1, 1]}>
      <planeGeometry args={[2.6, 2.6]} />
      <meshBasicMaterial ref={matRef} map={tex} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// Dispositivi senza immagine: anello ambra sospeso.
function BlankRing({ matRef }) {
  return (
    <mesh>
      <ringGeometry args={[0.85, 1.02, 40]} />
      <meshBasicMaterial ref={matRef} color="#facc15" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Nodo del dispositivo nella corrente: micro-drift + billboard + hover (scala +
// tooltip) + click (focus 3D). Quando la scena è in focus, gli altri nodi si
// attenuano (dimmed → opacità giù).
export default function DeviceNode({ device, pos, onHover, onHoverEnd, onFocus, dimmed }) {
  const ref = useRef();
  const matRef = useRef();
  const scaleRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  const baseOpacity = device.image ? 1 : 0.5;

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y = pos.y + Math.sin(state.clock.elapsedTime * 0.5 + pos.z) * 0.15;
    ref.current.lookAt(state.camera.position);
    const target = hovered && !dimmed ? 1.28 : 1;
    scaleRef.current += (target - scaleRef.current) * Math.min(1, 10 * delta);
    ref.current.scale.setScalar(scaleRef.current);
    if (matRef.current) {
      const op = dimmed ? 0.12 : baseOpacity;
      matRef.current.opacity += (op - matRef.current.opacity) * Math.min(1, 8 * delta);
    }
  });

  return (
    <group
      ref={ref}
      position={[pos.x, pos.y, pos.z]}
      onPointerOver={(e) => { if (dimmed) return; e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; onHover?.(device, e.clientX, e.clientY); }}
      onPointerMove={(e) => { if (dimmed) return; e.stopPropagation(); onHover?.(device, e.clientX, e.clientY); }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; onHoverEnd?.(); }}
      onClick={(e) => { if (dimmed) return; e.stopPropagation(); onHoverEnd?.(); onFocus?.(device, [e.point.x, e.point.y, e.point.z]); }}
    >
      {device.image ? <ImagePlane image={device.image} matRef={matRef} /> : <BlankRing matRef={matRef} />}
    </group>
  );
}
