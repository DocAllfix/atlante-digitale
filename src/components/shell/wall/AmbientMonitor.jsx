// Cella ambientale della parete: uno schermo "di contorno" che dà densità.
// Spento → scuro (solo scanline). Acceso → gradiente tenue + flicker idle, con
// velo d'accensione a onda (screen-boot). Logica estratta da BackgroundMonitorField.
const seeded = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
const AMBIENT = ["#3b4a63", "#4a3c20", "#26313f", "#332a4a", "#274049"];

export default function AmbientMonitor({ i, powered, bootDelay }) {
  const lit = seeded(i) > 0.42;
  const accent = AMBIENT[i % AMBIENT.length];
  const bright = 0.4 + seeded(i + 7) * 0.4;

  return (
    <div className={`relative rounded-sm overflow-hidden bg-[#0a0b12] border ${powered && lit ? "border-white/15" : "border-white/[0.06]"}`}>
      {powered && lit && (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}, #06070d 82%)`, opacity: bright }} />
      )}
      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)" }} />
      {powered && lit && (
        <div className="absolute inset-0 bg-black" style={{ animation: `screen-idle ${4 + seeded(i + 3) * 5}s ease-in-out ${seeded(i + 11) * 4}s infinite` }} />
      )}
      {powered && (
        <div className="absolute inset-0 bg-black" style={{ animation: "screen-boot 0.7s ease-out both", animationDelay: `${bootDelay}ms` }} />
      )}
    </div>
  );
}
