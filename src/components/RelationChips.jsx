import { atlasTheme } from "@/lib/atlasTheme";

// Righe di "ponti" cliccabili che collegano una card a tutte le entità
// correlate (temi, autori, periodo, Paese). Sono il cuore della navigazione
// libera e interconnessa: da qualsiasi card si raggiunge qualsiasi altra.
//
// props.groups: [{ label, items: [{ id, label, onClick }] }]

export default function RelationChips({ groups, darkMode }) {
  const t = atlasTheme[darkMode ? "dark" : "light"];
  const visible = (groups || []).filter((g) => g.items && g.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
      {visible.map((group) => (
        <div key={group.label}>
          <div className={`text-[10px] font-semibold ${t.headerText} uppercase tracking-widest mb-1.5`}>
            {group.label}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`px-2.5 py-1 rounded-full text-xs ${t.buttonBg} border ${t.buttonBorder} ${t.periodInactive} ${t.periodHover} ${t.buttonHoverBg} transition-colors`}
                title={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
