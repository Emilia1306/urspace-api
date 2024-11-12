import { Request, Response } from "express";
import Oferta from "../models/Oferta";

export default class OfertaController {
  // Crear una nueva oferta
  static async create(req: Request, res: Response) {
    const { fecha_oferta, terreno_id, usuario_id } = req.body;

    try {
      const nuevaOferta = await Oferta.createOferta(fecha_oferta, terreno_id, usuario_id);
      res.status(201).json(nuevaOferta);
    } catch (error) {
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
