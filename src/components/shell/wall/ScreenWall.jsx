import { useState } from "react";
import { useSound } from "@/audio/SoundProvider";
import { ROUTE_SCREENS } from "@/components/shell/ribbon/shellScreensConfig";
import AmbientMonitor from "@/components/shell/wall/AmbientMonitor";
import RouteMonitor from "@/components/shell/wall/RouteMonitor";
import PowerSwitch from "@/components/shell/wall/PowerSwitch";

// La parete di monitor: griglia 10×6 in cui 6 celle sono le pagine (da
// ROUTE_SCREENS), collocate in posizioni sparse deterministiche; il resto sono
// schermi ambientali. All'apertura è tutta SPENTA; l'interruttore power accende
// a onda l'intera parete e rende le celle-pagina cliccabili.
const COLS = 10;
const ROWS = 6;
const TOTAL = COLS * ROWS; // 60

// Indici sparsi (riga·10 + colonna) — una posizione per ciascuna pagina.
const ROUTE_CELLS = [8, 13, 26, 31, 44, 57];
const routeAt = new Map(ROUTE_CELLS.map((cell, k) => [cell, ROUTE_SCREENS[k]]).filter(([, s]) => s));

export default function ScreenWall({ currentPath, onEnter }) {
  const { playCue } = useSound();
  const [powered, setPowered] = useState(false);

  const power = () => {
    if (powered) return;
    playCue("open");
    setPowered(true);
  };

  return (
    <div className="absolute inset-0 p-2">
      <div
        className="grid gap-2 w-full h-full"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {Array.from({ length: TOTAL }, (_, i) => {
          const bootDelay = (i / (TOTAL - 1)) * 700;
          const screen = routeAt.get(i);
          return screen ? (
            <RouteMonitor
              key={i}
              screen={screen}
              powered={powered}
              bootDelay={bootDelay}
              active={screen.to === currentPath}
              onEnter={onEnter}
            />
          ) : (
            <AmbientMonitor key={i} i={i} powered={powered} bootDelay={bootDelay} />
          );
        })}
      </div>
      <PowerSwitch on={powered} onPower={power} />
    </div>
  );
}
