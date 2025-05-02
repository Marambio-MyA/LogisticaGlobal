const express = require('express');
const router = express.Router();
const {
    createIncidentRobot,
    getIncidentRobot,
    getIncidentRobotById,
    updateIncidetRobot,
    deleteIncidentRobot
} = require('../controllers/incidenteRobotController');

router.post('/incidente-robot', createIncidentRobot);
router.get('/incidente-robot', getIncidentRobot);
router.get('/incidente-robot/:id', getIncidentRobotById);
router.put('/incidente-robot/:id', updateIncidetRobot);
router.delete('/incidente-robot/:id', deleteIncidentRobot);

module.exports = router;