// Grammatica di motion condivisa: durate, easing, spring e distanze.
// I valori riprendono quelli già presenti nel progetto per coerenza:
// card-pop/sheet-up (index.css), scene DeepDive, spring "fluttuante" di Landing.

export const duration = {
  fast: 0.28, // micro-interazioni, overlay (card-pop)
  base: 0.6, // transizioni di elemento
  reveal: 0.65, // comparsa contenuti in viewport (DeviceNode)
  scene: 1.0, // cambio scena / entry-exit pagina
};

export const ease = {
  out: "easeOut", // reveal in ingresso
  entrance: [0.2, 0.7, 0.2, 1], // card-pop / sheet-up / overlay
  scene: [0.4, 0, 0.2, 1], // transizioni-scena (DeepDive)
};

export const spring = {
  float: { stiffness: 55, damping: 20, mass: 0.6 }, // "fluttuante" (Landing)
  magnetic: { stiffness: 300, damping: 30, mass: 0.5 }, // cursore magnetico
};

export const reveal = {
  distance: 36, // spostamento verticale del reveal
};
