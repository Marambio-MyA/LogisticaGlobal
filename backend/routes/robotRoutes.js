import express from 'express';
const router = express.Router();

import {
    createRobot,
    getRobots,
    getRobotById,
    updateRobot,
    deleteRobot
} from '../controllers/robotController.js';

// Rutas CRUD para robots
router.post('/robots', createRobot);        // Crear un nuevo robot
router.get('/robots', getRobots);      // Obtener todos los robots
router.get('/robots/:id', getRobotById); // Obtener un robot por su ID
router.put('/robots/:id', updateRobot);   // Actualizar un robot
router.delete('/robots/:id', deleteRobot); // Eliminar un robot

export default router;
