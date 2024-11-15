import express, { RequestHandler } from "express";
import ReservaController from "../controllers/reservaController";

const router = express.Router();

// Crear una nueva reserva
router.post("/reservas", ReservaController.create as RequestHandler);

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

// Obtener solo fechas reservadas por propiedad específica
router.get("/reservas/propiedad/:id_terreno/fechas-reservadas", ReservaController.getFechasReservadasByPropiedad);


// Cambiar el estado de la reserva
router.patch("/reservas/:id_reservacion", ReservaController.updateEstado);

// Ver historial de reservas de un usuario específico
router.get(
  "/reservas/historial/:id_usuario",
  ReservaController.getHistorialByUsuario
);

router.patch("/reservas/cancelar/:id_reservacion", ReservaController.cancelarReserva as RequestHandler);


export default router;
