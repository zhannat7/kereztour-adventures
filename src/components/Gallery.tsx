import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
  img31, img32, img33, img34, img35, img36, img37, img38, img39, img40,
  img41, img42, img43, img44, img45, img46, img47, img48,
];

const SLIDE_DURATION = 6000;

// Alternate between different Ken Burns transform origins for variety
const kenBurnsVariants = [
  { from: "scale(1) translate(0, 0)", to: "scale(1.12) translate(-2%, -1%)" },
  { from: "scale(1.08) translate(-2%, 0)", to: "scale(1) translate(0, 0)" },
  { from: "scale(1) translate(0, 0)", to: "scale(1.1) translate(1%, -2%)" },
  { from: "scale(1.1) translate(1%, 1%)", to: "scale(1) translate(0, 0)" },
  { from: "scale(1) translate(0, 0)", to: "scale(1.12) translate(-1%, 2%)" },
];

const Gallery = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimers = useCallback(() => {
    // Clear existing
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);
    const progressStep = 100 / (SLIDE_DURATION / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + progressStep, 100));
    }, 50);

    intervalRef.current = setInterval(() => {
      goNext();
    }, SLIDE_DURATION);
  }, []);

  const goNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % images.length);
      setIsTransitioning(false);
      setProgress(0);
    }, 800);
  }, []);

  const goPrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c - 1 + images.length) % images.length);
      setIsTransitioning(false);
      setProgress(0);
    }, 800);
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
      setProgress(0);
    }, 800);
  }, [current]);

  useEffect(() => {
    startTimers();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, startTimers]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Show subset of progress indicators (max 12 for cleanliness)
  const maxDots = 12;
  const step = Math.max(1, Math.floor(images.length / maxDots));
  const dotIndices = Array.from({ length: Math.min(maxDots, images.length) }, (_, i) => i * step);

  const variant = kenBurnsVariants[current % kenBurnsVariants.length];

  return (
    <section
      id="galerie"
      className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-foreground"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bars at top */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-4 py-3 md:px-8 md:py-4">
        {dotIndices.map((dotIdx, i) => {
          const isCurrent = current >= dotIdx && (i === dotIndices.length - 1 || current < dotIndices[i + 1]);
          const isPast = !isCurrent && dotIdx < current;
          return (
            <button
              key={dotIdx}
              onClick={() => goTo(dotIdx)}
              className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20 cursor-pointer transition-all hover:bg-white/30"
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: isPast ? "100%" : isCurrent ? `${progress}%` : "0%",
                  backgroundColor: "rgba(255,255,255,0.85)",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Ken Burns slide */}
      <div
        className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${images[current]})`,
            animation: `kenburns-${current % kenBurnsVariants.length} ${SLIDE_DURATION}ms ease-out forwards`,
          }}
        />
      </div>

      {/* Dark gradient overlay from bottom */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-12 md:px-16 md:pb-20">
        <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-secondary mb-3">
          Kirgisistan 2025
        </span>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 max-w-2xl">
          Erlebe die Schönheit <span className="italic">Kirgisistans</span>
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-lg mb-6">
          48 Impressionen von unvergesslichen Reisen durch Berge, Steppen und Nomadenkultur.
        </p>
        <a
          href="#reiseplan"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300"
        >
          Touren entdecken
        </a>
      </div>

      {/* Arrow navigation */}
      <button
        onClick={goPrev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Nächstes Bild"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Ken Burns keyframes */}
      <style>{`
        @keyframes kenburns-0 {
          from { transform: ${variant.from}; }
          to { transform: ${variant.to}; }
        }
        @keyframes kenburns-1 {
          from { transform: ${kenBurnsVariants[1].from}; }
          to { transform: ${kenBurnsVariants[1].to}; }
        }
        @keyframes kenburns-2 {
          from { transform: ${kenBurnsVariants[2].from}; }
          to { transform: ${kenBurnsVariants[2].to}; }
        }
        @keyframes kenburns-3 {
          from { transform: ${kenBurnsVariants[3].from}; }
          to { transform: ${kenBurnsVariants[3].to}; }
        }
        @keyframes kenburns-4 {
          from { transform: ${kenBurnsVariants[4].from}; }
          to { transform: ${kenBurnsVariants[4].to}; }
        }
      `}</style>
    </section>
  );
};

export default Gallery;
