import { useCallback, useEffect, useRef, useState } from "react";
import { ARC } from "@/components/shell/ribbon/shellScreensConfig";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const nearest = (v, arr) => arr.reduce((b, x) => (Math.abs(x - v) < Math.abs(b - v) ? x : b), arr[0]);

// Controllo di scorrimento dell'arco: `focus` (float) mosso da rotella / drag /
// frecce; molla morbida che si aggancia (snap) al monitor-destinazione più
// vicino (salta gli schermi ambientali).
export function useRibbonSnap(routeIndices, startIndex) {
  const lo = routeIndices[0];
  const hi = routeIndices[routeIndices.length - 1];
  const [focus, setFocus] = useState(startIndex);
  const focusRef = useRef(startIndex);
  const targetRef = useRef(startIndex);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, f: 0 });
  const lastWheel = useRef(0);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (!dragging.current) {
        const f = focusRef.current;
        const t = targetRef.current;
        const val = Math.abs(t - f) < 0.002 ? t : f + (t - f) * 0.2;
        if (val !== f) { focusRef.current = val; setFocus(val); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const snap = (v) => { targetRef.current = nearest(clamp(v, lo, hi), routeIndices); };

  const nudge = useCallback((dir) => {
    const cur = nearest(targetRef.current, routeIndices);
    const pos = routeIndices.indexOf(cur);
    targetRef.current = routeIndices[clamp(pos + dir, 0, routeIndices.length - 1)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeIndices]);

  const onWheel = useCallback((e) => {
    const now = performance.now();
    if (now - lastWheel.current < 220) return;
    lastWheel.current = now;
    nudge(e.deltaY > 0 ? 1 : -1);
  }, [nudge]);

  const onPointerDown = (e) => { dragging.current = true; dragStart.current = { x: e.clientX, f: focusRef.current }; };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const nf = clamp(dragStart.current.f - dx / (ARC.spacing * 0.8), lo - 0.4, hi + 0.4);
    focusRef.current = nf;
    setFocus(nf);
  };
  const endDrag = () => { if (!dragging.current) return; dragging.current = false; snap(focusRef.current); };

  // Indice del monitor-destinazione attualmente centrato (per Invio).
  const currentRouteIndex = useCallback(() => nearest(focusRef.current, routeIndices), [routeIndices]);

  return { focus, nudge, currentRouteIndex, handlers: { onWheel, onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerLeave: endDrag } };
}
