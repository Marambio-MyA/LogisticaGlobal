import express from "express";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();
import {
  createIncidentRobot,
  getIncidentRobot,
  getIncidentRobotById,
  updateIncidentRobot,
  deleteIncidentRobot,
} from "../controllers/incidenteRobotController.js";

router.use(authMiddleware);

router.post("/incidente-robot", createIncidentRobot);
router.get("/incidente-robot", getIncidentRobot);
router.get("/incidente-robot/:id", getIncidentRobotById);
router.put("/incidente-robot/:id", updateIncidentRobot);
router.delete("/incidente-robot/:id", deleteIncidentRobot);

export default router;
