// Selettori sui dispositivi (src/data/dispositivoContent.js), collegati al
// grafo dei contenuti (src/data/graph.js) tramite src/lib/graph-selectors.js.

import { DEVICES, CATEGORIES } from "@/data/dispositivoContent";
import { getAuthor, getTheme } from "@/lib/graph-selectors";

export const getCategory = (id) => CATEGORIES[id] || null;

export const allDevices = () => Object.values(DEVICES).sort((a, b) => a.year - b.year);

export const getDevice = (id) => DEVICES[id] || null;

export const getDevicesByCategory = (categoryId) =>
  allDevices().filter((d) => d.category === categoryId);

export const getDevicesByTheme = (themeId) =>
  allDevices().filter((d) => d.relatedThemeIds?.includes(themeId));

export const getRelatedAuthorsOfDevice = (deviceId) =>
  (DEVICES[deviceId]?.relatedAuthorIds || []).map(getAuthor).filter(Boolean);

export const getRelatedThemesOfDevice = (deviceId) =>
  (DEVICES[deviceId]?.relatedThemeIds || []).map(getTheme).filter(Boolean);

// Temi di un dispositivo, diretti (relatedThemeIds) + indiretti (temi degli
// autori collegati). Così un dispositivo legato a un autore eredita i temi di
// quell'autore (es. Playstation 1 → Mulvey → anche "femminismo").
export const getDeviceThemeIds = (deviceId) => {
  const d = DEVICES[deviceId];
  if (!d) return [];
  const set = new Set(d.relatedThemeIds || []);
  (d.relatedAuthorIds || []).forEach((aid) => {
    (getAuthor(aid)?.themeIds || []).forEach((t) => set.add(t));
  });
  return [...set];
};

export const getRelatedDevicesOfDevice = (deviceId) =>
  (DEVICES[deviceId]?.relatedDeviceIds || []).map((id) => DEVICES[id]).filter(Boolean);

// Dispositivi collegati a un autore (per eventuali futuri rimandi da Atlas).
export const getDevicesByAuthor = (authorId) =>
  allDevices().filter((d) => d.relatedAuthorIds?.includes(authorId));

// Autori referenziati da almeno un dispositivo, in ordine alfabetico per nome
// (per la tendina "Percorsi" → tab Autori).
export const allDeviceAuthors = () => {
  const ids = new Set();
  Object.values(DEVICES).forEach((d) => (d.relatedAuthorIds || []).forEach((a) => ids.add(a)));
  return [...ids].map(getAuthor).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, "it"));
};
