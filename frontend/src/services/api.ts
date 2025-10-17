import axios from 'axios';
import type { Publicacion, CrearPublicacion, Usuario, UsuarioFormData } from '../types/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies de autenticación
});

// Interceptor para añadir token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    // El token se enviará automáticamente como cookie httpOnly
    // No necesitamos añadirlo manualmente al Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('user');
      // Redirigir al login si es necesario
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Servicios para publicaciones
export const publicacionesApi = {
  // Obtener todas las publicaciones con datos de usuario expandidos
  obtenerTodas: async (): Promise<Publicacion[]> => {
    const response = await api.get('/publicaciones');
    
    // El backend devuelve { publicaciones: [...], pagination: {...} }
    return response.data.publicaciones || [];
  },

  // Obtener publicación por ID con datos de usuario expandidos
  obtenerPorId: async (id: string): Promise<Publicacion> => {
    const response = await api.get(`/publicaciones/${id}`);
    return response.data;
  },

  // Obtener todas las publicaciones de un usuario
  obtenerTodasUsuario: async (user_id: string): Promise<Publicacion[]> => {
      const response = await api.get(`/publicaciones?usuario_id=${user_id}`);
      return response.data.publicaciones || [];
  },

  // Crear nueva publicación
  crear: async (publicacion: CrearPublicacion): Promise<Publicacion> => {
    const nuevaPublicacion = {
      ...publicacion,
      estado: 'No resuelto' as const,
      fecha_creacion: new Date().toISOString(),
    };

    const response = await api.post('/publicaciones', nuevaPublicacion);
    return response.data;
  },

  // Actualizar publicación
  actualizar: async (id: string, publicacion: Partial<Publicacion>): Promise<Publicacion> => {
    const response = await api.put(`/publicaciones/${id}`, publicacion);
    return response.data;
  },

  // Eliminar publicación
  eliminar: async (id: string): Promise<void> => {
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
    return response.data.publicaciones || [];
  },

  // Buscar publicaciones por texto
  buscar: async (query: string): Promise<Publicacion[]> => {
    const response = await api.get(`/publicaciones?q=${encodeURIComponent(query)}`);
    return response.data.publicaciones || [];
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
  obtenerPorId: async (id: string): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  crear: async (usuario: UsuarioFormData): Promise<Usuario> => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },
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

// Servicios para autenticación
export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }): Promise<Usuario> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/login/logout');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<Usuario> => {
    const response = await api.get('/login/me');
    return response.data;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return localStorage.getItem('user') !== null;
  },

  // Guardar usuario en localStorage (llamar después del login exitoso)
  setCurrentUser: (user: Usuario): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obtener usuario desde localStorage
  getStoredUser: (): Usuario | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};


export default api;
