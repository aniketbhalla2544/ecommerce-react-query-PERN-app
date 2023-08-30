import winston from 'winston';

const jsonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const apploggers = {
  jsonLogger,
};
