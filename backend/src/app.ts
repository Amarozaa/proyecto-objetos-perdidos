import express, { NextFunction, Request, Response } from "express";
import logger from "./utils/logger";
import config from "./utils/config";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/errorHandler";
import requestLogger from "./middleware/requestLogger";
import unknownEndpoint from "./middleware/unknownEndpoint";

import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import imagesRouter from './routes/images';
import loginRouter from './controllers/login';
import testingRouter from './controllers/testing';

const app = express();
mongoose.set("strictQuery", false);

if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI).catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });
}
app.use(cors());



app.use(express.static("dist"));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// añadir rutas aquí
app.use('/api/login', loginRouter);
app.use('/api/usuarios', usersRouter);
app.use('/api/publicaciones', postsRouter);
app.use('/api/images', imagesRouter);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const reqPath = req.path || "";
  if (
    !reqPath.startsWith("/api") &&
    !reqPath.startsWith("/uploads") &&
    !reqPath.startsWith("/images")
  ) {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
  } else {
    next();
  }
});

app.use(errorHandler);
app.use(unknownEndpoint);

export default app;

