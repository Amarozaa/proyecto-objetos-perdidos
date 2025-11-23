import app from "./app";
import config from "./utils/config";
import logger from "./utils/logger";
import mongoose from "mongoose";

// Declaración global para extender Request de Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const startServer = async () => {
  try {
    if (config.MONGODB_URI) {
      logger.info(`Conectando a MongoDB en ${config.MONGODB_URI}...`);
      await mongoose.connect(config.MONGODB_URI, { dbName: config.MONGODB_DBNAME });
      logger.info(`Conexión a MongoDB establecida (BD: ${config.MONGODB_DBNAME})`);
    }

    const port = Number(config.PORT) || 3001;
    const host = config.HOST || "localhost";

    app.listen(port, host, () => {
      logger.info(`Servidor iniciado en http://${host}:${port}`);

      if (process.env.NODE_ENV === 'test') {
        logger.info(`Modo TEST activado`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error al iniciar servidor: ${error.message}`);
    } else {
      logger.error(`Error al iniciar servidor: ${error}`);
    }
    process.exit(1);
  }
};

startServer();
