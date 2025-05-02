const pool = require('../config/db');

// Función para crear un nuevo robot
const createRobot = async (req, res) => {
  const { identificador, modelo, estado_actual, ubicacion_actual } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO robots (identificador, modelo, estado_actual, ubicacion_actual) VALUES ($1, $2, $3, $4) RETURNING *',
      [identificador, modelo, estado_actual, ubicacion_actual]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para obtener todos los robots
const getRobots = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM robots');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los robots:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para obtener un robot por ID
const getRobotById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM robots WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para actualizar un robot
const updateRobot = async (req, res) => {
  const { id } = req.params;
  const { identificador, modelo, estado_actual, ubicacion_actual } = req.body;
  try {
    const result = await pool.query(
      'UPDATE robots SET identificador = $1, modelo = $2, estado_actual = $3, ubicacion_actual = $4 WHERE id = $5 RETURNING *',
      [identificador, modelo, estado_actual, ubicacion_actual, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para eliminar un robot
const deleteRobot = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM robots WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.status(200).json({ message: 'Robot eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
    createRobot,
    getRobots,
    getRobotById,
    updateRobot,
    deleteRobot
};
