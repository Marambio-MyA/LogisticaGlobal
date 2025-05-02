const pool = require('../config/db');

// Crear incidente_robot
const createIncidentRobot = async (req, res) => {
  const {
    incidente_id,
    robot_id,
    estado_final_robot,
    trabajo_realizado,
    reportado_por
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO incidente_robot 
      (incidente_id, robot_id, estado_final_robot, trabajo_realizado, reportado_por)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [incidente_id, robot_id, estado_final_robot, trabajo_realizado, reportado_por]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los registros
const getIncidentRobot = async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidente_robot');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener incidentes_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener uno por ID
const getIncidentRobotById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM incidente_robot WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar registro
const updateIncidetRobot = async (req, res) => {
  const { id } = req.params;
  const {
    incidente_id,
    robot_id,
    estado_final_robot,
    trabajo_realizado,
    reportado_por
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE incidente_robot SET
        incidente_id = $1,
        robot_id = $2,
        estado_final_robot = $3,
        trabajo_realizado = $4,
        reportado_por = $5
      WHERE id = $6
      RETURNING *`,
      [incidente_id, robot_id, estado_final_robot, trabajo_realizado, reportado_por, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar registro
const deleteIncidentRobot = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM incidente_robot WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.status(200).json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
    createIncidentRobot,
    getIncidentRobot,
    getIncidentRobotById,
    updateIncidetRobot,
    deleteIncidentRobot
};
