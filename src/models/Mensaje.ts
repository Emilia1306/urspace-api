import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class Mensaje {
  // Crear un nuevo mensaje
  static async createMensaje(conversacion_id: number, usuario_remitente_id: number, mensaje: string) {
    return await prisma.mensaje.create({
      data: {
        conversacion_id,
        usuario_remitente_id,
        mensaje,
        fecha_envio: new Date(),
      },
    });
  }

  // Obtener mensajes de una conversación
  static async getMensajesByConversacion(conversacion_id: number) {
    return await prisma.mensaje.findMany({
      where: { conversacion_id },
      orderBy: { fecha_envio: 'asc' },
    });
  }
}
