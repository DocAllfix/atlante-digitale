import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { allCities } from "@/lib/graph-selectors";

// Marker delle città-contenuto (autori). Provengono dal grafo con coordinate
// proprie, quindi sono cliccabili a QUALSIASI zoom in modalità Contenuti —
// niente più dipendenza dal dataset esterno Natural Earth né soglia zoom ≥ 6.

function createCityIcon(blinking) {
  return L.divIcon({
    className: "city-marker",
    html: `<div class="city-dot${blinking ? " blinking" : ""}"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

export default function CityMarkers({ mode, onCitySelect, blinkingCity }) {
  const map = useMap();
  if (mode !== "epistemological") return null;

  return allCities().map((city) => {
    const isBlinking = blinkingCity === city.id;
    return (
      <Marker
        key={city.id}
        position={[city.lat, city.lng]}
        icon={createCityIcon(isBlinking)}
        eventHandlers={{
          click: (e) => {
            if (!onCitySelect) return;
            const point = map.latLngToContainerPoint(e.latlng);
            onCitySelect({ city: city.id, cityName: city.name, x: point.x, y: point.y });
          },
        }}
      />
    );
  });
}
