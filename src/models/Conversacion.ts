import { PrismaClient } from "@prisma/client";

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
    const conversaciones = await prisma.conversacion.findMany({
      where: {
        OR: [
          { usuario_remitente_id: id_usuario },
          { usuario_destinatario_id: id_usuario },
        ],
      },
      include: {
        Mensaje: {
          orderBy: { fecha_envio: "desc" },
          take: 1, // Obtiene el último mensaje
        },
        UsuarioRemitente: {
          select: {
            nombres: true,
            apellidos: true,
          },
        },
        UsuarioDestinatario: {
          select: {
            nombres: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        fecha_inicio: "desc",
      },
    });

    return conversaciones.map((conversacion) => {
      const esRemitente = conversacion.usuario_remitente_id === id_usuario;
      const otroUsuario = esRemitente ? conversacion.UsuarioDestinatario : conversacion.UsuarioRemitente;
      const ultimoMensaje = conversacion.Mensaje[0]?.mensaje || "";

      return {
        id_conversacion: conversacion.id_conversacion,
        fecha_inicio: conversacion.fecha_inicio,
        otro_usuario_id: esRemitente ? conversacion.usuario_destinatario_id : conversacion.usuario_remitente_id,
        otro_usuario_nombres: otroUsuario?.nombres,
        otro_usuario_apellidos: otroUsuario?.apellidos,
        ultimo_mensaje: ultimoMensaje,
      };
    });
  }
}
