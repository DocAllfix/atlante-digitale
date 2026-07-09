import { useState, useMemo, useEffect } from "react";
import { Sun, Moon, Globe, Search } from "lucide-react";
import WorldMap from "@/components/atlas/WorldMap";
import Timeline from "@/components/atlas/Timeline";
import EpistemologicalCard from "@/components/atlas/EpistemologicalCard";
import CityEpistemologicalCard from "@/components/atlas/CityEpistemologicalCard";
import EpistemologicalSidebar from "@/components/atlas/EpistemologicalSidebar";
import { TIME_PERIODS } from "@/lib/timePeriods";
import { THEMATIC_TOPICS, getAllTopics, findTopic } from "@/lib/thematicTopics";
import { atlasTheme } from "@/lib/atlasTheme";

export default function Atlas() {
  const [activePeriod, setActivePeriod] = useState(TIME_PERIODS[TIME_PERIODS.length - 1]);
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-darkmode") || "true"); } catch { return true; }
  });
  const [mode, setMode] = useState("geographic");
  const [openCards, setOpenCards] = useState([]);
  const [openCityCards, setOpenCityCards] = useState([]);
  const [activeTopics, setActiveTopics] = useState(new Set());
  const [blinkingCity, setBlinkingCity] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [epSidebarOpen, setEpSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(180);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-favorites") || "[]"); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem("atlas-favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem("atlas-darkmode", JSON.stringify(darkMode));
  }, [darkMode]);
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const isEpist = mode === "epistemological";

  const highlightedCountryNames = useMemo(() => {
    const names = new Set();
    for (const topic of getAllTopics()) {
      if (activeTopics.has(topic.id)) {
        topic.countries.forEach((c) => names.add(c));
      }
    }
    return names;
  }, [activeTopics]);

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    if (isEpist && (period.id === "1961-1970" || period.id === "1951-1960")) {
      setBlinkingCity("rome");
    } else if (isEpist) {
      setBlinkingCity(null);
    }
  };

  const handleCountrySelect = ({ country, featureName, x, y }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const offset = openCards.length * 36;
    setOpenCards((prev) => [
      ...prev,
      { id, country, featureName, initialX: x + offset, initialY: y + offset },
    ]);
  };

  const closeCard = (id) => {
    setOpenCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCitySelect = ({ city, cityName, x, y }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const offset = openCityCards.length * 36;
    setOpenCityCards((prev) => [
      ...prev,
      { id, city, cityName, initialX: x + offset, initialY: y + offset },
    ]);
  };

  const closeCityCard = (id) => {
    setOpenCityCards((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleMode = () => {
    if (isEpist) {
      setMode("geographic");
      setActiveTopics(new Set());
      setEpSidebarOpen(true);
    } else {
      setMode("epistemological");
      setEpSidebarOpen(true);
    }
  };

  const toggleTopic = (topicId) => {
    const topic = findTopic(topicId);
    const turningOn = !activeTopics.has(topicId);
    setActiveTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
    // "Funzione Fellini": dal tema → paese, città lampeggiante, anno e scheda
    if (turningOn && topic?.links?.length) {
      const link = topic.links[0];
      const period = TIME_PERIODS.find((p) => p.id === link.periodId);
      if (period) setActivePeriod(period);
      setTimelineOpen(true);
      setBlinkingCity(link.city);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setOpenCityCards((prev) => [
        ...prev,
        {
          id,
          themeId: topic.id,
          linkIndex: 0,
          city: link.city,
          cityName: link.cityName,
          periodId: link.periodId,
          periodLabel: period?.label,
          initialX: 288,
          initialY: 16,
        },
      ]);
      if (typeof link.lat === "number") {
        setFlyTarget({ lat: link.lat, lng: link.lng, zoom: 8, nonce: Date.now() });
      }
    } else if (!turningOn && topic?.links?.length) {
      setBlinkingCity(null);
    }
  };

  const navigateCityCard = (id, dir) => {
    const card = openCityCards.find((c) => c.id === id);
    if (!card?.themeId) return;
    const theme = findTopic(card.themeId);
    if (!theme?.links?.length) return;
    const newIndex = card.linkIndex + dir;
    if (newIndex < 0 || newIndex >= theme.links.length) return;
    const link = theme.links[newIndex];
    const period = TIME_PERIODS.find((p) => p.id === link.periodId);
    if (period) setActivePeriod(period);
    setTimelineOpen(true);
    setBlinkingCity(link.city);
    if (typeof link.lat === "number") {
      setFlyTarget({ lat: link.lat, lng: link.lng, zoom: 8, nonce: Date.now() });
    }
    setOpenCityCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, linkIndex: newIndex, city: link.city, cityName: link.cityName, periodId: link.periodId, periodLabel: period?.label } : c
      )
    );
  };

  const crossroadCityCard = (id, targetThemeId) => {
    const card = openCityCards.find((c) => c.id === id);
    if (!card?.themeId) return;
    const currentTheme = findTopic(card.themeId);
    const currentAuthor = currentTheme?.links?.[card.linkIndex]?.author;
    if (!currentAuthor) return;
    const targetTheme = findTopic(targetThemeId);
    if (!targetTheme?.links?.length) return;
    const targetIndex = targetTheme.links.findIndex((l) => l.author === currentAuthor);
    if (targetIndex < 0) return;
    const link = targetTheme.links[targetIndex];
    const period = TIME_PERIODS.find((p) => p.id === link.periodId);
    if (period) setActivePeriod(period);
    setTimelineOpen(true);
    setBlinkingCity(link.city);
    if (typeof link.lat === "number") {
      setFlyTarget({ lat: link.lat, lng: link.lng, zoom: 8, nonce: Date.now() });
    }
    setActiveTopics(new Set([targetThemeId]));
    setOpenCityCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, themeId: targetThemeId, linkIndex: targetIndex, city: link.city, cityName: link.cityName, periodId: link.periodId, periodLabel: period?.label } : c
      )
    );
  };

  const toggleFavorite = (card) => {
    const theme = card.themeId ? findTopic(card.themeId) : null;
    const author = theme?.links?.[card.linkIndex]?.author;
    if (!author) return;
    const favId = `${card.themeId}-${card.linkIndex}`;
    setFavorites((prev) =>
      prev.some((f) => f.favId === favId)
        ? prev.filter((f) => f.favId !== favId)
        : [...prev, { favId, city: card.city, cityName: card.cityName, themeId: card.themeId, linkIndex: card.linkIndex, author, periodId: card.periodId || activePeriod.id }]
    );
  };

  const isFavorite = (card) => favorites.some((f) => f.favId === `${card.themeId}-${card.linkIndex}`);

  const openFavorite = (fav) => {
    const theme = findTopic(fav.themeId);
    const link = theme?.links?.[fav.linkIndex];
    if (!link) return;
    const period = TIME_PERIODS.find((p) => p.id === link.periodId);
    if (period) setActivePeriod(period);
    setTimelineOpen(true);
    setBlinkingCity(link.city);
    if (typeof link.lat === "number") {
      setFlyTarget({ lat: link.lat, lng: link.lng, zoom: 8, nonce: Date.now() });
    }
    setActiveTopics(new Set([fav.themeId]));
    setOpenCityCards((prev) => {
      if (prev.some((c) => c.themeId === fav.themeId && c.linkIndex === fav.linkIndex)) return prev;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      return [...prev, { id, themeId: fav.themeId, linkIndex: fav.linkIndex, city: link.city, cityName: link.cityName, periodId: link.periodId, periodLabel: period?.label, initialX: 288, initialY: 16 }];
    });
  };

  const removeFavorite = (favId) => {
    setFavorites((prev) => prev.filter((f) => f.favId !== favId));
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden ${darkMode ? "" : "atlas-light"} ${isEpist && epSidebarOpen ? "epist-sidebar-open" : ""}`} style={{ '--sidebar-w': isEpist && epSidebarOpen ? `${sidebarWidth}px` : '0px' }}>
      <WorldMap
        activePeriod={activePeriod}
        darkMode={darkMode}
        mode={mode}
        onCountrySelect={handleCountrySelect}
        onCitySelect={handleCitySelect}
        highlightedCountryNames={highlightedCountryNames}
        blinkingCity={blinkingCity}
        flyTarget={flyTarget}
      />
      <Timeline activePeriod={activePeriod} onPeriodChange={handlePeriodChange} darkMode={darkMode} isOpen={timelineOpen} onToggleOpen={() => setTimelineOpen(!timelineOpen)} />

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 z-[1001] flex items-center justify-center w-12 h-12 rounded-l-lg ${t.buttonBg} backdrop-blur-md border border-r-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg`}
        style={{ right: isEpist && epSidebarOpen ? `${sidebarWidth + 16}px` : '16px' }}
        title={darkMode ? "Modalità Chiara" : "Modalità Scura"}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <button
        onClick={toggleMode}
        className={`absolute bottom-4 z-[1001] flex items-center justify-center w-12 h-12 rounded-l-lg ${t.buttonBg} backdrop-blur-md border border-r-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg`}
        style={{ right: isEpist && epSidebarOpen ? `${sidebarWidth + 16}px` : '16px' }}
        title={isEpist ? "Passa a Modalità Geografica" : "Passa a Modalità Epistemologica"}
      >
        {isEpist ? <Globe className="w-6 h-6" /> : <Search className="w-6 h-6" />}
      </button>

      {isEpist && (
        <EpistemologicalSidebar
          activeTopics={activeTopics}
          onToggleTopic={toggleTopic}
          darkMode={darkMode}
          isOpen={epSidebarOpen}
          onToggleOpen={() => setEpSidebarOpen(!epSidebarOpen)}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
          favorites={favorites}
          onOpenFavorite={openFavorite}
          onRemoveFavorite={removeFavorite}
          onSearchSelect={openFavorite}
        />
      )}

      {isEpist &&
        openCards.map((card) => (
          <EpistemologicalCard
            key={card.id}
            country={card.country}
            featureName={card.featureName}
            periodId={activePeriod.id}
            periodLabel={activePeriod.label}
            darkMode={darkMode}
            initialX={card.initialX}
            initialY={card.initialY}
            onClose={() => closeCard(card.id)}
          />
        ))}

      {isEpist &&
        openCityCards.map((card) => {
          const theme = card.themeId ? findTopic(card.themeId) : null;
          const links = theme?.links || [];
          const showNav = links.length > 1;
          const currentAuthor = links[card.linkIndex]?.author;
          const crossroad = currentAuthor
            ? getAllTopics().find((t) => t.id !== card.themeId && t.links?.some((l) => l.author === currentAuthor))
            : null;
          return (
            <CityEpistemologicalCard
              key={card.id}
              city={card.city}
              cityName={card.cityName}
              periodId={card.periodId || activePeriod.id}
              periodLabel={card.periodLabel || activePeriod.label}
              darkMode={darkMode}
              initialX={card.initialX}
              initialY={card.initialY}
              onClose={() => closeCityCard(card.id)}
              onNavigate={showNav ? (dir) => navigateCityCard(card.id, dir) : undefined}
              canPrev={showNav && card.linkIndex > 0}
              canNext={showNav && card.linkIndex < links.length - 1}
              onCrossroad={crossroad ? () => crossroadCityCard(card.id, crossroad.id) : undefined}
              crossroadLabel={crossroad?.label}
              author={currentAuthor}
              isSaved={isFavorite(card)}
              onToggleSave={() => toggleFavorite(card)}
            />
          );
        })}
    </div>
  );
}