export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  email: string;
}

// Los tipos definen si el objeto ha sido perdido o encontrado (tipo de la publicación)
export type Tipo = "Perdido" | "Encontrado";

// Los estados definen si el objeto ha sido recuperado por su dueño
export type Estado = "Resuelto" | "No resuelto";

// Categorías de objetos para filtros y búsquedas
export type Categoria = "Electrónicos" | "Ropa" | "Documentos" | "Accesorios" | "Deportes" | "Útiles" | "Otros";

export interface Objeto {
  id: number;
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  estado: Estado;
  tipo: Tipo;
  categoria: Categoria;
  imagen_url?: string;
  fecha_creacion?: string;
  contacto_adicional?: string;
  usuario: Usuario;
}

// Interface para crear nuevos objetos (sin campos auto-generados)
export interface CrearObjeto {
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  tipo: Tipo;
  categoria: Categoria;
  imagen_url?: string;
  contacto_adicional?: string;
}
