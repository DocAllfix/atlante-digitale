import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ease } from '@/motion/tokens';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './theme/ThemeProvider';
import { SoundProvider } from './audio/SoundProvider';
import { GuidedPathProvider } from './guided/GuidedPathProvider';
import ExperienceShell from './app/ExperienceShell';
// Add page imports here
import Landing from './pages/Landing';
import Foyer from './pages/Foyer';
import Atlas from './pages/Atlas';
import DeepDive from './pages/DeepDive';
import Aftersun from './pages/Aftersun';
import Dispositivo from './pages/Dispositivo';

// Transizione-scena fra "luoghi": la pagina uscente si ritira in profondità
// (scala + sfocatura + dissolvenza), l'entrante emerge in dissolvenza. La
// pagina entrante NON resta con transform/filter a riposo (solo opacity), così
// i figli position:fixed restano ancorati al viewport. Rispetta reduced-motion.
// Durate contenute (il vuoto tra le due, comunque sempre nero — vedi index.css
// — resta breve) per un passaggio rapido tra le pagine.
function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reduce = useReducedMotion();
  // Uscite "dirette": la Soglia (Landing, solo premendo "Inizia il tuo
  // percorso") e Dispositivo (i cui collegamenti portano sempre e solo
  // all'Atlante) usano una semplice dissolvenza (verso il nero, già sfondo di
  // base), senza la scala/sfocatura usata altrove tra i "luoghi" — l'apertura
  // della scheda di destinazione deve seguire senza altro di visibile in mezzo.
  const simpleFadeExit = location.pathname === "/" || location.pathname === "/dispositivo";
  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    : simpleFadeExit
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3, ease: ease.scene } },
        exit: { opacity: 0, transition: { duration: 0.45, ease: ease.scene } },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3, ease: ease.scene } },
        exit: { opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.26, ease: ease.scene } },
      };
  // Ripristina lo scroll in cima quando la dissolvenza uscente finisce (non al
  // semplice cambio di pathname, come faceva ScrollToTop — mostrava per un
  // attimo l'inizio della pagina che si sta lasciando, es. l'hero della
  // Landing scrollato in fondo, riapparire durante il proprio fade).
  const resetScroll = () => {
    if (navigationType === "POP" || location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  // NIENTE mode="wait": con alcune pagine (Dispositivo — scena 3D pesante,
  // Canvas R3F + ScrollControls) lo smontaggio non segnala mai il proprio
  // completamento a framer-motion se l'uscita deve attendere quello smontaggio
  // — la navigazione cambia l'URL ma la pagina successiva non si monta mai
  // (schermo nero permanente, verificato con test approfonditi). Le due
  // pagine si sovrappongono per la breve durata della dissolvenza incrociata
  // invece di susseguirsi: pagine "pesanti" (Atlas, Dispositivo — vedi i loro
  // file) sono perciò `fixed inset-0`, così l'entrante si sovrappone sempre
  // correttamente alla viewport invece di accodarsi nel flusso normale sotto
  // quella uscente.
  return (
    <AnimatePresence onExitComplete={resetScroll}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ErrorBoundary key={location.pathname}>
          <Routes location={location}>
            {/* Add your page Route elements here */}
            <Route path="/" element={<Landing />} />
            <Route path="/esplora" element={<Foyer />} />
            <Route path="/atlante" element={<Atlas />} />
            <Route path="/approfondisci" element={<DeepDive />} />
            <Route path="/aftersun" element={<Aftersun />} />
            <Route path="/dispositivo" element={<Dispositivo />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <ThemeProvider>
        <SoundProvider>
          <GuidedPathProvider>
            <Router>
              <ScrollToTop />
              <ExperienceShell>
                <AnimatedRoutes />
              </ExperienceShell>
            </Router>
            <Toaster />
          </GuidedPathProvider>
        </SoundProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
