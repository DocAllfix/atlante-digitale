import ScreenPanel from "@/components/shell/ribbon/ScreenPanel";
import RoutePreviewClip from "@/components/shell/ribbon/RoutePreviewClip";

// Schermo-destinazione: un monitor ACCESO che mostra la preview, con alone del
// suo accent → risalta nettamente dalla parete di monitor spenti. Nessun testo:
// riconoscibile dall'immagine. Il puntino segnala "sei qui".
export default function RouteScreen({ screen, focused, active, onEnter, bootDelay = 0 }) {
  return (
    <button
      onClick={() => onEnter(screen.to)}
      data-cursor="link"
      aria-label={`Vai: ${screen.title}`}
      className="block rounded-md transition-all duration-300 hover:brightness-110 hover:scale-[1.04]"
      style={{ boxShadow: `0 0 0 1.5px ${screen.accent}cc, 0 0 ${focused ? 30 : 18}px ${screen.accent}${focused ? "99" : "55"}` }}
    >
      <ScreenPanel focused={focused} accent={screen.accent} bootDelay={bootDelay}>
        <RoutePreviewClip media={screen.media} accent={screen.accent} />
        {active && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(251,191,36,0.7)]" />
        )}
      </ScreenPanel>
    </button>
  );
}
