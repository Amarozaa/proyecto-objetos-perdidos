import app from "./app";
import config from "./utils/config";
import logger from "./utils/logger";

// Declaración global para extender Request de Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info(`Accede a la app en: http://localhost:${config.PORT}`);
});
