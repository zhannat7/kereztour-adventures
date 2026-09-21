import { useScrollReveal } from "@/hooks/useScrollReveal";

const NomadGames = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="eyebrow mb-4 justify-center">Welt der Nomaden 2026</span>
          <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground mb-4">
            Kirgisistan <span className="italic text-primary">in Bewegung</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-[900px] overflow-hidden rounded-[1.75rem] shadow-lift">
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/YBRknUnMIE0?rel=0"
              title="Welt der Nomaden 2026 – Kirgisistan in Bewegung"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-[900px] text-right text-xs text-muted-foreground">
          Video: AKIpress News · YouTube
        </p>
      </div>
    </section>
  );
};

export default NomadGames;
