import express from 'express';
import { getUsuarios, createUsuario, getUsuarioPorId, updateUsuario, getMiPerfil } from '../controllers/userController';
import upload from '../middleware/uploadMiddleware';
import { withUser } from '../middleware/auth';

const router = express.Router();

router.get('/', getUsuarios);
router.post('/', upload.single('imagen'), createUsuario);
router.get('/me', withUser, getMiPerfil); 
router.get('/:id', getUsuarioPorId);
router.put('/:id', withUser, upload.single('imagen'), updateUsuario);

export default router;