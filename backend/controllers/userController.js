import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.js';
import User from '../models/user.model.js';
// Function to create a new user
export async function createUser(req, res) {
  const user = req.body;

  try {
    // Validar si el correo ya existe
    const existingUser = await User.findOne({ where: { email: user.email } });
    if (existingUser) return res.status(400).json({ error: 'Correo ya registrado' });

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(user.password, 10);

    // Insertar usuario
    user.password = password_hash;
    const newUser = await User.create(user);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se cambia la contraseña, encriptarla
    let password_hash = user.password;
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(userData.password, salt);
    }

    userData.password = password_hash;
    const usuarioActualizado = await User.update(userData, { where: { id } });
    res.status(200).json(usuarioActualizado);
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await User.destroy({ where: { id } });
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
