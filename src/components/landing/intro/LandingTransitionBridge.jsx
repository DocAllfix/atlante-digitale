import { motion, useTransform } from "framer-motion";

// Cucitura con la prima parte: un tenue bagliore ambra all'ingresso del
// corridoio, eco della luce dell'ambra dell'hero, che si dissolve appena si
// entra nei piani → passaggio fluido, nessun taglio.
export default function LandingTransitionBridge({ progress }) {
  const opacity = useTransform(progress, [0, 0.12, 0.32], [0.55, 0.4, 0]);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[70vw] h-[75vh]"
        style={{ background: "radial-gradient(ellipse at top, rgba(251,191,36,0.16), transparent 62%)" }}
      />
    </motion.div>
  );
}
