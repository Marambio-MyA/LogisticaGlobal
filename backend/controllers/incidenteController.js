import { sequelize } from '../config/database.js';
import Incident from '../models/incident.model.js';
import RobotIncident from '../models/robot_incident.model.js';
import "../models/associations.js"; // Asegúrate de que las asociaciones estén definidas antes de usar los modelos


// Crear un nuevo incidente
export const createIncident = async (req, res) => {
  console.log(req.body);
    const incident = req.body;

    try {
      const result = await Incident.create(incident); 

      res.status(201).json(result);
    } catch (err) {
      console.error('Error al crear incidente:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};


// Obtener todos los incidentes
export const getIncidents = async (_req, res) => {
  try {
    const result = await Incident.findAll(); // Cambiado a findAll() para obtener todos los incidentes  
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener incidentes:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener incidente por ID
export const getIncidentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Incident.findByPk(id); // Cambiado a findByPk() para obtener un incidente por ID
    if (!result) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener incidente:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar incidente
export const updateIncident = async (req, res) => {
    const { id } = req.params;
    const incident = req.body;

    try {
      const result = await Incident.update(incident, { where: { id } });
      if (!result) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }

      res.status(200).json(result);
    } catch (err) {
      console.error('Error al actualizar incidente:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Eliminar incidente
export const DeleteIncident = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Incident.destroy({ where: { id } });
    if (!result) {
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
      const incidenteResult = await Incident.findByPk(id);
      if (!incidenteResult) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }


      const incidente = await Incident.findByPk(incidenteResult.id);
      const robots = await incidente.getRobots(); // Sequelize genera este getter automáticamente


      res.status(200).json({
        datos_incidente: incidente,
        robots: robots
      });

    } catch (err) {
      console.error('Error al obtener incidente con robots:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};
