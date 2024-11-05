import { Request, Response } from "express";
import Reserva from "../models/Reserva";
import { EstadoReserva } from "@prisma/client";

export default class ReservaController {
  // Crear una nueva reserva
  static async create(req: Request, res: Response) {
    const {
      fecha_inicio,
      fecha_fin,
      impuestos,
      subtotal,
      precio_total,
      terreno_id,
      usuario_id,
    } = req.body;

    try {
      const nuevaReserva = await Reserva.createReserva(
        fecha_inicio,
        fecha_fin,
        impuestos,
        subtotal,
        precio_total,
        terreno_id,
        usuario_id
      );
      res.status(201).json(nuevaReserva);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la reserva", error });
    }
  }

  // Ver reservas de las propiedades de un solo usuario
  static async getReservasByUsuario(req: Request, res: Response) {
    const { id_usuario } = req.params;

    try {
      const reservas = await Reserva.getReservasByUsuario(Number(id_usuario));
      res.status(200).json(reservas);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener reservas del usuario", error });
    }
  }

  // Ver reservas por propiedad específica
  static async getReservasByPropiedad(req: Request, res: Response) {
    const { id_terreno } = req.params;

    try {
      const reservas = await Reserva.getReservasByPropiedad(Number(id_terreno));
      res.status(200).json(reservas);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener reservas de la propiedad", error });
    }
  }

  // Cambiar el estado de la reserva
  static async updateEstado(req: Request, res: Response) {
    const { id_reservacion } = req.params;
    const { estado } = req.body;

    try {
      const reservacionActualizada = await Reserva.updateEstado(
        Number(id_reservacion),
        estado
      );
      res.status(200).json(reservacionActualizada);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error al actualizar el estado de la reserva",
          error,
        });
    }
  }

  // Obtener historial de reservas hechas por un usuario específico
  static async getHistorialByUsuario(req: Request, res: Response) {
    const { id_usuario } = req.params;

    try {
      const historial = await Reserva.getHistorialByUsuario(Number(id_usuario));
      res.status(200).json(historial);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error al obtener el historial de reservas del usuario",
          error,
        });
    }
  }
}
