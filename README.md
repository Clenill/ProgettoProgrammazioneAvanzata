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
</br>
Diagrammi sequenze </br></br>
Rotte Utente: </br>
<img width="967" height="707" alt="login" src="https://github.com/user-attachments/assets/6d651a6e-26ca-42e5-9d56-322bc30303a6" />
</br>
**Rotta:** `POST /auth/signin`

Esempio di **payload:**

```json
{
  "email": "testaba@example.com"
}
```
</br>
<img width="1670" height="1874" alt="crea richiesta" src="https://github.com/user-attachments/assets/a32acdfb-0f8f-4dca-93c4-a6f51ed1c10f" />
</br>

**Rotta:** `POST /richieste/crea`

Esempio di **payload:**

```json
{
    "titolo": "richiesta sovrapposta",
    "motivazione":"utilizzo risorsa sovrapposta",
    "dataInizio": "2025-11-05T10:00:00.000Z",
    "dataFine": "2025-11-05T13:00:00.000Z",
    "calendarioId": "71a0d183-f3aa-445a-ad78-2811dcc2ae13"
}
```
</br>
<img width="1122" height="987" alt="richieste filtra" src="https://github.com/user-attachments/assets/f4233a72-8e8e-4bae-843b-3af0650ef0d3" />
</br>

**Rotta:** `GET /richieste/filtra`

Esempio di **payload:**

```json
{
    "stato": "pending",
    "dataInizio" : "2025-10-31T09:00:00.000Z",
    "dataFine": "2025-11-31T09:59:59.000Z"
}
```
</br>
<img width="1855" height="1180" alt="elimina richiesta" src="https://github.com/user-attachments/assets/fec61dbc-ad47-4142-a20b-4de0812deaa9" />
</br>

**Rotta:** `DELETE /richieste/elimina/{Id}`

**Parametri query:**

- `richiestaId`: id della richiesta da eliminare

</br>
<img width="1738" height="1071" alt="slot orario calendario" src="https://github.com/user-attachments/assets/c139ae1f-4270-4483-8e9c-8b151bd1d005" />
</br>

**Rotta:** `GET calendario/disponibile`

Esempio di **payload:**

```json
{
    "calendarioId": "71a0d183-f3aa-445a-ad78-2811dcc2ae13",
    "dataInizio": "2025-11-05T09:00:00.000Z",
    "dataFine": "2025-11-05T10:00:00.000Z"
}
```
</br>
<img width="1208" height="956" alt="richieste con filtri opzionali" src="https://github.com/user-attachments/assets/30fe1ae2-a441-44d6-b023-581c6c9bdb66" />
</br>

**Rotta:** `POST richieste/recuperafiltrate`

Esempio di **payload:**

```json
{
    "calendarioId": "71a0d183-f3aa-445a-ad78-2811dcc2ae13",
    "stato": "pending",
    "dataInizio": "2025-11-01T18:00:00.000Z",
    "dataFine": "2025-11-31T21:00:00.000Z"
}
```
</br>
Rotte Amministratore </br>
<img width="1556" height="1391" alt="creazione calendario" src="https://github.com/user-attachments/assets/593feb80-43ef-4030-9f34-7f50dc306701" />
</br>

**Rotta:** `POST /calendario/crea`

Esempio di **payload:**

```json
{
    "risorsaId": "08b1978a-a800-4ece-895a-7c91d6970016",
    "tokenCostoOrario" : 1
}
```
</br>
<img width="1263" height="1235" alt="conferma o rifiuta richiesta" src="https://github.com/user-attachments/assets/c844388e-7d28-4168-a0e7-56efc7fdf256" />
</br>

**Rotta:** `PUT /richieste/modifica/{richiestaId}`

**Parametri query:**

- `richiestaId`: id della richiesta da modificare

Esempio di **payload:**

```json
{
    "stato": "approved"
}
```
</br>
<img width="1355" height="937" alt="stato richeste per calendario" src="https://github.com/user-attachments/assets/372c88aa-ce45-45e5-b133-c4cc766934d7" />
</br>

**Rotta:** `GET /richieste/richiestecalendario/{id}`

**Parametri query:**

- `calendarioId`: id del calendario a cui si vuole accedere per conoscere lo stato delle richeste

</br>
<img width="1340" height="1171" alt="aggiunta token" src="https://github.com/user-attachments/assets/7a459001-2c79-4947-b7fc-4e02e53d8ce3" />
</br>

**Rotta:** `PUT /user/addtokens`

Esempio di **payload:**

```json
{
    "userId": "572f9ff1-fbb2-41ca-8bcd-49693e5adb54",
    "token": 100
}
```
</br>
<img width="1224" height="1018" alt="creazione risorsa" src="https://github.com/user-attachments/assets/e5510ba1-dc7a-4932-88b5-5b3300e8da43" />
</br>

**Rotta:** `POST /risorse/nuovarisorsa`

Esempio di **payload:**

```json
{
    "name": "GPU2"
}
```
</br>
Utente non registrato </br>
<img width="1094" height="707" alt="signup" src="https://github.com/user-attachments/assets/af7adb6b-dbdb-4c79-b274-88a3ff4ee394" />
</br>

**Rotta:** `POST /auth/signup`

Esempio di **payload:**

```json
{
  "email": "testabca@example.com",
  "username": "testUser",
  "role": "utente"
}

```
</br>

### Avvio
L'avvio del progetto può essere fatto con git clone  
```bash
git clone https://github.com/Clenill/ProgettoProgrammazioneAvanzata.git
```
e dopo aver importato o creato il file env appropriato, compila l'immagine con il comando Docker:
```bash
docker compose build
```
Avvia il backend:
```bash
docker compose up
```
