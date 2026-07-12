import { createContext, useContext, useRef, useState, useCallback } from "react";

// Layer sonoro dell'esperienza, sintetizzato con Web Audio (nessun file audio
// esterno → self-contained). Un drone basso "che respira" come tessuto
// ambientale + micro-suoni (playCue) sulle interazioni chiave. Parte MUTO: la
// prima attivazione avviene con un gesto dell'utente (il toggle), come richiede
// la policy di autoplay dei browser.
const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef(null);
  const droneRef = useRef(null);

  const ensureContext = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  };

  const startDrone = (ctx) => {
    if (droneRef.current) return;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Filtro caldo comune: taglia gli acuti, tutto ovattato.
    const warm = ctx.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 700;
    warm.Q.value = 0.3;
    warm.connect(master);

    // Accordo morbido lo-fi (Am9: La·Do·Mi·Sol·Si), onde dolci.
    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.5;
    chordGain.connect(warm);
    // Wow/flutter: lieve ondeggiamento del pitch, la "warble" del nastro.
    const flutter = ctx.createOscillator();
    flutter.frequency.value = 0.18;
    const flutterGain = ctx.createGain();
    flutterGain.gain.value = 7; // in cents
    flutter.connect(flutterGain);
    flutter.start();
    const oscs = [110.0, 130.81, 164.81, 196.0, 246.94].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i < 2 ? "triangle" : "sine";
      o.frequency.value = f;
      flutterGain.connect(o.detune);
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.28;
      o.connect(g);
      g.connect(chordGain);
      o.start();
      return o;
    });

    // Crackle del vinile: pop sparsi in un buffer loopato, bandpass morbido.
    const size = 4 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() < 0.0006 ? Math.random() * 2 - 1 : 0;
    }
    const crackle = ctx.createBufferSource();
    crackle.buffer = buffer;
    crackle.loop = true;
    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = "bandpass";
    crackleFilter.frequency.value = 2200;
    crackleFilter.Q.value = 0.8;
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.2;
    crackle.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(master);
    crackle.start();

    // Respiro lievissimo sul volume.
    const lfoV = ctx.createOscillator();
    lfoV.frequency.value = 0.06;
    const lfoVGain = ctx.createGain();
    lfoVGain.gain.value = 0.03;
    lfoV.connect(lfoVGain);
    lfoVGain.connect(master.gain);
    lfoV.start();

    droneRef.current = { master, oscs, crackle, flutter, lfoV };
  };

  const toggle = useCallback(() => {
    const ctx = ensureContext();
    ctx.resume?.();
    startDrone(ctx);
    const master = droneRef.current.master;
    master.gain.cancelScheduledValues(ctx.currentTime);
    if (!enabled) {
      master.gain.setTargetAtTime(0.4, ctx.currentTime, 0.8); // dissolvenza in
      setEnabled(true);
    } else {
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); // dissolvenza out
      setEnabled(false);
    }
  }, [enabled]);

  // Micro-suono breve su un'interazione (no-op se l'audio è muto).
  const playCue = useCallback(
    (type = "nav") => {
      if (!enabled || !ctxRef.current) return;
      const ctx = ctxRef.current;
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(type === "open" ? 660 : 440, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.05, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.3);
    },
    [enabled]
  );

  return (
    <SoundContext.Provider value={{ enabled, toggle, playCue }}>
      {children}
    </SoundContext.Provider>
  );
}

// Default sicuro: se usato fuori dal provider non lancia (no-op).
export function useSound() {
  return useContext(SoundContext) ?? { enabled: false, toggle: () => {}, playCue: () => {} };
}
