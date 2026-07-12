import { ROUTE_SCREENS } from "@/components/shell/ribbon/shellScreensConfig";

// Fallback accessibile / reduced-motion: lista dei luoghi, niente 3D.
export default function RibbonFallback({ currentPath, onEnter }) {
  return (
    <div className="w-full max-w-md mx-auto font-outfit">
      <p className="text-[11px] uppercase tracking-[0.4em] text-amber-300/60">Attraversa</p>
      <ul className="mt-4 divide-y divide-white/10">
        {ROUTE_SCREENS.map((s) => (
          <li key={s.to}>
            <button
              onClick={() => onEnter(s.to)}
              data-cursor="link"
              aria-current={s.to === currentPath ? "page" : undefined}
              className="w-full flex items-baseline justify-between gap-4 py-3 text-left"
            >
              <span className={`font-prompt uppercase tracking-[0.08em] text-2xl ${s.to === currentPath ? "text-amber-300" : "text-amber-50/70"}`}>{s.title}</span>
              <span className="text-xs text-amber-100/40">{s.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
