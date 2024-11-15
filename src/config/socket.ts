import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import Mensaje from "../models/Mensaje";
import Notificacion from "../models/Notificacion";

let io: SocketIOServer;

const configureSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
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

    // Unirse a una sala de notificaciones personal
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Usuario ${socket.id} se unió a su sala de notificaciones: user_${userId}`);
    });

    // Enviar un mensaje
    socket.on("sendMessage", async (data) => {
      const { conversacionId, usuarioRemitenteId, mensaje } = data;

      try {
        const nuevoMensaje = await Mensaje.createMensaje(conversacionId, usuarioRemitenteId, mensaje);
        io.to(conversacionId).emit("receiveMessage", nuevoMensaje);
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
      }
    });

    // Enviar una notificación en tiempo real
    socket.on("sendNotification", async (data) => {
      const { usuarioId, tipo, mensaje } = data;

      try {
        const nuevaNotificacion = await Notificacion.createNotificacion(usuarioId, tipo, mensaje);
        io.to(`user_${usuarioId}`).emit("receiveNotification", nuevaNotificacion);
        console.log(`Notificación enviada a user_${usuarioId}:`, nuevaNotificacion);
      } catch (error) {
        console.error("Error al guardar la notificación:", error);
      }
    });

    // Desconectar al usuario
    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.IO no está inicializado.");
  }
  return io;
};

export default configureSocket;
