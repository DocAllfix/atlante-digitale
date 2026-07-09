# Chronos Atlas

Atlante digitale interattivo per la consultazione della memoria storica, artistica
e visuale. L'app si basa su una mappa mondiale consultabile con duplice funzione:

- **Geografica** — paesi, confini, nomi e città nel tempo.
- **Epistemologica** — un'interfaccia culturale con informazioni su artisti, opere
  e pensieri legati a ciascun paese.

Alla mappa si aggiungono una **timeline** (per decenni e secoli) e un **filtro
tematico**. Ogni scheda in consultazione può essere approfondita tramite pagine
dedicate e interconnesse.

## Stack

React 18 + Vite + TailwindCSS + shadcn/ui. Mappe con `react-leaflet`. I confini
storici sono caricati da dataset GeoJSON open ([historical-basemaps](https://github.com/aourednik/historical-basemaps)).

## Sviluppo locale

**Prerequisiti:** Node.js 18+ e npm.

```bash
npm install
npm run dev
```

L'app è interamente statica (nessun backend richiesto): la build può essere
pubblicata su qualsiasi hosting statico.

## Script

- `npm run dev` — server di sviluppo
- `npm run build` — build di produzione in `./dist`
- `npm run preview` — anteprima della build
- `npm run lint` — ESLint

## Asset

I video degli approfondimenti si trovano in `public/videos/`. Per la produzione è
consigliato spostarli su un CDN e aggiornare i percorsi in
`src/lib/deepDiveContent.js`.
