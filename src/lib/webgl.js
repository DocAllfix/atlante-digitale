// WebGL disponibile? Test una tantum per l'intera sessione (memoizzato): ogni
// getContext("webgl") alloca un vero contesto WebGL, e il browser ne ammette
// solo un numero limitato in contemporanea (~8-16). Ripetere il test a ogni
// mount di pagina (Foyer, Dispositivo, Atlante/GlobeIntro) senza rilasciarlo
// esauriva quel limite dopo poche navigazioni, rompendo il rendering finché
// non si ricaricava la pagina. Qui si testa una volta sola e si rilascia
// subito il contesto di prova (WEBGL_lose_context).
let cached = null;

export function webglOK() {
  if (cached !== null) return cached;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    cached = !!(window.WebGLRenderingContext && gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return cached;
  } catch {
    cached = false;
    return cached;
  }
}
