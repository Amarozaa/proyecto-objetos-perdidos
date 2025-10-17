import mongoose, { Schema } from 'mongoose';

export interface Usuario {
  id: string;
  nombre: string;
  passwordHash: string;
  email: string;
  telefono?: string;
  imagen_url?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefonoRegex = /^[0-9+\-\s\(\)]+$/;
const usuarioSchema = new Schema({
  // id eliminado, MongoDB asigna _id automáticamente
  nombre: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: [emailRegex, 'Por favor ingrese un email válido.'] },
  telefono: { type: String, match: [telefonoRegex, 'Por favor ingrese un número de teléfono válido.'] },
  imagen_url: { type: String }
});

// Crear índice único sparse para teléfono (permite múltiples null pero únicos valores no-null)
usuarioSchema.index({ telefono: 1 }, { unique: true, sparse: true });


usuarioSchema.set('toJSON', {
  transform: (_: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id?.toString() || returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // nunca exponer password
  },
});

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

export default UsuarioModel;
