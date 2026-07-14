import { motion, useTransform, useMotionTemplate } from "framer-motion";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DEPTH = 700; // profondità (px) da cui il piano emerge e verso cui esce

// Piano di profondità del corridoio (DepthParallaxSystem): dentro un viewport in
// prospettiva, il piano emerge dal fondo (translateZ negativo, sfocato) → TIENE
// leggibile al centro (z=0, nitido) → avanza oltre la camera e dissolve. Il
// dwell è dato dalla finestra di scroll (l'utente controlla il tempo).
export default function CorridorPlane({ index, total, progress, holdToEnd, immediate, children }) {
  const seg = 1 / total;
  // "immediate" (la citazione, piano 0): già leggibile appena si entra nel
  // corridoio, senza il consueto emergere dalla profondità — il passaggio
  // dall'hero deve andare dritto alla citazione, non lasciare un vuoto prima.
  // (e, hs) devono restare distinti: useTransform richiede un dominio in
  // salita stretta, due punti identici darebbero un'interpolazione indefinita.
  const e = immediate ? 0 : clamp(index * seg - seg * 0.55, 0, 1);
  const hs = immediate ? 0.001 : clamp(index * seg + seg * 0.12, 0, 1);
  const he = clamp(index * seg + seg * 0.88, 0, 1);
  const x = clamp(index * seg + seg * 1.15, 0, 1);
  const range = [e, hs, he, x];

  const z = useTransform(progress, range, [immediate ? 0 : -DEPTH, 0, 0, holdToEnd ? 0 : DEPTH * 0.55]);
  const opacity = useTransform(progress, range, [immediate ? 1 : 0, 1, 1, holdToEnd ? 1 : 0]);
  const blurPx = useTransform(progress, range, [immediate ? 0 : 10, 0, 0, holdToEnd ? 0 : 10]);
  const transform = useMotionTemplate`translateZ(${z}px)`;
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      style={{ transform, opacity, filter }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="max-w-3xl w-full">{children}</div>
    </motion.div>
  );
}
