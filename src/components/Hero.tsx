import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import karakolMosque from "@/assets/gallery/IMG_3432.jpg";

const heroImages = [
  {
    src: "/hero-wide.jpg",
    alt: "Berglandschaft im Tian Shan mit drei Jurten in Kirgisistan",
  },
  {
    src: "/tour-kultur.jpg",
    alt: "Kulturreise in Kirgisistan",
  },
  {
    src: karakolMosque,
    alt: "Blau-bunte Holzmoschee in Karakol, Kirgisistan",
  },
];

const Hero = () => {
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("kereztour-hero-image", { detail: activeImage }));
  }, [activeImage]);

  useEffect(() => {
    heroImages.forEach((image) => {
      const preload = new Image();
      preload.src = image.src;
      preload.decoding = "async";
      preload.decode?.().catch(() => undefined);
    });

    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex h-[72svh] min-h-[560px] w-full items-center overflow-hidden bg-background sm:h-[78svh] sm:min-h-[620px] lg:h-[86vh] lg:max-h-[880px]">
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className="absolute inset-0 transform-gpu transition-opacity duration-[6000ms] ease-in-out [backface-visibility:hidden]"
            style={{
              opacity: activeImage === index ? 1 : 0,
              transform: "translate3d(0, 0, 0)",
              willChange: "opacity",
            }}
            aria-hidden={activeImage !== index}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 h-full w-full transform-gpu object-cover [backface-visibility:hidden] transition-transform duration-[8000ms] ease-out"
              style={{
                objectPosition: "center center",
                transform: "translate3d(0, 0, 0)",
              }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-veil" />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>

      <div className="relative z-10 flex h-full w-full items-start">
        <div className="w-full px-4 pt-[116px] sm:px-10 sm:pt-[110px] lg:px-16 lg:pt-[calc(23vh-68px)] xl:px-24">
          <div className="mx-auto max-w-[620px] text-center lg:max-w-[980px]">
            <h1 className="mb-8 animate-slide-up font-display text-[40px] font-normal leading-[1.02] text-primary-foreground drop-shadow-lg sm:text-[62px] md:text-[76px] lg:mb-10 lg:text-[clamp(76px,6.8vw,106px)]">
              <span className="block">{t("Kirgisistan")}</span>
              <span
                className="mt-3 block text-gold sm:mt-4 lg:whitespace-nowrap"
                style={{
                  color: activeImage === 1 ? "hsl(var(--gold))" : undefined,
                  WebkitTextStroke: activeImage === 1 ? "1px rgba(35, 22, 14, 0.78)" : "0 transparent",
                  textShadow: activeImage === 1 ? "0 1px 2px rgba(35, 22, 14, 0.22)" : undefined,
                }}
              >
                {t("Authentisch erleben")}
              </span>
            </h1>

            <div className="mb-9 flex animate-fade-in items-center justify-center gap-5 px-2 sm:mb-11 lg:mb-12">
              <span className="hidden h-px w-16 bg-gold sm:block" aria-hidden="true" />
              <p className="text-[12px] font-semibold uppercase leading-relaxed tracking-[0.25em] text-primary-foreground/90 sm:text-[14px] lg:text-[19px]">
                {t("Kleine Gruppenreisen ins Herz Zentralasiens")}
              </p>
              <span className="hidden h-px w-16 bg-gold sm:block" aria-hidden="true" />
            </div>

            <div
              className="relative top-[76px] flex animate-fade-in-up flex-col items-center justify-center gap-5 sm:top-[-12px] sm:flex-row sm:items-stretch sm:gap-6"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                to="/buchen"
                className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-sm border border-gold bg-transparent px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-none backdrop-blur-0 transition-all duration-500 hover:-translate-y-0.5 hover:bg-gold/20 hover:shadow-glow sm:min-h-13 sm:px-8 sm:py-3.5 sm:text-[14px]"
              >
                <span className="absolute inset-0 translate-y-full bg-gold/25 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
                  {t("Beginne Deine Reise")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-4.5 sm:w-4.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 w-full -translate-x-1/2 px-4 sm:bottom-8">
        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-medium tracking-wide text-primary-foreground/90 sm:gap-2 sm:text-sm">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span>5,0 / 5,0</span>
          <span className="text-primary-foreground/50">·</span>
          <span>{t("Kleine Gruppen")}</span>
          <span className="text-primary-foreground/50">·</span>
          <span>{t("Lokale Gastgeber")}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
