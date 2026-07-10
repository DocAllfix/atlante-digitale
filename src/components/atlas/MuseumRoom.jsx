// Layout: "split", "collage", "video", "quotes", "grid", "text"
import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import InfoHotspot from "./InfoHotspot";
import ZoomableImage from "./ZoomableImage";

const easeFluid = [0.4, 0, 0.2, 1];

// Pattern per evitare il clipping del testo: min-h-full + justify-center
// garantisce centratura per testi brevi e scroll naturale per testi lunghi.
function TextColumn({ paragraphs, isActive, className }) {
  return (
    <div className={`flex-1 overflow-y-auto ${className || ""}`}>
      <div className="min-h-full flex flex-col justify-center py-10">
        {paragraphs?.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: easeFluid, delay: 0.4 + i * 0.15 }}
            className={
              i === 0
                ? "text-base sm:text-lg md:text-xl leading-relaxed text-stone-100 font-light mb-6 font-body"
                : "text-sm sm:text-base leading-relaxed text-stone-400 mb-5 font-body"
            }
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
    </div>
  );
}

function SplitLayout({ node, darkMode, isActive }) {
  return (
    <div className="relative h-full w-full flex flex-col md:flex-row">
      {/* Testo */}
      <div className="md:w-[54%] flex pl-14 md:pl-20 pr-8 md:pr-12 pt-20 pb-10">
        <TextColumn paragraphs={node.paragraphs} isActive={isActive} />
      </div>
      {/* Immagine */}
      <div className="md:w-[46%] relative flex items-stretch pr-8 md:pr-12 pl-2 min-h-[30vh] md:min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.1, ease: easeFluid, delay: 0.2 }}
          className="w-full h-full shadow-2xl overflow-hidden"
        >
          <ZoomableImage
            src={node.image}
            alt={node.caption || node.heading}
            className="w-full h-full min-h-[30vh] md:min-h-0"
            imgClassName="w-full h-full object-cover"
          />
        </motion.div>
        {node.hotspots?.length > 0 && (
          <div className="absolute top-24 right-10 md:right-14 z-40 flex flex-col gap-1.5">
            {node.hotspots.map((h) => (
              <InfoHotspot key={h.id} hotspot={h} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuotesLayout({ node, darkMode, isActive }) {
  return (
    <div className="relative h-full w-full flex flex-col md:flex-row">
      {/* Immagine */}
      <div className="md:w-[38%] relative h-[30vh] md:h-auto flex-shrink-0 ml-auto pr-8 md:pr-12 pl-8 md:pl-10">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: easeFluid, delay: 0.2 }}
          className="w-full h-full overflow-hidden"
        >
          <ZoomableImage
            src={node.sideImage}
            alt={node.heading}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        </motion.div>
        {node.hotspots?.length > 0 && (
          <div className="absolute top-24 right-10 md:right-14 z-40 flex flex-col gap-1.5">
            {node.hotspots.map((h) => (
              <InfoHotspot key={h.id} hotspot={h} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
      {/* Citazioni */}
      <div className="md:w-[62%] flex pl-14 md:pl-20 pr-8 md:pr-12 pt-20 pb-10">
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col justify-center">
            <div className="space-y-7">
              {node.quotes?.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.8, ease: easeFluid, delay: 0.45 + i * 0.18 }}
                  className="border-l-2 border-amber-400/30 pl-5"
                >
                  <p className="text-base sm:text-lg leading-relaxed text-stone-200 font-light font-body">"{q.text}"</p>
                  {q.source && (
                    <p className="text-xs text-stone-500 mt-2 uppercase tracking-wider">{q.source}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollageLayout({ node, darkMode, isActive }) {
  const [lightbox, setLightbox] = useState(null);
  const images = node.images || (node.image ? [node.image] : []);
  const positions = [
    { top: "8%", left: "14%", w: "62%", h: "56%", rotate: 0, z: 20, delay: 0.3 },
    { top: "34%", left: "42%", w: "52%", h: "46%", rotate: 0, z: 30, delay: 0.5 },
    { top: "54%", left: "18%", w: "44%", h: "36%", rotate: 0, z: 25, delay: 0.7 },
  ];
  return (
    <div className="relative h-full w-full flex flex-col md:flex-row">
      {/* Testo */}
      <div className="md:w-[46%] flex pl-14 md:pl-20 pr-8 md:pr-12 pt-20 pb-10 z-40">
        <TextColumn paragraphs={node.paragraphs} isActive={isActive} />
      </div>
      {/* Foto sovrapposte */}
      <div className="md:w-[54%] relative h-[35vh] md:h-auto flex-shrink-0 pr-8 md:pr-12 pl-2">
        {images.slice(0, 3).map((img, i) => {
          const pos = positions[i] || positions[0];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 60, rotate: pos.rotate * 2 }}
              animate={isActive ? { opacity: 1, scale: 1, y: 0, rotate: pos.rotate } : { opacity: 0, scale: 0.8, y: 60, rotate: pos.rotate * 2 }}
              transition={{ duration: 1, ease: easeFluid, delay: pos.delay }}
              className="absolute overflow-hidden shadow-2xl ring-1 ring-black/30 cursor-zoom-in group"
              style={{ top: pos.top, left: pos.left, width: pos.w, height: pos.h, zIndex: pos.z }}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <div className="relative w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
              <ZoomableImage
                src={lightbox}
                alt=""
                className="w-full max-h-[80vh]"
                imgClassName="w-full max-h-[80vh] object-contain"
              />
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black/80 transition-all"
              aria-label="Chiudi immagine a schermo intero"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoLayout({ node, darkMode, isActive }) {
  return (
    <div className="relative h-full w-full flex flex-col md:flex-row">
      {/* Testo */}
      <div className="md:w-[42%] flex pl-14 md:pl-20 pr-8 md:pr-12 pt-20 pb-10 z-40">
        <TextColumn paragraphs={node.paragraphs} isActive={isActive} />
      </div>
      {/* Video */}
      <div className="md:w-[58%] relative flex items-center justify-center pr-8 md:pr-12 pl-2 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.1, ease: easeFluid, delay: 0.2 }}
          className="w-full shadow-2xl overflow-hidden"
        >
          <video
            src={node.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-h-[68vh] object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}

function GridLayout({ node, darkMode, isActive }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <div className="relative h-full w-full pt-20 pb-10 pl-14 md:pl-20 pr-8 md:pr-12">
      <div className="grid h-full grid-cols-3 sm:grid-cols-4 auto-rows-fr gap-0.5">
        {node.images?.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.8, ease: easeFluid, delay: 0.3 + i * 0.08 }}
            className="overflow-hidden cursor-zoom-in group relative"
            onClick={() => setLightbox(typeof img === "string" ? img : img.url)}
          >
            <img
              src={typeof img === "string" ? img : img.url}
              alt={typeof img === "string" ? "" : img.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <div className="relative w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
              <ZoomableImage
                src={lightbox}
                alt=""
                className="w-full max-h-[80vh]"
                imgClassName="w-full max-h-[80vh] object-contain"
              />
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black/80 transition-all"
              aria-label="Chiudi immagine a schermo intero"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TextLayout({ node, darkMode, isActive }) {
  return (
    <div className="relative h-full w-full flex pl-14 md:pl-20 pr-10 md:pr-16 pt-20 pb-10">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center max-w-3xl mx-auto">
          {node.paragraphs?.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.9, ease: easeFluid, delay: 0.3 + i * 0.15 }}
              className={
                i === 0
                  ? "text-lg sm:text-xl md:text-2xl leading-relaxed text-stone-100 font-light mb-8 font-body"
                  : "text-base sm:text-lg leading-relaxed text-stone-400 mb-6 font-body"
              }
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const MuseumRoom = forwardRef(function MuseumRoom({ node, darkMode, isActive }, ref) {
  const layoutMap = {
    "split": SplitLayout,
    "collage": CollageLayout,
    "video": VideoLayout,
    "quotes": QuotesLayout,
    "grid": GridLayout,
    "text": TextLayout,
  };
  const LayoutComponent = layoutMap[node.layout] || SplitLayout;

  return (
    <section
      ref={ref}
      data-idx={node.id}
      style={{ flex: "0 0 100%", backgroundColor: "#050508" }}
      className="relative h-full w-full overflow-y-auto"
    >
      <LayoutComponent node={node} darkMode={darkMode} isActive={isActive} />
    </section>
  );
});

export default MuseumRoom;