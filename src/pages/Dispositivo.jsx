import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { Route, ArrowUp } from "lucide-react";
import EntityCard from "@/components/atlas/EntityCard";
import { useReveal } from "@/motion/useReveal";
import { useTheme } from "@/theme/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { AUTHOR_CONTENT } from "@/data/visualCultureContent";
import { CATEGORIES } from "@/data/dispositivoContent";
import {
  allDevices, getDevice, getRelatedAuthorsOfDevice, getRelatedThemesOfDevice,
  getDevicesByAuthor, getDeviceThemeIds, allDeviceAuthors,
} from "@/lib/dispositivo-selectors";
import {
  getAuthor, getCity, getCountryOfAuthor, getThemesOfAuthor, getRelatedAuthors,
  allThemes, getTheme,
} from "@/lib/graph-selectors";

// Parete museale a scorrimento: spina cronologica dei dispositivi (1894→2025).
// Ogni nodo mostra solo immagine + anno + nome; tutto il resto (categoria,
// film/videogiochi, autori/temi collegati, ponti) si legge aprendo la scheda,
// che si apre come "post-it" ancorato alla pagina, trascinabile e chiudibile.
// La sezione "Percorsi" (in alto a destra) illumina i dispositivi legati a un
// autore o a un tema.

function DeviceNode({ device, dimmed, scrollDirRef, onOpenDevice }) {
  const alignRight = device.index % 2 === 1;
  // Comparsa ripetuta e direzionale (vedi useReveal): si anima scorrendo verso
  // il basso; verso l'alto i nodi già visti restano fissi.
  const { ref, initial, animate } = useReveal({ scrollDirRef });

  return (
    <div
      style={{ opacity: dimmed ? 0.12 : 1, transition: "opacity .4s ease" }}
      className={`relative flex ${alignRight ? "sm:justify-end" : "sm:justify-start"}`}
    >
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        className={`w-full sm:w-[46%] ${alignRight ? "sm:pl-10" : "sm:pr-10"}`}
      >
        <button
          onClick={(e) => onOpenDevice(device.id, e)}
          className={`w-full flex items-center gap-5 text-left rounded-xl p-2 -m-2 hover:bg-white/5 transition-colors ${alignRight ? "sm:flex-row-reverse sm:text-right" : ""}`}
        >
          {/* Sul lato del testo l'immagine mantiene l'ingombro di prima
              (sm:w-28); resa al doppio, sborda verso il lato ESTERNO della
              colonna (spazio vuoto), così il testo resta di fianco alla foto
              nella posizione di prima, senza sovrapporsi né toccare la spina. */}
          {device.image && (
            <span className="relative shrink-0 w-40 h-40 sm:w-28 sm:h-28">
              <motion.img
                layoutId={`dev-img-${device.id}`}
                src={device.image}
                alt=""
                loading="lazy"
                className={`w-full h-full object-contain sm:absolute sm:top-[-3.5rem] sm:w-56 sm:h-56 sm:max-w-none ${alignRight ? "sm:left-0" : "sm:right-0"} drop-shadow-[0_0_12px_rgba(251,191,36,0.2)]`}
              />
            </span>
          )}
          <div>
            <div className="text-amber-300 font-prompt font-semibold tabular-nums text-base">{device.year}</div>
            <div className="text-amber-50/90 font-semibold text-lg sm:text-xl leading-tight">{device.name}</div>
          </div>
        </button>
      </motion.div>
    </div>
  );
}

export default function Dispositivo() {
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const rootRef = useRef(null);
  const devices = useMemo(() => allDevices().map((d, i) => ({ ...d, index: i })), []);
  const deviceAuthors = useMemo(() => allDeviceAuthors(), []);

  // Bacheca di schede (post-it). z crescente per il primo piano.
  const [cards, setCards] = useState([]);
  const zTop = useRef(1002);
  const [filter, setFilter] = useState(null); // { kind:'theme'|'author', id }
  const [panelOpen, setPanelOpen] = useState(false);
  const [pathTab, setPathTab] = useState("author"); // "author" | "theme"

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });

  // Tracker della direzione di scroll (ref, niente re-render).
  const scrollDirRef = useRef("down");
  const lastYRef = useRef(0);
  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollDirRef.current = y >= lastYRef.current ? "down" : "up";
      lastYRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCard = (kind, entityId, e) => {
    const key = `${kind}:${entityId}`;
    if (isMobile) { setCards([{ key, kind, entityId, x: 0, y: 0, z: ++zTop.current }]); return; }
    const px = (e?.pageX ?? window.scrollX + Math.max(16, window.innerWidth / 2 - 160)) + 8;
    const py = (e?.pageY ?? window.scrollY + 100) + 8;
    setCards((prev) => {
      const found = prev.find((c) => c.key === key);
      if (found) return prev.map((c) => (c.key === key ? { ...c, z: ++zTop.current } : c));
      let x = px, y = py;
      while (prev.some((c) => Math.abs(c.x - x) < 12 && Math.abs(c.y - y) < 12)) { x += 24; y += 24; }
      return [...prev, { key, kind, entityId, x, y, z: ++zTop.current }];
    });
  };
  const closeCard = (key) => setCards((prev) => prev.filter((c) => c.key !== key));
  const raise = (key) => setCards((prev) => prev.map((c) => (c.key === key ? { ...c, z: ++zTop.current } : c)));
  const maxZ = cards.length ? Math.max(...cards.map((c) => c.z)) : 0;

  const openDevice = (id, e) => openCard("device", id, e);
  const openAuthor = (id, e) => openCard("author", id, e);

  // Deep-link: ?device=<id> apre quella scheda all'avvio.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const id = searchParams.get("device");
    if (id && getDevice(id)) openCard("device", id, null);
  }, [searchParams]);

  const relationsForDevice = (deviceId) => [
    { label: "Autori collegati", items: getRelatedAuthorsOfDevice(deviceId).map((a) => ({ id: a.id, label: a.name, onClick: (e) => openAuthor(a.id, e) })) },
    { label: "Temi collegati", items: getRelatedThemesOfDevice(deviceId).map((th) => ({ id: th.id, label: th.label, onClick: () => setFilter({ kind: "theme", id: th.id }) })) },
  ];
  const relationsForAuthor = (authorId) => {
    const country = getCountryOfAuthor(authorId);
    return [
      { label: "Temi", items: getThemesOfAuthor(authorId).map((th) => ({ id: th.id, label: th.label, onClick: () => setFilter({ kind: "theme", id: th.id }) })) },
      { label: "Autori collegati", items: getRelatedAuthors(authorId).map((o) => ({ id: o.id, label: o.name, onClick: (e) => openAuthor(o.id, e) })) },
      { label: "Dispositivi collegati", items: getDevicesByAuthor(authorId).map((d) => ({ id: d.id, label: d.name, onClick: (e) => openDevice(d.id, e) })) },
      { label: "Paese", items: country ? [{ id: country.id, label: country.name }] : [] },
    ];
  };

  const buildCardProps = (card) => {
    if (card.kind === "device") {
      const d = getDevice(card.entityId);
      if (!d) return null;
      return {
        subtitle: `${CATEGORIES[d.category]?.label || ""} · ${d.year}`,
        content: { title: d.name, text: d.text || d.tagline, details: d.details, highlights: d.highlights },
        image: d.image,
        imageLayoutId: `dev-img-${d.id}`,
        relations: relationsForDevice(d.id),
        works: d.works,
        pageLink: d.pageLink,
        shareUrl: `${window.location.origin}/dispositivo?device=${d.id}`,
      };
    }
    const a = getAuthor(card.entityId);
    if (!a) return null;
    const city = getCity(a.cityId);
    return {
      subtitle: city?.name || "",
      content: AUTHOR_CONTENT[a.id] || { title: a.name, text: "Contenuto in fase di allestimento." },
      image: a.image,
      relations: relationsForAuthor(a.id),
      mapLink: { href: `/atlante?author=${a.id}`, label: "Approfondisci in mappa" },
    };
  };

  // Membership dei temi (diretti + indiretti) e mappa autore→dispositivi.
  const deviceThemeMap = useMemo(
    () => Object.fromEntries(devices.map((d) => [d.id, getDeviceThemeIds(d.id)])),
    [devices]
  );
  const authorDeviceMap = useMemo(() => {
    const m = {};
    devices.forEach((d) => (d.relatedAuthorIds || []).forEach((aid) => { (m[aid] ||= new Set()).add(d.id); }));
    return m;
  }, [devices]);
  const themeCounts = useMemo(() => {
    const tc = {};
    devices.forEach((d) => deviceThemeMap[d.id].forEach((t) => { tc[t] = (tc[t] || 0) + 1; }));
    return tc;
  }, [devices, deviceThemeMap]);
  const themeList = useMemo(
    () => allThemes().filter((th) => (themeCounts[th.id] || 0) > 0).sort((a, b) => a.label.localeCompare(b.label, "it")),
    [themeCounts]
  );

  const isDimmed = (device) => {
    if (!filter) return false;
    if (filter.kind === "theme") return !deviceThemeMap[device.id].includes(filter.id);
    if (filter.kind === "author") return !authorDeviceMap[filter.id]?.has(device.id);
    return false;
  };

  const filterSummary = filter
    ? (filter.kind === "theme"
        ? { label: getTheme(filter.id)?.label || filter.id, count: themeCounts[filter.id] || 0 }
        : { label: getAuthor(filter.id)?.name || filter.id, count: authorDeviceMap[filter.id]?.size || 0 })
    : null;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  const bg = darkMode ? "bg-black text-amber-50" : "bg-[#f7f2e9] text-stone-800";

  const filterPill = (active, disabled, label, count, onClick) => (
    <button
      key={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm border transition-colors ${
        disabled
          ? "opacity-40 cursor-not-allowed border-white/10 text-amber-100/40"
          : active
            ? "border-amber-400 bg-amber-400/15 text-amber-100"
            : "border-white/10 text-amber-100/70 hover:border-amber-400/40"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="text-xs opacity-60 tabular-nums ml-2 shrink-0">{count}</span>
    </button>
  );

  const tabButton = (id, label) => (
    <button
      onClick={() => setPathTab(id)}
      className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        pathTab === id ? "bg-amber-400/15 text-amber-100 border border-amber-400/40" : "text-amber-100/60 border border-transparent hover:text-amber-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={`relative min-h-screen w-full ${bg} font-outfit`} ref={rootRef}>
      <a href="#dispositivo-timeline" className="skip-link">Vai alla linea del tempo</a>

      <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#070a12]/85 backdrop-blur-md border-b border-white/10">
        <span className="w-9" aria-hidden="true" />
        <div className="text-center">
          <h1 className="font-prompt font-bold tracking-[0.2em]">DISPOSITIVO</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-amber-200/60">Un secolo e mezzo di sguardi meccanici — 1894 → 2025</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-full bg-[#0b0f18]/90 backdrop-blur-md border border-amber-400/30 text-[11px] sm:text-xs text-amber-100 shadow-lg hover:border-amber-400/50 transition-colors max-w-[8rem] sm:max-w-none truncate"
          >
            <Route className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">
              {filterSummary ? `${filterSummary.label} — ${filterSummary.count}` : "Percorsi"}
            </span>
          </button>

          {panelOpen && (
            <div className="absolute top-full right-0 mt-2 w-[min(90vw,340px)] max-h-[60vh] overflow-y-auto rounded-2xl bg-[#0b0f18]/95 backdrop-blur-md border border-amber-400/20 shadow-2xl p-4 z-30">
              <div className="flex gap-1 mb-3 p-1 rounded-full bg-white/5">
                {tabButton("author", "Autori")}
                {tabButton("theme", "Temi")}
              </div>

              {pathTab === "author" ? (
                <div className="flex flex-col gap-1">
                  {deviceAuthors.map((a) => {
                    const n = authorDeviceMap[a.id]?.size || 0;
                    const active = filter?.kind === "author" && filter.id === a.id;
                    return filterPill(active, n === 0, a.name, n, () => setFilter(active ? null : { kind: "author", id: a.id }));
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {themeList.map((th) => {
                    const n = themeCounts[th.id] || 0;
                    const active = filter?.kind === "theme" && filter.id === th.id;
                    return filterPill(active, false, th.label, n, () => setFilter(active ? null : { kind: "theme", id: th.id }));
                  })}
                </div>
              )}

              {filter && (
                <button onClick={() => setFilter(null)} className="mt-4 text-xs text-amber-300 hover:text-amber-200 underline underline-offset-2">
                  Azzera percorso
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Barra di avanzamento scroll */}
      <div className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 hidden sm:block h-[60%] max-h-[500px] pointer-events-none">
        <div className="relative w-[3px] h-full rounded-full overflow-hidden bg-amber-400/10">
          <motion.div
            className="absolute inset-x-0 top-0 rounded-full"
            style={{
              scaleY: scrollYProgress,
              transformOrigin: "top",
              background: "linear-gradient(180deg, rgba(245,158,11,0.3), rgba(251,191,36,1))",
              boxShadow: "0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(245,158,11,0.4)",
              height: "100%",
            }}
          />
        </div>
      </div>

      <div id="dispositivo-timeline" className="relative max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/10 via-amber-400/40 to-amber-400/10 hidden sm:block" />
        <div className="space-y-20 sm:space-y-32">
          {devices.map((device) => (
            <DeviceNode
              key={device.id}
              device={device}
              scrollDirRef={scrollDirRef}
              dimmed={isDimmed(device)}
              onOpenDevice={openDevice}
            />
          ))}
        </div>

        <div className="flex justify-center mt-24">
          <button
            onClick={scrollTop}
            aria-label="Torna all'inizio"
            title="Torna all'inizio"
            className="flex items-center justify-center w-10 h-10 rounded-full text-amber-300/50 hover:text-amber-200 hover:bg-white/5 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bacheca di schede */}
      {cards.map((card) => {
        const props = buildCardProps(card);
        if (!props) return null;
        return (
          <EntityCard
            key={card.key}
            {...props}
            darkMode={darkMode}
            boardMode
            initialX={card.x}
            initialY={card.y}
            zIndex={card.z}
            escapeCloses={card.z === maxZ}
            onFocus={() => raise(card.key)}
            onClose={() => closeCard(card.key)}
          />
        );
      })}
    </div>
  );
}
