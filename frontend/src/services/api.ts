import axios from 'axios';
import type { Publicacion, CrearPublicacion, Usuario } from '../types/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Necesario para enviar cookies (JWT) en cada request
});

// Interceptor para agregar CSRF token automáticamente a cada request
api.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Servicios para publicaciones
export const publicacionesApi = {
  // Obtener todas las publicaciones con datos de usuario expandidos
  obtenerTodas: async (): Promise<Publicacion[]> => {
    const [publicacionesResponse, usuariosResponse] = await Promise.all([
      api.get('/publicaciones'),
      api.get('/usuarios')
    ]);

    const publicaciones = publicacionesResponse.data;
    const usuarios = usuariosResponse.data;

    // Expandir los datos del usuario
    return publicaciones.map((pub: Publicacion) => ({
      ...pub,
      usuario: usuarios.find((u: Usuario) => u.id === pub.usuario_id) || {
        id: pub.usuario_id,
        nombre: 'Usuario desconocido',
        email: '',
        password: '',
        telefono: ''
      }
    }));
  },

  // Obtener publicación por ID con datos de usuario expandidos
  obtenerPorId: async (id: string): Promise<Publicacion> => {
    const [publicacionResponse, usuariosResponse] = await Promise.all([
      api.get(`/publicaciones/${id}`),
      api.get('/usuarios')
    ]);

    const publicacion = publicacionResponse.data;
    const usuarios = usuariosResponse.data;

    return {
      ...publicacion,
      usuario: usuarios.find((u: Usuario) => u.id === publicacion.usuario_id) || {
        id: publicacion.usuario_id,
        nombre: 'Usuario desconocido',
        email: '',
        password: '',
        telefono: ''
      }
    };
  },

  // Obtener todas las publicaciones de un usuario
  obtenerTodasUsuario: async (user_id: number): Promise<Publicacion[]> => {
      const [publicacionesResponse, usuariosResponse] = await Promise.all([
        api.get('/publicaciones'),
        api.get('/usuarios')
      ]);

      const publicaciones = publicacionesResponse.data;
      const usuarios = usuariosResponse.data;

      return publicaciones
        .filter((pub: Publicacion) => pub.usuario_id === user_id)
        .map((pub: Publicacion) => ({
        ...pub,
        usuario: usuarios.find((u: Usuario) => u.id === pub.usuario_id) || {
          id: pub.usuario_id,
          nombre: 'Usuario desconocido',
          email: '',
          password: '',
          telefono: ''
      }
    }));
  },

  // Crear nueva publicación
  crear: async (publicacion: CrearPublicacion & { usuario_id: number }): Promise<Publicacion> => {
    const nuevaPublicacion = {
      ...publicacion,
      estado: 'No resuelto' as const,
      fecha_creacion: new Date().toISOString(),
    };

    const response = await api.post('/publicaciones', nuevaPublicacion);

    // Obtener datos del usuario para la respuesta
    const usuarioResponse = await api.get(`/usuarios/${publicacion.usuario_id}`);

    return {
      ...response.data,
      usuario: usuarioResponse.data
    };
  },

  // Actualizar publicación
  actualizar: async (id: number, publicacion: Partial<Publicacion>): Promise<Publicacion> => {
    const response = await api.put(`/publicaciones/${id}`, publicacion);
    return response.data;
  },

  // Eliminar publicación
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/publicaciones/${id}`);
  },

  // Filtrar publicaciones
  filtrar: async (filtros: {
    tipo?: string;
    categoria?: string;
    estado?: string;
    lugar?: string;
  }): Promise<Publicacion[]> => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await api.get(`/publicaciones?${params.toString()}`);
    return response.data;
  },

  // Buscar publicaciones por texto
  buscar: async (query: string): Promise<Publicacion[]> => {
    const response = await api.get(`/publicaciones?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Servicios para usuarios
export const usuariosApi = {
  // Obtener todos los usuarios
  obtenerTodos: async (): Promise<Usuario[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener usuario por ID
  obtenerPorId: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  crear: async (userData: { nombre: string; email: string; password: string; telefono?: string }): Promise<Usuario> => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  // Autenticar usuario
  auth: async (email: string, password: string): Promise<Usuario> => {
    const response = await api.post('/login', { email, password });
    
    // Guardar CSRF token en localStorage (Flujo 4.0 del PPT)
    const csrfToken = response.headers['x-csrf-token'];
    if (csrfToken) {
      localStorage.setItem('csrfToken', csrfToken);
    }
    
    // Configurar axios para enviar CSRF en todas las peticiones futuras
    api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    
    return response.data;
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    await api.post('/login/logout', {}, {
      headers: {
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      }
    });
    localStorage.removeItem('csrfToken');
    delete api.defaults.headers.common['X-CSRF-Token'];
  },

  // Obtener usuario actual (para restablecer sesión)
  me: async (): Promise<Usuario | null> => {
    try {
      const csrfToken = localStorage.getItem('csrfToken');
      if (!csrfToken) return null;
      
      const response = await api.get('/login/me', {
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });
      return response.data;
    } catch {
      return null;
    }
  }
};

export const displayApi = {
  // Función para obtener colores por categoría
  obtenerColorCategoria : (categoria: string) => {
    const colores: { [key: string]: { bg: string; text: string } } = {
      'Electrónicos': { bg: '#e3f2fd', text: '#1565c0' },
      'Ropa': { bg: '#f3e5f5', text: '#7b1fa2' },
      'Documentos': { bg: '#fff3e0', text: '#ef6c00' },
      'Accesorios': { bg: '#e8f5e8', text: '#2e7d32' },
      'Deportes': { bg: '#ffebee', text: '#c62828' },
      'Útiles': { bg: '#f1f8e9', text: '#558b2f' },
      'Otros': { bg: '#fafafa', text: '#616161' }
    };
    return colores[categoria] || colores['Otros'];
  },

   // Función para formatear fecha de manera amigable
  formatearFechaAmigable : (fechaString: string) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora.getTime() - fecha.getTime();
    const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
      return `Hoy a las ${fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diferenciaDias === 1) {
      return `Ayer a las ${fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diferenciaDias <= 7) {
      return `Hace ${diferenciaDias} días`;
    } else {
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  },

};


export default api;
