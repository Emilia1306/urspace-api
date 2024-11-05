const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const terrenos = await prisma.terreno.findMany({
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
    console.log('Terrenos publicados:', terrenos);
  } catch (error) {
    console.error('Error en la consulta de Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
