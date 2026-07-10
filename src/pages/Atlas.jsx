import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Sun, Moon, Globe, Layers, XCircle, Play, Pause, ChevronLeft, ChevronRight, Route } from "lucide-react";
import WorldMap from "@/components/atlas/WorldMap";
import Timeline from "@/components/atlas/Timeline";
import EntityCard from "@/components/atlas/EntityCard";
import EpistemologicalSidebar from "@/components/atlas/EpistemologicalSidebar";
import { TIME_PERIODS } from "@/lib/timePeriods";
import { atlasTheme } from "@/lib/atlasTheme";
import { AUTHORS } from "@/data/graph";
import { HISTORY_IMAGES } from "@/data/historyImages";
import { AUTHOR_CONTENT } from "@/data/visualCultureContent";
import { getEpistemologicalContent } from "@/lib/epistemologicalContent";
import { getCityContent } from "@/lib/cityContent";
import {
  getCountry, getCity, getAuthor, getTheme, getThemesOfAuthor, getRelatedAuthors,
  getAuthorsSamePeriod, getAuthorsInCity, getAuthorsByCountry, getAuthorsByTheme,
  getCountryOfAuthor,
} from "@/lib/graph-selectors";

const periodLabelOf = (id) => TIME_PERIODS.find((p) => p.id === id)?.label || id;
const sameStep = (a, b) =>
  !!a && !!b && a.kind === b.kind &&
  (a.kind === "country" ? a.countryId === b.countryId && a.periodId === b.periodId : a.authorId === b.authorId);
const stepKey = (s) => (s?.kind === "country" ? `c:${s.countryId}:${s.periodId}` : `a:${s?.authorId}`);

export default function Atlas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const didInit = useRef(false);

  const [activePeriod, setActivePeriod] = useState(TIME_PERIODS[TIME_PERIODS.length - 1]);
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-darkmode") || "true"); } catch { return true; }
  });
  const [mode, setMode] = useState("geographic");
  const [path, setPath] = useState([]);           // percorso di navigazione (logica museale)
  const [cardPos, setCardPos] = useState({ x: 300, y: 16 });
  const [activeThemes, setActiveThemes] = useState(new Set());
  const [guideIndex, setGuideIndex] = useState(0);
  const [blinkingCity, setBlinkingCity] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [epSidebarOpen, setEpSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [comparePeriodId, setComparePeriodId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("atlas-favorites") || "[]");
      return Array.isArray(raw) ? raw.filter((x) => typeof x === "string" && AUTHORS[x]) : [];
    } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("atlas-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("atlas-darkmode", JSON.stringify(darkMode)); }, [darkMode]);

  // Animazione dei confini nel tempo (modalità "Esplora mappa").
  useEffect(() => {
    if (!playing || mode === "epistemological") return;
    const iv = setInterval(() => {
      setActivePeriod((p) => {
        const idx = TIME_PERIODS.findIndex((x) => x.id === p.id);
        return TIME_PERIODS[(idx + 1) % TIME_PERIODS.length];
      });
    }, 1600);
    return () => clearInterval(iv);
  }, [playing, mode]);

  const t = atlasTheme[darkMode ? "dark" : "light"];
  const isEpist = mode === "epistemological";
  const current = path[path.length - 1] || null;

  const highlightedCountryNames = useMemo(() => {
    const names = new Set();
    for (const a of Object.values(AUTHORS)) {
      if (a.themeIds.some((th) => activeThemes.has(th))) {
        const c = getCountryOfAuthor(a.id);
        if (c) names.add(c.name);
      }
    }
    return names;
  }, [activeThemes]);

  // ── Volo gentile verso l'entità (D1) ────────────────────────────────────────
  const doFly = (step) => {
    if (step.kind === "author") {
      const a = getAuthor(step.authorId);
      const c = a && getCity(a.cityId);
      if (c) { setBlinkingCity(c.id); setFlyTarget({ lat: c.lat, lng: c.lng, zoom: 6, nonce: Date.now() }); }
    } else if (step.kind === "country") {
      const c = getCountry(step.countryId);
      if (c) setFlyTarget({ lat: c.lat, lng: c.lng, zoom: 4, nonce: Date.now() });
    }
  };

  // Nuovo percorso (mappa, ricerca, preferiti, deep-link)
  const focusEntity = (step, { x, y, fly = false } = {}) => {
    setMode("epistemological");
    setPath([step]);
    setCardPos({ x: typeof x === "number" ? x : 300, y: typeof y === "number" ? y : 16 });
    if (fly) doFly(step);
  };
  // Prosegui il percorso (chip di relazione)
  const pushEntity = (step, { fly = true } = {}) => {
    setPath((prev) => (sameStep(prev[prev.length - 1], step) ? prev : [...prev, step]));
    if (fly) doFly(step);
  };

  const openAuthor = (authorId) => pushEntity({ kind: "author", authorId });
  const openCountry = (countryId) => pushEntity({ kind: "country", countryId, periodId: activePeriod.id });
  const focusAuthor = (authorId) => focusEntity({ kind: "author", authorId }, { fly: true });

  const openTheme = (themeId) => {
    setGuideIndex(0);
    setActiveThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId); else next.add(themeId);
      return next;
    });
  };

  const popTo = (i) => setPath((prev) => prev.slice(0, i + 1));
  const back = () => setPath((prev) => prev.slice(0, -1));
  const clearPath = () => setPath([]);

  // ── Ingressi dalla mappa ─────────────────────────────────────────────────
  const handleCountrySelect = ({ country, x, y }) =>
    focusEntity({ kind: "country", countryId: country, periodId: activePeriod.id }, { x, y });
  const handleCitySelect = ({ city, x, y }) => {
    const authors = getAuthorsInCity(city);
    if (authors.length === 0) return;
    const match = authors.find((a) => a.periodId === activePeriod.id) || authors[0];
    focusEntity({ kind: "author", authorId: match.id }, { x, y });
  };

  // ── Preferiti ────────────────────────────────────────────────────────────
  const isFavorite = (authorId) => favorites.includes(authorId);
  const toggleFavorite = (authorId) =>
    setFavorites((prev) => prev.includes(authorId) ? prev.filter((x) => x !== authorId) : [...prev, authorId]);
  const removeFavorite = (authorId) => setFavorites((prev) => prev.filter((x) => x !== authorId));

  const toggleMode = () => {
    if (isEpist) { setMode("geographic"); setActiveThemes(new Set()); clearPath(); }
    else { setMode("epistemological"); setEpSidebarOpen(true); setPlaying(false); setComparePeriodId(null); }
  };

  // ── Deep-link (URL condivisibili) ─────────────────────────────────────────
  useEffect(() => {
    const author = searchParams.get("author");
    const country = searchParams.get("country");
    const period = searchParams.get("period");
    if (author && getAuthor(author)) {
      focusEntity({ kind: "author", authorId: author }, { fly: true });
    } else if (country && getCountry(country)) {
      const pid = period && TIME_PERIODS.some((p) => p.id === period) ? period : activePeriod.id;
      const p = TIME_PERIODS.find((x) => x.id === pid);
      if (p) setActivePeriod(p);
      focusEntity({ kind: "country", countryId: country, periodId: pid }, { fly: true });
    }
    didInit.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!didInit.current) return;
    const cur = path[path.length - 1];
    const params = {};
    if (cur?.kind === "author") params.author = cur.authorId;
    else if (cur?.kind === "country") { params.country = cur.countryId; params.period = cur.periodId; }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const shareUrlFor = (step) => {
    if (typeof window === "undefined" || !step) return undefined;
    const base = `${window.location.origin}/atlante`;
    if (step.kind === "author") return `${base}?author=${step.authorId}`;
    return `${base}?country=${step.countryId}&period=${step.periodId}`;
  };

  // ── Relazioni (ponti) ─────────────────────────────────────────────────────
  const relationsForAuthor = (authorId) => {
    const a = getAuthor(authorId);
    if (!a) return [];
    const country = getCountryOfAuthor(authorId);
    return [
      { label: "Temi", items: getThemesOfAuthor(authorId).map((th) => ({ id: th.id, label: th.label, onClick: () => openTheme(th.id) })) },
      { label: "Autori collegati", items: getRelatedAuthors(authorId).map((o) => ({ id: o.id, label: o.name, onClick: () => openAuthor(o.id) })) },
      { label: "Stesso periodo", items: getAuthorsSamePeriod(a.periodId, authorId).map((o) => ({ id: o.id, label: o.name, onClick: () => openAuthor(o.id) })) },
      { label: "Paese", items: country ? [{ id: country.id, label: country.name, onClick: () => openCountry(country.id) }] : [] },
    ];
  };
  const relationsForCountry = (countryId) => {
    const authors = getAuthorsByCountry(countryId);
    const themeMap = new Map();
    authors.forEach((a) => getThemesOfAuthor(a.id).forEach((th) => themeMap.set(th.id, th.label)));
    return [
      { label: "Autori", items: authors.map((a) => ({ id: a.id, label: a.name, onClick: () => openAuthor(a.id) })) },
      { label: "Temi", items: [...themeMap].map(([id, label]) => ({ id, label, onClick: () => openTheme(id) })) },
    ];
  };

  const breadcrumb = path.map((step, i) => ({
    id: stepKey(step),
    label: step.kind === "author" ? getAuthor(step.authorId)?.name : getCountry(step.countryId)?.name,
    onClick: () => popTo(i),
  }));

  // ── Percorso guidato (un tema attivo) ─────────────────────────────────────
  const singleTheme = activeThemes.size === 1 ? [...activeThemes][0] : null;
  const guideAuthors = singleTheme ? getAuthorsByTheme(singleTheme) : [];
  const goGuide = (dir) => {
    if (!guideAuthors.length) return;
    const next = (guideIndex + dir + guideAuthors.length) % guideAuthors.length;
    setGuideIndex(next);
    focusAuthor(guideAuthors[next].id);
  };

  // ── Props della card corrente ─────────────────────────────────────────────
  let cardProps = null;
  if (current?.kind === "country") {
    const c = getCountry(current.countryId);
    cardProps = {
      subtitle: `${c?.name} · ${periodLabelOf(current.periodId)}`,
      content: getEpistemologicalContent(current.countryId, current.periodId),
      image: HISTORY_IMAGES[`${current.countryId}:${current.periodId}`] || HISTORY_IMAGES[`${current.countryId}:default`],
      textFallback: `Esplora gli autori e i temi legati a ${c?.name}.`,
      relations: relationsForCountry(current.countryId),
    };
  } else if (current?.kind === "author") {
    const a = getAuthor(current.authorId);
    const city = a && getCity(a.cityId);
    if (a) cardProps = {
      subtitle: `${city?.name} · ${periodLabelOf(a.periodId)}`,
      content: AUTHOR_CONTENT[current.authorId] || getCityContent(a.cityId, a.periodId),
      image: a.image,
      relations: relationsForAuthor(current.authorId),
      isSaved: isFavorite(current.authorId),
      onToggleSave: () => toggleFavorite(current.authorId),
      deepDiveHref: city?.deepDiveId ? `/approfondisci?city=${city.deepDiveId}&period=${a.periodId}` : undefined,
    };
  }

  return (
    <div
      className={`relative h-screen w-full overflow-hidden ${darkMode ? "" : "atlas-light"} ${isEpist && epSidebarOpen ? "epist-sidebar-open" : ""}`}
      style={{ "--sidebar-w": isEpist && epSidebarOpen ? `${sidebarWidth}px` : "0px" }}
    >
      <a href="#atlas-controls" className="skip-link">Vai ai controlli della mappa</a>
      <WorldMap
        activePeriod={activePeriod}
        darkMode={darkMode}
        mode={mode}
        onCountrySelect={handleCountrySelect}
        onCitySelect={handleCitySelect}
        highlightedCountryNames={highlightedCountryNames}
        blinkingCity={blinkingCity}
        flyTarget={flyTarget}
        comparePeriod={TIME_PERIODS.find((p) => p.id === comparePeriodId) || null}
      />
      <Timeline activePeriod={activePeriod} onPeriodChange={setActivePeriod} darkMode={darkMode} isOpen={timelineOpen} onToggleOpen={() => setTimelineOpen(!timelineOpen)} />

      {/* Controlli "Esplora mappa": animazione + confronto */}
      {!isEpist && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-2 font-outfit max-w-[calc(100vw-1.5rem)] flex-wrap justify-center">
          <button
            onClick={() => setPlaying((v) => !v)}
            className={`flex items-center gap-2 px-3 h-11 rounded-lg ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-200 shadow-lg text-sm`}
            title={playing ? "Ferma l'animazione" : "Anima i confini nel tempo"}
            aria-label={playing ? "Ferma l'animazione dei confini" : "Anima i confini nel tempo"}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {playing ? "Pausa" : "Anima confini"}
          </button>
          <div className={`flex items-center gap-2 px-3 h-11 rounded-lg ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.periodInactive} shadow-lg text-sm`}>
            <span className="opacity-70">Confronta</span>
            <select
              value={comparePeriodId || ""}
              onChange={(e) => setComparePeriodId(e.target.value || null)}
              className="bg-transparent focus:outline-none cursor-pointer"
              title="Sovrapponi i confini di un'altra epoca"
            >
              <option value="">— nessuna —</option>
              {TIME_PERIODS.filter((p) => p.geoYear != null).map((p) => (
                <option key={p.id} value={p.id} className="text-black">{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Percorso guidato (un tema attivo) */}
      {isEpist && singleTheme && guideAuthors.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-1 font-outfit">
          <div className={`flex items-center gap-1 h-11 pl-2 pr-1 rounded-lg ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} shadow-lg text-sm`}>
            <Route className={`w-4 h-4 ${t.headerText} mr-1`} />
            <button onClick={() => goGuide(-1)} className={`flex items-center justify-center w-8 h-8 rounded ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg}`} title="Autore precedente" aria-label="Autore precedente"><ChevronLeft className="w-4 h-4" /></button>
            <span className={`px-1.5 ${t.periodInactive} whitespace-nowrap`}>{getTheme(singleTheme)?.label} · {guideIndex + 1}/{guideAuthors.length}</span>
            <button onClick={() => goGuide(1)} className={`flex items-center justify-center w-8 h-8 rounded ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg}`} title="Autore successivo" aria-label="Autore successivo"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Barra superiore sinistra: titolo + toggle */}
      <div id="atlas-controls" className="absolute top-4 left-4 z-[1001] flex flex-col gap-2 font-outfit">
        <a href="/" className={`text-sm font-bold font-prompt ${t.centuryText} no-underline`}>Chronos Atlas</a>
        <div className={`flex rounded-lg overflow-hidden border ${t.buttonBorder} ${t.buttonBg} backdrop-blur-md shadow-lg text-xs`}>
          <button onClick={() => isEpist && toggleMode()} className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${!isEpist ? "bg-amber-400/20 " + t.centuryText : `${t.buttonText} ${t.buttonHoverBg}`}`} title="Sfoglia la geografia storica" aria-pressed={!isEpist}>
            <Globe className="w-4 h-4" /> Esplora mappa
          </button>
          <button onClick={() => !isEpist && toggleMode()} className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${isEpist ? "bg-amber-400/20 " + t.centuryText : `${t.buttonText} ${t.buttonHoverBg}`}`} title="Mostra autori, opere e temi" aria-pressed={isEpist}>
            <Layers className="w-4 h-4" /> Contenuti
          </button>
        </div>
        <div className={`text-[11px] leading-snug px-2.5 py-2 rounded-lg ${t.buttonBg} backdrop-blur-md border ${t.buttonBorder} ${t.periodInactive} max-w-[190px]`}>
          {isEpist ? (
            <>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400/40 inline-block" /> Paese con contenuto</div>
              <div className="flex items-center gap-1.5 mt-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "radial-gradient(circle,#fef3c7,#f59e0b)" }} /> Città-autore</div>
              <div className="mt-1 opacity-80">Clicca e segui i collegamenti.</div>
            </>
          ) : (
            <span>Geografia e confini nel tempo. Passa a <strong>Contenuti</strong> per esplorare autori e temi.</span>
          )}
        </div>
      </div>

      {/* Dark mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 z-[1001] flex items-center justify-center w-12 h-12 rounded-l-lg ${t.buttonBg} backdrop-blur-md border border-r-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg`}
        style={{ right: isEpist && epSidebarOpen ? `${sidebarWidth + 16}px` : "16px" }}
        title={darkMode ? "Modalità Chiara" : "Modalità Scura"}
        aria-label={darkMode ? "Passa alla modalità chiara" : "Passa alla modalità scura"}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Chiudi il percorso */}
      {isEpist && path.length > 0 && (
        <button
          onClick={clearPath}
          className={`absolute bottom-4 z-[1001] flex items-center gap-2 px-3 h-11 rounded-l-lg ${t.buttonBg} backdrop-blur-md border border-r-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg text-sm font-outfit`}
          style={{ right: isEpist && epSidebarOpen ? `${sidebarWidth + 16}px` : "16px" }}
          title="Chiudi le schede"
          aria-label="Chiudi le schede aperte"
        >
          <XCircle className="w-5 h-5" /> Chiudi
        </button>
      )}

      {isEpist && (
        <EpistemologicalSidebar
          activeThemes={activeThemes}
          onToggleTheme={openTheme}
          darkMode={darkMode}
          isOpen={epSidebarOpen}
          onToggleOpen={() => setEpSidebarOpen(!epSidebarOpen)}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
          favorites={favorites}
          onOpenAuthor={focusAuthor}
          onRemoveFavorite={removeFavorite}
        />
      )}

      {isEpist && current && cardProps && (
        <EntityCard
          key={stepKey(current)}
          {...cardProps}
          darkMode={darkMode}
          initialX={cardPos.x}
          initialY={cardPos.y}
          breadcrumb={breadcrumb}
          onBack={back}
          shareUrl={shareUrlFor(current)}
          onClose={clearPath}
        />
      )}
    </div>
  );
}
