import { FileCheck2 } from "lucide-react";

const Registration = () => (
  <section className="bg-muted/40 py-14 md:py-18">
    <div className="container mx-auto max-w-[1180px] px-6">
      <div className="flex flex-col items-start gap-7 rounded-2xl border border-border bg-card px-6 py-7 shadow-soft md:flex-row md:items-center md:justify-between md:px-9 md:py-8">
        <div className="flex items-start gap-5">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary-soft text-primary">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Offiziell registriert
            </p>
            <h2 className="mt-2 font-display text-2xl text-foreground md:text-3xl">
              Reiseveranstalter in Kirgisistan
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              KérezTour wird von einem in Kirgisistan registrierten Einzelunternehmen geführt.
              Die Tätigkeit ist offiziell als „Tour operator activities“ registriert.
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-border pt-4 text-sm text-muted-foreground md:border-l md:border-t-0 md:pl-7 md:pt-0">
          <p className="font-semibold text-foreground">Registriert seit 22.04.2024</p>
          <p className="mt-1">Kirgisische Republik</p>
        </div>
      </div>
    </div>
  </section>
);

export default Registration;
