import { pool } from '../config/database.js';

// Crear un nuevo incidente
export const createIncident = async (req, res) => {
    const {
      codigo, fecha, hora, ubicacion, tipo_incidente,
      descripcion, estado, creado_por
    } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO incidentes 
          (codigo, fecha, hora, ubicacion, tipo_incidente, descripcion, estado, creado_por) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [codigo, fecha, hora, ubicacion, tipo_incidente, descripcion, estado, creado_por]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear incidente:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener todos los incidentes
export const getIncidents = async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidentes');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener incidentes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener incidente por ID
export const getIncidentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM incidentes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener incidente:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar incidente
export const updateIncident = async (req, res) => {
    const { id } = req.params;
    const {
      codigo, fecha, hora, ubicacion, tipo_incidente,
      descripcion, estado, creado_por
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE incidentes SET
          codigo = $1,
          fecha = $2,
          hora = $3,
          ubicacion = $4,
          tipo_incidente = $5,
          descripcion = $6,
          estado = $7,
          creado_por = $8
         WHERE id = $9
         RETURNING *`,
        [codigo, fecha, hora, ubicacion, tipo_incidente, descripcion, estado, creado_por, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Error al actualizar incidente:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Eliminar incidente
export const DeleteIncident = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM incidentes WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }
    res.status(200).json({ message: 'Incidente eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar incidente:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener información de un incidente y los robots asociados
export const getIncidentWithRobots = async (req, res) => {
    const { id } = req.params;

    try {
      // Obtener los datos del incidente
      const incidenteResult = await pool.query('SELECT * FROM incidentes WHERE id = $1', [id]);
      if (incidenteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }

      const datosIncidente = incidenteResult.rows[0];

      // Obtener los robots involucrados con JOIN a incidente_robot y robots
      const robotsResult = await pool.query(
        `SELECT     r.id, r.identificador, r.modelo, ir.estado_final_robot, ir.trabajo_realizado
         FROM       incidente_robot ir
         JOIN       robots r ON ir.robot_id = r.id
         WHERE      ir.incidente_id = $1`,
        [id]
      );

      res.status(200).json({
        datos_incidente: datosIncidente,
        robots: robotsResult.rows
      });

    } catch (err) {
      console.error('Error al obtener incidente con robots:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};
