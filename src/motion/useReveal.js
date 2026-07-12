import { useEffect, useRef } from "react";
import { useInView, useAnimation, useReducedMotion } from "framer-motion";
import { duration, ease, reveal } from "./tokens";

// Reveal direzionale riutilizzabile, generalizza la logica di DeviceNode:
// - scorrendo verso il basso il contenuto emerge animato;
// - scorrendo verso l'alto i nodi già visti restano fissi e quelli usciti dal
//   basso si riazzerano, così si rianimano alla successiva discesa.
// Passa scrollDirRef (ref "up"|"down") per il comportamento direzionale.
// Con once=true fa reveal una sola volta all'ingresso (senza direzionalità).
// Restituisce { ref, initial, animate } da spread su un motion element.
export function useReveal({ amount = 0.3, y = reveal.distance, scrollDirRef, once = false } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount, once });
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    if (inView) {
      if (scrollDirRef?.current === "up") controls.set({ opacity: 1, y: 0 });
      else controls.start({ opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.out } });
    } else if (!once && scrollDirRef?.current === "up") {
      controls.set({ opacity: 0, y });
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const initial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y };
  const animate = reduceMotion ? { opacity: 1, y: 0 } : controls;
  return { ref, initial, animate };
}
