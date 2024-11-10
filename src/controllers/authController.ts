import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
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

  try {
    // Verificar si el usuario ya existe por el email o el DUI
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const existingDUI = await prisma.usuario.findUnique({ where: { dui } });
    if (existingDUI) {
      return res.status(400).json({ message: 'El DUI ya está registrado' });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);

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
    next(error); // Pasa el error al siguiente manejador
  }
};