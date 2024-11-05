import express from 'express';
import NotificacionController from '../controllers/notificacionController';

const router = express.Router();

// Crear notificación
router.post('/notificaciones', NotificacionController.create);

// Ver todas las notificaciones de un usuario
router.get('/notificaciones/usuario/:id_usuario', NotificacionController.getNotificacionesByUsuario);

// Marcar notificación como leída
router.patch('/notificaciones/:id_notificacion', NotificacionController.markAsRead);

export default router;
