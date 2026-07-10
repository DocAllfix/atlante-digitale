import { useRef, useMemo, useState } from "react";
import { Check, PanelRightClose, PanelRightOpen, Bookmark, X, Search } from "lucide-react";
import { atlasTheme } from "@/lib/atlasTheme";
import { allThemes, allAuthors, getCity } from "@/lib/graph-selectors";

const MIN_WIDTH = 160;
const MAX_WIDTH = 480;

export default function EpistemologicalSidebar({
  activeThemes, onToggleTheme, darkMode, isOpen, onToggleOpen, width, onWidthChange,
  favorites, onOpenAuthor, onRemoveFavorite,
}) {
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const resizeRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allAuthors()
      .filter((a) => a.name.toLowerCase().includes(q) || getCity(a.cityId)?.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchQuery]);

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

  return (
    <>
      <button
        onClick={onToggleOpen}
        className={`absolute bottom-20 z-[1001] flex items-center justify-center w-10 h-10 rounded-l-lg font-outfit ${t.buttonBg} backdrop-blur-md border border-r-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg`}
        style={{ right: isOpen ? `${width}px` : 0 }}
        title={isOpen ? "Riduci filtri" : "Espandi filtri"}
        aria-label={isOpen ? "Riduci il pannello filtri" : "Espandi il pannello filtri"}
        aria-expanded={isOpen}
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
          <h2 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest`}>Filtri Tematici</h2>
        </div>

        {/* Ricerca autori/città */}
        <div className={`px-3 py-2 border-b ${t.sidebarBorder}`}>
          <div className="relative">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.headerText} opacity-60 pointer-events-none`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca autore o città…"
              aria-label="Cerca autore o città"
              className={`w-full pl-7 pr-2 py-1.5 text-sm rounded-md ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.periodInactive} placeholder:opacity-50 focus:outline-none focus:ring-1 focus:ring-amber-400/40`}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {searchResults.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { onOpenAuthor(a.id); setSearchQuery(""); }}
                  className={`flex items-center w-full px-2 py-1.5 text-left text-sm rounded ${t.periodInactive} ${t.periodHover}`}
                  title={`${getCity(a.cityId)?.name} — ${a.name}`}
                >
                  <span className="truncate">{getCity(a.cityId)?.name} — {a.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Temi (evidenziano i Paesi sulla mappa) */}
        <div className="flex-1 overflow-y-auto py-1">
          {allThemes().map((theme) => {
            const isActive = activeThemes.has(theme.id);
            return (
              <button
                key={theme.id}
                onClick={() => onToggleTheme(theme.id)}
                className="flex items-center w-full px-4 py-2.5 text-left group"
                role="checkbox"
                aria-checked={isActive}
                aria-label={`Tema: ${theme.label}`}
              >
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                  isActive
                    ? darkMode ? "bg-amber-400/80 border-amber-400/80" : "bg-amber-700/80 border-amber-700/80"
                    : darkMode ? "border-amber-200/30" : "border-amber-800/30"
                }`}>
                  {isActive && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className={`ml-3 text-sm transition-colors whitespace-nowrap ${isActive ? t.periodActive : `${t.periodInactive} ${t.periodHover}`}`}>
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preferiti (per autore) */}
        <div className={`border-t ${t.sidebarBorder} max-h-52 overflow-y-auto flex-shrink-0`}>
          <div className="px-4 py-3">
            <h2 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest flex items-center gap-1.5`}>
              <Bookmark className="w-3.5 h-3.5" /> Segnalibro
            </h2>
          </div>
          {(!favorites || favorites.length === 0) ? (
            <div className={`px-4 pb-3 text-xs ${t.periodInactive} italic`}>Nessun preferito</div>
          ) : (
            favorites.map((authorId) => {
              const a = allAuthors().find((x) => x.id === authorId);
              if (!a) return null;
              return (
                <div key={authorId} className="flex items-center group">
                  <button
                    onClick={() => onOpenAuthor(authorId)}
                    className={`flex-1 min-w-0 text-left px-4 py-2 text-sm ${t.periodInactive} ${t.periodHover} truncate`}
                    title={`${getCity(a.cityId)?.name} — ${a.name}`}
                  >
                    {getCity(a.cityId)?.name} — {a.name}
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(authorId)}
                    className={`px-2 py-2 ${t.periodInactive} ${t.periodHover} opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex-shrink-0`}
                    title="Rimuovi dai preferiti"
                    aria-label={`Rimuovi ${a.name} dai preferiti`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
