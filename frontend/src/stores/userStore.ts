import { create } from "zustand";
import type { Usuario } from "../types/types"
import { usuariosApi } from "../services/api";

type userStore = {
    users: Usuario[];
    user: Usuario | null;

    //acciones
    setUser: (userData: Usuario) => void;
    obtenerTodos: () => Promise<void>;
    obtenerUserPorId: (id: string) =>  Promise<Usuario>;
    crear: (userData: {nombre: string;
                        email: string;
                        password: string;
                        telefono?: string;}) => Promise<Usuario>;
    actualizar: (id: string,
                userData: Partial<{
                    nombre: string;
                    email: string;
                    password: string;
                    telefono: string;}>) => Promise<Usuario>;
    auth: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    me: () => Promise<void>;
}

export const useUserStore = create<userStore>((set, get) => ({
    users: [],
    user: null,
    setUser: (userData) => {
        set({user: userData});
    },
    obtenerTodos: async () => {
        const datos = await usuariosApi.obtenerTodos();
        set({ users: datos });
    },
    obtenerUserPorId: async (id) =>  {
        const { users } = get();
        const inUsers = users.find(u => u.id === id);
        if (inUsers) return inUsers;
        const datos = await usuariosApi.obtenerPorId(id);
        set((state) => ({
            users: state.users.concat(datos),
        }));
        return datos;
    },
    crear: async (userData) => {
        const nuevoUsuario = await usuariosApi.crear(userData);
        set((state) => ({
            users: state.users.concat(nuevoUsuario), 
        }));
        return nuevoUsuario;
    },
    actualizar: async (id, userData) => {
        const usuarioActualizado = await usuariosApi.actualizar(id, userData);
        set((state) => ({
            users: state.users.map((u) => u.id==id ? usuarioActualizado : u), 
            user: usuarioActualizado.id == state.user?.id ? usuarioActualizado : state.user,
        }));
        return usuarioActualizado;
    },
    auth: async (email, password) => {
        const datos = await usuariosApi.auth(email, password);
        set({ user: datos });
    },
    logout: async () => {
        await usuariosApi.logout();
        set({ user: null });
    },
    me: async () => {
        const datos = await usuariosApi.me();
        datos ? set({ user: datos }) : set({ user: null });
    },
}));