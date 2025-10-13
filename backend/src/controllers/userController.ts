import { Request, Response } from 'express';
import UsuarioModel from '../models/users';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios
export const getUsuarios = async (_req: Request, res: Response) => {
	try {
		const usuarios = await UsuarioModel.find({});
		res.json(usuarios);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener usuarios' });
	}
};

// Crear un nuevo usuario
export const createUsuario = async (req: Request, res: Response) => {
	try {
		const { nombre, password, email, telefono, imagen_url, id } = req.body;
		if (!password) {
			return res.status(400).json({ error: 'La contraseña es requerida' });
		}
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);
		const nuevoUsuario = new UsuarioModel({ nombre, password: passwordHash, email, telefono, imagen_url, id });
		const usuarioGuardado = await nuevoUsuario.save();
		res.status(201).json(usuarioGuardado);
	} catch (error: any) {
		if (error.code === 11000) {
			return res.status(409).json({ error: 'Ya existe un usuario con los datos proporcionados' });
		}
		res.status(400).json({ error: 'Error al crear usuario' });
	}
};
