import * as THREE from "three";

// Texture equirettangolare "stile atlante" del mondo, disegnata al volo su un
// canvas dai confini bundle (public/geo/countries.geo.json). Serve come pelle
// del globo dell'intro (GlobeIntroScene) e va in continuità cromatica con la
// mappa. Tema-aware (scuro/chiaro), cache per tema.

const W = 2048;
const H = 1024; // 2:1 equirettangolare

const PALETTE = {
  dark: { sea: "#06080d", land: "rgba(90,130,180,0.14)", coast: "rgba(251,191,36,0.55)", line: 0.7 },
  light: { sea: "#a8c8e8", land: "#e7d7b4", coast: "rgba(120,80,20,0.5)", line: 0.7 },
};

const project = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];

// Traccia un anello spezzando i segmenti che scavalcano l'antimeridiano
// (salto di longitudine > 180°) per evitare striature orizzontali.
function strokeRing(ctx, ring) {
  let prevLon = null;
  ctx.beginPath();
  for (const [lon, lat] of ring) {
    const [x, y] = project(lon, lat);
    if (prevLon === null || Math.abs(lon - prevLon) > 180) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    prevLon = lon;
  }
  ctx.stroke();
}

function fillRing(ctx, ring) {
  ctx.beginPath();
  ring.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function ringsOf(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

function draw(geojson, darkMode) {
  const p = darkMode ? PALETTE.dark : PALETTE.light;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = p.sea;
  ctx.fillRect(0, 0, W, H);

  const rings = geojson.features.flatMap((f) => (f.geometry ? ringsOf(f.geometry) : []));

  ctx.fillStyle = p.land;
  for (const ring of rings) fillRing(ctx, ring);

  ctx.strokeStyle = p.coast;
  ctx.lineWidth = p.line;
  ctx.lineJoin = "round";
  for (const ring of rings) strokeRing(ctx, ring);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

const cache = new Map(); // darkMode → Promise<CanvasTexture>

export function buildWorldTexture(darkMode) {
  if (cache.has(darkMode)) return cache.get(darkMode);
  const promise = fetch("/geo/countries.geo.json")
    .then((r) => r.json())
    .then((geojson) => draw(geojson, darkMode))
    .catch((err) => { cache.delete(darkMode); throw err; }); // non tenere in cache un fallimento: riprova al prossimo giro
  cache.set(darkMode, promise);
  return promise;
}
