const pool = require('../config/db');

// Crear un nuevo incidente
const createIncident = async (req, res) => {
    const {
      codigo, fecha, hora, ubicacion, tipo_preliminar,
      descripcion, estado, firma_digital,
      firmado_por_id, created_by_id
    } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO incidentes 
          (codigo, fecha, hora, ubicacion, tipo_preliminar, descripcion, estado, firma_digital, firmado_por_id, created_by_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [codigo, fecha, hora, ubicacion, tipo_preliminar, descripcion, estado, firma_digital, firmado_por_id, created_by_id]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear incidente:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };

// Obtener todos los incidentes
const getIncidents = async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidentes');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener incidentes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener incidente por ID
const getIncidentById = async (req, res) => {
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
const updateIncident = async (req, res) => {
    const { id } = req.params;
    const {
      codigo, fecha, hora, ubicacion, tipo_preliminar,
      descripcion, estado, firma_digital,
      firmado_por_id, created_by_id
    } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE incidentes SET
          codigo = $1,
          fecha = $2,
          hora = $3,
          ubicacion = $4,
          tipo_preliminar = $5,
          descripcion = $6,
          estado = $7,
          firma_digital = $8,
          firmado_por_id = $9,
          created_by_id = $10
         WHERE id = $11
         RETURNING *`,
        [codigo, fecha, hora, ubicacion, tipo_preliminar, descripcion, estado, firma_digital, firmado_por_id, created_by_id, id]
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
const DeleteIncident = async (req, res) => {
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
const getIncidentWithRobots = async (req, res) => {
    const { id } = req.params;
  
    try {
      // 1. Obtener los datos del incidente
      const incidenteResult = await pool.query('SELECT * FROM incidentes WHERE id = $1', [id]);
      if (incidenteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }
  
      const datosIncidente = incidenteResult.rows[0];
  
      // 2. Obtener los robots involucrados con JOIN a incidente_robot y robots
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




module.exports = {
    createIncident,
    getIncidents,
    getIncidentById,
    updateIncident,
    DeleteIncident,
    getIncidentWithRobots
};
