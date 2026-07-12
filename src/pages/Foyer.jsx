import { lazy, Suspense, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { webglOK } from "@/lib/webgl";
import FoyerFallback from "@/components/foyer/FoyerFallback";

// Il Foyer è uno spazio 3D esplorabile (FoyerSpace, lazy → chunk WebGL). Se
// manca WebGL o l'utente preferisce movimento ridotto, si usa l'atrio 2.5D
// (FoyerFallback), che fa anche da fallback durante il caricamento della scena.
const FoyerSpace = lazy(() => import("@/components/foyer/FoyerSpace"));

export default function Foyer() {
  const reduce = useReducedMotion();
  const [webgl] = useState(webglOK);

  if (!webgl || reduce) return <FoyerFallback />;
  return (
    <Suspense fallback={<FoyerFallback />}>
      <FoyerSpace />
    </Suspense>
  );
}
