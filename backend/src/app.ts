import express, { NextFunction, Request, Response } from "express";
import logger from "./utils/logger";
import config from "./utils/config";
import mongoose from "mongoose";

import errorHandler from "./middleware/errorHandler";
import requestLogger from "./middleware/requestLogger";
import unknownEndpoint from "./middleware/unknownEndpoint";

import usersRouter from './routes/users';
import postsRouter from './routes/posts';

const app = express();
mongoose.set("strictQuery", false);

if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI).catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });
}

app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

// añadir rutas aquí
app.use('/api/usuarios', usersRouter);
app.use('/api/publicaciones', postsRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

export default app;

