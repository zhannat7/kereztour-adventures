import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface BookingState {
  name: string;
  travelDate: string;
  tour: string;
  tier: string;
  persons: number;
  totalPrice: number;
}

const Zahlung = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state as BookingState | null;

  if (!booking) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Keine Buchungsdaten gefunden.</p>
            <Button onClick={() => navigate("/")}>{t("Zurück")} zur Startseite</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="space-y-6 border-y border-border bg-card p-6 text-center shadow-soft md:p-10">
            <CheckCircle className="mx-auto h-16 w-16 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{t("Buchungsanfrage erhalten")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("Vielen Dank für deine Anfrage. Sarina prüft den gewünschten Termin und meldet sich zur Bestätigung bei dir.")}
            </p>
            <div className="space-y-3 border-y border-border bg-muted p-5 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Name")}</span>
                <span className="font-medium text-foreground">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Reise")}</span>
                <span className="font-medium text-foreground">{booking.tour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Reisedatum")}</span>
                <span className="font-medium text-foreground">{booking.travelDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Reisevariante")}</span>
                <span className="font-medium text-foreground capitalize">{booking.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Personen")}</span>
                <span className="font-medium text-foreground">{booking.persons}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">{t("Gesamtpreis")}</span>
                <span className="font-bold text-primary">{booking.totalPrice.toLocaleString("de-DE")} €</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{t("Nach der Bestätigung erhältst du den Zahlungslink. Die Zahlung erfolgt erst, wenn der Termin von Sarina bestätigt wurde.")}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              {t("Zurück")} zur Startseite
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Zahlung;
