import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Maximize2, Minimize2, GripHorizontal, Volume2, VolumeX, Bookmark, BookmarkCheck, BookOpen, ChevronLeft, Link2, Check } from "lucide-react";
import { atlasTheme } from "@/lib/atlasTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import RelationChips from "@/components/RelationChips";

// Card unica per qualsiasi entità (Paese o autore). Su desktop è un pannello
// trascinabile che si apre "a molla" dal punto di click; su mobile diventa un
// bottom-sheet a tutta larghezza con trascinamento verso il basso per chiudere.
// La barra breadcrumb mostra il percorso di navigazione (logica museale).

export default function EntityCard({
  subtitle, content, image, textFallback, relations, darkMode,
  initialX, initialY, onClose, isSaved, onToggleSave, deepDiveHref,
  breadcrumb, onBack, shareUrl,
}) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const cardWidth = expanded ? 512 : 320;
  const [pos, setPos] = useState(() => ({
    x: Math.min(initialX ?? 288, window.innerWidth - cardWidth - 16),
    y: Math.min(initialY ?? 16, window.innerHeight - 120),
  }));
  const [sheetDy, setSheetDy] = useState(0); // trascinamento del bottom-sheet
  const dragRef = useRef(null);
  const rootRef = useRef(null);
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const imgSrc = image || content?.image;

  const toggleSpeech = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const parts = [content?.title, content?.text];
    if (expanded) {
      if (content?.details) parts.push(content.details);
      if (content?.highlights?.length) parts.push(content.highlights.join(". "));
    }
    const utterance = new SpeechSynthesisUtterance(parts.filter(Boolean).join(". "));
    utterance.lang = "it-IT";
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const share = async () => {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };

  // Accessibilità: Esc chiude, focus alla card all'apertura.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    rootRef.current?.focus?.({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // Trascinamento: sposta la card (desktop) o chiude il sheet (mobile, swipe giù).
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (isMobile) { setSheetDy(Math.max(0, dy)); return; }
    setPos({
      x: Math.max(0, Math.min(dragRef.current.posX + dx, window.innerWidth - cardWidth - 8)),
      y: Math.max(0, Math.min(dragRef.current.posY + dy, window.innerHeight - 60)),
    });
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    if (isMobile) { if (sheetDy > 90) onClose?.(); setSheetDy(0); }
  };

  const widthClass = expanded ? "w-[32rem]" : "w-80";
  const imageHeight = expanded ? "h-56" : "h-40";

  const containerClass = isMobile
    ? "fixed inset-x-0 bottom-0 z-[1002] w-full max-h-[82vh] overflow-y-auto rounded-t-2xl animate-sheet-up"
    : `absolute z-[1002] ${widthClass} max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg animate-card-pop`;
  const containerStyle = isMobile
    ? { transform: sheetDy ? `translateY(${sheetDy}px)` : undefined, transition: dragRef.current ? "none" : "transform .2s ease" }
    : { left: pos.x, top: pos.y };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={content?.title || subtitle}
      tabIndex={-1}
      className={`${containerClass} ${t.sidebarBg} backdrop-blur-md border ${t.sidebarBorder} shadow-2xl focus:outline-none`}
      style={containerStyle}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`flex items-center justify-center py-1.5 ${isMobile ? "cursor-grab" : "cursor-move"} border-b ${t.sidebarBorder} select-none touch-none sticky top-0 z-20 ${t.sidebarBg} backdrop-blur-md`}
      >
        {isMobile
          ? <span className="w-10 h-1.5 rounded-full bg-current opacity-30" />
          : <GripHorizontal className={`w-4 h-4 ${t.headerText} opacity-80`} />}
      </div>

      {/* Breadcrumb del percorso */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className={`flex items-center gap-1 px-3 py-1.5 text-[11px] border-b ${t.sidebarBorder} ${t.periodInactive} overflow-x-auto`}>
          {onBack && breadcrumb.length > 1 && (
            <button onClick={onBack} title="Indietro" aria-label="Indietro" className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded ${t.buttonHoverBg} ${t.periodHover}`}>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1 whitespace-nowrap">
            {breadcrumb.map((b, i) => (
              <span key={b.id ?? i} className="flex items-center gap-1">
                {i > 0 && <span className="opacity-40">›</span>}
                {i < breadcrumb.length - 1 ? (
                  <button onClick={b.onClick} className={`${t.periodHover} hover:underline`}>{b.label}</button>
                ) : (
                  <span className={`font-semibold ${t.centuryText}`}>{b.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        {onToggleSave && (
          <button onClick={onToggleSave} className={`absolute top-2 left-2 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg z-10`} title={isSaved ? "Rimuovi dai preferiti" : "Salva nei preferiti"} aria-label={isSaved ? "Rimuovi dai preferiti" : "Salva nei preferiti"}>
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}
        {imgSrc && (
          <img src={imgSrc} alt={content?.title || subtitle} loading="lazy" className={`w-full ${isMobile ? "h-44" : imageHeight} object-cover transition-all duration-300`} />
        )}
        <button onClick={onClose} className={`absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`} title="Chiudi" aria-label="Chiudi">
          <X className="w-4 h-4" />
        </button>
        <button onClick={() => setExpanded(!expanded)} className={`absolute top-2 right-12 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`} title={expanded ? "Riduci" : "Espandi"} aria-label={expanded ? "Riduci" : "Espandi"}>
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        {content && (
          <button onClick={toggleSpeech} className={`absolute top-2 right-[5.5rem] flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`} title={speaking ? "Ferma audio" : "Ascolta il testo"} aria-label={speaking ? "Ferma audio" : "Ascolta il testo"}>
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
        {shareUrl && (
          <button onClick={share} className={`absolute top-2 right-[8rem] flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`} title={copied ? "Link copiato" : "Copia link a questa scheda"} aria-label="Copia link">
            {copied ? <Check className="w-4 h-4 text-amber-400" /> : <Link2 className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div className="p-4">
        <div className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest mb-1`}>{subtitle}</div>
        <h3 className={`text-lg font-bold ${t.centuryText} mb-3 font-prompt`}>{content?.title || subtitle}</h3>
        <p className={`text-sm leading-relaxed ${t.periodInactive} font-body`}>
          {content?.text || textFallback || "Contenuto in fase di allestimento."}
        </p>

        {expanded && content?.details && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest mb-2`}>Approfondimento</h4>
            <p className={`text-sm leading-relaxed ${t.periodInactive} font-body`}>{content.details}</p>
          </div>
        )}

        {expanded && content?.highlights?.length > 0 && (
          <div className="mt-4">
            <h4 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest mb-2`}>Punti chiave</h4>
            <ul className="space-y-1.5">
              {content.highlights.map((h, idx) => (
                <li key={idx} className={`flex items-start text-sm ${t.periodInactive} font-body`}>
                  <span className={`mr-2 mt-1.5 w-1.5 h-1.5 rounded-full ${t.headerText} flex-shrink-0`} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        <RelationChips groups={relations} darkMode={darkMode} />

        {deepDiveHref && (
          <div className="mt-5 flex justify-end">
            <button onClick={() => navigate(deepDiveHref)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`}>
              <BookOpen className="w-4 h-4" /> Entra nel percorso
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
