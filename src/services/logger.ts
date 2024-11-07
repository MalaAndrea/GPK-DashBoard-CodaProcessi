import winston from 'winston';
import path from 'path';

// Definizione dei livelli di log personalizzati
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Definizione dei colori per i diversi livelli di log
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Assegna i colori ai livelli
winston.addColors(colors);

// Formato personalizzato per i log
const format = winston.format.combine(
    // Aggiunge il timestamp
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Gestisce gli errori
    winston.format.errors({ stack: true }),
    // Formatta il messaggio
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    )
);

// Formato per la console (colorato)
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Crea le directory per i log se non esistono
const logDir = 'logs';

// Configurazione del logger
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format,
    transports: [
        // Scrive tutti i log con livello `error` e inferiore in 'error.log'
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Scrive tutti i log con livello `debug` e inferiore in 'combined.log'
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// Se non siamo in produzione, logga anche sulla console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
        level: 'debug',
    }));
}

// Metodi di utility per logging più descrittivo
export const logQueue = {
    start: (queueName: string) => logger.info(`Queue '${queueName}' started processing`),
    complete: (queueName: string) => logger.info(`Queue '${queueName}' completed processing`),
    error: (queueName: string, error: Error) => logger.error(`Queue '${queueName}' error: ${error.message}`, { error }),
    jobStart: (queueName: string, jobId: string) => logger.debug(`Queue '${queueName}' started job ${jobId}`),
    jobComplete: (queueName: string, jobId: string) => logger.debug(`Queue '${queueName}' completed job ${jobId}`),
    jobError: (queueName: string, jobId: string, error: Error) => 
        logger.error(`Queue '${queueName}' job ${jobId} error: ${error.message}`, { error }),
};