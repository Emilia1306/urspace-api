import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwtConfig';

// Extender la interfaz Request para incluir 'user'
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// Middleware para autenticar el token JWT
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // El token viene en el formato: "Bearer <token>"

  if (!token) return res.sendStatus(401); // No autorizado si no hay token

  // Verificar el token
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) return res.sendStatus(403); // Token inválido o expirado
    req.user = decodedToken as AuthenticatedRequest['user']; // Almacena el usuario en la solicitud
    next(); // Continúa con la siguiente función
  });
};
