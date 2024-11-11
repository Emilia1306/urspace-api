import { Request, Response, NextFunction } from 'express';
import { EtiquetaService } from '../models/Etiqueta';

export const getEtiquetas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const etiquetas = await EtiquetaService.obtenerTodas();
    res.json(etiquetas);
  } catch (error) {
    next(error);
  }
};

