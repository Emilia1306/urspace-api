import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class Oferta {
  // Crear una nueva oferta
  static async createOferta(fecha_oferta: Date, terreno_id: number, usuario_id: number) {
    return await prisma.oferta.create({
      data: {
        fecha_oferta,
        terreno_id,
        usuario_id,
      },
    });
  }

  // Eliminar una oferta por ID
  static async deleteOferta(id_oferta: number) {
    return await prisma.oferta.delete({
      where: { id_oferta },
    });
  }

  // Obtener ofertas de todos los terrenos en los que un usuario es dueño
  static async getOfertasByPropietario(id_usuario: number) {
    return await prisma.oferta.findMany({
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
}
