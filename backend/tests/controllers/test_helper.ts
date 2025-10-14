import UsuarioModel from '../../src/models/users';
import PublicacionModel from '../../src/models/posts';

const initialUsuarios = [
  {
    nombre: 'Juan Pérez',
    email: 'juan@test.com',
    password: 'password123',
    telefono: '+56912345678'
  },
  {
    nombre: 'María García', 
    email: 'maria@test.com',
    password: 'password456',
    telefono: '+56987654321'
  }
];

const initialPublicaciones = [
  {
    titulo: 'iPhone perdido',
    descripcion: 'iPhone 12 perdido en la universidad, color azul',
    lugar: 'Universidad de Chile',
    fecha: '2024-01-15',
    tipo: 'Perdido' as const,
    categoria: 'Electrónicos' as const,
    estado: 'No resuelto' as const
  },
  {
    titulo: 'Llaves encontradas',
    descripcion: 'Llavero con llaves de casa y auto encontrado en metro',
    lugar: 'Metro Baquedano',
    fecha: '2024-01-16', 
    tipo: 'Encontrado' as const,
    categoria: 'Otros' as const,
    estado: 'No resuelto' as const
  }
];

const nonExistingUserId = async (): Promise<string> => {
  // Generar email y teléfono únicos usando timestamp
  const timestamp = Date.now();
  const usuario = new UsuarioModel({
    nombre: 'Temporal',
    email: `temp${timestamp}@test.com`, 
    password: 'temp123',
    telefono: `+569${timestamp.toString().slice(-8)}` // Usar últimos 8 dígitos del timestamp
  });
  await usuario.save();
  await usuario.deleteOne();
  return usuario._id.toString();
};

const nonExistingPublicacionId = async (): Promise<string> => {
  const publicacion = new PublicacionModel({
    titulo: 'Temporal',
    descripcion: 'Descripción temporal para eliminar',
    lugar: 'Lugar temporal',
    fecha: '2024-01-01',
    tipo: 'Perdido',
    categoria: 'Otros',
    estado: 'No resuelto', // Agregar estado requerido
    usuario_id: await nonExistingUserId()
  });
  await publicacion.save();
  await publicacion.deleteOne();
  return publicacion._id.toString();
};

const usuariosInDb = async () => {
  const usuarios = await UsuarioModel.find({});
  return usuarios.map(usuario => usuario.toJSON());
};

const publicacionesInDb = async () => {
  const publicaciones = await PublicacionModel.find({});
  return publicaciones.map(publicacion => publicacion.toJSON());
};

export default {
  initialUsuarios,
  initialPublicaciones,
  nonExistingUserId,
  nonExistingPublicacionId,
  usuariosInDb,
  publicacionesInDb
};