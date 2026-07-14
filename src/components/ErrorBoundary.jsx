import { Component } from "react";

// Rete di sicurezza per l'intera navigazione: senza questa, un'eccezione a
// runtime in una pagina (es. un dato mancante durante l'apertura di una
// scheda da deep-link) smonta l'intero albero React, lasciando una pagina
// nera permanente — l'unico modo per uscirne era ricaricare manualmente.
// Qui invece si mostra un recupero interno; il consumer la rimonta passando
// una `key` che cambia a ogni navigazione (App.jsx usa location.key), così
// un errore non "segue" l'utente sulla pagina successiva.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-black text-amber-100 font-outfit px-6 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300/70">Qualcosa è andato storto</p>
        <p className="text-amber-100/60 text-sm max-w-sm">La pagina non si è aperta correttamente. Puoi riprovare senza ricaricare.</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-lg border border-amber-400/40 text-amber-200 hover:bg-amber-400/10 transition-colors text-sm"
          >
            Riprova
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-lg border border-amber-400/20 text-amber-100/70 hover:text-amber-100 hover:border-amber-400/40 transition-colors text-sm no-underline"
          >
            Torna alla Soglia
          </a>
        </div>
      </div>
    );
  }
}
