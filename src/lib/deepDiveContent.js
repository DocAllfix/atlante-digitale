// Contenuti di approfondimento per città: stanze di un percorso museale non lineare.
// Layout: "split", "collage", "video", "quotes", "grid", "text".
// I paragrafi supportano HTML inline: <strong>, <em>, <u>, <span class="...">.

export const DEEP_DIVE_CONTENT = {
  rome: {
    title: "Federico Fellini",
    subtitle: "Indagine filologica e semiotica",
    nodes: [
      // 1 — TEXT
      {
        id: "n1",
        periodId: "1920-1940",
        periodLabel: "Premessa",
        layout: "text",
        heading: "Oltre il «fellinesco»",
        paragraphs: [
          `L'indagine filologica e semiotica sull'opera di Federico Fellini esige preliminarmente uno <u>smantellamento sistematico</u> di quella categoria estetica che la critica divulgativa ha pigramente codificato sotto la nozione di <em>fellinesco</em> — un'etichetta che ha progressivamente <strong>fagocitato la reale complessità strutturale</strong> del suo cinema, riducendo un rigoroso processo di destrutturazione narrativa a una mera accumulazione di bizzarrie circensi.`,
          `L'approccio accademico impone al contrario di riconoscere nella cinematografia felliniana un <span class="text-amber-300 font-semibold">vero e proprio sistema filosofico articolato per immagini</span>, un dispositivo teorico capace di scardinare le convenzioni del racconto classico attraverso una rinegoziazione continua del rapporto tra il dato fenomenico e la sua rielaborazione psichica.`,
        ],
      },
      // 2 — SPLIT (testo + immagine)
      {
        id: "n2",
        periodId: "1920-1940",
        periodLabel: "Premessa",
        layout: "split",
        heading: "Il superamento del realismo",
        paragraphs: [
          `Il regista riminese struttura il proprio discorso visivo <strong>rifiutando la dicotomia tradizionale</strong> tra oggettività storica e soggettività onirica, preferendo operare su una linea di confine porosa dove l'inconscio assume la <em>medesima valenza ontologica</em> della materia tangibile.`,
          `Questo superamento del dogma realista si configura come un atto di <u>insubordinazione linguistica</u> che trova le sue radici nell'esaurimento della spinta propulsiva del Neorealismo storico, di cui Fellini aveva assimilato la grammatica con <strong>Roberto Rossellini</strong> per poi riconvertirne l'istanza etica verso le <span class="text-amber-300 font-semibold">fratture interiori dell'individuo moderno</span>.`,
        ],
        image: "https://shockwavemagazine.it/wp-content/uploads/2020/01/8-12-fellini-1024x582.jpg",
        caption: "Gli anni della formazione",
        hotspots: [
          { id: "h1a", x: 48, y: 52, title: "Rimini, 1920", description: "Federico Fellini nasce il 20 gennaio 1920 a Rimini, sulla costa adriatica. Il mare, la nebbia e i locali notturni diventeranno motivi ricorrenti del suo cinema." },
          { id: "h1b", x: 78, y: 30, title: "La fuga e il ritorno", description: "Fuggirà sempre dalla provincia, ma non smetterà mai di tornarvi attraverso il cinema, trasfigurandola in mito con Amarcord." },
        ],
      },
      // 3 — TEXT
      {
        id: "n3",
        periodId: "1941-1960",
        periodLabel: "Anni Cinquanta",
        layout: "text",
        heading: "La topografia dell'anima",
        paragraphs: [
          `La transizione dallo sguardo documentaristico alla <strong>proiezione fantasmagorica</strong> si palesa con cristallina evidenza a partire dalle pellicole degli anni Cinquanta, opere in cui il sostrato sociale dell'Italia del dopoguerra viene sistematicamente trasfigurato assumendo i connotati di una <em>topografia dell'anima</em>.`,
          `Pellicole cardine come <em>La strada</em> e <em>Le notti di Cabiria</em> manifestano un rifiuto categorico del materialismo dialettico che innervava la produzione coeva, introducendo al centro del quadro figure di marginalità che incarnano un <span class="text-amber-300 font-semibold">bisogno di trascendenza</span> del tutto avulso dalle logiche della lotta di classe.`,
        ],
      },
      // 4 — SPLIT (testo + immagine)
      {
        id: "n4",
        periodId: "1954",
        periodLabel: "1954",
        layout: "split",
        heading: "Gelsomina e il sacro",
        paragraphs: [
          `Il personaggio di <strong>Gelsomina</strong>, con la sua mimica clownesca e la sua aderenza a un sistema di percezione pre-logico, funziona come un <em>detonatore drammaturgico</em> destinato a far collassare le certezze del brutale Zampanò, istituendo una dialettica degli opposti che rimanda alle categorie antropologiche del <u>sacro</u> e del <u>profano</u>.`,
          `In questa fase embrionale si individua già una predilezione per la <span class="text-amber-300 font-semibold">figura dell'inetto e del girovago</span>, archetipi funzionali a un'esplorazione dello spazio che rifugge la linearità per abbracciare una struttura rapsodica basata sull'<strong>erranza pura</strong>.`,
        ],
        image: "https://hotcorn-cdn.fra1.cdn.digitaloceanspaces.com/wp-content/uploads/sites/2/2023/02/10103910/8%C2%BD_1.jpg",
        caption: "La Strada (1954)",
        hotspots: [
          { id: "h3a", x: 35, y: 45, title: "Gelsomina", description: "Giulietta Masina interpreta Gelsomina, il clown triste venduta a Zampanò. Il suo volto diventa l'emblema della poetica felliniana." },
          { id: "h3b", x: 68, y: 52, title: "Zampanò", description: "Anthony Quinn è il brutale forzuto. Un cast internazionale per una storia universale sull'umano bisogno di amore e significato." },
        ],
      },
      // 5 — QUOTES
      {
        id: "n5",
        periodId: "1954",
        periodLabel: "Critica",
        layout: "quotes",
        heading: "Voci sulla Strada",
        sideImage: "https://hotcorn-cdn.fra1.cdn.digitaloceanspaces.com/wp-content/uploads/sites/2/2023/02/10103910/8%C2%BD_1.jpg",
        quotes: [
          { text: "Un cinema che abbandona la cronaca per farsi poesia antropologica: Gelsomina è l'innocenza ferita che zampanò non sa riconoscere.", source: "Cahiers du Cinéma" },
          { text: "Fellini rompe col neorealismo non per abbandonare il reale, ma per restituirne la dimensione mitica e sacra.", source: "Sight & Sound" },
          { text: "La dialettica tra sacro e profano, tra clown e forzuto, restituisce al cinema italiano una gravità che aveva smarrito.", source: "Il Corriere della Sera" },
        ],
      },
      // 6 — TEXT
      {
        id: "n6",
        periodId: "1953",
        periodLabel: "1953",
        layout: "text",
        heading: "I vitelloni",
        paragraphs: [
          `L'anticipazione di questa crisi di sistema si ravvisa con <strong>precisione chirurgica</strong> nell'impianto sociologico de <em>I vitelloni</em>, un testo filmico che analizza la <u>stasi endemica</u> della provincia italiana dissezionando l'inerzia di una generazione maschile incapace di assumere le responsabilità del processo di adultizzazione.`,
          `Fellini opera una <strong>destrutturazione del tempo diegetico</strong> che smette di scorrere linearmente per avvitarsi in una circolarità asfissiante, una prigione atmosferica dove l'ozio assurge a condizione esistenziale e i riti collettivi — dal carnevale ai concorsi di bellezza — si configurano come dispositivi di alienazione che mascherano il <span class="text-amber-300 font-semibold">vuoto cosmico sottostante</span>.`,
          `La fuga finale di Moraldo su un treno avvolto nell'oscurità rappresenta l'unico tentativo di evasione da questa paralisi cronica, uno strappo lacerante che istituisce per la prima volta quel cortocircuito tra <em>memoria autobiografica</em> e <em>finzione narrativa</em> che diventerà il cardine della sua epistemologia visiva.`,
        ],
      },
      // 7 — VIDEO
      {
        id: "n7",
        periodId: "1960",
        periodLabel: "1960",
        layout: "video",
        heading: "La dolce vita",
        paragraphs: [
          `La vera <strong>cesura epistemologica</strong> si consuma con <em>La dolce vita</em>, un'opera monumentale che decreta la <u>dissoluzione definitiva della narrativa teleologica</u> in favore di un affresco episodico dominato dall'entropia e dalla disgregazione del senso.`,
          `Il percorso del giornalista Marcello Rubini si declina attraverso stazioni laiche che non producono alcuna evoluzione caratteriale né alcuna epifania salvifica, lasciando il protagonista in uno stato di <span class="text-amber-300 font-semibold">paralisi percettiva</span> di fronte al monstrum spiaggiato nel finale.`,
        ],
        video: "/videos/824d71c4c_SteinerMarcelloLadolcevitadiFedericoFellini1960.mp4",
      },
      // 8 — TEXT
      {
        id: "n8",
        periodId: "1960",
        periodLabel: "Teoria",
        layout: "text",
        heading: "L'immagine-tempo",
        paragraphs: [
          `L'intuizione fondamentale di Fellini in questo frangente consiste nell'aver compreso come la <strong>società dello spettacolo nascente</strong> necessitasse di una nuova forma filmica capace di registrarne la frammentazione.`,
          `Il montaggio rinuncia a stabilire nessi di causa ed effetto per limitarsi ad accostare blocchi spaziotemporali autonomi, generando una sensazione di sospensione perpetua che <strong>Gilles Deleuze</strong> avrebbe successivamente teorizzato come l'avvento dell'<em>immagine-tempo</em> — un cinema in cui non è più l'azione a muovere il tempo, ma il tempo a dispiegarsi come <span class="text-amber-300 font-semibold">dimensione autonoma e immobile</span>.`,
        ],
      },
      // 9 — VIDEO
      {
        id: "n9",
        periodId: "1963",
        periodLabel: "1963",
        layout: "video",
        heading: "8½",
        paragraphs: [
          `L'approdo alla maturità espressiva si cristallizza con <em>8½</em>, un testo che traduce la <strong>paralisi del processo creativo</strong> nella materia stessa della narrazione cinematografica.`,
          `Il regista Guido Anselmi — alter ego che incarna la <em>scissione pirandelliana</em> tra l'uomo e la maschera autoriale — si muove in un'architettura termale che assume i connotati di un <u>purgatorio clinico</u>, dove ricordi, proiezioni libidiche e pressioni dell'industria culturale collidono su un medesimo piano di immanenza.`,
        ],
        video: "/videos/8a26c25ba_Ottoemezzo81963-dancesceneactuallyHD.mp4",
      },
      // 10 — TEXT
      {
        id: "n10",
        periodId: "1963",
        periodLabel: "Teoria",
        layout: "text",
        heading: "Gli archetipi junghiani",
        paragraphs: [
          `L'incontro con le teorie psicanalitiche di matrice <strong>junghiana</strong>, mediato dall'analisi con <strong>Ernst Bernhard</strong>, fornisce al regista gli strumenti concettuali per sistematizzare questo materiale incandescente.`,
          `Fellini annulla programmaticamente ogni soluzione di continuità tra la dimensione del ricordo, l'<em>allucinazione diurna</em> e la realtà profilmica, costringendo lo spettatore a orientarsi all'interno di un <u>flusso di coscienza visualizzato</u> che rifiuta i convenzionali raccordi di demarcazione tra sonno e veglia.`,
          `Le figure femminili smettono di operare come entità autonome per rivelarsi quali <span class="text-amber-300 font-semibold">emanazioni dell'Anima</span> del protagonista — proiezioni di un Sé frammentato che cerca disperatamente una ricomposizione finale nella celebre danza circolare attorno alla pista del circo.`,
        ],
      },
      // 11 — COLLAGE
      {
        id: "n11",
        periodId: "1965",
        periodLabel: "1965",
        layout: "collage",
        heading: "L'artificio totale",
        paragraphs: [
          `La scoperta del colore, inaugurata con <em>Giulietta degli spiriti</em>, coincide con una <strong>radicalizzazione del controllo scenografico</strong> che spinge Fellini ad abbandonare gli esterni per rifugiarsi nel perimetro protetto del <u>Teatro 5 di Cinecittà</u>.`,
          `Il mare cessa di essere un fenomeno naturale per trasformarsi in un telo di cellophane, rivendicando la <span class="text-amber-300 font-semibold">menzogna come supremo veicolo di verità artistica</span>. Il colore perde ogni funzione naturalistica per assumere una valenza strettamente <em>espressionista</em>.`,
        ],
        images: [
          "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&q=80",
          "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80",
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80",
        ],
      },
      // 12 — SPLIT
      {
        id: "n12",
        periodId: "1969",
        periodLabel: "1969",
        layout: "split",
        heading: "Fellini Satyricon",
        paragraphs: [
          `La tensione verso l'<strong>artificio totale</strong> raggiunge il suo apice con <em>Fellini Satyricon</em>, un esperimento di <u>archeologia visionaria</u> che mira a ricostruire l'antichità precristiana asportando ogni residuo di familiarità umanistica.`,
          `Il testo di Petronio viene sottoposto a una <strong>frammentazione strutturale</strong> che restituisce un mondo alieno e profondamente disturbante, popolato da corpi grotteschi che si muovono in scenografie labirintiche simili a viscere telluriche.`,
          `L'azzeramento della prospettiva rinascimentale in favore di composizioni piatte — simili a <em>mosaici</em> o ad <em>affreschi pompeiani scrostati</em> — attesta la volontà di un cinema della <span class="text-amber-300 font-semibold">distanza assoluta</span>.`,
        ],
        image: "https://images.unsplash.com/photo-1559664047-30d2e8a5b1c2?w=1400&q=80",
        caption: "Fellini Satyricon (1969)",
      },
      // 13 — COLLAGE
      {
        id: "n13",
        periodId: "1972-1973",
        periodLabel: "1972–1973",
        layout: "collage",
        heading: "La psicoanalisi del Ventennio",
        paragraphs: [
          `La decostruzione viene applicata alla memoria storica attraverso <em>Roma</em> e <em>Amarcord</em>, opere in cui l'indagine sul Ventennio fascista assume i contorni di una <strong>psicopatologia collettiva</strong>.`,
          `Il fascismo emerge come una gigantesca messinscena teatrale alimentata dal provincialismo e da un <u>infantilismo cronico</u>, in cui le istituzioni totalitarie si saldano con l'educazione cattolica nel mantenere i cittadini in uno stato di <span class="text-amber-300 font-semibold">minorità perpetua</span>.`,
        ],
        images: [
          "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80",
          "https://images.unsplash.com/photo-1551446591-ebb8b154501a?w=900&q=80",
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80",
        ],
      },
      // 14 — TEXT
      {
        id: "n14",
        periodId: "1978",
        periodLabel: "1978",
        layout: "text",
        heading: "Prova d'orchestra",
        paragraphs: [
          `Il progressivo incupimento dell'orizzonte politico italiano trova sublimazione nella claustrofobia di <em>Prova d'orchestra</em>, un apologo allegorico che adotta il rigore formale del <strong>finto documentario</strong> televisivo.`,
          `L'auditorium in cui si consuma la ribellione dei professori d'orchestra diviene il <u>sismografo di una nazione</u> scossa dal terrorismo, un microcosmo in cui le istanze democratiche degenerano in una prevaricazione anarcoide destinata a sfociare nel caos.`,
          `L'incursione finale della <strong>palla demolitrice</strong> si manifesta come l'irruzione del <span class="text-amber-300 font-semibold">reale traumatico</span> teorizzato dalla psicoanalisi lacaniana — un cataclisma che sancisce il fallimento di ogni utopia collettivista.`,
        ],
      },
      // 15 — SPLIT
      {
        id: "n15",
        periodId: "1983",
        periodLabel: "1983",
        layout: "split",
        heading: "E la nave va",
        paragraphs: [
          `Questa riflessione sul tramonto di una civiltà assume contorni <strong>operatici</strong> in <em>E la nave va</em>, un affresco crepuscolare che indaga il <u>naufragio della cultura borghese europea</u> alla vigilia del primo conflitto mondiale.`,
          `Il transatlantico <em>Gloria N.</em> solca un mare di plastica che dichiara la propria natura sintetica, trasportando un microcosmo di aristocratici destinato a collassare sotto i colpi della Storia.`,
          `L'inquadratura conclusiva — in cui la macchina da presa arretra svelando la troupe — rivela il cinema come <span class="text-amber-300 font-semibold">l'ultima zattera di salvataggio nell'oceano dell'insensatezza</span>, capace di preservare la bellezza solo attraverso la consapevolezza della propria <strong>natura falsa</strong>.`,
        ],
        image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1400&q=80",
        caption: "E la nave va (1983)",
      },
      // 16 — COLLAGE
      {
        id: "n16",
        periodId: "1976-1986",
        periodLabel: "1976–1986",
        layout: "collage",
        heading: "La reificazione del corpo",
        paragraphs: [
          `Il <em>Casanova</em> si erge a vertice algido e mortuario: il seduttore veneziano viene ridotto a un <strong>automa ginnico</strong> incastrato in una coazione a ripetere, prigioniero di una sessualità performativa che ha smarrito ogni traccia di <u>eros autentico</u>.`,
          `L'universo settecentesco appare come un gigantesco carillon funebre dove la carne si confonde con la cera e i manichini, prefigurando la <span class="text-amber-300 font-semibold">reificazione dell'individuo</span> operata dalle società disciplinari.`,
        ],
        images: [
          "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=900&q=80",
          "https://images.unsplash.com/photo-1514849302-984523450cf4?w=900&q=80",
          "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=900&q=80",
        ],
      },
      // 17 — TEXT
      {
        id: "n17",
        periodId: "1986",
        periodLabel: "1986",
        layout: "text",
        heading: "Ginger e Fred",
        paragraphs: [
          `Questa prospettiva nichilista si estende alla sfera mediatica con <em>Ginger e Fred</em>, spietata requisitoria contro la <strong>mutazione genetica del paesaggio culturale</strong> italiano indotta dall'egemonia delle televisioni commerciali.`,
          `Il circo, un tempo luogo di meraviglia e di integrazione delle marginalità, cede il passo a un contenitore televisivo volgare e anestetizzante — una discarica catodica dove la memoria, l'arte e il dolore vengono macinati in un flusso ininterrotto di spot e intrattenimento <strong>decerebrato</strong>.`,
          `Fellini sancisce così <span class="text-amber-300 font-semibold">l'impossibilità di sopravvivenza per la poesia nell'epoca della sua riproducibilità televisiva</span>.`,
        ],
      },
      // 18 — SPLIT
      {
        id: "n18",
        periodId: "1990",
        periodLabel: "1990",
        layout: "split",
        heading: "La voce della luna",
        paragraphs: [
          `L'atto conclusivo si compie con <em>La voce della luna</em>, opera testamentaria che assume la forma di un <strong>vagabondaggio lunare</strong> attraverso le rovine del paesaggio padano sfigurato dall'industrializzazione.`,
          `Il protagonista Ivo Salvini — discendente di Gelsomina ma privato della sua funzione salvifica — si aggira in un mondo assordato dal rumore di fondo della modernità, dove l'unico atto di resistenza risiede nella pratica del <u>silenzio prolungato</u>.`,
          `Fellini chiude il proprio percorso consegnando l'immagine di un pozzo in cui si riflette un astro freddo e indifferente — un <span class="text-amber-300 font-semibold">monito epistemologico</span> che invita a sospendere il frastuono per captare le frequenze di una dimensione altra, edificando una delle cattedrali concettuali più imponenti del <strong>ventesimo secolo</strong>.`,
        ],
        image: "https://images.unsplash.com/photo-1532978379173-523e16f371f9?w=1400&q=80",
        caption: "La voce della luna (1990)",
      },
    ],
  },
};

export function getDeepDiveContent(city) {
  return DEEP_DIVE_CONTENT[city] || null;
}