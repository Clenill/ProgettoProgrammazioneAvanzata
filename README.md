# Progetto Programmazione Avanzata

Progettazione di un sistema HPC Booking System

Il progetto consiste nello sviluppo del back-end che realizza un sistema di prenotazione di risorse HPC, con l'utilizzo delle tecnologie:
Node.js, Express, PostgreSQL, Sequelize e Typescript.
Il sistema prevede la possibilità di creare risorse, ad esempio GPU, e gestirne l'utilizzo da parte degli utenti con appositi calendari.
Gli utenti potranno fare richiesta di prenotazione solo se hanno un numero sufficiente di token e lo slot temporale del calendario non è occupato
da un'altra richesta.
Abbiamo, quindi, due figure: Amministratore e Utente, con ruoli distinti. Questi una volta registrati con apposita rotta
potranno loggarsi nel sistema ed interagire con esso mediante un proprio token JWT.

## Funzionalità Principali

Gli utenti possono interagire con il sistema attraverso diverse operazioni:

-   Prenotare una risorsa attraverso il calendario ad essa associato, specificando lo slot orario.
-   Verificare la disponibilià della risorsa e degli slot temporali liberi.
-   Gestire la propria prenotazione con possibilità di cancellarla.
    Le prenotazioni sono gestite tramite token, disponibili per ogni utente, terminati i token non sarà possibile effettuare nuove richieste,
    fino a quando l'amministratore non provvederà a caricare nuovi token.

Le operazioni principali che possono svolgere gli amministratori sono:

-   Accreditare token agli utenti.
-   Creare calendari per le risorse, con la possibilità di archiviarli.
-   Gestire l'anagrafica delle risorse.
-   Approvare o meno le richieste di prenotazione per una risorsa.
-   Visualizzare lo status delle richieste per un calendario specifico.

## Design Pattern e scelte architetturali

Come anticipato il progetto si basa su Express che citando la documentazione è un framework flessibile e minimale per applicazioni web Node.js.
Express è utilizzato per il routing delle richieste HTTP, il parsing dei payload e l'instradamento verso i controller appropriati.
Ogni rotta chiama un controller, questi riceve la richesta chiama il service e restituisce la risposta.

Sequelize è l'ORM utilizzato per interfacciarsi con il database PostgreSQL, l'accesso al database è effetuato mediante file Repository.
Ogni entità (User, Calendario, Richiesta, Risorsa) ha un file Repository associato in modo da svolgere diverse funzioni:

-   incapsula le query al database.
-   incapsula i meccanismi di archiviazione, recupero e ricerca.
-   permetta la sostituzione del DB senza modifiche al service.

### Il Singleton è un pattern creazionale, garantisce che una classe ha una sola istanza e fornisce un punto di accesso globale a tale istanza. Ciò è stato adottato per stabilire la connessione univoca al database.

Tutta la logica applicativa complessa è inserita in un service layer, anche in questo caso un service per ogni entità. In modo da rendere la
manutenzione e modifica separate e meglio accessibile.

La validazione dei payload è effettuata mediante Joi che garantisce:

-   leggibilità delle regole.
-   centralizzazione, ogni file Joi contiene l'insieme delle regole di validazione per il service specifico.
-   facilità di test.

Nel sistema si fa ampiamente uso dei middleware per gestire l'autenticazione, autorizzazione alle risorse in base al ruolo, verifica dei token e gestione degli errori. Queso segue il pattern Chain of Responsibility. 
### Chain of Responsability 
È un design pattern comportamentale che consente di inoltrare le richieste lungo una catena di gestori. Il pattern consente di collegare più gestori in un'unica catena, alla ricezione di una richesta si chiede a ciascun gestore se può elaborarla. Le funzioni middleware sono funzioni che hanno accesso all'oggetto richiesta e risposta e alla funzione di middleware successiva. La funzione successiva è comunemente indicata con la variabile next. Abbiamo anche un tipo speciale di middleware chiamago gestore degli errori, che accetta quattro argomenti invece dei tre. Ciò consente a Express di riconoscerlo come gestore degli errori, nel progetto ciò è svolto dall'errorHandler.

Sono stati implementati 4 test con Jest, come da richiesta. I test coinvolgono i validatori delle richieste, del calendario, il middleware che si occupa del ruolo e il middleware per il check dei token.

## Diagrammi UML
Diagramma casi d'uso</br></br>
<img width="746" height="1281" alt="Diagramma casi uso drawio" src="https://github.com/user-attachments/assets/68dd6624-2ece-44bc-9b02-66d96299c05d" />
