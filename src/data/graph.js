// Grafo dei contenuti di Chronos Atlas.
//
// Unica fonte delle ENTITÀ e delle loro RELAZIONI (Paesi, città, autori, temi).
// I TESTI restano nei content store esistenti (epistemologicalContent.js →
// narrativa Paese×periodo; cityContent.js → narrativa città×periodo;
// deepDiveContent.js → stanze museali). Qui si definisce chi è collegato a chi,
// così che la navigazione possa essere libera e interconnessa da qualsiasi punto.
//
// I selettori che interrogano questo grafo sono in src/lib/graph-selectors.js.

// ─── Paesi con contenuto ──────────────────────────────────────────────────
// `match`: sottostringhe (minuscole) per riconoscere il Paese dal nome di una
// feature GeoJSON (storica o moderna, IT o EN). `hasNarrative`: esiste una
// scheda Paese×periodo in epistemologicalContent.js.
export const COUNTRIES = {
  italy:       { id: "italy",       name: "Italia",       lat: 42.5, lng: 12.5,  hasNarrative: true,  match: ["ital"] },
  france:      { id: "france",      name: "Francia",      lat: 46.6, lng: 2.5,   hasNarrative: true,  match: ["franc", "french"] },
  belgium:     { id: "belgium",     name: "Belgio",       lat: 50.8, lng: 4.5,   hasNarrative: false, match: ["belg"] },
  uk:          { id: "uk",          name: "Regno Unito",  lat: 54.0, lng: -2.0,  hasNarrative: false, match: ["united kingdom", "great britain", "regno unito", "england", "britain", "britann"] },
  usa:         { id: "usa",         name: "Stati Uniti",  lat: 39.0, lng: -98.0, hasNarrative: false, match: ["united states", "stati uniti"] },
  australia:   { id: "australia",   name: "Australia",    lat: -25.0, lng: 134.0, hasNarrative: false, match: ["australia"] },
  southafrica: { id: "southafrica", name: "Sudafrica",    lat: -29.0, lng: 24.0, hasNarrative: false, match: ["south africa", "sudafrica", "cape colony", "colonia del capo", "transvaal", "orange free state"] },
  canada:      { id: "canada",      name: "Canada",       lat: 56.0, lng: -106.0, hasNarrative: false, match: ["canada"] },
  sweden:      { id: "sweden",      name: "Svezia",       lat: 62.0, lng: 15.0,  hasNarrative: false, match: ["sweden", "svezia"] },
  austria:     { id: "austria",     name: "Austria",      lat: 47.5, lng: 14.5,  hasNarrative: false, match: ["austria"] },
  germany:     { id: "germany",     name: "Germania",     lat: 51.1, lng: 10.4,  hasNarrative: false, match: ["german", "germania", "prussia", "bavaria", "saxony"] },
};

// ─── Città con contenuto ──────────────────────────────────────────────────
// Coordinate proprie (per marker e fly-to), Paese di appartenenza, ed eventuale
// percorso di approfondimento museale (deepDiveId → deepDiveContent.js).
export const CITIES = {
  rome:         { id: "rome",         name: "Roma",         countryId: "italy",       lat: 41.9028, lng: 12.4964,  deepDiveId: "rome" },
  blaton:       { id: "blaton",       name: "Blaton",       countryId: "belgium",     lat: 50.5139, lng: 3.6531 },
  london:       { id: "london",       name: "Londra",       countryId: "uk",          lat: 51.5074, lng: -0.1278 },
  berkeley:     { id: "berkeley",     name: "Berkeley",     countryId: "usa",         lat: 37.8716, lng: -122.2727 },
  cleveland:    { id: "cleveland",    name: "Cleveland",    countryId: "usa",         lat: 41.4993, lng: -81.6944 },
  denver:       { id: "denver",       name: "Denver",       countryId: "usa",         lat: 39.7392, lng: -104.9903 },
  newyork:      { id: "newyork",      name: "New York",     countryId: "usa",         lat: 40.7128, lng: -74.006 },
  sydney:       { id: "sydney",       name: "Sydney",       countryId: "australia",   lat: -33.8688, lng: 151.2093 },
  hopkinsville: { id: "hopkinsville", name: "Hopkinsville", countryId: "usa",         lat: 36.8566, lng: -87.4886 },
  princeton:    { id: "princeton",    name: "Princeton",    countryId: "usa",         lat: 40.3573, lng: -74.6672 },
  johannesburg: { id: "johannesburg", name: "Johannesburg", countryId: "southafrica", lat: -26.2041, lng: 28.0473 },
  seattle:      { id: "seattle",      name: "Seattle",      countryId: "usa",         lat: 47.6062, lng: -122.3321 },
  toronto:      { id: "toronto",      name: "Toronto",      countryId: "canada",      lat: 43.6532, lng: -79.3832 },
  stockholm:    { id: "stockholm",    name: "Stoccolma",    countryId: "sweden",      lat: 59.3293, lng: 18.0686 },
  paris:        { id: "paris",        name: "Parigi",       countryId: "france",      lat: 48.8566, lng: 2.3522 },
  brussels:     { id: "brussels",     name: "Bruxelles",    countryId: "belgium",     lat: 50.8503, lng: 4.3517 },
  parma:        { id: "parma",        name: "Parma",        countryId: "italy",       lat: 44.8015, lng: 10.3279 },
  vienna:       { id: "vienna",       name: "Vienna",       countryId: "austria",     lat: 48.2082, lng: 16.3738 },
  berlin:       { id: "berlin",       name: "Berlino",      countryId: "germany",     lat: 52.52,   lng: 13.405 },
  losangeles:   { id: "losangeles",   name: "Los Angeles",  countryId: "usa",         lat: 34.0522, lng: -118.2437 },
};

// ─── Autori ───────────────────────────────────────────────────────────────
// Ogni autore è ancorato a una città e a un periodo, e appartiene a uno o più
// temi. La narrativa dell'autore è la scheda città×periodo in cityContent.js.
export const AUTHORS = {
  fellini:  { id: "fellini",  name: "Federico Fellini",  cityId: "rome",         periodId: "1961-1970", themeIds: ["onirismo"], image: "/images/authors/fellini.jpg" },
  irigaray: { id: "irigaray", name: "Luce Irigaray",     cityId: "blaton",       periodId: "1971-1980", themeIds: ["femminismo"], image: "/images/authors/irigaray.svg" },
  mulvey:   { id: "mulvey",   name: "Laura Mulvey",      cityId: "london",       periodId: "1971-1980", themeIds: ["femminismo", "corpo_visione"], image: "/images/authors/mulvey.jpg" },
  doane:    { id: "doane",    name: "Mary Ann Doane",    cityId: "berkeley",     periodId: "1981-1990", themeIds: ["femminismo"], image: "/images/authors/doane.svg" },
  butler:   { id: "butler",   name: "Judith Butler",     cityId: "cleveland",    periodId: "1991-1999", themeIds: ["femminismo", "strutturalismo", "corpo_visione"], image: "/images/authors/butler.jpg" },
  haraway:  { id: "haraway",  name: "Donna Haraway",     cityId: "denver",       periodId: "1981-1990", themeIds: ["femminismo"], image: "/images/authors/haraway.jpg" },
  keller:   { id: "keller",   name: "Evelyn Fox Keller", cityId: "newyork",      periodId: "1981-1990", themeIds: ["femminismo"], image: "/images/authors/keller.jpg" },
  grosz:    { id: "grosz",    name: "Elisabeth Grosz",   cityId: "sydney",       periodId: "1991-1999", themeIds: ["femminismo", "corpo_visione"], image: "/images/authors/grosz.svg" },
  hooks:    { id: "hooks",    name: "bell hooks",        cityId: "hopkinsville", periodId: "1981-1990", themeIds: ["femminismo", "black_studies"], image: "/images/authors/hooks.jpg" },
  campt:    { id: "campt",    name: "Tina Campt",        cityId: "princeton",    periodId: "2001-2010", themeIds: ["femminismo", "black_studies"], image: "/images/authors/campt.jpg" },
  mofokeng: { id: "mofokeng", name: "Santu Mofokeng",    cityId: "johannesburg", periodId: "1991-1999", themeIds: ["black_studies"], image: "/images/authors/mofokeng.svg" },
  joseph:   { id: "joseph",   name: "Kahlil Joseph",     cityId: "seattle",      periodId: "2011-2020", themeIds: ["black_studies"], image: "/images/authors/joseph.jpg" },
  lawson:   { id: "lawson",   name: "Deana Lawson",      cityId: "newyork",      periodId: "2021-2026", themeIds: ["black_studies"], image: "/images/authors/lawson.svg" },
  // Capitolo di tesi "Topologia di un corpo" — corpo, sguardo, dispositivo
  cronenberg: { id: "cronenberg", name: "David Cronenberg", cityId: "toronto",   periodId: "1981-1990", themeIds: ["corpo_visione"], image: "/images/visualculture/cronenberg.jpg" },
  bergman:    { id: "bergman",    name: "Ingmar Bergman",   cityId: "stockholm", periodId: "1961-1970", themeIds: ["corpo_visione"], image: "/images/visualculture/bergman.jpg" },
  beckett:    { id: "beckett",    name: "Samuel Beckett",   cityId: "paris",     periodId: "1961-1970", themeIds: ["corpo_visione"], image: "/images/visualculture/beckett.jpg" },
  bacon_f:    { id: "bacon_f",    name: "Francis Bacon",    cityId: "london",    periodId: "1971-1980", themeIds: ["corpo_visione"], image: "/images/visualculture/bacon.jpg" },
  magritte:   { id: "magritte",   name: "René Magritte",    cityId: "brussels",  periodId: "1931-1940", themeIds: ["corpo_visione"], image: "/images/visualculture/magritte.jpg" },
  caravaggio: { id: "caravaggio", name: "Caravaggio",       cityId: "rome",      periodId: "1601-1650", themeIds: ["corpo_visione"], image: "/images/visualculture/narciso.jpg" },
  anzieu:     { id: "anzieu",     name: "Didier Anzieu",    cityId: "paris",     periodId: "1981-1990", themeIds: ["corpo_visione"], image: "/images/visualculture/anzieu.svg" },
  rizzolatti: { id: "rizzolatti", name: "Giacomo Rizzolatti", cityId: "parma",   periodId: "1991-1999", themeIds: ["corpo_visione"], image: "/images/visualculture/rizzolatti.svg" },
  // Seconda ondata — teorici del capitolo "Topologia di un corpo"
  deleuze:    { id: "deleuze",    name: "Gilles Deleuze",       cityId: "paris",      periodId: "1981-1990", themeIds: ["corpo_visione"], image: "/images/visualculture/deleuze.jpg" },
  merleau:    { id: "merleau",    name: "Maurice Merleau-Ponty", cityId: "paris",     periodId: "1961-1970", themeIds: ["corpo_visione"], image: "/images/visualculture/merleau.jpg" },
  mcluhan:    { id: "mcluhan",    name: "Marshall McLuhan",     cityId: "toronto",    periodId: "1961-1970", themeIds: ["corpo_visione"], image: "/images/visualculture/mcluhan.jpg" },
  metz:       { id: "metz",       name: "Christian Metz",       cityId: "paris",      periodId: "1971-1980", themeIds: ["corpo_visione"], image: "/images/visualculture/metz.jpg" },
  freud:      { id: "freud",      name: "Sigmund Freud",        cityId: "vienna",     periodId: "1921-1930", themeIds: ["corpo_visione"], image: "/images/visualculture/freud.jpg" },
  lacan:      { id: "lacan",      name: "Jacques Lacan",        cityId: "paris",      periodId: "1961-1970", themeIds: ["corpo_visione"], image: "/images/visualculture/lacan.jpg" },
  damasio:    { id: "damasio",    name: "Antonio Damasio",      cityId: "losangeles", periodId: "2001-2010", themeIds: ["corpo_visione"], image: "/images/visualculture/damasio.jpg" },
  sobchack:   { id: "sobchack",   name: "Vivian Sobchack",      cityId: "losangeles", periodId: "1991-1999", themeIds: ["corpo_visione"], image: "/images/visualculture/sobchack.svg" },
  balazs:     { id: "balazs",     name: "Béla Balázs",          cityId: "berlin",     periodId: "1921-1930", themeIds: ["corpo_visione"], image: "/images/visualculture/balazs.jpg" },
  sontag:     { id: "sontag",     name: "Susan Sontag",         cityId: "newyork",    periodId: "1961-1970", themeIds: ["corpo_visione"], image: "/images/visualculture/sontag.jpg" },
  agamben:    { id: "agamben",    name: "Giorgio Agamben",      cityId: "rome",       periodId: "2001-2010", themeIds: ["corpo_visione"], image: "/images/visualculture/agamben.svg" },
};

// ─── Temi ─────────────────────────────────────────────────────────────────
// `authorIds` e `countryIds` sono derivabili dagli autori, ma li teniamo
// espliciti per evidenziare Paesi anche senza autori mappati puntualmente.
export const THEMES = {
  onirismo:      { id: "onirismo",      label: "Onirismo",       authorIds: ["fellini"], countryIds: ["italy"] },
  femminismo:    { id: "femminismo",    label: "Femminismo",     authorIds: ["irigaray", "mulvey", "doane", "butler", "haraway", "keller", "grosz", "hooks", "campt"], countryIds: ["belgium", "uk", "usa", "australia"] },
  strutturalismo:{ id: "strutturalismo",label: "Strutturalismo", authorIds: ["butler"], countryIds: ["usa"] },
  semiotica:     { id: "semiotica",     label: "Semiotica",      authorIds: [], countryIds: [] },
  black_studies: { id: "black_studies", label: "Black Studies",  authorIds: ["hooks", "mofokeng", "campt", "joseph", "lawson"], countryIds: ["usa", "southafrica"] },
  corpo_visione: { id: "corpo_visione", label: "Corpo e Visione", authorIds: ["cronenberg", "bergman", "beckett", "bacon_f", "magritte", "caravaggio", "anzieu", "rizzolatti", "grosz", "butler", "mulvey", "deleuze", "merleau", "mcluhan", "metz", "freud", "lacan", "damasio", "sobchack", "balazs", "sontag", "agamben"], countryIds: ["canada", "sweden", "france", "uk", "belgium", "italy", "austria", "germany", "usa"] },
};
