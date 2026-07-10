import { useState, useMemo, useEffect } from "react";
import { Hourglass, ChevronRight, ChevronDown } from "lucide-react";
import { TIME_PERIODS, CENTURIES } from "@/lib/timePeriods";
import { atlasTheme } from "@/lib/atlasTheme";

export default function Timeline({ activePeriod, onPeriodChange, darkMode, isOpen, onToggleOpen }) {
  const [expandedCenturies, setExpandedCenturies] = useState(
    activePeriod?.century ? { [activePeriod.century]: true } : {}
  );
  const t = atlasTheme[darkMode ? "dark" : "light"];

  useEffect(() => {
    if (activePeriod?.century) {
      setExpandedCenturies((prev) => ({ ...prev, [activePeriod.century]: true }));
    }
  }, [activePeriod]);

  const periodsByCentury = useMemo(() => {
    const map = {};
    for (const period of TIME_PERIODS) {
      if (!map[period.century]) map[period.century] = [];
      map[period.century].push(period);
    }
    return map;
  }, []);

  const toggleCentury = (century) => {
    setExpandedCenturies((prev) => ({ ...prev, [century]: !prev[century] }));
  };

  return (
    <>
      <button
        onClick={() => onToggleOpen()}
        className={`absolute top-4 z-[1001] flex items-center justify-center w-12 h-12 rounded-r-lg font-outfit ${t.buttonBg} backdrop-blur-md border border-l-0 ${t.buttonBorder} ${t.buttonText} ${t.buttonHoverText} ${t.buttonHoverBg} transition-all duration-300 shadow-lg ${
          isOpen ? "left-36" : "left-0"
        }`}
        title="Linea Temporale"
        aria-label={isOpen ? "Chiudi la linea temporale" : "Apri la linea temporale"}
        aria-expanded={isOpen}
      >
        <Hourglass className="w-7 h-7" />
      </button>

      <div
        className={`absolute top-0 left-0 z-[1000] h-full w-36 font-outfit ${t.sidebarBg} backdrop-blur-md border-r ${t.sidebarBorder} flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`px-4 py-4 border-b ${t.sidebarBorder}`}>
          <h2 className={`text-xs font-semibold ${t.headerText} uppercase tracking-widest`}>
            Linea Temporale
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {CENTURIES.map((century) => {
            const isExpanded = expandedCenturies[century];
            const periods = periodsByCentury[century] || [];
            return (
              <div key={century} className={`border-b ${t.sidebarSubBorder}`}>
                <button
                  onClick={() => toggleCentury(century)}
                  className="flex items-center w-full px-4 py-2.5 text-left group"
                  aria-expanded={isExpanded}
                  aria-label={`Secolo ${century}`}
                >
                  {isExpanded ? (
                    <ChevronDown className={`w-3.5 h-3.5 ${t.chevron} mr-2 flex-shrink-0`} />
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 ${t.chevron} mr-2 flex-shrink-0`} />
                  )}
                  <span className={`text-sm font-semibold ${t.centuryText} ${t.centuryHover}`}>
                    {century}
                  </span>
                </button>
                {isExpanded && (
                  <div className="pl-8 pr-3 pb-2">
                    {periods.map((period) => {
                      const isActive = activePeriod?.id === period.id;
                      return (
                        <button
                          key={period.id}
                          onClick={() => onPeriodChange(period)}
                          className="flex items-center w-full py-1.5 group"
                          aria-current={isActive ? "true" : undefined}
                          aria-label={`Periodo ${period.label}`}
                        >
                          <span
                            className={`text-sm transition-colors ${
                              isActive
                                ? `font-semibold ${t.periodActive}`
                                : `${t.periodInactive} ${t.periodHover}`
                            }`}
                          >
                            {period.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}