import { Power } from "lucide-react";

// Interruttore power in basso a destra. Da spento: alone pulsante + etichetta
// "Accendi" → invita chiaramente al click (è l'unico modo per procedere). Da
// acceso: indicatore stabile e meno prominente.
export default function PowerSwitch({ on, onPower }) {
  return (
    <button
      type="button"
      onClick={onPower}
      data-cursor="link"
      aria-label={on ? "Schermi accesi" : "Accendi gli schermi per procedere"}
      aria-pressed={on}
      className={`fixed bottom-5 right-5 z-[1401] flex items-center justify-center w-16 h-16 rounded-full border-2 backdrop-blur-md transition-all duration-500 ${
        on
          ? "border-amber-400/50 text-amber-300 bg-[#0b0f18]/80 shadow-[0_0_16px_rgba(251,191,36,0.35)]"
          : "border-amber-400/60 text-amber-100 bg-[#0b0f18]/70 hover:text-amber-50 hover:border-amber-300 animate-power-pulse"
      }`}
    >
      <Power className="w-7 h-7" />
      {!on && (
        <span className="absolute -top-6 text-[10px] uppercase tracking-[0.28em] text-amber-200/80 whitespace-nowrap">
          Accendi
        </span>
      )}
    </button>
  );
}
