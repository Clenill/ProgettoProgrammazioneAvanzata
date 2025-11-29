import express from 'express';
import cors from 'cors';
import router from '@routes/routes';
import { DB } from '@database/index';
import { PORT } from './config';
import { errorHandler } from './utils/error-handler';
import logger from '@/utils/logger';
import { HttpStatus } from '@/utils/http-status';

// express() crea l'istanza dell'applicazione
const appServer = express();
const port = PORT;

//origin * accetta richieste da qualsiasi origine
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

// Enable CORS
appServer.use(cors(corsOptions));
appServer.options('*', cors(corsOptions));

// Middleware for parsing JSON and URL-encoded bodies
// Aggiunge il middleware che legge il body raw delle richeste
appServer.use(express.json());
// permette parsing di oggetti annidati
appServer.use(express.urlencoded({ extended: true }));


// Use the router e errorHandler
appServer.use(router);
appServer.use(errorHandler);

// qualsiasi path che non ha matchato prima restituisce un Not Found con messaggio
appServer.all('*', (req, res) => {
    res.status(HttpStatus.NOT_FOUND).json({ message: 'Pagina non trovata :/' });
});

// autenticate() è un metodo di sequelize che prova a connettersi al DB, risolve la Promise
// Se la Promise non ha successo va il catch
DB.sequelize.authenticate()
    .then(() => {
        appServer.listen(port, () => {
            logger.info(`🚀 Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });
