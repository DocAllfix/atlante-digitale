import { createContext, useContext, useState, useCallback } from "react";
import { getAuthorsByTheme, getTheme } from "@/lib/graph-selectors";
import { getDevicesByTheme } from "@/lib/dispositivo-selectors";

// Percorso guidato "conductor": data una tematica, costruisce una sequenza di
// entità (prima gli autori, poi i dispositivi) da attraversare in ordine. È un
// livello sottile sopra i selettori del grafo: non naviga tra le pagine e non
// tocca la loro logica — il lettore vive nello shell. Sempre interrompibile.
const Ctx = createContext(null);

export function GuidedPathProvider({ children }) {
  const [state, setState] = useState(null); // { themeId, label, steps, index }

  const start = useCallback((themeId) => {
    const theme = getTheme(themeId);
    if (!theme) return;
    const steps = [
      ...getAuthorsByTheme(themeId).map((a) => ({ kind: "author", id: a.id })),
      ...getDevicesByTheme(themeId).map((d) => ({ kind: "device", id: d.id })),
    ];
    if (!steps.length) return;
    setState({ themeId, label: theme.label, steps, index: 0 });
  }, []);

  const close = useCallback(() => setState(null), []);
  const next = useCallback(
    () => setState((s) => (s && s.index < s.steps.length - 1 ? { ...s, index: s.index + 1 } : s)),
    []
  );
  const prev = useCallback(
    () => setState((s) => (s && s.index > 0 ? { ...s, index: s.index - 1 } : s)),
    []
  );

  return <Ctx.Provider value={{ state, start, close, next, prev }}>{children}</Ctx.Provider>;
}

export function useGuidedPath() {
  return useContext(Ctx) ?? { state: null, start: () => {}, close: () => {}, next: () => {}, prev: () => {} };
}
