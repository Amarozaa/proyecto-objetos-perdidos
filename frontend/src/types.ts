export interface Objeto {
  id: number;
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  estado: "perdido" | "encontrado";
  usuario: string;
}