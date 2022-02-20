import winston from 'winston';

export const logger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        http: 5,
    },
    level: 'http',
    transports: [
        new winston.transports.Console({
            level: 'http',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.simple(),
            ),
        }),
    ],
});
