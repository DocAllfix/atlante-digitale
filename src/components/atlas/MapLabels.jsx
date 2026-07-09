import { useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { LABELS } from "@/lib/italianLabels";
import { atlasTheme } from "@/lib/atlasTheme";

function createLabelIcon(name, type, labelColor, labelShadow) {
  const sizeMap = {
    continent: "font-family:'Prompt',sans-serif;font-size:15px;font-weight:700;letter-spacing:3px;text-transform:uppercase;",
    ocean: "font-size:13px;font-weight:400;font-style:italic;letter-spacing:4px;opacity:0.55;",
    sea: "font-size:11px;font-weight:400;font-style:italic;letter-spacing:2px;opacity:0.5;",
    country: "font-family:'Prompt',sans-serif;font-size:11px;font-weight:500;letter-spacing:1px;",
  };

  return L.divIcon({
    className: "italian-label",
    html: `<span style="color:${labelColor};${sizeMap[type] || sizeMap.country}text-shadow:${labelShadow};white-space:nowrap;pointer-events:none;">${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function MapLabels({ activePeriod, darkMode }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const t = atlasTheme[darkMode ? "dark" : "light"];

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const visibleLabels = LABELS.filter((l) => {
    if (l.type === "continent") return zoom >= 2 && zoom < 3;
    if (l.type === "country") return zoom >= 3 && zoom < 6 && activePeriod?.geoYear == null;
    return false;
  });

  return (
    <>
      {visibleLabels.map((label) => (
        <Marker
          key={label.name}
          position={[label.lat, label.lng]}
          icon={createLabelIcon(label.name, label.type, t.labelColor, t.labelShadow)}
          interactive={false}
        />
      ))}
    </>
  );
}