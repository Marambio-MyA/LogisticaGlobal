import express from "express";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getIncidentWithRobots,
} from "../controllers/incidenteController.js";

router.use(authMiddleware);

router.post("/incidentes", createIncident);
router.get("/incidentes", getIncidents);
router.get("/incidentes/:id", getIncidentById);
router.put("/incidentes/:id", updateIncident);
router.delete("/incidentes/:id", deleteIncident);
router.get("/incidentes/:id/robots", getIncidentWithRobots);

export default router;
