const winston = require('winston');
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info:any) => {
            let logData = {...info};
            if (info.error instanceof Error) {
                logData.error = {
                    message: info.error.message,
                    stack: info.error.stack,
                };
            }
            return JSON.stringify(logData, null, 2);
        }),
    ),
    transports: [
        new winston.transports.File({level: 'error', filename: 'error.log'}),
        new winston.transports.Console({
            level: 'verbose', format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({level: 'info', filename: 'handler.log'}),
        new winston.transports.Console({
            level: 'debug', format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
    ],
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export { logger }
