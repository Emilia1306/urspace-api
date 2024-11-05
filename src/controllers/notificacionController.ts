import { Request, Response } from 'express';
import Notificacion from '../models/Notificacion';

export default class NotificacionController {
  // Crear una nueva notificación
  static async create(req: Request, res: Response) {
    const { usuario_id, tipo, mensaje } = req.body;

    try {
      const nuevaNotificacion = await Notificacion.createNotificacion(usuario_id, tipo, mensaje);
      res.status(201).json(nuevaNotificacion);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la notificación', error });
    }
  }

  // Obtener todas las notificaciones de un usuario
  static async getNotificacionesByUsuario(req: Request, res: Response) {
    const { id_usuario } = req.params;

    try {
      const notificaciones = await Notificacion.getNotificacionesByUsuario(Number(id_usuario));
      res.status(200).json(notificaciones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las notificaciones', error });
    }
  }

  // Marcar notificación como leída
  static async markAsRead(req: Request, res: Response) {
    const { id_notificacion } = req.params;

    try {
      const notificacionLeida = await Notificacion.markAsRead(Number(id_notificacion));
      res.status(200).json(notificacionLeida);
    } catch (error) {
      res.status(500).json({ message: 'Error al marcar la notificación como leída', error });
    }
  }
}
