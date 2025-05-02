const express = require('express');
const router = express.Router();
const {
    createIncident,
    getIncidents,
    getIncidentById,
    updateIncident,
    DeleteIncident,
    getIncidentWithRobots
} = require('../controllers/incidenteController');

router.post('/incidentes', createIncident);
router.get('/incidentes',     getIncidents,);
router.get('/incidentes/:id', getIncidentById);
router.put('/incidentes/:id', updateIncident);
router.delete('/incidentes/:id', DeleteIncident);
router.get('/incidentes/:id/robots', getIncidentWithRobots);

module.exports = router;
