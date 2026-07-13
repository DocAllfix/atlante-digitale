// La CTA come APPRODO del corridoio: una linea che "arriva" al pulsante, non un
// bottone appiccicato. L'invito naturale a entrare nel progetto.
export default function CTAArrival({ darkMode, onEnter }) {
  const cls = `group inline-flex items-center gap-3 px-8 py-4 rounded-full font-prompt font-semibold text-base tracking-wide border transition-colors ${
    darkMode ? "border-amber-400/50 text-amber-100 hover:bg-amber-400/10" : "border-amber-800/30 text-amber-900 hover:bg-amber-800/5"
  }`;
  return (
    <div className="text-center">
      <button onClick={onEnter} data-cursor="link" className={cls}>
        Inizia il tuo percorso
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}
