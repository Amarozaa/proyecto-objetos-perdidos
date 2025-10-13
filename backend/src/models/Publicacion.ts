export type Tipo = "Perdido" | "Encontrado";
export type Estado = "Resuelto" | "No resuelto";
export type Categoria =
  | "Electrónicos"
  | "Ropa"
  | "Documentos"
  | "Accesorios"
  | "Deportes"
  | "Útiles"
  | "Otros";

export interface Publicacion {
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
  usuario_id: number;
}

export interface CrearPublicacion {
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  tipo: Tipo;
  categoria: Categoria;
  imagen_url?: string;
}
