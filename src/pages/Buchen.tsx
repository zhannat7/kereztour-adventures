import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Loader2, Minus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TOURS = [
  {
    id: "nomaden",
    emoji: "🏇",
    label: "Weltspiele der Nomaden 2026",
    desc: "Kultur & Sportevent am Issyk-Kul",
    price: 1200,
    hasTiers: false,
  },
  {
    id: "kultur",
    emoji: "🏛️",
    label: "Kultur Tour",
    desc: "10 Tage durch Kirgisistans Highlights",
    price: null,
    hasTiers: true,
  },
  {
    id: "trekking",
    emoji: "🥾",
    label: "Intensiv-Trekking",
    desc: "Bergseen & Hochgebirge, 10 Tage",
    price: 1200,
    hasTiers: false,
  },
] as const;

type TourId = (typeof TOURS)[number]["id"];
const TIER_PRICES = { economy: 990, comfort: 1490 } as const;

const bookingSchema = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich").max(100),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich").max(100),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein").max(255),
  phone: z.string().trim().min(1, "Telefonnummer ist erforderlich").max(30),
  persons: z.number().min(1).max(20),
  travelDate: z.date({ required_error: "Reisedatum ist erforderlich" }),
  tour: z.string().min(1, "Bitte wähle eine Reise"),
  tier: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const Step = ({ n, title }: { n: number; title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
      {n}
    </span>
    <h2 className="font-display text-lg text-foreground">{title}</h2>
  </div>
);

const Buchen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultTour = searchParams.get("tour") || "kultur";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { persons: 1, tour: defaultTour, tier: "comfort", notes: "" },
  });

  const persons = watch("persons");
  const tourId = watch("tour") as TourId;
  const tier = watch("tier") as "economy" | "comfort";
  const travelDate = watch("travelDate");
  const selectedTour = TOURS.find((t) => t.id === tourId);

  const pricePerPerson = useMemo(() => {
    if (!selectedTour) return 0;
    if (selectedTour.hasTiers) return TIER_PRICES[tier] || TIER_PRICES.comfort;
    return selectedTour.price!;
  }, [selectedTour, tier]);

  const totalPrice = useMemo(() => (persons || 1) * pricePerPerson, [persons, pricePerPerson]);

  const onSubmit = async (data: BookingForm) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const tour = TOURS.find((t) => t.id === data.tour);
      const pp = tour?.hasTiers ? TIER_PRICES[(data.tier as "economy" | "comfort") || "comfort"] : tour?.price || 0;
      const total = data.persons * pp;
      const tierValue = tour?.hasTiers ? data.tier! : "standard";

      const { error } = await supabase.from("bookings").insert({
        name: `${data.vorname} ${data.nachname}`,
        email: data.email,
        phone: data.phone,
        persons: data.persons,
        travel_date: format(data.travelDate, "yyyy-MM-dd"),
        tour: tour?.label,
        tier: tierValue,
        notes: data.notes || null,
        total_price: total,
      });

      if (error) throw error;

      navigate("/zahlung", {
        state: {
          name: `${data.vorname} ${data.nachname}`,
          travelDate: format(data.travelDate, "dd.MM.yyyy"),
          tour: tour?.label,
          tier: tierValue,
          persons: data.persons,
          totalPrice: total,
        },
      });
    } catch {
      setSubmitError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-primary"
          >
            ← Zurück
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-2">Reise buchen</h1>
          <p className="text-center text-muted-foreground mb-10">Nur 3 Schritte bis zu deinem Kirgisistan-Abenteuer</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SCHRITT 1 – Reise wählen */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <Step n={1} title="Welche Reise möchtest du buchen?" />
              <div className="space-y-3">
                {TOURS.map((tour) => (
                  <button
                    key={tour.id}
                    type="button"
                    onClick={() => setValue("tour", tour.id, { shouldValidate: true })}
                    className={cn(
                      "w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                      tourId === tour.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <span className="text-3xl">{tour.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{tour.label}</p>
                      <p className="text-sm text-muted-foreground">{tour.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary text-sm">
                        {tour.hasTiers ? "ab 990 €" : `${tour.price!.toLocaleString("de-DE")} €`}
                      </p>
                      <p className="text-xs text-muted-foreground">/ Person</p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.tour && <p className="text-sm text-destructive mt-2">{errors.tour.message}</p>}

              {/* Tier – nur bei Kultur Tour */}
              {selectedTour?.hasTiers && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">Wähle dein Paket für die Kultur Tour:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["economy", "comfort"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue("tier", t, { shouldValidate: true })}
                        className={cn(
                          "rounded-xl border-2 p-4 text-left transition-all duration-200",
                          tier === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                        )}
                      >
                        <p className="font-bold text-foreground capitalize">{t}</p>
                        <p className="text-lg font-display text-primary mt-1">
                          {TIER_PRICES[t].toLocaleString("de-DE")} €
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t === "economy" ? "Hostel & Jurte, Gruppe bis 12" : "Luxushotel, Gruppe bis 4"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SCHRITT 2 – Personen & Datum */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <Step n={2} title="Wann und wie viele Personen?" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Personen */}
                <div className="space-y-2">
                  <Label>Anzahl der Personen</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("persons", Math.max(1, (persons || 1) - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-2xl font-bold text-primary w-8 text-center">{persons || 1}</span>
                    <button
                      type="button"
                      onClick={() => setValue("persons", Math.min(20, (persons || 1) + 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Datum */}
                <div className="space-y-2">
                  <Label>Reisedatum *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !travelDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {travelDate ? format(travelDate, "PPP", { locale: de }) : "Datum wählen"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={travelDate}
                        onSelect={(date) => date && setValue("travelDate", date, { shouldValidate: true })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.travelDate && <p className="text-sm text-destructive">{errors.travelDate.message}</p>}
                </div>
              </div>
            </div>

            {/* SCHRITT 3 – Kontaktdaten */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <Step n={3} title="Deine Kontaktdaten" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vorname">Vorname *</Label>
                    <Input id="vorname" {...register("vorname")} placeholder="Max" />
                    {errors.vorname && <p className="text-sm text-destructive">{errors.vorname.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nachname">Nachname *</Label>
                    <Input id="nachname" {...register("nachname")} placeholder="Mustermann" />
                    {errors.nachname && <p className="text-sm text-destructive">{errors.nachname.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="max@beispiel.de" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonnummer *</Label>
                  <Input id="phone" type="tel" {...register("phone")} placeholder="+49 123 456789" />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Besondere Wünsche <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Allergien, besondere Anforderungen..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Preisübersicht */}
            <div className="rounded-2xl bg-primary text-primary-foreground p-6 flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/70 text-sm mb-1">Gesamtpreis</p>
                <p className="font-display text-4xl">{totalPrice.toLocaleString("de-DE")} €</p>
                <p className="text-primary-foreground/70 text-xs mt-1">
                  {persons || 1} {(persons || 1) === 1 ? "Person" : "Personen"} ×{" "}
                  {pricePerPerson.toLocaleString("de-DE")} €
                </p>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/70 text-xs">Ausgewählt</p>
                <p className="font-semibold text-sm">
                  {selectedTour?.emoji} {selectedTour?.label}
                </p>
              </div>
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-14 text-base rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                "Jetzt verbindlich buchen →"
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Buchen;
