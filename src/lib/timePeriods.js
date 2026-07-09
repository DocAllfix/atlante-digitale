export const TIME_PERIODS = [
  // 1600
  { id: "1601-1650", label: "1601–1650", start: 1601, end: 1650, geoYear: 1650, century: 1600 },
  { id: "1651-1700", label: "1651–1700", start: 1651, end: 1700, geoYear: 1700, century: 1600 },
  // 1700
  { id: "1701-1750", label: "1701–1750", start: 1701, end: 1750, geoYear: 1715, century: 1700 },
  { id: "1751-1800", label: "1751–1800", start: 1751, end: 1800, geoYear: 1783, century: 1700 },
  // 1800
  { id: "1801-1850", label: "1801–1850", start: 1801, end: 1850, geoYear: 1815, century: 1800 },
  { id: "1851-1900", label: "1851–1900", start: 1851, end: 1900, geoYear: 1880, century: 1800 },
  // 1900 – decadi
  { id: "1901-1910", label: "1901–1910", start: 1901, end: 1910, geoYear: 1900, century: 1900 },
  { id: "1911-1920", label: "1911–1920", start: 1911, end: 1920, geoYear: 1914, century: 1900 },
  { id: "1921-1930", label: "1921–1930", start: 1921, end: 1930, geoYear: 1930, century: 1900 },
  { id: "1931-1940", label: "1931–1940", start: 1931, end: 1940, geoYear: 1938, century: 1900 },
  { id: "1941-1950", label: "1941–1950", start: 1941, end: 1950, geoYear: 1945, century: 1900 },
  { id: "1951-1960", label: "1951–1960", start: 1951, end: 1960, geoYear: 1960, century: 1900 },
  { id: "1961-1970", label: "1961–1970", start: 1961, end: 1970, geoYear: 1960, century: 1900 },
  { id: "1971-1980", label: "1971–1980", start: 1971, end: 1980, geoYear: 1960, century: 1900 },
  { id: "1981-1990", label: "1981–1990", start: 1981, end: 1990, geoYear: 1994, century: 1900 },
  { id: "1991-1999", label: "1991–1999", start: 1991, end: 1999, geoYear: 1994, century: 1900 },
  // 2000 – decadi
  { id: "2001-2010", label: "2001–2010", start: 2001, end: 2010, geoYear: 2010, century: 2000 },
  { id: "2011-2020", label: "2011–2020", start: 2011, end: 2020, geoYear: 2010, century: 2000 },
  { id: "2021-2026", label: "2021–2026", start: 2021, end: 2026, geoYear: null, century: 2000 },
];

export const CENTURIES = [1600, 1700, 1800, 1900, 2000];

const MODERN_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
const HISTORICAL_BASE =
  "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";

export function getGeoJsonUrl(period) {
  if (!period || period.geoYear === null) return MODERN_URL;
  return `${HISTORICAL_BASE}/world_${period.geoYear}.geojson`;
}

export const MODERN_GEOJSON_URL = MODERN_URL;