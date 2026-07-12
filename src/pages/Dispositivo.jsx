import { lazy, Suspense, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { webglOK } from "@/lib/webgl";
import DispositivoFallback from "@/components/dispositivi/DispositivoFallback";

// La pagina Dispositivi è una "spiral drift" 3D esplorabile (DispositivoSpace,
// lazy → chunk WebGL). Se manca WebGL o si preferisce movimento ridotto, si usa
// la parete cronologica 2.5D (DispositivoFallback), che fa anche da fallback in
// caricamento.
const DispositivoSpace = lazy(() => import("@/components/dispositivi/DispositivoSpace"));

export default function Dispositivo() {
  const reduce = useReducedMotion();
  const [webgl] = useState(webglOK);

  if (!webgl || reduce) return <DispositivoFallback />;
  return (
    <Suspense fallback={<DispositivoFallback />}>
      <DispositivoSpace />
    </Suspense>
  );
}
