import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

// Riproduzione nativa della pagina "Dispositivo" di culturavisuale.it:
// una linea del tempo 1871→2025 lungo i due assi "Cervello" e "Pellicola",
// dai primi apparecchi cinematografici alle console e alla realtà virtuale.
// Reimplementata senza embed esterni (leggerezza, nessuna obsolescenza).

const AXIS = { cervello: "Cervello", pellicola: "Pellicola" };

// axis: quale traccia occupa la voce (sinistra = cervello, destra = pellicola).
const ENTRIES = [
  { year: 1871, name: "Cervello", axis: "cervello", origin: true },
  { year: 1891, name: "Pellicola", axis: "pellicola", origin: true },
  { year: 1894, name: "Kinematrograph", axis: "pellicola" },
  { year: 1895, name: "Kinetoscope", axis: "pellicola" },
  { year: 1895, name: "Cinématographe", axis: "pellicola" },
  { year: 1897, name: "Mutograph", axis: "pellicola" },
  { year: 1897, name: "Pathé", axis: "pellicola" },
  { year: 1903, name: "Lubin Camera", axis: "pellicola" },
  { year: 1908, name: "Prevost", axis: "pellicola" },
  { year: 1912, name: "Bell & Howell", axis: "pellicola" },
  { year: 1920, name: "Mitchell Camera", axis: "pellicola" },
  { year: 1920, name: "Pathé Baby", axis: "pellicola" },
  { year: 1925, name: "Eyemo Camera", axis: "pellicola" },
  { year: 1936, name: "Multiplane", axis: "pellicola" },
  { year: 1962, name: "Sensorama", axis: "cervello" },
  { year: 1965, name: "MGM Camera", axis: "pellicola" },
  { year: 1968, name: "Spada di Damocle", axis: "cervello" },
  { year: 1985, name: "Sony Handcam", axis: "pellicola" },
  { year: 1987, name: "Videoproiettore", axis: "pellicola" },
  { year: 1989, name: "Gameboy", axis: "cervello" },
  { year: 1994, name: "Playstation 1", axis: "cervello" },
  { year: 1998, name: "Gameboy Color", axis: "cervello" },
  { year: 1999, name: "Pocketstation", axis: "cervello" },
  { year: 2000, name: "Proiettore LCD", axis: "pellicola" },
  { year: 2000, name: "Gameboy Advance", axis: "cervello" },
  { year: 2000, name: "Playstation 2", axis: "cervello" },
  { year: 2000, name: "Xbox", axis: "cervello" },
  { year: 2005, name: "Nintendo DS", axis: "cervello" },
  { year: 2005, name: "Nintendo Wii", axis: "cervello" },
  { year: 2005, name: "Xbox 360", axis: "cervello" },
  { year: 2007, name: "Playstation 3", axis: "cervello" },
  { year: 2010, name: "Nintendo 3DS", axis: "cervello" },
  { year: 2011, name: "Nintendo Wii U", axis: "cervello" },
  { year: 2013, name: "Playstation 4", axis: "cervello" },
  { year: 2013, name: "Xbox One", axis: "cervello" },
  { year: 2016, name: "HTC Vive", axis: "cervello" },
  { year: 2016, name: "Nintendo Switch", axis: "cervello" },
  { year: 2016, name: "Oculus Rift", axis: "cervello" },
  { year: 2016, name: "Playstation VR", axis: "cervello" },
  { year: 2020, name: "Playstation 5", axis: "cervello" },
  { year: 2020, name: "Xbox Series S/X", axis: "cervello" },
  { year: 2025, name: "Nintendo Switch 2", axis: "cervello" },
];

function Row({ entry, index }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const left = entry.axis === "cervello";
  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition: "opacity .6s ease, transform .6s ease",
      }}
    >
      {/* lato sinistro (Cervello) */}
      <div className={`text-right ${left ? "" : "opacity-0 pointer-events-none select-none"}`}>
        {left && <Item entry={entry} align="right" />}
      </div>
      {/* nodo centrale */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${entry.origin ? "bg-amber-300" : "bg-amber-400/70"} shadow-[0_0_10px_rgba(251,191,36,0.7)]`} />
      </div>
      {/* lato destro (Pellicola) */}
      <div className={`text-left ${left ? "opacity-0 pointer-events-none select-none" : ""}`}>
        {!left && <Item entry={entry} align="left" />}
      </div>
    </div>
  );
}

function Item({ entry, align }) {
  return (
    <div className={align === "right" ? "items-end" : "items-start"}>
      <div className="text-amber-300 font-prompt font-semibold tabular-nums">{entry.year}</div>
      <div className={`text-amber-50/90 ${entry.origin ? "uppercase tracking-widest text-xs mt-0.5" : "text-sm"}`}>{entry.name}</div>
    </div>
  );
}

export default function Dispositivo() {
  return (
    <div className="min-h-screen w-full bg-[#070a12] text-amber-50 font-outfit">
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#070a12]/85 backdrop-blur-md border-b border-white/10">
        <a href="/" className="flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Foyer</span>
        </a>
        <div className="text-center">
          <h1 className="font-prompt font-bold tracking-[0.2em]">DISPOSITIVO</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200/60">Cervello · Pellicola — 1871 → 2025</p>
        </div>
        <span className="w-10" />
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 pb-4 mb-2 border-b border-white/10 text-[11px] uppercase tracking-widest text-amber-200/60">
          <div className="text-right">{AXIS.cervello}</div>
          <div className="w-3" />
          <div className="text-left">{AXIS.pellicola}</div>
        </div>
        <div className="relative">
          {/* spina dorsale */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/10 via-amber-400/40 to-amber-400/10" />
          {ENTRIES.map((entry, i) => (
            <Row key={`${entry.year}-${entry.name}`} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
