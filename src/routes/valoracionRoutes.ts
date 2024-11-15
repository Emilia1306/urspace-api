import express, { RequestHandler } from "express";
import ValoracionController from "../controllers/valoracionController";

const router = express.Router();

router.get(
  "/valoraciones/terreno/:terreno_id",
  ValoracionController.getValoracionesByTerrenoId
);

router.get(
  "/valoraciones/terreno/:terreno_id/calificacion/:calificacion",
  ValoracionController.getValoracionesByTerrenoIdAndCalificacion
);

router.get(
  "/valoraciones/terreno/:terreno_id/promedio",
  (req: express.Request, res: express.Response) => {
    ValoracionController.getPromedioCalificacion(req, res);
  }
);

router.post("/valoraciones", ValoracionController.createValoracion as RequestHandler);


export default router;
