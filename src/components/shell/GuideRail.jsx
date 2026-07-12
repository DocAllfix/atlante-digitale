import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { overlay } from "@/motion/variants";
import { useSound } from "@/audio/SoundProvider";
import { webglOK } from "@/lib/webgl";
import MuseumMap from "@/components/shell/MuseumMap";

const Corridor3D = lazy(() => import("@/components/shell/Corridor3D"));

// Navigazione globale persistente: un launcher discreto (in alto a sinistra)
// apre una pianta stilizzata del "museo" (MuseumMap) in cui si guida un avatar
// tra le stanze/luoghi. Fa da "sei qui" interattivo, senza replicare il Foyer.
export default function GuideRail() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { playCue } = useSound();
  const [open, setOpen] = useState(false);
  const [webgl] = useState(webglOK);
  const use3D = !reduce && webgl;

  // Blocca lo scroll del corpo mentre la mappa è aperta; Esc chiude.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (to) => {
    playCue("nav");
    setOpen(false);
    if (to !== pathname) navigate(to);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => { if (!open) playCue("open"); setOpen((o) => !o); }}
        data-cursor="link"
        aria-label={open ? "Chiudi la mappa" : "Apri la mappa di navigazione"}
        aria-expanded={open}
        className="fixed top-3 left-3 z-[1400] flex items-center justify-center w-11 h-11 rounded-full bg-[#0b0f18]/85 backdrop-blur-md border border-amber-400/30 text-amber-200 shadow-lg hover:border-amber-400/60 hover:text-amber-100 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="guide-overlay"
            variants={reduce ? undefined : overlay}
            initial={reduce ? { opacity: 1 } : "hidden"}
            animate={reduce ? { opacity: 1 } : "show"}
            exit={reduce ? { opacity: 1 } : "exit"}
            role="dialog"
            aria-modal="true"
            aria-label="Mappa di navigazione"
            className="fixed inset-0 z-[1390] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl px-6 sm:px-10 py-16"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            {use3D ? (
              <Suspense fallback={<p className="text-amber-100/50 text-sm font-outfit">Carico la mappa 3D…</p>}>
                <Corridor3D currentPath={pathname} onEnter={goTo} />
              </Suspense>
            ) : (
              <MuseumMap currentPath={pathname} onEnter={goTo} />
            )}
            <p className="mt-6 text-center text-[11px] text-amber-100/30">Esc per chiudere</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
