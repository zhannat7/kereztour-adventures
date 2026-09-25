import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  id: string; tour: string; start_date: string; end_date: string; max_participants: number; status: string;
};

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("de-DE") : "–");
const input = "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm";

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

const Dashboard = ({ session }: { session: Session }) => {
  const [tab, setTab] = useState<"bookings" | "messages" | "dates">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dates, setDates] = useState<TourDate[]>([]);
  const [nd, setNd] = useState({ tour: "Kultur Tour", start_date: "", end_date: "", max_participants: 15 });

  const load = async () => {
    const [b, m, d] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("tour_dates").select("*").order("start_date"),
    ]);
    setBookings((b.data as Booking[]) ?? []);
    setMessages((m.data as Message[]) ?? []);
    setDates((d.data as TourDate[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const setBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status aktualisiert");
    load();
  };
  const updateDate = async (id: string, patch: Partial<TourDate>) => {
    const { error } = await supabase.from("tour_dates").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const addDate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("tour_dates").insert(nd);
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
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.status !== "confirmed" && <button onClick={() => setBookingStatus(b.id, "confirmed")} className="rounded-sm bg-primary px-3 py-1.5 text-sm text-primary-foreground">Bestätigen</button>}
                  {b.status !== "pending" && <button onClick={() => setBookingStatus(b.id, "pending")} className="rounded-sm border border-border px-3 py-1.5 text-sm">Auf offen setzen</button>}
                  {b.status !== "cancelled" && <button onClick={() => setBookingStatus(b.id, "cancelled")} className="rounded-sm border border-destructive/40 px-3 py-1.5 text-sm text-destructive">Stornieren</button>}
                </div>
              </div>
            ))}
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
                    <a href={`mailto:${m.email}`} className="text-sm text-muted-foreground hover:text-primary">{m.email}</a>
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
                <select className={input} value={nd.tour} onChange={(e) => setNd({ ...nd, tour: e.target.value })}>
                  <option>Kultur Tour</option><option>Kyrchyn Tour</option><option>Intensiv-Trekking</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground">Beginn
                <input className={input} type="date" required value={nd.start_date} onChange={(e) => setNd({ ...nd, start_date: e.target.value })} />
              </label>
              <label className="text-xs text-muted-foreground">Ende
                <input className={input} type="date" required value={nd.end_date} onChange={(e) => setNd({ ...nd, end_date: e.target.value })} />
              </label>
              <label className="text-xs text-muted-foreground">Max. Plätze
                <input className={input} type="number" min={1} required value={nd.max_participants} onChange={(e) => setNd({ ...nd, max_participants: Number(e.target.value) })} />
              </label>
              <button className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Termin hinzufügen</button>
            </form>

            <div className="overflow-x-auto rounded-md border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="p-3">Reise</th><th className="p-3">Zeitraum</th><th className="p-3">Belegt</th><th className="p-3">Max.</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {dates.map((d) => (
                    <tr key={d.id} className="border-t border-border">
                      <td className="p-3 font-medium">{d.tour}</td>
                      <td className="p-3">{fmt(d.start_date)} – {fmt(d.end_date)}</td>
                      <td className="p-3">{booked(d)}</td>
                      <td className="p-3">
                        <input type="number" min={1} defaultValue={d.max_participants} className="w-20 rounded-sm border border-border bg-background px-2 py-1"
                          onBlur={(e) => Number(e.target.value) !== d.max_participants && updateDate(d.id, { max_participants: Number(e.target.value) })} />
                      </td>
                      <td className="p-3">
                        <select value={d.status} onChange={(e) => updateDate(d.id, { status: e.target.value })} className="rounded-sm border border-border bg-background px-2 py-1">
                          <option value="open">Offen</option><option value="full">Ausgebucht</option><option value="cancelled">Abgesagt</option>
                        </select>
                      </td>
                      <td className="p-3 text-right"><button onClick={() => deleteDate(d.id)} className="text-destructive hover:underline">Löschen</button></td>
                    </tr>
                  ))}
                  {dates.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Keine Termine.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
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
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
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
