import { useEffect, useState, useMemo, useRef } from "react";
import { GeoJSON, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { TERRITORY_NAMES_IT } from "@/lib/territoryNames";
import { LABELS } from "@/lib/italianLabels";
import { atlasTheme } from "@/lib/atlasTheme";
import { matchCountryId, countryHasContent } from "@/lib/graph-selectors";

const translationCache = new Map();
const geoJsonCache = new Map(); // url → dati GeoJSON già parsati (i file sono bundlati localmente)
const _allCountries = LABELS.filter((l) => l.type === "country");
const _russia = _allCountries.find((l) => l.name === "Russia");
const COUNTRY_LABELS = _russia
  ? [_russia, ..._allCountries.filter((l) => l.name !== "Russia")]
  : _allCountries;

function getFeatureName(feature) {
  const p = feature.properties || {};
  return p.NAME || p.name || p.admin || p.ABBREVN || p.SUBJECTO || "—";
}

function getFeatureBBox(feature) {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  function processCoords(coords) {
    if (typeof coords[0] === "number") {
      minLng = Math.min(minLng, coords[0]);
      maxLng = Math.max(maxLng, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      for (const c of coords) processCoords(c);
    }
  }
  processCoords(feature.geometry.coordinates);
  return { minLat, maxLat, minLng, maxLng };
}

function pointInRing(lat, lng, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInFeature(lat, lng, feature) {
  const { type, coordinates } = feature.geometry;
  if (type === "Polygon") {
    if (!pointInRing(lat, lng, coordinates[0])) return false;
    for (let i = 1; i < coordinates.length; i++) {
      if (pointInRing(lat, lng, coordinates[i])) return false;
    }
    return true;
  } else if (type === "MultiPolygon") {
    for (const polygon of coordinates) {
      if (pointInRing(lat, lng, polygon[0])) {
        let inHole = false;
        for (let i = 1; i < polygon.length; i++) {
          if (pointInRing(lat, lng, polygon[i])) { inHole = true; break; }
        }
        if (!inHole) return true;
      }
    }
  }
  return false;
}

function createLabelIcon(name, labelColor, labelShadow) {
  return L.divIcon({
    className: "historical-label",
    html: `<span style="color:${labelColor};font-family:'Prompt',sans-serif;font-size:11px;font-weight:500;letter-spacing:1px;text-shadow:${labelShadow};white-space:nowrap;pointer-events:none;">${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function HistoricalBorders({ geoJsonUrl, showLabels, darkMode, mode, onCountrySelect, highlightedCountryNames }) {
  const [data, setData] = useState(null);
  const [loadedUrl, setLoadedUrl] = useState(null);
  const [translations, setTranslations] = useState(null);
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const t = atlasTheme[darkMode ? "dark" : "light"];

  const borderStyle = useMemo(() => ({
    color: "transparent",
    weight: 0,
    opacity: 0,
    fillColor: t.hoverFill,
    fillOpacity: 0,
  }), [t]);

  const hoverStyle = useMemo(() => ({
    color: "transparent",
    weight: 0,
    fillColor: t.hoverFill,
    fillOpacity: t.hoverOpacity,
  }), [t]);

  // Affordance: glow tenue sui Paesi che HANNO contenuto (solo modalità Contenuti),
  // così l'utente vede dove può cliccare.
  const contentStyle = useMemo(() => ({
    color: t.hoverFill,
    weight: 1,
    opacity: 0.45,
    fillColor: t.hoverFill,
    fillOpacity: (t.hoverOpacity ?? 0.2) * 0.6,
  }), [t]);

  const contentFeatureNames = useMemo(() => {
    if (mode !== "epistemological" || !data) return new Set();
    const s = new Set();
    for (const f of data.features) {
      const name = getFeatureName(f);
      const cid = matchCountryId(name);
      if (cid && countryHasContent(cid)) s.add(name);
    }
    return s;
  }, [data, mode]);

  const baseStyleFor = (name) =>
    highlightedFeatureNames.has(name) ? hoverStyle
      : contentFeatureNames.has(name) ? contentStyle
      : borderStyle;

  // In modalità "Esplora mappa" i confini sono linee VISIBILI (per vederli
  // cambiare nel tempo con l'animazione). In Contenuti restano invisibili con
  // fill al hover.
  const geoLineStyle = useMemo(() => ({
    color: t.labelColor,
    weight: 0.7,
    opacity: 0.55,
    fill: false,
    fillOpacity: 0,
  }), [t]);
  const isGeo = mode !== "epistemological";

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  useEffect(() => {
    if (!geoJsonUrl) {
      setData(null);
      setLoadedUrl(null);
      setTranslations(null);
      return;
    }
    if (geoJsonCache.has(geoJsonUrl)) {
      setData(geoJsonCache.get(geoJsonUrl));
      setLoadedUrl(geoJsonUrl);
      return;
    }
    let cancelled = false;
    fetch(geoJsonUrl)
      .then((res) => res.json())
      .then((json) => {
        geoJsonCache.set(geoJsonUrl, json);
        if (!cancelled) {
          setData(json);
          setLoadedUrl(geoJsonUrl);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [geoJsonUrl]);

  useEffect(() => {
    if (!data || !showLabels || !loadedUrl) {
      setTranslations(null);
      return;
    }
    if (translationCache.has(loadedUrl)) {
      setTranslations(translationCache.get(loadedUrl));
      return;
    }
    const names = [...new Set(data.features.map(getFeatureName))];
    const result = {};
    names.forEach((n) => { result[n] = TERRITORY_NAMES_IT[n] || n; });
    translationCache.set(loadedUrl, result);
    setTranslations(result);
  }, [data, showLabels, loadedUrl]);

  // Il bbox di ogni feature dipende solo dai dati (non dallo zoom né
  // dall'highlight): calcolarlo una sola volta per dataset evita di rifare il
  // walk ricorsivo delle coordinate a ogni tick di zoom.
  const featuresWithBBox = useMemo(() => {
    if (!data) return [];
    return data.features.map((f) => ({ feature: f, bbox: getFeatureBBox(f) }));
  }, [data]);

  const labels = useMemo(() => {
    if (!data || !showLabels || !translations || zoom < 3 || zoom >= 6) return [];

    const seenNames = new Set();
    const result = [];

    for (const label of COUNTRY_LABELS) {
      for (const { feature, bbox } of featuresWithBBox) {
        if (label.lat < bbox.minLat || label.lat > bbox.maxLat ||
            label.lng < bbox.minLng || label.lng > bbox.maxLng) continue;
        if (pointInFeature(label.lat, label.lng, feature)) {
          const name = getFeatureName(feature);
          if (!seenNames.has(name)) {
            seenNames.add(name);
            const italianName = translations[name] || name;
            result.push({ name: italianName, lat: label.lat, lng: label.lng });
          }
          break;
        }
      }
    }

    return result;
  }, [featuresWithBBox, showLabels, translations, zoom]);

  const highlightedFeatureNames = useMemo(() => {
    if (!highlightedCountryNames?.size) return new Set();
    const result = new Set();
    for (const label of COUNTRY_LABELS) {
      if (!highlightedCountryNames.has(label.name)) continue;
      for (const { feature, bbox } of featuresWithBBox) {
        if (label.lat < bbox.minLat || label.lat > bbox.maxLat || label.lng < bbox.minLng || label.lng > bbox.maxLng) continue;
        if (pointInFeature(label.lat, label.lng, feature)) {
          result.add(getFeatureName(feature));
          break;
        }
      }
    }
    return result;
  }, [featuresWithBBox, highlightedCountryNames]);

  const highlightKey = useMemo(() => [...highlightedFeatureNames].sort().join(","), [highlightedFeatureNames]);

  if (!data) return null;

  return (
    <>
      <GeoJSON
        key={`${loadedUrl}-${mode}-${highlightKey}-${zoom >= 6 ? "hi" : "lo"}`}
        data={data}
        style={(feature) => (isGeo
          ? { ...geoLineStyle, interactive: false }
          : { ...baseStyleFor(getFeatureName(feature)), interactive: zoom < 6 })}
        onEachFeature={(feature, layer) => {
          layer.on({
            mouseover: (e) => { if (zoomRef.current < 6) e.target.setStyle(hoverStyle); },
            mouseout: (e) => { e.target.setStyle(baseStyleFor(getFeatureName(feature))); },
            ...(mode === "epistemological" && {
              click: (e) => {
                if (zoomRef.current >= 6) return;
                const originalName = getFeatureName(feature);
                const translatedName = translations ? (translations[originalName] || originalName) : originalName;
                const countryId = matchCountryId(originalName) || matchCountryId(translatedName);
                if (countryId && countryHasContent(countryId) && onCountrySelect) {
                  const point = map.latLngToContainerPoint(e.latlng);
                  onCountrySelect({ country: countryId, featureName: translatedName, x: point.x, y: point.y });
                }
              },
            }),
          });
          if (mode === "epistemological") {
            const el = layer.getElement && layer.getElement();
            if (el) el.style.cursor = "pointer";
          }
        }}
      />
      {labels.map((label, idx) => (
        <Marker
          key={`${loadedUrl}-${idx}`}
          position={[label.lat, label.lng]}
          icon={createLabelIcon(label.name, t.labelColor, t.labelShadow)}
          interactive={false}
        />
      ))}
    </>
  );
}