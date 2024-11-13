import express from "express";
import ConversacionController from "../controllers/conversacionController";

const router = express.Router();

// Crear una nueva conversación
router.post("/conversaciones", ConversacionController.create);

// Obtener conversaciones de un usuario
router.get("/conversaciones/usuario/:id_usuario", ConversacionController.getConversacionesByUsuario);

export default router;
