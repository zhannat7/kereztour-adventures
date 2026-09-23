import { FileCheck2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Registration = () => (
  <section className="border-y border-border bg-muted/40 py-12 md:py-16">
    <div className="container mx-auto max-w-[1600px] px-6">
      <div className="flex flex-col items-start gap-8 border-y border-border bg-card px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
        <div className="flex items-start gap-5">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary-soft text-primary">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Offiziell registrierter Reiseveranstalter
            </p>
            <h2 className="mt-2 font-display text-2xl text-foreground md:text-3xl">
              Reiseveranstalter in Kirgisistan
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Kéreztour wird von einem in Kirgisistan registrierten Einzelunternehmen geführt.
              Die Tätigkeit ist offiziell als „Tour operator activities“ registriert.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-7 md:pt-0">
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Registriert seit 22.04.2024</p>
            <p className="mt-1">Kirgisische Republik</p>
          </div>
          <Link
            to="/registrierung"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Zertifikat ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Registration;
