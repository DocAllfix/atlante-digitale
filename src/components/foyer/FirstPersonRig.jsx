import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EYE, SPEED, REACH, ENTER_DIST, BOUNDS, OBSTACLES, COLLISION_PAD, clamp, PORTALS } from "@/components/foyer/foyerConfig";

// Rig first-person raffinato: mantiene la logica (input, ingresso, prossimità,
// gating temi) ma aggiunge qualità percettiva — inerzia (accel/decel), head-bob
// micro proporzionale alla velocità, roll (banking) in strafe, camera smussata
// e collisioni a padding contro gli ostacoli. Lo sguardo resta dritto in avanti.

const ACCEL = 9; // reattività verso la velocità desiderata
const DECEL = 7; // smorzamento quando si rilascia
const BOB_FREQ = 9; // frequenza del passo
const BOB_AMP = 0.045; // ampiezza verticale del passo
const ROLL = 0.03; // banking massimo in strafe (rad)
const ROLL_SMOOTH = 6;

function resolveCollisions(x, z) {
  for (const o of OBSTACLES) {
    const dx = x - o.x, dz = z - o.z;
    const d = Math.hypot(dx, dz);
    const min = o.r + COLLISION_PAD;
    if (d < min && d > 1e-4) {
      x = o.x + (dx / d) * min;
      z = o.z + (dz / d) * min;
    }
  }
  return [x, z];
}

export default function FirstPersonRig({ keysRef, reachRef, setReach, enterTargetRef, themesShownRef, setThemesShown, playerPosRef, onCross }) {
  const pos = useRef(new THREE.Vector3(0, 0, 2));
  const sync = () => { if (playerPosRef) { playerPosRef.current.x = pos.current.x; playerPosRef.current.z = pos.current.z; } };
  const vel = useRef(new THREE.Vector3());
  const bobT = useRef(0);
  const rollRef = useRef(0);

  useFrame((state, delta) => {
    const cam = state.camera;

    // Ingresso: volo nel portale, comandi/inerzia ignorati.
    const et = enterTargetRef.current;
    if (et) {
      const k = Math.min(1, delta * 3);
      pos.current.x += (et.x - pos.current.x) * k;
      pos.current.z += (et.z - pos.current.z) * k;
      cam.position.set(pos.current.x, EYE, pos.current.z);
      cam.lookAt(et.x, EYE, et.z - 6);
      cam.rotation.z = 0;
      sync();
      return;
    }

    const keys = keysRef.current;
    let mf = 0, ms = 0;
    if (keys.has("up")) mf += 1;
    if (keys.has("down")) mf -= 1;
    if (keys.has("right")) ms += 1;
    if (keys.has("left")) ms -= 1;

    // Velocità desiderata (sguardo dritto: -z avanti, +x destra).
    let dx = ms, dz = -mf;
    const dl = Math.hypot(dx, dz);
    if (dl > 0) { dx = (dx / dl) * SPEED; dz = (dz / dl) * SPEED; }
    // Inerzia: accelera verso la desiderata, decelera a zero.
    const rate = dl > 0 ? ACCEL : DECEL;
    const a = Math.min(1, rate * delta);
    vel.current.x += (dx - vel.current.x) * a;
    vel.current.z += (dz - vel.current.z) * a;

    // Integrazione + collisioni + limiti.
    let nx = pos.current.x + vel.current.x * delta;
    let nz = pos.current.z + vel.current.z * delta;
    [nx, nz] = resolveCollisions(nx, nz);
    nx = clamp(nx, BOUNDS.x[0], BOUNDS.x[1]);
    nz = clamp(nz, BOUNDS.z[0], BOUNDS.z[1]);
    pos.current.set(nx, 0, nz);
    sync();

    // Head-bob ∝ velocità.
    const speed = Math.hypot(vel.current.x, vel.current.z);
    const speedNorm = Math.min(1, speed / SPEED);
    bobT.current += delta * BOB_FREQ * speedNorm;
    const bob = Math.sin(bobT.current) * BOB_AMP * speedNorm;

    // Roll (banking) in strafe, smussato.
    const targetRoll = -(vel.current.x / SPEED) * ROLL;
    rollRef.current += (targetRoll - rollRef.current) * Math.min(1, ROLL_SMOOTH * delta);

    cam.position.set(pos.current.x, EYE + bob, pos.current.z);
    cam.lookAt(pos.current.x, EYE + bob, pos.current.z - 10);
    cam.rotation.z = rollRef.current;

    // Prossimità ai portali.
    let near = null, best = REACH;
    for (const p of PORTALS) {
      const d = Math.hypot(p.pos[0] - pos.current.x, p.pos[2] - pos.current.z);
      if (d < best) { best = d; near = p.to; }
    }
    if (near !== reachRef.current) { reachRef.current = near; setReach(near); }

    // Attraversamento: se si entra abbastanza nel varco, si entra (no Invio).
    if (near && best < ENTER_DIST) onCross?.(near);

    // I temi si scoprono dopo aver superato Aftersun.
    const past = pos.current.z < -18.5;
    if (past !== themesShownRef.current) { themesShownRef.current = past; setThemesShown(past); }
  });

  return null;
}
