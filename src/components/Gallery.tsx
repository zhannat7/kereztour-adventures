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

const images = [
  { src: img1, alt: "Kirgisistan Landschaft" },
  { src: img2, alt: "Kirgisistan Berge" },
  { src: img11, alt: "Kirgisistan Panorama" },
  { src: img3, alt: "Kirgisistan Natur" },
  { src: img21, alt: "Kirgisistan Hochebene" },
  { src: img4, alt: "Kirgisistan Kultur" },
  { src: img31, alt: "Kirgisistan Wasser" },
  { src: img41, alt: "Kirgisistan Felsen" },
  { src: img12, alt: "Kirgisistan Dorf" },
  { src: img22, alt: "Kirgisistan Fluss" },
  { src: img5, alt: "Kirgisistan Reise" },
  { src: img32, alt: "Kirgisistan Bergpfad" },
  { src: img42, alt: "Kirgisistan Grünland" },
  { src: img6, alt: "Kirgisistan Abenteuer" },
  { src: img23, alt: "Kirgisistan Aussicht" },
  { src: img33, alt: "Kirgisistan Almen" },
  { src: img43, alt: "Kirgisistan Wald" },
  { src: img13, alt: "Kirgisistan Gebirge" },
  { src: img7, alt: "Kirgisistan Begegnungen" },
  { src: img34, alt: "Kirgisistan Hochland" },
  { src: img44, alt: "Kirgisistan Wolken" },
  { src: img24, alt: "Kirgisistan Steppe" },
  { src: img14, alt: "Kirgisistan Weite" },
  { src: img35, alt: "Kirgisistan Lager" },
  { src: img45, alt: "Kirgisistan Pfade" },
  { src: img8, alt: "Kirgisistan Erlebnis" },
  { src: img25, alt: "Kirgisistan Nomaden" },
  { src: img36, alt: "Kirgisistan Schlucht" },
  { src: img46, alt: "Kirgisistan Landweg" },
  { src: img15, alt: "Kirgisistan Wanderung" },
  { src: img9, alt: "Kirgisistan Tradition" },
  { src: img37, alt: "Kirgisistan Wiesen" },
  { src: img47, alt: "Kirgisistan Aussichtspunkt" },
  { src: img26, alt: "Kirgisistan Markt" },
  { src: img16, alt: "Kirgisistan See" },
  { src: img38, alt: "Kirgisistan Sonnenaufgang" },
  { src: img48, alt: "Kirgisistan Morgenrot" },
  { src: img10, alt: "Kirgisistan Pferde" },
  { src: img27, alt: "Kirgisistan Gipfel" },
  { src: img39, alt: "Kirgisistan Gletscher" },
  { src: img17, alt: "Kirgisistan Jurten" },
  { src: img28, alt: "Kirgisistan Abend" },
  { src: img40, alt: "Kirgisistan Weide" },
  { src: img18, alt: "Kirgisistan Sonnenuntergang" },
  { src: img29, alt: "Kirgisistan Wildnis" },
  { src: img19, alt: "Kirgisistan Tal" },
  { src: img30, alt: "Kirgisistan Freiheit" },
  { src: img20, alt: "Kirgisistan Horizont" },
];

/* ── Lightbox with Thumbnail Strip ── */
const Lightbox = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) => {
  const thumbRef = useRef<HTMLDivElement>(null);

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

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbRef.current;
    if (!container) return;
    const active = container.children[index] as HTMLElement;
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [index]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2.5 text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full px-10 md:px-16 pb-2" onClick={(e) => e.stopPropagation()}>
        <img
          key={index}
          src={images[index].src}
          alt={images[index].alt}
          className="max-h-[82vh] max-w-[90vw] object-contain animate-fade-in"
        />
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2.5 text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Counter */}
      <span className="text-white/60 text-sm mb-2">
        {index + 1} von {images.length}
      </span>

      {/* Thumbnail Strip */}
      <div
        ref={thumbRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex gap-1.5 overflow-x-auto px-4 pb-4 pt-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded overflow-hidden transition-all duration-200 ${
              i === index
                ? "ring-2 ring-white opacity-100 scale-105"
                : "opacity-40 hover:opacity-70"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Gallery ── */
const VISIBLE_COUNT = 20;

const Gallery = () => {
  const ref = useScrollReveal();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(
    () => setLightboxIdx((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    []
  );
  const next = useCallback(
    () => setLightboxIdx((i) => (i !== null ? (i + 1) % images.length : null)),
    []
  );

  const visibleImages = images.slice(0, VISIBLE_COUNT);

  return (
    <>
      <section id="galerie" className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div ref={ref} className="section-reveal container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
              Fotos unserer zufriedenen Kunden
            </h2>
            <p className="mt-3 text-primary font-medium tracking-wide">
              #kereztour
            </p>
          </div>

          {/* Compact Mosaic Grid — 20 images */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-[2px]">
            {visibleImages.map((img, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="aspect-square overflow-hidden rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
          onSelect={openLightbox}
        />
      )}
    </>
  );
};

export default Gallery;
