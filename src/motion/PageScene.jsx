import { motion, useReducedMotion } from "framer-motion";
import { sceneEnter } from "./variants";

// Wrapper di entry/exit coerente per ogni "luogo". Con reduced-motion non
// anima (nessun scale/blur), restituisce un semplice contenitore.
export default function PageScene({ children, className }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={sceneEnter}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
