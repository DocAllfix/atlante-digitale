import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

// Immagine con zoom fluido e pan via drag, senza uscire dalla navigazione.
export default function ZoomableImage({ src, alt, className, imgClassName, children, maxZoom = 2.5 }) {
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const startRef = useRef(null);

  const onPointerDown = (e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    if (zoomed) {
      e.stopPropagation();
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
      dragRef.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
    }
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    e.stopPropagation();
    setPos({
      x: dragRef.current.posX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.posY + (e.clientY - dragRef.current.startY),
    });
  };

  const onPointerUp = (e) => {
    const start = startRef.current;
    const wasDragging = dragRef.current !== null;
    dragRef.current = null;
    startRef.current = null;
    if (!start) return;
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (moved < 6) {
      if (zoomed) {
        setZoomed(false);
        setPos({ x: 0, y: 0 });
      } else {
        setZoomed(true);
      }
    }
    return wasDragging;
  };

  const isDragging = dragRef.current !== null;

  return (
    <div className={`relative overflow-hidden ${className || ""}`} style={{ cursor: zoomed ? "grab" : "zoom-in" }}>
      <motion.img
        src={src}
        alt={alt}
        animate={{ scale: zoomed ? maxZoom : 1, x: zoomed ? pos.x : 0, y: zoomed ? pos.y : 0 }}
        transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 28 }}
        style={{ willChange: "transform" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        draggable={false}
        className={`select-none ${zoomed ? "touch-none" : ""} ${imgClassName || "w-full h-full object-cover"}`}
      />
      {children}
      {zoomed && (
        <button
          onClick={(e) => { e.stopPropagation(); setZoomed(false); setPos({ x: 0, y: 0 }); }}
          className="absolute top-2 left-2 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black/80 transition-all"
          title="Riduci"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {!zoomed && (
        <div className="absolute bottom-2 right-2 z-30 flex items-center justify-center w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-amber-300/80 pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}