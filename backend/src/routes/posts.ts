import express from 'express';
import { getPublicaciones, createPublicacion, getPublicacionPorId } from '../controllers/postsController';
const router = express.Router();

router.get('/', getPublicaciones);
router.post('/', createPublicacion);
router.get('/:id', getPublicacionPorId);

export default router;
