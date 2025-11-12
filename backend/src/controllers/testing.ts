import express from "express";
import UsuarioModel from "../models/users";
import PublicacionModel from "../models/posts";

const router = express.Router();

router.post("/reset", async (request, response) => {
  await PublicacionModel.deleteMany({});
  await UsuarioModel.deleteMany({});
  response.status(204).end();
});

export default router;