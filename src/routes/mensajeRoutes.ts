import express from 'express';
import MensajeController from '../controllers/mensajeController';

const router = express.Router();

// Crear un nuevo mensaje
router.post('/mensajes', MensajeController.create);

// Ver mensajes de una conversación
router.get('/mensajes/conversacion/:id_conversacion', MensajeController.getMensajesByConversacion);

export default router;
