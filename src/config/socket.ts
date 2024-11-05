import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

const configureSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Ajusta esto en producción para restringir los orígenes permitidos
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

      // Guardar mensaje en la base de datos (ejemplo, ajusta según tu modelo)
      const nuevoMensaje = {
        id: new Date().getTime(), // Esto debería ser el ID generado por la DB
        conversacion_id: conversacionId,
        usuario_remitente_id: usuarioRemitenteId,
        mensaje,
        fecha_envio: new Date(),
      };

      // Emitir mensaje a todos los usuarios en la sala
      io.to(conversacionId).emit("receiveMessage", nuevoMensaje);
    });

    // Desconectar al usuario
    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });

  return io;
};

export default configureSocket;
