import express from 'express';
import {
  getUsuarios,
  createUsuario,
  getUsuarioPorId,
  updateUsuario,
  getMiPerfil,
} from "../controllers/userController";
import { withUser } from "../middleware/auth";

const router = express.Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);
router.get("/me", withUser, getMiPerfil);
router.get('/:id', getUsuarioPorId);
router.put("/:id", withUser, updateUsuario);

export default router;
