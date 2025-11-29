import winston from 'winston';

// printf è un formatter di winston che permette di definire come deve apparire
// la riga di log. 
const logFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
  });



// Winston Logger Configuration
const logger = winston.createLogger({
  // Se si è in produzione non si vedrenno i messaggi di livello debug
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.colorize(),// colora il livello
      winston.format.timestamp(), // aggiunge campo timestamp
      winston.format.errors({ stack: true }), // quando logga error << abilita la stack trace
      logFormat
    ),
    transports: [new winston.transports.Console()] // transport è il canale dove inviare i log, Console() stampa su stdout
});

export default logger;