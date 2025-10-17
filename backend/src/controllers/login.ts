import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import UsuarioModel from "../models/users";
import config from "../utils/config";
import { withUser } from "../middleware/auth";

const router = express.Router();

// POST /api/login - Autenticar usuario
router.post("/", async (request, response) => {
  const { email, password } = request.body;

  // Buscar usuario por email
  const user = await UsuarioModel.findOne({ email });

  if (!user) {
    response.status(401).json({
      error: "invalid email or password",
    });
    return;
  }

  // Comparar password con el hash guardado
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    response.status(401).json({
      error: "invalid email or password",
    });
    return;
  }

  // Crear token JWT con información del usuario y token CSRF
  const csrfToken = randomUUID();
  const userForToken = {
    email: user.email,
    id: user._id,
    csrf: csrfToken,
  };

  // Firmar el JWT con el secreto (expira en 1 hora)
  const token = jwt.sign(userForToken, config.JWT_SECRET!, {
    expiresIn: 60 * 60, // 1 hora
  });

  // Enviar el CSRF token en un header personalizado
  response.setHeader("X-CSRF-Token", csrfToken);

  // Enviar el JWT como cookie httpOnly
  response.cookie("token", token, {
    httpOnly: true, // No accesible desde JavaScript (protege contra XSS)
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict", // Protege contra CSRF
    maxAge: 60 * 60 * 1000, // 1 hora en milisegundos
  });

  // Retornar datos del usuario (sin password)
  response.status(200).send({
    email: user.email,
    nombre: user.nombre,
    id: user.id,
  });
});

// POST /api/login/logout - Cerrar sesión
router.post("/logout", (_request, response) => {
  response.clearCookie("token");
  response.status(200).send({
    message: "Logged out successfully",
  });
});

// GET /api/login/me - Obtener usuario actual (requiere autenticación)
router.get("/me", withUser, async (request, response) => {
  const user = await UsuarioModel.findById(request.userId);
  
  if (!user) {
    response.status(404).json({ error: "User not found" });
    return;
  }

  response.status(200).json({
    email: user.email,
    nombre: user.nombre,
    id: user.id,
  });
});

export default router;
