import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import { useIntroScroll } from "@/components/landing/intro/useIntroScroll";
import CorridorPlane from "@/components/landing/intro/CorridorPlane";
import QuoteThreshold from "@/components/landing/intro/QuoteThreshold";
import CTAArrival from "@/components/landing/intro/CTAArrival";
import LandingTransitionBridge from "@/components/landing/intro/LandingTransitionBridge";
import CorridorThread from "@/components/landing/intro/CorridorThread";
import { INTRO_SEGMENTS, CLOSING } from "@/components/landing/intro/introContent";

// Seconda parte della Landing: un corridoio editoriale corto, scroll-paced, con
// avanzamento in profondità. Sostituisce la vecchia sezione a timer; l'hero
// (prima parte) resta intatto.
export default function IntroEditorialCorridor() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useIntroScroll(ref);

  const text = darkMode ? "text-amber-50" : "text-stone-800";
  const muted = darkMode ? "text-amber-100/80" : "text-stone-600";

  const Quote = <QuoteThreshold darkMode={darkMode} />;
  const closing = (
    <p className={`text-2xl sm:text-3xl leading-relaxed text-center ${text}`}>{CLOSING}</p>
  );
  const ctaButton = <CTAArrival darkMode={darkMode} onEnter={() => navigate("/esplora")} />;

  if (reduce) {
    return (
      <section id="intro-testo" className={`max-w-3xl mx-auto px-6 py-24 ${text}`}>
        {Quote}
        {INTRO_SEGMENTS.map((s, i) => (
          <p key={i} className={`mt-8 text-lg leading-relaxed ${muted}`}>{s}</p>
        ))}
        <div className="mt-8">{closing}</div>
        <div className="mt-8">{ctaButton}</div>
      </section>
    );
  }

  const steps = [
    Quote,
    <p className={`text-xl sm:text-2xl leading-relaxed text-center ${muted}`}>{INTRO_SEGMENTS[0]}</p>,
    <p className={`text-xl sm:text-2xl leading-relaxed text-center ${muted}`}>{INTRO_SEGMENTS[1]}</p>,
    closing,
    ctaButton,
  ];

  return (
    <section id="intro-testo" ref={ref} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: "1200px" }}>
        <LandingTransitionBridge progress={scrollYProgress} />
        <CorridorThread progress={scrollYProgress} />
        {steps.map((node, i) => (
          <CorridorPlane key={i} index={i} total={steps.length} progress={scrollYProgress} holdToEnd={i === steps.length - 1}>
            {node}
          </CorridorPlane>
        ))}
      </div>
    </section>
  );
}
