import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Line } from "@react-three/drei";
import * as THREE from "three";
import { layoutDevices, driftBounds } from "@/components/dispositivi/DeviceSpiralLayout";
import { CAMERA } from "@/components/dispositivi/dispositiviConfig";
import DeviceNode from "@/components/dispositivi/DeviceNode";
import DeviceFocusState from "@/components/dispositivi/DeviceFocusState";

// Scena della deriva: lo scroll (offset 0..1) guida la camera lungo −Z
// attraverso la corrente; un lieve avvitamento del gruppo dà il senso orbitale.
// I dispositivi (nodi) scorrono intorno con parallasse; la foschia sfuma i lontani.
export default function SpiralDriftScene({ onCurrent, barRef, onHover, onHoverEnd, onFocus, focusData, focusActive, onFocusExited }) {
  const nodes = useMemo(() => layoutDevices(), []);
  const bounds = useMemo(() => driftBounds(nodes.length), [nodes.length]);
  const scroll = useScroll();
  const group = useRef();
  const lastIdx = useRef(-1);

  // Filo sottile che cuce la spirale: una curva morbida attraverso i nodi, per
  // mostrare la traiettoria (segui la corrente, scrollando vai avanti).
  const threadPoints = useMemo(() => {
    const pts = nodes.map((n) => new THREE.Vector3(n.pos.x, n.pos.y, n.pos.z));
    if (pts.length < 2) return pts;
    return new THREE.CatmullRomCurve3(pts).getPoints(nodes.length * 6);
  }, [nodes]);

  useFrame((state) => {
    const o = scroll.offset; // già smorzato da ScrollControls
    const camZ = THREE.MathUtils.lerp(CAMERA.startZ, bounds.zEnd + CAMERA.startZ, o);
    state.camera.position.set(0, 0, camZ);
    state.camera.lookAt(0, 0, camZ - 10);
    if (group.current) group.current.rotation.z = o * 0.6;

    // Progressione continua, aggiornata direttamente sul DOM (nessun re-render).
    if (barRef?.current) barRef.current.style.width = `${o * 100}%`;

    // Dispositivo "corrente" = quello più vicino alla camera lungo l'asse.
    let idx = 0, best = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      const d = Math.abs(nodes[i].pos.z - camZ);
      if (d < best) { best = d; idx = i; }
    }
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      onCurrent?.({ device: nodes[idx].device, index: idx, total: nodes.length });
    }
  });

  return (
    <>
      <group ref={group}>
        <Line points={threadPoints} color="#facc15" lineWidth={1} transparent opacity={0.18} />
        {nodes.map(({ device, pos }) => (
          <DeviceNode
            key={device.id}
            device={device}
            pos={pos}
            onHover={onHover}
            onHoverEnd={onHoverEnd}
            onFocus={onFocus}
            dimmed={focusActive}
          />
        ))}
      </group>
      {focusData && (
        <DeviceFocusState
          device={focusData.device}
          startPos={focusData.startPos}
          active={focusActive}
          onExited={onFocusExited}
        />
      )}
    </>
  );
}
