import dotenv from 'dotenv'
dotenv.config()

import mongoose, { Schema } from 'mongoose';

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
  mongoose.connect(url, { dbName }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
}

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

const publicacionSchema = new Schema<Publicacion>({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  lugar: { type: String, required: true },
  fecha: { type: String, required: true },
  estado: { type: String, enum: ["Resuelto", "No resuelto"], required: true },
  tipo: { type: String, enum: ["Perdido", "Encontrado"], required: true },
  categoria: { type: String, enum: [
    "Electrónicos",
    "Ropa",
    "Documentos",
    "Accesorios",
    "Deportes",
    "Útiles",
    "Otros"
  ], required: true },
  imagen_url: { type: String },
  fecha_creacion: { type: String },
  usuario_id: { type: Number, required: true }
});

publicacionSchema.set('toJSON', {
  transform: (_: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id?.toString() || returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PublicacionModel = mongoose.model<Publicacion>('Publicacion', publicacionSchema);

export default PublicacionModel;
