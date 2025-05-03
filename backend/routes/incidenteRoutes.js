import express from 'express';

const router = express.Router();
import {
    createIncident,
    getIncidents,
    getIncidentById,
    updateIncident,
    DeleteIncident,
    getIncidentWithRobots
} from '../controllers/incidenteController.js';

router.post('/incidentes', createIncident);
router.get('/incidentes',     getIncidents,);
router.get('/incidentes/:id', getIncidentById);
router.put('/incidentes/:id', updateIncident);
router.delete('/incidentes/:id', DeleteIncident);
router.get('/incidentes/:id/robots', getIncidentWithRobots);

export default router;
