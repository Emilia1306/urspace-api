-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('Pendiente', 'Cancelado', 'Completada');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('EnCurso', 'Pendiente', 'Cancelada', 'Completada');

-- CreateEnum
CREATE TYPE "TipoTerreno" AS ENUM ('Venta', 'Alquiler');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "dui" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id_notificacion" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "Terreno" (
    "id_terreno" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "capacidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "tipo_terreno" "TipoTerreno" NOT NULL,
    "descripcion" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_publicacion" TIMESTAMP(3),
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Terreno_pkey" PRIMARY KEY ("id_terreno")
);

-- CreateTable
CREATE TABLE "ImagenTerreno" (
    "id_imagen_terreno" SERIAL NOT NULL,
    "url_imagen" TEXT NOT NULL,
    "terreno_id" INTEGER NOT NULL,

    CONSTRAINT "ImagenTerreno_pkey" PRIMARY KEY ("id_imagen_terreno")
);

-- CreateTable
CREATE TABLE "Etiqueta" (
    "id_etiqueta" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Etiqueta_pkey" PRIMARY KEY ("id_etiqueta")
);

-- CreateTable
CREATE TABLE "TerrenoEtiqueta" (
    "id_terreno_etiqueta" SERIAL NOT NULL,
    "terreno_id" INTEGER NOT NULL,
    "etiqueta_id" INTEGER NOT NULL,

    CONSTRAINT "TerrenoEtiqueta_pkey" PRIMARY KEY ("id_terreno_etiqueta")
);

-- CreateTable
CREATE TABLE "Valoracion" (
    "id_valoracion" SERIAL NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_valoracion" TIMESTAMP(3) NOT NULL,
    "terreno_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Valoracion_pkey" PRIMARY KEY ("id_valoracion")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "estado" "EstadoPago" NOT NULL,
    "reservacion_id" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "Reservacion" (
    "id_reservacion" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "impuestos" DOUBLE PRECISION,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "precio_total" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoReserva" NOT NULL,
    "terreno_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Reservacion_pkey" PRIMARY KEY ("id_reservacion")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id_oferta" SERIAL NOT NULL,
    "fecha_oferta" TIMESTAMP(3) NOT NULL,
    "terreno_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id_oferta")
);

-- CreateTable
CREATE TABLE "Conversacion" (
    "id_conversacion" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "usuario_remitente_id" INTEGER NOT NULL,
    "usuario_destinatario_id" INTEGER NOT NULL,

    CONSTRAINT "Conversacion_pkey" PRIMARY KEY ("id_conversacion")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id_mensaje" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL,
    "usuario_remitente_id" INTEGER NOT NULL,
    "conversacion_id" INTEGER NOT NULL,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dui_key" ON "Usuario"("dui");

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terreno" ADD CONSTRAINT "Terreno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagenTerreno" ADD CONSTRAINT "ImagenTerreno_terreno_id_fkey" FOREIGN KEY ("terreno_id") REFERENCES "Terreno"("id_terreno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TerrenoEtiqueta" ADD CONSTRAINT "TerrenoEtiqueta_terreno_id_fkey" FOREIGN KEY ("terreno_id") REFERENCES "Terreno"("id_terreno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TerrenoEtiqueta" ADD CONSTRAINT "TerrenoEtiqueta_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "Etiqueta"("id_etiqueta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_terreno_id_fkey" FOREIGN KEY ("terreno_id") REFERENCES "Terreno"("id_terreno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoracion" ADD CONSTRAINT "Valoracion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reservacion_id_fkey" FOREIGN KEY ("reservacion_id") REFERENCES "Reservacion"("id_reservacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservacion" ADD CONSTRAINT "Reservacion_terreno_id_fkey" FOREIGN KEY ("terreno_id") REFERENCES "Terreno"("id_terreno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservacion" ADD CONSTRAINT "Reservacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_terreno_id_fkey" FOREIGN KEY ("terreno_id") REFERENCES "Terreno"("id_terreno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_usuario_remitente_id_fkey" FOREIGN KEY ("usuario_remitente_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversacion" ADD CONSTRAINT "Conversacion_usuario_destinatario_id_fkey" FOREIGN KEY ("usuario_destinatario_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_usuario_remitente_id_fkey" FOREIGN KEY ("usuario_remitente_id") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_conversacion_id_fkey" FOREIGN KEY ("conversacion_id") REFERENCES "Conversacion"("id_conversacion") ON DELETE CASCADE ON UPDATE CASCADE;
