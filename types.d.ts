// types.d.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: number; // Asegúrate de que 'userId' sea opcional por si no está definido
}
