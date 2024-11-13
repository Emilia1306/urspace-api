import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import Mensaje from "../models/Mensaje";

const configureSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Cambia esto en producción
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    // Unirse a una sala de conversación
    socket.on("joinRoom", (conversacionId) => {
      socket.join(conversacionId);
      console.log(`Usuario ${socket.id} se unió a la sala ${conversacionId}`);
    });

    // Enviar un mensaje
    socket.on("sendMessage", async (data) => {
      const { conversacionId, usuarioRemitenteId, mensaje } = data;

      try {
        // Guardar el mensaje en la base de datos
        const nuevoMensaje = await Mensaje.createMensaje(
          conversacionId,
          usuarioRemitenteId,
          mensaje
        );

        // Emitir el mensaje guardado a todos los usuarios en la sala
        io.to(conversacionId).emit("receiveMessage", nuevoMensaje);
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
      }
    });

    // Desconectar al usuario
    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });

  return io;
};

export default configureSocket;
