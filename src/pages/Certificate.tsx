import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Certificate = () => (
  <main className="min-h-screen overflow-x-hidden bg-background">
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-28">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary md:mb-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Kereztour
      </Link>

      <div className="mb-8 md:mb-10">
        <span className="eyebrow mb-4 block">Registrierung</span>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-7xl">
          Offizieller Registrierungsnachweis
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Kereztour wird von einem in Kirgisistan registrierten Einzelunternehmen
          mit der Tätigkeit „Tour operator activities“ geführt.
        </p>
      </div>

      <div className="border-y border-border bg-card p-4 sm:p-6 md:p-10">
        <div className="flex items-start gap-3 border-b border-border pb-6 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary-soft text-primary sm:h-11 sm:w-11">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl leading-snug text-foreground sm:text-2xl">
              Certificate of State Registration of an Individual Entrepreneur
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              State Tax Service of the Kyrgyz Republic
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Full Name</dt>
            <dd className="mt-1 text-sm text-foreground">Mambetalieva Ainagul Zaidovna</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Legal Form</dt>
            <dd className="mt-1 text-sm text-foreground">Individual Entrepreneur</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Registration Number</dt>
            <dd className="mt-1 break-words text-sm text-foreground">002-2024-169-3446</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Registration Date</dt>
            <dd className="mt-1 text-sm text-foreground">22 April 2024</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Economic Activity</dt>
            <dd className="mt-1 text-sm text-foreground">79.12.0 – Tour operator activities</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          <a
            href="/Certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Originalzertifikat ansehen
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Zurück zur Website
          </Link>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Vorschau des Zertifikats
          </p>

          <div className="md:hidden border border-border bg-muted/30 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Die PDF-Vorschau wird auf Smartphones nicht eingebettet, damit das Zertifikat vollständig und ohne abgeschnittene Darstellung angezeigt wird.
            </p>
            <a
              href="/Certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Zertifikat öffnen
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="hidden overflow-hidden border border-border shadow-soft md:block">
            <iframe
              src="/Certificate.pdf"
              title="Certificate of State Registration – Kereztour"
              className="h-[80vh] min-h-[500px] w-full bg-muted"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default Certificate;
