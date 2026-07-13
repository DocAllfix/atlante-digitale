import { useScroll } from "framer-motion";

// Progress 0..1 della sezione-corridoio (IntroScrollController): guida i piani.
export function useIntroScroll(ref) {
  return useScroll({ target: ref, offset: ["start start", "end end"] });
}
