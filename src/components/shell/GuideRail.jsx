import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { overlay } from "@/motion/variants";
import { useSound } from "@/audio/SoundProvider";
import ShellRibbon from "@/components/shell/ribbon/ShellRibbon";
import RibbonFallback from "@/components/shell/ribbon/RibbonFallback";
import BackgroundMonitorField from "@/components/shell/ribbon/BackgroundMonitorField";

// Navigazione globale persistente: un launcher discreto (in alto a sinistra)
// apre la shell a "ribbon" — una dorsale di schermi in arco (CSS-3D) tra cui
// scegliere il luogo. Rapida e leggera; con reduced-motion diventa una lista.
export default function GuideRail() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { playCue } = useSound();
  const [open, setOpen] = useState(false);

  // Blocca lo scroll del corpo mentre la shell è aperta; Esc chiude.
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
        onClick={(e) => { if (!open) playCue("open"); setOpen((o) => !o); e.currentTarget.blur(); }}
        data-cursor="link"
        aria-label={open ? "Chiudi il menu" : "Apri il menu di navigazione"}
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
            aria-label="Menu di navigazione"
            className="fixed inset-0 z-[1390] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl px-6 sm:px-10 py-16 overflow-hidden"
          >
            {reduce ? (
              <RibbonFallback currentPath={pathname} onEnter={goTo} />
            ) : (
              <>
                <BackgroundMonitorField />
                {/* Vignettatura lieve: dà stacco all'arco senza spegnere la parete */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.5) 100%)" }} />
                <ShellRibbon currentPath={pathname} onEnter={goTo} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
