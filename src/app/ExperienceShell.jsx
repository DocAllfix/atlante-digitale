import { useLocation } from "react-router-dom";
import GuideRail from "@/components/shell/GuideRail";
import Cursor from "@/components/shell/Cursor";
import SoundToggle from "@/components/shell/SoundToggle";
import GuidedPath from "@/components/shell/GuidedPath";

// Guscio persistente montato SOPRA le route (dentro il Router, fuori
// dall'AnimatePresence): non si rimonta al cambio pagina, così la navigazione
// globale — e in seguito cursore, audio e overlay di transizione — sopravvive
// agli spostamenti tra i "luoghi".
// La Soglia (Landing) resta un rito d'ingresso senza chrome: lì il launcher è
// nascosto. Altrove — Atlante compreso — la mappa fa da "sei qui".
export default function ExperienceShell({ children }) {
  const { pathname } = useLocation();
  const showGuide = pathname !== "/";
  return (
    <>
      {children}
      <Cursor />
      <SoundToggle />
      <GuidedPath />
      {showGuide && <GuideRail />}
    </>
  );
}
