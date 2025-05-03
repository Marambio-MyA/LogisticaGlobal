// routes/userRoutes.js
import express from 'express';

const router = express.Router();
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

// Rutas para los usuarios
router.post('/usuarios', createUser);             // Crear usuario
router.get('/usuarios', getUsers);          // Obtener todos los usuarios
router.get('/usuarios/:id', getUserById);  // Obtener usuario por id
router.put('/usuarios/:id', updateUser);    // Actualizar usuario
router.delete('/usuarios/:id', deleteUser);   // Eliminar usuario

export default router;
