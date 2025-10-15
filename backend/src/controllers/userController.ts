import { Request, Response, NextFunction } from 'express';
import UsuarioModel from '../models/users';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface DatosUsuario {
  nombre?: string;
  email?: string;
  password?: string;
  telefono?: string;
}

// Función de validación personalizada
const validarDatosUsuario = (datos: DatosUsuario): string[] => {
  const errores: string[] = [];
  
  if (!datos.nombre?.trim()) {
    errores.push('El nombre es requerido');
  }
  
  if (!datos.email?.trim()) {
    errores.push('El email es requerido');
  }
  
  if (!datos.password) {
    errores.push('La contraseña es requerida');
  } else if (datos.password.length < 6) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (datos.email && !emailRegex.test(datos.email)) {
    errores.push('El formato del email no es válido');
  }
  
  if (datos.telefono && !/^[0-9+\-\s\(\)]+$/.test(datos.telefono)) {
    errores.push('El formato del teléfono no es válido');
  }
  
  return errores;
};

// Obtener todos los usuarios
export const getUsuarios = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuarios = await UsuarioModel.find({}).select('-passwordHash');
    res.json(usuarios);
  } catch (error) {
    next(error); // Pasar al errorHandler
  }
};

// Obtener un usuario por ID
export const getUsuarioPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'El ID proporcionado no es válido' });
      return;
    }
    
    const usuario = await UsuarioModel.findById(id).select('-passwordHash');
    
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json(usuario);
  } catch (error) {
    next(error); // Pasar al errorHandler
  }
};

// Obtener mi perfil (usuario autenticado)
export const getMiPerfil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const usuario = await UsuarioModel.findById(req.userId).select('-passwordHash');
    
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nombre, password, email, telefono } = req.body;
    
    // Validar datos de entrada
    const erroresValidacion = validarDatosUsuario(req.body);
    if (erroresValidacion.length > 0) {
      res.status(400).json({ 
        error: 'Datos de entrada inválidos', 
        detalles: erroresValidacion 
      });
      return;
    }
    
    // Verificar si ya existe un usuario con el mismo email
    const usuarioExistente = await UsuarioModel.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (usuarioExistente) {
      res.status(409).json({ 
        error: 'Ya existe un usuario registrado con este email',
        campo: 'email'
      });
      return;
    }
    
    // Verificar teléfono si se proporciona
    if (telefono) {
      const telefonoExistente = await UsuarioModel.findOne({ telefono });
      if (telefonoExistente) {
        res.status(409).json({ 
          error: 'Ya existe un usuario registrado con este teléfono',
          campo: 'telefono'
        });
        return;
      }
    }
    
    // Encriptar contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Preparar datos del usuario
    const datosUsuario = {
      nombre: nombre.trim(),
      passwordHash: passwordHash,
      email: email.toLowerCase().trim(),
      telefono: telefono?.trim(),
      imagen_url: req.file ? `/api/images/usuarios/${req.file.filename}` : undefined
    };
    
    // Crear nuevo usuario
    const nuevoUsuario = new UsuarioModel(datosUsuario);
    const usuarioGuardado = await nuevoUsuario.save();
    
    res.status(201).json(usuarioGuardado);
    
  } catch (error) {
    next(error); // El errorHandler se encargará de todos los errores
  }
};

// Actualizar usuario
export const updateUsuario = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'El ID proporcionado no es válido' });
      return;
    }
    
    // Verificar que el usuario autenticado solo puede editar su propio perfil
    if (req.userId !== id) {
      res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
      return;
    }
    
    // Si se subió una imagen, añadir la URL al objeto de actualización
    if (req.file) {
      datosActualizacion.imagen_url = `/api/images/usuarios/${req.file.filename}`;
    }
    
    // Validar solo los campos que se están actualizando
    if (datosActualizacion.email) {
      const usuarioExistente = await UsuarioModel.findOne({ 
        email: datosActualizacion.email.toLowerCase().trim(),
        _id: { $ne: id }
      });
      
      if (usuarioExistente) {
        res.status(409).json({ 
          error: 'Ya existe otro usuario registrado con este email',
          campo: 'email'
        });
        return;
      }
    }
    
    if (datosActualizacion.telefono) {
      const telefonoExistente = await UsuarioModel.findOne({ 
        telefono: datosActualizacion.telefono.trim(),
        _id: { $ne: id }
      });
      
      if (telefonoExistente) {
        res.status(409).json({ 
          error: 'Ya existe otro usuario registrado con este teléfono',
          campo: 'telefono'
        });
        return;
      }
    }
    
    // Si se actualiza la contraseña, encriptarla
    if (datosActualizacion.password) {
      const saltRounds = 12;
      datosActualizacion.passwordHash = await bcrypt.hash(datosActualizacion.password, saltRounds);
      delete datosActualizacion.password; // evitar guardar el campo en claro
    }
    
    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
      id,
      { ...datosActualizacion, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!usuarioActualizado) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json(usuarioActualizado);
    
  } catch (error) {
    next(error); // Pasar al errorHandler
  }
};