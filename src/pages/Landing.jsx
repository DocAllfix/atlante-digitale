import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { ChevronDown, RotateCcw } from "lucide-react"

// Pagina d'ingresso cinematografica: foto scontornata dell'ambra (fluttuante,
// sfondo solido dell'app) con scroll-parallax pinned — titolo fermo in basso a
// sinistra, immagine che trasla verso l'alto rivelando la formica — seguita da
// un testo introduttivo a effetto macchina da scrivere e dall'ingresso vero e
// proprio nell'atlante (/esplora).

// Dimensioni native del ritaglio (public/images/landing/FOTO.png), già
// scontornato, usate per calcolare la rivelazione via scroll senza deformare.
const IMG_NATURAL_W = 1150
const IMG_NATURAL_H = 2502

// Ridistribuisce il progresso di scroll per bilanciare il ritmo percepito:
// la curva misurata dal video resta ferma per un tratto iniziale molto
// lungo (60%) e comprime tutto il movimento nel restante 40%, il che dà
// la sensazione di "lento all'inizio, brusco alla fine". Questa funzione
// accorcia il tratto fermo ed estende quello in movimento, applicata a
// tutte e tre le curve così restano sincronizzate tra loro.
const REMAP_OLD_BREAK = 0.6
const REMAP_NEW_BREAK = 0.11
function rebalance(p) {
  return p < REMAP_OLD_BREAK
    ? (p / REMAP_OLD_BREAK) * REMAP_NEW_BREAK
    : REMAP_NEW_BREAK + ((p - REMAP_OLD_BREAK) / (1 - REMAP_OLD_BREAK)) * (1 - REMAP_NEW_BREAK)
}

// Curva di posizione (traslazione verticale) dell'immagine, misurata pixel
// per pixel sui 91 fotogrammi del video di riferimento (progresso di scroll
// 0-1, frazione 0-1 della corsa totale), poi ridistribuita con rebalance().
// Nota: i dati grezzi misurati avevano due brevi tratti piatti (nessun
// movimento per un pezzo di scroll, es. 0.922→0.944 e 0.967→0.989) dovuti
// a fotogrammi identici nel video sorgente — qui interpolati in un
// avanzamento continuo, altrimenti lo scroll sembra "bloccarsi" in quei
// punti.
const MOTION_CURVE = [
  [0.000, 0], [0.600, 0],
  [0.611, 0.041], [0.622, 0.099], [0.633, 0.140], [0.644, 0.167],
  [0.656, 0.178], [0.667, 0.196], [0.678, 0.211], [0.689, 0.231],
  [0.700, 0.246], [0.711, 0.259], [0.722, 0.264], [0.733, 0.269],
  [0.744, 0.275], [0.756, 0.278], [0.767, 0.286], [0.778, 0.366],
  [0.789, 0.402], [0.800, 0.418], [0.811, 0.528], [0.822, 0.601],
  [0.833, 0.661], [0.844, 0.722], [0.856, 0.757], [0.867, 0.789],
  [0.878, 0.836], [0.889, 0.890], [0.900, 0.903], [0.911, 0.930],
  [0.922, 0.950], [0.933, 0.965], [0.944, 0.975], [0.956, 0.984],
  [0.967, 0.990], [0.978, 0.994], [0.989, 0.997], [1.000, 1.000],
]
const MOTION_CURVE_X = MOTION_CURVE.map((p) => rebalance(p[0]))
const MOTION_CURVE_FRAC = MOTION_CURVE.map((p) => p[1])

// Curva di scala: l'immagine si rimpicciolisce mentre scorre (misurato: la
// larghezza visibile dell'oggetto passa da 1277 a 886px sui fotogrammi,
// un rapporto di ~0.694, qui attenuato a 0.72 su richiesta). Ritardata in
// modo da cominciare un po' dopo che la traslazione è già partita, non
// nello stesso istante.
const SCALE_CURVE = [
  [0.000, 0], [0.178, 0.028], [0.222, 0.061], [0.244, 0.097], [0.267, 0.118],
  [0.289, 0.159], [0.311, 0.205], [0.322, 0.225], [0.344, 0.251], [0.356, 0.276],
  [0.367, 0.322], [0.378, 0.379], [0.389, 0.425], [0.400, 0.453], [0.422, 0.491],
  [0.433, 0.540], [0.444, 0.604], [0.456, 0.668], [0.467, 0.698], [0.489, 0.729],
  [0.500, 0.765], [0.511, 0.806], [0.522, 0.829], [0.544, 0.854], [0.567, 0.880],
  [0.589, 0.905], [0.622, 0.939], [0.644, 0.962], [0.700, 0.985], [1.000, 1.000],
]
const SCALE_START = REMAP_NEW_BREAK + 0.08
const SCALE_CURVE_X = SCALE_CURVE.map((p) => SCALE_START + rebalance(p[0]) * (1 - SCALE_START))
const SCALE_MIN = 0.72
const SCALE_CURVE_Y = SCALE_CURVE.map((p) => 1 - p[1] * (1 - SCALE_MIN))

// Il titolo non ha più una curva propria: segue esattamente la stessa
// tempistica dell'immagine (stessa MOTION_CURVE, già ribilanciata), così
// resta fermo finché l'immagine è ferma e comincia a muoversi nello
// stesso istante in cui l'immagine parte — con un'escursione più
// piccola, per un effetto di leggero parallax "al seguito".
const TITLE_TRAVEL_VH = 24

const INTRO_TEXT =
  "Nel 1992 Emilio Garroni apre il suo saggio Estetica. Uno sguardo-attraverso con " +
  "un'immagine ripresa da Wittgenstein: un insetto imprigionato nell'ambra, il cui intero " +
  "mondo sensoriale coincide con il mezzo translucido che lo racchiude. Per quell'insetto " +
  "— come per chiunque guardi — non esiste un vedere puro e immediato: esiste soltanto " +
  "un guardare-attraverso qualcosa che ci precede e ci condiziona, che sia un mezzo " +
  "tecnologico, una cultura, una storia. È la stessa scommessa di questo atlante, e del " +
  "suo titolo, Through the (un)seen: non limitarsi a mostrare ciò che il passato ha " +
  "lasciato visibile, ma interrogare il mezzo — mappe, confini, musei, discipline — " +
  "attraverso cui oggi lo vediamo. Ogni scheda di questo atlante è dunque anche un " +
  "invito a guardare il proprio sguardo."

function CountdownIcon({ active, durationMs, className }) {
  const size = 18
  const strokeW = 2
  const r = (size - strokeW) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`shrink-0 -rotate-90 mt-1 ${className}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeW} stroke="currentColor" opacity={0.25} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeW} stroke="currentColor"
        strokeDasharray={c}
        initial={{ strokeDashoffset: 0 }}
        animate={active ? { strokeDashoffset: c } : { strokeDashoffset: 0 }}
        transition={{ duration: durationMs / 1000, ease: "linear" }}
      />
    </svg>
  )
}

function TitleBlock({ darkMode, style, fontSize }) {
  return (
    <motion.div style={style} className="absolute bottom-8 left-6 sm:left-10 z-20">
      <motion.h1
        style={{ fontSize }}
        className={`font-poppins font-bold leading-[1.05] ${darkMode ? "text-white" : "text-stone-900"}`}
      >
        Through the<br />(un)seen
      </motion.h1>
    </motion.div>
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

  // Traslazione dell'immagine (in % della propria altezza renderizzata),
  // senza mai zoomare né deformare (la larghezza resta sempre quella del box).
  // Le due frazioni sotto sono state misurate pixel per pixel su 91 fotogrammi
  // del video di riferimento: all'inizio resta un piccolo margine sopra
  // l'oggetto, alla fine un margine più ampio sotto la punta della pietra
  // (lo scroll va OLTRE il punto di combaciamento esatto, non si ferma prima).
  const TOP_GAP_FRACTION = 0.12     // margine sopra l'oggetto a inizio corsa (% box height)
  const BOTTOM_GAP_FRACTION = 0.16  // margine sotto l'oggetto a fine corsa (% box height)
  const [startTranslate, setStartTranslate] = useState(0)

  useEffect(() => {
    function recompute() {
      const box = boxRef.current
      if (!box) return
      const boxW = box.clientWidth
      const boxH = box.clientHeight
      const renderedH = boxW * (IMG_NATURAL_H / IMG_NATURAL_W)
      if (renderedH <= boxH) { setStartTranslate(0); setMaxTranslate(0); return }
      setStartTranslate((TOP_GAP_FRACTION * boxH / renderedH) * 100)
      setMaxTranslate(((boxH * (1 - BOTTOM_GAP_FRACTION)) / renderedH - 1) * 100)
    }
    recompute()
    window.addEventListener("resize", recompute)
    return () => window.removeEventListener("resize", recompute)
  }, [])

  const { scrollYProgress } = useScroll({ target: heroWrapRef, offset: ["start start", "end end"] })
  const curveOutput = MOTION_CURVE_FRAC.map((f) => startTranslate + f * (maxTranslate - startTranslate))
  const rawY = useTransform(scrollYProgress, MOTION_CURVE_X, curveOutput)
  const springY = useSpring(rawY, { stiffness: 55, damping: 20, mass: 0.6 }) // sensazione "fluttuante"
  const imageY = useMotionTemplate`${springY}%`
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  // L'immagine si rimpicciolisce mentre scorre, ancorata dall'alto in modo
  // che la cima resti ferma mentre il resto si restringe verso di essa.
  const rawScale = useTransform(scrollYProgress, SCALE_CURVE_X, SCALE_CURVE_Y)
  const imageScale = useSpring(rawScale, { stiffness: 55, damping: 20, mass: 0.6 })

  // Il titolo segue l'immagine: stessa curva (stesso istante di partenza,
  // stesso ritmo), ampiezza minore per un effetto di parallax leggero.
  // Resta sempre opaco: esce dalla vista per effetto del clip dello
  // scroll, non sparisce con un fade.
  const titleCurveY = MOTION_CURVE_FRAC.map((f) => -f * TITLE_TRAVEL_VH)
  const titleRawY = useTransform(scrollYProgress, MOTION_CURVE_X, titleCurveY)
  const titleSpringY = useSpring(titleRawY, { stiffness: 60, damping: 22, mass: 0.5 })
  const titleY = useMotionTemplate`${titleSpringY}vh`

  // Il titolo parte grande (come nei fotogrammi di riferimento, ma un po'
  // più contenuto) e si "restringe" (morphing) fino alla dimensione
  // attuale più piccola. Il restringimento parte solo quando la foto non
  // si vede più (ultimo istante della sua corsa di rivelazione), non
  // prima.
  const TITLE_SIZE_START_VW = 7
  const TITLE_SIZE_END_VW = 3.6
  let titleFontStartIndex = 0
  for (let i = 0; i < MOTION_CURVE_FRAC.length; i++) {
    if (MOTION_CURVE_FRAC[i] < 1) titleFontStartIndex = i
  }
  const TITLE_FONT_START = MOTION_CURVE_X[titleFontStartIndex]
  const titleFontCurveX = MOTION_CURVE_X.map((x) => TITLE_FONT_START + x * (1 - TITLE_FONT_START))
  const titleFontCurve = MOTION_CURVE_FRAC.map(
    (f) => TITLE_SIZE_START_VW + f * (TITLE_SIZE_END_VW - TITLE_SIZE_START_VW)
  )
  const titleFontRaw = useTransform(scrollYProgress, titleFontCurveX, titleFontCurve)
  const titleFontSpring = useSpring(titleFontRaw, { stiffness: 20, damping: 16, mass: 1 })
  const titleFontSize = useMotionTemplate`clamp(30px, ${titleFontSpring}vw, 170px)`

  // La dissolvenza del testo è agganciata allo scroll della sezione stessa
  // (non a un timer), così appare esattamente mentre la scorri fino a
  // quella posizione, mai prima e mai già "pronta" all'arrivo.
  const { scrollYProgress: textScrollProgress } = useScroll({
    target: textSectionRef,
    offset: ["start 0.85", "start 0.4"],
  })
  const textOpacity = useTransform(textScrollProgress, [0, 1], [0, 1])

  // Testo in dissolvenza classica: resta fisso per qualche secondo per
  // favorire la lettura, poi viene sostituito dal pulsante.
  const TEXT_READ_DELAY = 15000
  const restartText = () => {
    setShowButton(false)
    setReplay((r) => r + 1)
  }

  // Il countdown/timer parte non appena il titolo raggiunge la sua
  // posizione di riposo (fine corsa dell'hero), non quando il testo ha
  // finito di dissolversi in vista — sono due cose separate.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.995) setTextVisible(true)
  })

  useEffect(() => {
    if (!textVisible) return
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const t = setTimeout(() => setShowButton(true), reduce ? 0 : TEXT_READ_DELAY)
    return () => clearTimeout(t)
  }, [textVisible, replay])

  const bg = darkMode ? "bg-black text-amber-50" : "bg-[#f7f2e9] text-stone-800"

  return (
    <div className={`w-full font-outfit ${bg}`} style={{ scrollSnapType: "y proximity" }}>
      <a
        href="#intro-testo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded focus:bg-amber-400 focus:text-black"
      >
        Vai al contenuto
      </a>

      {reduceMotion ? (
        <div className="relative h-screen w-full flex items-center justify-center">
          <img
            src="/images/landing/FOTO.png"
            alt="Un insetto imprigionato nell'ambra"
            className="w-[220px] sm:w-[280px] md:w-[320px] h-auto drop-shadow-2xl"
          />
          <TitleBlock darkMode={darkMode} fontSize="clamp(30px, 8vw, 56px)" />
        </div>
      ) : (
        <div ref={heroWrapRef} className="relative" style={{ height: "480vh" }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <div
              ref={boxRef}
              className="absolute left-1/2 -translate-x-1/2 top-0 h-screen w-[70vw] sm:w-[62vw] md:w-[56vw] lg:w-[48vw] max-w-[620px] overflow-hidden"
            >
              <motion.img
                src="/images/landing/FOTO.png"
                alt="Un insetto imprigionato nell'ambra"
                className="absolute left-0 top-0 w-full h-auto origin-top"
                style={{ y: imageY, scale: imageScale }}
              />
            </div>
            <TitleBlock darkMode={darkMode} style={{ y: titleY }} fontSize={titleFontSize} />
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
        style={{ scrollSnapAlign: "start" }}
        className="relative max-w-4xl mx-auto px-6 min-h-screen"
      >
        <AnimatePresence>
          {!showButton ? (
            <motion.div
              key="text"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-x-0 top-8 sm:top-12 flex items-start justify-center px-6"
            >
              <div className="flex items-start gap-3 max-w-4xl">
                <CountdownIcon
                  active={textVisible}
                  durationMs={TEXT_READ_DELAY}
                  className={darkMode ? "text-amber-200/80" : "text-amber-800/70"}
                />
                <motion.p
                  style={{ opacity: textOpacity }}
                  className={`text-[18px] sm:text-[22px] leading-relaxed font-body ${darkMode ? "text-amber-50/90" : "text-stone-700"}`}
                >
                  {INTRO_TEXT}
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-x-0 top-8 sm:top-12 flex items-start justify-center gap-3 px-6"
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
