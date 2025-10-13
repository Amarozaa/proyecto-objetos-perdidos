export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  email: string;
  telefono?: string;
  imagen_url?: string;
}
