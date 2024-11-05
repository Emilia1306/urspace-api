import { Request, Response } from "express";
import Conversacion from "../models/Conversacion";

export default class ConversacionController {
  // Crear una nueva conversación
  static async create(req: Request, res: Response) {
    const { usuario_remitente_id, usuario_destinatario_id } = req.body;

    try {
      const nuevaConversacion = await Conversacion.createConversacion(
        usuario_remitente_id,
        usuario_destinatario_id
      );
      res.status(201).json(nuevaConversacion);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear la conversación", error });
    }
  }

  // Obtener conversaciones de un usuario
  static async getConversacionesByUsuario(req: Request, res: Response) {
    const { id_usuario } = req.params;

    try {
      const conversaciones = await Conversacion.getConversacionesByUsuario(
        Number(id_usuario)
      );
      res.status(200).json(conversaciones);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener las conversaciones", error });
    }
  }
}
