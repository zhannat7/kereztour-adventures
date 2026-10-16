import { useMemo, useState } from "react";
import { Mail, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inquiryStatuses, inquiryStatusLabels, isInquiryStatus } from "@/lib/inquiry-status";

type Inquiry = Tables<"contact_messages">;
type Props = { messages: Inquiry[]; onUpdated: (message: Inquiry) => void; onRefresh: () => Promise<void> };
const date = (value: string | null) => value ? new Date(value).toLocaleDateString("de-DE") : "–";

export default function ContactInquiries({ messages, onUpdated, onRefresh }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const filtered = useMemo(() => messages.filter((message) =>
    (filter === "all" || message.status === filter) &&
    [message.name, message.email, message.tour, message.message].join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  ), [messages, search, filter]);

  const updateStatus = async (message: Inquiry, status: string) => {
    if (!isInquiryStatus(status) || busy.has(message.id)) return;
    setBusy((current) => new Set(current).add(message.id));
    try {
      const { data, error } = await supabase.from("contact_messages").update({ status }).eq("id", message.id).select().single();
      if (error) throw error;
      onUpdated(data);
      toast.success("Bearbeitungsstatus gespeichert.");
    } catch {
      toast.error("Status konnte nicht gespeichert werden. Bitte erneut versuchen.");
    } finally {
      setBusy((current) => { const next = new Set(current); next.delete(message.id); return next; });
    }
  };

  return <section className="space-y-4" aria-label="Kontaktanfragen">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-semibold text-foreground">Kontaktanfragen</h2><p className="mt-1 text-sm text-muted-foreground">{messages.filter((message) => message.status !== "completed").length} offen oder in Bearbeitung · {messages.length} insgesamt</p></div>
      <Button variant="outline" size="icon" aria-label="Kontaktanfragen aktualisieren" title="Aktualisieren" disabled={refreshing} onClick={async () => { setRefreshing(true); try { await onRefresh(); } finally { setRefreshing(false); } }}><RefreshCw className={refreshing ? "animate-spin motion-reduce:animate-none" : ""} /></Button>
    </div>
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" aria-label="Kontaktanfragen suchen" placeholder="Name, E-Mail oder Reise suchen …" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <Select value={filter} onValueChange={setFilter}><SelectTrigger className="sm:w-52" aria-label="Kontaktanfragen nach Status filtern"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alle Status</SelectItem>{inquiryStatuses.map((status) => <SelectItem key={status} value={status}>{inquiryStatusLabels[status]}</SelectItem>)}</SelectContent></Select>
    </div>
    {filtered.length === 0 && <p className="py-10 text-center text-muted-foreground">{messages.length === 0 ? "Noch keine Kontaktanfragen vorhanden." : "Keine passenden Kontaktanfragen gefunden."}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{filtered.map((message) => <article key={message.id} className="min-w-0 rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-semibold text-foreground">{message.name}</h3><p className="mt-1 text-xs text-muted-foreground">Eingegangen: {date(message.created_at)}</p></div>
        <Select value={message.status} disabled={busy.has(message.id)} onValueChange={(status) => void updateStatus(message, status)}><SelectTrigger className="w-44" aria-label={`Bearbeitungsstatus für ${message.name}`}><SelectValue /></SelectTrigger><SelectContent>{inquiryStatuses.map((status) => <SelectItem key={status} value={status}>{inquiryStatusLabels[status]}</SelectItem>)}</SelectContent></Select>
      </div>
      <a className="mt-3 block break-all text-sm text-primary hover:underline" href={`mailto:${message.email}`}>{message.email}</a>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="col-span-2"><dt className="text-xs text-muted-foreground">Reise</dt><dd className="break-words">{message.tour || "–"}</dd></div><div><dt className="text-xs text-muted-foreground">Zeitraum</dt><dd>{date(message.date_from)} – {date(message.date_to)}</dd></div><div><dt className="text-xs text-muted-foreground">Personen</dt><dd>{message.persons ?? "–"}</dd></div></dl>
      {message.message && <p className="mt-4 whitespace-pre-wrap break-words border-t border-border pt-4 text-sm text-foreground">{message.message}</p>}
      <Button asChild variant="outline" size="sm" className="mt-4"><a href={`mailto:${message.email}?subject=${encodeURIComponent("Kereztour – deine Anfrage")}`}><Mail />E-Mail schreiben</a></Button>
    </article>)}</div>
  </section>;
}