import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import userModel from './models/user.model';
import risorsaModel from './models/risorsa.model';
import calendarioModel from './models/calendario.model';
import richiesteModel from './models/richieste.model';
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '@/config';
// questo file inizializza l'istanza di sequelize e connette al db, carica gli UserModel
const sequelize = new Sequelize.Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: 'UTC',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        logQueryParameters: false,
        benchmark: false,
        logging: (msg) => {
            // Mostra solo query di scrittura o errori
            if (NODE_ENV === 'development') {
                if (
                    msg.startsWith('Executing (default): INSERT') ||
                    msg.startsWith('Executing (default): UPDATE') ||
                    msg.startsWith('Executing (default): DELETE')
                ) {
                    logger.debug(msg);
                }
            } 
        },
    },
);
// autentica la connessione al db
sequelize.authenticate()
    .then(() => logger.info('Database connected successfully.'))
    .catch((err) => logger.error('Unable to connect to the database:', err));
sequelize.sync({ alter: true }) // oppure { force: true } per ricreare tutto da zero
    .then(() => logger.info('Tabelle sincronizzate con successo.'))
    .catch((err) => {
      logger.error('Errore nella sincronizzazione delle tabelle:', err);
      console.error(err); 
  });
// inizializza models
const Risorsa = risorsaModel(sequelize);
const Calendario = calendarioModel(sequelize);
const Users = userModel(sequelize);
const Richiesta = richiesteModel(sequelize);
// Definizione associazioni:
// Una risorsa ha un solo calendario
Risorsa.hasOne(Calendario, { 
    foreignKey: 'risorsaId', 
    as: 'calendario',
});
Calendario.belongsTo(Risorsa, { 
    foreignKey: 'risorsaId', 
    as: 'risorsa',
});
// Un calendario può avere molte richieste
Calendario.hasMany(Richiesta, { 
    foreignKey: 'calendarioId', 
    as: 'richieste' 
});
Richiesta.belongsTo(Calendario, { 
    foreignKey: 'calendarioId', 
    as: 'calendario' 
});
// Un utente può fare molte richieste
Users.hasMany(Richiesta, { 
    foreignKey: 'userId', 
    as: 'richieste' 
});
Richiesta.belongsTo(Users, { 
    foreignKey: 'userId', 
    as: 'utente' 
});
// sequelize esporta l'istanza della connessione, permette le RAW queries
// Sequelize esporta le librerie di sequelize
export const DB = {
    Users,
    Risorsa,
    Calendario,
    Richiesta,
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};
