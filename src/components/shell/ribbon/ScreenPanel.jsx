// Schermo/monitor del ribbon: cornice (bezel) + superficie. "dormant" = spento
// (ambientale); "focused" = a fuoco (glow). "bootDelay" = ritardo d'accensione
// (velo nero che si dissolve con flicker).
export default function ScreenPanel({ children, dormant, focused, accent, bootDelay = 0 }) {
  return (
    <div
      className={`relative w-64 h-40 rounded-md overflow-hidden border bg-[#05060a] shadow-[0_12px_44px_rgba(0,0,0,0.6)] transition-colors duration-300 ${
        focused ? "border-amber-400/60" : "border-white/10"
      }`}
    >
      <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/5 pointer-events-none" />
      {dormant ? (
        <div className="absolute inset-0 bg-[#070810]" />
      ) : (
        children
      )}
      {focused && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `inset 0 0 44px ${accent || "#facc15"}22` }}
        />
      )}
      {/* Velo d'accensione (dormant → flicker → acceso) */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ animation: "screen-boot 0.7s ease-out both", animationDelay: `${bootDelay}ms` }}
      />
    </div>
  );
}
