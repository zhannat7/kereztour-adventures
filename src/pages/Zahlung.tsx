import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface BookingState {
  status?: "request";
  name: string;
  travelDate: string;
  tour: string;
  transport?: string | null;
  persons: number;
  pricePerPerson: number;
  totalPrice: number;
}

const Zahlung = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const booking = location.state as BookingState | null;
  const paymentStatus = searchParams.get("status");

  const isPaymentSuccess = paymentStatus === "success";
  const isPaymentCancelled = paymentStatus === "cancelled";

  if (isPaymentSuccess) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="space-y-6 border-y border-border bg-card p-6 text-center shadow-soft md:p-10">
              <CheckCircle className="mx-auto h-16 w-16 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">{t("Anzahlung erfolgreich")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("Vielen Dank. Deine Anzahlung von 150 € wurde über Stripe bezahlt. Die Buchung wird jetzt im System als Anzahlung bezahlt erfasst.")}
              </p>
              <div className="rounded-sm border border-border bg-muted p-5 text-left space-y-2">
                <p><b>{t("Anzahlung")}:</b> 150 €</p>
                <p>{t("Der Restbetrag wird vor Ort in Kirgistan bar bezahlt.")}</p>
              </div>
              <Button onClick={() => navigate("/")} className="w-full">{t("Zurück zur Startseite")}</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isPaymentCancelled) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="space-y-5 border-y border-border bg-card p-6 text-center md:p-10">
              <h1 className="text-2xl font-bold text-primary">{t("Zahlung nicht abgeschlossen")}</h1>
              <p className="text-muted-foreground">{t("Die 150 € Anzahlung wurde nicht bezahlt. Deine Buchungsanfrage bleibt bestehen. Du kannst Sarina kontaktieren oder später erneut bezahlen.")}</p>
              <Button onClick={() => navigate("/")} className="w-full">{t("Zurück zur Startseite")}</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">{t("Keine Buchungsdaten gefunden.")}</p>
            <Button onClick={() => navigate("/")}>{t("Zurück")} zur Startseite</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const remaining = Math.max(booking.totalPrice - 150, 0);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="space-y-6 border-y border-border bg-card p-6 text-center shadow-soft md:p-10">
            <CheckCircle className="mx-auto h-16 w-16 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{t("Buchungsanfrage erhalten")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("Vielen Dank für deine Anfrage. Sarina prüft den gewünschten Termin und meldet sich bei dir.")}
            </p>
            <div className="space-y-3 border-y border-border bg-muted p-5 text-left">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("Name")}</span><span className="font-medium">{booking.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("Reise")}</span><span className="font-medium">{booking.tour}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("Transport")}</span><span className="font-medium">{booking.transport ?? "–"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("Reisedatum")}</span><span className="font-medium">{booking.travelDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("Personen")}</span><span className="font-medium">{booking.persons}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("Preis pro Person")}</span><span className="font-medium">{booking.pricePerPerson.toLocaleString("de-DE")} €</span></div>
              <div className="flex justify-between border-t border-border pt-3"><span className="font-semibold">{t("Gesamtpreis")}</span><span className="font-bold text-primary">{booking.totalPrice.toLocaleString("de-DE")} €</span></div>
              <div className="flex justify-between"><span className="font-semibold">{t("Anzahlung")}</span><span className="font-bold">150 €</span></div>
              <div className="flex justify-between"><span className="font-semibold">{t("Restbetrag vor Ort")}</span><span className="font-bold">{remaining.toLocaleString("de-DE")} €</span></div>
            </div>
            <p className="text-muted-foreground text-sm">{t("Bei dieser Buchungsanfrage ist keine Zahlung erforderlich. Wenn du verbindlich buchen möchtest, kannst du die 150 € Anzahlung über Stripe bezahlen. Der Restbetrag wird in Kirgistan bar bezahlt.")}</p>
            <Button onClick={() => navigate("/")} className="w-full">{t("Zurück zur Startseite")}</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Zahlung;
