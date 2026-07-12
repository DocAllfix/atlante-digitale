// Ribbon della shell: sequenza ordinata di schermi (dorsale di monitor). Mix di
// "route" (destinazioni selezionabili) e "ambient" (schermi dormienti/ambientali
// che danno densità). Media video-ready: type image | video | color.

export const ARC = {
  spacing: 300, // distanza orizzontale tra schermi (px)
  angle: 34, // rotazione Y per schermo di distanza (deg)
  depth: 210, // rientro in profondità per schermo di distanza (px)
  scaleStep: 0.12,
  opacityStep: 0.3,
  minScale: 0.5,
  minOpacity: 0.1,
};

export const SCREENS = [
  { kind: "ambient" },
  { kind: "route", to: "/", title: "Soglia", subtitle: "L'ingresso", accent: "#f59e0b", media: { type: "image", src: "/images/landing/FOTO.png" } },
  { kind: "ambient" },
  { kind: "route", to: "/esplora", title: "Foyer", subtitle: "L'atrio", accent: "#fbbf24", media: { type: "color" } },
  { kind: "route", to: "/atlante", title: "Atlante", subtitle: "La mappa", accent: "#38bdf8", media: { type: "image", src: "/images/history/france-1801-1850.jpg" } },
  { kind: "ambient" },
  { kind: "route", to: "/dispositivo", title: "Dispositivo", subtitle: "La linea del tempo", accent: "#a78bfa", media: { type: "image", src: "/images/dispositivi/cinematographe.png" } },
  { kind: "route", to: "/approfondisci", title: "Approfondisci", subtitle: "Le stanze", accent: "#f472b6", media: { type: "image", src: "/images/fellini/cinecitta.jpg" } },
  { kind: "ambient" },
  { kind: "route", to: "/aftersun", title: "Aftersun", subtitle: "Il saggio visuale", accent: "#fb923c", media: { type: "image", src: "/images/aftersun/1.png" } },
  { kind: "ambient" },
];

export const ROUTE_SCREENS = SCREENS.filter((s) => s.kind === "route");
