// Selettori sul grafo dei contenuti (src/data/graph.js).
// Permettono la navigazione libera e interconnessa: da un'entità qualsiasi si
// raggiungono tutte le entità correlate (temi, autori, città, Paese, periodo).

import { COUNTRIES, CITIES, AUTHORS, THEMES } from "@/data/graph";

// ── Accesso base ────────────────────────────────────────────────────────────
export const getCountry = (id) => COUNTRIES[id] || null;
export const getCity = (id) => CITIES[id] || null;
export const getAuthor = (id) => AUTHORS[id] || null;
export const getTheme = (id) => THEMES[id] || null;

export const allCountries = () => Object.values(COUNTRIES);
export const allCities = () => Object.values(CITIES);
export const allAuthors = () => Object.values(AUTHORS);
export const allThemes = () => Object.values(THEMES).filter((t) => t.authorIds.length > 0);

// ── Riconoscimento Paese da un nome di feature GeoJSON (IT o EN) ─────────────
// Sostituisce il vecchio detectCountry() limitato a Italia/Francia.
export function matchCountryId(featureName) {
  const n = (featureName || "").toLowerCase();
  if (!n) return null;
  for (const c of Object.values(COUNTRIES)) {
    if (c.match.some((m) => n.includes(m))) return c.id;
  }
  return null;
}

// Un Paese "ha contenuto" se ha una narrativa propria o almeno un autore.
export function countryHasContent(countryId) {
  if (!countryId) return false;
  const c = COUNTRIES[countryId];
  if (!c) return false;
  return c.hasNarrative || getAuthorsByCountry(countryId).length > 0;
}

// ── Relazioni autore ↔ città ↔ Paese ↔ tema ↔ periodo ───────────────────────
export function getAuthorsInCity(cityId) {
  return Object.values(AUTHORS).filter((a) => a.cityId === cityId);
}

export function getAuthorsByCountry(countryId) {
  return Object.values(AUTHORS).filter((a) => CITIES[a.cityId]?.countryId === countryId);
}

// Autori attivi in un Paese in un dato periodo (per il cluster su Paese+anno).
export function getAuthorsByCountryPeriod(countryId, periodId) {
  return getAuthorsByCountry(countryId).filter((a) => a.periodId === periodId);
}

export function getAuthorsByTheme(themeId) {
  return (THEMES[themeId]?.authorIds || []).map((id) => AUTHORS[id]).filter(Boolean);
}

export function getThemesOfAuthor(authorId) {
  return (AUTHORS[authorId]?.themeIds || []).map((id) => THEMES[id]).filter(Boolean);
}

// Autori correlati: condividono almeno un tema (escluso sé stesso).
export function getRelatedAuthors(authorId) {
  const a = AUTHORS[authorId];
  if (!a) return [];
  const themeSet = new Set(a.themeIds);
  return Object.values(AUTHORS).filter(
    (o) => o.id !== authorId && o.themeIds.some((t) => themeSet.has(t))
  );
}

// Autori dello stesso periodo (escluso sé stesso).
export function getAuthorsSamePeriod(periodId, exceptId) {
  return Object.values(AUTHORS).filter((a) => a.periodId === periodId && a.id !== exceptId);
}

// Città e Paese di un autore.
export const getCityOfAuthor = (authorId) => getCity(AUTHORS[authorId]?.cityId);
export const getCountryOfAuthor = (authorId) => getCountry(getCityOfAuthor(authorId)?.countryId);

// Percorso di approfondimento della città (se esiste).
export const getDeepDiveIdForCity = (cityId) => CITIES[cityId]?.deepDiveId || null;
