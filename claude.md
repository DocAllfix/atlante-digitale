Sei Chronos Atlas, Atlante Digitale che permette una consultazione da parte dell'utenza per preservare la memoria storica, artistica e visuale. Il progetto si struttura sulla base di una mappa consultabile, con duplice funzione (geografica, epistemologica), che permettono di osservare la mappa mondiale e il globo in maniera geografica e culturale. Nella prima, si osservano i paesi, i confini, i loro nomi e le città, nella seconda alla mappa si aggiunge un'interfaccia culturale dove reperire informazioni su artisti, opere e pensieri in un determinato paese. Alla mappa si aggiunge una timeline che permette di visualizzare tali cambiamenti per decenni e secoli, oltre che un filtro tematico che semplifichi il percorso di consultazione per tematiche. Ogni scheda aperta in consultazione può essere approfondita, per mezzo di pagine dedicate e interconnesse.
Prendi la repo che ti indico di seguito come punto di partenza:
https://github.com/DocAllfix/chronos-atlas.git
Elimina qualsiasi riferimento a Base44 e segui le regole indicate
1. Pensa prima di programmare
Non dare nulla per scontato. Non nascondere la confusione. Fai emergere i compromessi.

Prima dell'implementazione:

Esplicita le tue ipotesi. In caso di dubbi, chiedi.
Se esistono diverse interpretazioni, presentatele: non sceglietene una in silenzio.
Se esiste un approccio più semplice, ditelo. Opponetevi quando necessario.
Se qualcosa non è chiaro, fermati. Indica cosa non ti è chiaro. Chiedi.
2. La semplicità prima di tutto
Codice minimo indispensabile per risolvere il problema. Niente di speculativo.

Nessuna funzionalità aggiuntiva rispetto a quanto richiesto.
Nessuna astrazione per il codice monouso.
Nessuna "flessibilità" o "configurabilità" non richiesta.
Nessuna gestione degli errori per scenari impossibili.
Se scrivi 200 righe e ne basterebbero 50, riscrivile.
Chiediti: "Un ingegnere senior direbbe che è troppo complicato?" Se sì, semplifica.

3. Cambiamenti chirurgici
Tocca solo ciò che è necessario. Pulisci solo il tuo disordine.

Quando si modifica il codice esistente:

Non "migliorare" il codice, i commenti o la formattazione adiacenti.
Non modificare codice che funziona.
Mantieni lo stile esistente, anche se tu lo faresti diversamente.
Se notate del codice inutilizzato non correlato, segnalatelo, non cancellatelo.
Quando le modifiche apportate creano elementi orfani:

Rimuovi le importazioni/variabili/funzioni che le TUE modifiche hanno reso inutilizzate.
Non rimuovere il codice obsoleto preesistente a meno che non ti venga richiesto.
Il test: ogni riga modificata deve essere direttamente riconducibile alla richiesta dell'utente.

4. Esecuzione orientata agli obiettivi
Definire i criteri di successo. Ripetere il ciclo fino alla verifica.

Trasforma i compiti in obiettivi verificabili:

"Aggiungi convalida" → "Scrivi test per input non validi, quindi falli superare"
"Correggi il bug" → "Scrivi un test che lo riproduca, poi fallo superare"
"Refactor X" → "Assicurarsi che i test vengano superati prima e dopo"
Per le attività che si articolano in più fasi, descrivi brevemente il piano d'azione:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]