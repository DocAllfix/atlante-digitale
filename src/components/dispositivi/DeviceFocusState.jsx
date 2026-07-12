import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FOCUS } from "@/components/dispositivi/dispositiviConfig";

const ease = (t) => t * t * (3 - 2 * t);
const _anchor = new THREE.Vector3();
const _start = new THREE.Vector3();

function FocusImage({ image }) {
  const tex = useTexture(image);
  tex.colorSpace = THREE.SRGBColorSpace;
  const aspect = tex.image ? tex.image.width / tex.image.height : 1;
  return (
    <mesh scale={[aspect, 1, 1]}>
      <planeGeometry args={[2.6, 2.6]} />
      <meshBasicMaterial map={tex} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
function FocusRing() {
  return (
    <mesh>
      <ringGeometry args={[0.85, 1.02, 40]} />
      <meshBasicMaterial color="#facc15" transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// Il dispositivo in focus: si stacca dalla corrente (startPos) e viene in avanti
// fino a un'àncora davanti alla camera, crescendo (morph 3D). Con active=false
// rientra; a fine rientro chiama onExited per lo smontaggio.
export default function DeviceFocusState({ device, startPos, active, onExited }) {
  const ref = useRef();
  const tRef = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const target = active ? 1 : 0;
    tRef.current += (target - tRef.current) * Math.min(1, 6 * delta);
    const t = ease(Math.max(0, Math.min(1, tRef.current)));

    const cam = state.camera;
    // Àncora fissa: a sinistra dell'inquadratura, distanza costante → dimensione
    // finale sempre uguale; lo spazio a destra resta libero per il pannello.
    _anchor.set(cam.position.x + FOCUS.offsetX, cam.position.y, cam.position.z - FOCUS.dist);
    _start.set(startPos[0], startPos[1], startPos[2]);
    ref.current.position.lerpVectors(_start, _anchor, t);
    ref.current.lookAt(cam.position);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(0.8, FOCUS.scale, t));

    const mat = ref.current.children[0]?.material;
    if (mat) mat.opacity = t * (device.image ? 1 : 0.7);

    if (!active && tRef.current < 0.02) onExited?.();
  });

  return (
    <group ref={ref}>
      {device.image ? <FocusImage image={device.image} /> : <FocusRing />}
    </group>
  );
}
