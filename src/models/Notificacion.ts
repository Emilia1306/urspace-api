import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class Notificacion {
  // Crear una nueva notificación
  static async createNotificacion(usuario_id: number, tipo: string, mensaje: string) {
    return await prisma.notificacion.create({
      data: {
        usuario_id,
        tipo,
        mensaje,
        fecha_envio: new Date(),
        leido: false,
      },
    });
  }

  // Obtener todas las notificaciones de un usuario
  static async getNotificacionesByUsuario(usuario_id: number) {
    return await prisma.notificacion.findMany({
      where: { usuario_id },
      orderBy: { fecha_envio: 'desc' },
    });
  }

  // Marcar notificación como leída
  static async markAsRead(id_notificacion: number) {
    return await prisma.notificacion.update({
      where: { id_notificacion },
      data: { leido: true },
    });
  }
}
