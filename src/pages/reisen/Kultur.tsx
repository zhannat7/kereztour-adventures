import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Users, CheckCircle, CalendarDays } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import kyrchynVideo from "@/assets/kyrchyn-tour.mp4.asset.json";

import t1a from "@/assets/gallery/IMG_2518.jpg";
import t1b from "@/assets/gallery/11.webp";
import t1c from "@/assets/gallery/12.webp";
import t1d from "@/assets/gallery/13.webp";
import t1e from "@/assets/gallery/14.webp";
import t2a from "@/assets/gallery/IMG_2646.jpg";
import t2b from "@/assets/gallery/IMG_2677.jpg";
import t2c from "@/assets/gallery/21.webp";
import t2d from "@/assets/gallery/22.webp";
import t3a from "@/assets/gallery/IMG_4663.jpg";
import t3b from "@/assets/gallery/IMG_3007.jpg";
import t3c from "@/assets/gallery/31.webp";
import t3d from "@/assets/gallery/32.webp";
import t4a from "@/assets/gallery/IMG_4858.jpg";
import t4b from "@/assets/gallery/IMG_4846.jpg";
import t4c from "@/assets/gallery/41.webp";
import t4d from "@/assets/gallery/42.webp";
import t5a from "@/assets/gallery/IMG_3600.jpg";
import t5b from "@/assets/gallery/51.webp";
import t6a from "@/assets/gallery/IMG_4933.jpg";
import t6b from "@/assets/gallery/IMG_4920.jpg";
import t7a from "@/assets/gallery/IMG_3466.jpg";
import t8a from "@/assets/gallery/IMG_4992.jpg";
import t8b from "@/assets/gallery/IMG_3858.jpg";
import t8c from "@/assets/gallery/81.webp";
import t9a from "@/assets/gallery/82.webp";
import t9b from "@/assets/gallery/91.webp";
import t10a from "@/assets/gallery/10.webp";


const itineraryTranslations: Record<"DE" | "EN", Record<string, string>> = {
  DE: {
    "Giorno 1 – Punto di incontro:": "Tag 1 – Ankunft und Begrüßung",
    "Giorno 2 – Chon-Kemin:": "Tag 2 – Chon-Kemin",
    "Giorno 3 – Sponda sud del lago Issyk-Kul:": "Tag 3 – Südufer des Issyk-Kul-Sees",
    "Giorno 4 – Barskoon e Dscheti-Oguz:": "Tag 4 – Barskoon und Dscheti-Oguz",
    "Giorno 5 – Dscheti-Oguz e Karakol:": "Tag 5 – Dscheti-Oguz und Karakol",
    "Giorno 6 – Altyn-Arashan:": "Tag 6 – Altyn-Arashan",
    "Giorno 7 – Chiese storiche e Moschea Dungan:": "Tag 7 – Historische Kirchen und Dunganen-Moschee",
    "Giorno 8 – Ruh Ordo, Gita in barca e Petrografi:": "Tag 8 – Ruh Ordo, Bootsfahrt und Petroglyphen",
    "Giorno 9 – Ritorno a Bishkek e Bazar:": "Tag 9 – Rückkehr nach Bischkek und Basar",
    "Giorno 10 – Transferimento all'aeroporto:": "Tag 10 – Transfer zum Flughafen",
    "Arrivo all'Aeroporto Internazionale di Manas e trasferimento in hotel a Bishkek.": "Ankunft am internationalen Flughafen Manas und Transfer zum Hotel in Bischkek.",
    "Riposo dopo il lungo viaggio.": "Zeit zum Ausruhen nach der langen Reise.",
    "Pranzo intorno alle 12 o alle 13 in un ristorante locale.": "Mittagessen gegen 12 oder 13 Uhr in einem lokalen Restaurant.",
    "Tour della città nel pomeriggio: visita a Piazza Ala-Too, Parco delle Querce e Museo Storico.": "Stadtrundfahrt am Nachmittag mit Besuch des Ala-Too-Platzes, des Eichenparks und des Historischen Museums.",
    "Cena in un ristorante etnico tradizionale a Bishkek chiamato \"Supara\".": "Abendessen im traditionellen Restaurant „Supara“ in Bischkek.",
    "Il nostro tour inizia in direzione dell'unica Riserva Naturale di Chon-Kemin.": "Unsere Reise führt zum einzigartigen Naturreservat Chon-Kemin.",
    "La cena si terrà in un hotel locale, dove pernotteremo anche.": "Abendessen und Übernachtung in einem lokalen Hotel.",
    "Successivamente, visiteremo i canyon \"Skazka\" (Valle delle fiabe) e \"Aksai\".": "Anschließend besuchen wir die Schluchten Skazka („Märchental“) und Aksai.",
    "Dopo una giornata ricca di eventi, ci sarà la possibilità di nuotare nel lago e rinfrescarsi.": "Nach einem erlebnisreichen Tag können Sie im See schwimmen und sich erfrischen.",
    "Pernottamento in un tradizionale hotel di yurte nelle vicinanze.": "Übernachtung in einem traditionellen Jurtenhotel in der Nähe.",
    "Qui ci sono meravigliose opportunità per fare escursioni, fotografare e godersi la natura.": "Hier gibt es wunderbare Möglichkeiten zum Wandern, Fotografieren und Genießen der Natur.",
    "Viaggio verso la città di Karakol (circa 30 minuti).": "Weiterfahrt in die Stadt Karakol (etwa 30 Minuten).",
    "Cena in un ristorante locale e pernottamento.": "Abendessen in einem lokalen Restaurant und Übernachtung.",
    "La moschea Dungan è una struttura unica in legno, costruita interamente senza l'uso di un singolo chiodo.": "Die Dunganen-Moschee ist ein einzigartiges Holzbauwerk, das vollständig ohne Nägel errichtet wurde.",
    "Successivamente, proseguiamo per Cholpon-Ata, sulla costa nord del lago Issyk-Kul.": "Anschließend fahren wir nach Tscholpon-Ata am Nordufer des Issyk-Kul-Sees.",
    "Prima dell'arrivo, visiteremo il villaggio etnico di Kyrchyn.": "Vor der Ankunft besuchen wir das ethnische Dorf Kyrchyn.",
    "E naturalmente, un bagno nelle acque limpide del lago Issyk-Kul è d'obbligo!": "Und natürlich darf ein Bad im klaren Wasser des Issyk-Kul-Sees nicht fehlen!",
    "Trasferimento all'aeroporto di Manas e partenza individuale.": "Transfer zum Flughafen Manas und individuelle Abreise.",
    "Il viaggio offre numerose opportunità per vivere la straordinaria natura del Kirghizistan. Fai escursioni attraverso valli pittoresche, nuota nelle acque cristalline del lago Issyk-Kul e trascorri la notte in Yurta tradizionali. Scopri di più sulla storia e la cultura del paese attraverso visite a musei e siti storici. Durante il viaggio, avrai l'occasione di provare la cucina tradizionale kirghisa.": "Die Reise bietet viele Möglichkeiten, die beeindruckende Natur Kirgisistans zu erleben. Wandere durch malerische Täler, schwimme im klaren Wasser des Issyk-Kul-Sees und übernachte in traditionellen Jurten. Entdecke Geschichte und Kultur bei Besuchen von Museen und historischen Stätten und probiere die traditionelle kirgisische Küche."
,

    "Lungo la strada, faremo una sosta presso la storica Torre di Burana. Successivamente, continueremo il nostro viaggio verso la gola di Chon-Kemin. All'ingresso della valle si trova la confluenza di due fiumi: il turchese Chon-Kemin e il selvaggio Chuy. Lì vi aspettano escursioni a cavallo o un facile trekking nel Parco Nazionale di Chon-Kemin.": "Unterwegs halten wir am historischen Burana-Turm. Danach fahren wir weiter zur Chon-Kemin-Schlucht. Am Taleingang treffen der türkisfarbene Chon-Kemin und der wilde Chuy aufeinander. Hier können Sie reiten oder eine leichte Wanderung im Nationalpark unternehmen.",
    "Partenza in direzione della sponda sud del lago Issyk-Kul con sosta nel villaggio di Bokonbaeva. Lì assisteremo a una dimostrazione di caccia con l'aquila, un'antica tradizione dei kirghisi sopravvissuta fino ad oggi, sebbene praticata solo da pochi.": "Wir fahren zum Südufer des Issyk-Kul-Sees und halten im Dorf Bokonbajewo. Dort erleben wir eine Vorführung der Adlerjagd – eine alte kirgisische Tradition, die bis heute von wenigen Menschen gepflegt wird.",
    "Questa pratica unica unisce la caccia a volpi e lepri, l'addestramento di rapaci come l'aquila reale (\"Berkut\") e un legame profondo tra cacciatore e uccello.": "Diese Tradition verbindet die Jagd auf Füchse und Hasen, das Training von Greifvögeln wie dem Steinadler („Berkut“) und eine enge Bindung zwischen Jäger und Vogel.",
    "Proseguiamo verso il villaggio di Barskoon, noto per le sue impressionanti cascate. In passato, anche i cosmonauti russi vi trascorrevano il loro tempo libero, e in loro onore sono stati eretti dei monumenti.": "Wir fahren weiter zum Dorf Barskoon, das für seine beeindruckenden Wasserfälle bekannt ist. Früher verbrachten auch russische Kosmonauten hier ihre Freizeit; zu ihren Ehren wurden Denkmäler errichtet.",
    "Dopo pranzo, ci aspetta un'attività interessante: aiuteremo a montare una yurta tradizionale insieme agli abitanti del posto, che realizzano tappeti artistici di lana secondo la tradizione kirghisa.": "Nach dem Mittagessen bauen wir gemeinsam mit Einheimischen eine traditionelle Jurte auf. Sie fertigen kunstvolle Wollteppiche nach kirgisischer Tradition.",
    "Successivamente, proseguiamo per Jeti-Oguz, dove ceneremo e pernotteremo.": "Anschließend fahren wir nach Dscheti-Oguz, wo wir zu Abend essen und übernachten.",
    "Dscheti-Oguz è una pittoresca gola nelle montagne del Tien-Shan, famosa per le sue formazioni di arenaria rossa, in particolare i \"Sette Tori\" e il \"Cuore Infranto\".": "Dscheti-Oguz ist eine malerische Schlucht im Tien-Shan-Gebirge, bekannt für rote Sandsteinformationen wie die „Sieben Stiere“ und das „Gebrochene Herz“.",
    "Se il tempo lo permette, visiteremo le sorgenti termali poco fuori Karakol, ideali per rilassarsi dopo una lunga giornata.": "Wenn es die Zeit erlaubt, besuchen wir Thermalquellen außerhalb von Karakol – ideal zum Entspannen nach einem langen Tag.",
    "Ci dirigiamo verso la bellissima valle di Altyn-Arashan, nota per la sua natura mozzafiato e le sorgenti termali.": "Wir fahren in das wunderschöne Tal Altyn-Arashan, das für seine beeindruckende Natur und Thermalquellen bekannt ist.",
    "La gola si trova in una zona alpina remota, circondata da fitte foreste, limpidi torrenti di montagna e cime innevate.": "Die Schlucht liegt in einer abgelegenen Alpenregion, umgeben von dichten Wäldern, klaren Gebirgsbächen und schneebedeckten Gipfeln.",
    "\"Altyn-Arashan\" significa \"Sorgente termale dorata\" in kirghiso, e qui si trovano sorgenti termali naturali stimate per i loro effetti curativi.": "„Altyn-Arashan“ bedeutet auf Kirgisisch „Goldene Thermalquelle“. Hier gibt es natürliche Thermalquellen, denen heilende Eigenschaften zugeschrieben werden.",
    "I bagni caldi si trovano immersi nella natura: un'esperienza unica per rilassarsi dopo un'escursione o una giornata attiva.": "Die warmen Quellen liegen mitten in der Natur und bieten Entspannung nach einer Wanderung oder einem aktiven Tag.",
    "Altyn-Arashan è raggiungibile solo con veicoli fuoristrada o a piedi, il che rende il luogo particolarmente tranquillo e incontaminato.": "Altyn-Arashan ist nur mit Geländefahrzeugen oder zu Fuß erreichbar und deshalb besonders ruhig und unberührt.",
    "L'intera escursione a piedi dura circa 4 ore, incluse le pause per riposare e scattare fotografie.": "Die gesamte Wanderung dauert etwa vier Stunden, einschließlich Pausen zum Ausruhen und Fotografieren.",
    "Per il ritorno, c'è la possibilità di scegliere se tornare a cavallo o comodamente con uno speciale veicolo fuoristrada.": "Für den Rückweg können Sie zwischen einem Ausritt und der Fahrt in einem speziellen Geländefahrzeug wählen.",
    "Dopo colazione, visitiamo in tutta tranquillità la storica chiesa russo-ortodossa e la moschea Dungan, due impressionanti edifici religiosi con architetture molto diverse tra loro.": "Nach dem Frühstück besuchen wir die historische russisch-orthodoxe Kirche und die Dunganen-Moschee – zwei beeindruckende religiöse Gebäude mit sehr unterschiedlicher Architektur.",
    "A Cholpon-Ata, visitiamo il museo culturale all'aperto \"Ruh Ordo\", intitolato al famoso scrittore kirghiso Cingiz Ajtmatov.": "In Tscholpon-Ata besuchen wir das Freilicht-Kulturmuseum „Ruh Ordo“, benannt nach dem berühmten kirgisischen Schriftsteller Tschingis Aitmatow.",
    "Successivamente, faremo una rilassante gita in barca sul lago Issyk-Kul con una nave da escursione. Godiamo l'aria fresca del lago e la vista imponente delle montagne del Tien-Shan.": "Anschließend unternehmen wir eine entspannte Bootsfahrt auf dem Issyk-Kul-See und genießen die frische Seeluft sowie den beeindruckenden Blick auf das Tien-Shan-Gebirge.",
    "Dopo pranzo, visitiamo il famoso museo di petroglifi a cielo aperto, chiamato anche \"Giardino di Pietra\". Le incisioni rupestri risalgono al 2000 a.C. circa e sono considerate un tesoro culturale della regione.": "Nach dem Mittagessen besuchen wir das berühmte Freilichtmuseum mit Petroglyphen, auch „Steingarten“ genannt. Die Felszeichnungen stammen ungefähr aus dem Jahr 2000 v. Chr. und gelten als kultureller Schatz der Region.",
    "Il nono giorno, ritorniamo a Bishkek. Dopo l'arrivo, visitiamo il bazar più grande del paese, un luogo perfetto per acquistare souvenir, frutta secca e altre specialità locali.": "Am neunten Tag kehren wir nach Bischkek zurück und besuchen den größten Basar des Landes – ideal für Souvenirs, Trockenfrüchte und lokale Spezialitäten.",
    "Per concludere il nostro viaggio, ci aspetta una festosa cena d'addio in un ristorante suggestivo. Lì potremo goderci i suoni degli strumenti tradizionali kirghisi, suonati da musicisti di talento: una conclusione culturale indimenticabile.": "Zum Abschluss erwartet uns ein festliches Abschiedsessen in einem stimmungsvollen Restaurant mit traditioneller kirgisischer Livemusik."
  },
  EN: {
    "Giorno 1 – Punto di incontro:": "Day 1 – Arrival and welcome",
    "Giorno 2 – Chon-Kemin:": "Day 2 – Chon-Kemin",
    "Giorno 3 – Sponda sud del lago Issyk-Kul:": "Day 3 – Southern shore of Lake Issyk-Kul",
    "Giorno 4 – Barskoon e Dscheti-Oguz:": "Day 4 – Barskoon and Jeti-Oguz",
    "Giorno 5 – Dscheti-Oguz e Karakol:": "Day 5 – Jeti-Oguz and Karakol",
    "Giorno 6 – Altyn-Arashan:": "Day 6 – Altyn-Arashan",
    "Giorno 7 – Chiese storiche e Moschea Dungan:": "Day 7 – Historic churches and Dungan Mosque",
    "Giorno 8 – Ruh Ordo, Gita in barca e Petrografi:": "Day 8 – Ruh Ordo, boat trip and petroglyphs",
    "Giorno 9 – Ritorno a Bishkek e Bazar:": "Day 9 – Return to Bishkek and the bazaar",
    "Giorno 10 – Transferimento all'aeroporto:": "Day 10 – Transfer to the airport",
    "Arrivo all'Aeroporto Internazionale di Manas e trasferimento in hotel a Bishkek.": "Arrival at Manas International Airport and transfer to the hotel in Bishkek.",
    "Riposo dopo il lungo viaggio.": "Time to rest after the long journey.",
    "Pranzo intorno alle 12 o alle 13 in un ristorante locale.": "Lunch at around 12 or 1 pm at a local restaurant.",
    "Tour della città nel pomeriggio: visita a Piazza Ala-Too, Parco delle Querce e Museo Storico.": "Afternoon city tour visiting Ala-Too Square, Oak Park and the Historical Museum.",
    "Cena in un ristorante etnico tradizionale a Bishkek chiamato \"Supara\".": "Dinner at a traditional restaurant in Bishkek called “Supara”.",
    "Il nostro tour inizia in direzione dell'unica Riserva Naturale di Chon-Kemin.": "Our journey heads towards the unique Chon-Kemin Nature Reserve.",
    "La cena si terrà in un hotel locale, dove pernotteremo anche.": "Dinner and overnight stay are at a local hotel.",
    "Successivamente, visiteremo i canyon \"Skazka\" (Valle delle fiabe) e \"Aksai\".": "Next, we visit the Skazka (“Fairytale Valley”) and Aksai canyons.",
    "Dopo una giornata ricca di eventi, ci sarà la possibilità di nuotare nel lago e rinfrescarsi.": "After a full day, there is time to swim in the lake and cool off.",
    "Pernottamento in un tradizionale hotel di yurte nelle vicinanze.": "Overnight stay in a traditional yurt hotel nearby.",
    "Qui ci sono meravigliose opportunità per fare escursioni, fotografare e godersi la natura.": "There are wonderful opportunities for hiking, photography and enjoying nature.",
    "Viaggio verso la città di Karakol (circa 30 minuti).": "Travel to the city of Karakol (about 30 minutes).",
    "Cena in un ristorante locale e pernottamento.": "Dinner at a local restaurant and overnight stay.",
    "La moschea Dungan è una struttura unica in legno, costruita interamente senza l'uso di un singolo chiodo.": "The Dungan Mosque is a unique wooden structure built entirely without a single nail.",
    "Successivamente, proseguiamo per Cholpon-Ata, sulla costa nord del lago Issyk-Kul.": "We then continue to Cholpon-Ata on the northern shore of Lake Issyk-Kul.",
    "Prima dell'arrivo, visiteremo il villaggio etnico di Kyrchyn.": "Before arriving, we visit the Kyrchyn ethnic village.",
    "E naturalmente, un bagno nelle acque limpide del lago Issyk-Kul è d'obbligo!": "And of course, a swim in the clear waters of Lake Issyk-Kul is a must!",
    "Trasferimento all'aeroporto di Manas e partenza individuale.": "Transfer to Manas Airport for individual departure.",
    "Il viaggio offre numerose opportunità per vivere la straordinaria natura del Kirghizistan. Fai escursioni attraverso valli pittoresche, nuota nelle acque cristalline del lago Issyk-Kul e trascorri la notte in Yurta tradizionali. Scopri di più sulla storia e la cultura del paese attraverso visite a musei e siti storici. Durante il viaggio, avrai l'occasione di provare la cucina tradizionale kirghisa.": "The trip offers many ways to experience Kyrgyzstan’s remarkable nature. Hike through scenic valleys, swim in the clear waters of Lake Issyk-Kul, stay in traditional yurts, explore museums and historic sites, and sample traditional Kyrgyz cuisine.",

    "Lungo la strada, faremo una sosta presso la storica Torre di Burana. Successivamente, continueremo il nostro viaggio verso la gola di Chon-Kemin. All'ingresso della valle si trova la confluenza di due fiumi: il turchese Chon-Kemin e il selvaggio Chuy. Lì vi aspettano escursioni a cavallo o un facile trekking nel Parco Nazionale di Chon-Kemin.": "On the way, we stop at historic Burana Tower before continuing to the Chon-Kemin gorge. At the valley entrance, the turquoise Chon-Kemin and the wild Chuy rivers meet. You can enjoy horseback riding or an easy hike in the national park.",
    "Partenza in direzione della sponda sud del lago Issyk-Kul con sosta nel villaggio di Bokonbaeva. Lì assisteremo a una dimostrazione di caccia con l'aquila, un'antica tradizione dei kirghisi sopravvissuta fino ad oggi, sebbene praticata solo da pochi.": "We travel to the southern shore of Lake Issyk-Kul, stopping in Bokonbaevo village to see eagle hunting, an ancient Kyrgyz tradition still practised by a small number of people.",
    "Questa pratica unica unisce la caccia a volpi e lepri, l'addestramento di rapaci come l'aquila reale (\"Berkut\") e un legame profondo tra cacciatore e uccello.": "This unique tradition combines hunting foxes and hares, training birds of prey such as the golden eagle (“Berkut”), and a deep bond between hunter and bird.",
    "Proseguiamo verso il villaggio di Barskoon, noto per le sue impressionanti cascate. In passato, anche i cosmonauti russi vi trascorrevano il loro tempo libero, e in loro onore sono stati eretti dei monumenti.": "We continue to Barskoon village, known for its impressive waterfalls. Russian cosmonauts once spent their free time here, and monuments were erected in their honour.",
    "Dopo pranzo, ci aspetta un'attività interessante: aiuteremo a montare una yurta tradizionale insieme agli abitanti del posto, che realizzano tappeti artistici di lana secondo la tradizione kirghisa.": "After lunch, we help local residents assemble a traditional yurt. They also make artistic wool carpets following Kyrgyz traditions.",
    "Successivamente, proseguiamo per Jeti-Oguz, dove ceneremo e pernotteremo.": "We continue to Jeti-Oguz for dinner and an overnight stay.",
    "Dscheti-Oguz è una pittoresca gola nelle montagne del Tien-Shan, famosa per le sue formazioni di arenaria rossa, in particolare i \"Sette Tori\" e il \"Cuore Infranto\".": "Jeti-Oguz is a scenic gorge in the Tian Shan mountains, famous for red sandstone formations known as the “Seven Bulls” and the “Broken Heart”.",
    "Se il tempo lo permette, visiteremo le sorgenti termali poco fuori Karakol, ideali per rilassarsi dopo una lunga giornata.": "If time permits, we visit hot springs just outside Karakol, ideal for relaxing after a long day.",
    "Ci dirigiamo verso la bellissima valle di Altyn-Arashan, nota per la sua natura mozzafiato e le sorgenti termali.": "We head to the beautiful Altyn-Arashan valley, known for its stunning nature and hot springs.",
    "La gola si trova in una zona alpina remota, circondata da fitte foreste, limpidi torrenti di montagna e cime innevate.": "The gorge lies in a remote alpine area surrounded by dense forests, clear mountain streams and snow-capped peaks.",
    "\"Altyn-Arashan\" significa \"Sorgente termale dorata\" in kirghiso, e qui si trovano sorgenti termali naturali stimate per i loro effetti curativi.": "“Altyn-Arashan” means “Golden Hot Spring” in Kyrgyz; the area has natural hot springs believed to have healing properties.",
    "I bagni caldi si trovano immersi nella natura: un'esperienza unica per rilassarsi dopo un'escursione o una giornata attiva.": "Surrounded by nature, the hot springs are a special place to relax after a hike or an active day.",
    "Altyn-Arashan è raggiungibile solo con veicoli fuoristrada o a piedi, il che rende il luogo particolarmente tranquillo e incontaminato.": "Altyn-Arashan can only be reached by off-road vehicle or on foot, making it especially peaceful and unspoilt.",
    "L'intera escursione a piedi dura circa 4 ore, incluse le pause per riposare e scattare fotografie.": "The full hike takes about four hours, including breaks to rest and take photos.",
    "Per il ritorno, c'è la possibilità di scegliere se tornare a cavallo o comodamente con uno speciale veicolo fuoristrada.": "For the return, you can choose to ride a horse or travel in a special off-road vehicle.",
    "Dopo colazione, visitiamo in tutta tranquillità la storica chiesa russo-ortodossa e la moschea Dungan, due impressionanti edifici religiosi con architetture molto diverse tra loro.": "After breakfast, we visit the historic Russian Orthodox church and the Dungan Mosque, two impressive religious buildings with very different architecture.",
    "A Cholpon-Ata, visitiamo il museo culturale all'aperto \"Ruh Ordo\", intitolato al famoso scrittore kirghiso Cingiz Ajtmatov.": "In Cholpon-Ata, we visit the open-air cultural museum “Ruh Ordo”, named after the famous Kyrgyz writer Chingiz Aitmatov.",
    "Successivamente, faremo una rilassante gita in barca sul lago Issyk-Kul con una nave da escursione. Godiamo l'aria fresca del lago e la vista imponente delle montagne del Tien-Shan.": "We then take a relaxing boat trip on Lake Issyk-Kul, enjoying the fresh lake air and the impressive views of the Tian Shan mountains.",
    "Dopo pranzo, visitiamo il famoso museo di petroglifi a cielo aperto, chiamato anche \"Giardino di Pietra\". Le incisioni rupestri risalgono al 2000 a.C. circa e sono considerate un tesoro culturale della regione.": "After lunch, we visit the open-air petroglyph museum, also known as the “Stone Garden”. The rock carvings date to around 2000 BC and are a cultural treasure of the region.",
    "Il nono giorno, ritorniamo a Bishkek. Dopo l'arrivo, visitiamo il bazar più grande del paese, un luogo perfetto per acquistare souvenir, frutta secca e altre specialità locali.": "On day nine, we return to Bishkek and visit the country's largest bazaar, a great place to buy souvenirs, dried fruit and local specialities.",
    "Per concludere il nostro viaggio, ci aspetta una festosa cena d'addio in un ristorante suggestivo. Lì potremo goderci i suoni degli strumenti tradizionali kirghisi, suonati da musicisti di talento: una conclusione culturale indimenticabile.": "To conclude our journey, we enjoy a festive farewell dinner at an atmospheric restaurant with traditional Kyrgyz live music."

  }
};

const days = [
  {
    day: 1,
    title: "Giorno 1 – Punto di incontro:",
    bullets: [
      "Arrivo all'Aeroporto Internazionale di Manas e trasferimento in hotel a Bishkek.",
      "Riposo dopo il lungo viaggio.",
      "Pranzo intorno alle 12 o alle 13 in un ristorante locale.",
      "Tour della città nel pomeriggio: visita a Piazza Ala-Too, Parco delle Querce e Museo Storico.",
      "Cena in un ristorante etnico tradizionale a Bishkek chiamato \"Supara\"."
    ],
    photos: [t1a, t1b, t1c, t1d, t1e]
  },
  {
    day: 2,
    title: "Giorno 2 – Chon-Kemin:",
    paragraphs: [
      "Il nostro tour inizia in direzione dell'unica Riserva Naturale di Chon-Kemin.",
      "Lungo la strada, faremo una sosta presso la storica Torre di Burana. Successivamente, continueremo il nostro viaggio verso la gola di Chon-Kemin. All'ingresso della valle si trova la confluenza di due fiumi: il turchese Chon-Kemin e il selvaggio Chuy. Lì vi aspettano escursioni a cavallo o un facile trekking nel Parco Nazionale di Chon-Kemin.",
      "La cena si terrà in un hotel locale, dove pernotteremo anche."
    ],
    photos: [t2a, t2b, t2c, t2d]
  },
  {
    day: 3,
    title: "Giorno 3 – Sponda sud del lago Issyk-Kul:",
    paragraphs: [
      "Partenza in direzione della sponda sud del lago Issyk-Kul con sosta nel villaggio di Bokonbaeva. Lì assisteremo a una dimostrazione di caccia con l'aquila, un'antica tradizione dei kirghisi sopravvissuta fino ad oggi, sebbene praticata solo da pochi.",
      "Questa pratica unica unisce la caccia a volpi e lepri, l'addestramento di rapaci come l'aquila reale (\"Berkut\") e un legame profondo tra cacciatore e uccello.",
      "Successivamente, visiteremo i canyon \"Skazka\" (Valle delle fiabe) e \"Aksai\".",
      "Dopo una giornata ricca di eventi, ci sarà la possibilità di nuotare nel lago e rinfrescarsi.",
      "Pernottamento in un tradizionale hotel di yurte nelle vicinanze."
    ],
    photos: [t3a, t3b, t3c, t3d]
  },
  {
    day: 4,
    title: "Giorno 4 – Barskoon e Dscheti-Oguz:",
    paragraphs: [
      "Proseguiamo verso il villaggio di Barskoon, noto per le sue impressionanti cascate. In passato, anche i cosmonauti russi vi trascorrevano il loro tempo libero, e in loro onore sono stati eretti dei monumenti.",
      "Dopo pranzo, ci aspetta un'attività interessante: aiuteremo a montare una yurta tradizionale insieme agli abitanti del posto, che realizzano tappeti artistici di lana secondo la tradizione kirghisa.",
      "Successivamente, proseguiamo per Jeti-Oguz, dove ceneremo e pernotteremo."
    ],
    photos: [t4a, t4b, t4c, t4d]
  },
  {
    day: 5,
    title: "Giorno 5 – Dscheti-Oguz e Karakol:",
    paragraphs: [
      "Dscheti-Oguz è una pittoresca gola nelle montagne del Tien-Shan, famosa per le sue formazioni di arenaria rossa, in particolare i \"Sette Tori\" e il \"Cuore Infranto\".",
      "Qui ci sono meravigliose opportunità per fare escursioni, fotografare e godersi la natura.",
      "Viaggio verso la città di Karakol (circa 30 minuti).",
      "Se il tempo lo permette, visiteremo le sorgenti termali poco fuori Karakol, ideali per rilassarsi dopo una lunga giornata.",
      "Cena in un ristorante locale e pernottamento."
    ],
    photos: [t5a, t5b]
  },
  {
    day: 6,
    title: "Giorno 6 – Altyn-Arashan:",
    paragraphs: [
      "Ci dirigiamo verso la bellissima valle di Altyn-Arashan, nota per la sua natura mozzafiato e le sorgenti termali.",
      "La gola si trova in una zona alpina remota, circondata da fitte foreste, limpidi torrenti di montagna e cime innevate.",
      "\"Altyn-Arashan\" significa \"Sorgente termale dorata\" in kirghiso, e qui si trovano sorgenti termali naturali stimate per i loro effetti curativi.",
      "I bagni caldi si trovano immersi nella natura: un'esperienza unica per rilassarsi dopo un'escursione o una giornata attiva.",
      "Altyn-Arashan è raggiungibile solo con veicoli fuoristrada o a piedi, il che rende il luogo particolarmente tranquillo e incontaminato.",
      "L'intera escursione a piedi dura circa 4 ore, incluse le pause per riposare e scattare fotografie.",
      "Per il ritorno, c'è la possibilità di scegliere se tornare a cavallo o comodamente con uno speciale veicolo fuoristrada."
    ],
    photos: [t6a, t6b]
  },
  {
    day: 7,
    title: "Giorno 7 – Chiese storiche e Moschea Dungan:",
    paragraphs: [
      "Dopo colazione, visitiamo in tutta tranquillità la storica chiesa russo-ortodossa e la moschea Dungan, due impressionanti edifici religiosi con architetture molto diverse tra loro.",
      "La moschea Dungan è una struttura unica in legno, costruita interamente senza l'uso di un singolo chiodo.",
      "Successivamente, proseguiamo per Cholpon-Ata, sulla costa nord del lago Issyk-Kul.",
      "Prima dell'arrivo, visiteremo il villaggio etnico di Kyrchyn."
    ],
    photos: [t7a],
    video: kyrchynVideo.url
  },
  {
    day: 8,
    title: "Giorno 8 – Ruh Ordo, Gita in barca e Petrografi:",
    paragraphs: [
      "A Cholpon-Ata, visitiamo il museo culturale all'aperto \"Ruh Ordo\", intitolato al famoso scrittore kirghiso Cingiz Ajtmatov.",
      "Successivamente, faremo una rilassante gita in barca sul lago Issyk-Kul con una nave da escursione. Godiamo l'aria fresca del lago e la vista imponente delle montagne del Tien-Shan.",
      "Dopo pranzo, visitiamo il famoso museo di petroglifi a cielo aperto, chiamato anche \"Giardino di Pietra\". Le incisioni rupestri risalgono al 2000 a.C. circa e sono considerate un tesoro culturale della regione.",
      "E naturalmente, un bagno nelle acque limpide del lago Issyk-Kul è d'obbligo!"
    ],
    photos: [t8a, t8b, t8c]
  },
  {
    day: 9,
    title: "Giorno 9 – Ritorno a Bishkek e Bazar:",
    paragraphs: [
      "Il nono giorno, ritorniamo a Bishkek. Dopo l'arrivo, visitiamo il bazar più grande del paese, un luogo perfetto per acquistare souvenir, frutta secca e altre specialità locali.",
      "Per concludere il nostro viaggio, ci aspetta una festosa cena d'addio in un ristorante suggestivo. Lì potremo goderci i suoni degli strumenti tradizionali kirghisi, suonati da musicisti di talento: una conclusione culturale indimenticabile."
    ],
    photos: [t9a, t9b]
  },
  {
    day: 10,
    title: "Giorno 10 – Transferimento all'aeroporto:",
    paragraphs: [
      "Trasferimento all'aeroporto di Manas e partenza individuale."
    ],
    photos: [t10a]
  },
];


const highlights = [
  "Traditionelle Adlerjagd mit Steinadlern im Dorf Bokonbaeva",
  "Baden im türkisfarbenen Issyk-Kul-See",
  "Thermalquellen in Altyn-Arashan – der Goldenen Heilquelle",
  "Dunganen-Moschee – ein Holzbauwerk ohne einen einzigen Nagel",
  "Bootsfahrt mit Blick auf das Tien-Shan-Gebirge",
  "Petroglyphen aus ca. 2000 v. Chr.",
  "Burana-Turm (UNESCO-Erbe)",
  "Jurtenaufbau mit Einheimischen",
  "Festliches Abschiedsabendessen mit kirgisischer Livemusik",
];

const PhotoSlider = ({ photos }: { photos: string[] }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
      onMouseLeave={() => setActiveIdx(null)}
    >
      {photos.map((photo, i) => (
        <div
          key={i}
          onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          onMouseEnter={() => setActiveIdx(i)}
          className={`h-[110px] w-[150px] flex-shrink-0 overflow-hidden rounded-xl cursor-pointer sm:h-[150px] sm:w-[200px] ${
            activeIdx !== null && activeIdx !== i ? "opacity-45" : "opacity-100"
          }`}
          style={{ transition: "opacity 0.35s cubic-bezier(0.34, 1.1, 0.64, 1)" }}
        >
          <img
            src={photo}
            alt="Landschaft und Erlebnisse auf der Kultur Tour durch Kirgisistan"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const DaySevenMedia = ({
  video,
  photos,
}: {
  video: string;
  photos: string[];
}) => {
  const photoDescriptions = [
    "Kultur und Architektur in Kirgisistan",
    "Bootsfahrt auf dem Issyk-Kul-See",
    "Besuch des Kulturzentrums Ruh Ordo",
  ];

  return (
    <div className="mt-7 w-full max-w-[620px] mx-auto">
      <div className="mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted shadow-lift sm:mb-4 sm:aspect-[4/3] sm:mx-auto sm:max-w-[460px]">
        <video
          src={video}
          poster={photos[0]}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          aria-label="Kyrchyn Jailoo – Nomadenkultur und Landschaft"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo}
            className="group aspect-[4/3] overflow-hidden rounded-xl bg-muted"
          >
            <img
              src={photo}
              alt={photoDescriptions[index] ?? "Impression von Tag 7 der Kultur Tour"}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Kultur = () => {
  const { t, language } = useLanguage();
  const itineraryText = (value: string) => language === "IT" ? value : itineraryTranslations[language][value] ?? value;
  const [activeDay, setActiveDay] = useState(0);
  const [cultureDates, setCultureDates] = useState<Array<{
    id: string;
    date: string;
    label: string;
    maxParticipants: number;
    availablePlaces: number;
    status: string;
  }>>([]);
  const dayRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let active = true;

    const loadCultureDates = async () => {
      const { data, error } = await (supabase as any).rpc("get_tour_date_availability");

      if (!active) return;
      if (error) {
        console.error("Kultur-Termine konnten nicht aktualisiert werden:", error);
        return;
      }

      setCultureDates(
        ((data as any[]) ?? [])
          .filter((item: any) => item.tour === "Kultur Tour")
          .map((item: any) => ({
            id: item.id,
            date: item.start_date,
            label: format(parseISO(item.start_date), "dd.MM.") + "–" + format(parseISO(item.end_date), "dd.MM.yyyy"),
            maxParticipants: Number(item.max_participants),
            availablePlaces: Math.max(0, Number(item.available_places)),
            status: item.status,
          }))
      );
    };

    void loadCultureDates();

    // Keep the dates in sync with admin edits and confirmed/cancelled bookings.
    // Supabase Realtime updates immediately when enabled; polling is the fallback.
    const refreshInterval = window.setInterval(() => {
      if (active) void loadCultureDates();
    }, 15000);
    const availabilityChannel = supabase
      .channel("public-culture-availability")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_dates" }, () => {
        if (active) void loadCultureDates();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        if (active) void loadCultureDates();
      })
      .subscribe();

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
      void supabase.removeChannel(availabilityChannel);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowMid = window.scrollY + window.innerHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      dayRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elMid = window.scrollY + rect.top + rect.height / 2;
        const dist = Math.abs(windowMid - elMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveDay(closest);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-5xl px-6 bg-background pb-24 pt-24 md:pt-32">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> {t("Zurück")}
          </Link>

          <section className="mb-20 grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
            <div className="py-2">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                {t("10 Tage · Gruppenreise")}
              </span>
              <h1 className="mb-4 font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
                {t("Kultur Tour")}
              </h1>
              <p className="mb-8 font-display text-xl italic text-primary md:text-2xl">
                {t("Kirgisistan von seiner schönsten Seite")}
              </p>
              <p className="mb-6 max-w-xl text-base leading-relaxed text-muted-foreground">{itineraryText("Il viaggio offre numerose opportunità per vivere la straordinaria natura del Kirghizistan. Fai escursioni attraverso valli pittoresche, nuota nelle acque cristalline del lago Issyk-Kul e trascorri la notte in Yurta tradizionali. Scopri di più sulla storia e la cultura del paese attraverso visite a musei e siti storici. Durante il viaggio, avrai l'occasione di provare la cucina tradizionale kirghisa.")}</p>
              <Link
                to="/buchen?tour=kultur"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {t("Kultur Tour unverbindlich anfragen")} <span className="ml-2" aria-hidden="true">→</span>
              </Link>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{t("Kleine Gruppen")}</span>
                <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{t("10 unvergessliche Tage")}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-sand/50 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary">
                  <CalendarDays className="h-4 w-4" />
                </span>
                {t("Reisedaten")}
              </div>
              <div className="divide-y divide-primary/15">
                {cultureDates
                  .filter((item) => item.status !== "cancelled")
                  .filter((item) => item.date >= format(new Date(), "yyyy-MM-dd"))
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((item) => {
                    const isFull = item.status === "full" || item.availablePlaces <= 0;
                    const endDateMatch = item.label.match(/[-–]\s*(\d{2})\.(\d{2})\.(\d{4})/);
                    const dateRangeLabel = endDateMatch
                      ? `${format(parseISO(item.date), "dd.MM.yyyy")}–${endDateMatch[1]}.${endDateMatch[2]}.${endDateMatch[3]}`
                      : item.label;
                    const card = (
                      <div className="flex items-center gap-3 py-2.5 sm:gap-4">
                        
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-foreground sm:text-base">{dateRangeLabel}</p>
                          <p className={`mt-1 text-xs font-medium ${isFull ? "text-muted-foreground" : "text-primary"}`}>
                            {isFull
                              ? t("Ausgebucht")
                              : t("Noch {count} {placeWord} verfügbar")
                                  .replace("{count}", String(item.availablePlaces))
                                  .replace("{placeWord}", item.availablePlaces === 1 ? t("Platz") : t("Plätze"))}
                          </p>
                        </div>
                      </div>
                    );
                    return isFull ? (
                      <div key={item.id} className="cursor-not-allowed opacity-75">{card}</div>
                    ) : (
                      <Link key={item.id} to={"/buchen?tour=kultur&date=" + item.date} className="block rounded-2xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t("Termin auswählen") + ": " + item.label}>
                        {card}
                      </Link>
                    );
                  })}
                {cultureDates.filter((item) => item.status !== "cancelled").length === 0 && (
                  <div className="rounded-2xl bg-background p-5 text-sm text-muted-foreground">
                    {t("Aktuell sind keine Reisetermine verfügbar.")}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              {t("Was dich")} <span className="italic text-primary">{t("erwartet")}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 border-b border-primary/15 py-4 pr-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{t(h)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-12">
              {t("Dein")} <span className="italic text-primary">{t("Reiseplan")}</span>
            </h2>

            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border md:left-8" />
              <div className="space-y-16">
                {days.map((d, i) => (
                  <div
                    key={d.day}
                    className="relative flex gap-6 md:gap-10"
                    ref={(el) => { if (el) dayRefs.current[i] = el; }}
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold text-base ring-4 ring-background md:h-16 md:w-16 md:text-xl transition-all duration-500 ${activeDay === i ? "bg-primary text-primary-foreground scale-110 border-2 border-primary" : "bg-background border-2 border-primary text-primary"}`}>
                        {d.day}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pb-2">
                      <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">{itineraryText(d.title)}</h3>
                      <div className="flex flex-col gap-3 mb-5">
                        {d.bullets ? (
                          <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground leading-relaxed">
                            {d.bullets.map((item) => <li key={item}>{itineraryText(item)}</li>)}
                          </ul>
                        ) : (
                          d.paragraphs?.map((paragraph) => (
                            <p key={paragraph} className="text-base text-muted-foreground leading-relaxed">{itineraryText(paragraph)}</p>
                          ))
                        )}
                      </div>
                      {d.day === 7 && d.video ? (
                        <DaySevenMedia video={d.video} photos={d.photos} />
                      ) : (
                        d.photos.length > 0 && <PhotoSlider photos={d.photos} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                {t("Gruppengröße")} <span className="italic text-primary">{t("und Preise")}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {t("Der Preis richtet sich nach der Gruppengröße. Bei 2 bis 4 Personen reist du im Jeep, ab 5 Personen im Minibus.")}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card md:rounded-3xl">
              <div className="grid grid-cols-1 divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="flex items-center justify-between gap-4 px-4 py-4 md:block md:p-7">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary md:mb-3 md:text-xs md:tracking-[0.14em]">{t("2 Personen · Jeep")}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{t("pro Person")}</p>
                  </div>
                  <div className="shrink-0 text-right md:text-left">
                    <p className="font-display text-3xl leading-none tracking-tight text-primary md:text-4xl">2.700 €</p>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block md:mt-2">{t("pro Person")}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-4 md:block md:p-7">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary md:mb-3 md:text-xs md:tracking-[0.14em]">{t("4 Personen · Jeep")}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{t("pro Person")}</p>
                  </div>
                  <div className="shrink-0 text-right md:text-left">
                    <p className="font-display text-3xl leading-none tracking-tight text-primary md:text-4xl">1.700 €</p>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block md:mt-2">{t("pro Person")}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-4 md:block md:p-7">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary md:mb-3 md:text-xs md:tracking-[0.14em]">{t("Ab 5 Personen · Minibus")}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{t("pro Person")}</p>
                  </div>
                  <div className="shrink-0 text-right md:text-left">
                    <p className="font-display text-3xl leading-none tracking-tight text-primary md:text-4xl">1.690 €</p>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block md:mt-2">{t("pro Person")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                {t("Im Preis inklusive")}
              </h2>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                {t("Diese Leistungen sind in deiner Kultur Tour enthalten.")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Übernachtungen in 4-Sterne-Hotels und traditionellen Jurten mit WC und Dusche",
                "Alle Transfers und Fahrten entlang der Reiseroute",
                "Erfahrener professioneller Guide während der gesamten Reise",
                "Vollpension mit drei Mahlzeiten täglich",
                "Traditionelles Essen bei einer kirgisischen Familie",
                "Picknick in der Natur",
                "Ein Bier pro Person",
                "Aktivitäten und Eintrittsgelder laut Reiseprogramm",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 border-b border-border/70 py-3 pr-3 last:border-b-0">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground">{t(item)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-16 rounded-3xl bg-sand/60 p-6 md:p-8">
            <h2 className="mb-3 font-display text-2xl text-foreground">
              {t("Buchung und Zahlung")}
            </h2>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t("Wähle deinen Wunschtermin und sende uns eine unverbindliche Buchungsanfrage. Wir prüfen die Verfügbarkeit und stimmen die Details deiner Reise persönlich mit dir ab. Möchtest du verbindlich buchen, erhältst du nach der Bestätigung einen Zahlungslink für die Anzahlung von 150 €. Den Restbetrag bezahlst du während deiner Reise in Kirgisistan in bar.")}
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t("Bitte informiere dich vor der verbindlichen Buchung über die geltenden Stornierungsbedingungen.")}
            </p>
          </div>
          <div className="mb-8 mt-8 text-center">
            <Link
              to="/buchen?tour=kultur"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              {t("Kultur Tour unverbindlich anfragen")} →
            </Link>
          </div>
      </main>
      <Footer />
    </>
  );
};

export default Kultur;
