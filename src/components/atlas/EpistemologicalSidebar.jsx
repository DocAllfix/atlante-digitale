import { useRef, useMemo, useState } from "react";
import { Check, PanelRightClose, PanelRightOpen, Bookmark, X, Search } from "lucide-react";
import { THEMATIC_TOPICS } from "@/lib/thematicTopics";
import { atlasTheme } from "@/lib/atlasTheme";

const MIN_WIDTH = 140;
const MAX_WIDTH = 480;

export default function EpistemologicalSidebar({ activeTopics, onToggleTopic, darkMode, isOpen, onToggleOpen, width, onWidthChange, favorites, onOpenFavorite, onRemoveFavorite, onSearchSelect }) {
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const resizeRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchIndex = useMemo(() => {
    const index = [];
    for (const topic of THEMATIC_TOPICS) {
      if (topic.links) topic.links.forEach((link, i) => index.push({ themeId: topic.id, linkIndex: i, author: link.author, cityName: link.cityName }));
      if (topic.subtopics) for (const sub of topic.subtopics) if (sub.links) sub.links.forEach((link, i) => index.push({ themeId: sub.id, linkIndex: i, author: link.author, cityName: link.cityName }));
    }
    return index;
  }, []);
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((e) => e.author?.toLowerCase().includes(q) || e.cityName?.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery, searchIndex]);

  const onResizePointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeRef.current = { startX: e.clientX, startWidth: width };
  };

  const onResizePointerMove = (e) => {
    if (!resizeRef.current) return;
    const dx = resizeRef.current.startX - e.clientX;
    onWidthChange(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, resizeRef.current.startWidth + dx)));
  };

  const onResizePointerUp = (e) => {
    resizeRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  const renderTopic = (topic, indented = false) => {
    const isActive = activeTopics.has(topic.id);
    return (
      <button
        key={topic.id}
        onClick={() => onToggleTopic(topic.id)}
        className={`flex items-center w-full ${indented ? "pl-8 pr-4" : "px-4"} py-2.5 text-left group`}
      >
        <div
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            isActive
              ? darkMode
                ? "bg-amber-400/80 border-amber-400/80"
                : "bg-amber-700/80 border-amber-700/80"
              : darkMode
                ? "border-amber-200/30"
                : "border-amber-800/30"
          }`}
        >
          {isActive && <Check className="w-3 h-3 text-black" />}
        </div>
        <span
          className={`ml-3 text-sm transition-colors whitespace-nowrap ${
            isActive ? t.periodActive : `${t.periodInactive} ${t.periodHover}`
          }`}
        >
          {topic.label}
        </span>
      </button>
    );
  };

  return (
    <>
      <button
        onClick={onToggleOpen}
        className={`absolute bottom-20 z-[1001] flex items-center justify-center w-10 h-10 rounded-l-lg font-outfit ${t.buttonBg} backdrop-blur-md border border-r-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg`}
        style={{ right: isOpen ? `${width}px` : 0 }}
        title={isOpen ? "Riduci filtri" : "Espandi filtri"}
      >
        {isOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
      </button>

      <div
        className={`absolute top-0 right-0 z-[1000] h-full font-outfit ${t.sidebarBg} backdrop-blur-md border-l ${t.sidebarBorder} flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: `${width}px` }}
      >
        <div
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
          className={`absolute top-0 left-0 w-1.5 h-full cursor-col-resize z-10 transition-colors ${
            darkMode ? "hover:bg-amber-400/20" : "hover:bg-amber-700/20"
          }`}
        />

        <div className={`px-4 py-4 border-b ${t.sidebarBorder}`}>
          <h2 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest`}>
            Filtri Tematici
          </h2>
        </div>
        <div className={`px-3 py-2 border-b ${t.sidebarBorder}`}>
          <div className="relative">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.headerText} opacity-60 pointer-events-none`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca..."
              className={`w-full pl-7 pr-2 py-1.5 text-sm rounded-md ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.periodInactive} placeholder:opacity-50 focus:outline-none focus:ring-1 focus:ring-amber-400/40`}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {searchResults.map((r) => (
                <button
                  key={`${r.themeId}-${r.linkIndex}`}
                  onClick={() => { onSearchSelect({ themeId: r.themeId, linkIndex: r.linkIndex }); setSearchQuery(""); }}
                  className={`flex items-center w-full px-2 py-1.5 text-left text-sm rounded ${t.periodInactive} ${t.periodHover}`}
                  title={`${r.cityName} - ${r.author}`}
                >
                  <span className="truncate">{r.cityName} - {r.author}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {THEMATIC_TOPICS.map((topic) => {
            if (topic.subtopics) {
              const isMacroActive = activeTopics.has(topic.id);
              return (
                <div key={topic.id}>
                  <button
                    onClick={() => onToggleTopic(topic.id)}
                    className="flex items-center w-full px-4 pt-3 pb-1 text-left group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        isMacroActive
                          ? darkMode
                            ? "bg-amber-400/80 border-amber-400/80"
                            : "bg-amber-700/80 border-amber-700/80"
                          : darkMode
                            ? "border-amber-200/30"
                            : "border-amber-800/30"
                      }`}
                    >
                      {isMacroActive && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <span className={`ml-3 text-[11px] font-semibold ${t.headerText} uppercase tracking-widest leading-tight`}>
                      {topic.label.split(" ").map((w, i) => (
                        <span key={i} className="block">{w}</span>
                      ))}
                    </span>
                  </button>
                  {topic.subtopics.map((sub) => renderTopic(sub, true))}
                </div>
              );
            }
            return renderTopic(topic);
          })}
        </div>
        <div className={`border-t ${t.sidebarBorder} max-h-52 overflow-y-auto flex-shrink-0`}>
          <div className="px-4 py-3">
            <h2 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest flex items-center gap-1.5`}>
              <Bookmark className="w-3.5 h-3.5" />
              Segnalibro
            </h2>
          </div>
          {(!favorites || favorites.length === 0) ? (
            <div className={`px-4 pb-3 text-xs ${t.periodInactive} italic`}>Nessun preferito</div>
          ) : (
            favorites.map((fav) => (
              <div key={fav.favId} className="flex items-center group">
                <button
                  onClick={() => onOpenFavorite(fav)}
                  className={`flex-1 min-w-0 text-left px-4 py-2 text-sm ${t.periodInactive} ${t.periodHover} truncate`}
                  title={`${fav.cityName} - ${fav.author}`}
                >
                  {fav.cityName} - {fav.author}
                </button>
                <button
                  onClick={() => onRemoveFavorite(fav.favId)}
                  className={`px-2 py-2 ${t.periodInactive} ${t.periodHover} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}
                  title="Rimuovi dai preferiti"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}