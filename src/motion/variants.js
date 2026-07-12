// Variants condivise per framer-motion. Usano i token di ./tokens.
import { duration, ease, reveal } from "./tokens";

// Entry/exit di una scena/pagina: emerge dalla profondità (scale+blur), la
// scena uscente si ritira. Vedi PageScene per il rispetto di reduced-motion.
export const sceneEnter = {
  initial: { opacity: 0, scale: 1.02, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: duration.scene, ease: ease.scene },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    filter: "blur(8px)",
    transition: { duration: duration.scene * 0.7, ease: ease.scene },
  },
};

// Reveal di un contenuto che entra in viewport.
export const revealUp = {
  hidden: { opacity: 0, y: reveal.distance },
  show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.out } },
};

// Contenitore per reveal a cascata dei figli.
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// Overlay a tutto schermo (menu, ricerca, stanze modali).
export const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.fast, ease: ease.entrance } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.entrance } },
};

// Pannello laterale.
export const panelSlide = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { duration: duration.base, ease: ease.entrance } },
  exit: { x: "100%", transition: { duration: duration.fast, ease: ease.entrance } },
};
