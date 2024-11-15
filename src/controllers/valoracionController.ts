import { Request, Response } from 'express';
import Valoracion from '../models/Valoracion';

export default class ValoracionController {

  static async createValoracion(req: Request, res: Response) {
    const { calificacion, comentario, terreno_id, usuario_id } = req.body;

    if (!calificacion || !terreno_id || !usuario_id) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
      const nuevaValoracion = await Valoracion.createValoracion(
        calificacion,
        comentario || null,
        terreno_id,
        usuario_id
      );

      res.status(201).json({
        message: "Valoración creada exitosamente",
        valoracion: nuevaValoracion,
      });
    } catch (error) {
      console.error("Error al crear la valoración:", error);
      res.status(500).json({ message: "Error al crear la valoración", error });
    }
  }

  static async getValoracionesByTerrenoId(req: Request, res: Response) {
    const { terreno_id } = req.params;
    try {
      const valoraciones = await Valoracion.getValoracionesByTerrenoId(Number(terreno_id));
      res.status(200).json(valoraciones);
    } catch (error) {
      console.error('Error al obtener valoraciones:', error);
      res.status(500).json({ message: 'Error al obtener valoraciones del terreno', error });
    }
  }

  static async getValoracionesByTerrenoIdAndCalificacion(req: Request, res: Response) {
    const { terreno_id, calificacion } = req.params;

    try {
      const valoraciones = await Valoracion.getValoracionesByTerrenoIdAndCalificacion(
        Number(terreno_id),
        Number(calificacion)
      );

      res.status(200).json(valoraciones);
    } catch (error) {
      console.error('Error al obtener valoraciones por calificación:', error);
      res.status(500).json({ message: 'Error al obtener valoraciones por calificación', error });
    }
  }

  static async getPromedioCalificacion(req: Request, res: Response) {
    const { terreno_id } = req.params;

    try {
      const promedio = await Valoracion.getPromedioCalificacion(Number(terreno_id));
      
      if (promedio === null) {
        return res.status(404).json({ message: 'No se encontraron valoraciones para este terreno' });
      }

      res.status(200).json({ promedio });
    } catch (error) {
      console.error('Error al calcular el promedio de calificaciones:', error);
      res.status(500).json({ message: 'Error al calcular el promedio de calificaciones', error });
    }
  }

}