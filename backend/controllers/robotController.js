import { pool } from '../config/database.js';

// Crear un nuevo robot
export const createRobot = async (req, res) => {
  const { modelo, estado_actual, ubicacion_actual } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO robots (modelo, estado_actual, ubicacion_actual) VALUES ($1, $2, $3) RETURNING *',
      [modelo, estado_actual, ubicacion_actual]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los robots
export const getRobots = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM robots');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los robots:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un robot por ID
export const getRobotById = async (req, res) => {
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

// Actualizar un robot
export const updateRobot = async (req, res) => {
  const { id } = req.params;
  const { modelo, estado_actual, ubicacion_actual } = req.body;
  try {
    const result = await pool.query(
      'UPDATE robots SET modelo = $1, estado_actual = $2, ubicacion_actual = $3 WHERE id = $4 RETURNING *',
      [modelo, estado_actual, ubicacion_actual, id]
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

// Eliminar un robot
export const deleteRobot = async (req, res) => {
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
