import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TOURS = [
  { id: "nomaden", label: "Weltspiele der Nomaden 2026", price: 1200, hasTiers: false },
  { id: "kultur", label: "Kultur Tour", price: null, hasTiers: true },
  { id: "trekking", label: "Intensiv-Trekking", price: 1200, hasTiers: false },
] as const;

type TourId = (typeof TOURS)[number]["id"];

const TIER_PRICES = { economy: 990, comfort: 1490 } as const;

const bookingSchema = z.object({
  vorname: z.string().trim().min(1, "Vorname ist erforderlich").max(100),
  nachname: z.string().trim().min(1, "Nachname ist erforderlich").max(100),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein").max(255),
  phone: z.string().trim().min(1, "Telefonnummer ist erforderlich").max(30),
  persons: z.number({ required_error: "Anzahl ist erforderlich" }).min(1, "Mindestens 1 Person").max(20, "Maximal 20 Personen"),
  travelDate: z.date({ required_error: "Reisedatum ist erforderlich" }),
  tour: z.string().min(1, "Bitte wähle eine Reise"),
  tier: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

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
          <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-2">
            Reise buchen
          </h1>
          <p className="text-center text-muted-foreground mb-10">
            Fülle das Formular aus und sichere dir deinen Platz
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            {/* Name */}
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

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input id="email" type="email" {...register("email")} placeholder="max@beispiel.de" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer *</Label>
              <Input id="phone" type="tel" {...register("phone")} placeholder="+49 123 456789" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            {/* Tour Selection */}
            <div className="space-y-3">
              <Label>Reise wählen *</Label>
              <RadioGroup
                defaultValue={defaultTour}
                onValueChange={(v) => setValue("tour", v, { shouldValidate: true })}
                className="space-y-3"
              >
                {TOURS.map((tour) => (
                  <label
                    key={tour.id}
                    htmlFor={`tour-${tour.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors",
                      tourId === tour.id ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <RadioGroupItem value={tour.id} id={`tour-${tour.id}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{tour.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {tour.hasTiers ? "ab 990 € / Person" : `${tour.price!.toLocaleString("de-DE")} € / Person`}
                      </p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
              {errors.tour && <p className="text-sm text-destructive">{errors.tour.message}</p>}
            </div>

            {/* Tier – only for Kultur Tour */}
            {selectedTour?.hasTiers && (
              <div className="space-y-3">
                <Label>Reisetyp *</Label>
                <RadioGroup
                  defaultValue="comfort"
                  onValueChange={(v) => setValue("tier", v, { shouldValidate: true })}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <label
                    htmlFor="economy"
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors",
                      tier === "economy" ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <RadioGroupItem value="economy" id="economy" />
                    <div>
                      <p className="font-semibold text-foreground">Economy</p>
                      <p className="text-sm text-muted-foreground">990 € / Person</p>
                    </div>
                  </label>
                  <label
                    htmlFor="comfort"
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors",
                      tier === "comfort" ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <RadioGroupItem value="comfort" id="comfort" />
                    <div>
                      <p className="font-semibold text-foreground">Comfort</p>
                      <p className="text-sm text-muted-foreground">1.490 € / Person</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            )}

            {/* Persons */}
            <div className="space-y-2">
              <Label htmlFor="persons">Anzahl der Personen *</Label>
              <Input
                id="persons"
                type="number"
                min={1}
                max={20}
                {...register("persons", { valueAsNumber: true })}
              />
              {errors.persons && <p className="text-sm text-destructive">{errors.persons.message}</p>}
            </div>

            {/* Travel Date */}
            <div className="space-y-2">
              <Label>Reisedatum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !travelDate && "text-muted-foreground"
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

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Besondere Wünsche</Label>
              <Textarea id="notes" {...register("notes")} placeholder="Allergien, besondere Anforderungen..." rows={3} />
            </div>

            {/* Price Summary */}
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="text-lg font-bold text-primary">
                Gesamtpreis: {totalPrice.toLocaleString("de-DE")} € ({persons || 1} {(persons || 1) === 1 ? "Person" : "Personen"} × {pricePerPerson.toLocaleString("de-DE")} €)
              </p>
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                "Jetzt verbindlich buchen"
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
