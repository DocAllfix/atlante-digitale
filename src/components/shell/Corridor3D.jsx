import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Trail, Html } from "@react-three/drei";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as THREE from "three";

// Mappa-museo in 3D reale (WebGL): un avatar si muove dentro un canale di
// corridoi (avanti/indietro/lati con WASD o frecce, pad su mobile); la scia del
// percorso resta evidenziata in giallo. Le stanze sono varchi lungo i canali;
// avvicinandosi si entra (Invio) o si tocca il varco. Camera in terza persona
// che insegue l'avatar. Fallback 2D gestito da GuideRail (reduced-motion/no-WebGL).

const ROOMS = [
  { to: "/", label: "Soglia", x: 0, z: 11 },
  { to: "/esplora", label: "Foyer", x: 0, z: 0 },
  { to: "/atlante", label: "Atlante", x: -12, z: -2 },
  { to: "/dispositivo", label: "Dispositivo", x: 12, z: -2 },
  { to: "/approfondisci", label: "Approfondisci", x: -7, z: -16 },
  { to: "/aftersun", label: "Aftersun", x: 7, z: -16 },
];
const CORRIDORS = [
  ["/", "/esplora"],
  ["/esplora", "/atlante"],
  ["/esplora", "/dispositivo"],
  ["/atlante", "/approfondisci"],
  ["/dispositivo", "/aftersun"],
];

const SPEED = 4; // unità/secondo
const REACH = 2.4; // raggio d'ingresso a una stanza
const ROOM_R = 1.6; // raggio della camera circolare (= metà larghezza corridoio)
const roomAt = (to) => ROOMS.find((r) => r.to === to);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function Corridor({ a, b }) {
  const ra = roomAt(a), rb = roomAt(b);
  const dx = rb.x - ra.x, dz = rb.z - ra.z;
  const full = Math.hypot(dx, dz);
  // Accorcia il corridoio di uno slargo (pad) a ciascun capo: le pareti si
  // fermano prima del varco, lasciando una radura attorno alla stanza, così i
  // corridoi che vi convergono non si intersecano più al nodo.
  // Pavimento a lunghezza piena (i pavimenti dei corridoi si connettono nel
  // centro delle stanze, niente buchi). Le pareti si fermano a ROOM_R dal
  // centro: i loro estremi vengono poi raccordati dai muri di giunzione della
  // stanza (vedi Room), così le pareti dritte risultano tutte collegate.
  const wallLen = Math.max(0.1, full - 2 * ROOM_R);
  const mx = (ra.x + rb.x) / 2, mz = (ra.z + rb.z) / 2;
  const angle = Math.atan2(dx, dz);
  const w = ROOM_R * 2;
  return (
    <group position={[mx, 0, mz]} rotation={[0, angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[w, full]} />
        <meshStandardMaterial color="#ededed" />
      </mesh>
      {[-w / 2, w / 2].map((sx) => (
        <mesh key={sx} position={[sx, 0.7, 0]}>
          <boxGeometry args={[0.12, 1.4, wallLen]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

// Estremi delle pareti dei corridoi che convergono in una stanza (coord. locali
// rispetto al centro stanza), e muri di giunzione che li raccordano lasciando
// aperte le imboccature dei corridoi.
function junctionSegments(room) {
  const others = CORRIDORS
    .filter(([a, b]) => a === room.to || b === room.to)
    .map(([a, b]) => (a === room.to ? roomAt(b) : roomAt(a)));
  // Solo dove convergono 3+ corridoi servono raccordi: a una foglia (1) o a un
  // gomito (2) le pareti dei corridoi si sovrappongono già senza spezzoni.
  if (others.length < 3) return [];
  const eps = [];
  others.forEach((o, ci) => {
    const dx = o.x - room.x, dz = o.z - room.z, l = Math.hypot(dx, dz);
    const ux = dx / l, uz = dz / l, px = -uz, pz = ux; // perpendicolare
    [1, -1].forEach((s) => {
      const x = ux * ROOM_R + px * s * ROOM_R;
      const z = uz * ROOM_R + pz * s * ROOM_R;
      eps.push({ x, z, ci, ang: Math.atan2(z, x) });
    });
  });
  eps.sort((a, b) => a.ang - b.ang);
  const segs = [];
  for (let i = 0; i < eps.length; i++) {
    const p = eps[i], q = eps[(i + 1) % eps.length];
    if (p.ci !== q.ci) segs.push([p, q]); // raccorda solo tra corridoi diversi
  }
  return segs;
}

function Room({ room, here, near, onEnter }) {
  const color = here ? "#fde68a" : near ? "#facc15" : "#6b5a24";
  const segs = junctionSegments(room);
  return (
    <group position={[room.x, 0, room.z]}>
      {/* Muri di giunzione: uniscono gli estremi delle pareti dei corridoi */}
      {segs.map(([p, q], i) => {
        const dx = q.x - p.x, dz = q.z - p.z;
        const len = Math.hypot(dx, dz);
        return (
          <mesh key={i} position={[(p.x + q.x) / 2, 0.7, (p.z + q.z) / 2]} rotation={[0, Math.atan2(dx, dz), 0]}>
            <boxGeometry args={[0.12, 1.4, len]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.08} />
          </mesh>
        );
      })}
      {/* Marcatore d'ingresso (cliccabile) */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onEnter(room.to); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
        position={[0, 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.8, 1.05, 40]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.6, 16]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={here || near ? 0.9 : 0.28} />
      </mesh>
      <Html position={[0, 2.0, 0]} center distanceFactor={14} pointerEvents="none">
        <div className={`whitespace-nowrap font-prompt uppercase tracking-[0.1em] text-[13px] ${here || near ? "text-amber-100" : "text-amber-100/45"}`}>
          {room.label}{here ? " · sei qui" : ""}
        </div>
      </Html>
    </group>
  );
}

function Player({ keysRef, reachRef, setReach, start }) {
  const ref = useRef();
  const pos = useRef(new THREE.Vector3(start.x, 0.85, start.z));

  useFrame((state, delta) => {
    const k = keysRef.current;
    let dx = 0, dz = 0;
    if (k.has("up")) dz -= 1;
    if (k.has("down")) dz += 1;
    if (k.has("left")) dx -= 1;
    if (k.has("right")) dx += 1;
    if (dx || dz) {
      const l = Math.hypot(dx, dz);
      pos.current.x = clamp(pos.current.x + (dx / l) * SPEED * delta, -16, 16);
      pos.current.z = clamp(pos.current.z + (dz / l) * SPEED * delta, -20, 14);
    }
    if (ref.current) {
      ref.current.position.copy(pos.current);
      ref.current.rotation.y += delta * 1.5; // lenta rotazione della figura
    }

    // Camera in inseguimento morbido.
    const cam = state.camera;
    const t = 1 - Math.pow(0.0015, delta);
    cam.position.lerp(new THREE.Vector3(pos.current.x, pos.current.y + 15, pos.current.z + 6), t);
    cam.lookAt(pos.current.x, 0, pos.current.z);

    // Stanza raggiungibile.
    let near = null, best = REACH;
    for (const r of ROOMS) {
      const d = Math.hypot(r.x - pos.current.x, r.z - pos.current.z);
      if (d < best) { best = d; near = r.to; }
    }
    if (near !== reachRef.current) { reachRef.current = near; setReach(near); }
  });

  return (
    <Trail width={1.1} length={6} color={"#facc15"} decay={1} attenuation={(t) => t * t}>
      <mesh ref={ref} position={[start.x, 0.85, start.z]} rotation={[0.35, 0, 0]}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#fff7cc" emissive="#facc15" emissiveIntensity={1.2} flatShading />
      </mesh>
    </Trail>
  );
}

export default function Corridor3D({ currentPath, onEnter }) {
  const start = roomAt(currentPath) || roomAt("/esplora");
  const keysRef = useRef(new Set());
  const reachRef = useRef(null);
  const [reach, setReach] = useState(null);

  useEffect(() => {
    const map = {
      ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
      ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
    };
    const down = (e) => {
      if (e.code === "Enter") { if (reachRef.current) onEnter(reachRef.current); return; }
      const d = map[e.code];
      if (d) { keysRef.current.add(d); e.preventDefault(); }
    };
    const up = (e) => { const d = map[e.code]; if (d) keysRef.current.delete(d); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      document.body.style.cursor = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = (dir) => ({
    onPointerDown: (e) => { e.preventDefault(); keysRef.current.add(dir); },
    onPointerUp: () => keysRef.current.delete(dir),
    onPointerLeave: () => keysRef.current.delete(dir),
    onPointerCancel: () => keysRef.current.delete(dir),
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.4em] text-amber-300/60 mb-4 font-prompt">Sei qui</p>

      <div className="relative w-full aspect-[16/10] rounded-2xl border border-amber-400/15 overflow-hidden bg-black">
        <Canvas shadows camera={{ position: [start.x, 15, start.z + 6], fov: 55 }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 14, 34]} />
          <ambientLight intensity={0.35} />
          <pointLight position={[0, 12, 6]} intensity={60} color="#ffe6a8" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -4]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          {CORRIDORS.map(([a, b]) => <Corridor key={`${a}-${b}`} a={a} b={b} />)}
          {ROOMS.map((r) => (
            <Room key={r.to} room={r} here={r.to === currentPath} near={r.to === reach} onEnter={onEnter} />
          ))}
          <Player keysRef={keysRef} reachRef={reachRef} setReach={setReach} start={start} />
        </Canvas>

        {reach && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-amber-100/80 bg-black/50 px-2.5 py-1 rounded-full border border-amber-400/20">
            <span className="hidden sm:inline">Invio per entrare in </span>
            <button onClick={() => onEnter(reach)} className="sm:hidden underline">Entra in </button>
            <span className="text-amber-200 font-prompt uppercase tracking-[0.06em]">{roomAt(reach)?.label}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[11px] sm:text-xs text-amber-100/50 leading-relaxed">
          <span className="hidden sm:inline">Muovi l'avatar nel corridoio con le <strong className="text-amber-200/80">frecce</strong> o <strong className="text-amber-200/80">WASD</strong>: avanti, indietro, a destra e a sinistra. Avvicinati a un varco e premi <strong className="text-amber-200/80">Invio</strong> per entrare (o toccalo).</span>
          <span className="sm:hidden">Usa il pad per muovere l'avatar nel corridoio, oppure <strong className="text-amber-200/80">tocca</strong> un varco per entrare.</span>
        </p>
        <div className="sm:hidden shrink-0 grid grid-cols-3 grid-rows-3 gap-1 w-28">
          <span />
          <button {...hold("up")} aria-label="Avanti" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronUp className="w-4 h-4" /></button>
          <span />
          <button {...hold("left")} aria-label="Sinistra" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronLeft className="w-4 h-4" /></button>
          <span className="flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-amber-400/40" /></span>
          <button {...hold("right")} aria-label="Destra" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronRight className="w-4 h-4" /></button>
          <span />
          <button {...hold("down")} aria-label="Indietro" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronDown className="w-4 h-4" /></button>
          <span />
        </div>
      </div>
    </div>
  );
}
