import { Request, Response } from 'express';
import PublicacionModel from '../models/posts';
import mongoose from 'mongoose';

// Obtener todas las publicaciones
export const getPublicaciones = async (_req: Request, res: Response) => {
	try {
		const publicaciones = await PublicacionModel.find({});
		res.json(publicaciones);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener publicaciones' });
	}
};

// Obtener una publicación por ID
export const getPublicacionPorId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'ID inválido' });
		}
		const publicacion = await PublicacionModel.findById(id);
		if (!publicacion) {
			return res.status(404).json({ error: 'Publicación no encontrada' });
		}
		res.json(publicacion);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener la publicación' });
	}
};

// Crear una nueva publicación
export const createPublicacion = async (req: Request, res: Response) => {
	try {
		const { id, titulo, descripcion, lugar, fecha, estado, tipo, categoria, imagen_url, fecha_creacion, usuario_id } = req.body;
		const nuevaPublicacion = new PublicacionModel({ id, titulo, descripcion, lugar, fecha, estado, tipo, categoria, imagen_url, fecha_creacion, usuario_id });
		const publicacionGuardada = await nuevaPublicacion.save();
		res.status(201).json(publicacionGuardada);
	} catch (error) {
		res.status(400).json({ error: 'Error al crear publicación' });
	}
};
