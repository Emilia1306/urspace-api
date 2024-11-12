import { PrismaClient, EstadoReserva } from "@prisma/client";

const prisma = new PrismaClient();

export default class Reserva {
  // Crear una nueva reserva
  static async createReserva(
    fecha_inicio: Date,
    fecha_fin: Date,
    impuestos: number,
    subtotal: number,
    precio_total: number,
    terreno_id: number,
    usuario_id: number
  ) {
    return await prisma.reservacion.create({
      data: {
        fecha_inicio,
        fecha_fin,
        impuestos,
        subtotal,
        precio_total,
        estado: EstadoReserva.Pendiente,
        terreno_id,
        usuario_id,
      },
    });
  }

  // Obtener reservas de las propiedades de un usuario específico
  static async getReservasByUsuario(id_usuario: number) {
    return await prisma.reservacion.findMany({
      where: {
        Terreno: {
          usuario_id: id_usuario,
        },
      },
      include: {
        Terreno: true,
        Usuario: true,
      },
    });
  }

  // Obtener reservas por propiedad específica
  static async getReservasByPropiedad(id_terreno: number) {
    return await prisma.reservacion.findMany({
      where: { terreno_id: id_terreno },
      include: {
        Usuario: true,
        Terreno: true,
      },
    });
  }

  // Cambiar el estado de una reserva
  static async updateEstado(id_reservacion: number, estado: EstadoReserva) {
    return await prisma.reservacion.update({
      where: { id_reservacion },
      data: { estado },
    });
  }

  // Obtener historial de reservas hechas por un usuario específico
  static async getHistorialByUsuario(id_usuario: number) {
    return await prisma.reservacion.findMany({
      where: {
        usuario_id: id_usuario,
      },
      include: {
        Terreno: true,
      },
    });
  }
  // Función para actualizar estados de reservas
  static async actualizarEstadosDeReservas() {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy);
    inicioDelDia.setHours(0, 0, 0, 0);
    const finDelDia = new Date(hoy);
    finDelDia.setHours(23, 59, 59, 999);

    try {

      const enCurso = await prisma.reservacion.updateMany({
        where: {
          estado: EstadoReserva.Pendiente,
          fecha_inicio: {
            gte: inicioDelDia,
            lte: finDelDia,
          },
        },
        data: {
          estado: EstadoReserva.EnCurso,
        },
      });

      console.log(`Reservas actualizadas a "EnCurso": ${enCurso.count}`);

      const completadas = await prisma.reservacion.updateMany({
        where: {
          estado: EstadoReserva.EnCurso,
          fecha_fin: {
            lt: inicioDelDia,
          },
        },
        data: {
          estado: EstadoReserva.Completada,
        },
      });

      console.log(`Reservas actualizadas a "Completada": ${completadas.count}`);
      console.log("Estados de reservas actualizados correctamente.");
    } catch (error) {
      console.error("Error al actualizar estados de reservas:", error);
    }
  }
}

