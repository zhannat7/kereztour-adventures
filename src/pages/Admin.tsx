import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, MessageCircle, Search, Save, FileText, RotateCcw, History, CheckCircle2 } from "lucide-react";
import { getEditableTextEntries, getEditableTextFallback, type Language } from "@/i18n/LanguageContext";

type Booking = {
  id: string; created_at: string; name: string; email: string; phone: string;
  persons: number; travel_date: string; tier: string; tour: string | null;
  notes: string | null; total_price: number; status: string;
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

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("de-DE") : "–");
const input = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm";

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
      `Reisevariante: ${booking.tier === "standard" ? "Standard" : booking.tier}`,
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
  const [tab, setTab] = useState<"bookings" | "messages" | "dates" | "texts">("bookings");
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
  const [textLanguage, setTextLanguage] = useState<Language>("DE");
  const [textSearch, setTextSearch] = useState("");
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [textPreviousValues, setTextPreviousValues] = useState<Record<string, string>>({});
  const [textDirty, setTextDirty] = useState<Record<string, boolean>>({});
  const [textHistory, setTextHistory] = useState<Record<string, Array<{ id: string; previous_value: string; new_value: string; changed_at: string }>>>({});
  const [savingText, setSavingText] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

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

  const loadTextOverrides = async () => {
    const [{ data, error }, { data: historyData, error: historyError }] = await Promise.all([
      (supabase as any).from("site_content").select("content_key, language, value"),
      (supabase as any)
        .from("site_content_versions")
        .select("id, content_key, language, previous_value, new_value, changed_at")
        .eq("language", textLanguage)
        .order("changed_at", { ascending: false }),
    ]);

    if (error) {
      toast.error("Texte konnten nicht geladen werden.");
      return;
    }
    if (historyError) toast.error("Versionshistorie konnte nicht geladen werden.");

    const values: Record<string, string> = {};
    const previousValues: Record<string, string> = {};
    for (const entry of getEditableTextEntries()) {
      previousValues[entry.key] = getEditableTextFallback(textLanguage, entry.key);
    }
    for (const row of (data ?? []) as Array<{ content_key: string; language: Language; value: string }>) {
      if (row.language === textLanguage) {
        values[row.content_key] = row.value;
        previousValues[row.content_key] = row.value;
      }
    }

    const history: Record<string, Array<{ id: string; previous_value: string; new_value: string; changed_at: string }>> = {};
    for (const row of (historyData ?? []) as Array<{ id: string; content_key: string; previous_value: string; new_value: string; changed_at: string }>) {
      (history[row.content_key] ??= []).push(row);
    }

    setTextValues(values);
    setTextPreviousValues(previousValues);
    setTextHistory(history);
    setTextDirty({});
  };

  useEffect(() => {
    if (tab === "texts") void loadTextOverrides();
  }, [tab, textLanguage]);

  const saveText = async (key: string) => {
    const value = textValues[key]?.trim() ?? "";
    const previous = textPreviousValues[key] ?? getEditableTextFallback(textLanguage, key);

    if (!value) return toast.error("Der Text darf nicht leer sein.");
    if (value.length > 5000) return toast.error("Maximal 5.000 Zeichen pro Text.");
    if (value === previous) {
      setTextDirty((current) => ({ ...current, [key]: false }));
      return toast.info("Keine Änderung vorhanden.");
    }

    setSavingText(key);

    const { error: historyError } = await (supabase as any)
      .from("site_content_versions")
      .insert({
        content_key: key,
        language: textLanguage,
        previous_value: previous,
        new_value: value,
        changed_by: session.user.id,
      });

    if (historyError) {
      setSavingText(null);
      return toast.error("Versionshistorie konnte nicht gespeichert werden.");
    }

    const { error } = await (supabase as any)
      .from("site_content")
      .upsert(
        { content_key: key, language: textLanguage, value, updated_at: new Date().toISOString() },
        { onConflict: "content_key,language" },
      );

    setSavingText(null);
    if (error) return toast.error("Text konnte nicht gespeichert werden.");

    setTextPreviousValues((current) => ({ ...current, [key]: value }));
    setTextHistory((current) => ({
      ...current,
      [key]: [
        {
          id: crypto.randomUUID(),
          previous_value: previous,
          new_value: value,
          changed_at: new Date().toISOString(),
        },
        ...(current[key] ?? []),
      ].slice(0, 10),
    }));
    setTextValues((current) => ({ ...current, [key]: value }));
    setTextDirty((current) => ({ ...current, [key]: false }));
    setPreviewKey((current) => current + 1);
    toast.success("Text gespeichert");
  };

  const resetText = async (key: string) => {
    const original = getEditableTextFallback(textLanguage, key);
    const previous = textPreviousValues[key] ?? original;
    if (previous === original) return;

    setSavingText(key);

    const { error: historyError } = await (supabase as any)
      .from("site_content_versions")
      .insert({
        content_key: key,
        language: textLanguage,
        previous_value: previous,
        new_value: original,
        changed_by: session.user.id,
      });

    if (historyError) {
      setSavingText(null);
      return toast.error("Versionshistorie konnte nicht gespeichert werden.");
    }

    const { error } = await (supabase as any)
      .from("site_content")
      .upsert(
        { content_key: key, language: textLanguage, value: original, updated_at: new Date().toISOString() },
        { onConflict: "content_key,language" },
      );

    setSavingText(null);
    if (error) return toast.error("Originaltext konnte nicht wiederhergestellt werden.");

    setTextValues((current) => ({ ...current, [key]: original }));
    setTextPreviousValues((current) => ({ ...current, [key]: original }));
    setTextHistory((current) => ({
      ...current,
      [key]: [
        {
          id: crypto.randomUUID(),
          previous_value: previous,
          new_value: original,
          changed_at: new Date().toISOString(),
        },
        ...(current[key] ?? []),
      ].slice(0, 10),
    }));
    setTextDirty((current) => ({ ...current, [key]: false }));
    toast.success("Originaltext wiederhergestellt");
  };

  const setBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status aktualisiert");
    load();
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

  const booked = (d: TourDate) =>
    bookings.filter((b) => b.status === "confirmed" && b.travel_date === d.start_date && b.tour === d.tour).reduce((s, b) => s + b.persons, 0);

  const tabs = [
    { k: "bookings", l: `Buchungen (${bookings.length})` },
    { k: "messages", l: `Anfragen (${messages.length})` },
    { k: "dates", l: `Reisetermine (${dates.length})` },
    { k: "texts", l: "Texte" },
  ] as const;

  return (
    <div className="min-h-screen bg-sand/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div>
            <span className="font-display text-2xl text-primary">Kereztour</span>
            <span className="ml-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{session.user.email}</span>
            <Link to="/" className="text-muted-foreground hover:text-primary">Website</Link>
            <button onClick={() => supabase.auth.signOut()} className="rounded-sm border border-border px-3 py-1.5 hover:bg-muted">Abmelden</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Offene Buchungen" value={bookings.filter((b) => b.status === "pending").length} />
          <Stat label="Bestätigte Buchungen" value={bookings.filter((b) => b.status === "confirmed").length} />
          <Stat label="Anfragen gesamt" value={messages.length} />
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium ${tab === t.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>

        {tab === "bookings" && (
          <div className="space-y-3">
            {bookings.length === 0 && <Empty text="Noch keine Buchungen." />}
            {bookings.map((b) => (
              <div key={b.id} className="rounded-md border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{b.name}</h3>
                      <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${statusStyle[b.status] ?? ""}`}>{statusLabel[b.status] ?? b.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <a href={`mailto:${b.email}`} className="hover:text-primary">{b.email}</a> · <a href={`tel:${b.phone}`} className="hover:text-primary">{b.phone}</a>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-primary">{b.total_price.toLocaleString("de-DE")} €</div>
                    <div className="text-xs text-muted-foreground">eingegangen {fmt(b.created_at)}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <Info l="Reise" v={b.tour ?? "–"} /><Info l="Reisedatum" v={fmt(b.travel_date)} />
                  <Info l="Personen" v={String(b.persons)} /><Info l="Tarif" v={b.tier} />
                </div>
                {b.notes && <p className="mt-3 rounded-sm bg-muted p-3 text-sm">{b.notes}</p>}
                {(emailLogs[b.id] ?? []).length > 0 && (
                  <details className="mt-4 rounded-sm border border-border bg-muted/30">
                    <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                      Gesendete E-Mails ({emailLogs[b.id].length})
                    </summary>
                    <div className="space-y-3 border-t border-border p-3">
                      {emailLogs[b.id].map((log) => (
                        <div key={log.id} className="rounded-sm border border-border bg-card p-3 text-sm">
                          <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                            <span>{new Date(log.sent_at).toLocaleString("de-DE")}</span>
                            <span>Gesendet an: {log.recipient}</span>
                          </div>
                          <div className="mt-2 font-semibold">{log.subject}</div>
                          <p className="mt-2 whitespace-pre-wrap leading-6 text-muted-foreground">{log.message}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setMessageBooking(b)}
                    className="inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    E-Mail schreiben
                  </button>
                  <a
                    href={whatsappUrl(b.phone, b.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  {b.status !== "confirmed" && <button onClick={() => setBookingStatus(b.id, "confirmed")} className="rounded-sm bg-primary px-3 py-1.5 text-sm text-primary-foreground">Bestätigen</button>}
                  {b.status !== "pending" && <button onClick={() => setBookingStatus(b.id, "pending")} className="rounded-sm border border-border px-3 py-1.5 text-sm">Auf offen setzen</button>}
                  {b.status !== "cancelled" && <button onClick={() => setBookingStatus(b.id, "cancelled")} className="rounded-sm border border-destructive/40 px-3 py-1.5 text-sm text-destructive">Stornieren</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "texts" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl text-primary">Website-Texte bearbeiten</h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sarina sieht links direkt die normale Website und rechts die Texte, die sie bearbeiten kann.
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Website in neuem Tab öffnen ↗
                </a>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.4fr)]">
                <div className="overflow-hidden rounded-lg border border-border bg-muted">
                  <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">Website-Vorschau</p>
                      <p className="text-[11px] text-muted-foreground">So sieht die normale Kereztour-Seite aus.</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">Live</span>
                  </div>
                  <iframe
                    key={previewKey}
                    title="Kereztour Website-Vorschau"
                    src="/"
                    className="h-[620px] w-full bg-background"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-foreground">So arbeitet Sarina</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Einen Text links auf der Website wiedererkennen → rechts die passende Textkarte suchen → „Vorherigen Text übernehmen“ klicken → nur die gewünschte Stelle ändern → „Änderung speichern“.
                      Bei Unsicherheit kann sie den bisherigen Text stehen lassen oder eine frühere Version übernehmen.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl text-primary">Website-Texte</h2>
                      <p className="text-sm text-muted-foreground">Texte bearbeiten, speichern und frühere Versionen nachvollziehen.</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
                    <strong className="text-foreground">So funktioniert es:</strong> Links siehst du den aktuell veröffentlichten Text. Rechts kannst du eine neue Version erstellen. Mit „Vorherigen Text übernehmen“ kannst du den bestehenden Text kopieren, nur einzelne Stellen ändern und anschließend speichern. Für diese Änderung ist kein Code-Deployment notwendig.
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1 rounded-md border border-border bg-background p-1">
                  {(["DE", "EN", "IT"] as Language[]).map((code) => (
                    <button key={code} type="button" onClick={() => setTextLanguage(code)}
                      className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${textLanguage === code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                      {code === "DE" ? "Deutsch" : code === "EN" ? "English" : "Italiano"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input className="w-full rounded-sm border border-border bg-background px-3 py-2.5 pl-9 text-sm"
                    value={textSearch} onChange={(e) => setTextSearch(e.target.value)} placeholder="Nach Text oder Schlüssel suchen…" />
                </div>
                <div className="flex items-center rounded-sm border border-border px-3 text-xs text-muted-foreground">
                  {getEditableTextEntries().filter(({ key, fallback }) => {
                    const q = textSearch.trim().toLowerCase();
                    return !q || key.toLowerCase().includes(q) || fallback.toLowerCase().includes(q);
                  }).length} Texte
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">So sieht die Website aus</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">Live-Vorschau</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sarina kann hier direkt sehen, wo die Texte auf der normalen Website stehen. Danach kann sie unten gezielt den gewünschten Text ersetzen.
                  </p>
                </div>
                <a href="/" target="_blank" rel="noreferrer"
                  className="shrink-0 rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                  Website separat öffnen ↗
                </a>
              </div>
              <div className="bg-muted/30 p-3 sm:p-5">
                <div className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
                  <iframe
                    title="Kereztour Website Vorschau"
                    src="/"
                    className="h-[520px] w-full border-0"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Hinweis: Die Vorschau ist zum Anschauen gedacht. Änderungen werden unten im Textbereich vorgenommen.
                </p>
              </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-xl text-primary">Bearbeitbare Texte</h3>
                  <p className="text-xs text-muted-foreground">Nur die hier aufgeführten Texte können direkt über den Admin-Bereich geändert werden.</p>
                </div>
                <div className="flex flex-wrap gap-1 rounded-md border border-border bg-background p-1">
                  {(["DE", "EN", "IT"] as Language[]).map((code) => (
                    <button key={code} type="button" onClick={() => setTextLanguage(code)}
                      className={\`rounded-sm px-4 py-2 text-sm font-medium transition-colors \${textLanguage === code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}\`}>
                      {code === "DE" ? "Deutsch" : code === "EN" ? "English" : "Italiano"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input className="w-full rounded-sm border border-border bg-background px-3 py-2.5 pl-9 text-sm"
                  value={textSearch} onChange={(e) => setTextSearch(e.target.value)} placeholder="Text suchen…" />
              </div>
            </div>

            <div className="space-y-4">
              {getEditableTextEntries()
                .filter(({ key, fallback }) => {
                  const q = textSearch.trim().toLowerCase();
                  return !q || key.toLowerCase().includes(q) || fallback.toLowerCase().includes(q);
                })
                .map(({ key }) => {
                  const previous = textPreviousValues[key] ?? getEditableTextFallback(textLanguage, key);
                  const value = textValues[key] ?? previous;
                  const dirty = textDirty[key] === true;
                  const history = textHistory[key] ?? [];
                  const changed = value !== previous;
                  return (
                    <section key={key} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                      <div className="flex flex-col gap-2 border-b border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{key}</h3>
                            {changed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold text-secondary">
                                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />Ungespeicherte Änderung
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                                <CheckCircle2 className="h-3 w-3" />Gespeichert
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">Dieser Text wird auf der öffentlichen Website verwendet.</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{value.length} / 5.000 Zeichen</span>
                      </div>

                      <div className="grid gap-0 lg:grid-cols-2">
                        <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Vorher</p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">Aktuell veröffentlicht</p>
                            </div>
                            <span className="rounded-sm border border-border px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">Nur Lesen</span>
                          </div>
                          <div className="min-h-[140px] whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-4 text-sm leading-6 text-foreground">{previous}</div>
                          <button type="button"
                            onClick={() => {
                              setTextValues((current) => ({ ...current, [key]: previous }));
                              setTextDirty((current) => ({ ...current, [key]: false }));
                            }}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                            <RotateCcw className="h-3.5 w-3.5" />Vorherigen Text übernehmen
                          </button>
                        </div>

                        <div className="p-5">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Nachher</p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">Neue Version bearbeiten</p>
                            </div>
                            {dirty && <span className="text-[11px] font-medium text-secondary">Bereit zum Speichern</span>}
                          </div>
                          <textarea className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm min-h-[140px] resize-y leading-6"
                            maxLength={5000} value={value}
                            onChange={(e) => {
                              setTextValues((current) => ({ ...current, [key]: e.target.value }));
                              setTextDirty((current) => ({ ...current, [key]: e.target.value !== previous }));
                            }} />
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-muted-foreground">Änderungen werden erst mit „Speichern“ öffentlich übernommen.</div>
                            <div className="flex gap-2">
                              {value !== getEditableTextFallback(textLanguage, key) && (
                                <button type="button" onClick={() => resetText(key)} disabled={savingText === key}
                                  className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50">
                                  <RotateCcw className="h-3.5 w-3.5" />Original
                                </button>
                              )}
                              <button type="button" disabled={!dirty || savingText === key} onClick={() => saveText(key)}
                                className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40">
                                <Save className="h-3.5 w-3.5" />{savingText === key ? "Speichert…" : "Änderung speichern"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {history.length > 0 && (
                        <details className="border-t border-border bg-muted/10">
                          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                            <History className="h-3.5 w-3.5" />Versionshistorie ({history.length})
                          </summary>
                          <div className="space-y-3 border-t border-border px-5 py-4">
                            {history.slice(0, 5).map((version) => (
                              <div key={version.id} className="rounded-md border border-border bg-card p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-[11px] font-medium text-muted-foreground">{new Date(version.changed_at).toLocaleString("de-DE")}</span>
                                  <button type="button"
                                    onClick={() => {
                                      setTextValues((current) => ({ ...current, [key]: version.new_value }));
                                      setTextDirty((current) => ({ ...current, [key]: version.new_value !== previous }));
                                    }}
                                    className="rounded-sm border border-border px-2.5 py-1.5 text-[11px] font-medium hover:bg-muted">
                                    Version übernehmen
                                  </button>
                                </div>
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                  <div className="rounded-sm bg-muted/50 p-2.5 text-xs leading-5"><span className="font-semibold">Vorher:</span> {version.previous_value}</div>
                                  <div className="rounded-sm bg-primary/5 p-2.5 text-xs leading-5"><span className="font-semibold text-primary">Nachher:</span> {version.new_value}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </section>
                  );
                })}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-3">
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
                  <Info l="Zeitraum" v={`${fmt(m.date_from)} – ${fmt(m.date_to)}`} />
                  <Info l="Personen" v={m.persons ? String(m.persons) : "–"} />
                </div>
                {m.message && <p className="mt-3 whitespace-pre-wrap rounded-sm bg-muted p-3 text-sm">{m.message}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "dates" && (
          <div className="space-y-6">
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
                  <label className="text-xs text-muted-foreground">Economy – max. Personen
                    <input
                      className={input}
                      type="number"
                      min={1}
                      required
                      value={nd.economy_max_participants}
                      onChange={(e) => setNd({ ...nd, economy_max_participants: Number(e.target.value) })}
                    />
                  </label>
                  <label className="text-xs text-muted-foreground">Comfort – max. Personen
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

            <div className="overflow-x-auto rounded-md border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="p-3">Reise</th><th className="p-3">Zeitraum</th><th className="p-3">Belegt</th><th className="p-3">Kapazität</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {dates.map((d) => {
                    const economyBooked = bookings
                      .filter((b) => b.status === "confirmed" && b.travel_date === d.start_date && b.tour === d.tour && b.tier === "economy")
                      .reduce((s, b) => s + b.persons, 0);
                    const comfortBooked = bookings
                      .filter((b) => b.status === "confirmed" && b.travel_date === d.start_date && b.tour === d.tour && b.tier === "comfort")
                      .reduce((s, b) => s + b.persons, 0);

                    return (
                      <tr key={d.id} className="border-t border-border">
                        <td className="p-3 font-medium">{d.tour}</td>
                        <td className="p-3">{fmt(d.start_date)} – {fmt(d.end_date)}</td>
                        <td className="p-3">
                          {d.tour === "Kultur Tour" ? (
                            <div className="space-y-1">
                              <div>Economy: {economyBooked}</div>
                              <div>Comfort: {comfortBooked}</div>
                            </div>
                          ) : booked(d)}
                        </td>
                        <td className="p-3">
                          {d.tour === "Kultur Tour" ? (
                            <div className="space-y-2">
                              <label className="block text-xs text-muted-foreground">Economy
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
                              <label className="block text-xs text-muted-foreground">Comfort
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
                  {dates.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Keine Termine.</td></tr>}
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

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-md border border-border bg-card p-5">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-1 font-display text-4xl text-primary">{value}</div>
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
