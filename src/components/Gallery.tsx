import { useState, useCallback, useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@/assets/gallery/IMG_2518.jpg";
import img2 from "@/assets/gallery/IMG_2646.jpg";
import img3 from "@/assets/gallery/IMG_2677.jpg";
import img4 from "@/assets/gallery/IMG_2689.jpg";
import img5 from "@/assets/gallery/IMG_2697.jpg";
import img6 from "@/assets/gallery/IMG_2769.jpg";
import img7 from "@/assets/gallery/IMG_2793.jpg";
import img8 from "@/assets/gallery/IMG_3007.jpg";
import img9 from "@/assets/gallery/IMG_3070.jpg";
import img10 from "@/assets/gallery/IMG_3092.jpg";
import img11 from "@/assets/gallery/IMG_3181.jpg";
import img12 from "@/assets/gallery/IMG_3191.jpg";
import img13 from "@/assets/gallery/IMG_3202.jpg";
import img14 from "@/assets/gallery/IMG_3243.jpg";
import img15 from "@/assets/gallery/IMG_3267.jpg";
import img16 from "@/assets/gallery/IMG_3283.jpg";
import img17 from "@/assets/gallery/IMG_3299.jpg";
import img18 from "@/assets/gallery/IMG_3310.jpg";
import img19 from "@/assets/gallery/IMG_3369.jpg";
import img20 from "@/assets/gallery/IMG_3432.jpg";
import img21 from "@/assets/gallery/IMG_3466.jpg";
import img22 from "@/assets/gallery/IMG_3541.jpg";
import img23 from "@/assets/gallery/IMG_3600.jpg";
import img24 from "@/assets/gallery/IMG_3858.jpg";
import img25 from "@/assets/gallery/IMG_3925.jpg";
import img26 from "@/assets/gallery/IMG_3952.jpg";
import img27 from "@/assets/gallery/IMG_4561.jpg";
import img28 from "@/assets/gallery/IMG_4663.jpg";
import img29 from "@/assets/gallery/IMG_4672.jpg";
import img30 from "@/assets/gallery/IMG_4725.jpg";
import img31 from "@/assets/gallery/IMG_4736.jpg";
import img32 from "@/assets/gallery/IMG_4747.jpg";
import img33 from "@/assets/gallery/IMG_4748.jpg";
import img34 from "@/assets/gallery/IMG_4773.jpg";
import img35 from "@/assets/gallery/IMG_4817.jpg";
import img36 from "@/assets/gallery/IMG_4822.jpg";
import img37 from "@/assets/gallery/IMG_4831.jpg";
import img38 from "@/assets/gallery/IMG_4846.jpg";
import img39 from "@/assets/gallery/IMG_4851.jpg";
import img40 from "@/assets/gallery/IMG_4858.jpg";
import img41 from "@/assets/gallery/IMG_4871.jpg";
import img42 from "@/assets/gallery/IMG_4919.jpg";
import img43 from "@/assets/gallery/IMG_4920.jpg";
import img44 from "@/assets/gallery/IMG_4930.jpg";
import img45 from "@/assets/gallery/IMG_4933.jpg";
import img46 from "@/assets/gallery/IMG_4992.jpg";
import img47 from "@/assets/gallery/IMG_5006.jpg";
import img48 from "@/assets/gallery/IMG_5010.jpg";
import img49 from "@/assets/gallery/10.png";
import img50 from "@/assets/gallery/11.png";
import img51 from "@/assets/gallery/12.png";
import img52 from "@/assets/gallery/13.png";
import img53 from "@/assets/gallery/14.png";
import img54 from "@/assets/gallery/21.png";
import img55 from "@/assets/gallery/22.png";
import img56 from "@/assets/gallery/31.png";
import img57 from "@/assets/gallery/32.png";
import img58 from "@/assets/gallery/41.png";
import img59 from "@/assets/gallery/42.png";
import img60 from "@/assets/gallery/51.png";
import img61 from "@/assets/gallery/81.png";
import img62 from "@/assets/gallery/82.png";
import img63 from "@/assets/gallery/91.png";

const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
  img31, img32, img33, img34, img35, img36, img37, img38, img39, img40,
  img41, img42, img43, img44, img45, img46, img47, img48, img49, img50,
  img51, img52, img53, img54, img55, img56, img57, img58, img59, img60,
  img61, img62, img63,
].map((src, i) => ({ src, alt: `Kirgisistan ${i + 1}` }));

const VISIBLE = 56; // 2 Zeilen × 12

/* ── Lightbox ── */
const Lightbox = ({ images, index, onClose, onPrev, onNext }: {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      <div
  className="fixed inset-0 z-[100] bg-black/95"
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-white/70 text-sm">
        {index + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Hauptbild – immer vorne */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-16 pb-24">
        <img
          src={images[index].src}
          alt={images[index].alt}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (!touchStartX.current) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
              if (diff > 0) onNext();
              else onPrev();
            } else {
              onNext();
            }
            touchStartX.current = null;
          }}
        />
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Thumbnails – ganz unten, unter dem Hauptbild */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex gap-1.5 overflow-x-auto px-4 py-3 bg-black/30"
        style={{ scrollbarWidth: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {}}
            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
              i === index ? "ring-2 ring-white opacity-100 scale-110" : "opacity-50 hover:opacity-80"
            }`}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};
/* ── Gallery ── */
const Gallery = () => {
  const ref = useScrollReveal();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx((i) => i !== null ? (i - 1 + images.length) % images.length : null), []);
  const next = useCallback(() => setLightboxIdx((i) => i !== null ? (i + 1) % images.length : null), []);

  return (
    <>
      <section id="galerie" className="py-14 md:py-20 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-7xl">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-3 block">
              Echte Reisefotos
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Eindrücke aus <span className="italic text-primary">Kirgisistan</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Fotos unserer Reisegäste – authentisch und unvergesslich. Klicke auf ein Bild um alle {images.length} Fotos zu sehen.
            </p>
          </div>

          {/* Grid – nur 24 sichtbar */}
         <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(14, 1fr)" }}>
            {images.slice(0, VISIBLE).map((img, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="group relative aspect-square overflow-hidden focus:outline-none"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {images.length} Reisefotos aus Kirgisistan 2025 · Klick auf ein Bild für die Vollansicht
            </p>
          </div>
        </div>
      </section>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
};

export default Gallery;
