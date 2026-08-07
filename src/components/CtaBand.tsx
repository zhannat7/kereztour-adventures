import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CtaBand = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-primary px-8 py-12 md:px-14 md:py-16 shadow-lift">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight text-primary-foreground mb-4">
                Erzähl mir, wovon du träumst
                <span className="block italic">ich plane den Rest.</span>
              </h2>
              <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl">
                Unverbindliche Anfrage, Antwort innerhalb von 24 Stunden, keine Anzahlung.
                Auch bei Fragen zu Terminen, Flügen oder Gruppengrößen.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <Link to="/buchen" className="btn-accent w-full">
                Reise anfragen <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/393474867408"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                <MessageCircle className="h-4 w-4" /> Direkt auf WhatsApp
              </a>
              <a
                href="mailto:sarinasadirovna@gmail.com"
                className="inline-flex items-center justify-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" /> sarinasadirovna@gmail.com
              </a>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
