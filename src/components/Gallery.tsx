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

const images = [
  { src: img1, alt: "Kirgisistan Landschaft" },
  { src: img2, alt: "Kirgisistan Berge" },
  { src: img11, alt: "Kirgisistan Panorama" },
  { src: img3, alt: "Kirgisistan Natur" },
  { src: img4, alt: "Kirgisistan Kultur" },
  { src: img12, alt: "Kirgisistan Dorf" },
  { src: img5, alt: "Kirgisistan Reise" },
  { src: img6, alt: "Kirgisistan Abenteuer" },
  { src: img13, alt: "Kirgisistan Gebirge" },
  { src: img7, alt: "Kirgisistan Begegnungen" },
  { src: img14, alt: "Kirgisistan Weite" },
  { src: img8, alt: "Kirgisistan Erlebnis" },
  { src: img15, alt: "Kirgisistan Wanderung" },
  { src: img9, alt: "Kirgisistan Tradition" },
  { src: img16, alt: "Kirgisistan See" },
  { src: img10, alt: "Kirgisistan Pferde" },
  { src: img17, alt: "Kirgisistan Jurten" },
  { src: img18, alt: "Kirgisistan Sonnenuntergang" },
  { src: img19, alt: "Kirgisistan Tal" },
  { src: img20, alt: "Kirgisistan Horizont" },
];

const Gallery = () => {
  const ref = useScrollReveal();

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
          {images.map((img, i) => (
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
      </div>
    </section>
  );
};

export default Gallery;
