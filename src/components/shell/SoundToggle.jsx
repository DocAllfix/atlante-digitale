import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/audio/SoundProvider";

// Controllo audio persistente, sempre visibile. Parte muto.
export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      onClick={toggle}
      data-cursor="link"
      aria-pressed={enabled}
      aria-label={enabled ? "Disattiva l'audio ambientale" : "Attiva l'audio ambientale"}
      title={enabled ? "Audio ambientale attivo" : "Audio ambientale muto"}
      className="fixed bottom-3 left-3 z-[1400] flex items-center justify-center w-11 h-11 rounded-full bg-[#0b0f18]/85 backdrop-blur-md border border-amber-400/30 text-amber-200 shadow-lg hover:border-amber-400/60 hover:text-amber-100 transition-colors"
    >
      {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
}
