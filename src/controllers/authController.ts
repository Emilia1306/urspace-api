import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { jwtSecret, jwtExpiration } from '../config/jwtConfig';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body; // 'password' en el request, 'contrasenia' en la base de datos

  try {
    // Verificar si el usuario existe usando el campo 'email'
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña usando el campo 'contrasenia' de la base de datos
    const isPasswordValid = await bcrypt.compare(password, usuario.contrasenia);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    return res.json({ message: 'Login exitoso', token });
  } catch (error) {
    next(error); // Pasa el error al siguiente manejador
  }
};
