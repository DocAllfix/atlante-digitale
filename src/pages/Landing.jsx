import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion"
import { ChevronDown, RotateCcw } from "lucide-react"
import { useTypewriter } from "@/hooks/use-typewriter"

// Pagina d'ingresso cinematografica: foto scontornata dell'ambra (fluttuante,
// sfondo solido dell'app) con scroll-parallax pinned — titolo fermo in basso a
// sinistra, immagine che trasla verso l'alto rivelando la formica — seguita da
// un testo introduttivo a effetto macchina da scrivere e dall'ingresso vero e
// proprio nell'atlante (/esplora).

// Dimensioni native del ritaglio (public/images/landing/amber-insetto.png),
// usate per calcolare la rivelazione via scroll senza mai zoomare o distorcere.
const IMG_NATURAL_W = 349
const IMG_NATURAL_H = 790

const INTRO_TEXT =
  "Nel 1992 Emilio Garroni apre il suo saggio Estetica. Uno sguardo-attraverso con " +
  "un'immagine ripresa da Wittgenstein: un insetto imprigionato nell'ambra, il cui intero " +
  "mondo sensoriale coincide con il mezzo translucido che lo racchiude. Per quell'insetto " +
  "— come per chiunque guardi — non esiste un vedere puro e immediato: esiste soltanto " +
  "un guardare-attraverso qualcosa che ci precede e ci condiziona, che sia un mezzo " +
  "tecnologico, una cultura, una storia. È la stessa scommessa di Chronos Atlas, e del " +
  "suo titolo, Through the (un)seen: non limitarsi a mostrare ciò che il passato ha " +
  "lasciato visibile, ma interrogare il mezzo — mappe, confini, musei, discipline — " +
  "attraverso cui oggi lo vediamo. Ogni scheda di questo atlante è dunque anche un " +
  "invito a guardare il proprio sguardo."

function TitleBlock({ darkMode }) {
  return (
    <div className="absolute bottom-8 left-6 sm:left-10 max-w-[85%] z-10">
      <p className={`text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2 ${darkMode ? "text-amber-300/70" : "text-amber-800/70"}`}>
        Chronos Atlas
      </p>
      <h1 className={`font-prompt font-bold text-3xl sm:text-5xl leading-[1.05] ${darkMode ? "text-amber-50" : "text-stone-900"}`}>
        Through the (un)seen
      </h1>
    </div>
  )
}

export default function Landing() {
  const [darkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas-darkmode") || "true") } catch { return true }
  })
  const navigate = useNavigate()
  const heroWrapRef = useRef(null)
  const boxRef = useRef(null)
  const textSectionRef = useRef(null)
  const [textVisible, setTextVisible] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [replay, setReplay] = useState(0)
  const [maxTranslate, setMaxTranslate] = useState(0) // percentuale, calcolata a runtime

  const reduceMotion = typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    document.documentElement.classList.toggle("atlas-foyer-light", !darkMode)
  }, [darkMode])

  // Quanto deve traslare l'immagine (in % della propria altezza renderizzata),
  // senza mai zoomare né deformare (la larghezza resta sempre quella del box).
  // Si ferma un po' prima del punto di combaciamento esatto col fondo del
  // riquadro, lasciando un margine visibile a fine corsa (come da riferimento).
  const END_MARGIN_FACTOR = 0.9 // 1 = combacia a filo, <1 lascia margine in fondo

  useEffect(() => {
    function recompute() {
      const box = boxRef.current
      if (!box) return
      const boxW = box.clientWidth
      const boxH = box.clientHeight
      const renderedH = boxW * (IMG_NATURAL_H / IMG_NATURAL_W)
      if (renderedH <= boxH) { setMaxTranslate(0); return }
      setMaxTranslate(-((renderedH - boxH) / renderedH) * 100 * END_MARGIN_FACTOR)
    }
    recompute()
    window.addEventListener("resize", recompute)
    return () => window.removeEventListener("resize", recompute)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroWrapRef, offset: ["start start", "end end"] })
  const rawY = useTransform(scrollYProgress, [0, 1], [0, maxTranslate])
  const springY = useSpring(rawY, { stiffness: 55, damping: 20, mass: 0.6 }) // sensazione "fluttuante"
  const imageY = useMotionTemplate`${springY}%`
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const el = textSectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTextVisible(true); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { displayed, done } = useTypewriter(INTRO_TEXT, textVisible, { speed: 32, resetKey: replay })

  const restartText = () => {
    setShowButton(false)
    setReplay((r) => r + 1)
  }

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setShowButton(true), 700)
    return () => clearTimeout(t)
  }, [done])

  const bg = darkMode ? "bg-[#070a12] text-amber-50" : "bg-[#f7f2e9] text-stone-800"

  return (
    <div className={`w-full font-outfit ${bg}`}>
      <a
        href="#intro-testo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded focus:bg-amber-400 focus:text-black"
      >
        Vai al contenuto
      </a>

      {reduceMotion ? (
        <div className="relative h-screen w-full flex items-center justify-center">
          <img
            src="/images/landing/amber-insetto.png"
            alt="Un insetto imprigionato nell'ambra"
            className="w-[220px] sm:w-[280px] md:w-[320px] h-auto drop-shadow-2xl"
          />
          <TitleBlock darkMode={darkMode} />
        </div>
      ) : (
        <div ref={heroWrapRef} className="relative" style={{ height: "200vh" }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <div
              ref={boxRef}
              className="absolute left-1/2 -translate-x-1/2 top-0 h-screen w-[78vw] sm:w-[70vw] md:w-[62vw] lg:w-[52vw] max-w-[680px] overflow-hidden"
            >
              <motion.img
                src="/images/landing/amber-insetto.png"
                alt="Un insetto imprigionato nell'ambra"
                className="absolute left-0 top-0 w-full h-auto"
                style={{ y: imageY }}
              />
            </div>
            <TitleBlock darkMode={darkMode} />
            <motion.div
              style={{ opacity: cueOpacity }}
              className="absolute bottom-8 right-6 sm:right-10 flex flex-col items-center gap-1 z-10"
            >
              <span className={`text-[10px] uppercase tracking-[0.3em] ${darkMode ? "text-amber-200/70" : "text-amber-800/60"}`}>Scorri</span>
              <ChevronDown className={`w-5 h-5 animate-scroll-bounce ${darkMode ? "text-amber-200/80" : "text-amber-800/70"}`} />
            </motion.div>
          </div>
        </div>
      )}

      <section
        id="intro-testo"
        ref={textSectionRef}
        className="max-w-2xl mx-auto px-6 py-24 sm:py-28 min-h-[55vh] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {!showButton ? (
            <motion.p
              key="text"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className={`text-base sm:text-lg leading-relaxed font-body ${darkMode ? "text-amber-50/90" : "text-stone-700"}`}
            >
              {displayed}
              {textVisible && !done && (
                <span className="inline-block w-[0.5em] h-[1em] align-[-0.15em] bg-current ml-0.5 animate-caret" />
              )}
            </motion.p>
          ) : (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => navigate("/esplora")}
                className={`px-8 py-4 rounded-full font-prompt font-semibold text-base tracking-wide border transition-colors ${
                  darkMode
                    ? "border-amber-400/40 text-amber-100 hover:bg-amber-400/10"
                    : "border-amber-800/30 text-amber-900 hover:bg-amber-800/5"
                }`}
              >
                Inizia il tuo percorso →
              </button>
              <button
                onClick={restartText}
                title="Rileggi il testo"
                aria-label="Rileggi il testo"
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                  darkMode
                    ? "border-amber-400/40 text-amber-200 hover:bg-amber-400/10"
                    : "border-amber-800/30 text-amber-800 hover:bg-amber-800/5"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
