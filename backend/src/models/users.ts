import mongoose, { Schema } from 'mongoose';

export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  email: string;
  telefono?: string;
  imagen_url?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usuarioSchema = new Schema({
  // id eliminado, MongoDB asigna _id automáticamente
  nombre: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: [emailRegex, 'Por favor ingrese un email válido'] },
  telefono: { type: String, unique: true },
  imagen_url: { type: String }
});

usuarioSchema.set('toJSON', {
  transform: (_: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id?.toString() || returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password; // nunca exponer password
  },
});

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

export default UsuarioModel;
