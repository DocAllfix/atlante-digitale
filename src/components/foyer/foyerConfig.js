// Configurazione unica del vestibolo 3D: dimensioni, palette, costanti, dati
// dei portali e dei temi. Niente magic-number sparsi nei componenti.

export const EYE = 1.7; // altezza occhio
export const SPEED = 5.5; // velocità di regime (u/s)
export const REACH = 4.2; // raggio di prossimità (mostra l'affordance)
export const ENTER_DIST = 1.7; // attraversando entro questo raggio si entra
export const ENTER_MS = 850; // durata volo-nel-portale prima del navigate

export const BOUNDS = { x: [-15, 15], z: [-34, 8] };
export const FOG = { color: "#000000", near: 9, far: 40 };

// Pareti liminali: due file di lastre verticali alte ai lati della navata, a
// ritmo verso il punto di fuga. Non chiudono lo spazio (gap tra le lastre) e i
// loro apici sfumano nel buio/nebbia. Da qui derivano anche gli ostacoli.
export const WALL = { x: 10.5, height: 13, width: 1.6, depth: 0.5, from: 6, to: -32, step: 4.5 };
export const WALL_SEGMENTS = (() => {
  const segs = [];
  for (let z = WALL.from; z >= WALL.to; z -= WALL.step) {
    segs.push({ x: -WALL.x, z });
    segs.push({ x: WALL.x, z });
  }
  return segs;
})();

// Ostacoli circolari per le collisioni del rig ({ x, z, r }), derivati dalle lastre.
export const OBSTACLES = WALL_SEGMENTS.map((s) => ({ x: s.x, z: s.z, r: WALL.width / 2 + 0.2 }));
export const COLLISION_PAD = 0.45;

export const PALETTE = {
  amber: "#facc15",
  amberDim: "#8a7128",
  warmLight: "#ffd98a",
  keyLight: "#ffe6a8",
  coolSky: "#c9d4ff",
  warmGround: "#3a3320",
  floor: "#0a0a0c",
};

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Geometria della soglia attraversabile (telaio con spessore).
export const PORTAL_GEO = { openW: 3, openH: 5.2, jamb: 0.4, depth: 1.1 };
export const THRESHOLD_RANGE = 7; // distanza entro cui sale l'effetto-soglia (t)

// Destinazioni come soglie nello spazio (facing = rotazione Y in rad, verso
// l'arrivo). Anteprima = immagine-firma già presente in public/images.
export const PORTALS = [
  { to: "/atlante", label: "Atlante", kind: "Cartografia", pos: [-6.5, 0, -12], facing: 0, img: "/images/history/france-1801-1850.jpg", desc: "La mappa interattiva: paesi, città, autori e temi che cambiano nel tempo. Segui i collegamenti e attraversa la geografia della memoria visuale." },
  { to: "/dispositivo", label: "Dispositivo", kind: "Tempo", pos: [6.5, 0, -12], facing: 0, img: "/images/dispositivi/cinematographe.png", desc: "Un secolo e mezzo di sguardi meccanici, dal 1894 a oggi: la parete cronologica dei dispositivi che hanno formato il nostro modo di vedere." },
  { to: "/aftersun", label: "Aftersun", kind: "Saggio", pos: [0, 0, -19], facing: 0, img: "/images/aftersun/1.png", desc: "Un affondo visuale per immagini: un saggio che intreccia memoria, sguardo e perdita attraverso una sequenza contemplativa." },
];

// Temi come costellazione OLTRE i portali: si scoprono proseguendo in fondo.
export const THEMES3D = [
  { id: "onirismo", label: "Onirismo", pos: [-4, 2.3, -26] },
  { id: "femminismo", label: "Femminismo", pos: [0, 2.7, -30] },
  { id: "black_studies", label: "Black Studies", pos: [4, 2.3, -26] },
];
