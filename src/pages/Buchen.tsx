import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import {
  CalendarIcon,
  Check,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TOURS = [
  {
    id: "kultur",
    label: "Kultur Tour",
    desc: "10 Tage durch die schönsten Regionen Kirgisistans – Kultur, Natur, Traditionen und echte Begegnungen.",
    price: null,
    hasTiers: true,
  },
  {
    id: "trekking",
    label: "Intensiv-Trekking",
    desc: "Berge, alpine Landschaften und abgelegene Täler – für alle, die Kirgisistan aktiv erleben möchten.",
    price: 1200,
    hasTiers: false,
  },
  {
    id: "kyrchyn",
    label: "Kyrchyn Tour",
    desc: "Kyrchyn Jailoo erleben, nomadische Kultur kennenlernen und Kirgisistan auf besondere Weise entdecken.",
    price: 1300,
    hasTiers: false,
  },
] as const;

type TourId = (typeof TOURS)[number]["id"];
type TierId = "economy" | "comfort";

type CultureDate = {
  id: string;
  value: string;
  endDate: string;
  label: string;
  maxParticipants: number;
  availablePlaces: number;
  status: "open" | "full";
};

const TIER_PRICES: Record<TierId, number> = {
  economy: 990,
  comfort: 1490,
};

const bookingSchema = (t: (text: string) => string) => z.object({
  vorname: z
    .string()
    .trim()
    .min(1, t("Vorname ist erforderlich"))
    .max(100),

  nachname: z
    .string()
    .trim()
    .min(1, t("Nachname ist erforderlich"))
    .max(100),

  email: z
    .string()
    .trim()
    .email(t("Bitte gib eine gültige E-Mail-Adresse ein"))
    .max(255),

  phone: z
    .string()
    .trim()
    .min(1, t("Telefonnummer ist erforderlich"))
    .max(30),

  persons: z
    .number()
    .min(1)
    .max(20),

  travelDate: z.date({
    required_error: t("Reisedatum ist erforderlich"),
  }),

  tour: z
    .string()
    .min(1, t("Bitte wähle eine Reise")),

  tier: z
    .string()
    .optional(),

  notes: z
    .string()
    .max(1000)
    .optional(),
});

type BookingForm = z.infer<ReturnType<typeof bookingSchema>>;

const Step = ({
  n,
  title,
}: {
  n: number;
  title: string;
}) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
      {n}
    </span>

    <h2 className="font-display text-lg md:text-xl text-foreground">
      {title}
    </h2>
  </div>
);

const Buchen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const focusNextField = (id: string) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(id) as HTMLElement | null;
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => element.focus(), 250);
    });
  };

  const handleFieldEnter = (event: React.KeyboardEvent<HTMLInputElement>, nextId: string) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    focusNextField(nextId);
  };

  const tourParam = searchParams.get("tour");
  const tierParam = searchParams.get("tier");
  const dateParam = searchParams.get("date");
  const [showTourPicker, setShowTourPicker] = useState(!tourParam);

  const schema = useMemo(() => bookingSchema(t), [t]);

  const validTour =
    tourParam && TOURS.some((tour) => tour.id === tourParam)
      ? tourParam
      : "";

  const validTier =
    tierParam === "economy" || tierParam === "comfort"
      ? tierParam
      : "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(schema),

    defaultValues: {
      persons: 1,
      tour: validTour,
      tier: validTour === "kultur" ? validTier : "",
      notes: "",
      travelDate: dateParam ? new Date(`${dateParam}T12:00:00`) : undefined,
    },
  });

  const persons = watch("persons") || 1;
  const tourId = watch("tour") as TourId | "";
  const tier = watch("tier") as TierId | "";
  const travelDate = watch("travelDate");

  const [cultureDates, setCultureDates] = useState<CultureDate[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  useEffect(() => {
    if (tourId !== "kultur") return;

    let active = true;

    const loadCultureDates = async () => {
      setIsLoadingDates(true);

      const { data, error } = await (supabase as any)
        .rpc("get_tour_date_availability");

      if (!active) return;

      if (error) {
        setCultureDates([]);
        setIsLoadingDates(false);
        return;
      }

      const dates: CultureDate[] = (data ?? [])
        .filter((item: any) => item.tour === "Kultur Tour")
        .map((item: any) => ({
          id: item.id,
          value: item.start_date,
          endDate: item.end_date,
          label: format(parseISO(item.start_date), "dd.MM.") + "–" + format(parseISO(item.end_date), "dd.MM.yyyy"),
          maxParticipants: Number(item.max_participants),
          availablePlaces: Number(item.available_places),
          status: item.status === "full" ? "full" : "open",
        }));

      setCultureDates(dates);
      setIsLoadingDates(false);
    };

    loadCultureDates();

    return () => {
      active = false;
    };
  }, [tourId]);

  const selectedCultureDate = cultureDates.find(
    (item) =>
      travelDate &&
      format(travelDate, "yyyy-MM-dd") === item.value
  );

  const selectedTour = TOURS.find(
    (tour) => tour.id === tourId
  );

  const pricePerPerson = useMemo(() => {
    if (!selectedTour) return 0;

    if (selectedTour.hasTiers) {
      if (!tier) return 0;
      return TIER_PRICES[tier];
    }

    return selectedTour.price ?? 0;
  }, [selectedTour, tier]);

  const totalPrice = persons * pricePerPerson;

  const selectTour = (id: TourId) => {
    setValue("tour", id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (id !== "kultur") {
      setValue("tier", "", {
        shouldValidate: true,
      });
    } else if (!tier) {
      setValue("tier", "comfort", {
        shouldValidate: true,
      });
    }
  };

  const selectTier = (value: TierId) => {
    setValue("tier", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: BookingForm) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const tour = TOURS.find((item) => item.id === data.tour);

      if (!tour) {
        throw new Error(t("Bitte wähle eine Reise."));
      }

      if (tour.hasTiers && !data.tier) {
        throw new Error(t("Bitte wähle eine Reiseoption."));
      }

      const price =
        tour.hasTiers && data.tier
          ? TIER_PRICES[data.tier as TierId]
          : tour.price ?? 0;

      const total = data.persons * price;

      // Non-tier tours do not need a tier value. Keep this NULL-compatible
      // with the existing bookings schema instead of writing a synthetic value.
      const tierValue = tour.hasTiers
        ? data.tier
        : "standard";

      const travelDateValue = format(data.travelDate, "yyyy-MM-dd");

      if (tour.id === "kultur") {
        const { data: availability, error: availabilityError } = await (supabase as any)
          .rpc("get_tour_date_availability");

        if (availabilityError) throw availabilityError;

        const selectedDate = (availability ?? []).find(
          (item: any) =>
            item.tour === "Kultur Tour" &&
            item.start_date === travelDateValue
        );

        if (!selectedDate) {
          throw new Error(t("Dieser Reisetermin ist nicht mehr verfügbar."));
        }

        const availablePlaces = Number(selectedDate.available_places);

        if (selectedDate.status === "full" || data.persons > availablePlaces) {
          throw new Error(
            availablePlaces > 0
              ? t("Für diesen Termin sind aktuell nur noch {count} Plätze verfügbar.").replace("{count}", String(availablePlaces))
              : t("Dieser Reisetermin ist bereits ausgebucht.")
          );
        }
      }

      const { error } = await supabase.functions.invoke("create-booking", {
        body: {
          name: `${data.vorname} ${data.nachname}`,
          email: data.email,
          phone: data.phone,
          persons: data.persons,
          travelDate: travelDateValue,
          tour: tour.id,
          tier: tierValue,
          notes: data.notes || null,
        },
      });

      if (error) {
        let detail = t("Die Buchungsanfrage konnte nicht gespeichert werden.");
        try {
          const context = await error.context?.json?.();
          if (context?.error) detail = context.error;
        } catch {
          // Keep the generic message if the function response cannot be read.
        }
        throw new Error(detail);
      }

      navigate("/zahlung", {
        state: {
          name: `${data.vorname} ${data.nachname}`,
          travelDate: tour.id === "kultur" && selectedCultureDate
            ? selectedCultureDate.label
            : format(data.travelDate, "dd.MM.yyyy"),
          tour: tour.label,
          tier: tierValue,
          persons: data.persons,
          totalPrice: total,
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "";

      setSubmitError(
        message
          ? t("Buchungsanfrage konnte nicht gesendet werden: {message}").replace("{message}", message)
          : t("Ein Fehler ist aufgetreten. Bitte versuche es erneut.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-muted-foreground hover:text-primary"
          >
            ← {t("Zurück")}
          </Button>

          <div className="mb-14 text-center">
            <h1 className="mb-4 font-display text-5xl text-primary md:text-7xl">
              Reise buchen
            </h1>

            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("Wähle deine Reise und deinen Termin aus und sende uns deine unverbindliche Buchungsanfrage.")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* SCHRITT 1 */}
            <section className="border-y border-border bg-card p-6 md:p-9">

              <Step
                n={1}
                title={t(validTour && !showTourPicker ? "Deine Reise" : "Welche Reise möchtest du buchen?")}
              />

              {validTour && !showTourPicker ? (
                <div className="rounded-sm border border-primary/30 bg-primary/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">
                        {t("Ausgewählte Reise")}
                      </p>
                      <p className="font-display text-xl text-foreground">
                        {selectedTour ? t(t(selectedTour.label)) : ""}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedTour ? t(selectedTour.desc) : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTourPicker(true)}
                      className="shrink-0 text-sm font-semibold text-primary hover:underline"
                    >
                      Ändern
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {TOURS.map((tour) => {
                    const isSelected = tourId === tour.id;

                    return (
                      <button
                        key={tour.id}
                        type="button"
                        onClick={() => {
                          selectTour(tour.id);
                          setShowTourPicker(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-4 rounded-sm border p-5 text-left transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              {t(tour.label)}
                            </p>

                            {isSelected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mt-1">
                            {t(tour.desc)}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary">
                            {tour.hasTiers
                              ? t("ab 990 €")
                              : `${tour.price?.toLocaleString("de-DE")} €`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            pro {t("Person")}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {errors.tour && (
                <p className="text-sm text-destructive mt-3">
                  {errors.tour.message}
                </p>
              )}

              {/* KULTUR OPTIONEN */}
              {selectedTour?.hasTiers && (
                <div className="mt-7 pt-7 border-t border-border">

                  <p className="font-semibold text-foreground mb-4">
                    {t("Wie möchtest du reisen?")}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {(
                      ["economy", "comfort"] as TierId[]
                    ).map((option) => {
                      const isSelected =
                        tier === option;

                      const isEconomy =
                        option === "economy";

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            selectTier(option)
                          }
                          className={cn(
                            "relative rounded-sm border p-5 text-left transition-all duration-200",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/40"
                          )}
                        >

                          {option === "comfort" && (
                            <span className="absolute -top-3 right-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                              {t("Comfort")}
                            </span>
                          )}

                          <div className="flex items-start justify-between gap-4">

                            <div>
                              <p className="font-bold text-lg text-foreground">
                                {isEconomy
                                  ? t("Economy")
                                  : t("Comfort")}
                              </p>

                              <p className="text-sm text-muted-foreground mt-2">
                                {isEconomy
                                  ? t("Gästehaus & Jurte, Mehrbettzimmer. Gruppe bis 12 Personen.")
                                  : t("Ausgewählte Hotels, Einzel- oder Doppelzimmer. Kleine Gruppe bis 4 Personen.")}
                              </p>
                            </div>

                            {isSelected && (
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-4 w-4" />
                              </span>
                            )}

                          </div>

                          <p className="font-display text-3xl text-primary mt-5">
                            {TIER_PRICES[
                              option
                            ].toLocaleString(
                              "de-DE"
                            )} €
                            <span className="text-sm text-muted-foreground font-sans ml-1">
                              / {t("Person")}
                            </span>
                          </p>

                        </button>
                      );
                    })}

                  </div>
                </div>
              )}

            </section>

            {/* SCHRITT 2 */}
            <section className="border-y border-border bg-card p-6 md:p-9">

              <Step
                n={2}
                title={t("Wann und wie viele Personen?")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* PERSONEN */}
                <div className="space-y-3">

                  <Label>
                    {t("Anzahl der Personen")}
                  </Label>

                  <div className="flex items-center gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "persons",
                          Math.max(
                            1,
                            persons - 1
                          )
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="text-2xl font-bold text-primary w-8 text-center">
                      {persons}
                    </span>

                    <button
                      type="button"
                      disabled={
                        tourId === "kultur" &&
                        !!selectedCultureDate &&
                        persons >= selectedCultureDate.availablePlaces
                      }
                      onClick={() =>
                        setValue(
                          "persons",
                          Math.min(
                            tourId === "kultur" && selectedCultureDate
                              ? selectedCultureDate.availablePlaces
                              : 20,
                            persons + 1
                          )
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                  </div>

                </div>

                {/* REISEDATUM */}
                <div className="space-y-3 sm:col-span-2">
                  <Label>{t("Reisetermin")} *</Label>

                  {tourId === "kultur" ? (
                    <div>
                      {isLoadingDates ? (
                        <div className="rounded-sm border border-border p-5 text-sm text-muted-foreground">
                          {t("Reisetermine werden geladen …")}
                        </div>
                      ) : cultureDates.length === 0 ? (
                        <div className="rounded-sm border border-border p-5 text-sm text-muted-foreground">
                          {t("Aktuell sind keine Reisetermine verfügbar.")}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {cultureDates.map((item) => {
                            const selected =
                              travelDate &&
                              format(travelDate, "yyyy-MM-dd") === item.value;
                            const isFull = item.status === "full" || item.availablePlaces <= 0;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={isFull}
                                onClick={() => {
                                  setValue(
                                    "travelDate",
                                    parseISO(item.value),
                                    { shouldValidate: true, shouldDirty: true }
                                  );
                                  focusNextField("vorname");
                                }}
                                className={cn(
                                   "rounded-sm border p-4 text-left transition-all",
                                  selected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/40",
                                  isFull && "cursor-not-allowed opacity-60 hover:border-border"
                                )}
                              >
                                <p className="font-semibold text-foreground">{item.label}</p>
                                <p className="text-sm mt-1 font-medium text-primary">
                                  {isFull
                                    ? "Ausgebucht"
                                    : t("Noch {count} {placeWord} verfügbar").replace("{count}", String(item.availablePlaces)).replace("{placeWord}", item.availablePlaces === 1 ? t("Platz") : t("Plätze"))}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Max. {item.maxParticipants} {t("Person")}en · {t("Anfrage ohne Zahlung")}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 justify-start text-left font-normal",
                            !travelDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {travelDate
                            ? format(travelDate, "PPP", { locale: de })
                            : "Datum wählen"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={travelDate}
                          onSelect={(date) => {
                            if (!date) return;
                            setValue("travelDate", date, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            focusNextField("vorname");
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  )}

                  {errors.travelDate && (
                    <p className="text-sm text-destructive">{errors.travelDate.message}</p>
                  )}
                </div>

              </div>

            </section>

            {/* SCHRITT 3 */}
            <section className="border-y border-border bg-card p-6 md:p-9">

              <Step
                n={3}
                title={t("Deine Kontaktdaten")}
              />

              <div className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div className="space-y-2">
                    <Label htmlFor="vorname">
                      {t("Vorname")} *
                    </Label>

                    <Input
                      id="vorname"
                      {...register("vorname")}
                      onKeyDown={(event) => handleFieldEnter(event, "nachname")}
                      placeholder={t("Vorname")}
                    />

                    {errors.vorname && (
                      <p className="text-sm text-destructive">
                        {errors.vorname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nachname">
                      {t("Nachname")} *
                    </Label>

                    <Input
                      id="nachname"
                      {...register("nachname")}
                      onKeyDown={(event) => handleFieldEnter(event, "email")}
                      placeholder="Nachname"
                    />

                    {errors.nachname && (
                      <p className="text-sm text-destructive">
                        {errors.nachname.message}
                      </p>
                    )}
                  </div>

                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t("E-Mail")} *
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    onKeyDown={(event) => handleFieldEnter(event, "phone")}
                    placeholder="name@beispiel.de"
                  />

                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t("Telefonnummer")} *
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    onKeyDown={(event) => handleFieldEnter(event, "notes")}
                    placeholder="+49 123 456789"
                  />

                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    {t("Besondere Wünsche")}{" "}
                    <span className="text-muted-foreground font-normal">
                      {t("(optional)")}
                    </span>
                  </Label>

                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder={t("Zum Beispiel besondere Wünsche oder Anforderungen...")}
                    rows={4}
                  />
                </div>

              </div>

            </section>

            {/* ZUSAMMENFASSUNG */}
            {selectedTour && pricePerPerson > 0 && (
              <section className="border-y border-gold/30 bg-primary p-6 text-primary-foreground md:p-9">

                <p className="text-primary-foreground/70 text-sm mb-2">
                  {t("Deine Auswahl")}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                  <div>

                    <h3 className="font-display text-2xl md:text-3xl">
                      {selectedTour.label}
                    </h3>

                    {selectedTour.hasTiers && tier && (
                      <p className="text-primary-foreground/80 mt-1">
                        {tier === "economy"
                          ? t("Economy")
                          : t("Comfort")}
                      </p>
                    )}

                    {travelDate && (
                      <p className="text-primary-foreground/80 text-sm mt-3">
                        {t("Reisetermin:")} {format(travelDate, "dd.MM.yyyy")}
                      </p>
                    )}

                    <p className="text-primary-foreground/70 text-sm mt-1">
                      {persons}{" "}
                      {persons === 1 ? t("Person") : t("Personen")}{" "}
                      × {pricePerPerson.toLocaleString("de-DE")} €
                    </p>

                  </div>

                  <div className="sm:text-right">

                    <p className="text-primary-foreground/70 text-sm">
                      {t("Gesamtpreis")}
                    </p>

                    <p className="font-display text-4xl md:text-5xl">
                      {totalPrice.toLocaleString(
                        "de-DE"
                      )} €
                    </p>

                  </div>

                </div>

              </section>
            )}

            {/* FEHLER */}
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {submitError}
                </AlertDescription>
              </Alert>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-xl"
              disabled={
                isSubmitting ||
                !selectedTour ||
                (selectedTour.hasTiers && !tier)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Wird gesendet...")}
                </>
              ) : (
                "Buchungsanfrage senden →"
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
