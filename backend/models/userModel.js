
const pool = require('../config/db');

// Funcion para obtener todos los usuarios y verificar si el email ya existe
async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Funcion para insertar un nuevo usuario
async function insertUser(nombre, email, password_hash, rol) {
  const result = await pool.query(
    `INSERT INTO users (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nombre, email, password_hash, rol]
  );
  return result.rows[0];
}

// Obtener todos los usuarios
const getAllUsers = async () => {
  const query = 'SELECT * FROM usuarios';
  const result = await pool.query(query);
  return result.rows;
};

// Obtener un usuario por id
const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0]; // Si no existe el usuario, retorna undefined
};

// Actualizar usuario
const updateUser = async (id, nombre, email, password_hash, rol) => {
  const query = `
    UPDATE users
    SET nombre = $1, email = $2, password_hash = $3, rol = $4
    WHERE id = $5
    RETURNING *`;
  const values = [nombre, email, password_hash, rol, id];
  const result = await pool.query(query, values);
  return result.rows[0]; // Retorna el usuario actualizado
};

// Eliminar usuario
const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1';
  await pool.query(query, [id]);
}



module.exports = {
  findUserByEmail,
  insertUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
