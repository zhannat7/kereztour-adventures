import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, MessageCircle, Search, CalendarDays, ClipboardList, Users, CheckCircle2, ChevronDown, LayoutDashboard, Wallet, ChevronRight, X, Phone, UserRound, CreditCard, List, LayoutGrid } from "lucide-react";

type Booking = {
  id: string; created_at: string; name: string; email: string; phone: string;
  persons: number; travel_date: string; tier: string; tour: string | null;
  notes: string | null; total_price: number; status: string;
  payment_status?: string; deposit_amount?: number; remaining_amount?: number;
};
type Message = {
  id: string; created_at: string; name: string; email: string; tour: string | null;
  date_from: string | null; date_to: string | null; persons: number | null; message: string | null;
};
type TourDate = {
  id: string; tour: string; start_date: string; end_date: string; max_participants: number;
  economy_max_participants: number; comfort_max_participants: number; status: string;
};
type BookingEmailLog = {
  id: string; booking_id: string; recipient: string; subject: string; message: string; sent_at: string;
};

const fmt = (d: string | null) => (d ? new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString("de-DE") : "–");
const fmtRange = (start: string | null, end: string | null) => `${fmt(start)}–${fmt(end)}`;
const input = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm";

const cultureTransportLabel = (tour: string | null, persons: number) =>
  tour === "Kultur Tour" ? (persons <= 4 ? "Jeep" : "Minibus") : "–";

const DEPOSIT_PAID_MARKER = "[[DEPOSIT_PAID_150_EUR]]";

const hasDepositPaid = (booking: Booking) =>
  booking.payment_status === "deposit_paid" || (booking.notes ?? "").includes(DEPOSIT_PAID_MARKER);

const paymentStatusLabel = (status: string | undefined, notes?: string | null) => {
  if (status === "deposit_paid" || (notes ?? "").includes(DEPOSIT_PAID_MARKER)) return "150 € Anzahlung bezahlt";
  if (status === "checkout_open") return "Zahlung offen";
  if (status === "refunded") return "Erstattet";
  return "Keine Zahlung";
};

const whatsappUrl = (phone: string, name: string) => {
  const number = phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hallo ${name}, vielen Dank für deine Buchungsanfrage bei Kereztour. Wir melden uns bezüglich deines gewünschten Reisetermins bei dir.`
  );
  return `https://wa.me/${number}?text=${message}`;
};



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "up" && !data.session) toast.success("Bitte bestätigen Sie Ihre E-Mail über den Link im Postfach.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand/40 px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-md border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl text-primary">Admin</h1>
        <p className="text-sm text-muted-foreground">{mode === "in" ? "Anmelden" : "Konto erstellen"}</p>
        <input className={input} type="email" placeholder="E-Mail" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" placeholder="Passwort" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={busy} className="w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {mode === "in" ? "Anmelden" : "Registrieren"}
        </button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-xs text-muted-foreground underline">
          {mode === "in" ? "Noch kein Konto? Registrieren" : "Schon registriert? Anmelden"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground">← Zur Website</Link>
      </form>
    </div>
  );
};

const statusStyle: Record<string, string> = {
  pending: "bg-accent/20 text-foreground",
  confirmed: "bg-primary/15 text-primary",
  cancelled: "bg-destructive/15 text-destructive",
};
const statusLabel: Record<string, string> = { pending: "Offen", confirmed: "Bestätigt", cancelled: "Storniert", open: "Offen", full: "Ausgebucht" };

const BookingMessageModal = ({
  booking,
  onClose,
  onSent,
}: {
  booking: Booking;
  onClose: () => void;
  onSent: () => void;
}) => {
  const [subject, setSubject] = useState("Kereztour – deine Buchung ist bestätigt");
  const [message, setMessage] = useState("");
  const [confirmBooking, setConfirmBooking] = useState(true);
  const [suggestAppointment, setSuggestAppointment] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [sending, setSending] = useState(false);

  const defaultMessage = useMemo(() => {
    const greeting = `Hallo ${booking.name},`;
    const intro = confirmBooking
      ? "vielen Dank für deine Buchungsanfrage bei Kereztour. Wir freuen uns, dir mitteilen zu können, dass deine Buchung bestätigt ist."
      : "vielen Dank für deine Buchungsanfrage bei Kereztour. Wir melden uns gerne mit den nächsten Schritten bei dir.";
    const details = [
      "",
      "Deine Buchungsdetails:",
      `Reise: ${booking.tour ?? "–"}`,
      `Reisedatum: ${fmt(booking.travel_date)}`,
      `Personen: ${booking.persons}`,
      `Transport: ${cultureTransportLabel(booking.tour, booking.persons)}`,
      `Gesamtpreis: ${booking.total_price.toLocaleString("de-DE")} €`,
    ];
    const appointment = suggestAppointment && appointmentDate && appointmentTime
      ? [
          "",
          "Gerne würden wir noch einige Details mit dir besprechen.",
          `Termin: ${fmt(appointmentDate)} um ${appointmentTime} Uhr`,
          "Falls dieser Termin nicht passt, schlage uns gerne einen anderen Termin vor.",
        ]
      : [
          "",
          "Falls du noch Fragen hast oder weitere Details besprechen möchtest, melde dich gerne bei uns.",
        ];
    return [
      greeting,
      "",
      intro,
      ...details,
      ...appointment,
      "",
      "Bei Fragen kannst du direkt an Sarina antworten: kereztour@hotmail.com",
      "",
      "Liebe Grüße",
      "Sarina",
      "Kereztour",
    ].join("\n");
  }, [booking, confirmBooking, suggestAppointment, appointmentDate, appointmentTime]);

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  const send = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    const { error } = await supabase.functions.invoke("send-booking-email", {
      body: {
        bookingId: booking.id,
        to: booking.email,
        subject: subject.trim(),
        message: message.trim(),
        confirmBooking,
      },
    });
    setSending(false);
    if (error) {
      let detail = "Die E-Mail konnte nicht gesendet werden.";
      try {
        const context = await error.context?.json?.();
        if (context?.error) detail = context.error;
      } catch {}
      toast.error(detail);
      return;
    }
    toast.success("E-Mail wurde gesendet");
    onSent();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-2xl text-primary">E-Mail an {booking.name}</h2>
            <p className="text-sm text-muted-foreground">{booking.email}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground" aria-label="Schließen">×</button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-sm bg-muted p-3 text-sm">
            <strong>{booking.tour ?? "Reise"}</strong> · {fmt(booking.travel_date)} · {booking.persons} Personen · {booking.total_price.toLocaleString("de-DE")} €
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={confirmBooking} onChange={(e) => setConfirmBooking(e.target.checked)} />
            Buchung als bestätigt markieren
          </label>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={suggestAppointment} onChange={(e) => setSuggestAppointment(e.target.checked)} />
            Gesprächstermin vorschlagen
          </label>

          {suggestAppointment && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Datum
                <input className={input} type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
              </label>
              <label className="text-xs text-muted-foreground">
                Uhrzeit
                <input className={input} type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
              </label>
            </div>
          )}

          <label className="block text-sm font-medium">
            Betreff
            <input className={`${input} mt-1`} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>

          <label className="block text-sm font-medium">
            Nachricht
            <textarea
              className={`${input} mt-1 min-h-[360px] resize-y leading-6`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          <p className="text-xs text-muted-foreground">
            Du kannst die Nachricht vor dem Senden vollständig ändern. Die E-Mail wird erst nach Klick auf „E-Mail senden“ verschickt.
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            <button onClick={onClose} disabled={sending} className="rounded-sm border border-border px-4 py-2 text-sm">
              Abbrechen
            </button>
            <button onClick={send} disabled={sending || !message.trim()} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              <Mail className="h-4 w-4" />
              {sending ? "Wird gesendet…" : "E-Mail senden"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ session }: { session: Session }) => {
  const [tab, setTab] = useState<"overview" | "bookings" | "payments" | "messages" | "dates">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dates, setDates] = useState<TourDate[]>([]);
  const [emailLogs, setEmailLogs] = useState<Record<string, BookingEmailLog[]>>({});
  const [nd, setNd] = useState({
    tour: "Kultur Tour",
    start_date: "",
    end_date: "",
    max_participants: 15,
    economy_max_participants: 12,
    comfort_max_participants: 4,
  });
  const [messageBooking, setMessageBooking] = useState<Booking | null>(null);
  const [bookingSearch, setBookingSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingView, setBookingView] = useState<"list" | "cards" | "kanban">("list");
  const [notesDraft, setNotesDraft] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [tourFilter, setTourFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "unpaid">("all");

  const load = async () => {
    const [b, m, d, e] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("tour_dates").select("*").order("start_date"),
      (supabase as any).from("booking_email_log").select("id, booking_id, recipient, subject, message, sent_at").order("sent_at", { ascending: false }),
    ]);
    setBookings((b.data as Booking[]) ?? []);
    setMessages((m.data as Message[]) ?? []);
    setDates((d.data as TourDate[] | null) ?? []);
    const grouped: Record<string, BookingEmailLog[]> = {};
    for (const row of (e.data ?? []) as BookingEmailLog[]) {
      (grouped[row.booking_id] ??= []).push(row);
    }
    setEmailLogs(grouped);
    if (e.error) console.error("Booking email log could not be loaded:", e.error);
  };
  useEffect(() => { load(); }, []);

  const openBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setNotesDraft((booking.notes ?? "").split(DEPOSIT_PAID_MARKER).join("").trim());
  };

  const saveBookingNotes = async () => {
    if (!selectedBooking) return;
    setNotesSaving(true);
    const hasPaidMarker = (selectedBooking.notes ?? "").includes(DEPOSIT_PAID_MARKER);
    const cleaned = notesDraft.trim();
    const notes = [cleaned, ...(hasPaidMarker ? [DEPOSIT_PAID_MARKER] : [])].filter(Boolean).join("\n") || null;
    const { error } = await supabase.from("bookings").update({ notes }).eq("id", selectedBooking.id);
    setNotesSaving(false);
    if (error) return toast.error("Notiz konnte nicht gespeichert werden: " + error.message);
    setBookings((current) => current.map((b) => b.id === selectedBooking.id ? { ...b, notes } : b));
    setSelectedBooking((current) => current?.id === selectedBooking.id ? { ...current, notes } : current);
    toast.success("Notiz gespeichert.");
  };

  const setDepositPaid = async (id: string, paid: boolean) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    const existingNotes = (booking.notes ?? "").split(DEPOSIT_PAID_MARKER).join("").trim();
    const notes = paid
      ? [existingNotes, DEPOSIT_PAID_MARKER].filter(Boolean).join("\n")
      : existingNotes || null;
    const { error } = await supabase.from("bookings").update({
      notes,
      payment_status: paid ? "deposit_paid" : "unpaid",
    }).eq("id", id);
    if (error) return toast.error(error.message);
    setBookings((current) => current.map((b) => b.id === id ? {
      ...b,
      notes,
      payment_status: paid ? "deposit_paid" : "unpaid",
    } : b));
    toast.success(paid ? "Anzahlung als bezahlt gespeichert." : "Anzahlung als nicht bezahlt gespeichert.");
  };

  const setBookingStatus = async (id: string, status: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (status === "confirmed" && !(booking && hasDepositPaid(booking))) {
      return toast.error("Bitte zuerst die Anzahlung von 150 € als bezahlt markieren.");
    }
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setBookings((current) => current.map((b) => b.id === id ? { ...b, status } : b));
    toast.success(status === "confirmed" ? "Buchung bestätigt. Verfügbare Plätze werden aktualisiert." : "Status aktualisiert");
  };
  const updateDate = async (id: string, patch: Partial<TourDate>) => {
    const { error } = await (supabase as any).from("tour_dates").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const addDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nd.end_date < nd.start_date) {
      return toast.error("Das Enddatum darf nicht vor dem Startdatum liegen.");
    }

    const { error } = await (supabase as any).from("tour_dates").insert(nd);
    if (error) return toast.error(error.message);
    toast.success("Termin hinzugefügt");
    setNd({ ...nd, start_date: "", end_date: "" });
    load();
  };
  const deleteDate = async (id: string) => {
    if (!confirm("Termin wirklich löschen?")) return;
    const { error } = await supabase.from("tour_dates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  // Kyrchyn Tour is no longer managed on this website; hide legacy database rows in the dashboard.
  const visibleDates = dates.filter((d) => d.tour !== "Kyrchyn Tour");
  const filteredBookings = bookings.filter((b) => {
    const query = bookingSearch.trim().toLowerCase();
    const matchesQuery = !query || [b.name, b.email, b.phone, b.tour ?? "", b.travel_date].some((v) => v.toLowerCase().includes(query));
    const matchesTour = tourFilter === "all" || b.tour === tourFilter;
    return matchesQuery && matchesTour && (bookingFilter === "all" || (bookingFilter === "unpaid" ? !hasDepositPaid(b) && b.status !== "cancelled" : b.status === bookingFilter));
  });
  const booked = (d: TourDate) =>
    bookings.filter((b) => b.status === "confirmed" && b.travel_date === d.start_date && b.tour === d.tour).reduce((s, b) => s + b.persons, 0);

  const openBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const unpaidBookings = bookings.filter((b) => !hasDepositPaid(b) && b.status !== "cancelled");
  const upcomingDates = visibleDates.filter((d) => d.start_date >= new Date().toISOString().slice(0, 10)).slice(0, 4);

  const tabs = [
    { k: "overview", l: "Übersicht" },
    { k: "bookings", l: `Buchungen · ${bookings.length}` },
    { k: "payments", l: `Zahlungen · ${unpaidBookings.length}` },
    { k: "messages", l: `Kontaktanfragen · ${messages.length}` },
    { k: "dates", l: `Reisetermine · ${visibleDates.length}` },
  ] as const;

  return (
    <div className="min-h-screen bg-sand/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><CalendarDays className="h-5 w-5" /></span>
            <div>
              <span className="font-display text-2xl text-primary">Kereztour</span>
              <p className="text-xs text-muted-foreground">Verwaltungsbereich</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden max-w-[240px] truncate text-muted-foreground md:inline">{session.user.email}</span>
            <Link to="/" className="rounded-md border border-border bg-card px-3 py-2 hover:bg-muted">Website ansehen</Link>
            <button onClick={() => supabase.auth.signOut()} className="rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground">Abmelden</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-7">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Übersicht</p>
          <h1 className="font-display text-3xl text-primary">Guten Tag, Sarina</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Alles an einem Ort: Buchungen bearbeiten, Kunden kontaktieren und Reisetermine verwalten.</p>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button onClick={() => { setTab("bookings"); setBookingFilter("pending"); }} className="text-left"><Stat icon={<ClipboardList className="h-5 w-5" />} label="Offene Anfragen" value={openBookings.length} hint="Prüfen und beantworten" /></button>
          <button onClick={() => { setTab("bookings"); setBookingFilter("confirmed"); }} className="text-left"><Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Bestätigte Buchungen" value={confirmedBookings.length} hint="Buchung ist bestätigt" /></button>
          <button onClick={() => { setTab("bookings"); setBookingFilter("unpaid"); }} className="text-left"><Stat icon={<Wallet className="h-5 w-5" />} label="Anzahlungen offen" value={unpaidBookings.length} hint="150 € noch nicht als bezahlt markiert" /></button>
          <button onClick={() => setTab("messages")} className="text-left"><Stat icon={<Users className="h-5 w-5" />} label="Kontaktanfragen" value={messages.length} hint="Nachrichten von Gästen" /></button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 border-b border-border pb-3">
          {tabs.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${tab === t.k ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {t.k === "overview" ? <LayoutDashboard className="mr-2 inline h-4 w-4" /> : t.k === "bookings" ? <ClipboardList className="mr-2 inline h-4 w-4" /> : t.k === "payments" ? <Wallet className="mr-2 inline h-4 w-4" /> : t.k === "messages" ? <Mail className="mr-2 inline h-4 w-4" /> : <CalendarDays className="mr-2 inline h-4 w-4" />}
              {t.l}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Das braucht deine Aufmerksamkeit</h2>
              <p className="mt-1 text-sm text-muted-foreground">Wähle eine Aufgabe, um direkt zum richtigen Bereich zu gelangen.</p>
              <div className="mt-3 divide-y divide-border">
                <button onClick={() => { setTab("bookings"); setBookingFilter("pending"); }} className="flex w-full items-center gap-3 py-4 text-left hover:bg-muted/30">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-800"><ClipboardList className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-medium">Buchungsanfragen prüfen</span><span className="text-sm text-muted-foreground">Noch nicht bestätigte Anfragen</span></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{openBookings.length}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setTab("bookings"); setBookingFilter("unpaid"); }} className="flex w-full items-center gap-3 py-4 text-left hover:bg-muted/30">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-800"><Wallet className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-medium">Anzahlungen überprüfen</span><span className="text-sm text-muted-foreground">150 € als bezahlt markieren, wenn eingegangen</span></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{unpaidBookings.length}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => setTab("messages")} className="flex w-full items-center gap-3 py-4 text-left hover:bg-muted/30">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-medium">Kontaktanfragen ansehen</span><span className="text-sm text-muted-foreground">Nachrichten von Interessenten öffnen</span></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{messages.length}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </section>
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Kommende Reisetermine</h2>
              <p className="mt-1 text-sm text-muted-foreground">Die nächsten geplanten Abreisen.</p>
              {upcomingDates.length ? <div className="mt-3 divide-y divide-border">{upcomingDates.map((d) => <div key={d.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{d.tour}</p><p className="text-sm text-muted-foreground">{fmtRange(d.start_date, d.end_date)}</p></div><span className="whitespace-nowrap text-xs text-muted-foreground">{Math.max(0, d.max_participants - booked(d))} Plätze frei</span></div>)}</div> : <p className="mt-3 rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">Keine zukünftigen Reisetermine eingetragen.</p>}
              <button onClick={() => setTab("dates")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Alle Reisetermine verwalten <ChevronRight className="h-4 w-4" /></button>
            </section>
          </div>
        )}

        {(tab === "bookings" || tab === "payments") && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="mb-3">
                <h2 className="text-lg font-semibold">{tab === "payments" ? "Zahlungen verwalten" : "Buchungen verwalten"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{tab === "payments" ? "Prüfe die Anzahlung von 150 € und markiere sie erst nach tatsächlichem Zahlungseingang als bezahlt." : "Eine Buchung nach der anderen. Prüfe zuerst die Anzahlung und bestätige danach die Buchung."}</p>
              </div>
              <div className="mb-3 grid gap-2 rounded-lg bg-muted/40 p-3 text-sm sm:grid-cols-3">
                <div><span className="font-semibold text-primary">1.</span> Anfrage und Reisedaten prüfen</div>
                <div><span className="font-semibold text-primary">2.</span> 150 € Anzahlung als bezahlt markieren</div>
                <div><span className="font-semibold text-primary">3.</span> „Buchung bestätigen“ auswählen</div>
              </div>
              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm" value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)} placeholder="Name, E-Mail, Telefon oder Reise suchen…" />
                </div>
                <div className="flex flex-wrap gap-1 rounded-md bg-muted p-1">
                  {([{value:"all",label:"Alle Buchungen"},{value:"pending",label:"Offen"},{value:"confirmed",label:"Bestätigt"},{value:"unpaid",label:"Anzahlung offen"},{value:"cancelled",label:"Storniert"}] as const).map((f) => (
                    <button key={f.value} onClick={() => setBookingFilter(f.value)} className={`rounded px-2.5 py-1.5 text-xs font-semibold ${bookingFilter === f.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
                  ))}
                </div>
              </div>
            </div>
            {filteredBookings.length === 0 && <Empty text={bookings.length === 0 ? "Noch keine Buchungen vorhanden." : "Keine passenden Buchungen gefunden. Ändere den Suchbegriff oder wähle „Alle“."} />}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">Reise
                <select value={tourFilter} onChange={(e) => setTourFilter(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option value="all">Alle Reisen</option><option value="Kultur Tour">Kultur Tour</option><option value="Intensiv-Trekking">Intensiv-Trekking</option>
                </select>
              </label>
              <div className="flex gap-1 rounded-md border border-border p-1">
                <button onClick={() => setBookingView("list")} title="Tabellenansicht" aria-label="Tabellenansicht" className={`rounded px-2 py-1.5 ${bookingView === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><List className="h-4 w-4" /></button>
                <button onClick={() => setBookingView("cards")} title="Kartenansicht" aria-label="Kartenansicht" className={`rounded px-2 py-1.5 ${bookingView === "cards" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><LayoutGrid className="h-4 w-4" /></button>
              </div>
            </div>
            {bookingView === "list" && filteredBookings.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr>
                    <th className="px-4 py-3">Gast</th><th className="px-4 py-3">Reise / Termin</th><th className="px-4 py-3">Buchung</th><th className="px-4 py-3">Anzahlung</th><th className="px-4 py-3">Gesamtpreis</th><th className="px-4 py-3">Kontakt</th><th className="px-4 py-3"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3"><button onClick={() => openBooking(b)} className="text-left font-semibold hover:text-primary">{b.name}</button><p className="mt-1 max-w-[210px] truncate text-xs text-muted-foreground">{b.email || "Keine E-Mail"}</p></td>
                        <td className="px-4 py-3"><p className="font-medium">{b.tour ?? "Reise"}</p><p className="mt-1 text-xs text-muted-foreground">{fmt(b.travel_date)} · {b.persons} {b.persons === 1 ? "Person" : "Personen"}</p></td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[b.status] ?? "bg-muted text-foreground"}`}>{statusLabel[b.status] ?? b.status}</span></td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${hasDepositPaid(b) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{hasDepositPaid(b) ? "150 € bezahlt" : "Offen"}</span></td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold">{b.total_price.toLocaleString("de-DE")} €</td>
                        <td className="px-4 py-3"><div className="flex items-center gap-1.5">
                          {b.phone && <a href={`https://wa.me/${b.phone.replace(/\\D/g, "")}`} target="_blank" rel="noopener noreferrer" title={`WhatsApp an ${b.name}`} aria-label={`WhatsApp an ${b.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#25D366] hover:bg-[#25D366]/10"><MessageCircle className="h-5 w-5" /></a>}
                          {b.email && <a href={`mailto:${b.email}`} title="E-Mail schreiben" aria-label="E-Mail schreiben" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><Mail className="h-4 w-4" /></a>}
                          {b.phone && <a href={`tel:${b.phone}`} title="Anrufen" aria-label="Anrufen" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><Phone className="h-4 w-4" /></a>}
                        </div></td>
                        <td className="px-4 py-3"><button onClick={() => setSelectedBooking(b)} className="whitespace-nowrap rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">Profil öffnen</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {bookingView === "cards" && filteredBookings.map((b) => (
              <article key={b.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{b.name}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[b.status] ?? "bg-muted text-foreground"}`}>{statusLabel[b.status] ?? b.status}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${hasDepositPaid(b) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{paymentStatusLabel(b.payment_status, b.notes)}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <a href={`mailto:${b.email}`} className="hover:text-primary">{b.email}</a>
                      <span className="inline-flex items-center gap-2"><a href={`tel:${b.phone}`} className="hover:text-primary">{b.phone}</a>{b.phone && <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" title={`WhatsApp an ${b.name}`} aria-label={`WhatsApp an ${b.name}`} className="text-[#25D366] hover:opacity-75"><MessageCircle className="h-4 w-4" /></a>}</span>
                      <span>Anfrage vom {fmt(b.created_at)}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Gesamtpreis</p>
                    <p className="font-display text-2xl text-primary">{b.total_price.toLocaleString("de-DE")} €</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-muted/20 px-4 py-4 sm:grid-cols-4 sm:px-5">
                  <Info l="Reise" v={b.tour ?? "–"} />
                  <Info l="Reisedatum" v={fmt(b.travel_date)} />
                  <Info l="Personen" v={String(b.persons)} />
                  <Info l="Transport" v={cultureTransportLabel(b.tour, b.persons)} />
                </div>
                <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:px-5">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="text-sm font-medium">Anzahlung: <strong>150 €</strong></span>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" checked={hasDepositPaid(b)} onChange={(e) => setDepositPaid(b.id, e.target.checked)} className="h-4 w-4 accent-primary" />
                      <span>Anzahlung bezahlt</span>
                    </label>
                    <span className={`text-sm font-medium ${hasDepositPaid(b) ? "text-primary" : "text-muted-foreground"}`}>{hasDepositPaid(b) ? "Bezahlt" : "Noch nicht bezahlt"}</span>
                  </div>
                  {b.notes?.split(DEPOSIT_PAID_MARKER).join("").trim() && <p className="text-sm text-muted-foreground">{b.notes.split(DEPOSIT_PAID_MARKER).join("").trim()}</p>}
                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <a href={`mailto:${b.email}?subject=${encodeURIComponent("Kereztour – Buchungsbestätigung")}&body=${encodeURIComponent(`Hallo ${b.name},\\n\\nwir bestätigen den Eingang deiner Anzahlung von 150 € und deine Buchung bei Kereztour.\\n\\nReise: ${b.tour ?? "–"}\\nReisedatum: ${fmt(b.travel_date)}\\nPersonen: ${b.persons}\\nGesamtpreis: ${b.total_price.toLocaleString("de-DE")} €\\n\\nBei Fragen antworte gerne auf diese E-Mail.\\n\\nLiebe Grüße\\nSarina\\nKereztour`)}`} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"><Mail className="h-4 w-4" />Bestätigungs-E-Mail</a>
                    <a href={whatsappUrl(b.phone, b.name)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"><MessageCircle className="h-4 w-4" />WhatsApp</a>
                    <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                      {b.status !== "confirmed" && <button onClick={() => setBookingStatus(b.id, "confirmed")} disabled={!hasDepositPaid(b)} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Buchung bestätigen</button>}
                      {b.status !== "pending" && <button onClick={() => setBookingStatus(b.id, "pending")} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">Auf offen setzen</button>}
                      {b.status !== "cancelled" && <button onClick={() => setBookingStatus(b.id, "cancelled")} className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/5">Stornieren</button>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelectedBooking(null)}>
            <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-card px-5 py-4">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gästeprofil · Kereztour</p><h2 className="mt-1 text-xl font-semibold">{selectedBooking.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selectedBooking.tour ?? "Reise"} · {fmt(selectedBooking.travel_date)}</p></div>
                <button onClick={() => setSelectedBooking(null)} aria-label="Profil schließen" className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4 p-5">
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-primary" />Kontaktdaten</h3>
                  <div className="space-y-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Telefon</p><div className="flex flex-wrap items-center gap-3"><span className="font-medium">{selectedBooking.phone || "Keine Telefonnummer hinterlegt"}</span>{selectedBooking.phone && <><a href={"https://wa.me/" + selectedBooking.phone.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366]/10 px-3 py-1.5 font-semibold text-[#168A43]"><MessageCircle className="h-4 w-4" />WhatsApp öffnen</a><a href={"tel:" + selectedBooking.phone} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5"><Phone className="h-4 w-4" />Anrufen</a></>}</div></div>
                    <div><p className="text-xs text-muted-foreground">E-Mail</p>{selectedBooking.email ? <a href={"mailto:" + selectedBooking.email} className="font-medium hover:text-primary">{selectedBooking.email}</a> : <p>Keine E-Mail-Adresse hinterlegt</p>}</div>
                  </div>
                </section>
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4 text-primary" />Reisedetails</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm"><Info l="Reise" v={selectedBooking.tour ?? "–"} /><Info l="Reisedatum" v={fmt(selectedBooking.travel_date)} /><Info l="Personen" v={String(selectedBooking.persons)} /><Info l="Transport" v={cultureTransportLabel(selectedBooking.tour, selectedBooking.persons)} /><Info l="Kategorie" v={selectedBooking.tier || "–"} /><Info l="Anfrage vom" v={fmt(selectedBooking.created_at)} /></div>
                </section>
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold"><CreditCard className="h-4 w-4 text-primary" />Buchung und Zahlung</h3>
                  <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Buchungsstatus</span><span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + (statusStyle[selectedBooking.status] ?? "bg-muted")}>{statusLabel[selectedBooking.status] ?? selectedBooking.status}</span></div>
                  <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Gesamtpreis</span><strong>{selectedBooking.total_price.toLocaleString("de-DE")} €</strong></div>
                  <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Anzahlung 150 €</span><label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={hasDepositPaid(selectedBooking)} onChange={(e) => { const paid=e.target.checked; setDepositPaid(selectedBooking.id, paid); setSelectedBooking((current) => current ? {...current, payment_status: paid ? "deposit_paid" : "unpaid"} : null); }} />Als bezahlt markieren</label></div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedBooking.status !== "confirmed" && <button onClick={() => { setBookingStatus(selectedBooking.id, "confirmed"); setSelectedBooking((current) => current ? {...current, status:"confirmed"} : null); }} disabled={!hasDepositPaid(selectedBooking)} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">Buchung bestätigen</button>}
                    {selectedBooking.status !== "pending" && <button onClick={() => { setBookingStatus(selectedBooking.id, "pending"); setSelectedBooking((current) => current ? {...current, status:"pending"} : null); }} className="rounded-md border border-border px-3 py-2 text-sm">Auf offen setzen</button>}
                    <button onClick={() => setMessageBooking(selectedBooking)} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"><Mail className="h-4 w-4" />E-Mail verfassen</button>
                  </div>
                </section>
                <section className="rounded-xl border border-border p-4"><h3 className="mb-3 font-semibold">Notizen</h3><p className="whitespace-pre-wrap text-sm text-muted-foreground">{selectedBooking.notes?.split(DEPOSIT_PAID_MARKER).join("").trim() || "Noch keine Notizen hinterlegt."}</p></section>
                <section className="rounded-xl border border-border p-4"><h3 className="mb-3 font-semibold">Aktivitäten</h3><p className="text-sm text-muted-foreground">Buchungsanfrage eingegangen am {fmt(selectedBooking.created_at)}.</p>{(emailLogs[selectedBooking.id] ?? []).length > 0 && <div className="mt-3 space-y-2">{emailLogs[selectedBooking.id].map((log) => <div key={log.id} className="rounded-md bg-muted/40 p-3 text-sm"><p className="font-medium">{log.subject}</p><p className="text-xs text-muted-foreground">An {log.recipient} · {fmt(log.sent_at)}</p></div>)}</div>}</section>
              </div>
            </aside>
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Kontaktanfragen</h2>
              <p className="mt-1 text-sm text-muted-foreground">Kontaktiere Interessenten direkt per E-Mail und prüfe ihre Nachricht.</p>
            </div>
            {messages.length === 0 && <Empty text="Noch keine Anfragen." />}
            {messages.map((m) => (
              <div key={m.id} className="rounded-md border border-border bg-card p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{m.name}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Kereztour – deine Anfrage")}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                        {m.email}
                      </a>
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Kereztour – deine Anfrage")}`} className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted">
                        <Mail className="h-3.5 w-3.5" />
                        E-Mail schreiben
                      </a>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{fmt(m.created_at)}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  <Info l="Reise" v={m.tour ?? "–"} />
                  <Info l="Zeitraum" v={fmtRange(m.date_from, m.date_to)} />
                  <Info l="Personen" v={m.persons ? String(m.persons) : "–"} />
                </div>
                {m.message && <p className="mt-3 whitespace-pre-wrap rounded-sm bg-muted p-3 text-sm">{m.message}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "dates" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Reisetermine & Kapazitäten</h2>
              <p className="mt-1 text-sm text-muted-foreground">Lege Termine an und verwalte die maximale Teilnehmerzahl für jeden Termin.</p>
            </div>
            <form onSubmit={addDate} className="grid grid-cols-1 gap-3 rounded-md border border-border bg-card p-5 sm:grid-cols-5 sm:items-end">
              <label className="text-xs text-muted-foreground">Reise
                <select
                  className={input}
                  value={nd.tour}
                  onChange={(e) => setNd({ ...nd, tour: e.target.value })}
                >
                  <option>Kultur Tour</option>
                  <option>Intensiv-Trekking</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground">Beginn
                <input className={input} type="date" required value={nd.start_date} onChange={(e) => setNd({ ...nd, start_date: e.target.value })} />
              </label>
              <label className="text-xs text-muted-foreground">Ende
                <input className={input} type="date" required value={nd.end_date} onChange={(e) => setNd({ ...nd, end_date: e.target.value })} />
              </label>

              {nd.tour === "Kultur Tour" ? (
                <>
                  <label className="text-xs text-muted-foreground">Jeep – max. Personen
                    <input
                      className={input}
                      type="number"
                      min={1}
                      required
                      value={nd.economy_max_participants}
                      onChange={(e) => setNd({ ...nd, economy_max_participants: Number(e.target.value) })}
                    />
                  </label>
                  <label className="text-xs text-muted-foreground">Minibus – max. Personen
                    <input
                      className={input}
                      type="number"
                      min={1}
                      required
                      value={nd.comfort_max_participants}
                      onChange={(e) => setNd({ ...nd, comfort_max_participants: Number(e.target.value) })}
                    />
                  </label>
                </>
              ) : (
                <label className="text-xs text-muted-foreground">Max. Personen
                  <input
                    className={input}
                    type="number"
                    min={1}
                    required
                    value={nd.max_participants}
                    onChange={(e) => setNd({ ...nd, max_participants: Number(e.target.value) })}
                  />
                </label>
              )}

              <button className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Termin hinzufügen</button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="p-3">Reise</th><th className="p-3">Zeitraum</th><th className="p-3">Belegt</th><th className="p-3">Kapazität</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {visibleDates.map((d) => {
                    const economyBooked = bookings
                      .filter((b) => b.status === "confirmed" && b.travel_date === d.start_date && b.tour === d.tour && b.tier === "economy")
                      .reduce((s, b) => s + b.persons, 0);
                    const comfortBooked = bookings
                      .filter((b) => b.status === "confirmed" && b.travel_date === d.start_date && b.tour === d.tour && b.tier === "comfort")
                      .reduce((s, b) => s + b.persons, 0);

                    return (
                      <tr key={d.id} className="border-t border-border">
                        <td className="p-3 font-medium">{d.tour}</td>
                        <td className="p-3">{fmtRange(d.start_date, d.end_date)}</td>
                        <td className="p-3">
                          {d.tour === "Kultur Tour" ? (
                            <div className="space-y-1">
                              <div>Jeep: {comfortBooked}</div>
                              <div>Minibus: {economyBooked}</div>
                            </div>
                          ) : booked(d)}
                        </td>
                        <td className="p-3">
                          {d.tour === "Kultur Tour" ? (
                            <div className="space-y-2">
                              <label className="block text-xs text-muted-foreground">Minibus
                                <input
                                  type="number"
                                  min={1}
                                  defaultValue={d.economy_max_participants}
                                  className="mt-1 w-24 rounded-sm border border-border bg-background px-2 py-1"
                                  onBlur={(e) => {
                                    const value = Number(e.target.value);
                                    if (value !== d.economy_max_participants) {
                                      updateDate(d.id, { economy_max_participants: value });
                                    }
                                  }}
                                />
                              </label>
                              <label className="block text-xs text-muted-foreground">Jeep
                                <input
                                  type="number"
                                  min={1}
                                  defaultValue={d.comfort_max_participants}
                                  className="mt-1 w-24 rounded-sm border border-border bg-background px-2 py-1"
                                  onBlur={(e) => {
                                    const value = Number(e.target.value);
                                    if (value !== d.comfort_max_participants) {
                                      updateDate(d.id, { comfort_max_participants: value });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          ) : (
                            <input type="number" min={1} defaultValue={d.max_participants} className="w-20 rounded-sm border border-border bg-background px-2 py-1"
                              onBlur={(e) => Number(e.target.value) !== d.max_participants && updateDate(d.id, { max_participants: Number(e.target.value) })} />
                          )}
                        </td>
                        <td className="p-3">
                          <select value={d.status} onChange={(e) => updateDate(d.id, { status: e.target.value })} className="rounded-sm border border-border bg-background px-2 py-1">
                            <option value="open">Offen</option><option value="full">Ausgebucht</option><option value="cancelled">Abgesagt</option>
                          </select>
                        </td>
                        <td className="p-3 text-right"><button onClick={() => deleteDate(d.id)} className="text-destructive hover:underline">Löschen</button></td>
                      </tr>
                    );
                  })}
                  {visibleDates.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Keine Termine.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      {messageBooking && (
        <BookingMessageModal
          booking={messageBooking}
          onClose={() => setMessageBooking(null)}
          onSent={load}
        />
      )}
    </div>
  );
};

const Stat = ({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: number; hint: string }) => (
  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
    <div className="min-w-0">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl text-primary">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  </div>
);
const Info = ({ l, v }: { l: string; v: string }) => (
  <div><div className="text-xs text-muted-foreground">{l}</div><div>{v}</div></div>
);
const Empty = ({ text }: { text: string }) => (
  <div className="rounded-md border border-dashed border-border bg-card p-10 text-center text-muted-foreground">{text}</div>
);

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" })
      .then(({ data, error }) => setIsAdmin(!error && data === true));
  }, [session]);

  if (!ready) return null;
  if (!session) return <Login />;
  if (isAdmin === null) return <div className="p-10 text-center text-muted-foreground">Lädt…</div>;
  if (!isAdmin)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p>Dieses Konto hat keinen Admin-Zugriff.</p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-sm border border-border px-4 py-2 text-sm">Abmelden</button>
      </div>
    );
  return <Dashboard session={session} />;
};

export default Admin;
