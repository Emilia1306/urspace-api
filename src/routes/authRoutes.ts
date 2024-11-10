import express, { RequestHandler } from 'express';
import { login, register } from '../controllers/authController';
import { getUserInfo } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', authenticateToken as RequestHandler, getUserInfo as RequestHandler);
// Ruta para iniciar sesión
router.post('/login', login as RequestHandler);

// Ruta para registrar un nuevo usuario
router.post('/register', register as RequestHandler);



export default router;
