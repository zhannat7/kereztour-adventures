import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import {
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
import { openWhatsApp } from "@/lib/whatsapp";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    price: 1490,
    hasTiers: false,
  },
] as const;

type TourId = (typeof TOURS)[number]["id"];
type TourDateAvailability = {
  id: string;
  value: string;
  endDate: string;
  label: string;
  maxParticipants: number;
  availablePlaces: number;
  status: "open" | "full";
};

const getCulturePrice = (persons: number) => {
  if (persons === 2) return 2700;
  if (persons >= 3 && persons <= 4) return 1700;
  if (persons >= 5) return 1690;
  return 0;
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
    .max(30)
    .refine((value) => {
      // Accept international numbers such as +43..., +996... or 0043...
      // Ignore common visual separators, but reject short inputs like "222".
      const normalized = value.replace(/[\\s().-]/g, "");
      return /^(?:\\+|00)?[1-9]\\d{6,14}$/.test(normalized);
    }, t("Bitte gib eine vollständige Telefonnummer mit Ländervorwahl ein")),

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
  const dateParam = searchParams.get("date");
  const [showTourPicker, setShowTourPicker] = useState(!tourParam);

  const schema = useMemo(() => bookingSchema(t), [t]);

  const validTour =
    tourParam && TOURS.some((tour) => tour.id === tourParam)
      ? tourParam
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
      persons: validTour === "kultur" ? 2 : 1,
      tour: validTour,
      notes: "",
      travelDate: dateParam ? new Date(`${dateParam}T12:00:00`) : undefined,
    },
  });

  const persons = watch("persons") || 1;
  const tourId = watch("tour") as TourId | "";
  const travelDate = watch("travelDate");

  const [tourDates, setTourDates] = useState<TourDateAvailability[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  useEffect(() => {
    if (!tourId) {
      setTourDates([]);
      return;
    }

    let active = true;

    const loadTourDates = async () => {
      setIsLoadingDates(true);

      const selectedTourLabel = TOURS.find((tour) => tour.id === tourId)?.label;

      // Load the dates first so the customer sees them immediately.
      // The availability RPC can be slower, so refresh seat counts in the background.
      const { data: rawDates, error: rawError } = await supabase
        .from("tour_dates")
        .select("id, tour, start_date, end_date, max_participants, economy_max_participants, comfort_max_participants, status")
        .eq("tour", selectedTourLabel)
        .order("start_date", { ascending: true });

      if (rawError) {
        if (active) {
          setTourDates([]);
          setIsLoadingDates(false);
        }
        return;
      }

      if (!active) return;

      const dates: TourDateAvailability[] = (rawDates ?? [])
        .filter((item: any) => item.tour === selectedTourLabel)
        .map((item: any) => {
          const savedCapacity = Number(item.max_participants);
          const status = item.status === "cancelled" || savedCapacity <= 0 ? "full" : "open";

          return {
            id: item.id,
            value: item.start_date,
            endDate: item.end_date,
            label:
              format(parseISO(item.start_date), "dd.MM.") +
              "–" +
              format(parseISO(item.end_date), "dd.MM.yyyy"),
            maxParticipants: savedCapacity,
            availablePlaces: savedCapacity,
            status,
          };
        });

      setTourDates(dates);
      setIsLoadingDates(false);

      // Update available places after dates are already visible.
      const { data: availabilityResult, error: availabilityError } =
        await (supabase as any).rpc("get_tour_date_availability");

      if (!active || availabilityError || !Array.isArray(availabilityResult)) return;

      const rpcById = new Map(availabilityResult.map((item: any) => [item.id, item]));
      setTourDates((currentDates) => currentDates.map((date) => {
        const rpcItem: any = rpcById.get(date.id);
        if (!rpcItem) return date;

        const rpcCapacity = Number(rpcItem.max_participants ?? date.maxParticipants);
        const rpcAvailable = Number(rpcItem.available_places ?? date.availablePlaces);
        // Keep the admin-saved capacity authoritative if it changed after the RPC snapshot.
        const availablePlaces = Math.max(0, Math.min(date.maxParticipants, rpcAvailable + date.maxParticipants - rpcCapacity));
        return {
          ...date,
          availablePlaces,
          status: availablePlaces <= 0 ? "full" : "open",
        };
      }));
    };

    void loadTourDates();

    // Refresh public availability while this page is open. Realtime gives
    // immediate updates where enabled; polling remains a reliable fallback.
    const refreshInterval = window.setInterval(() => {
      if (active) void loadTourDates();
    }, 15000);
    const availabilityChannel = supabase
      .channel("public-booking-availability")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_dates" }, () => {
        if (active) void loadTourDates();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        if (active) void loadTourDates();
      })
      .subscribe();

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
      void supabase.removeChannel(availabilityChannel);
    };
  }, [tourId]);

  const selectedTourDate = tourDates.find(
    (item) =>
      travelDate &&
      format(travelDate, "yyyy-MM-dd") === item.value
  );

  const selectedAvailablePlaces = selectedTourDate?.availablePlaces ?? 20;

  useEffect(() => {
    if (selectedTourDate && persons > selectedAvailablePlaces) {
      setValue("persons", selectedAvailablePlaces, { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedTourDate, selectedAvailablePlaces, persons, setValue]);


  const selectedTour = TOURS.find(
    (tour) => tour.id === tourId
  );

  const pricePerPerson = useMemo(() => {
    if (!selectedTour) return 0;

    if (selectedTour.hasTiers) {
      return getCulturePrice(persons);
    }

    return selectedTour.price ?? 0;
  }, [selectedTour, persons]);

  const totalPrice = persons * pricePerPerson;

  const selectTour = (id: TourId) => {
    setValue("tour", id, { shouldValidate: true, shouldDirty: true });
    setValue("travelDate", undefined, { shouldValidate: true, shouldDirty: true });
    setValue("persons", id === "kultur" ? 2 : 1, { shouldValidate: true });
  };

  const handleInvalidSubmit = (formErrors: Record<string, any>) => {
    const firstError = Object.keys(formErrors)[0];
    if (!firstError) return;

    const errorMessage =
      formErrors[firstError]?.message ||
      t("Bitte prüfe die markierten Felder.");

    setSubmitError(String(errorMessage));

    // Keep validation usable on mobile even when the invalid field is a
    // custom control (for example the Reisetermin buttons) without an input id.
    const element = document.getElementById(firstError) as HTMLElement | null;
    if (element) {
      focusNextField(firstError);
    } else {
      requestAnimationFrame(() => {
        document.querySelector("section:nth-of-type(2)")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };

  const onSubmit = async (data: BookingForm) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const tour = TOURS.find((item) => item.id === data.tour);
      if (!tour) throw new Error(t("Bitte wähle eine Reise."));
      const price = tour.hasTiers ? getCulturePrice(data.persons) : tour.price ?? 0;
      if (tour.id === "kultur" && (data.persons < 2 || data.persons > 20)) {
        throw new Error(t("Bitte wähle zwischen 2 und 20 Personen."));
      }
      if (tour.id === "kultur" && price <= 0) {
        throw new Error(t("Für diese Personenzahl ist kein Reisepreis hinterlegt."));
      }
      const total = data.persons * price;
      const travelDateValue = format(data.travelDate, "yyyy-MM-dd");
      if (!selectedTourDate || selectedTourDate.value !== travelDateValue) {
        throw new Error(t("Dieser Reisetermin ist nicht mehr verfügbar."));
      }
      if (selectedTourDate.availablePlaces <= 0 || data.persons > selectedTourDate.availablePlaces) {
        throw new Error(
          selectedTourDate.availablePlaces > 0
            ? t("Für diesen Termin sind aktuell nur noch {count} Plätze verfügbar.").replace("{count}", String(selectedTourDate.availablePlaces))
            : t("Dieser Reisetermin ist bereits ausgebucht.")
        );
      }
      const { data: bookingResult, error } = await supabase.functions.invoke("create-booking", {
        body: {
          name: data.vorname + " " + data.nachname,
          email: data.email,
          phone: data.phone,
          persons: data.persons,
          travelDate: travelDateValue,
          tour: tour.id,
          tier: tour.id === "trekking" ? "standard" : undefined,
          notes: data.notes || null,
          paymentMode: "request",
        },
      });
      // Older deployed Edge Function versions may return success without bookingId.
      // The request is successful when the function explicitly confirms success;
      // do not show a false failure merely because an older response omits the ID.
      if (error || bookingResult?.success !== true) {
        throw new Error(t("Die Buchungsanfrage konnte nicht gespeichert werden."));
      }
      navigate("/zahlung", {
        state: {
          status: "request",
          name: data.vorname + " " + data.nachname,
          travelDate: selectedTourDate.label,
          tour: tour.label,
          transport: tour.id === "kultur" ? (data.persons <= 4 ? "Jeep" : "Minibus") : null,
          persons: data.persons,
          pricePerPerson: price,
          totalPrice: total,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
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

      <main className="pt-20 pb-12 md:pt-24 md:pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-muted-foreground hover:text-primary"
          >
            ← {t("Zurück")}
          </Button>

          <div className="mb-8 text-center md:mb-14">
            <h1 className="mb-4 font-display text-5xl text-primary md:text-7xl">
              {t("Reise buchen")}
            </h1>

            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("Wähle deine Reise und deinen Termin aus und sende uns deine unverbindliche Buchungsanfrage.")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
            className="space-y-6"
          >

            {/* SCHRITT 1 */}
            <section className="border-y border-border bg-card p-4 md:p-9">

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
                      {t("Ändern")}
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
                              ? t("ab 1.690 €")
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

              {selectedTour?.hasTiers && (
                <div className="mt-7 pt-7 border-t border-border">
                  <p className="font-semibold text-foreground mb-4">{t("Transport und Preis")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-sm border border-border p-5">
                      <p className="font-bold text-lg text-foreground">{t("2–4 Personen · Jeep")}</p>
                      <p className="text-sm text-muted-foreground mt-2">{t("2 Personen: 2.700 € pro Person · 3–4 Personen: 1.700 € pro Person")}</p>
                    </div>
                    <div className="rounded-sm border border-border p-5">
                      <p className="font-bold text-lg text-foreground">{t("Ab 5 Personen · Minibus")}</p>
                      <p className="text-sm text-muted-foreground mt-2">{t("1.690 € pro Person")}</p>
                    </div>
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
                          tourId === "kultur"
                            ? Math.max(2, persons - 1)
                            : Math.max(1, persons - 1)
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
                        !!selectedTourDate &&
                        persons >= selectedAvailablePlaces
                      }
                      onClick={() =>
                        setValue(
                          "persons",
                          Math.min(
                            tourId === "kultur"
                              ? Math.min(selectedTourDate ? selectedAvailablePlaces : 20, 20)
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

                  {!tourId ? (
                    <div className="rounded-sm border border-border p-5 text-sm text-muted-foreground">
                      {t("Bitte wähle zuerst eine Reise aus.")}
                    </div>
                  ) : isLoadingDates ? (
                    <div className="rounded-sm border border-border p-5 text-sm text-muted-foreground">
                      {t("Termine werden geladen … Bitte einen Moment warten.")}
                    </div>
                  ) : tourDates.length === 0 ? (
                    <div className="rounded-sm border border-border p-5 text-sm text-muted-foreground">
                      {t("Aktuell sind für diese Reise keine Reisetermine verfügbar.")}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {tourDates.map((item) => {
                        const selected =
                          travelDate &&
                          format(travelDate, "yyyy-MM-dd") === item.value;
                        const itemAvailablePlaces = item.availablePlaces;
                        const itemMaxParticipants = item.maxParticipants;
                        const isFull = item.status === "full" || itemAvailablePlaces <= 0;

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
                              {isLoadingDates
                                ? t("Freie Plätze werden geprüft …")
                                : isFull
                                  ? t("Ausgebucht")
                                  : t("Noch {count} {placeWord} verfügbar")
                                      .replace("{count}", String(itemAvailablePlaces))
                                      .replace(
                                        "{placeWord}",
                                        itemAvailablePlaces === 1 ? t("Platz") : t("Plätze")
                                      )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Max. {itemMaxParticipants} {itemMaxParticipants === 1 ? t("Person") : t("Personen")} · {t("Anfrage ohne Zahlung")}
                            </p>
                          </button>
                        );
                      })}
                    </div>
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
                      placeholder={t("Nachname")}
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
                    placeholder={t("Musterbeispiel E-Mail")}
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
                    placeholder={t("Musterbeispiel Telefonnummer")}
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
                    rows={3}
                  />
                </div>

              </div>

            </section>

            {/* ZUSAMMENFASSUNG */}
            {selectedTour && pricePerPerson > 0 && (
              <section className="border-y border-gold/30 bg-primary p-4 text-primary-foreground md:p-9">

                <p className="text-primary-foreground/70 text-xs mb-1 md:mb-2 md:text-sm">
                  {t("Deine Auswahl")}
                </p>

                <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-6">

                  <div className="min-w-0 w-full sm:flex-1">

                    <h3 className="font-display text-2xl leading-tight break-words md:text-3xl">
                      {t(selectedTour.label)}
                    </h3>

                    {selectedTour.hasTiers && (
                      <p className="text-primary-foreground/80 mt-1">
                        {persons <= 4 ? t("Jeep") : t("Minibus")}
                      </p>
                    )}

                    {travelDate && (
                      <p className="text-primary-foreground/80 text-xs mt-2 md:mt-3 md:text-sm">
                        {t("Reisetermin:")} {format(travelDate, "dd.MM.yyyy")}
                      </p>
                    )}

                    <p className="text-primary-foreground/80 text-sm mt-2">
                      {persons}{" "}
                      {persons === 1 ? t("Person") : t("Personen")}{" "}
                      × {pricePerPerson.toLocaleString("de-DE")} €
                    </p>

                  </div>

                  <div className="w-full border-t border-primary-foreground/20 pt-4 sm:w-auto sm:shrink-0 sm:border-0 sm:pt-0 sm:text-right">

                    <p className="text-primary-foreground/75 text-xs md:text-sm">
                      {t("Gesamtpreis")}
                    </p>

                    <p className="mt-1 whitespace-nowrap font-body text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                      {totalPrice.toLocaleString("de-DE")} €
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

            <div className="space-y-2 md:space-y-3">
              <Button type="button" onClick={() => void handleSubmit(onSubmit, handleInvalidSubmit)()} className="w-full min-h-12 h-12 rounded-xl md:min-h-14 md:h-14" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("Wird gesendet...")}</> : t("Unverbindliche Buchungsanfrage senden →")}
              </Button>
              <button type="button" onClick={(e) => openWhatsApp(e, "Hallo Sarina, ich habe eine Frage zu einer Kereztour-Reise.")} className="w-full text-xs md:text-sm text-primary hover:underline py-1.5 md:py-2">
                {t("Fragen zur Reise? Sarina auf WhatsApp schreiben")}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground md:text-xs">{t("Du zahlst jetzt noch nichts. Sarina bespricht mit dir die Details und sendet dir anschließend bei gewünschter verbindlicher Buchung einen persönlichen Zahlungslink.")}</p>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Buchen;
