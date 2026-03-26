const Hero = () => {
  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-center"
      style={{ backgroundColor: "#e8e0d0" }} /* ADD YOUR OWN IMAGE HERE */
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight mb-6 animate-fade-in-up">
          Kereztour Kirgisistan
          <span className="block text-2xl md:text-3xl lg:text-4xl font-medium mt-3 text-forest-deep/80">
            10 Tage unvergessliches Abenteuer
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
          Gruppenreise&nbsp;|&nbsp;Natur, Kultur &amp; Tradition
        </p>
        <a
          href="#preise"
          className="inline-block rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          style={{ animationDelay: "0.4s" }}
        >
          Jetzt buchen
        </a>
      </div>
    </section>
  );
};

export default Hero;
