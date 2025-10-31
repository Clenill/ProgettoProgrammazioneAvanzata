import express from 'express';
import cors from 'cors';
import router from '@routes/routes';
import { DB } from '@database/index';
import { PORT } from './config';
import { errorHandler } from './utils/error-handler';
import logger from '@/utils/logger';

const appServer = express();
const port = PORT;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

// Enable CORS
appServer.use(cors(corsOptions));
appServer.options('*', cors(corsOptions));

// Middleware for parsing JSON and URL-encoded bodies
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));


// Use the router
appServer.use(router);
appServer.use(errorHandler);

appServer.all('*', (req, res) => {
    res.status(404).json({ message: 'Pagina non trovata :/' });
});

DB.sequelize.authenticate()
    .then(() => {
        appServer.listen(port, () => {
            logger.info(`🚀 Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });
