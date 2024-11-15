import express from "express";
import ConversacionController from "../controllers/conversacionController";

const router = express.Router();

// Crear una nueva conversación
router.post("/conversaciones", ConversacionController.create);

// Obtener conversaciones de un usuario
router.get(
  "/conversaciones/usuario/:id_usuario",
  ConversacionController.getConversacionesByUsuario
);

//Encontrar o crear conversación
router.post(
  "/conversaciones/find-or-create",
  ConversacionController.findOrCreateConversation
);

// Ruta para obtener una conversación por su ID
router.get("/conversaciones/:id_conversacion", ConversacionController.getConversacionById);

export default router;
