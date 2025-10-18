import axios from 'axios';
import type { Publicacion, CrearPublicacion, Usuario } from '../types/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem("csrfToken");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const publicacionesApi = {
  obtenerTodas: async (): Promise<Publicacion[]> => {
    const response = await api.get("/publicaciones");
    return response.data.publicaciones || [];
  },

  obtenerPorId: async (id: string): Promise<Publicacion> => {
    const response = await api.get(`/publicaciones/${id}`);
    return response.data;
  },

  obtenerTodasUsuario: async (user_id: string): Promise<Publicacion[]> => {
    const response = await api.get(`/publicaciones?usuario_id=${user_id}`);
    return response.data.publicaciones || [];
  },

  crear: async (publicacion: CrearPublicacion): Promise<Publicacion> => {
    const nuevaPublicacion = {
      ...publicacion,
      estado: "No resuelto" as const,
      fecha_creacion: new Date().toISOString(),
    };

    const response = await api.post("/publicaciones", nuevaPublicacion);
    return response.data;
  },

  actualizar: async (
    id: string,
    publicacion: Partial<Publicacion>
  ): Promise<Publicacion> => {
    const response = await api.put(`/publicaciones/${id}`, publicacion);
    return response.data;
  },

  eliminar: async (id: string): Promise<void> => {
    await api.delete(`/publicaciones/${id}`);
  },

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

  buscar: async (query: string): Promise<Publicacion[]> => {
    const response = await api.get(
      `/publicaciones?q=${encodeURIComponent(query)}`
    );
    return response.data.publicaciones || [];
  },
};

export const usuariosApi = {
  obtenerTodos: async (): Promise<Usuario[]> => {
    const response = await api.get("/usuarios");
    return response.data;
  },

  obtenerPorId: async (id: string): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  crear: async (userData: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
  }): Promise<Usuario> => {
    const response = await api.post("/usuarios", userData);
    return response.data;
  },

  auth: async (email: string, password: string): Promise<Usuario> => {
    const response = await api.post("/login", { email, password });

    const csrfToken = response.headers["x-csrf-token"];
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
    }

    api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post(
      "/login/logout",
      {},
      {
        headers: {
          "X-CSRF-Token": localStorage.getItem("csrfToken"),
        },
      }
    );
    localStorage.removeItem("csrfToken");
    delete api.defaults.headers.common["X-CSRF-Token"];
  },

  me: async (): Promise<Usuario | null> => {
    try {
      const csrfToken = localStorage.getItem("csrfToken");
      if (!csrfToken) return null;

      const response = await api.get("/login/me", {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      return response.data;
    } catch {
      return null;
    }
  },
};

export const displayApi = {
  obtenerColorCategoria: (categoria: string) => {
    const colores: { [key: string]: { bg: string; text: string } } = {
      Electrónicos: { bg: "#e3f2fd", text: "#1565c0" },
      Ropa: { bg: "#f3e5f5", text: "#7b1fa2" },
      Documentos: { bg: "#fff3e0", text: "#ef6c00" },
      Accesorios: { bg: "#e8f5e8", text: "#2e7d32" },
      Deportes: { bg: "#ffebee", text: "#c62828" },
      Útiles: { bg: "#f1f8e9", text: "#558b2f" },
      Otros: { bg: "#fafafa", text: "#616161" },
    };
    return colores[categoria] || colores["Otros"];
  },

  formatearFechaAmigable: (fechaString: string) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora.getTime() - fecha.getTime();
    const diferenciaDias = Math.floor(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24)
    );

    if (diferenciaDias === 0) {
      return `Hoy a las ${fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diferenciaDias === 1) {
      return `Ayer a las ${fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diferenciaDias <= 7) {
      return `Hace ${diferenciaDias} días`;
    } else {
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  },
};

// Servicios para autenticación
export const authApi = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<Usuario> => {
    const response = await api.post("/login", credentials);

    const csrfToken = response.headers["x-csrf-token"];
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
      api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/login/logout");
    localStorage.removeItem("user");
  },

  getCurrentUser: async (): Promise<Usuario> => {
    const response = await api.get("/login/me");
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("user") !== null;
  },

  setCurrentUser: (user: Usuario): void => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getStoredUser: (): Usuario | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};


export default api;
