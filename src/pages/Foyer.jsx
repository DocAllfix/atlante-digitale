import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, Sparkles, Users, Clock, Film, MonitorPlay } from "lucide-react";

// Foyer d'ingresso dell'atlante — griglia in stile "museo" (culturavisuale.it):
// più punti d'accesso ai contenuti (mappa, temi, linea del tempo, saggi).
// Interamente autonomo: nessun asset esterno, tema chiaro/scuro.

const TILES = [
  { to: "/atlante", title: "Atlante interattivo", subtitle: "Mappa storica · autori · temi", icon: Map, span: 2, tone: "from-amber-500/25 to-amber-800/10" },
  { to: "/atlante", title: "Onirismo", subtitle: "Federico Fellini · Roma", icon: Sparkles, tone: "from-indigo-500/20 to-slate-800/10" },
  { to: "/atlante", title: "Femminismo", subtitle: "Lo sguardo e la differenza", icon: Users, tone: "from-rose-500/20 to-slate-800/10" },
  { to: "/atlante", title: "Black Studies", subtitle: "Diaspora e cultura visuale", icon: Users, tone: "from-emerald-500/20 to-slate-800/10" },
  { to: "/atlante", title: "Linea del tempo", subtitle: "Dal 1601 a oggi", icon: Clock, tone: "from-sky-500/20 to-slate-800/10" },
  { to: "/aftersun", title: "Aftersun", subtitle: "Saggio visuale", icon: Film, tone: "from-orange-500/20 to-slate-800/10" },
  { to: "/dispositivo", title: "Dispositivo", subtitle: "1871 → 2025", icon: MonitorPlay, tone: "from-violet-500/20 to-slate-800/10" },
];

export default function Foyer() {
  const [darkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-darkmode") || "true"); } catch { return true; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("atlas-foyer-light", !darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen w-full font-outfit ${darkMode ? "bg-[#070a12] text-amber-50" : "bg-[#f7f2e9] text-stone-800"}`}>
      <a href="#contenuto" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded focus:bg-amber-400 focus:text-black">
        Vai al contenuto
      </a>

      <header className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <p className={`text-xs uppercase tracking-[0.35em] ${darkMode ? "text-amber-300/70" : "text-amber-800/70"}`}>Chronos Atlas</p>
        <p className={`mt-4 max-w-2xl text-sm sm:text-base ${darkMode ? "text-amber-100/70" : "text-stone-600"}`}>
          Un atlante digitale per la memoria storica, artistica e visuale. Entra da dove
          preferisci: la mappa, un tema, un autore, la linea del tempo. Ogni percorso è
          connesso agli altri.
        </p>
      </header>

      <main id="contenuto" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="[column-gap:1rem] columns-1 sm:columns-2 lg:columns-3">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            const inner = (
              <div className={`group relative mb-4 block break-inside-avoid rounded-2xl overflow-hidden border ${darkMode ? "border-white/10" : "border-black/10"} bg-gradient-to-br ${tile.tone} ${tile.span === 2 ? "sm:min-h-[16rem]" : "min-h-[11rem]"} transition-transform duration-300 hover:-translate-y-1`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5" />
                <div className="relative p-6 flex flex-col justify-between h-full min-h-[inherit]">
                  <Icon className={`w-7 h-7 ${darkMode ? "text-amber-200" : "text-amber-800"}`} />
                  <div className="mt-8">
                    <h2 className="font-prompt font-semibold text-xl">{tile.title}</h2>
                    <p className={`mt-1 text-sm ${darkMode ? "text-amber-100/60" : "text-stone-600"}`}>{tile.subtitle}</p>
                    {tile.soon && <span className="inline-block mt-3 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-current opacity-70">In arrivo</span>}
                  </div>
                </div>
              </div>
            );
            return tile.soon
              ? <div key={tile.title} aria-disabled className="cursor-default opacity-80">{inner}</div>
              : <Link key={tile.title} to={tile.to} className="no-underline text-inherit">{inner}</Link>;
          })}
        </div>
      </main>
    </div>
  );
}
