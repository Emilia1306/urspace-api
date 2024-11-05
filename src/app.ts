import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import terrenoRoutes from "./routes/terrenoRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import notificacionRoutes from "./routes/notificacionRoutes";
import conversacionRoutes from "./routes/conversacionRoutes";
import mensajeRoutes from "./routes/mensajeRoutes";

import configureSocket from "./config/socket";

const app = express();
const prisma = new PrismaClient();

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

// Crear el servidor HTTP y configurar Socket.IO
const server = http.createServer(app);
const io = configureSocket(server); // Configuración de Socket.IO

// Iniciar el servidor
server.listen(3000, () => console.log("Server running on port 3000"));
