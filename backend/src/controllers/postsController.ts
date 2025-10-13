import { Request, Response } from 'express';
import PublicacionModel from '../models/posts';

// Obtener todas las publicaciones
export const getPublicaciones = async (_req: Request, res: Response) => {
	try {
		const publicaciones = await PublicacionModel.find({});
		res.json(publicaciones);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener publicaciones' });
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
