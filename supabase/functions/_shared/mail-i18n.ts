export type MailLang = "DE" | "EN" | "IT";

export const parseLang = (v: unknown): MailLang =>
  v === "EN" || v === "IT" ? v : "DE";

const T = {
  DE: {
    bookingSubject: "Deine Buchungsanfrage bei Kereztour",
    bookingHeading: "Vielen Dank für deine Buchungsanfrage!",
    hello: (n: string) => `Hallo ${n},`,
    bookingIntro: "vielen Dank für deine Buchungsanfrage bei Kereztour! Wir haben deine Anfrage erhalten und prüfen jetzt deinen gewünschten Termin. Wir melden uns ganz bald persönlich zur Bestätigung bei dir.",
    bookingClosing: "Wir melden uns persönlich bei dir, um die Details und Verfügbarkeit zu besprechen. Wenn du danach verbindlich buchen möchtest, senden wir dir einen persönlichen Zahlungslink. Bitte bezahle noch nichts, bevor du den Zahlungslink und die Buchungsbedingungen von uns erhalten hast.",
    contactSubject: "Deine Anfrage bei Kereztour",
    contactHeading: "Vielen Dank für deine Anfrage!",
    contactIntro: "vielen Dank für deine Anfrage bei Kereztour. Wir haben deine Nachricht erhalten und melden uns innerhalb von 24 Stunden bei dir.",
    regards: "Herzliche Grüße",
    sign: "Zarina & das Kereztour-Team",
    tour: "Reise", date: "Reisedatum", tier: "Reisevariante", persons: "Personen",
    total: "Gesamtpreis", period: "Zeitraum", to: "bis",
  },
  EN: {
    bookingSubject: "Your booking request with Kereztour",
    bookingHeading: "Thank you for your booking request!",
    hello: (n: string) => `Hello ${n},`,
    bookingIntro: "thank you for your booking request with Kereztour! We have received your request and are now checking your preferred date. We will get back to you personally very soon to confirm.",
    bookingClosing: "We will contact you personally to discuss the details and availability. If you then wish to book bindingly, we will send you a personal payment link. Please do not pay anything before you have received the payment link and booking conditions from us.",
    contactSubject: "Your enquiry with Kereztour",
    contactHeading: "Thank you for your enquiry!",
    contactIntro: "thank you for your enquiry with Kereztour. We have received your message and will get back to you within 24 hours.",
    regards: "Warm regards",
    sign: "Zarina & the Kereztour team",
    tour: "Tour", date: "Travel date", tier: "Tour option", persons: "Travellers",
    total: "Total price", period: "Period", to: "to",
  },
  IT: {
    bookingSubject: "La tua richiesta di prenotazione con Kereztour",
    bookingHeading: "Grazie per la tua richiesta di prenotazione!",
    hello: (n: string) => `Ciao ${n},`,
    bookingIntro: "grazie per la tua richiesta di prenotazione con Kereztour! Abbiamo ricevuto la tua richiesta e stiamo verificando la data desiderata. Ti contatteremo personalmente molto presto per la conferma.",
    bookingClosing: "Ti contatteremo personalmente per discutere i dettagli e la disponibilità. Se poi desideri prenotare in modo vincolante, ti invieremo un link di pagamento personale. Ti preghiamo di non pagare nulla prima di aver ricevuto da noi il link di pagamento e le condizioni di prenotazione.",
    contactSubject: "La tua richiesta a Kereztour",
    contactHeading: "Grazie per la tua richiesta!",
    contactIntro: "grazie per la tua richiesta a Kereztour. Abbiamo ricevuto il tuo messaggio e ti risponderemo entro 24 ore.",
    regards: "Un caro saluto",
    sign: "Zarina e il team Kereztour",
    tour: "Viaggio", date: "Data del viaggio", tier: "Variante", persons: "Persone",
    total: "Prezzo totale", period: "Periodo", to: "al",
  },
};

export const mailText = (lang: MailLang) => T[lang];
