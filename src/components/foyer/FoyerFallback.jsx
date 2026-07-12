import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/theme/ThemeProvider";
import { useGuidedPath } from "@/guided/GuidedPathProvider";
import { stagger, revealUp } from "@/motion/variants";

// Atrio d'ingresso 2.5D: fallback del Foyer per reduced-motion / assenza di
// WebGL. Poche "aperture" tipografiche verso i luoghi dell'ambiente, che si
// accendono in sequenza e si aprono all'hover; in fondo i percorsi tematici.

const PLACES = [
  { to: "/atlante", kind: "Cartografia", title: "Atlante", desc: "La mappa: paesi, autori e temi che cambiano nel tempo." },
  { to: "/dispositivo", kind: "Tempo", title: "Dispositivo", desc: "Un secolo e mezzo di sguardi meccanici · 1894 → 2025." },
  { to: "/aftersun", kind: "Saggio", title: "Aftersun", desc: "Un affondo visuale, per immagini." },
];

// I temi con themeId avviano un percorso guidato (conductor); gli altri sono
// semplici varchi verso l'Atlante.
const THREADS = [
  { themeId: "onirismo", label: "Onirismo", hint: "Fellini · Roma" },
  { themeId: "femminismo", label: "Femminismo", hint: "Lo sguardo e la differenza" },
  { themeId: "black_studies", label: "Black Studies", hint: "Diaspora e cultura visuale" },
  { to: "/atlante", label: "Linea del tempo", hint: "Dal 1601 a oggi" },
];

export default function FoyerFallback() {
  const { darkMode } = useTheme();
  const { start } = useGuidedPath();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("atlas-foyer-light", !darkMode);
  }, [darkMode]);

  const eyebrow = darkMode ? "text-amber-300/70" : "text-amber-800/70";
  const muted = darkMode ? "text-amber-100/60" : "text-stone-600";
  const rule = darkMode ? "border-white/10" : "border-black/10";
  const accent = darkMode ? "text-amber-300" : "text-amber-800";
  const titleIdle = darkMode ? "text-amber-50/70 group-hover:text-amber-50" : "text-stone-800/70 group-hover:text-stone-900";
  const chip = darkMode
    ? "border-white/10 text-amber-100/80 hover:border-amber-400/50 hover:text-amber-100"
    : "border-black/10 text-stone-700 hover:border-amber-700/40 hover:text-stone-900";

  const container = reduce ? {} : { variants: stagger, initial: "hidden", animate: "show" };
  const item = reduce ? {} : { variants: revealUp };

  return (
    <div className={`min-h-screen w-full font-outfit ${darkMode ? "bg-black text-amber-50" : "bg-[#f7f2e9] text-stone-800"}`}>
      <a href="#contenuto" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded focus:bg-amber-400 focus:text-black">
        Vai al contenuto
      </a>

      <motion.main id="contenuto" {...container} className="max-w-5xl mx-auto px-6 py-24 sm:py-28">
        <motion.p {...item} className={`text-xs uppercase tracking-[0.35em] ${eyebrow}`}>Chronos Atlas</motion.p>
        <motion.p {...item} className={`mt-5 max-w-2xl text-sm sm:text-base ${muted}`}>
          Un atlante digitale per la memoria storica, artistica e visuale. Non un indice:
          uno spazio da attraversare. Scegli da dove entrare — ogni luogo è connesso agli altri.
        </motion.p>

        <div className="mt-16 sm:mt-20">
          {PLACES.map((p) => (
            <motion.div key={p.title} {...item}>
              <Link
                to={p.to}
                data-cursor="link"
                className={`group relative block border-t ${rule} py-6 sm:py-7 no-underline text-inherit`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className={`text-[11px] uppercase tracking-[0.3em] ${accent} opacity-70`}>{p.kind}</span>
                    <h2 className={`mt-1.5 font-prompt uppercase tracking-[0.05em] text-4xl sm:text-6xl leading-[1.02] transition-colors ${titleIdle}`}>
                      {p.title}
                    </h2>
                    <p className={`mt-2.5 max-w-md text-sm ${muted}`}>{p.desc}</p>
                  </div>
                  <ArrowUpRight className={`w-6 h-6 shrink-0 ${accent} opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1`} />
                </div>
                {/* Aperture: linea ambra che si apre da sinistra all'hover/focus. */}
                <span className="pointer-events-none absolute left-0 -top-px h-px w-0 bg-amber-400/70 transition-[width] duration-500 ease-out group-hover:w-full group-focus-visible:w-full" />
              </Link>
            </motion.div>
          ))}
          <div className={`border-t ${rule}`} />
        </div>

        <motion.div {...item} className="mt-16 sm:mt-20">
          <p className={`text-[11px] uppercase tracking-[0.3em] ${accent} opacity-70`}>Percorsi tematici</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {THREADS.map((t) => {
              const inner = (
                <>
                  <span className="font-prompt tracking-[0.04em]">{t.label}</span>
                  <span className={`text-[11px] ${muted}`}>{t.hint}</span>
                </>
              );
              const cls = `group inline-flex flex-col text-left rounded-xl border px-4 py-3 no-underline transition-colors ${chip}`;
              return t.themeId ? (
                <button key={t.label} onClick={() => start(t.themeId)} data-cursor="link" className={cls}>
                  {inner}
                </button>
              ) : (
                <Link key={t.label} to={t.to} data-cursor="link" className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
