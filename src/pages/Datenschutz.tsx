import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage, type Language } from "@/i18n/LanguageContext";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const CONTENT: Record<Language, { eyebrow: string; title: string; back: string; backHome: string; stand: string; sections: Section[]; contactLabel: string }> = {
  DE: {
    eyebrow: "Rechtliches",
    title: "Datenschutzerklärung",
    back: "Zurück",
    backHome: "zur Startseite",
    stand: "Stand: September 2026",
    contactLabel: "Kontakt zum Datenschutz",
    sections: [
      {
        title: "1. Verantwortliche Stelle",
        paragraphs: [
          "Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:",
          "Mambetalieva Ainagul Zaidovna\nEinzelunternehmerin\nAk-Ordo Wohngebiet, Ak Bolpon Straße\nLeninsky District, Bishkek\nKyrgyz Republic",
          "E-Mail: sarinasadirovna@gmail.com\nTelefon: +39 347 486 7408",
          "Kereztour ist die Bezeichnung des Reiseangebots und der Website.",
        ],
      },
      {
        title: "2. Welche Daten wir verarbeiten",
        paragraphs: [
          "Wenn du unsere Website besuchst, kannst du sie grundsätzlich nutzen, ohne uns direkt personenbezogene Daten mitzuteilen.",
          "Wenn du eine Buchungsanfrage oder eine unverbindliche Anfrage sendest, verarbeiten wir die Daten, die du selbst in das jeweilige Formular eingibst.",
        ],
        bullets: [
          "Vor- und Nachname",
          "E-Mail-Adresse",
          "Telefonnummer",
          "gewünschte Reise",
          "Reisedatum bzw. Reisezeitraum",
          "Anzahl der Personen",
          "gewählte Reisevariante",
          "freiwillige Nachricht oder Anmerkungen",
        ],
      },
      {
        title: "3. Buchungsanfragen",
        paragraphs: [
          "Bei einer Buchungsanfrage verwenden wir die eingegebenen Daten, um deine Anfrage zu bearbeiten, den gewünschten Reisetermin zu prüfen, mit dir Kontakt aufzunehmen und die Reise vorzubereiten.",
          "Die Buchungsdaten werden in unserer technischen Datenbank gespeichert. Eine Zahlung wird über das Buchungsformular nicht ausgelöst; die Zahlung erfolgt erst nach Bestätigung des Reisetermins durch Kereztour.",
        ],
      },
      {
        title: "4. Kontaktanfragen",
        paragraphs: [
          "Wenn du unser Anfrageformular verwendest, verarbeiten wir insbesondere Name, E-Mail-Adresse, gewünschte Reise, Reisezeitraum, Personenanzahl und deine Nachricht.",
          "Die Daten werden verwendet, um deine Anfrage zu beantworten und die gewünschte Reise mit dir zu besprechen.",
        ],
      },
      {
        title: "5. Datenbank und technische Infrastruktur",
        paragraphs: [
          "Für den Betrieb unserer Website und die Bearbeitung von Buchungs- und Kontaktanfragen nutzen wir externe technische Dienstleister, darunter Supabase. Dabei können die von dir übermittelten personenbezogenen Daten im erforderlichen Umfang verarbeitet werden.",
          "Wir wählen die eingesetzten Dienste mit Blick auf einen angemessenen Schutz personenbezogener Daten aus und berücksichtigen die jeweils geltenden gesetzlichen Anforderungen.",
        ],
      },
      {
        title: "6. E-Mail-Versand",
        paragraphs: [
          "Für die Bearbeitung und den Versand von E-Mails im Zusammenhang mit Buchungs- und Kontaktanfragen nutzen wir einen externen E-Mail-Dienst, darunter Resend. Dabei können die für den Versand erforderlichen Daten verarbeitet werden.",
        ],
      },
      {
        title: "7. YouTube",
        paragraphs: [
          "Auf unserer Website ist ein YouTube-Video eingebettet. Wir verwenden dafür die datenschutzfreundlichere Domain youtube-nocookie.com.",
          "Beim Laden oder Nutzen des eingebetteten Videos kann eine Verbindung zu YouTube bzw. Google hergestellt werden. Dabei können technische Informationen verarbeitet werden.",
        ],
      },
      {
        title: "9. Datenübermittlung und externe Dienste",
        paragraphs: [
          "Für den Betrieb der Website nutzen wir externe technische Dienste wie Supabase und Resend sowie Links bzw. eingebettete Inhalte von Drittanbietern. Dabei können personenbezogene Daten an diese Anbieter übermittelt oder durch diese verarbeitet werden.",
          "Soweit anwendbares Datenschutzrecht Anforderungen an die Übermittlung personenbezogener Daten in andere Staaten stellt, werden die jeweils erforderlichen gesetzlichen Voraussetzungen und Schutzmaßnahmen berücksichtigt.",
        ],
      },
      {
        title: "10. WhatsApp und andere externe Links",
        paragraphs: [
          "Unsere Website enthält Links zu WhatsApp sowie zu unseren Social-Media-Profilen. Wenn du einen solchen Link anklickst, verlässt du unsere Website und gelangst zum jeweiligen externen Dienst.",
          "Ab diesem Zeitpunkt gelten die Datenschutzbestimmungen des jeweiligen Anbieters. Wir haben keinen Einfluss auf die Datenverarbeitung durch diese externen Dienste.",
        ],
      },
      {
        title: "11. Rechtsgrundlagen",
        paragraphs: [
          "Die Verarbeitung personenbezogener Daten erfolgt nach den jeweils anwendbaren Datenschutzvorschriften. Für Kereztour gelten insbesondere die Datenschutzvorschriften der Kirgisischen Republik. Die DSGVO gilt für Kereztour nicht allein deshalb, weil die Website aus der EU erreichbar ist. Soweit die DSGVO aufgrund ihres räumlichen Anwendungsbereichs auf einen konkreten Verarbeitungsvorgang Anwendung findet, erfolgt die Verarbeitung auf einer entsprechenden Rechtsgrundlage nach Art. 6 DSGVO. Dazu können insbesondere gehören:",
        ],
        bullets: [
          "Art. 6 Abs. 1 lit. b DSGVO für die Bearbeitung vorvertraglicher Maßnahmen und die Durchführung eines Vertrags.",
          "Art. 6 Abs. 1 lit. c DSGVO, soweit eine gesetzliche Verpflichtung besteht.",
          "Art. 6 Abs. 1 lit. f DSGVO für berechtigte Interessen, beispielsweise für die sichere und ordnungsgemäße Bereitstellung unserer Website und die Bearbeitung von Anfragen.",
          "Art. 6 Abs. 1 lit. a DSGVO, soweit wir für einen bestimmten Verarbeitungsvorgang eine Einwilligung einholen.",
        ],
      },
      {
        title: "12. Speicherdauer",
        paragraphs: [
          "Wir speichern personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck erforderlich sind oder gesetzliche Aufbewahrungspflichten bestehen.",
          "Die konkrete Speicherdauer hängt von der Art der Anfrage, dem weiteren Verlauf der Geschäftsbeziehung und den jeweils anwendbaren gesetzlichen Aufbewahrungspflichten ab. Wir legen keine einheitliche Frist für alle Daten fest. Daten werden gelöscht oder anonymisiert, sobald sie für den jeweiligen Zweck nicht mehr erforderlich sind und keine gesetzliche Pflicht zur weiteren Speicherung besteht.",
        ],
      },
      {
        title: "13. Deine Rechte",
        paragraphs: [
          "Soweit die DSGVO oder anderes anwendbares Datenschutzrecht gilt, hast du insbesondere das Recht auf:",
        ],
        bullets: [
          "Auskunft über die zu deiner Person gespeicherten Daten",
          "Berichtigung unrichtiger Daten",
          "Löschung deiner Daten unter den gesetzlichen Voraussetzungen",
          "Einschränkung der Verarbeitung unter den gesetzlichen Voraussetzungen",
          "Widerspruch gegen bestimmte Verarbeitungen unter den gesetzlichen Voraussetzungen",
          "Datenübertragbarkeit, soweit die gesetzlichen Voraussetzungen erfüllt sind",
        ],
      },
      {
        title: "14. Beschwerderecht",
        paragraphs: [
          "Du hast das Recht, dich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen anwendbares Datenschutzrecht verstößt.",
        ],
      },
      {
        title: "15. Datensicherheit",
        paragraphs: [
          "Wir treffen angemessene technische und organisatorische Maßnahmen, um personenbezogene Daten vor Verlust, Missbrauch, unbefugtem Zugriff und unbefugter Veränderung zu schützen.",
        ],
      },
      {
        title: "16. Änderungen dieser Datenschutzerklärung",
        paragraphs: [
          "Wir können diese Datenschutzerklärung ändern, wenn sich unsere Website, die eingesetzten technischen Dienste oder die rechtlichen Anforderungen ändern. Es gilt jeweils die auf dieser Website veröffentlichte aktuelle Fassung.",
        ],
      },
    ],
  },
  EN: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    back: "Back",
    backHome: "to the homepage",
    stand: "Last updated: September 2026",
    contactLabel: "Privacy contact",
    sections: [
      {
        title: "1. Controller",
        paragraphs: [
          "The person responsible for processing personal data on this website is:",
          "Mambetalieva Ainagul Zaidovna\nIndividual entrepreneur\nAk-Ordo residential area, Ak Bolpon Street\nLeninsky District, Bishkek\nKyrgyz Republic",
          "Email: sarinasadirovna@gmail.com\nPhone: +39 347 486 7408",
          "Kereztour is the name of the travel service and website.",
        ],
      },
      {
        title: "2. Personal data we process",
        paragraphs: [
          "You can generally visit our website without directly providing us with personal data.",
          "If you submit a booking request or an enquiry, we process the information you enter in the relevant form.",
        ],
        bullets: ["First and last name", "Email address", "Phone number", "Requested trip", "Travel date or travel period", "Number of travellers", "Selected travel option", "Optional message or notes"],
      },
      {
        title: "3. Booking requests",
        paragraphs: [
          "We use booking information to process your request, check the requested travel date, contact you and prepare the trip.",
          "Booking data is stored in our technical database. The booking form does not trigger a payment; payment takes place only after Kereztour confirms the travel date.",
        ],
      },
      {
        title: "4. Contact requests",
        paragraphs: [
          "When you use our enquiry form, we process information such as your name, email address, requested trip, travel period, number of travellers and message.",
          "We use this information to answer your enquiry and discuss the requested trip with you.",
        ],
      },
      {
        title: "5. Database and technical infrastructure",
        paragraphs: [
          "We use Supabase to store and technically process booking and contact requests. The submitted information is stored in the database structures required for the website. Depending on the technical configuration, data may also be processed outside the Kyrgyz Republic."",
          "Supabase may process personal data on our behalf as a technical service provider. Depending on the technical configuration, data may also be processed outside the Kyrgyz Republic. The services and their current privacy and security terms determine the applicable processing arrangements."
        ],
      },
      {
        title: "6. Email delivery",
        paragraphs: [
          "We use Resend to send emails related to booking and contact requests.",
          "When an email is sent through our website, information required for delivery, including the email address, name and content of the relevant message, may be transmitted to Resend. Depending on the technical setup, processing may also take place outside the Kyrgyz Republic."
        ],
      },
      {
        title: "7. YouTube",
        paragraphs: [
          "Our website contains an embedded YouTube video. We use the privacy-enhanced domain youtube-nocookie.com.",
          "Loading or using the embedded video may establish a connection with YouTube or Google, and technical information may be processed.",
        ],
      },
      {
        title: "8. WhatsApp and external links",
        paragraphs: [
          "Our website contains links to WhatsApp and our social-media profiles. When you follow such a link, you leave our website and use the relevant external service.",
          "From that point onward, the privacy policy of the respective provider applies. We do not control the data processing carried out by these external services.",
        ],
      },
      {
        title: "11. Legal bases",
        paragraphs: [
          "Personal data is processed in accordance with the applicable data-protection rules. Kereztour is primarily subject to the data-protection rules applicable in the Kyrgyz Republic. Where the GDPR applies to a particular processing activity because of its territorial scope, the processing is based on an applicable legal basis under Article 6 GDPR. These may include:",
        ],
        bullets: [
          "Article 6(1)(b) GDPR for pre-contractual measures and contract performance.",
          "Article 6(1)(c) GDPR where processing is required by law.",
          "Article 6(1)(f) GDPR for legitimate interests, such as secure and proper operation of the website and handling enquiries.",
          "Article 6(1)(a) GDPR where consent is obtained for a specific processing activity.",
        ],
      },
      {
        title: "12. Retention",
        paragraphs: [
          "We retain personal data only for as long as it is necessary for the relevant purpose or as required by applicable retention obligations.",
          "The specific retention period depends on the type of request, the further course of the business relationship and applicable legal requirements. We do not use one fixed retention period for all data. Data is deleted or anonymised when it is no longer necessary for the relevant purpose and no legal retention obligation applies."
        ],
      },
      {
        title: "13. Your rights",
        paragraphs: [
          "Where the GDPR or other applicable data-protection law applies, you may have the right to:",
        ],
        bullets: ["Access your personal data", "Correct inaccurate data", "Request deletion where legally applicable", "Request restriction of processing where legally applicable", "Object to certain processing where legally applicable", "Data portability where the legal requirements are met"],
      },
      {
        title: "14. Right to complain",
        paragraphs: [
          "You have the right to lodge a complaint with a competent data-protection supervisory authority if you believe that the processing of your personal data violates applicable data-protection law.",
        ],
      },
      {
        title: "15. Data security",
        paragraphs: [
          "We take appropriate technical and organisational measures to protect personal data against loss, misuse, unauthorised access and unauthorised alteration.",
        ],
      },
      {
        title: "16. Changes to this policy",
        paragraphs: [
          "We may update this privacy policy when our website, technical services or legal requirements change. The current version published on this website applies.",
        ],
      },
    ],
  },
  IT: {
    eyebrow: "Note legali",
    title: "Informativa sulla privacy",
    back: "Indietro",
    backHome: "alla home page",
    stand: "Ultimo aggiornamento: settembre 2026",
    contactLabel: "Contatto privacy",
    sections: [
      {
        title: "1. Titolare del trattamento",
        paragraphs: [
          "La responsabile del trattamento dei dati personali su questo sito è:",
          "Mambetalieva Ainagul Zaidovna\nImprenditrice individuale\nAk-Ordo residential area, Ak Bolpon Street\nLeninsky District, Bishkek\nKyrgyz Republic",
          "E-mail: sarinasadirovna@gmail.com\nTelefono: +39 347 486 7408",
          "Kereztour è il nome dell'offerta di viaggio e del sito web.",
        ],
      },
      {
        title: "2. Dati personali trattati",
        paragraphs: [
          "Puoi generalmente visitare il nostro sito senza comunicarci direttamente dati personali.",
          "Se invii una richiesta di prenotazione o una richiesta di informazioni, trattiamo i dati che inserisci nel relativo modulo.",
        ],
        bullets: ["Nome e cognome", "Indirizzo e-mail", "Numero di telefono", "Viaggio richiesto", "Data o periodo del viaggio", "Numero di partecipanti", "Opzione di viaggio scelta", "Messaggio o note facoltative"],
      },
      {
        title: "3. Richieste di prenotazione",
        paragraphs: [
          "Utilizziamo i dati della richiesta per gestire la prenotazione, verificare la data desiderata, contattarti e preparare il viaggio.",
          "I dati della prenotazione vengono conservati nel nostro database tecnico. Il modulo di prenotazione non avvia alcun pagamento; il pagamento avviene solo dopo la conferma della data da parte di Kereztour.",
        ],
      },
      {
        title: "4. Richieste di contatto",
        paragraphs: [
          "Quando utilizzi il modulo di contatto, trattiamo dati quali nome, indirizzo e-mail, viaggio richiesto, periodo, numero di partecipanti e messaggio.",
          "Utilizziamo questi dati per rispondere alla tua richiesta e discutere con te il viaggio desiderato.",
        ],
      },
      {
        title: "5. Database e infrastruttura tecnica",
        paragraphs: [
          "Utilizziamo Supabase per la conservazione e il trattamento tecnico delle richieste di prenotazione e di contatto. I dati inviati vengono conservati nelle strutture del database necessarie al funzionamento del sito. A seconda della configurazione tecnica, i dati possono essere trattati anche al di fuori della Repubblica del Kirghizistan."
          "Supabase può trattare dati personali per nostro conto in qualità di fornitore tecnico. Sono determinanti i servizi effettivamente utilizzati e le relative condizioni aggiornate in materia di privacy e sicurezza."
        ],
      },
      {
        title: "6. Invio delle e-mail",
        paragraphs: [
          "Per la gestione e l'invio delle e-mail relative alle richieste di prenotazione e di contatto utilizziamo un servizio e-mail esterno, tra cui Resend. I dati necessari per l'invio possono essere trattati a tale scopo.",
        ],
      },
      {
        title: "7. YouTube",
        paragraphs: [
          "Il nostro sito contiene un video YouTube incorporato. Utilizziamo il dominio più rispettoso della privacy youtube-nocookie.com.",
          "Il caricamento o l'utilizzo del video incorporato può stabilire una connessione con YouTube o Google e comportare il trattamento di informazioni tecniche.",
        ],
      },
      {
        title: "8. WhatsApp e link esterni",
        paragraphs: [
          "Il nostro sito contiene link a WhatsApp e ai nostri profili social. Quando segui uno di questi link, lasci il nostro sito e utilizzi il servizio esterno.",
          "Da quel momento si applica l'informativa sulla privacy del relativo fornitore. Non controlliamo il trattamento dei dati effettuato da tali servizi esterni.",
        ],
      },
      {
        title: "11. Basi giuridiche",
        paragraphs: [
          "I dati personali vengono trattati secondo le norme applicabili in materia di protezione dei dati. Per Kereztour si applicano in particolare le norme sulla protezione dei dati della Repubblica del Kirghizistan. Quando il GDPR si applica a uno specifico trattamento in base al suo ambito territoriale, il trattamento si basa su una delle basi giuridiche previste dall'art. 6 GDPR. Possono essere rilevanti in particolare:"
        ],
        bullets: [
          "Art. 6(1)(b) GDPR per misure precontrattuali e per l'esecuzione di un contratto.",
          "Art. 6(1)(c) GDPR quando il trattamento è richiesto dalla legge.",
          "Art. 6(1)(f) GDPR per interessi legittimi, come il funzionamento sicuro e corretto del sito e la gestione delle richieste.",
          "Art. 6(1)(a) GDPR quando viene richiesto il consenso per una specifica attività di trattamento.",
        ],
      },
      {
        title: "12. Conservazione dei dati",
        paragraphs: [
          "Conserviamo i dati personali solo per il tempo necessario allo scopo previsto o per il periodo richiesto dagli obblighi di conservazione applicabili.",
          "Il periodo concreto dipende dal tipo di richiesta, dall'ulteriore rapporto commerciale e dagli obblighi di legge applicabili. Non utilizziamo un unico periodo di conservazione per tutti i dati. I dati vengono cancellati o anonimizzati quando non sono più necessari allo scopo e non sussiste un obbligo legale di conservarli."
        ],
      },
      {
        title: "13. I tuoi diritti",
        paragraphs: [
          "Quando si applica il GDPR o un'altra normativa sulla protezione dei dati, puoi avere il diritto di:",
        ],
        bullets: ["ottenere l'accesso ai tuoi dati personali", "chiedere la correzione di dati inesatti", "chiedere la cancellazione nei casi previsti dalla legge", "chiedere la limitazione del trattamento nei casi previsti dalla legge", "opporti a determinati trattamenti nei casi previsti dalla legge", "ottenere la portabilità dei dati quando sono soddisfatti i requisiti di legge"],
      },
      {
        title: "14. Diritto di reclamo",
        paragraphs: [
          "Hai il diritto di presentare un reclamo a un'autorità di controllo competente in materia di protezione dei dati se ritieni che il trattamento dei tuoi dati personali violi la normativa applicabile.",
        ],
      },
      {
        title: "15. Sicurezza dei dati",
        paragraphs: [
          "Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da perdita, uso improprio, accesso non autorizzato e modifica non autorizzata.",
        ],
      },
      {
        title: "16. Modifiche alla presente informativa",
        paragraphs: [
          "Possiamo aggiornare la presente informativa quando cambiano il sito, i servizi tecnici utilizzati o i requisiti di legge. Si applica la versione attualmente pubblicata su questo sito.",
        ],
      },
    ],
  },
};

const Datenschutz = () => {
  const { language } = useLanguage();
  const content = CONTENT[language];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {content.back} {content.backHome}
          </Link>

          <p className="eyebrow mb-4">{content.eyebrow}</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">
            {content.title}
          </h1>
          <p className="mt-5 text-sm text-muted-foreground">{content.stand}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-[900px] px-6 py-16 md:py-24">
        <div className="space-y-12">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-5 font-display text-3xl md:text-4xl">
                {section.title}
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <section className="border-t border-border pt-8">
            <h2 className="mb-5 font-display text-3xl md:text-4xl">
              {content.contactLabel}
            </h2>
            <div className="space-y-4 text-sm">
              <a
                href="mailto:sarinasadirovna@gmail.com"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                sarinasadirovna@gmail.com
              </a>
              <a
                href="tel:+393474867408"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +39 347 486 7408
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Datenschutz;
