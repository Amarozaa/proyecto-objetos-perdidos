import express from 'express';
import { getPublicaciones, createPublicacion } from '../controllers/postsController';
const router = express.Router();

router.get('/', getPublicaciones);
router.post('/', createPublicacion);

export default router;
