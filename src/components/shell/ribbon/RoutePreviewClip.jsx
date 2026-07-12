import ShellMediaSurface from "@/components/shell/ribbon/ShellMediaSurface";

// Preview del monitor-destinazione: la superficie media (immagine/video/color)
// con trattamento "schermo vivo" — scanline, riflesso del vetro e vignetta
// interna. Video-ready (ShellMediaSurface gestisce già i loop).
export default function RoutePreviewClip({ media, accent }) {
  return (
    <div className="absolute inset-0">
      <ShellMediaSurface media={media} accent={accent} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0 1px, transparent 1px 3px)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 32% 18%, rgba(255,255,255,0.10), transparent 55%)" }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }} />
    </div>
  );
}
