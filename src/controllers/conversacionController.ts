import { Request, Response } from "express";
import Conversacion from "../models/Conversacion";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  static async findOrCreateConversation(req: Request, res: Response) {
    const { usuario_remitente_id, usuario_destinatario_id } = req.body;
    
    console.log("Datos recibidos para crear o encontrar conversación:", {
      usuario_remitente_id,
      usuario_destinatario_id,
    });
  
    try {
      let conversacion = await prisma.conversacion.findFirst({
        where: {
          OR: [
            {
              usuario_remitente_id,
              usuario_destinatario_id,
            },
            {
              usuario_remitente_id: usuario_destinatario_id,
              usuario_destinatario_id: usuario_remitente_id,
            },
          ],
        },
      });
  
      if (!conversacion) {
        console.log("No se encontró conversación existente, creando nueva...");
        conversacion = await Conversacion.createConversacion(
          usuario_remitente_id,
          usuario_destinatario_id
        );
      }
  
      res.status(200).json(conversacion);
    } catch (error) {
      console.error("Error en findOrCreateConversation:", error);
      res
        .status(500)
        .json({ message: "Error al encontrar o crear conversación", error });
    }
  }  

   // Obtener una conversación por su ID
   static async getConversacionById(req: Request, res: Response) {
    const { id_conversacion } = req.params;

    try {
      const conversacion = await prisma.conversacion.findUnique({
        where: {
          id_conversacion: Number(id_conversacion),
        },
      });

      if (conversacion) {
        res.status(200).json(conversacion);
      } else {
        res.status(404).json({ message: "Conversación no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener la conversación:", error);
      res.status(500).json({ message: "Error al obtener la conversación", error });
    }
  }
}
