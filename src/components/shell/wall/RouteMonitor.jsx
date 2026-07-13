import RoutePreviewClip from "@/components/shell/ribbon/RoutePreviewClip";

// Cella-pagina della parete: uno schermo che È una destinazione. Spento →
// scuro e non cliccabile (l'interruttore è obbligatorio). Acceso → preview
// (video-ready) + cornice-accent + alone (glow) + nome-logo → spicca dagli
// schermi ambientali ed è cliccabile per navigare.
export default function RouteMonitor({ screen, powered, bootDelay, active, onEnter }) {
  return (
    <button
      type="button"
      onClick={() => powered && onEnter(screen.to)}
      disabled={!powered}
      data-cursor={powered ? "link" : undefined}
      aria-label={`Vai a ${screen.title}${active ? " (sei qui)" : ""}`}
      className="relative block text-left rounded-sm overflow-hidden bg-[#05060a] transition-shadow duration-500 disabled:cursor-default"
      style={powered
        ? { border: `1.5px solid ${screen.accent}cc`, boxShadow: `0 0 0 1px ${screen.accent}55, 0 0 22px ${screen.accent}${active ? "bb" : "66"}` }
        : { border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {powered && <RoutePreviewClip media={screen.media} accent={screen.accent} />}

      {powered && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 pointer-events-none">
            <div className="font-prompt uppercase tracking-[0.08em] text-amber-50 text-[10px] sm:text-xs leading-none truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {screen.title}
            </div>
          </div>
          {active && (
            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_2px_rgba(251,191,36,0.7)]" />
            </div>
          )}
        </>
      )}

      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)" }} />
      {powered && (
        <div className="absolute inset-0 bg-black pointer-events-none" style={{ animation: "screen-boot 0.7s ease-out both", animationDelay: `${bootDelay}ms` }} />
      )}
    </button>
  );
}
