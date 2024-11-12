import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { Server } from 'socket.io';
import { authenticateToken } from './middlewares/authMiddleware';


import authRoutes from "./routes/authRoutes";
import terrenoRoutes from "./routes/terrenoRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import notificacionRoutes from "./routes/notificacionRoutes";
import conversacionRoutes from "./routes/conversacionRoutes";
import mensajeRoutes from "./routes/mensajeRoutes";
import valoracionRoutes from "./routes/valoracionRoutes";
import etiquetaRoutes from "./routes/etiquetaRoutes";
import ofertaRoutes from "./routes/ofertaRoutes";

import cron from "node-cron";
import Reserva from "./models/Reserva";
import configureSocket from "./config/socket";

// Programa el cron job para ejecutar a medianoche cada día
cron.schedule("*/15 * * * *", async () => {
  console.log(
    "Ejecutando actualización de estados de reservas cada 15 minutos..."
  );
  await Reserva.actualizarEstadosDeReservas();
});

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:5173", //(PORT:5173)
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", terrenoRoutes);
app.use("/api", reservaRoutes);
app.use("/api", notificacionRoutes);
app.use("/api", conversacionRoutes);
app.use("/api", mensajeRoutes);
app.use("/api", valoracionRoutes);
app.use("/api", etiquetaRoutes);
app.use("/api", ofertaRoutes);

// Crear el servidor HTTP y configurar Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // URL del frontend
    methods: ['GET', 'POST'],
  },
});

// Configuración de Socket.IO

io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id);

  // Escuchar el identificador del usuario cuando se conecta
  socket.on('registerUser', (userId) => {
    socket.data.userId = userId;
    console.log(`Usuario registrado en socket: ${userId}`);
  });

  socket.on('joinRoom', (conversacionId) => {
    if (!conversacionId) {
      console.error('ID de conversación inválido');
      return;
    }
    socket.join(conversacionId);
  });
  
  socket.on('enviarMensaje', (mensajeData) => {
    if (!mensajeData.conversacionId || !mensajeData.mensaje) {
      console.error('Datos de mensaje incompletos');
      return;
    }
    io.to(mensajeData.conversacionId).emit('recibirMensaje', mensajeData);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado', socket.id);
  });
});

// Iniciar el servidor
server.listen(3000, () => console.log("Server running on port 3000"));

app.use((req, res, next) => {
  console.log(`Método: ${req.method}, Ruta: ${req.path}`);
  next();
});
