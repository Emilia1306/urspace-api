import express, { RequestHandler } from 'express';
import { login } from '../controllers/authController';

const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', login as RequestHandler);

export default router;
