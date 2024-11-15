import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class Valoracion {
  static async createValoracion(
    calificacion: number,
    comentario: string | null,
    terreno_id: number,
    usuario_id: number
  ) {
    return await prisma.valoracion.create({
      data: {
        calificacion,
        comentario,
        fecha_valoracion: new Date(),
        terreno_id,
        usuario_id,
      },
    });
  }

  static async getValoracionesByTerrenoId(terrenoId: number) {
    return await prisma.valoracion.findMany({
      where: { terreno_id: terrenoId },
    });
  }

  static async getValoracionesByTerrenoIdAndCalificacion(terrenoId: number, calificacion: number) {
    return await prisma.valoracion.findMany({
      where: {
        terreno_id: terrenoId,
        calificacion: calificacion,
      },
    });
  }

  static async getPromedioCalificacion(terrenoId: number) {
    const resultado = await prisma.valoracion.aggregate({
      where: {
        terreno_id: terrenoId,
      },
      _avg: {
        calificacion: true,
      },
    });
    return resultado._avg.calificacion;
  }
}