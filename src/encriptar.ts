import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para crear un usuario con la contraseña encriptada
const crearUsuario = async () => {
  const saltRounds = 10;
  const passwordPlano = "123"; // La contraseña en texto plano que quieres encriptar
  const hashedPassword = await bcrypt.hash(passwordPlano, saltRounds);

  // Guarda el usuario con la contraseña encriptada en la base de datos
  await prisma.usuario.create({
    data: {
      nombres: "Juan",
      apellidos: "Pérez",
      email: "juan.perez@example.com",
      contrasenia: hashedPassword,
      dui: "12345678-9",
      fecha_registro: new Date()
    },
  });

  console.log("Usuario creado con contraseña encriptada");
};

// Ejecuta la función
crearUsuario();
