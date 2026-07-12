import { useEffect } from "react";
import { motion } from "framer-motion";
import ShellMediaSurface from "@/components/shell/ribbon/ShellMediaSurface";

// Transizione di selezione: lo schermo scelto zooma verso l'osservatore fino a
// riempire, poi `onDone` → navigazione (la transizione-scena dell'app riprende).
export default function ShellTransitionController({ screen, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 460);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[1395] pointer-events-none flex items-center justify-center"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,1)" }}
      transition={{ duration: 0.42 }}
    >
      <motion.div
        className="relative w-64 h-40 rounded-md overflow-hidden"
        style={{ boxShadow: `0 0 0 2px ${screen.accent}, 0 0 70px ${screen.accent}` }}
        initial={{ scale: 1 }}
        animate={{ scale: 7 }}
        transition={{ duration: 0.46, ease: [0.6, 0, 0.35, 1] }}
      >
        <ShellMediaSurface media={screen.media} accent={screen.accent} />
      </motion.div>
    </motion.div>
  );
}
