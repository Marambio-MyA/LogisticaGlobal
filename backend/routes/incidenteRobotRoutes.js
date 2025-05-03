import express from 'express';

const router = express.Router();
import {
    createIncidentRobot,
    getIncidentRobot,
    getIncidentRobotById,
    updateIncidetRobot,
    deleteIncidentRobot
} from '../controllers/incidenteRobotController.js';

router.post('/incidente-robot', createIncidentRobot);
router.get('/incidente-robot', getIncidentRobot);
router.get('/incidente-robot/:id', getIncidentRobotById);
router.put('/incidente-robot/:id', updateIncidetRobot);
router.delete('/incidente-robot/:id', deleteIncidentRobot);

export default router;