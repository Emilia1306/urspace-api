import express from 'express';
import TerrenoController from '../controllers/terrenoController';
import upload from '../config/multerConfig';


const router = express.Router();

router.get('/terrenos', TerrenoController.getAll); 
router.get('/terrenos/publicados', TerrenoController.getTerrenosPublicados); 
router.get('/terrenos/no-publicados', TerrenoController.getTerrenosNoPublicados);
//router.get('/terrenos/etiquetas', (req, res) => TerrenoController.getByEtiquetas(req, res));

router.get('/terrenos/:id', TerrenoController.getById); 
//router.get('/terrenos/:id/imagenes', TerrenoController.getImagenesByTerrenoId);
//router.get('/terrenos/:id/ubicacion', TerrenoController.getUbicacionByTerrenoId);

router.get('/terrenos/tipo/:tipo', TerrenoController.getByTipo); 
router.get('/terrenos/usuario/:usuario_id', TerrenoController.getByUsuarioId); 
router.get('/terrenos/ubicacion/:ubicacion', TerrenoController.getByUbicacion); 

router.post('/terrenos', upload.array('imagenes', 10), TerrenoController.create); 
router.patch('/terrenos/:id/deshabilitar', TerrenoController.deshabilitar);
router.patch('/terrenos/:id', TerrenoController.update); 
router.delete('/terrenos/:id', TerrenoController.delete); 

router.get('/test', (req, res) => {
    console.log('Entrando en el endpoint de prueba');
    res.status(200).json({ message: 'Endpoint de prueba funcionando' });
  });
  


export default router;
