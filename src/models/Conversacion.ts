import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class Conversacion {
  // Crear una nueva conversación
  static async createConversacion(usuario_remitente_id: number, usuario_destinatario_id: number) {
    return await prisma.conversacion.create({
      data: {
        usuario_remitente_id,
        usuario_destinatario_id,
        fecha_inicio: new Date(),
      },
    });
  }

  // Obtener todas las conversaciones de un usuario
  static async getConversacionesByUsuario(id_usuario: number) {
    return await prisma.conversacion.findMany({
      where: {
        OR: [
          { usuario_remitente_id: id_usuario },
          { usuario_destinatario_id: id_usuario },
        ],
      },
      orderBy: { fecha_inicio: 'desc' },
    });
  }
}
