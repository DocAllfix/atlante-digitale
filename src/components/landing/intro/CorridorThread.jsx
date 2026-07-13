import { motion, useTransform } from "framer-motion";

// Avanzamento come "cometa": un punto luminoso che scende (a partire dalla
// citazione) lasciando una scia morbida che sfuma — nessuna linea fissa/spezzata.
// Si sviluppa con lo scroll e culmina in fondo, in corrispondenza della CTA.
const START = 0.08; // ~ centro citazione
const END = 0.94; // ~ centro CTA

export default function CorridorThread({ progress }) {
  const headTop = useTransform(progress, [START, END], ["0%", "100%"]);
  const trailH = useTransform(progress, [START, END], ["0%", "100%"]);
  const appear = useTransform(progress, [0, START, END, 1], [0, 1, 1, 0.7]);

  return (
    <motion.div
      style={{ opacity: appear }}
      className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 h-[62vh] w-6 z-10 pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative h-full w-full">
        {/* scia che sfuma verso l'alto */}
        <motion.div
          style={{
            height: trailH,
            background: "linear-gradient(to bottom, transparent, rgba(251,191,36,0) 25%, rgba(251,191,36,0.5))",
            filter: "blur(1.5px)",
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full"
        />
        {/* testa luminosa */}
        <motion.div
          style={{
            top: headTop,
            boxShadow: "0 0 10px 3px rgba(251,191,36,0.85), 0 0 24px 7px rgba(251,191,36,0.35)",
          }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-200"
        />
      </div>
    </motion.div>
  );
}
