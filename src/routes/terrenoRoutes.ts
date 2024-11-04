import express from 'express';
import TerrenoController from '../controllers/terrenoController';
import upload from '../config/multerConfig';


const router = express.Router();

router.get('/terrenos', TerrenoController.getAll); // Obtener todos los terrenos
router.get('/terrenos/:id', TerrenoController.getById); // Obtener terreno por ID
router.get('/terrenos/tipo/:tipo', TerrenoController.getByTipo); // Obtener terrenos por tipo
router.get('/terrenos/usuario/:usuario_id', TerrenoController.getByUsuarioId); // Obtener terrenos por ID de usuario
router.get('/terrenos/ubicacion/:ubicacion', TerrenoController.getByUbicacion); // Obtener terrenos por ubicación
router.post('/terrenos', upload.array('imagenes', 10), TerrenoController.create); // Permitimos hasta 10 imágenes
router.patch('/terrenos/:id', TerrenoController.update); // Actualizar terreno
router.delete('/terrenos/:id', TerrenoController.delete); // Eliminar terreno

export default router;
