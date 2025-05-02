const express = require('express');
const router = express.Router();
const {
    createRobot,
    getRobots,
    getRobotById,
    updateRobot,
    deleteRobot
} = require('../controllers/robotController');

// Rutas CRUD para robots
router.post('/robots', createRobot);        // Crear un nuevo robot
router.get('/robots', getRobots);      // Obtener todos los robots
router.get('/robots/:id', getRobotById); // Obtener un robot por su ID
router.put('/robots/:id', updateRobot);   // Actualizar un robot
router.delete('/robots/:id', deleteRobot); // Eliminar un robot

module.exports = router;
