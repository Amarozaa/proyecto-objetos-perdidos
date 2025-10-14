import express from 'express';
import { getPublicaciones, createPublicacion, getPublicacionPorId, updatePublicacion } from '../controllers/postsController';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/', getPublicaciones);
router.post('/', upload.single('imagen'), createPublicacion);
router.get('/:id', getPublicacionPorId);
router.put('/:id', upload.single('imagen'), updatePublicacion);

export default router;