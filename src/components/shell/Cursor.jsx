import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Cursore-strumento sobrio: un punto ambra preciso + un anello che insegue con
// leggero ritardo (molla) e si ingrandisce sugli elementi "vivi". Rivela le
// affordance, non intrattiene. Attivo SOLO su puntatore fine e senza
// reduced-motion: su touch/tastiera resta il cursore di sistema.
export default function Cursor() {
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    const finePointer =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    setActive(true);
    document.documentElement.classList.add("cursor-none");
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target?.closest?.("a, button, [role='button'], [data-cursor]");
      setHovering(!!t);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("cursor-none");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2000]" aria-hidden="true">
      <motion.div
        style={{ x, y }}
        className="absolute -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-amber-300"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        className={`absolute rounded-full border border-amber-300/60 transition-[width,height,margin,opacity] duration-200 ${
          hovering ? "w-10 h-10 -ml-5 -mt-5 opacity-100" : "w-6 h-6 -ml-3 -mt-3 opacity-70"
        }`}
      />
    </div>
  );
}
