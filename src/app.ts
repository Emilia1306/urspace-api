import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes'; // Importa authRoutes correctamente

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes); // Rutas de autenticación

app.listen(3000, () => console.log('Server running on port 3000'));
