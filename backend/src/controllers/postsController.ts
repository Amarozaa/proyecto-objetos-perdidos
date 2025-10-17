import { Request, Response, NextFunction } from 'express';
import PublicacionModel from '../models/posts';
import UsuarioModel from '../models/users';
import mongoose from 'mongoose';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface DatosPublicacion {
  titulo?: string;
  descripcion?: string;
  lugar?: string;
  fecha?: string;
  tipo?: string;
  categoria?: string;
  usuario_id?: string;
}

interface FiltrosPublicacion {
  tipo?: string;
  categoria?: string;
  estado?: string;
  usuario_id?: string;
}

// Función de validación personalizada
const validarDatosPublicacion = (datos: DatosPublicacion): string[] => {
  const errores: string[] = [];
  
  if (!datos.titulo?.trim()) {
    errores.push('El título es requerido');
  } else if (datos.titulo.trim().length < 3) {
    errores.push('El título debe tener al menos 3 caracteres');
  }
  
  if (!datos.descripcion?.trim()) {
    errores.push('La descripción es requerida');
  } else if (datos.descripcion.trim().length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres');
  }
  
  if (!datos.lugar?.trim()) {
    errores.push('El lugar es requerido');
  }
  
  if (!datos.fecha) {
    errores.push('La fecha es requerida');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
    errores.push('La fecha debe tener el formato YYYY-MM-DD');
  }
  
  const tiposValidos = ["Perdido", "Encontrado"];
  if (!datos.tipo || !tiposValidos.includes(datos.tipo)) {
    errores.push('El tipo debe ser "Perdido" o "Encontrado"');
  }
  
  const categoriasValidas = [
    "Electrónicos", "Ropa", "Documentos", "Accesorios", 
    "Deportes", "Útiles", "Otros"
  ];
  if (!datos.categoria || !categoriasValidas.includes(datos.categoria)) {
    errores.push('La categoría debe ser una de las opciones válidas');
  }
  
  // Ya no validamos usuario_id aquí, viene del JWT
  
  return errores;
};

// Obtener todas las publicaciones
export const getPublicaciones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tipo, categoria, estado, usuario_id, limit = '50', page = '1' } = req.query;
    
    // Construir filtros
    const filtros: FiltrosPublicacion = {};
    if (typeof tipo === 'string') filtros.tipo = tipo;
    if (typeof categoria === 'string') filtros.categoria = categoria;
    if (typeof estado === 'string') filtros.estado = estado;
    if (typeof usuario_id === 'string') filtros.usuario_id = usuario_id;
    
    // Calcular paginación
    const limitNum = Math.min(parseInt(limit as string) || 50, 100);
    const pageNum = parseInt(page as string) || 1;
    const skip = (pageNum - 1) * limitNum;
    
    const publicaciones = await PublicacionModel
      .find(filtros)
      .sort({ fecha_creacion: -1 })
      .limit(limitNum)
      .skip(skip)
      .populate('usuario_id', 'nombre email');
    
    const total = await PublicacionModel.countDocuments(filtros);
    
    res.json({
      publicaciones,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error); // Pasar al errorHandler
  }
};

// Obtener una publicación por ID
export const getPublicacionPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'El ID proporcionado no es válido' });
      return;
    }
    
    const publicacion = await PublicacionModel
      .findById(id)
      .populate('usuario_id', 'nombre email telefono');
    
    if (!publicacion) {
      res.status(404).json({ error: 'Publicación no encontrada' });
      return;
    }
    
    res.json(publicacion);
  } catch (error) {
    next(error); // Pasar al errorHandler
  }
};

// Crear una nueva publicación
export const createPublicacion = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const datosPublicacion = req.body;
    
    // El usuario_id viene del JWT (req.userId), no del body
    if (!req.userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    // Validar datos de entrada
    const erroresValidacion = validarDatosPublicacion(datosPublicacion);
    if (erroresValidacion.length > 0) {
      res.status(400).json({ 
        error: 'Datos de entrada inválidos', 
        detalles: erroresValidacion 
      });
      return;
    }
    
    // Validar que la fecha no sea futura (opcional)
    const fechaPublicacion = new Date(datosPublicacion.fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    
    if (fechaPublicacion > hoy) {
      res.status(400).json({ 
        error: 'La fecha del suceso no puede ser futura' 
      });
      return;
    }
    
    // Crear nueva publicación usando el usuario_id del JWT
    const nuevaPublicacion = new PublicacionModel({
      titulo: datosPublicacion.titulo.trim(),
      descripcion: datosPublicacion.descripcion.trim(),
      lugar: datosPublicacion.lugar.trim(),
      fecha: datosPublicacion.fecha,
      tipo: datosPublicacion.tipo,
      categoria: datosPublicacion.categoria,
      estado: "No resuelto", // Siempre inicia como no resuelto
      usuario_id: req.userId, // Viene del JWT, no del body
      imagen_url: req.file ? `/api/images/publicaciones/${req.file.filename}` : datosPublicacion.imagen_url,
      fecha_creacion: new Date().toISOString()
    });
    
    const publicacionGuardada = await nuevaPublicacion.save();
    
    // Poblar datos del usuario para la respuesta
    await publicacionGuardada.populate('usuario_id', 'nombre email');
    
    res.status(201).json(publicacionGuardada);
    
  } catch (error) {
    next(error); // El errorHandler maneja todos los errores
  }
};

// Actualizar una publicación
export const updatePublicacion = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'El ID proporcionado no es válido' });
      return;
    }
    
    // Verificar que la publicación existe
    const publicacionExistente = await PublicacionModel.findById(id);
    
    if (!publicacionExistente) {
      res.status(404).json({ error: 'Publicación no encontrada' });
      return;
    }
    
    // Verificar que el usuario autenticado es el dueño de la publicación
    if (publicacionExistente.usuario_id.toString() !== req.userId) {
      res.status(403).json({ error: 'No tienes permiso para editar esta publicación' });
      return;
    }
    
    // Si se subió una imagen, añadir la URL al objeto de actualización
    if (req.file) {
      datosActualizacion.imagen_url = `/api/images/publicaciones/${req.file.filename}`;
    }
    
    // No permitir cambiar el usuario_id
    delete datosActualizacion.usuario_id;
    
    const publicacionActualizada = await PublicacionModel
      .findByIdAndUpdate(
        id, 
        { ...datosActualizacion, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .populate('usuario_id', 'nombre email');
    
    res.json(publicacionActualizada);
    
  } catch (error) {
    next(error); // Pasar al errorHandler
  }
};