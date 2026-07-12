import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import EntityCard from "@/components/atlas/EntityCard";
import { useGuidedPath } from "@/guided/GuidedPathProvider";
import { useTheme } from "@/theme/ThemeProvider";
import { getAuthor, getCityOfAuthor } from "@/lib/graph-selectors";
import { AUTHOR_CONTENT } from "@/data/visualCultureContent";
import { getDevice } from "@/lib/dispositivo-selectors";
import { CATEGORIES } from "@/data/dispositivoContent";

// Costruisce le prop della scheda per lo step corrente, riusando i content
// store esistenti. Ogni scheda mantiene i suoi ponti (mappa / pagina).
function buildProps(step) {
  if (step.kind === "author") {
    const a = getAuthor(step.id);
    if (!a) return null;
    const c = AUTHOR_CONTENT[a.id];
    const city = getCityOfAuthor(a.id);
    return {
      subtitle: city ? city.name : "",
      content: c
        ? { title: c.title || a.name, text: c.text, details: c.details, highlights: c.highlights, image: c.image }
        : { title: a.name, text: "" },
      image: a.image,
      relations: [],
      mapLink: { label: "Approfondisci in mappa", href: `/atlante?author=${a.id}` },
    };
  }
  const d = getDevice(step.id);
  if (!d) return null;
  return {
    subtitle: `${CATEGORIES[d.category]?.label || ""} · ${d.year}`,
    content: { title: d.name, text: d.text || d.tagline, details: d.details, highlights: d.highlights },
    image: d.image,
    relations: [],
    works: d.works,
    pageLink: d.pageLink,
  };
}

// Lettore del percorso guidato: mostra l'entità corrente in una EntityCard, con
// una barra di controllo (indietro / progressione / avanti / chiudi). Frecce da
// tastiera per scorrere, Esc per uscire. Chiudere = tornare all'esplorazione
// libera. Vive nello shell, sopra qualsiasi pagina.
export default function GuidedPath() {
  const { state, close, next, prev } = useGuidedPath();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, next, prev, close]);

  if (!state) return null;
  const step = state.steps[state.index];
  const props = buildProps(step);
  const atStart = state.index === 0;
  const atEnd = state.index === state.steps.length - 1;
  const cx = typeof window !== "undefined" ? Math.max(16, window.innerWidth / 2 - 160) : 300;

  return (
    <div className="fixed inset-0 z-[1380]">
      {/* Velo che attenua la pagina sottostante (non chiude al click). */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true" />

      {props && (
        <EntityCard
          key={`${step.kind}-${step.id}`}
          {...props}
          darkMode={darkMode}
          initialX={cx}
          initialY={72}
          onClose={close}
        />
      )}

      {/* Barra di controllo del percorso. */}
      <div className="pointer-events-auto fixed bottom-4 left-1/2 -translate-x-1/2 z-[1385] flex items-center gap-3 px-3 py-2 rounded-full bg-[#0b0f18]/90 backdrop-blur-md border border-amber-400/30 shadow-xl font-outfit">
        <button
          onClick={prev}
          disabled={atStart}
          data-cursor="link"
          aria-label="Entità precedente"
          className="flex items-center justify-center w-9 h-9 rounded-full text-amber-200 hover:bg-amber-400/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center px-1 min-w-[7rem]">
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70 font-prompt">{state.label}</div>
          <div className="text-xs text-amber-100/70 tabular-nums">{state.index + 1} / {state.steps.length}</div>
        </div>
        <button
          onClick={next}
          disabled={atEnd}
          data-cursor="link"
          aria-label="Entità successiva"
          className="flex items-center justify-center w-9 h-9 rounded-full text-amber-200 hover:bg-amber-400/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <span className="w-px h-6 bg-amber-400/20" />
        <button
          onClick={close}
          data-cursor="link"
          aria-label="Esci dal percorso guidato"
          title="Esci — esplorazione libera"
          className="flex items-center justify-center w-9 h-9 rounded-full text-amber-200 hover:bg-amber-400/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
