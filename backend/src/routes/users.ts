import express from 'express';
import { getUsuarios, createUsuario, getUsuarioPorId, updateUsuario } from '../controllers/userController';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/', getUsuarios);
router.post('/', upload.single('imagen'), createUsuario);
router.get('/:id', getUsuarioPorId);
router.put('/:id', upload.single('imagen'), updateUsuario);

export default router;