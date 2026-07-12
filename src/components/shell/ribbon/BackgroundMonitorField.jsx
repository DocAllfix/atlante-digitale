// Parete di monitor che riempie la pagina dietro l'arco: dorsale/archivio vivo.
// Statica e non interattiva; alcuni schermi spenti, altri accesi (tinta tenue).
// Scanline CRT su tutti così anche gli spenti si leggono come schermi.
// Condivideranno la logica di accensione con l'arco nella Fase 3.
const COLS = 10;
const ROWS = 6;
const AMBIENT = ["#3b4a63", "#4a3c20", "#26313f", "#332a4a", "#274049"];

const seeded = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

export default function BackgroundMonitorField() {
  const cells = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    cells.push({
      i,
      lit: seeded(i) > 0.42,
      accent: AMBIENT[i % AMBIENT.length],
      bright: 0.45 + seeded(i + 7) * 0.5,
    });
  }
  return (
    <div
      className="absolute inset-0 grid gap-2 p-2 opacity-75 pointer-events-none"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      aria-hidden="true"
    >
      {cells.map(({ i, lit, accent, bright }) => (
        <div
          key={i}
          className={`relative rounded-sm overflow-hidden bg-[#0a0b12] border ${lit ? "border-white/15" : "border-white/[0.06]"}`}
        >
          {lit && (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${accent}, #06070d 80%)`, opacity: bright }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)" }}
          />
          {lit && (
            <div
              className="absolute inset-0 bg-black"
              style={{ animation: `screen-idle ${4 + seeded(i + 3) * 5}s ease-in-out ${seeded(i + 11) * 4}s infinite` }}
            />
          )}
          {/* Velo d'accensione a onda */}
          <div
            className="absolute inset-0 bg-black"
            style={{ animation: "screen-boot 0.7s ease-out both", animationDelay: `${(i / (COLS * ROWS - 1)) * 600}ms` }}
          />
        </div>
      ))}
    </div>
  );
}
