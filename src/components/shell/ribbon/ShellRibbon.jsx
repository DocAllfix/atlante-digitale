import { useEffect, useMemo, useRef, useState } from "react";
import { SCREENS } from "@/components/shell/ribbon/shellScreensConfig";
import RibbonTrack from "@/components/shell/ribbon/RibbonTrack";
import { useRibbonSnap } from "@/components/shell/ribbon/useRibbonSnap";
import ShellTransitionController from "@/components/shell/ribbon/ShellTransitionController";
import { useSound } from "@/audio/SoundProvider";

// Shell a "ribbon": arco orizzontale di schermi in prospettiva (CSS-3D),
// scorribile con rotella / drag / frecce e snap sui monitor-destinazione.
export default function ShellRibbon({ currentPath, onEnter }) {
  const routeIndices = useMemo(
    () => SCREENS.map((s, i) => (s.kind === "route" ? i : -1)).filter((i) => i >= 0),
    []
  );
  const startIndex = useMemo(() => {
    const i = SCREENS.findIndex((s) => s.kind === "route" && s.to === currentPath);
    return i >= 0 ? i : routeIndices[0];
  }, [currentPath, routeIndices]);

  const { focus, nudge, currentRouteIndex, handlers } = useRibbonSnap(routeIndices, startIndex);
  const { playCue } = useSound();
  const [selecting, setSelecting] = useState(null);

  // Selezione: avvia la transizione (zoom nello schermo), poi naviga.
  const select = (to) => {
    if (selecting) return;
    const s = SCREENS.find((x) => x.kind === "route" && x.to === to);
    if (s) { playCue("open"); setSelecting(s); }
  };
  const selectRef = useRef(select);
  selectRef.current = select;

  // All'apertura: piccola sequenza di impulsi mentre gli schermi si accendono.
  useEffect(() => {
    const ts = [120, 340, 560].map((d) => setTimeout(() => playCue("nav"), d));
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nudge(1);
      else if (e.key === "ArrowLeft") nudge(-1);
      else if (e.key === "Enter") {
        e.preventDefault();
        const s = SCREENS[currentRouteIndex()];
        if (s?.kind === "route") selectRef.current(s.to);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge, currentRouteIndex]);

  return (
    <div
      className="relative w-full select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1500px" }}
      {...handlers}
    >
      <div className="relative h-[320px]" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", animation: "ribbon-sway 13s ease-in-out infinite" }}>
          <RibbonTrack focus={focus} currentPath={currentPath} onEnter={select} />
        </div>
      </div>
      {selecting && (
        <ShellTransitionController screen={selecting} onDone={() => onEnter(selecting.to)} />
      )}
    </div>
  );
}
