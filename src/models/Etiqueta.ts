import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EtiquetaService {
  // Obtener todas las etiquetas
  static async obtenerTodas() {
    return await prisma.etiqueta.findMany({
      select: {
        id_etiqueta: true,
        nombre: true,
      },
    });
  }

  // Obtener una etiqueta por su ID
  static async obtenerPorId(id: number) {
    return await prisma.etiqueta.findUnique({
      where: { id_etiqueta: id },
      select: {
        id_etiqueta: true,
        nombre: true,
      },
    });
  }

  // Crear una nueva etiqueta
  static async crear(nombre: string) {
    return await prisma.etiqueta.create({
      data: {
        nombre,
      },
    });
  }

  // Actualizar una etiqueta existente
  static async actualizar(id: number, nombre: string) {
    return await prisma.etiqueta.update({
      where: { id_etiqueta: id },
      data: { nombre },
    });
  }

  // Eliminar una etiqueta por su ID
  static async eliminar(id: number) {
    return await prisma.etiqueta.delete({
      where: { id_etiqueta: id },
    });
  }
}
