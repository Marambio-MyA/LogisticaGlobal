
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');


// Function to create a new user
async function createUser(req, res) {
  const { nombre, email, password, rol } = req.body;

  try {
    // Validar si el correo ya existe
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Correo ya registrado' });
    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await userModel.insertUser(nombre, email, password_hash, rol);
    // Insertar usuario
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const usuarios = await userModel.getAllUsers();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await userModel.getUserById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;

  try {
    const usuario = await userModel.getUserById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se cambia la contraseña, encriptarla
    let password_hash = usuario.password_hash;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    // Actualizar usuario en la base de datos
    const usuarioActualizado = await userModel.updateUser(id, nombre, email, password_hash, rol);
    res.status(200).json(usuarioActualizado);
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;  // Debería estar en req.params si la ruta es correcta

  try {
    const usuario = await userModel.getUserById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar usuario
    await userModel.deleteUser(id);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
