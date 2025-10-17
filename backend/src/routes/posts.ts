import express from 'express';
import { getPublicaciones, createPublicacion, getPublicacionPorId, updatePublicacion } from '../controllers/postsController';
import upload from '../middleware/uploadMiddleware';
import { withUser } from '../middleware/auth';

const router = express.Router();

router.get('/', getPublicaciones);
router.post('/', withUser, upload.single('imagen'), createPublicacion);
router.get('/:id', getPublicacionPorId);
router.put('/:id', withUser, upload.single('imagen'), updatePublicacion);

export default router;