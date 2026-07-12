import { ARC, SCREENS } from "@/components/shell/ribbon/shellScreensConfig";
import RouteScreen from "@/components/shell/ribbon/RouteScreen";
import ScreenPanel from "@/components/shell/ribbon/ScreenPanel";

// Nastro: dispone gli schermi su un arco in prospettiva in funzione della
// distanza dal fuoco (d = i - focus). Doppio livello: esterno centra, interno
// applica la trasformazione d'arco.
export default function RibbonTrack({ focus, currentPath, onEnter }) {
  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {SCREENS.map((s, i) => {
        const d = i - focus;
        const ad = Math.abs(d);
        const scale = Math.max(ARC.minScale, 1 - ad * ARC.scaleStep);
        const opacity = Math.max(ARC.minOpacity, 1 - ad * ARC.opacityStep);
        const inner = `translateX(${d * ARC.spacing}px) translateZ(${-ad * ARC.depth}px) rotateY(${-d * ARC.angle}deg) scale(${scale})`;
        const focused = Math.round(focus) === i;
        const bootDelay = (i / Math.max(1, SCREENS.length - 1)) * 500;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ transform: "translate(-50%, -50%)", transformStyle: "preserve-3d", zIndex: 100 - Math.round(ad * 10) }}
          >
            <div style={{ transform: inner, opacity, transition: "opacity .3s linear" }}>
              {s.kind === "route" ? (
                <RouteScreen screen={s} focused={focused} active={currentPath === s.to} onEnter={onEnter} bootDelay={bootDelay} />
              ) : (
                <ScreenPanel dormant focused={focused} bootDelay={bootDelay} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
