import { motion } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES } from "@/data/dispositivoContent";

const WORK_LABEL = { film: "Film", gioco: "Videogiochi", opera: "Opere" };

// Pannello informativo del dispositivo in focus: DOM leggibile/accessibile,
// affiancato al dispositivo morphato. Le connessioni (autori/temi/mappa) come
// nodi orbitanti arrivano nello Step 5; qui testo e opere.
export default function SpatialInfoPanel({ device, onClose }) {
  const cat = CATEGORIES[device.category];
  const works = device.works || [];
  const grouped = works.reduce((m, w) => ((m[w.type] ||= []).push(w), m), {});

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

      <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-amber-300/50">Esc o click sul vuoto per tornare alla corrente</p>
    </motion.div>
  );
}
