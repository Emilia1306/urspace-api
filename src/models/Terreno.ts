import { TipoTerreno, PrismaClient, Prisma } from "@prisma/client";
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
      include: {
        ImagenTerreno: true,
        Reservacion: true,
        Usuario: true,
        TerrenoEtiqueta: {
          include: {
            Etiqueta: true,
          },
        },
        Valoracion: {
          include:{
            Usuario: true,
          }
        },
      },
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
      include: { ImagenTerreno: true },
    });
  }

  static async getTerrenosByUbicacion(ubicacion: string) {
    return await prisma.terreno.findMany({
      where: { ubicacion: { contains: ubicacion, mode: "insensitive" } },
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
    etiquetas?: number[];
  }) {
    const { imagenes, etiquetas, ...terrenoData } = data;

    try {
      console.log("Datos recibidos para crear el terreno:", data);
      return await prisma.terreno.create({
        data: {
          ...terrenoData,
          publicado: true,
          fecha_publicacion: new Date(),
          ImagenTerreno: {
            create: imagenes?.map((url) => ({
              url_imagen: url,
            })),
          },
          TerrenoEtiqueta:
            etiquetas && etiquetas.length > 0
              ? {
                  create: etiquetas.map((id_etiqueta) => ({
                    etiqueta_id: id_etiqueta,
                  })),
                }
              : undefined,
        },
        include: {
          ImagenTerreno: true,
          TerrenoEtiqueta: {
            include: {
              Etiqueta: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error al crear el terreno en Prisma:", error);
      throw new Error("Error al crear el terreno");
    }
  }

  static async updateTerreno(
    id: number,
    data: Partial<{
      nombre: string;
      descripcion: string;
      tipo_terreno: TipoTerreno;
      capacidad: number;
      precio: number;
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

  static async getTerrenosByEtiquetas(etiquetasArray: string[]) {
    return await prisma.terreno.findMany({
      where: {
        TerrenoEtiqueta: {
          some: {
            Etiqueta: {
              nombre: {
                in: etiquetasArray,
              },
            },
          },
        },
      },
      include: {
        ImagenTerreno: true,
        TerrenoEtiqueta: {
          include: {
            Etiqueta: true,
          },
        },
      },
    });
  }

  static async getTerrenosPublicados() {
    return await prisma.terreno.findMany({
      where: { publicado: true },
      include: {
        ImagenTerreno: true,
        TerrenoEtiqueta: {
          include: {
            Etiqueta: true,
          },
        },
      },
    });
  }

  static async getTerrenosNoPublicados() {
    return await prisma.terreno.findMany({
      where: { publicado: false },
      include: {
        ImagenTerreno: true,
        TerrenoEtiqueta: {
          include: {
            Etiqueta: true,
          },
        },
      },
    });
  }

  static async getImagenesByTerrenoId(id_terreno: number) {
    return await prisma.imagenTerreno.findMany({
      where: { terreno_id: id_terreno },
      select: { url_imagen: true }, // Solo seleccionamos la URL de las imágenes
    });
  }

  static async getUbicacionByTerrenoId(id: number) {
    return await prisma.terreno.findUnique({
      where: { id_terreno: id },
      select: { ubicacion: true },
    });
  }

  static async deshabilitarTerreno(
    id: number,
    data: Partial<{
      publicado: boolean;
      precio: number;
      capacidad: number;
      tipo_terreno: TipoTerreno; // Especifica el tipo correctamente aquí
      descripcion: string;
      ubicacion: string;
      nombre: string;
      latitud: number;
      longitud: number;
    }>
  ) {
    return await prisma.terreno.update({
      where: { id_terreno: id },
      data,
    });
  }

  static async getTerrenosExcluyendoUsuario(usuario_id: number) {
    return await prisma.terreno.findMany({
      where: {
        usuario_id: {
          not: usuario_id, // Filtra terrenos que no pertenecen al usuario logueado
        },
      },
      include: {
        ImagenTerreno: true,
        Valoracion: true,
        Reservacion: true,
      },
    });
  }

  static async getTerrenosFiltrados(filtros: {
    country?: string;
    city?: string;
    etiquetas?: number[];
  }) {
    const { country, city, etiquetas } = filtros;

    // Construir condiciones de filtrado
    let whereCondition: Prisma.TerrenoWhereInput = {};

    if (country && city) {
      // Filtrar por país y ciudad juntos
      whereCondition.ubicacion = {
        contains: `${country}, ${city}`,
        mode: "insensitive",
      };
    } else if (country) {
      // Filtrar solo por país
      whereCondition.ubicacion = {
        contains: country,
        mode: "insensitive",
      };
    }

    if (etiquetas && etiquetas.length > 0) {
      // Filtrar por etiquetas
      whereCondition.TerrenoEtiqueta = {
        some: {
          etiqueta_id: {
            in: etiquetas,
          },
        },
      };
    }

    // Ejecutar consulta
    return await prisma.terreno.findMany({
      where: whereCondition,
      include: {
        ImagenTerreno: true,
        TerrenoEtiqueta: {
          include: {
            Etiqueta: true,
          },
        },
      },
    });
  }
}
