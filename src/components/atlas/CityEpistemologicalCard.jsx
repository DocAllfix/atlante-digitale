import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight, Shuffle, GripHorizontal, Volume2, VolumeX, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { getCityContent } from "@/lib/cityContent";
import { atlasTheme } from "@/lib/atlasTheme";

export default function CityEpistemologicalCard({ city, cityName, periodId, periodLabel, darkMode, initialX, initialY, onClose, onNavigate, canPrev, canNext, onCrossroad, crossroadLabel, author, isSaved, onToggleSave }) {
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const cardWidth = expanded ? 512 : 320;
  const [pos, setPos] = useState(() => ({
    x: Math.min(initialX || 288, window.innerWidth - cardWidth - 16),
    y: Math.min(initialY || 16, window.innerHeight - 120),
  }));
  const dragRef = useRef(null);
  const content = getCityContent(city, periodId);
  const t = atlasTheme[darkMode ? "dark" : "light"];

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
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

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: Math.max(0, Math.min(dragRef.current.posX + dx, window.innerWidth - cardWidth - 8)),
      y: Math.max(0, Math.min(dragRef.current.posY + dy, window.innerHeight - 60)),
    });
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  const widthClass = expanded ? "w-[32rem]" : "w-80";
  const imageHeight = expanded ? "h-56" : "h-40";

  return (
    <div
      className={`absolute z-[1002] ${widthClass} max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg ${t.sidebarBg} backdrop-blur-md border ${t.sidebarBorder} shadow-2xl transition-[width] duration-300`}
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`flex items-center justify-center py-1.5 cursor-move border-b ${t.sidebarBorder} select-none touch-none sticky top-0 z-20 ${t.sidebarBg} backdrop-blur-md`}
      >
        <GripHorizontal className={`w-4 h-4 ${t.headerText} opacity-80`} />
      </div>

      <div className="relative">
        {author && onToggleSave && (
          <button
            onClick={onToggleSave}
            className={`absolute top-2 left-2 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg z-10`}
            title={isSaved ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}
        {content?.image && (
          <img
            src={content.image}
            alt={content.title}
            className={`w-full ${imageHeight} object-cover transition-all duration-300`}
          />
        )}
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`}
          title="Chiudi"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`absolute top-2 right-12 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`}
          title={expanded ? "Riduci" : "Espandi"}
        >
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleSpeech}
          className={`absolute top-2 right-[5.5rem] flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`}
          title={speaking ? "Ferma audio" : "Ascolta il testo"}
        >
          {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        {onCrossroad && (
          <button
            onClick={onCrossroad}
            className={`absolute top-2 right-56 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg`}
            title={`Crocevia: passa a ${crossroadLabel}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
        )}
        {onNavigate && (
          <>
            <button
              onClick={() => onNavigate(-1)}
              disabled={!canPrev}
              className={`absolute top-2 right-44 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${canPrev ? t.buttonHoverBg : ""} transition-all duration-200 shadow-lg ${canPrev ? "" : "opacity-30 cursor-default"}`}
              title="Collegamento precedente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate(1)}
              disabled={!canNext}
              className={`absolute top-2 right-32 flex items-center justify-center w-8 h-8 rounded-full ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${canNext ? t.buttonHoverBg : ""} transition-all duration-200 shadow-lg ${canNext ? "" : "opacity-30 cursor-default"}`}
              title="Collegamento successivo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest mb-1`}>
          {cityName} · {periodLabel}
        </div>
        <h3 className={`text-lg font-bold ${t.centuryText} mb-3 font-prompt`}>
          {content?.title || cityName}
        </h3>
        <p className={`text-sm leading-relaxed ${t.periodInactive} font-body`}>
          {content?.text || "Contenuto in fase di allestimento."}
        </p>

        {expanded && content?.details && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest mb-2`}>
              Approfondimento
            </h4>
            <p className={`text-sm leading-relaxed ${t.periodInactive} font-body`}>
              {content.details}
            </p>
          </div>
        )}

        {expanded && content?.highlights?.length > 0 && (
          <div className="mt-4">
            <h4 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest mb-2`}>
              Punti chiave
            </h4>
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

        {expanded && (
          <div className="mt-5 flex justify-end">
            <a
              href={`/approfondisci?city=${city}&period=${periodId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg no-underline`}
            >
              <ExternalLink className="w-4 h-4" />
              Approfondisci
            </a>
          </div>
        )}
      </div>
    </div>
  );
}