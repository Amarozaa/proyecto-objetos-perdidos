import { create } from "zustand";
import type { Usuario } from "./types/types"
import { authApi } from "./services/api";

type authStore = {
    userAuth : Usuario | null;

    // acciones
    login: (credentials: {
            email: string;
            password: string;}) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<Usuario>;
}

export const useUserStore = create<authStore>((set) => ({
    userAuth: null,
    login: async (credentials) => {
        const datos = await authApi.login(credentials);
        set({ userAuth: datos });
    },
    logout: async () => {
        await authApi.logout();
        set({ userAuth: null });
    },
    getCurrentUser: async () => {
        const datos = await authApi.getCurrentUser();
        set({ userAuth: datos });
        return datos;
    },
}));
