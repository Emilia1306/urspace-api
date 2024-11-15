import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
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

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Define your routes
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

// Set up cron job for reservations
cron.schedule("*/1 * * * *", async () => {
  console.log("Ejecutando actualización de estados de reservas cada 15 minutos...");
  await Reserva.actualizarEstadosDeReservas();
});

// Create the HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = configureSocket(server);  // Use configureSocket to set up Socket.IO

// Start the server
server.listen(3000, () => console.log("Server running on port 3000"));

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Método: ${req.method}, Ruta: ${req.path}`);
  next();
});
