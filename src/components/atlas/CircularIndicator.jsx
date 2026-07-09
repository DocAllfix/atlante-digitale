import { atlasTheme } from "@/lib/atlasTheme";

// Indicatore di posizione circolare: i nodi sono disposti su un anello,
// senza inizio, fine o numerazione sequenziale.
export default function CircularIndicator({ nodes, active, onJump, darkMode }) {
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const size = 104;
  const r = 42;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`text-xs ${t.centuryText} font-prompt whitespace-nowrap`}>{nodes[active]?.title}</span>
      <div className="relative" style={{ width: size, height: size }}>
        {/* ring */}
        <div className="absolute inset-[14px] rounded-full border border-amber-400/20" />
        <div className="absolute inset-[14px] rounded-full" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.06), transparent 70%)" }} />
        {nodes.map((node, i) => {
          const angle = (-90 + (i / nodes.length) * 360) * (Math.PI / 180);
          const dot = i === active ? 5 : 3;
          const x = cx + r * Math.cos(angle) - dot;
          const y = cy + r * Math.sin(angle) - dot;
          return (
            <button
              key={node.id}
              onClick={() => onJump(i)}
              title={node.title}
              className={`absolute rounded-full transition-all duration-300 ${i === active ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.85)]" : "bg-amber-400/30 hover:bg-amber-400/60"}`}
              style={{ left: x, top: y, width: dot * 2, height: dot * 2 }}
            />
          );
        })}
      </div>
    </div>
  );
}