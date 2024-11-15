import { Request, Response } from "express";
import Oferta from "../models/Oferta";
import Notificacion from "../models/Notificacion";
import Terreno from "../models/Terreno";
import { getSocketInstance } from "../config/socket";

export default class OfertaController {
  // Crear una nueva oferta
  // Crear una nueva oferta
  static async create(req: Request, res: Response) {
    const { fecha_oferta, terreno_id, usuario_id } = req.body;

    try {
      // Crear la oferta
      const nuevaOferta = await Oferta.createOferta(fecha_oferta, terreno_id, usuario_id);

      // Obtener el terreno y el propietario de la propiedad ofertada
      const terreno = await Terreno.getTerrenoById(terreno_id);
      if (!terreno) {
        return res.status(404).json({ message: "Terreno no encontrado" });
      }
      const propietarioId = terreno.usuario_id;

      // Crear una notificación para el propietario
      const notificacionPropietario = await Notificacion.createNotificacion(
        propietarioId,
        "oferta",
        `Han hecho una oferta en tu propiedad ${terreno.nombre}.`
      );

      // Enviar la notificación en tiempo real al propietario usando Socket.IO
      const io = getSocketInstance();
      io.to(`user_${propietarioId}`).emit("receiveNotification", notificacionPropietario);

      // Enviar respuesta al cliente
      res.status(201).json(nuevaOferta);
    } catch (error) {
      console.error("Error al crear la oferta:", error);
      res.status(500).json({ message: "Error al crear la oferta", error });
    }
  }

  // Eliminar una oferta por ID
  static async delete(req: Request, res: Response) {
    const { id_oferta } = req.params;

    try {
      const ofertaEliminada = await Oferta.deleteOferta(Number(id_oferta));
      res.status(200).json({ message: "Oferta eliminada correctamente", ofertaEliminada });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la oferta", error });
    }
  }

  // Obtener ofertas de todos los terrenos en los que el usuario es el dueño
  static async getOfertasByPropietario(req: Request, res: Response) {
    const { id_usuario } = req.params;

    try {
      const ofertas = await Oferta.getOfertasByPropietario(Number(id_usuario));
      res.status(200).json(ofertas);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener ofertas del propietario", error });
    }
  }
}
