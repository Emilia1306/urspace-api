import { TipoTerreno, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class Terreno {
  static async getAllTerrenos() {
    return await prisma.terreno.findMany({
      include: { ImagenTerreno: true, Valoracion: true, Reservacion: true },
    });
  }

  static async getTerrenoById(id: number) {
    return await prisma.terreno.findUnique({
      where: { id_terreno: id },
      include: { ImagenTerreno: true, Valoracion: true, Reservacion: true },
    });
  }

  static async getTerrenosByTipo(tipo: string) {
    const tipoTerreno = tipo as TipoTerreno;
    return await prisma.terreno.findMany({
      where: { tipo_terreno: tipoTerreno },
      include: { ImagenTerreno: true, Valoracion: true, Reservacion: true },
    });
  }

  static async getTerrenosByUsuarioId(usuario_id: number) {
    return await prisma.terreno.findMany({
      where: { usuario_id },
    });
  }

  static async getTerrenosByUbicacion(ubicacion: string) {
    return await prisma.terreno.findMany({
      where: { ubicacion: { contains: ubicacion, mode: 'insensitive' } },
    });
  }

  static async createTerreno(data: {
    nombre: string;
    ubicacion: string;
    latitud?: number;
    longitud?: number;
    capacidad: number;
    precio: number;
    tipo_terreno: TipoTerreno;
    descripcion?: string;
    usuario_id: number;
    imagenes?: string[]; 
  }) {
    const { imagenes, ...terrenoData } = data;

    return await prisma.terreno.create({
      data: {
        ...terrenoData,
        ImagenTerreno: {
          create: imagenes?.map(url => ({
            url_imagen: url,
          })),
        },
      },
      include: {
        ImagenTerreno: true,
      },
    });
  }

  static async updateTerreno(
    id: number,
    data: Partial<{
      nombre: string;
      ubicacion: string;
      latitud: number;
      longitud: number;
      capacidad: number;
      precio: number;
      tipo_terreno: TipoTerreno;
      descripcion: string;
      publicado: boolean;
    }>
  ) {
    return await prisma.terreno.update({
      where: { id_terreno: id },
      data,
    });
  }

  static async deleteTerreno(id: number) {
    return await prisma.terreno.delete({
      where: { id_terreno: id },
    });
  }

  static async getTerrenosByEtiquetas(etiquetas: string[]) {
    return await prisma.terreno.findMany({
      where: {
        TerrenoEtiqueta: {
          some: {
            Etiqueta: {
              nombre: { in: etiquetas },
            },
          },
        },
      },
      include: {
        ImagenTerreno: true,
        Valoracion: true,
        Reservacion: true,
        TerrenoEtiqueta: {
          include: {
            Etiqueta: true,
          },
        },
      },
    });
  }
}
