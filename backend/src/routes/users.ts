import express from 'express';
import { getUsuarios, createUsuario, getUsuarioPorId } from '../controllers/userController';
const router = express.Router();

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.get('/:id', getUsuarioPorId);

export default router;
