import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { atlasTheme } from "@/lib/atlasTheme";
import GlobeIntroScene from "@/components/atlas/intro/GlobeIntroScene";

// Overlay d'ingresso della mappa: ospita la scena R3F (globo che si srotola)
// sopra la mappa Leaflet già montata. Al termine del morph l'overlay sfuma
// (crossfade) rivelando la mappa; un click salta all'handoff. Chiama onDone
// una volta smontata la dissolvenza.
export default function GlobeIntro({ onDone, darkMode }) {
  const [skip, setSkip] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const bg = atlasTheme[darkMode ? "dark" : "light"].mapBg;

  return (
    <div
      onClick={() => setSkip(true)}
      aria-hidden="true"
      className="fixed inset-0 z-[1200] cursor-pointer transition-opacity duration-500"
      style={{ background: bg, opacity: leaving ? 0 : 1 }}
      onTransitionEnd={() => { if (leaving) onDone(); }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 42, position: [0, 0, 2.6], near: 0.1, far: 100 }}
        style={{ background: bg }}
      >
        <GlobeIntroScene darkMode={darkMode} skip={skip} onComplete={() => setLeaving(true)} />
      </Canvas>
    </div>
  );
}
