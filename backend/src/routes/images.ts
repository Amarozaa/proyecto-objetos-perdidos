import express from 'express';
import { servirImagen } from '../controllers/images'

const router = express.Router()

router.get('/:tipo/:filename', servirImagen);

export default router;