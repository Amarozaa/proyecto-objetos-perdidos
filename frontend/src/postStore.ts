import { create } from "zustand";
import type { Publicacion, CrearPublicacion } from "./types/types"
import { publicacionesApi } from "./services/api";

type postStore = {
    posts: Publicacion[];
    post: Publicacion | null;

    // acciones
    obtenerTodas: () => Promise<void>;
    obtenerPorId: (id: string) => Promise<void>;
    obtenerTodasUsuario: (user_id: string) => Promise<void>;
    crear: (publicacion: CrearPublicacion) => Promise<Publicacion>; 
    actualizar: (id: string, publicacion: Partial<Publicacion>) => Promise<Publicacion>;
    eliminar: (id: string) => Promise<void>;
    filtrar: (filtros: { tipo?: string;
                        categoria?: string;
                        estado?: string;
                        lugar?: string; }) => Promise<void>;
    buscar: (query: string) => Promise<void>;
}

export const usePostStore = create<postStore>((set) => ({
    posts: [],
    post: null,
    obtenerTodas: async () => {
        const datos = await publicacionesApi.obtenerTodas();
        set({ posts: datos });
    },
    obtenerPorId: async (id) => {
        const datos = await publicacionesApi.obtenerPorId(id);
        set({ post: datos });
    },
    obtenerTodasUsuario: async (user_id) => {
        const datos = await publicacionesApi.obtenerTodasUsuario(user_id);
        set({ posts: datos });
    },
    crear: async (publicacion) => {
        const nuevaPublicacion = await publicacionesApi.crear(publicacion);
        set((state) => ({
            posts: state.posts.concat(nuevaPublicacion), 
        }));
        return nuevaPublicacion;
    }, 
    actualizar: async (id, publicacion) => {
        const publicacionActualizada = await publicacionesApi.actualizar(id, publicacion);
        set((state) => ({
            posts: state.posts.map((p) => p.id==id ? publicacionActualizada : p), 
        }));
        return publicacionActualizada;
    },
    eliminar: async (id) => {
        await publicacionesApi.eliminar(id);
        set((state) => ({
            posts: state.posts.filter((p) => p.id !== id), 
        }));
    },
    filtrar: async (filtros) => {
        const datos = await publicacionesApi.filtrar(filtros);
        set({ posts: datos });
    },
    buscar: async (query) => {
        const datos = await publicacionesApi.buscar(query);
        set({ posts: datos });
    },
}));