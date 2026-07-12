import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// Pianta stilizzata del "museo": le stanze sono i luoghi dell'ambiente. Si
// guida un avatar con frecce/WASD (desktop) o con il pad (touch/mobile); la
// scia del percorso compiuto resta evidenziata in giallo. Avvicinandosi a una
// stanza la si può "entrare" (Invio, oppure toccandola). La stanza corrente è
// marcata "sei qui". Nessuna navigazione automatica: l'ingresso è sempre esplicito.

const ROOMS = [
  { to: "/", label: "Soglia", x: 50, y: 88 },
  { to: "/esplora", label: "Foyer", x: 50, y: 62 },
  { to: "/atlante", label: "Atlante", x: 22, y: 44 },
  { to: "/dispositivo", label: "Dispositivo", x: 78, y: 44 },
  { to: "/approfondisci", label: "Approfondisci", x: 30, y: 18 },
  { to: "/aftersun", label: "Aftersun", x: 70, y: 18 },
];
const CORRIDORS = [
  ["/", "/esplora"],
  ["/esplora", "/atlante"],
  ["/esplora", "/dispositivo"],
  ["/atlante", "/dispositivo"],
  ["/atlante", "/approfondisci"],
  ["/dispositivo", "/aftersun"],
];

const SPEED = 0.7; // unità per frame (~42 u/s a 60fps)
const REACH = 8; // raggio di "arrivo" a una stanza
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const roomAt = (to) => ROOMS.find((r) => r.to === to);

export default function MuseumMap({ currentPath, onEnter }) {
  const startRoom = roomAt(currentPath) || roomAt("/esplora");
  const [pos, setPos] = useState({ x: startRoom.x, y: startRoom.y });
  const [trail, setTrail] = useState([{ x: startRoom.x, y: startRoom.y }]);
  const [reachable, setReachable] = useState(null);

  const posRef = useRef({ x: startRoom.x, y: startRoom.y });
  const trailRef = useRef([{ x: startRoom.x, y: startRoom.y }]);
  const keysRef = useRef(new Set());
  const reachRef = useRef(null);
  const rafRef = useRef(0);

  const enter = (to) => to && onEnter?.(to);

  // Loop di movimento.
  useEffect(() => {
    const step = () => {
      const keys = keysRef.current;
      let dx = 0, dy = 0;
      if (keys.has("up")) dy -= 1;
      if (keys.has("down")) dy += 1;
      if (keys.has("left")) dx -= 1;
      if (keys.has("right")) dx += 1;
      if (dx || dy) {
        const len = Math.hypot(dx, dy) || 1;
        const nx = clamp(posRef.current.x + (dx / len) * SPEED, 3, 97);
        const ny = clamp(posRef.current.y + (dy / len) * SPEED, 3, 97);
        posRef.current = { x: nx, y: ny };
        setPos(posRef.current);
        const tr = trailRef.current;
        const last = tr[tr.length - 1];
        if (!last || Math.hypot(nx - last.x, ny - last.y) > 1.5) {
          tr.push({ x: nx, y: ny });
          setTrail([...tr]);
        }
        const r = ROOMS.find((rm) => Math.hypot(rm.x - nx, rm.y - ny) < REACH);
        const to = r ? r.to : null;
        if (to !== reachRef.current) {
          reachRef.current = to;
          setReachable(to);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Tastiera: frecce + WASD per muoversi, Invio per entrare.
  useEffect(() => {
    const map = {
      ArrowUp: "up", KeyW: "up",
      ArrowDown: "down", KeyS: "down",
      ArrowLeft: "left", KeyA: "left",
      ArrowRight: "right", KeyD: "right",
    };
    const down = (e) => {
      if (e.code === "Enter") { enter(reachRef.current); return; }
      const d = map[e.code];
      if (d) { keysRef.current.add(d); e.preventDefault(); }
    };
    const up = (e) => {
      const d = map[e.code];
      if (d) keysRef.current.delete(d);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = (dir) => ({
    onPointerDown: (e) => { e.preventDefault(); keysRef.current.add(dir); },
    onPointerUp: () => keysRef.current.delete(dir),
    onPointerLeave: () => keysRef.current.delete(dir),
    onPointerCancel: () => keysRef.current.delete(dir),
  });

  const trailPoints = trail.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full max-w-3xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.4em] text-amber-300/60 mb-4 font-prompt">Sei qui</p>

      <div className="relative w-full aspect-[16/10] rounded-2xl border border-amber-400/15 bg-white/[0.02] overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {/* Corridoi */}
          {CORRIDORS.map(([a, b]) => {
            const ra = roomAt(a), rb = roomAt(b);
            return (
              <line key={`${a}-${b}`} x1={ra.x} y1={ra.y} x2={rb.x} y2={rb.y}
                stroke="rgba(251,191,36,0.14)" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
            );
          })}
          {/* Scia del percorso (giallo) */}
          {trail.length > 1 && (
            <polyline points={trailPoints} fill="none"
              stroke="#facc15" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 1.2px rgba(250,204,21,0.7))" }} />
          )}
        </svg>

        {/* Stanze */}
        {ROOMS.map((r) => {
          const here = r.to === currentPath;
          const isReach = r.to === reachable;
          return (
            <button
              key={r.to}
              onClick={() => enter(r.to)}
              data-cursor="link"
              aria-label={`Entra: ${r.label}${here ? " (sei qui)" : ""}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  here
                    ? "w-3.5 h-3.5 bg-amber-300 ring-4 ring-amber-300/25"
                    : isReach
                    ? "w-3 h-3 bg-amber-300/90 ring-4 ring-amber-300/30"
                    : "w-2.5 h-2.5 bg-amber-100/30 group-hover:bg-amber-200/70"
                }`}
              />
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-prompt uppercase tracking-[0.08em] whitespace-nowrap transition-colors ${
                  here || isReach ? "text-amber-100" : "text-amber-100/40 group-hover:text-amber-100/80"
                }`}
              >
                {r.label}
              </span>
              {here && <span className="text-[9px] text-amber-300/70">sei qui</span>}
            </button>
          );
        })}

        {/* Avatar */}
        <span
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <span className="block w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_3px_rgba(251,191,36,0.7)]" />
        </span>

        {/* Suggerimento d'ingresso quando si è su una stanza */}
        {reachable && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-amber-100/80 bg-black/50 px-2.5 py-1 rounded-full border border-amber-400/20">
            <span className="hidden sm:inline">Invio per entrare in </span>
            <span className="sm:hidden">Tocca la stanza · </span>
            <span className="text-amber-200 font-prompt uppercase tracking-[0.06em]">{roomAt(reachable)?.label}</span>
          </div>
        )}
      </div>

      {/* Istruzioni + pad touch */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[11px] sm:text-xs text-amber-100/50 leading-relaxed">
          <span className="hidden sm:inline">Muovi l'avatar con le <strong className="text-amber-200/80">frecce</strong> o <strong className="text-amber-200/80">WASD</strong>. Avvicinati a una stanza e premi <strong className="text-amber-200/80">Invio</strong> per entrare. Oppure tocca direttamente una stanza.</span>
          <span className="sm:hidden">Usa il pad per muovere l'avatar, oppure <strong className="text-amber-200/80">tocca</strong> una stanza per entrare.</span>
        </p>

        {/* Pad direzionale (mobile) */}
        <div className="sm:hidden shrink-0 grid grid-cols-3 grid-rows-3 gap-1 w-28">
          <span />
          <button {...hold("up")} aria-label="Su" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronUp className="w-4 h-4" /></button>
          <span />
          <button {...hold("left")} aria-label="Sinistra" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronLeft className="w-4 h-4" /></button>
          <span className="flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-amber-400/40" /></span>
          <button {...hold("right")} aria-label="Destra" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronRight className="w-4 h-4" /></button>
          <span />
          <button {...hold("down")} aria-label="Giù" className="flex items-center justify-center h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronDown className="w-4 h-4" /></button>
          <span />
        </div>
      </div>
    </div>
  );
}
