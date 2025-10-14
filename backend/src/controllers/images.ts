import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export const servirImagen = (req: Request, res: Response): void => {
  const { tipo, filename } = req.params;
  const allowedTypes = ['usuarios', 'publicaciones', 'otros'];
  
  if (!allowedTypes.includes(tipo)) {
    res.status(400).json({ error: 'Tipo de imagen no válido' });
    return;
  }
  
  const imagePath = path.join(__dirname, '../../uploads', tipo, filename);
  
  // Verificar si el archivo existe
  if (!fs.existsSync(imagePath)) {
    res.status(404).json({ error: 'Imagen no encontrada' });
    return;
  }
  
  res.sendFile(imagePath);
};

export default servirImagen;