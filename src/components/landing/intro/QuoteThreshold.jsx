import { QUOTE, QUOTE_ATTR } from "@/components/landing/intro/introContent";

// La citazione come SOGLIA: una superficie sospesa (pannello bordato con lieve
// luce ambra), virgolette grandi in filigrana e una linea-soglia. Il momento
// forte e memorabile del corridoio.
export default function QuoteThreshold({ darkMode }) {
  const text = darkMode ? "text-amber-50" : "text-stone-900";
  const accent = darkMode ? "text-amber-300/70" : "text-amber-800/70";
  const mark = darkMode ? "text-amber-400/15" : "text-amber-700/15";

  return (
    <div className="relative text-center">
      {/* Superficie-soglia sospesa */}
      <div className="absolute -inset-x-8 -inset-y-12 sm:-inset-x-16 rounded-3xl border border-amber-400/15 bg-gradient-to-b from-amber-400/[0.06] via-transparent to-amber-400/[0.03] pointer-events-none" />
      {/* Virgola d'apertura in filigrana */}
      <span className={`absolute -top-12 left-1/2 -translate-x-1/2 font-prompt text-[7rem] leading-none select-none ${mark}`}>“</span>

      <p className={`relative font-prompt leading-[1.12] text-3xl sm:text-4xl md:text-5xl ${text}`}>{QUOTE}</p>

      <div className="relative mx-auto mt-6 h-px w-16 bg-amber-400/40" />
      <p className={`relative mt-4 text-[11px] uppercase tracking-[0.35em] ${accent}`}>{QUOTE_ATTR}</p>
    </div>
  );
}
