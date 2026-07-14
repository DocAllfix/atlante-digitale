import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

// Solo la navigazione ad ancora (#hash): scrolla all'elemento una volta
// montato. Il reset a inizio pagina per la navigazione normale è gestito da
// AnimatedRoutes (App.jsx) a dissolvenza-uscita completata, non qui — farlo
// al cambio di pathname mostrava per un attimo la pagina uscente "saltare"
// in cima mentre era ancora visibile in dissolvenza.
export default function ScrollToTop() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = getHashId(hash);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return null;
}
