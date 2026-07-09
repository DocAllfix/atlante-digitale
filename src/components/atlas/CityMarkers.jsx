import { useState, useEffect } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { atlasTheme } from "@/lib/atlasTheme";
import { detectCity } from "@/lib/cityContent";

const CITIES_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_populated_places.json";

let citiesCache = null;

function createCityIcon(blinking) {
  return L.divIcon({
    className: "city-marker",
    html: `<div class="city-dot${blinking ? " blinking" : ""}"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, -14],
  });
}

export default function CityMarkers({ darkMode, mode, onCitySelect, blinkingCity }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState(map.getBounds());
  const [cities, setCities] = useState(null);
  const [visible, setVisible] = useState([]);
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const active = zoom >= 6;

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
      setBounds(map.getBounds());
    },
    moveend: () => setBounds(map.getBounds()),
  });

  useEffect(() => {
    if (citiesCache) {
      setCities(citiesCache);
      return;
    }
    let cancelled = false;
    fetch(CITIES_URL)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        citiesCache = (json.features || []).filter((f) => f.geometry?.type === "Point");
        setCities(citiesCache);
      })
      .catch(() => !cancelled && setCities([]));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!cities || !active) {
      setVisible([]);
      return;
    }
    const n = bounds.getNorth();
    const s = bounds.getSouth();
    const w = bounds.getWest();
    const e = bounds.getEast();
    setVisible(
      cities.filter((f) => {
        const [lng, lat] = f.geometry.coordinates;
        return lat <= n && lat >= s && lng >= w && lng <= e;
      })
    );
  }, [cities, active, bounds]);

  if (!active || !cities) return null;

  return visible.map((f, i) => {
    const [lng, lat] = f.geometry.coordinates;
    const name = f.properties.NAME || "—";
    const detected = detectCity(name);
    const isBlinking = !!(blinkingCity && detected?.city === blinkingCity);
    return (
      <Marker
        key={`${name}-${i}`}
        position={[lat, lng]}
        icon={createCityIcon(isBlinking)}
        eventHandlers={{
          ...(mode === "epistemological" && {
            click: (e) => {
              if (detected && onCitySelect) {
                const point = map.latLngToContainerPoint(e.latlng);
                onCitySelect({ city: detected.city, cityName: detected.cityName, x: point.x, y: point.y });
              }
            },
          }),
        }}
      />
    );
  });
}