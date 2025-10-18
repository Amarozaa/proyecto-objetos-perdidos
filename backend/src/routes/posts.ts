import express from 'express';
import {
  getPublicaciones,
  createPublicacion,
  getPublicacionPorId,
  updatePublicacion,
} from "../controllers/postsController";
import { withUser } from '../middleware/auth';

const router = express.Router();

router.get('/', getPublicaciones);
router.post("/", withUser, createPublicacion);
router.get('/:id', getPublicacionPorId);
router.put("/:id", withUser, updatePublicacion);

export default router;
