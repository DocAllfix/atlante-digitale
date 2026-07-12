import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Sorgente unica del tema chiaro/scuro. Sostituisce lo stato locale duplicato
// nelle pagine; usa la stessa chiave localStorage ("atlas-darkmode") così da
// restare retro-compatibile con le pagine non ancora migrate.
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("atlas-darkmode") || "true");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem("atlas-darkmode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggle = useCallback(() => setDarkMode((v) => !v), []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve essere usato dentro ThemeProvider");
  return ctx;
}
