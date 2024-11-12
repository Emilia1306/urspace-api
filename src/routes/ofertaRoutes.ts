import express from "express";
import OfertaController from "../controllers/ofertaController";

const router = express.Router();

// Crear una nueva oferta
router.post("/ofertas", OfertaController.create);

// Eliminar una oferta por ID
router.delete("/ofertas/:id_oferta", OfertaController.delete);

// Ver ofertas de todos los terrenos en los que el usuario es dueño
router.get("/ofertas/usuario/:id_usuario", OfertaController.getOfertasByPropietario);

export default router;
