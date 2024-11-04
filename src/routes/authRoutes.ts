import express, { RequestHandler } from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register as RequestHandler);

// Ruta para iniciar sesión
router.post('/login', login as RequestHandler);

export default router;
