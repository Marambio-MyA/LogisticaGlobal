// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Rutas para los usuarios
router.post('/usuarios', createUser);             // Crear usuario
router.get('/usuarios', getUsers);          // Obtener todos los usuarios
router.get('/usuarios/:id', getUserById);  // Obtener usuario por id
router.put('/usuarios/:id', updateUser);    // Actualizar usuario
router.delete('/usuarios/:id', deleteUser);   // Eliminar usuario

module.exports = router;
