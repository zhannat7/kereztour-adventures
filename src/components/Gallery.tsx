import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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

const INITIAL_COUNT = 12;

const Gallery = () => {
  const ref = useScrollReveal();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? images : images.slice(0, INITIAL_COUNT);

  return (
    <section id="galerie" className="py-24 md:py-32 bg-background relative">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Impressionen
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Einblicke aus <span className="italic text-primary">Kirgisistan</span>
          </h2>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {visible.map((img, i) => (
            <div
              key={i}
              className="stagger-child break-inside-avoid overflow-hidden rounded-2xl group"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {!showAll && images.length > INITIAL_COUNT && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-foreground font-medium hover:bg-muted transition-all duration-300"
            >
              Alle {images.length} Fotos anzeigen
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
