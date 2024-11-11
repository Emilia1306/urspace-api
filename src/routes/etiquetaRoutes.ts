import express from 'express';
import { getEtiquetas } from '../controllers/etiquetaController';

const router = express.Router();

router.get('/etiquetas', getEtiquetas);

export default router;
