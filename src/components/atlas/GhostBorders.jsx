import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

// Confini "fantasma" di un'epoca di confronto, sovrapposti alla mappa corrente
// in modalità "Esplora mappa" per visualizzare i cambiamenti territoriali.
// Linea tratteggiata contrastante, non interattiva.

const cache = new Map();

export default function GhostBorders({ geoJsonUrl }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!geoJsonUrl) { setData(null); return; }
    if (cache.has(geoJsonUrl)) { setData(cache.get(geoJsonUrl)); return; }
    let cancelled = false;
    fetch(geoJsonUrl)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) { cache.set(geoJsonUrl, json); setData(json); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [geoJsonUrl]);

  if (!data) return null;
  return (
    <GeoJSON
      key={`ghost-${geoJsonUrl}`}
      data={data}
      interactive={false}
      style={{ color: "#38bdf8", weight: 1, opacity: 0.75, dashArray: "4 3", fill: false, fillOpacity: 0 }}
    />
  );
}
