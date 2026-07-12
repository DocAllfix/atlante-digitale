// Superficie media modulare di uno schermo: immagine, video (loop muto) o tinta
// (fallback). Predisposta per caricare clip/filmati in futuro senza modifiche.
export default function ShellMediaSurface({ media, accent }) {
  if (!media || media.type === "color" || !media.src) {
    return (
      <div
        className="w-full h-full"
        style={{ background: `linear-gradient(135deg, ${accent || "#334155"}33, #05060a 70%)` }}
      />
    );
  }
  if (media.type === "video") {
    return (
      <video
        className="w-full h-full object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return <img className="w-full h-full object-cover" src={media.src} alt="" loading="lazy" />;
}
