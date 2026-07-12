import { allDevices } from "@/lib/dispositivo-selectors";
import { LAYOUT } from "@/components/dispositivi/dispositiviConfig";

// Jitter deterministico da indice (nessuna casualità a runtime → posizioni stabili).
const hash = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

// Posizione di un dispositivo lungo la deriva orbitale (indice = ordine
// cronologico). Spirale ellittica che "respira", con lieve jitter organico.
export function deviceLayout(i) {
  const { R_BASE, R_BREATHE, ANGLE_STEP, Z_STEP, Y_SQUASH } = LAYOUT;
  const angle = i * ANGLE_STEP + (hash(i) - 0.5) * 0.6;
  const radius = R_BASE + R_BREATHE * Math.sin(i * 0.5) + (hash(i + 99) - 0.5) * 1.3;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * Y_SQUASH,
    z: -i * Z_STEP,
  };
}

// Tutti i dispositivi con posizione e indice (cronologico).
export function layoutDevices() {
  return allDevices().map((device, index) => ({ device, index, pos: deviceLayout(index) }));
}

// Estremi in Z della deriva (per camera e lunghezza scroll).
export function driftBounds(count) {
  return { zStart: 0, zEnd: -(count - 1) * LAYOUT.Z_STEP };
}
