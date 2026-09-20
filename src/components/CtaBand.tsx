import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, MessageCircle, Mail, Loader2, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { openWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OWNER_EMAIL = "sarinasadirovna@gmail.com";

const TOUR_OPTIONS = [
  "Kultur Tour",
  "Intensiv-Trekking",
  "Weltspiele der Nomaden 2026",
] as const;

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib deinen Namen ein")
    .max(100, "Maximal 100 Zeichen"),
  email: z
    .string()
    .trim()
    .email("Bitte gib eine gültige E-Mail-Adresse ein")
    .max(255, "Maximal 255 Zeichen"),
  tour: z.string().min(1, "Bitte wähle eine Reise"),
  dateFrom: z.string().min(1, "Bitte gib den Reisebeginn an"),
  dateTo: z.string().min(1, "Bitte gib das Reiseende an"),
  persons: z.number().min(1).max(20),
  message: z.string().trim().max(1000, "Maximal 1000 Zeichen").optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const CtaBand = () => {
  const ref = useScrollReveal();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { persons: 2, tour: "", dateFrom: "", dateTo: "", message: "" },
  });

  const persons = watch("persons");
  const tour = watch("tour");

  const openDialog = () => {
    setSubmitted(false);
    setSubmitError("");
    reset({ persons: 2, tour: "", dateFrom: "", dateTo: "", message: "" });
    setOpen(true);
  };

  const onSubmit = async (data: InquiryForm) => {
    setSubmitError("");
    try {
      const { error } = await supabase
        .from("contact_messages" as unknown as "bookings")
        .insert({
          name: data.name,
          email: data.email,
          tour: data.tour,
          date_from: data.dateFrom,
          date_to: data.dateTo,
          persons: data.persons,
          message: data.message || null,
        } as never);

      if (error) throw error;

      // E-Mail-Benachrichtigung – sendet automatisch, sobald der
      // E-Mail-Versand freigeschaltet ist. Scheitert sie, bleibt die
      // Anfrage trotzdem gespeichert.
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "contact-inquiry",
            recipientEmail: OWNER_EMAIL,
            idempotencyKey: `contact-inquiry-${crypto.randomUUID()}`,
            templateData: {
              name: data.name,
              email: data.email,
              tour: data.tour,
              dateFrom: data.dateFrom,
              dateTo: data.dateTo,
              persons: data.persons,
              message: data.message || "",
            },
          },
        });
      } catch (emailErr) {
        console.warn("E-Mail-Versand noch nicht aktiv:", emailErr);
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setSubmitError(
        message
          ? `Anfrage konnte nicht gesendet werden: ${message}`
          : "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
      );
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
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
              <button
                type="button"
                onClick={openDialog}
                className="btn-accent w-full"
              >
                Anfrage per Formular <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={whatsappUrl("Hallo Kereztour, ich habe eine Frage zu euren Reisen.")}
                onClick={(e) => openWhatsApp(e, "Hallo Kereztour, ich habe eine Frage zu euren Reisen.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                <MessageCircle className="h-4 w-4" /> Direkt auf WhatsApp
              </a>

              <a
                href={`mailto:${OWNER_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" /> {OWNER_EMAIL}
              </a>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {submitted ? (
            <div className="py-8 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-7 w-7" />
              </span>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary">
                  Danke für deine Anfrage!
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Wir haben deine Nachricht erhalten und melden uns innerhalb von
                  24 Stunden bei dir.
                </DialogDescription>
              </DialogHeader>
              <Button className="mt-6 btn-accent" onClick={() => setOpen(false)}>
                Schließen
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary">
                  Unverbindliche Anfrage
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Erzähl uns kurz von deiner Wunschreise – wir antworten innerhalb
                  von 24 Stunden.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inquiry-name">Name *</Label>
                  <Input
                    id="inquiry-name"
                    {...register("name")}
                    placeholder="Vor- und Nachname"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiry-email">E-Mail-Adresse *</Label>
                  <Input
                    id="inquiry-email"
                    type="email"
                    {...register("email")}
                    placeholder="max@beispiel.de"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Gewünschte Reise *</Label>
                  <Select value={tour} onValueChange={(v) => setValue("tour", v, { shouldValidate: true })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Bitte wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOUR_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tour && <p className="text-sm text-destructive">{errors.tour.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inquiry-from">Reisebeginn *</Label>
                    <Input id="inquiry-from" type="date" {...register("dateFrom")} />
                    {errors.dateFrom && <p className="text-sm text-destructive">{errors.dateFrom.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inquiry-to">Reiseende *</Label>
                    <Input id="inquiry-to" type="date" {...register("dateTo")} />
                    {errors.dateTo && <p className="text-sm text-destructive">{errors.dateTo.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Anzahl der Personen *</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("persons", Math.max(1, (persons || 1) - 1), { shouldValidate: true })}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                      aria-label="Weniger Personen"
                    >
                      –
                    </button>
                    <span className="text-2xl font-bold text-primary w-8 text-center">{persons || 1}</span>
                    <button
                      type="button"
                      onClick={() => setValue("persons", Math.min(20, (persons || 1) + 1), { shouldValidate: true })}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                      aria-label="Mehr Personen"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiry-message">
                    Nachricht <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="inquiry-message"
                    {...register("message")}
                    placeholder="Wünsche, Fragen, Anmerkungen..."
                    rows={3}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                <Button
                  type="submit"
                  className="btn-accent w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    "Anfrage senden"
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CtaBand;
