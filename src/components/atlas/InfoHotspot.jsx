import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { atlasTheme } from "@/lib/atlasTheme";

// Targhetta informativa da angolo: piccola icona "i" che apre
// un pop-up descrittivo. Non blocca la navigazione tra le stanze.
export default function InfoHotspot({ hotspot, darkMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const { title, description } = hotspot;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`relative flex items-center justify-center w-6 h-6 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} text-amber-300 shadow-lg transition-all duration-200 hover:scale-110`}
        title={title}
        aria-label={`Informazioni: ${title}`}
        aria-expanded={open}
      >
        {!open && (
          <span
            className="absolute inset-0 rounded-full border border-amber-400/40"
            style={{ animation: "info-ping 2.5s cubic-bezier(0.4,0,0.2,1) infinite" }}
          />
        )}
        <Info className="w-3 h-3 relative" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -6 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute top-7 right-0 w-52 rounded-lg ${t.sidebarBg} backdrop-blur-md border ${t.sidebarBorder} shadow-2xl p-3 z-40`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`text-[11px] font-bold ${t.centuryText} font-prompt uppercase tracking-wide leading-tight`}>{title}</h4>
              <button onClick={() => setOpen(false)} className={`${t.buttonText} hover:opacity-70 flex-shrink-0`} aria-label="Chiudi">

                <X className="w-3 h-3" />
              </button>
            </div>
            <p className={`text-xs leading-relaxed ${t.periodInactive} font-body`}>{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}