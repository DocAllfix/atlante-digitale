import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// Riproduzione nativa della pagina "Aftersun" di culturavisuale.it: uno
// slideshow di 6 pannelli con navigazione a frecce (mouse e tastiera) e
// dissolvenza incrociata. Immagini self-hosted in public/images/aftersun.

const SLIDES = [1, 2, 3, 4, 5, 6].map((n) => `/images/aftersun/${n}.png`);

export default function Aftersun() {
  const [active, setActive] = useState(0);
  const n = SLIDES.length;

  const go = useCallback((dir) => setActive((a) => (a + dir + n) % n), [n]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-outfit select-none">
      {/* Header */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3">
        <a href="/esplora" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors no-underline">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Foyer</span>
        </a>
        <h1 className="font-prompt font-semibold tracking-[0.3em] text-white/90 uppercase text-sm">Aftersun</h1>
        <span className="w-10" />
      </header>

      {/* Slide con dissolvenza incrociata */}
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Aftersun — pannello ${i + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: i === active ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: i === active ? "auto" : "none",
          }}
          draggable={false}
        />
      ))}

      {/* Frecce */}
      <button
        onClick={() => go(-1)}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
        title="Precedente"
        aria-label="Pannello precedente"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
        title="Successivo"
        aria-label="Pannello successivo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicatori */}
      <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            aria-label={`Vai al pannello ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
