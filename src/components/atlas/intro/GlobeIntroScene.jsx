import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildWorldTexture } from "@/lib/worldTexture";
import { atlasTheme } from "@/lib/atlasTheme";

// Scena dell'intro: una sfera (texture-atlante) che ruota e poi si "srotola" in
// un piano equirettangolare (morph dei vertici, lerp CPU), mentre la camera
// arretra per rivelare il planisfero e il materiale sfuma → handoff alla mappa.

const SEG_X = 128;
const SEG_Y = 64;
const R = 1;

// Tempistica (secondi). Il clock può essere accelerato (skip) moltiplicando dt.
const ROT_END = 2.1;
const MORPH_END = 3.5;
const DONE_AT = 3.7; // breve tenuta sul planisfero prima dell'handoff

const CAM_NEAR = 2.6; // globo che riempie
const CAM_FAR = 4.7; // planisfero intero

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

// Griglia lat/long con posizioni-sfera e posizioni-piano precalcolate.
function buildMorphGeometry() {
  const vx = SEG_X + 1;
  const vy = SEG_Y + 1;
  const count = vx * vy;
  const sphere = new Float32Array(count * 3);
  const plane = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);

  let i = 0;
  for (let yy = 0; yy < vy; yy++) {
    const v = yy / SEG_Y; // 0 = polo nord
    const lat = (0.5 - v) * Math.PI; // +π/2 → -π/2
    for (let xx = 0; xx < vx; xx++) {
      const u = xx / SEG_X; // 0 = -180°
      const lon = (u - 0.5) * 2 * Math.PI; // -π → +π
      const cl = Math.cos(lat);
      sphere[i * 3] = R * cl * Math.sin(lon);
      sphere[i * 3 + 1] = R * Math.sin(lat);
      sphere[i * 3 + 2] = R * cl * Math.cos(lon);
      plane[i * 3] = (u - 0.5) * 2 * Math.PI * R;
      plane[i * 3 + 1] = (0.5 - v) * Math.PI * R;
      plane[i * 3 + 2] = 0;
      uv[i * 2] = u;
      uv[i * 2 + 1] = 1 - v;
      i++;
    }
  }

  const index = [];
  for (let yy = 0; yy < SEG_Y; yy++) {
    for (let xx = 0; xx < SEG_X; xx++) {
      const a = yy * vx + xx;
      const b = a + 1;
      const c = a + vx;
      const d = c + 1;
      index.push(a, c, b, b, c, d);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(sphere.slice(), 3));
  geom.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geom.setIndex(index);
  return { geom, sphere, plane };
}

export default function GlobeIntroScene({ darkMode, skip, onComplete }) {
  const meshRef = useRef(null);
  const matRef = useRef(null);
  const tRef = useRef(0);
  const doneRef = useRef(false);
  const skipRef = useRef(skip);
  useEffect(() => { skipRef.current = skip; }, [skip]);

  const { geom, sphere, plane } = useMemo(buildMorphGeometry, []);
  const { camera } = useThree();

  // Texture-atlante (async, con cache): appena pronta viene applicata.
  useEffect(() => {
    let alive = true;
    buildWorldTexture(darkMode).then((tex) => {
      if (alive && matRef.current) {
        matRef.current.map = tex;
        matRef.current.color.set(0xffffff); // mostra i colori reali della texture
        matRef.current.needsUpdate = true;
      }
    });
    return () => { alive = false; };
  }, [darkMode]);

  useFrame((_, delta) => {
    if (doneRef.current) return;
    tRef.current += Math.min(delta, 0.05) * (skipRef.current ? 6 : 1);
    const t = tRef.current;

    const m = easeInOut(clamp01((t - ROT_END) / (MORPH_END - ROT_END)));

    // Morph sfera → piano (lerp CPU sulle posizioni).
    const pos = meshRef.current.geometry.attributes.position.array;
    for (let k = 0; k < pos.length; k++) pos[k] = sphere[k] * (1 - m) + plane[k] * m;
    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotazione: gira finché è globo, poi si riavvolge a 0 (fronte alla camera).
    meshRef.current.rotation.y = t < ROT_END ? t * 0.5 : (1 - m) * (ROT_END * 0.5);

    // Camera: si allontana per rivelare il planisfero.
    camera.position.z = CAM_NEAR + (CAM_FAR - CAM_NEAR) * m;
    camera.lookAt(0, 0, 0);

    // A morph completato (breve tenuta) → handoff: l'host dissolve l'overlay
    // rivelando la mappa sottostante (crossfade).
    if (t >= DONE_AT) { doneRef.current = true; onComplete(); }
  });

  const sea = atlasTheme[darkMode ? "dark" : "light"].mapBg;
  return (
    <mesh ref={meshRef} geometry={geom}>
      <meshBasicMaterial ref={matRef} color={sea} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}
