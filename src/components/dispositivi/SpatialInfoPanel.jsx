import { motion } from "framer-motion";
import { X, MapPin, Layers, Route, Map } from "lucide-react";
import { CATEGORIES } from "@/data/dispositivoContent";
import {
  getRelatedAuthorsOfDevice, getRelatedDevicesOfDevice, getRelatedThemesOfDevice,
} from "@/lib/dispositivo-selectors";

const WORK_LABEL = { film: "Film", gioco: "Videogiochi", opera: "Opere" };
const REL_ICON = { author: MapPin, device: Layers, theme: Route, atlas: Map };

// Collegamenti del dispositivo (stesse azioni di prima, ora in fondo alla scheda).
function relationsOf(device) {
  const authors = getRelatedAuthorsOfDevice(device.id).map((a) => ({ key: `a-${a.id}`, kind: "author", tag: "Autore", label: a.name, id: a.id, color: "#facc15" }));
  const devices = getRelatedDevicesOfDevice(device.id).map((d) => ({ key: `d-${d.id}`, kind: "device", tag: "Collegato", label: d.name, id: d.id, color: "#93c5fd" }));
  const themes = getRelatedThemesOfDevice(device.id).map((th) => ({ key: `t-${th.id}`, kind: "theme", tag: "Percorso", label: th.label, id: th.id, color: "#fca5a5" }));
  const atlas = [{ key: "atlas", kind: "atlas", tag: "Mappa", label: "Apri nell'Atlante", color: "#a7f3d0" }];
  return [...authors, ...devices, ...themes, ...atlas];
}

// Pannello informativo del dispositivo in focus: DOM leggibile/accessibile,
// affiancato al dispositivo morphato. Testo, opere e — in fondo — i collegamenti
// (autori/dispositivi/temi/mappa) come mini-schede cliccabili.
export default function SpatialInfoPanel({ device, onClose, onPick }) {
  const cat = CATEGORIES[device.category];
  const works = device.works || [];
  const grouped = works.reduce((m, w) => ((m[w.type] ||= []).push(w), m), {});
  const relations = relationsOf(device);

  return (
    <motion.div
      initial={{ opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 34 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto absolute right-4 sm:right-[30%] top-20 sm:top-24 w-[min(90vw,340px)] max-h-[calc(100vh-9rem)] overflow-y-auto rounded-2xl border border-amber-400/20 bg-[#0b0f18]/92 backdrop-blur-md shadow-2xl p-5 font-outfit"
    >
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-amber-400/20 text-amber-100/80 hover:text-amber-100 hover:border-amber-400/50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="text-[11px] uppercase tracking-[0.3em] text-amber-300/70">{cat?.label || ""} · {device.year}</div>
      <h2 className="mt-1 font-prompt uppercase tracking-[0.06em] text-2xl text-amber-100 pr-8">{device.name}</h2>

      {(device.text || device.tagline) && (
        <p className="mt-3 text-sm leading-relaxed text-amber-100/75">{device.text || device.tagline}</p>
      )}
      {device.details && <p className="mt-2 text-xs leading-relaxed text-amber-100/50">{device.details}</p>}

      {Object.keys(grouped).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div className="text-[10px] uppercase tracking-[0.25em] text-amber-300/60">{WORK_LABEL[type] || type}</div>
              <ul className="mt-1 text-sm text-amber-100/70">
                {items.map((w, i) => (
                  <li key={i}>{w.title}{w.year ? <span className="text-amber-100/40"> · {w.year}</span> : null}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-amber-400/15">
        <div className="text-[10px] uppercase tracking-[0.25em] text-amber-300/60 mb-2">Collegamenti</div>
        <div className="flex flex-col gap-1.5">
          {relations.map((it) => {
            const Icon = REL_ICON[it.kind];
            const isAtlas = it.kind === "atlas";
            return (
              <button
                key={it.key}
                onClick={() => onPick?.(it)}
                className={`group flex items-center gap-2.5 w-full text-left pl-1.5 pr-3 py-1.5 rounded-xl border transition-all duration-200 ${
                  isAtlas
                    ? "bg-amber-400/12 border-amber-300/45 hover:bg-amber-400/20 shadow-[0_0_16px_rgba(251,191,36,0.2)]"
                    : "bg-black/25 border-amber-400/15 hover:border-amber-400/45 hover:bg-black/40"
                }`}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" style={{ background: `${it.color}22`, color: it.color }}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="leading-tight min-w-0">
                  <span className="block text-[8px] uppercase tracking-[0.22em] text-amber-300/55">{it.tag}</span>
                  <span className="block text-[13px] text-amber-100/85 group-hover:text-amber-50 truncate">{it.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-amber-300/50">Esc o click sul vuoto per tornare alla corrente</p>
    </motion.div>
  );
}
