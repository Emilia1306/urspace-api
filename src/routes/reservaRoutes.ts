import express from "express";
import ReservaController from "../controllers/reservaController";

const router = express.Router();

// Crear una nueva reserva
router.post("/reservas", ReservaController.create);

// Ver reservas de las propiedades de un solo usuario
router.get(
  "/reservas/usuario/:id_usuario",
  ReservaController.getReservasByUsuario
);

// Ver reservas por propiedad específica
router.get(
  "/reservas/propiedad/:id_terreno",
  ReservaController.getReservasByPropiedad
);

// Cambiar el estado de la reserva
router.patch("/reservas/:id_reservacion", ReservaController.updateEstado);

// Ver historial de reservas de un usuario específico
router.get(
  "/reservas/historial/:id_usuario",
  ReservaController.getHistorialByUsuario
);

export default router;
