// Schede degli autori del capitolo di tesi "Topologia di un corpo"
// (corpo, sguardo, dispositivo tra filosofia, psicoanalisi, neuroscienze e cinema).
// Keyed by authorId. La card usa questo contenuto al posto della narrativa città×periodo
// quando l'autore è presente qui.

export const AUTHOR_CONTENT = {
  cronenberg: {
    title: "David Cronenberg e la «Nuova Carne»",
    text: "A Toronto, Cronenberg fa del body horror una critica del dispositivo mediale: in Videodrome (1983), Naked Lunch, Dead Ringers e The Fly l'identità non è più solo riflessa dai media, ma mutata dal contatto con l'apparato.",
    details: "La sua filmografia mette in scena il «divenire» nello spazio liminale tra organico e inorganico, maschile e femminile, corpo e macchina. La «Nuova Carne» corporeizza il freddo codice tecnologico in tessuto biologico (lo schermo pulsante di Videodrome, la casa-corpo di Shivers). Sulla scia di McLuhan e Agamben, il dispositivo penetra le difese percettive; in sintonia con Judith Butler (performatività) e sovvertendo il «male gaze» di Laura Mulvey, l'anatomia diventa «tutt'altro che un destino».",
    highlights: ["Videodrome (1983) e il dispositivo", "The Fly, Dead Ringers, Naked Lunch", "«Nuova Carne» e divenire (Deleuze)", "Performatività di genere (Butler)"],
  },
  bergman: {
    title: "Ingmar Bergman e il volto",
    text: "In Persona (1966) Bergman fa del primo piano il campo d'azione della mente («mindscreen»): il volto diventa mappa dell'interiorità e superficie in cui i confini del Sé si dissolvono.",
    details: "La fusione dei due volti femminili nel celebre fotogramma cattura, secondo Deleuze, il paradosso del «primo piano-volto» che «è al contempo la faccia e il suo disfacimento». Il film si svolge sulla soglia — tra dispositivo e realtà, sincrono e asincrono, vita e morte — fino a mostrare la pellicola che brucia: la «pelle» dello schermo che coincide con quella della protagonista. Un «laboratorio neuroestetico ante litteram» sul rapporto tra spettatore, corpo e immagine.",
    highlights: ["Persona (1966)", "Primo piano e volto (Balázs, Deleuze)", "Doppio e dissoluzione del Sé", "La pellicola come pelle"],
  },
  beckett: {
    title: "Samuel Beckett e la percezione",
    text: "A Parigi, Beckett firma il suo unico film — Film (1965), con Buster Keaton — sul principio berkeleyano «esse est percipi»: un essere scisso in Oggetto (in fuga) e Occhio (all'inseguimento).",
    details: "L'opera indaga l'ineluttabilità dell'autopercezione: il protagonista tenta invano di sottrarsi a ogni sguardo, ma «l'inseguitore percipiente è egli stesso». La reiterazione dell'inquadratura dell'occhio in apertura e chiusura fa del film un loop perfetto sull'organo-soglia tra interno ed esterno. La stessa condizione «lacerata» è al centro dell'analisi di Didier Anzieu, che intreccia Beckett, Bacon e lo psicoanalista Bion nel segno del paradosso creatore.",
    highlights: ["Film (1965) con Buster Keaton", "«esse est percipi» (Berkeley)", "L'occhio come soglia (Merleau-Ponty)", "Beckett–Bacon–Bion (Anzieu)"],
  },
  bacon_f: {
    title: "Francis Bacon e la logica della sensazione",
    text: "A Londra, Bacon dipinge la carne come «corpo senza organi»: non volti ma teste, figure di pura intensità in cui l'umano entra in una «zona di indiscernibilità» con l'animale.",
    details: "Per Deleuze (Logica della sensazione) dipingere significa «rendere immediatamente sensibile un affetto»: la sensazione è vibrazione, ritmo, che percorre il corpo. Per Anzieu i trittici baconiani sono il tentativo di risanare l'involucro lacerato dell'«Io-pelle colabrodo». La distanza del sotto-vetro fa sì che, mentre il visitatore interpreta il quadro, «è il quadro stesso a sottoporlo a interpretazione».",
    highlights: ["Trittici e «corpo senza organi»", "Logica della sensazione (Deleuze)", "Io-pelle e carne (Anzieu)", "Divenire-animale"],
  },
  magritte: {
    title: "René Magritte e il paradosso dell'immagine",
    text: "A Bruxelles, Magritte fa del paradosso la sostanza della sua metapittura: ne La riproduzione vietata (1937) l'uomo allo specchio vede la propria nuca — l'irrappresentabile reso immagine.",
    details: "I temi del doppio, dello straniamento e del volto nascosto trasformano la visione in atto attivo, «emancipando la mente dell'osservatore dalle consuetudini percettive». Gli stessi motivi tornano in Film di Beckett: come Og davanti al proprio riflesso non speculare, il soggetto si scopre uno e diviso. Un'anticipazione della «narrazione interattiva» e della reciprocità dello sguardo tra opera e spettatore.",
    highlights: ["La riproduzione vietata (1937)", "Metapittura e paradosso", "Il doppio e il volto nascosto", "Rimando a Film di Beckett"],
  },
  caravaggio: {
    title: "Caravaggio e il Narciso",
    text: "A Roma, il Narciso (1597-99) di Caravaggio anticipa le moderne inquietudini sul doppio: le braccia del giovane e il loro riflesso formano un cerchio perfetto, chiuso sul medium acqueo.",
    details: "Il dramma di Narciso si consuma nell'oblio del dispositivo: ignorando lo specchio d'acqua come condizione dell'immagine, crede di essere davanti a un'alterità vivente. Riconoscere il medium significa decodificare la visione come rappresentazione. Da McLuhan (Narciso da narkè, torpore) a Kristeva, l'episodio fonda la riflessione sullo specchio come soglia tra Sé e Altro, tra maschile e femminile.",
    highlights: ["Narciso (1597-1599)", "Specchio e medium", "Il doppio e l'Altro", "Narkè / torpore (McLuhan)"],
  },
  anzieu: {
    title: "Didier Anzieu e l'Io-pelle",
    text: "A Parigi, lo psicoanalista Didier Anzieu teorizza l'«Io-pelle»: l'Io si costituisce sulla superficie del corpo, mutuando dalla pelle le funzioni di contenimento, barriera e comunicazione.",
    details: "Pelle e cervello condividono la matrice ectodermica: il cervello è «una pelle introflessa». La pelle è la superficie transizionale — «di via di mezzo» — su cui si iscrivono le tracce. Nel sonno l'Io-pelle si fa «pellicola» sensibile, schermo di proiezione interno che anticipa le dinamiche del dispositivo cinematografico. I casi di Beckett e Bacon mostrano lo stile come «pelle di immagini e suoni» condivisa tra opera e spettatore.",
    highlights: ["L'Io-pelle (1985)", "Pelle e cervello (ectoderma)", "La pelle come «pellicola»", "Beckett e Bacon"],
  },
  rizzolatti: {
    title: "Giacomo Rizzolatti e i neuroni specchio",
    text: "All'Università di Parma, negli anni Novanta l'équipe di Rizzolatti scopre i neuroni specchio: cellule che si attivano sia quando compiamo un'azione sia quando la osserviamo.",
    details: "La scoperta abbatte il rigido confine tra percezione, cognizione e azione — e tra Sé e Altro — dando base biologica all'empatia e alla «compartecipazione» che il teatro (Peter Brook) e il cinema mettono in scena. Lo «schermo empatico» (Gallese, Guerra) e la neuroestetica (Zeki, Freedberg) ne derivano l'idea di uno «spettatore attivo», coinvolto psichicamente e fisicamente nell'atto della visione.",
    highlights: ["Neuroni specchio (Parma, anni '90)", "Percezione immersa nell'azione", "Empatia e intersoggettività", "Lo schermo empatico"],
  },

  deleuze: {
    title: "Gilles Deleuze e l'immagine",
    text: "A Parigi, Deleuze rifonda la teoria del cinema (L'immagine-movimento, L'immagine-tempo) e della pittura (Logica della sensazione, su Bacon), pensando il corpo come «corpo senza organi» percorso da pure intensità.",
    details: "Con Guattari (L'Anti-Edipo, Millepiani) sostituisce il desiderio-mancanza con il desiderio-produzione e le «macchine desideranti», teorizzando il «divenire-animale» che ritroviamo in Bacon e in Cronenberg (The Fly). Sul cinema, l'«immagine-tempo» — anticipata da Fellini — è un cinema in cui è il tempo, non l'azione, a dispiegarsi; e il «primo piano-volto» di Bergman «è al contempo la faccia e il suo disfacimento».",
    highlights: ["Cinema 1 e 2 (immagine-movimento/tempo)", "Logica della sensazione (Bacon)", "Corpo senza organi e divenire", "L'Anti-Edipo (con Guattari)"],
  },
  merleau: {
    title: "Merleau-Ponty e il corpo vedente",
    text: "A Parigi, la fenomenologia di Merleau-Ponty (L'Occhio e lo Spirito) supera il dualismo: «il mio corpo è insieme vedente e visibile», si vede vedente, si tocca toccante.",
    details: "La visione non è mai un atto unilaterale ma un «reincrociarsi» tra vedente e visibile, chi tocca e chi è toccato — la «dialettica chiasmatica». Questo radicamento del soggetto nella corporeità vissuta fonda la lettura incarnata del cinema (Sobchack) e dialoga con l'occhio-soglia di Beckett e con le neuroscienze dell'embodiment.",
    highlights: ["L'Occhio e lo Spirito (1961)", "Vedente e visibile", "Il chiasma", "Radice della visione incarnata"],
  },
  mcluhan: {
    title: "McLuhan e il medium",
    text: "A Toronto, McLuhan (Gli strumenti del comunicare) legge in Narciso — da narkè, torpore — la chiave del nostro rapporto con la tecnologia: ogni medium è un'«estensione» e insieme un'«auto-amputazione» del corpo.",
    details: "L'introduzione di ogni tecnologia ristruttura l'intero sensorio: immersi nell'ambiente mediale non lo percepiamo, «come un pesce non percepisce l'acqua». La sua analogia tra sistema nervoso e tecnologia elettrica anticipa la «Nuova Carne» di Cronenberg (con cui condivide Toronto) e il concetto di dispositivo in Agamben.",
    highlights: ["Gli strumenti del comunicare (1964)", "Medium come estensione", "Narciso e auto-amputazione", "Verso Cronenberg e Agamben"],
  },
  metz: {
    title: "Christian Metz e lo specchio",
    text: "A Parigi, Metz ridefinisce il cinema come «macchina mentale» o apparato: lo schermo è uno specchio paradossale che proietta tutto tranne il corpo dello spettatore.",
    details: "Questa assenza del proprio riflesso trasforma la visione in «misconoscimento»: non vedendosi, il soggetto si identifica con lo sguardo della macchina da presa. L'«effetto-soggetto» non è però intrinseco al cinema, ma esito di un processo storico di «disciplinamento» (la sala buia, l'immobilità). È il paradigma che Bergman e il cinema d'autore europeo mettono in crisi.",
    highlights: ["Il cinema come apparato", "Lo schermo-specchio paradossale", "Misconoscimento ed effetto-soggetto", "Disciplinamento dello spettatore"],
  },
  freud: {
    title: "Freud e l'Io corporeo",
    text: "A Vienna, ne L'Io e l'Es Freud afferma che l'Io è «prima di tutto corporeo»: nasce da una «mappa psichica delle intensità libidiche del corpo», uno schermo interno delle sensazioni.",
    details: "Ritrova un'analogia anatomica nell'homunculus corticale, in cui le parti del corpo sono proporzionali all'area cerebrale che le controlla. Questa genesi somatica dell'Io — schermo, setaccio, superficie — è il presupposto dell'«Io-pelle» di Anzieu e della riflessione sul rapporto tra interiorità psichica ed esteriorità corporea.",
    highlights: ["L'Io e l'Es (1923)", "«L'Io è prima di tutto corporeo»", "Homunculus corticale", "Verso l'Io-pelle (Anzieu)"],
  },
  lacan: {
    title: "Lacan e lo stadio dello specchio",
    text: "A Parigi, Lacan teorizza lo stadio dello specchio: il bambino vede per la prima volta la Gestalt — l'«immagine unificata» — prendere il posto del «corpo frammentato».",
    details: "Quel corpo in pezzi non scompare mai del tutto: riaffiora nei sogni e nelle rappresentazioni pittoriche, come nei mostri di Hieronymus Bosch citati dallo stesso Lacan. La dialettica tra riconoscimento e misconoscimento allo specchio è al cuore del cinema del doppio (Bergman, Cronenberg) e della teoria dello sguardo.",
    highlights: ["Lo stadio dello specchio", "Gestalt e corpo frammentato", "Bosch e l'immaginario", "Riconoscimento / misconoscimento"],
  },
  damasio: {
    title: "Damasio e il cinema-emozione",
    text: "Neuroscienziato delle emozioni, Damasio propone il «marcatore somatico» e il «circuito come-se»: la visione di immagini pregnanti simula nel corpo lo stato emotivo, anche senza stimolo fisico.",
    details: "Il sentimento nasce da «mappe del corpo» costruite nelle aree somatosensitive (insula, cortecce cingolate). Da qui l'idea del «cinema come metafora dei processi cerebrali», potente «macchina emozionale» che lavora direttamente sul corpo dello spettatore, superando il «teatro della coscienza» di matrice cartesiana.",
    highlights: ["Marcatore somatico e circuito «come-se»", "Mappe del corpo (insula)", "Cinema come macchina emozionale", "Oltre il «teatro» cartesiano"],
  },
  sobchack: {
    title: "Sobchack e il soggetto cinestesico",
    text: "Teorica del cinema, Sobchack (The Address of the Eye) fonda la fenomenologia dell'esperienza filmica: la visione è «incarnata», tattile, sinestesica.",
    details: "Il film non è un codice astratto ma affonda nel «linguaggio pragmatico dell'esistenza incarnata»: «le nostre dita, la pelle, le labbra comprendono ciò che vediamo». Di fronte alla «Nuova Carne» di Cronenberg la distanza ottica collassa e l'Io-pelle dello spettatore subisce la stessa violazione dei corpi sullo schermo. Anche lo schermo è una «pellicola», una pelle sensibile (origini ecotattili dell'immagine).",
    highlights: ["The Address of the Eye (1992)", "Soggetto cinestesico", "Visione aptica e incarnata", "La pellicola come pelle"],
  },
  balazs: {
    title: "Béla Balázs e il primo piano",
    text: "Nella Berlino del cinema muto, Balázs (L'uomo visibile, 1924) teorizza il primo piano: non un dettaglio tecnico, ma il luogo di una comunicazione pre-linguistica, immediata e universale.",
    details: "Il volto in primo piano condensa una «fisionomia» che trascende la successione temporale del linguaggio, mostrando la simultaneità di sentimenti contrastanti. «Monumentale» e insieme intimo, diventa il «volto-paesaggio» che Bergman riprenderà in Persona, anticipando la centralità neuroestetica del volto e dello sguardo.",
    highlights: ["L'uomo visibile (1924)", "Il primo piano e la fisionomia", "Comunicazione pre-linguistica", "Il «volto-paesaggio»"],
  },
  sontag: {
    title: "Susan Sontag e il film come oggetto",
    text: "A New York, Sontag (Styles of Radical Will) osserva come Bergman, nel prologo e nell'epilogo di Persona, presenti il film come un «oggetto» concreto, dotato di presenza fisica ed esposto alla deperibilità della materia.",
    details: "La sua lettura dell'auto-riflessività — la pellicola che si mostra come artificio, si spezza, brucia — anticipa il dibattito sulla natura materica del dispositivo. La stessa tendenza «auto-fagocitante» del cinema d'autore che indaga i paradossi della visione e della natura umana.",
    highlights: ["Styles of Radical Will (1966)", "Il film come oggetto materico", "Auto-riflessività del medium", "Su Persona di Bergman"],
  },
  agamben: {
    title: "Agamben e il dispositivo",
    text: "A Roma, Agamben (Che cos'è un dispositivo?) definisce dispositivo «qualunque cosa abbia la capacità di catturare, orientare, determinare i gesti e i discorsi dei viventi».",
    details: "Dal «corpo a corpo fra i viventi e i dispositivi» scaturisce il soggetto stesso, in un «processo di soggettivazione». È la chiave filosofica per leggere la «Nuova Carne» di Cronenberg — dove la carne e l'apparato tecnologico diventano una cosa sola — e prolunga la riflessione di McLuhan sul medium oltre la mera estensione sensoriale.",
    highlights: ["Che cos'è un dispositivo? (2006)", "Cattura e soggettivazione", "Corpo a corpo viventi-dispositivi", "Verso la «Nuova Carne»"],
  },
};
