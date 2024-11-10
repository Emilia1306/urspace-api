import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { jwtSecret, jwtExpiration } from '../config/jwtConfig';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body; // 'password' en el request, 'contrasenia' en la base de datos
  console.log("Received login request", { email, password });
  try {
    // Verificar si el usuario existe usando el campo 'email'
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    console.log("User found in database:", usuario);

    if (!usuario) {
      console.log("User not found, sending 401 response");
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña usando el campo 'contrasenia' de la base de datos
    const isPasswordValid = await bcrypt.compare(password, usuario.contrasenia);
    console.log("Password validation result:", isPasswordValid);
    if (!isPasswordValid) {
      console.log("Invalid password, sending 401 response");
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );
    console.log("Generated JWT token:", token);

    return res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error("Error in login function:", error); 
    next(error); // Pasa el error al siguiente manejador
  }
};

// Endpoint para registrar un nuevo usuario
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { nombres, apellidos, email, contrasenia, dui } = req.body;
  
  console.log("Datos recibidos para registro:", { nombres, apellidos, email, contrasenia, dui });
  try {
    // Verificar si el usuario ya existe por el email o el DUI
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      console.error("Error: El email ya está registrado");
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const existingDUI = await prisma.usuario.findUnique({ where: { dui } });
    if (existingDUI) {
      console.error("Error: El DUI ya está registrado");
      return res.status(400).json({ message: 'El DUI ya está registrado' });
    }

    // Encriptar la contraseña
    const saltRounds = 10;

    // Verificar si contrasenia es válida antes de llamar a bcrypt.hash
    if (!contrasenia) {
      console.error("Error: La contraseña no puede estar vacía");
      return res.status(400).json({ message: 'La contraseña no puede estar vacía' });
    }

    console.log("Encriptando contraseña...");
    const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);
    console.log("Contraseña encriptada:", hashedPassword);
    // Crear el nuevo usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        email,
        contrasenia: hashedPassword,
        dui,
        fecha_registro: new Date(),
      },
    });
    console.log("Usuario creado exitosamente:", newUser);

    // Responder con el usuario creado
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: newUser.id_usuario,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        email: newUser.email,
        dui: newUser.dui,
        fecha_registro: newUser.fecha_registro,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    next(error); // Pasa el error al siguiente manejador
  }
};

export const getUserInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autorizado' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        nombres: true,
        apellidos: true,
        email: true,
        dui: true,
        fecha_registro: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};