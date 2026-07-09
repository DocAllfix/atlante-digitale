import { useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapLabels from "@/components/atlas/MapLabels";
import HistoricalBorders from "@/components/atlas/HistoricalBorders";
import CityMarkers from "@/components/atlas/CityMarkers";
import { getGeoJsonUrl } from "@/lib/timePeriods";
import { atlasTheme } from "@/lib/atlasTheme";

function MapFlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target && typeof target.lat === "number") {
      map.flyTo([target.lat, target.lng], target.zoom || 8, { duration: 1.2 });
    }
  }, [target]);
  return null;
}

export default function WorldMap({ activePeriod, darkMode, mode, onCountrySelect, onCitySelect, highlightedCountryNames, blinkingCity, flyTarget }) {
  const geoJsonUrl = getGeoJsonUrl(activePeriod);
  const t = atlasTheme[darkMode ? "dark" : "light"];

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={13}
      worldCopyJump
      zoomControl={false}
      className="w-full h-full"
      style={{ background: t.mapBg }}
    >
      <ZoomControl position="topright" />
      <TileLayer
        key={t.tileUrl}
        url={t.tileUrl}
        attribution={t.tileAttribution}
        maxNativeZoom={8}
        maxZoom={13}
      />
      <TileLayer
        key={`${t.labelTileUrl}-${darkMode}`}
        url={t.labelTileUrl}
        attribution="&copy; Esri"
        minZoom={6}
        maxZoom={16}
        maxNativeZoom={16}
        opacity={0.9}
      />
      <HistoricalBorders geoJsonUrl={geoJsonUrl} showLabels={activePeriod?.geoYear != null} darkMode={darkMode} mode={mode} onCountrySelect={onCountrySelect} highlightedCountryNames={highlightedCountryNames} />
      <CityMarkers darkMode={darkMode} mode={mode} onCitySelect={onCitySelect} blinkingCity={blinkingCity} />
      <MapLabels activePeriod={activePeriod} darkMode={darkMode} />
      <MapFlyTo target={flyTarget} />
    </MapContainer>
  );
}