import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Foyer from './pages/Foyer';
import Atlas from './pages/Atlas';
import DeepDive from './pages/DeepDive';
import Aftersun from './pages/Aftersun';
import Dispositivo from './pages/Dispositivo';

// Transizione condivisa fra pagine (E1): dissolvenza incrociata, rispettosa
// della preferenza di movimento ridotto.
function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          {/* Add your page Route elements here */}
          <Route path="/" element={<Foyer />} />
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
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
