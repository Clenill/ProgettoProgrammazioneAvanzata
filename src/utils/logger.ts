import winston from 'winston';

const logFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
  });



// Winston Logger Configuration
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.errors({ stack: true }), // << abilita la stack trace
      logFormat
    ),
    transports: [new winston.transports.Console()]
});

export default logger;