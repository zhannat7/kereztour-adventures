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

const images = [
  { src: img1, alt: "Kirgisistan Landschaft" },
  { src: img2, alt: "Kirgisistan Berge" },
  { src: img3, alt: "Kirgisistan Natur" },
  { src: img4, alt: "Kirgisistan Kultur" },
  { src: img5, alt: "Kirgisistan Reise" },
  { src: img6, alt: "Kirgisistan Abenteuer" },
  { src: img7, alt: "Kirgisistan Begegnungen" },
  { src: img8, alt: "Kirgisistan Erlebnis" },
  { src: img9, alt: "Kirgisistan Tradition" },
  { src: img10, alt: "Kirgisistan Pferde" },
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
