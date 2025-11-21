export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

// Interface para crear/actualizar usuario (incluye password)
export interface UsuarioFormData {
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
}

// Los tipos definen si el objeto ha sido perdido o encontrado (tipo de la publicación)
export type Tipo = "Perdido" | "Encontrado";

// Los estados definen si el objeto ha sido recuperado por su dueño
export type Estado = "Resuelto" | "No resuelto";

// Categorías de objetos para filtros y búsquedas
export type Categoria = "Electrónicos" | "Ropa" | "Documentos" | "Accesorios" | "Deportes" | "Útiles" | "Otros";

export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  estado: Estado;
  tipo: Tipo;
  categoria: Categoria;
  fecha_creacion?: string;
  usuario_id: string;
  usuario?: Usuario;
}

// Interface para crear nuevas publicaciones
export interface CrearPublicacion {
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  tipo: Tipo;
  categoria: Categoria;
}
