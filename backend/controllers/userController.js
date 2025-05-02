
const bcrypt = require('bcrypt');
const pool = require('../config/db');


// Function to create a new user
async function createUser(req, res) {
  const { nombre, email, password, rol } = req.body;

  try {
    // Validar si el correo ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) return res.status(400).json({ error: 'Correo ya registrado' });
    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, email, password_hash, rol]
    );
    // Insertar usuario
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT * FROM users');
    res.status(200).json(usuarios.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const usuario = result.rows[0];
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
    const usuario = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!usuario.rows[0]) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se cambia la contraseña, encriptarla
    let password_hash = usuario.password_hash;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    // Actualizar usuario en la base de datos
    const updateQuery = `
      UPDATE users
      SET nombre = $1, email = $2, password_hash = $3, rol = $4
      WHERE id = $5
      RETURNING *`;
    const values = [nombre, email, password_hash, rol, id];
    const usuarioActualizado = await pool.query(updateQuery, values);
    res.status(200).json(usuarioActualizado.rows[0]);
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;  // Debería estar en req.params si la ruta es correcta

  try {
    const usuario = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!usuario.rows[0]) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar usuario
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
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
