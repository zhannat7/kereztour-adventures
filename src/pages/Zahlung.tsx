import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
            <Button onClick={() => navigate("/")}>Zurück zur Startseite</Button>
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
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm text-center space-y-6">
            <CheckCircle className="mx-auto h-16 w-16 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Buchung eingegangen!</h1>
            <p className="text-muted-foreground text-sm">
              Wir melden uns in Kürze bei dir. Danke für dein Vertrauen! 🙏
            </p>
            <div className="text-left space-y-3 bg-muted rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-foreground">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reise</span>
                <span className="font-medium text-foreground">{booking.tour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reisedatum</span>
                <span className="font-medium text-foreground">{booking.travelDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reisetyp</span>
                <span className="font-medium text-foreground capitalize">{booking.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personen</span>
                <span className="font-medium text-foreground">{booking.persons}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">Gesamtpreis</span>
                <span className="font-bold text-primary">{booking.totalPrice.toLocaleString("de-DE")} €</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Zahlung wird in Kürze verfügbar sein.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Zahlung;
