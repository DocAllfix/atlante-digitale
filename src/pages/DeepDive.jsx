import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { getDeepDiveContent } from "@/lib/deepDiveContent";
import { atlasTheme } from "@/lib/atlasTheme";
import MuseumRoom from "@/components/atlas/MuseumRoom";


export default function DeepDive() {
  const [params] = useSearchParams();
  const city = params.get("city") || "rome";
  const period = params.get("period") || "1961-1970";
  const content = getDeepDiveContent(city);

  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-darkmode") || "true"); } catch { return true; }
  });
  useEffect(() => {
    localStorage.setItem("atlas-darkmode", JSON.stringify(darkMode));
  }, [darkMode]);

  const t = atlasTheme[darkMode ? "dark" : "light"];
  const nodes = content?.nodes || [];

  const startIndex = useMemo(() => {
    const idx = nodes.findIndex((n) => n.periodId === period);
    return idx >= 0 ? idx : 0;
  }, [nodes, period]);

  const [active, setActive] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(0);
  const lockRef = useRef(false);
  const rootRef = useRef(null);
  const roomRefs = useRef([]);
  const activeRef = useRef(active);
  activeRef.current = active;

  const n = nodes.length;
  const go = (dir) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setTransitionDirection(dir);
    setIsTransitioning(true);
    setActive((a) => (a + dir + n) % n);
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionDirection(0);
      lockRef.current = false;
    }, 1200);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  // Scroll navigation — accumula delta e richiede una pausa tra le slide
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let accum = 0;
    let lastDir = 0;
    let idleTimer = null;
    const onWheel = (e) => {
      const room = roomRefs.current[activeRef.current];
      if (room) {
        const canScrollDown = e.deltaY > 0 && room.scrollTop + room.clientHeight < room.scrollHeight - 1;
        const canScrollUp = e.deltaY < 0 && room.scrollTop > 0;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && (canScrollDown || canScrollUp)) return;
      }
      e.preventDefault();
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const dir = d > 0 ? 1 : -1;
      // Se cambia direzione, azzera l'accumulo
      if (dir !== lastDir) { accum = 0; lastDir = dir; }
      accum += Math.abs(d);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { accum = 0; }, 220);
      if (accum < 180) return;
      accum = 0;
      go(dir);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(idleTimer); };
  }, [n]);

  if (!content || !n) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${t.sidebarBg} ${t.periodInactive} font-outfit`}>
        <a href="/atlante" className={`mb-6 flex items-center gap-2 text-sm ${t.buttonText} ${t.buttonHoverText}`}>
          <ArrowLeft className="w-4 h-4" /> Torna all'Atlante
        </a>
        <p className="text-lg font-prompt">Approfondimento in fase di allestimento.</p>
      </div>
    );
  }

  const transform = `translateY(-${active * 100}%)`;

  return (
    <div
      ref={rootRef}
      className={`relative h-screen w-full overflow-hidden font-outfit ${darkMode ? "bg-[#050508]" : t.sidebarBg} ${darkMode ? "" : "atlas-light"}`}
    >
      {/* Header */}
      <header className={`absolute top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3 ${t.sidebarBg} backdrop-blur-md border-b ${t.sidebarBorder}`}>
        <a href="/atlante" className={`flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors`}>
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Torna all'Atlante</span>
        </a>
        <div className="text-center">
          <h1 className={`text-sm sm:text-base font-bold ${t.centuryText} font-prompt leading-tight`}>{content.title}</h1>
          <p className={`text-[9px] sm:text-[10px] ${t.headerText} uppercase tracking-[0.2em]`}>{content.subtitle}</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200`}
          title={darkMode ? "Modalità Chiara" : "Modalità Scura"}
          aria-label={darkMode ? "Passa alla modalità chiara" : "Passa alla modalità scura"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Track verticale — dissolvenza incrociata */}
      <div
        className="absolute inset-0 flex flex-col w-full"
        style={{
          transform,
          transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {nodes.map((node, i) => {
          const isActive = i === active;
          return (
            <div
              key={node.id}
              ref={(el) => (roomRefs.current[i] = el)}
              className="w-full h-full flex-shrink-0"
              style={{
                opacity: isActive ? 1 : 0,
                filter: isActive ? "blur(0px)" : "blur(12px)",
                transition: "opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1), filter 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <MuseumRoom node={node} darkMode={darkMode} isActive={isActive} />
            </div>
          );
        })}
      </div>

      {/* Barra di progressione verticale — lato sinistro */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none h-[60%] max-h-md">
        <div className="relative w-[3px] h-full rounded-full overflow-hidden bg-amber-400/10">
          <div
            className="absolute inset-x-0 top-0 rounded-full"
            style={{
              height: `${((active + 1) / n) * 100}%`,
              background: "linear-gradient(180deg, rgba(245,158,11,0.3), rgba(251,191,36,1))",
              transition: "height 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(245,158,11,0.4)",
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-200"
            style={{
              top: `calc(${((active + 1) / n) * 100}% - 4px)`,
              transition: "top 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 0 8px rgba(253,230,138,1), 0 0 16px rgba(251,191,36,0.8)",
            }}
          />
        </div>
      </div>
    </div>
  );
}