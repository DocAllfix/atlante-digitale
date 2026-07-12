// Configurazione della "spiral drift" dei dispositivi (deriva orbitale).

export const LAYOUT = {
  R_BASE: 4.6, // raggio medio della spirale
  R_BREATHE: 1.7, // ampiezza del "respiro" del raggio
  ANGLE_STEP: 0.9, // avvitamento per indice (rad)
  Z_STEP: 3.2, // profondità aggiunta per dispositivo
  Y_SQUASH: 0.6, // schiacciamento verticale (spirale ellittica)
};

export const PALETTE = {
  amber: "#facc15",
  warm: "#ffd98a",
  fog: "#05060a",
};

export const CAMERA = { fov: 55, startZ: 6 };

// Focus del dispositivo: àncora spostata a SINISTRA (lo spazio a destra resta
// per il pannello), a distanza e scala FISSE → dimensione sempre uguale.
export const FOCUS = { dist: 7, scale: 1.8, offsetX: -2.8 };

// Damping dello scroll (drei ScrollControls).
export const SCROLL = { damping: 0.28, pages: 10 };
