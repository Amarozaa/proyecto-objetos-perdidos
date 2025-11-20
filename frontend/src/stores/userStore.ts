import { create } from "zustand";
import type { Usuario } from "../types/types"
import { usuariosApi } from "../services/api";

type userStore = {
    users: Usuario[];
    actualUser: Usuario | null;
    selectedUser: Usuario | null;

    //acciones
    setUser: (userData: Usuario | null) => void;
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
    logout: () => Promise<void>;
    login: (userData: Usuario) => void;
}

export const useUserStore = create<userStore>((set, get) => ({
    users: [],
    actualUser: null,
    selectedUser: null,
    setUser: (userData) => {
        set({selectedUser: userData});
    },
    obtenerTodos: async () => {
        const datos = await usuariosApi.obtenerTodos();
        set({ users: datos });
    },
    obtenerUserPorId: async (id) =>  {
        const { users } = get();
        const inUsers = users.find(u => u.id === id);
        if (inUsers){
            set({ selectedUser: inUsers });
            return inUsers
        };
        const datos = await usuariosApi.obtenerPorId(id);
        set((state) => ({
            users: state.users.concat(datos),
            selectedUser: datos,
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
            selectedUser: usuarioActualizado.id == state.selectedUser?.id ? usuarioActualizado : state.selectedUser,
            actualUser: usuarioActualizado.id == state.actualUser?.id ? usuarioActualizado : state.actualUser,
        }));
        return usuarioActualizado;
    },
    logout: async () => {
        await usuariosApi.logout();
        set({ actualUser: null });
    },
    login: (userData) => {
        set({ actualUser: userData });
    }
}));