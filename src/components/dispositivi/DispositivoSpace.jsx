import { Suspense, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import { allDevices, getDevice } from "@/lib/dispositivo-selectors";
import { useGuidedPath } from "@/guided/GuidedPathProvider";
import { PALETTE, CAMERA, SCROLL } from "@/components/dispositivi/dispositiviConfig";
import SpiralDriftScene from "@/components/dispositivi/SpiralDriftScene";
import SpatialInfoPanel from "@/components/dispositivi/SpatialInfoPanel";

// Host della "spiral drift": Canvas + ScrollControls; deriva guidata dallo
// scroll, focus 3D di un dispositivo (con freeze dello scroll e ritorno).
export default function DispositivoSpace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { start } = useGuidedPath();
  const [current, setCurrent] = useState(null);
  const [hover, setHover] = useState(null); // { device, x, y }
  const [focusData, setFocusData] = useState(null); // { device, startPos } (resta durante il rientro)
  const [focusActive, setFocusActive] = useState(false);
  const barRef = useRef(null);

  const onHover = (device, x, y) => setHover({ device, x, y });
  const onHoverEnd = () => setHover(null);
  const onFocus = (device, startPos) => { setFocusData({ device, startPos }); setFocusActive(true); };
  const onReturn = () => setFocusActive(false);
  const onFocusExited = () => setFocusData(null);

  // Click su un nodo-connessione: autore/mappa → Atlante; tema → percorso
  // guidato; dispositivo collegato → ri-focus (swap) senza uscire dalla scena.
  // Per le due destinazioni che lasciano la pagina (autore/mappa) il pannello
  // si chiude subito (niente sua propria animazione d'uscita, inutile dato che
  // l'intera pagina sta già dissolvendo).
  const onRelationPick = (item) => {
    if (item.kind === "author") { setFocusActive(false); setFocusData(null); navigate(`/atlante?author=${item.id}`); }
    else if (item.kind === "atlas") { setFocusActive(false); setFocusData(null); navigate("/atlante"); }
    else if (item.kind === "theme") { onReturn(); start(item.id); }
    else if (item.kind === "device") {
      const d = getDevice(item.id);
      if (d) setFocusData((fd) => ({ device: d, startPos: fd?.startPos || [0, 0, 0] }));
    }
  };

  // Deep-link ?device=<id>: apre quel dispositivo in focus all'avvio.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const id = searchParams.get("device");
    const d = id && getDevice(id);
    if (d) onFocus(d, [0, 0, 0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Esc torna alla corrente.
  useEffect(() => {
    if (!focusActive) return;
    const onKey = (e) => { if (e.key === "Escape") onReturn(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusActive]);

  const progress = current ? (current.index + 1) / current.total : 0;

  return (
    <div className="fixed inset-0 bg-black font-outfit">
      {/* Navigazione accessibile (tastiera / screen reader) */}
      <nav className="sr-only">
        {allDevices().map((d) => (
          <Link key={d.id} to={`/dispositivo?device=${d.id}`}>{d.year} — {d.name}</Link>
        ))}
      </nav>

      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, CAMERA.startZ], fov: CAMERA.fov }}
        onPointerMissed={() => { if (focusActive) onReturn(); }}
      >
        <color attach="background" args={[PALETTE.fog]} />
        <fog attach="fog" args={[PALETTE.fog, 6, 60]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 4, 6]} intensity={70} color={PALETTE.warm} />
        <ScrollControls pages={SCROLL.pages} damping={SCROLL.damping} enabled={!focusActive}>
          <Suspense fallback={null}>
            <SpiralDriftScene
              onCurrent={setCurrent}
              barRef={barRef}
              onHover={onHover}
              onHoverEnd={onHoverEnd}
              onFocus={onFocus}
              focusData={focusData}
              focusActive={focusActive}
              onFocusExited={onFocusExited}
            />
          </Suspense>
        </ScrollControls>
      </Canvas>

      {/* Istruzione (solo in overview) */}
      {!focusActive && (
        <p className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 text-[11px] text-amber-100/40 text-center">
          Scorri per derivare nella corrente dei dispositivi
        </p>
      )}

      {/* HUD (solo in overview) */}
      {!focusActive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-2">
          {current && (
            <>
              <div className="text-amber-300 font-prompt font-semibold tabular-nums text-2xl leading-none">{current.device.year}</div>
              <div className="text-amber-100/80 text-[11px] uppercase tracking-[0.25em]">{current.device.name}</div>
            </>
          )}
          <div className="mt-1 w-44 h-[2px] rounded-full bg-amber-400/15 overflow-hidden">
            <div ref={barRef} className="h-full bg-amber-400/70" style={{ width: 0 }} />
          </div>
        </div>
      )}

      {/* Tooltip hover che segue il cursore */}
      {hover && !focusActive && (
        <div
          className="pointer-events-none fixed z-[60] px-2.5 py-1 rounded-md bg-black/70 border border-amber-400/20 text-center whitespace-nowrap"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          <div className="text-amber-300 font-prompt font-semibold tabular-nums text-xs">{hover.device.year}</div>
          <div className="text-amber-50 text-sm leading-tight">{hover.device.name}</div>
        </div>
      )}

      {/* Pannello info del dispositivo in focus */}
      <AnimatePresence>
        {focusActive && focusData && (
          <SpatialInfoPanel device={focusData.device} onClose={onReturn} onPick={onRelationPick} />
        )}
      </AnimatePresence>
    </div>
  );
}
