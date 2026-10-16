import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ContactInquiries from "@/components/admin/ContactInquiries";
import { Mail, MessageCircle, Search, CalendarDays, ClipboardList, Users, CheckCircle2, ChevronDown, LayoutDashboard, Wallet, ChevronRight, X, Phone, UserRound, CreditCard, List, LayoutGrid, FileText, Upload, Download, Trash2, Paperclip } from "lucide-react";

type Booking = {
  id: string; created_at: string; archived_at?: string | null; purge_after?: string | null; name: string; email: string; phone: string;
  persons: number; travel_date: string; tier: string; tour: string | null;
  notes: string | null; total_price: number; status: string;
  payment_status?: string; deposit_amount?: number; remaining_amount?: number;
};
type Message = {
  id: string; created_at: string; name: string; email: string; tour: string | null;
  date_from: string | null; date_to: string | null; persons: number | null; message: string | null;
  status: string;
};
type TourDate = {
  id: string; tour: string; start_date: string; end_date: string; max_participants: number;
  economy_max_participants: number; comfort_max_participants: number; status: string;
};
type BookingEmailLog = {
  id: string; booking_id: string; recipient: string; subject: string; message: string; sent_at: string;
};
type BookingActivity = {
  id: string; booking_id: string; activity_type: string; description: string; created_at: string;
};
type BookingDocument = {
  id: string; booking_id: string; file_name: string; storage_path: string;
  mime_type: string | null; file_size: number | null; document_type: string; created_at: string;
};

const fmt = (d: string | null) => (d ? new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString("de-DE") : "–");
const fmtRange = (start: string | null, end: string | null) => `${fmt(start)}–${fmt(end)}`;
const input = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm";

const cultureTransportLabel = (tour: string | null, persons: number) =>
  tour === "Kultur Tour" ? (persons <= 4 ? "Jeep" : "Minibus") : "–";

const DEPOSIT_PAID_MARKER = "[[DEPOSIT_PAID_150_EUR]]";

const BookingResponseDeadline = ({ booking, now }: { booking: Booking; now: number }) => {
  if (booking.status !== "pending") return null;
  const receivedAt = new Date(booking.created_at);
  const remainingMs = 24 * 60 * 60 * 1000 - (now - receivedAt.getTime());
  const urgent = remainingMs <= 60 * 60 * 1000;
  const formatDuration = (ms: number) => {
    const totalMinutes = Math.floor(Math.abs(ms) / 60_000);
    return `${Math.floor(totalMinutes / 60)} Std. ${totalMinutes % 60} Min.`;
  };
  return (
    <div className={`mt-2 rounded-md px-2.5 py-2 text-xs ${urgent ? "bg-red-600 text-white" : "bg-amber-500/10 text-amber-800"}`}>
      <p>{receivedAt.toLocaleString("de-DE", { timeZone: "Europe/Vienna", dateStyle: "short", timeStyle: "short" })} · Eingang</p>
      {remainingMs > 0
        ? <p className="font-semibold">Antwort in 24 Std. · Noch {formatDuration(remainingMs)}{urgent ? " · Bitte jetzt antworten!" : ""}</p>
        : <p className="font-semibold">24 Std. überschritten ({formatDuration(remainingMs)}) · Bitte jetzt antworten!</p>}
    </div>
  );
};

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
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  const [tab, setTab] = useState<"overview" | "analytics" | "bookings" | "payments" | "messages" | "dates" | "archive">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [archivedBookings, setArchivedBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dates, setDates] = useState<TourDate[]>([]);
  const [emailLogs, setEmailLogs] = useState<Record<string, BookingEmailLog[]>>({});
  const [activities, setActivities] = useState<Record<string, BookingActivity[]>>({});
  const [bookingDocuments, setBookingDocuments] = useState<Record<string, BookingDocument[]>>({});
  const [bookingDocumentCounts, setBookingDocumentCounts] = useState<Record<string, number>>({});
  const [documentBusy, setDocumentBusy] = useState(false);
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
  const [contactDraft, setContactDraft] = useState({ name: "", phone: "", email: "" });
  const [contactSaving, setContactSaving] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [tourFilter, setTourFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "unpaid">("all");

  const load = async () => {
    const [b, archived, m, d, e, a] = await Promise.all([
      supabase.from("bookings").select("*").is("archived_at", null).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").not("archived_at", "is", null).order("archived_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("tour_dates").select("*").order("start_date"),
      (supabase as any).from("booking_email_log").select("id, booking_id, recipient, subject, message, sent_at").order("sent_at", { ascending: false }),
      (supabase as any).from("booking_activity").select("id, booking_id, activity_type, description, created_at").order("created_at", { ascending: false }),
    ]);
    let activeBookingRows = b.data as Booking[] | null;
    let archivedBookingRows = archived.data as Booking[] | null;
    if (b.error || archived.error) {
      const archiveSchemaMissing = [b.error?.message, archived.error?.message].some((message) =>
        message?.includes("archived_at") || message?.includes("purge_after") || message?.includes("schema cache")
      );
      if (archiveSchemaMissing) {
        // Keep existing bookings visible if the archive migration has not reached the live database yet.
        const fallback = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (fallback.error) {
          console.error("Bookings could not be loaded:", fallback.error);
          toast.error("Buchungen konnten nicht geladen werden: " + fallback.error.message);
          activeBookingRows = [];
        } else {
          activeBookingRows = fallback.data as Booking[];
          console.warn("Archivierung ist noch nicht verfügbar: Die Spalten archived_at/purge_after fehlen in Lovable Cloud. Buchungen werden weiterhin angezeigt.");
        }
        archivedBookingRows = [];
      } else {
        console.error("Bookings could not be loaded:", b.error ?? archived.error);
        toast.error("Buchungen konnten nicht vollständig geladen werden.");
        activeBookingRows = activeBookingRows ?? [];
        archivedBookingRows = archivedBookingRows ?? [];
      }
    }
    setBookings(activeBookingRows ?? []);
    setArchivedBookings(archivedBookingRows ?? []);
    if (m.error) toast.error("Kontaktanfragen konnten nicht geladen werden.");
    setMessages((m.data as Message[]) ?? []);
    const { data: documentFolders, error: folderError } = await supabase.storage.from("booking-documents").list("", { limit: 1000 });
    if (folderError) console.error("Document folders could not be loaded:", folderError);
    else setBookingDocumentCounts(Object.fromEntries((documentFolders ?? []).filter((item) => item.id == null).map((item) => [item.name, 1])));
    const loadedDates = (d.data as TourDate[] | null) ?? [];
    // Repair existing Kultur Tour rows where the shared public capacity still
    // has the old default (for example 15) while the Minibus capacity is 8.
    const kulturCapacityMismatches = loadedDates.filter(
      (item) => item.tour === "Kultur Tour" && item.max_participants !== item.economy_max_participants
    );
    if (kulturCapacityMismatches.length > 0) {
      const syncResults = await Promise.all(
        kulturCapacityMismatches.map((item) =>
          (supabase as any)
            .from("tour_dates")
            .update({ max_participants: item.economy_max_participants })
            .eq("id", item.id)
        )
      );
      const syncError = syncResults.find((result) => result.error)?.error;
      if (syncError) {
        console.error("Kultur Tour capacity sync failed:", syncError);
      } else {
        kulturCapacityMismatches.forEach((item) => {
          item.max_participants = item.economy_max_participants;
        });
      }
    }
    setDates(loadedDates);
    const grouped: Record<string, BookingEmailLog[]> = {};
    for (const row of (e.data ?? []) as BookingEmailLog[]) {
      (grouped[row.booking_id] ??= []).push(row);
    }
    setEmailLogs(grouped);
    if (e.error) console.error("Booking email log could not be loaded:", e.error);
    const activityGroups: Record<string, BookingActivity[]> = {};
    for (const row of (a.data ?? []) as BookingActivity[]) {
      (activityGroups[row.booking_id] ??= []).push(row);
    }
    setActivities(activityGroups);
    if (a.error) console.error("Booking activity history could not be loaded:", a.error);
  };
  useEffect(() => { load(); }, []);

  const archiveBooking = async (booking: Booking) => {
    if (!window.confirm(`Buchung von ${booking.name} archivieren? Sie bleibt 30 Tage wiederherstellbar.`)) return;
    const archivedAt = new Date();
    const purgeAfter = new Date(archivedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const { error } = await supabase.from("bookings").update({ archived_at: archivedAt.toISOString(), purge_after: purgeAfter.toISOString() } as any).eq("id", booking.id);
    if (error) return toast.error("Buchung konnte nicht archiviert werden: " + error.message);
    setSelectedBooking(null);
    toast.success("Buchung für 30 Tage archiviert.");
    await load();
  };

  const restoreBooking = async (booking: Booking) => {
    if (!window.confirm(`Buchung von ${booking.name} wiederherstellen?`)) return;
    const { error } = await supabase.from("bookings").update({ archived_at: null, purge_after: null } as any).eq("id", booking.id);
    if (error) return toast.error("Buchung konnte nicht wiederhergestellt werden: " + error.message);
    toast.success("Buchung wiederhergestellt.");
    await load();
  };

  const logActivity = async (bookingId: string, activityType: string, description: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await (supabase as any).from("booking_activity").insert({ booking_id: bookingId, activity_type: activityType, description, created_by: userData.user?.id ?? null }).select("id, booking_id, activity_type, description, created_at").single();
    if (error) { console.error("Booking activity could not be saved:", error); return; }
    const activity = data as BookingActivity;
    setActivities((current) => ({ ...current, [bookingId]: [activity, ...(current[bookingId] ?? [])] }));
  };

  const loadBookingDocuments = async (bookingId: string) => {
    const { data, error } = await supabase.storage.from("booking-documents").list(bookingId, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) { console.error("Documents could not be loaded:", error); toast.error("Dokumente konnten nicht geladen werden: " + error.message); return; }
    const documents: BookingDocument[] = (data ?? []).filter((item) => item.name && item.id).map((item: any) => ({
      id: item.id ?? item.name, booking_id: bookingId,
      file_name: item.name.replace(/^[0-9a-f-]+-/, ""), storage_path: bookingId + "/" + item.name,
      mime_type: item.metadata?.mimetype ?? null, file_size: item.metadata?.size ?? null,
      document_type: "invoice", created_at: item.created_at ?? item.updated_at ?? new Date().toISOString(),
    }));
    setBookingDocuments((current) => ({ ...current, [bookingId]: documents }));
  };

  const uploadBookingDocument = async (file: File) => {
    if (!selectedBooking) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return toast.error("Bitte eine PDF-, JPG-, PNG- oder WebP-Datei auswählen.");
    if (file.size > 50 * 1024 * 1024) return toast.error("Die Datei darf maximal 50 MB groß sein.");
    setDocumentBusy(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = selectedBooking.id + "/" + crypto.randomUUID() + "-" + safeName;
    const { error } = await supabase.storage.from("booking-documents").upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setDocumentBusy(false); return toast.error("Datei konnte nicht hochgeladen werden: " + error.message); }
    await loadBookingDocuments(selectedBooking.id);
    setBookingDocumentCounts((current) => ({ ...current, [selectedBooking.id]: (current[selectedBooking.id] ?? 0) + 1 }));
    setDocumentBusy(false);
    toast.success("Rechnungsdokument gespeichert.");
    void logActivity(selectedBooking.id, "document_added", "Dokument hinzugefügt: " + file.name);
  };

  const openBookingDocument = async (doc: BookingDocument) => {
    const { data, error } = await supabase.storage.from("booking-documents").createSignedUrl(doc.storage_path, 60);
    if (error || !data?.signedUrl) return toast.error("Dokument konnte nicht geöffnet werden: " + (error?.message ?? ""));
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const deleteBookingDocument = async (doc: BookingDocument) => {
    if (!window.confirm("Dieses Dokument wirklich löschen?")) return;
    const { error } = await supabase.storage.from("booking-documents").remove([doc.storage_path]);
    if (error) return toast.error("Datei konnte nicht gelöscht werden: " + error.message);
    const remaining = (bookingDocuments[doc.booking_id] ?? []).filter((item) => item.storage_path !== doc.storage_path);
    setBookingDocuments((current) => ({ ...current, [doc.booking_id]: remaining }));
    setBookingDocumentCounts((current) => ({ ...current, [doc.booking_id]: remaining.length }));
    toast.success("Dokument gelöscht.");
    void logActivity(doc.booking_id, "document_deleted", "Dokument gelöscht: " + doc.file_name);
  };

  const openBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    void loadBookingDocuments(booking.id);
    setNotesDraft((booking.notes ?? "").split(DEPOSIT_PAID_MARKER).join("").trim());
    setContactDraft({ name: booking.name ?? "", phone: booking.phone ?? "", email: booking.email ?? "" });
  };

  const saveBookingContact = async () => {
    if (!selectedBooking) return;
    if (!contactDraft.name.trim()) return toast.error("Bitte einen Namen eingeben.");
    setContactSaving(true);
    const patch = { name: contactDraft.name.trim(), phone: contactDraft.phone.trim(), email: contactDraft.email.trim() };
    const { error } = await supabase.from("bookings").update(patch).eq("id", selectedBooking.id);
    setContactSaving(false);
    if (error) return toast.error("Kontaktdaten konnten nicht gespeichert werden: " + error.message);
    setBookings((current) => current.map((b) => b.id === selectedBooking.id ? { ...b, ...patch } : b));
    setSelectedBooking((current) => current?.id === selectedBooking.id ? { ...current, ...patch } : current);
    toast.success("Kontaktdaten gespeichert.");
    void logActivity(selectedBooking.id, "contact_updated", "Kontaktdaten wurden aktualisiert.");
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
    void logActivity(selectedBooking.id, "note_updated", "Interne Notiz wurde aktualisiert.");
  };

  const setDepositPaid = async (id: string, paid: boolean) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    const existingNotes = (booking.notes ?? "").split(DEPOSIT_PAID_MARKER).join("").trim();
    const notes = paid
      ? [existingNotes, DEPOSIT_PAID_MARKER].filter(Boolean).join("\n")
      : existingNotes || null;
    // The bookings table does not have a payment_status column in the current database schema.
    // Store the deposit state in the existing notes field to avoid a schema-cache update error.
    const { error } = await supabase.from("bookings").update({ notes }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return false;
    }
    setBookings((current) => current.map((b) => b.id === id ? {
      ...b,
      notes,
      payment_status: paid ? "deposit_paid" : "unpaid",
    } : b));
    toast.success(paid ? "Anzahlung als bezahlt gespeichert." : "Anzahlung als nicht bezahlt gespeichert.");
    void logActivity(id, "payment_updated", paid ? "Anzahlung von 150 € als bezahlt markiert." : "Anzahlung von 150 € wieder als offen markiert.");
    return true;
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
    void logActivity(id, "status_updated", "Buchungsstatus geändert zu: " + (statusLabel[status] ?? status) + ".");
  };
  const updateDate = async (id: string, patch: Partial<TourDate>) => {
    const date = dates.find((item) => item.id === id);
    // Keep the shared availability capacity in sync with the Minibus capacity.
    // Public tour dates and the booking form use max_participants for the
    // remaining-seat calculation, while Kultur Tour also has vehicle-specific limits.
    const capacities = [patch.max_participants, patch.economy_max_participants, patch.comfort_max_participants]
      .filter((value): value is number => value !== undefined);
    if (capacities.some((value) => !Number.isInteger(value) || value < 1 || value > 25)) {
      return toast.error("Die maximale Teilnehmerzahl muss zwischen 1 und 25 liegen.");
    }
    const syncedPatch =
      date?.tour === "Kultur Tour" && patch.economy_max_participants !== undefined
        ? { ...patch, max_participants: patch.economy_max_participants }
        : patch;
    const { error } = await (supabase as any).from("tour_dates").update(syncedPatch).eq("id", id);
    if (error) return toast.error(error.message);
    await load();
    toast.success("Kapazität gespeichert – Website und Buchungsseite werden aktualisiert.");
  };
  const addDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nd.end_date < nd.start_date) {
      return toast.error("Das Enddatum darf nicht vor dem Startdatum liegen.");
    }
    const capacities = nd.tour === "Kultur Tour"
      ? [nd.economy_max_participants, nd.comfort_max_participants]
      : [nd.max_participants];
    if (capacities.some((value) => !Number.isInteger(value) || value < 1 || value > 25)) {
      return toast.error("Die maximale Teilnehmerzahl muss zwischen 1 und 25 liegen.");
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
    const matchesStatus = tab === "payments"
      ? !hasDepositPaid(b) && b.status !== "cancelled"
      : bookingFilter === "all" || (bookingFilter === "unpaid" ? !hasDepositPaid(b) && b.status !== "cancelled" : b.status === bookingFilter);
    return matchesQuery && matchesTour && matchesStatus;
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
    { k: "archive", l: `Archiv · ${archivedBookings.length}` },
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

      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Übersicht</p>
          <h1 className="font-display text-2xl text-primary sm:text-[1.75rem]">Guten Tag, Sarina</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Alles an einem Ort: Buchungen bearbeiten, Kunden kontaktieren und Reisetermine verwalten.</p>
        </div>
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <button onClick={() => { setTab("bookings"); setBookingFilter("pending"); }} className="text-left"><Stat icon={<ClipboardList className="h-5 w-5" />} label="Offene Anfragen" value={openBookings.length} hint="Prüfen und beantworten" /></button>
          <button onClick={() => { setTab("bookings"); setBookingFilter("confirmed"); }} className="text-left"><Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Bestätigte Buchungen" value={confirmedBookings.length} hint="Buchung ist bestätigt" /></button>
          <button onClick={() => { setTab("bookings"); setBookingFilter("unpaid"); }} className="text-left"><Stat icon={<Wallet className="h-5 w-5" />} label="Anzahlungen offen" value={unpaidBookings.length} hint="150 € noch nicht als bezahlt markiert" /></button>
          <button onClick={() => setTab("messages")} className="text-left"><Stat icon={<Users className="h-5 w-5" />} label="Kontaktanfragen" value={messages.length} hint="Nachrichten von Gästen" /></button>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5 border-b border-border pb-3">
          {tabs.map((t) => (
            <button key={t.k} onClick={() => { setTab(t.k); if (t.k === "bookings") setBookingFilter("all"); }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${tab === t.k ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {t.k === "overview" ? <LayoutDashboard className="mr-2 inline h-4 w-4" /> : t.k === "bookings" ? <ClipboardList className="mr-2 inline h-4 w-4" /> : t.k === "payments" ? <Wallet className="mr-2 inline h-4 w-4" /> : t.k === "messages" ? <Mail className="mr-2 inline h-4 w-4" /> : t.k === "archive" ? <Trash2 className="mr-2 inline h-4 w-4" /> : <CalendarDays className="mr-2 inline h-4 w-4" />}
              {t.l}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-lg font-semibold">Das braucht deine Aufmerksamkeit</h2>
              <p className="mt-1 text-sm text-muted-foreground">Wähle eine Aufgabe, um direkt zum richtigen Bereich zu gelangen.</p>
              <div className="mt-3 divide-y divide-border">
                <button onClick={() => { setTab("bookings"); setBookingFilter("pending"); }} className="flex w-full items-center gap-3 py-3 text-left hover:bg-muted/30">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-800"><ClipboardList className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-medium">Buchungsanfragen prüfen</span><span className="text-sm text-muted-foreground">Noch nicht bestätigte Anfragen</span></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{openBookings.length}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setTab("bookings"); setBookingFilter("unpaid"); }} className="flex w-full items-center gap-3 py-3 text-left hover:bg-muted/30">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-800"><Wallet className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-medium">Anzahlungen überprüfen</span><span className="text-sm text-muted-foreground">150 € als bezahlt markieren, wenn eingegangen</span></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{unpaidBookings.length}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => setTab("messages")} className="flex w-full items-center gap-3 py-3 text-left hover:bg-muted/30">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-medium">Kontaktanfragen ansehen</span><span className="text-sm text-muted-foreground">Nachrichten von Interessenten öffnen</span></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{messages.length}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </section>
            <section className="rounded-lg border border-border bg-card p-4">
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
                <button onClick={() => setBookingView("kanban")} title="Kanban-Ansicht" aria-label="Kanban-Ansicht" className={`rounded px-2 py-1.5 text-xs font-semibold ${bookingView === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Board</button>
              </div>
            </div>
            {bookingView === "list" && filteredBookings.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr>
                    <th className="px-4 py-3">Gast</th><th className="px-4 py-3">Reise / Termin</th><th className="px-4 py-3">Buchung</th><th className="px-4 py-3">Anzahlung</th><th className="px-4 py-3">Gesamtpreis</th><th className="px-4 py-3">Kontakt</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} onClick={() => openBooking(b)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBooking(b); } }} tabIndex={0} role="button" aria-label={"Gästeprofil von " + b.name + " öffnen"} className="cursor-pointer hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
                        <td className="px-4 py-3"><div className="flex items-center gap-2"><button onClick={() => openBooking(b)} className="text-left font-semibold hover:text-primary">{b.name}</button>{(bookingDocumentCounts[b.id] ?? 0) > 0 && <span title={(bookingDocumentCounts[b.id] ?? 0) + " Anhang/Anhänge vorhanden"} aria-label={(bookingDocumentCounts[b.id] ?? 0) + " Anhang/Anhänge vorhanden"} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><Paperclip className="h-3.5 w-3.5" />{bookingDocumentCounts[b.id]}</span>}</div><p className="mt-1 max-w-[210px] truncate text-xs text-muted-foreground">{b.email || "Keine E-Mail"}</p></td>
                        <td className="px-4 py-3"><p className="font-medium">{b.tour ?? "Reise"}</p><p className="mt-1 text-xs text-muted-foreground">{fmt(b.travel_date)} · {b.persons} {b.persons === 1 ? "Person" : "Personen"}</p></td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[b.status] ?? "bg-muted text-foreground"}`}>{statusLabel[b.status] ?? b.status}</span><BookingResponseDeadline booking={b} now={now} /></td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${hasDepositPaid(b) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{hasDepositPaid(b) ? "150 € bezahlt" : "Offen"}</span></td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold">{b.total_price.toLocaleString("de-DE")} €</td>
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-1.5 whitespace-nowrap">
                          {b.phone && <a href={whatsappUrl(b.phone, b.name)} target="_blank" rel="noopener noreferrer" title={`WhatsApp an ${b.name}`} aria-label={`WhatsApp an ${b.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#25D366] hover:bg-[#25D366]/10"><MessageCircle className="h-5 w-5" /></a>}
                          {b.email && <a href={`mailto:${b.email}`} title="E-Mail schreiben" aria-label="E-Mail schreiben" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><Mail className="h-4 w-4" /></a>}
                          {b.phone && <a href={`tel:${b.phone}`} title="Anrufen" aria-label="Anrufen" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><Phone className="h-4 w-4" /></a>}
                          <button onClick={() => openBooking(b)} className="ml-1 whitespace-nowrap rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">Profil öffnen</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {bookingView === "kanban" && (
              <div className="overflow-x-auto pb-3">
                <div className="grid min-w-[1120px] grid-cols-4 gap-3">
                  {([
                    { key: "new", title: "Neue Buchungsanfragen", color: "border-amber-400", matches: (b: Booking) => b.status === "pending" },
                    { key: "deposit", title: "Bestätigt · Anzahlung offen", color: "border-orange-400", matches: (b: Booking) => b.status === "confirmed" && !hasDepositPaid(b) },
                    { key: "confirmed", title: "Bestätigt & Anzahlung bezahlt", color: "border-primary", matches: (b: Booking) => b.status === "confirmed" && hasDepositPaid(b) },
                    { key: "cancelled", title: "Storniert", color: "border-destructive/60", matches: (b: Booking) => b.status === "cancelled" },
                  ] as const).map((column) => {
                    const items = filteredBookings.filter(column.matches);
                    return <section key={column.key} className={"flex min-w-0 flex-col rounded-lg border border-border border-t-[3px] " + column.color + " bg-muted/20"}>
                      <div className="sticky top-0 flex items-center justify-between gap-2 rounded-t-md bg-card px-3 py-3">
                        <h3 className="text-sm font-semibold">{column.title}</h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums">{items.length}</span>
                      </div>
                      <div className="max-h-[68vh] space-y-2 overflow-y-auto p-2">
                        {items.map((b) => <article key={b.id} className="rounded-lg border border-border bg-card p-3 shadow-sm">
                          <div className="flex items-center gap-1.5"><button onClick={() => openBooking(b)} className="block max-w-full truncate text-left text-sm font-semibold hover:text-primary" title={b.name}>{b.name}</button>{(bookingDocumentCounts[b.id] ?? 0) > 0 && <span title={(bookingDocumentCounts[b.id] ?? 0) + " Anhang/Anhänge vorhanden"} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"><Paperclip className="h-3 w-3" />{bookingDocumentCounts[b.id]}</span>}</div>
                          <p className="mt-1 text-xs font-medium text-foreground">{b.tour ?? "Reise"}</p>
                           <span className={"mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold " + (b.status === "pending" ? "bg-amber-500/10 text-amber-800" : b.status === "confirmed" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>{b.status === "pending" ? "Buchungsanfrage · noch nicht bestätigt" : b.status === "confirmed" ? "Buchung bestätigt" : "Storniert"}</span>
                           <BookingResponseDeadline booking={b} now={now} />
                          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 shrink-0" />{fmt(b.travel_date)}</p>
                            <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 shrink-0" />{b.persons} {b.persons === 1 ? "Person" : "Personen"}</p>
                          </div>
                          <div className="mt-3 flex items-end justify-between gap-2 border-t border-border pt-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold tabular-nums">{b.total_price.toLocaleString("de-DE")} €</p>
                              <span className={"mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-medium " + (hasDepositPaid(b) ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-700")}>{hasDepositPaid(b) ? "Anzahlung: 150 € bezahlt" : "Anzahlung: 150 € offen"}</span>
                            </div>
                            {b.phone && <a href={whatsappUrl(b.phone, b.name)} target="_blank" rel="noopener noreferrer" title={"WhatsApp an " + b.name} aria-label={"WhatsApp an " + b.name} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#25D366] hover:bg-[#25D366]/10"><MessageCircle className="h-4 w-4" /></a>}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <button onClick={() => openBooking(b)} className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted">Details</button>
                            {b.status === "pending" && <button onClick={() => openBooking(b)} className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground">Anfrage prüfen</button>}
                            
                          </div>
                        </article>)}
                        {items.length === 0 && <p className="rounded-md border border-dashed border-border bg-card/60 p-4 text-center text-xs text-muted-foreground">Keine Buchungen</p>}
                      </div>
                    </section>;
                  })}
                </div>
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
                       <BookingResponseDeadline booking={b} now={now} />
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
                  <div className="space-y-3">
                    <label className="block text-xs text-muted-foreground">Name<input value={contactDraft.name} onChange={(e) => setContactDraft((v) => ({ ...v, name: e.target.value }))} className={"mt-1 " + input} /></label>
                    <label className="block text-xs text-muted-foreground">Telefon<div className="mt-1 flex gap-2"><input value={contactDraft.phone} onChange={(e) => setContactDraft((v) => ({ ...v, phone: e.target.value }))} className={input} /><a href={contactDraft.phone ? whatsappUrl(contactDraft.phone, contactDraft.name) : undefined} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp öffnen" title="WhatsApp öffnen" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#25D366] hover:bg-[#25D366]/10"><MessageCircle className="h-5 w-5" /></a></div></label>
                    <label className="block text-xs text-muted-foreground">E-Mail<input type="email" value={contactDraft.email} onChange={(e) => setContactDraft((v) => ({ ...v, email: e.target.value }))} className={"mt-1 " + input} /></label>
                    <div className="flex flex-wrap gap-2"><button onClick={saveBookingContact} disabled={contactSaving} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{contactSaving ? "Speichert …" : "Kontaktdaten speichern"}</button>{contactDraft.email && <a href={"mailto:" + contactDraft.email} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"><Mail className="h-4 w-4" />E-Mail</a>}{contactDraft.phone && <a href={"tel:" + contactDraft.phone} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"><Phone className="h-4 w-4" />Anrufen</a>}</div>
                  </div>
                </section>
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4 text-primary" />Reisedetails</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm"><Info l="Reise" v={selectedBooking.tour ?? "–"} /><Info l="Reisedatum" v={fmt(selectedBooking.travel_date)} /><Info l="Personen" v={String(selectedBooking.persons)} /><Info l="Transport" v={cultureTransportLabel(selectedBooking.tour, selectedBooking.persons)} /><Info l="Kategorie" v={selectedBooking.tier || "–"} /><Info l="Anfrage vom" v={fmt(selectedBooking.created_at)} /></div>
                  <BookingResponseDeadline booking={selectedBooking} now={now} />
                </section>
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold"><CreditCard className="h-4 w-4 text-primary" />Buchung und Zahlung</h3>
                  <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Buchungsstatus</span><span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + (statusStyle[selectedBooking.status] ?? "bg-muted")}>{statusLabel[selectedBooking.status] ?? selectedBooking.status}</span></div>
                  <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Gesamtpreis</span><strong>{selectedBooking.total_price.toLocaleString("de-DE")} €</strong></div>
                  <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Anzahlung 150 €</span><label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={hasDepositPaid(selectedBooking)} onChange={async (e) => { const paid=e.target.checked; const ok=await setDepositPaid(selectedBooking.id, paid); if (!ok) return; setSelectedBooking((current) => { if (!current) return null; const base=(current.notes ?? "").split(DEPOSIT_PAID_MARKER).join("").trim(); const notes=paid ? [base, DEPOSIT_PAID_MARKER].filter(Boolean).join("\n") : base || null; return {...current, notes, payment_status: paid ? "deposit_paid" : "unpaid"}; }); }} />Als bezahlt markieren</label></div>
                  <div className="mt-4 flex flex-wrap gap-2">
                     <button onClick={() => void archiveBooking(selectedBooking)} className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/5">Archivieren (30 Tage)</button>
                    {selectedBooking.status !== "confirmed" && <button onClick={() => { setBookingStatus(selectedBooking.id, "confirmed"); setSelectedBooking((current) => current ? {...current, status:"confirmed"} : null); }} disabled={!hasDepositPaid(selectedBooking)} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">Buchung bestätigen</button>}
                    {selectedBooking.status !== "pending" && <button onClick={() => { setBookingStatus(selectedBooking.id, "pending"); setSelectedBooking((current) => current ? {...current, status:"pending"} : null); }} className="rounded-md border border-border px-3 py-2 text-sm">Auf offen setzen</button>}
                    <button onClick={() => setMessageBooking(selectedBooking)} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"><Mail className="h-4 w-4" />E-Mail verfassen</button>
                  </div>
                </section>
                <section className="rounded-xl border border-border p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary" />Rechnungen und Dokumente</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{(bookingDocuments[selectedBooking.id] ?? []).length}</span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">Rechnungen, Zahlungsbelege und andere Buchungsunterlagen sicher ablegen und später wiederfinden.</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                    <Upload className="h-4 w-4" />{documentBusy ? "Wird hochgeladen …" : "Rechnung / Datei hinzufügen"}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" className="hidden" disabled={documentBusy} onChange={(e) => { const file=e.target.files?.[0]; if(file) void uploadBookingDocument(file); e.currentTarget.value=""; }} />
                  </label>
                  <p className="mt-2 text-xs text-muted-foreground">PDF, JPG, PNG oder WebP · maximal 50 MB pro Datei</p>
                  <div className="mt-3 space-y-2">
                    {(bookingDocuments[selectedBooking.id] ?? []).map((doc) => <div key={doc.id} className="flex items-center gap-3 rounded-md border border-border p-3">
                      <FileText className="h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium" title={doc.file_name}>{doc.file_name}</p><p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString("de-DE")}{doc.file_size ? " · " + (doc.file_size / 1024 / 1024).toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " MB" : ""}</p></div>
                      <button onClick={() => void openBookingDocument(doc)} title="Dokument öffnen" aria-label="Dokument öffnen" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"><Download className="h-4 w-4" /></button>
                      <button onClick={() => void deleteBookingDocument(doc)} title="Dokument löschen" aria-label="Dokument löschen" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>)}
                    {(bookingDocuments[selectedBooking.id] ?? []).length === 0 && <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Noch keine Rechnungen oder Dokumente hinterlegt.</p>}
                  </div>
                </section>
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 font-semibold">Interne Notizen</h3>
                  <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={4} placeholder="Reisewünsche, Absprachen und wichtige Hinweise zum Gast …" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  <div className="mt-3 flex justify-end"><button onClick={saveBookingNotes} disabled={notesSaving} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{notesSaving ? "Speichert …" : "Notizen speichern"}</button></div>
                </section>
                <section className="rounded-xl border border-border p-4">
                  <h3 className="mb-3 font-semibold">Aktivitäten</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /><div><p className="text-sm font-medium">Buchungsanfrage eingegangen</p><p className="text-xs text-muted-foreground">{fmt(selectedBooking.created_at)}</p></div></div>
                    {(activities[selectedBooking.id] ?? []).map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary/60" /><div><p className="text-sm">{activity.description}</p><p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleString("de-DE")}</p></div></div>)}
                    {(emailLogs[selectedBooking.id] ?? []).map((log) => <div key={log.id} className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#25D366]" /><div><p className="text-sm font-medium">E-Mail gesendet: {log.subject}</p><p className="text-xs text-muted-foreground">An {log.recipient} · {new Date(log.sent_at).toLocaleString("de-DE")}</p></div></div>)}
                    {(activities[selectedBooking.id] ?? []).length === 0 && (emailLogs[selectedBooking.id] ?? []).length === 0 && <p className="text-sm text-muted-foreground">Noch keine weiteren Aktivitäten.</p>}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        )}

        {tab === "archive" && (
          <section className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div>
              <h2 className="text-lg font-semibold">Archivierte Buchungen</h2>
              <p className="mt-1 text-sm text-muted-foreground">Buchungen bleiben 30 Tage im Archiv. Anhänge werden erst zusammen mit der Buchung endgültig gelöscht.</p>
            </div>
            {archivedBookings.length === 0 && <Empty text="Das Archiv ist leer." />}
            {archivedBookings.map((booking) => {
              const purgeAt = booking.purge_after ? new Date(booking.purge_after) : null;
              const daysLeft = purgeAt ? Math.max(0, Math.ceil((purgeAt.getTime() - now) / (24 * 60 * 60 * 1000))) : 30;
              return <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="font-semibold">{booking.name} · {booking.tour ?? "Reise"}</p>
                  <p className="text-sm text-muted-foreground">Archiviert: {booking.archived_at ? new Date(booking.archived_at).toLocaleString("de-DE") : "–"} · {daysLeft} Tage bis zur endgültigen Löschung</p>
                </div>
                <button onClick={() => void restoreBooking(booking)} className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">Wiederherstellen</button>
              </div>;
            })}
          </section>
        )}

        {tab === "messages" && (
          <ContactInquiries messages={messages} onUpdated={(updated) => setMessages((current) => current.map((message) => message.id === updated.id ? updated : message))} onRefresh={load} />
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
                      max={25}
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
                      max={25}
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
                    max={25}
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
                                  max={25}
                                  defaultValue={d.economy_max_participants}
                                  className="mt-1 w-24 rounded-sm border border-border bg-background px-2 py-1"
                                  onBlur={(e) => {
                                    const value = Number(e.target.value);
                                    if (value !== d.economy_max_participants || value !== d.max_participants) {
                                      updateDate(d.id, { economy_max_participants: value });
                                    }
                                  }}
                                />
                              </label>
                              <label className="block text-xs text-muted-foreground">Jeep
                                <input
                                  type="number"
                                  min={1}
                                  max={25}
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
                            <input type="number" min={1} max={25} defaultValue={d.max_participants} className="w-20 rounded-sm border border-border bg-background px-2 py-1"
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

const Stat = ({ icon, label, value, hint, help }: { icon: ReactNode; label: string; value: number; hint: string; help?: string }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
    <div className="min-w-0">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-2xl leading-tight text-primary">{value}</div>
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
