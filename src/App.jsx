import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ease } from '@/motion/tokens';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
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
function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.55, ease: ease.scene } },
        exit: { opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.5, ease: ease.scene } },
      };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
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
