import { Request, Response } from "express";
import Mensaje from "../models/Mensaje";

export default class MensajeController {
  // Crear un nuevo mensaje
  static async create(req: Request, res: Response) {
    const { conversacion_id, usuario_remitente_id, mensaje } = req.body;

    try {
      const nuevoMensaje = await Mensaje.createMensaje(
        conversacion_id,
        usuario_remitente_id,
        mensaje
      );
      res.status(201).json(nuevoMensaje);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el mensaje", error });
    }
  }

  // Obtener mensajes de una conversación
  static async getMensajesByConversacion(req: Request, res: Response) {
    const { id_conversacion } = req.params;

    try {
      const mensajes = await Mensaje.getMensajesByConversacion(
        Number(id_conversacion)
      );
      res.status(200).json(mensajes);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los mensajes", error });
    }
  }
}
