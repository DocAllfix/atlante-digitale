import { useEffect, useRef, useState, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useGuidedPath } from "@/guided/GuidedPathProvider";
import { useSound } from "@/audio/SoundProvider";
import { EYE, ENTER_MS, PORTALS, THEMES3D, FOG } from "@/components/foyer/foyerConfig";
import MuseumFloor from "@/components/foyer/MuseumFloor";
import WallSystem from "@/components/foyer/WallSystem";
import AmbientLightRig from "@/components/foyer/AmbientLightRig";
import SpatialGuidanceSystem from "@/components/foyer/SpatialGuidanceSystem";
import ThemeNode from "@/components/foyer/ThemeNode";
import PortalFrame from "@/components/foyer/PortalFrame";
import FirstPersonRig from "@/components/foyer/FirstPersonRig";

// Vestibolo della memoria: spazio 3D esplorabile in prima persona. L'host
// (Canvas + overlay + input + ingresso) compone i moduli della scena; dati,
// costanti e palette vivono in foyerConfig.

export default function FoyerSpace() {
  const navigate = useNavigate();
  const { start } = useGuidedPath();
  const { playCue } = useSound();
  const keysRef = useRef(new Set());
  const reachRef = useRef(null);
  const enterTargetRef = useRef(null);
  const themesShownRef = useRef(false);
  const playerPosRef = useRef({ x: 0, z: 2 });
  const [reach, setReach] = useState(null);
  const [entering, setEntering] = useState(null);
  const [themesShown, setThemesShown] = useState(false);
  const [info, setInfo] = useState(null); // targhetta aperta: approfondimento stanza

  // Esc chiude l'approfondimento.
  useEffect(() => {
    if (!info) return;
    const onKey = (e) => { if (e.key === "Escape") setInfo(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [info]);

  // Micro-suono quando un portale diventa raggiungibile (no-op se muto).
  useEffect(() => { if (reach) playCue("nav"); }, [reach, playCue]);

  // Ingresso: la camera vola nel portale mentre lo schermo va a nero, poi
  // navigate → la transizione-scena dello shell prende il testimone.
  const enter = (to) => {
    if (!to || enterTargetRef.current) return;
    const p = PORTALS.find((x) => x.to === to);
    if (!p) return;
    playCue("open");
    enterTargetRef.current = { x: p.pos[0], z: p.pos[2] };
    setEntering(to);
    setTimeout(() => navigate(to), ENTER_MS);
  };

  useEffect(() => {
    const map = {
      ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
      ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
    };
    const down = (e) => {
      const d = map[e.code];
      if (d) { keysRef.current.add(d); e.preventDefault(); }
    };
    const up = (e) => { const d = map[e.code]; if (d) keysRef.current.delete(d); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      document.body.style.cursor = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = (dir) => ({
    onPointerDown: (e) => { e.preventDefault(); keysRef.current.add(dir); },
    onPointerUp: () => keysRef.current.delete(dir),
    onPointerLeave: () => keysRef.current.delete(dir),
    onPointerCancel: () => keysRef.current.delete(dir),
  });

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Fallback accessibile: navigazione sempre raggiungibile da tastiera/SR */}
      <nav className="sr-only">
        {PORTALS.map((p) => (
          <Link key={p.to} to={p.to}>{p.label}</Link>
        ))}
      </nav>

      <Canvas dpr={[1, 1.75]} camera={{ position: [0, EYE, 2], fov: 60 }}>
        <color attach="background" args={[FOG.color]} />
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <AmbientLightRig />
        <MuseumFloor />
        <WallSystem />
        <SpatialGuidanceSystem />
        <Suspense fallback={null}>
          {PORTALS.map((p) => (
            <PortalFrame key={p.to} portal={p} near={p.to === reach} playerPosRef={playerPosRef} onPlaque={setInfo} />
          ))}
        </Suspense>
        {themesShown && THEMES3D.map((n) => (
          <ThemeNode key={n.id} node={n} onTheme={start} />
        ))}
        <FirstPersonRig keysRef={keysRef} reachRef={reachRef} setReach={setReach} enterTargetRef={enterTargetRef} themesShownRef={themesShownRef} setThemesShown={setThemesShown} playerPosRef={playerPosRef} onCross={enter} />
      </Canvas>

      {/* Velo d'ingresso: lo schermo va a nero mentre la camera entra. */}
      <div
        className="pointer-events-none fixed inset-0 z-[1200] bg-black transition-opacity ease-in"
        style={{ opacity: entering ? 1 : 0, transitionDuration: `${ENTER_MS}ms` }}
      />

      {/* Approfondimento della stanza (dalla targhetta): zoom-in su nome + contenuto. */}
      <AnimatePresence>
        {info && (
          <motion.div
            className="fixed inset-0 z-[1150] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6 font-outfit"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setInfo(null)}
          >
            <motion.div
              className="relative max-w-md w-full rounded-2xl overflow-hidden border border-amber-400/20 bg-[#0b0f18]/95 shadow-2xl"
              initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setInfo(null)}
                aria-label="Chiudi"
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-amber-400/20 text-amber-100/80 hover:text-amber-100 hover:border-amber-400/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={info.img} alt="" className="w-full h-44 object-cover" />
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.3em] text-amber-300/70">{info.kind}</div>
                <h2 className="mt-1 font-prompt uppercase tracking-[0.08em] text-3xl text-amber-100">{info.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-amber-100/70">{info.desc}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-amber-300/60">Attraversa la soglia per entrare</span>
                  <button onClick={() => setInfo(null)} className="text-amber-100/50 text-sm hover:text-amber-100/80">Chiudi</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggerimento d'ingresso */}
      {reach && !entering && (
        <div className="absolute bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-amber-100/80 bg-black/50 px-3 py-1 rounded-full border border-amber-400/20">
          <span>Attraversa la soglia · </span>
          <span className="text-amber-200 font-prompt uppercase tracking-[0.06em]">{PORTALS.find((p) => p.to === reach)?.label}</span>
        </div>
      )}

      {/* Istruzioni */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] text-amber-100/40 text-center max-w-[80%]">
        <span className="hidden sm:inline">Muoviti con <strong className="text-amber-200/70">WASD</strong> o <strong className="text-amber-200/70">frecce</strong>. <strong className="text-amber-200/70">Attraversa</strong> un portale per entrare.</span>
        <span className="sm:hidden">Usa il pad per muoverti e <strong className="text-amber-200/70">attraversa</strong> un portale per entrare.</span>
      </p>

      {/* Pad direzionale (mobile) */}
      <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-3 grid-rows-3 gap-1 w-32">
        <span />
        <button {...hold("up")} aria-label="Avanti" className="flex items-center justify-center h-9 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronUp className="w-4 h-4" /></button>
        <span />
        <button {...hold("left")} aria-label="Sinistra" className="flex items-center justify-center h-9 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronLeft className="w-4 h-4" /></button>
        <span />
        <button {...hold("right")} aria-label="Destra" className="flex items-center justify-center h-9 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronRight className="w-4 h-4" /></button>
        <span />
        <button {...hold("down")} aria-label="Indietro" className="flex items-center justify-center h-9 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-200 active:bg-amber-400/25"><ChevronDown className="w-4 h-4" /></button>
        <span />
      </div>
    </div>
  );
}
