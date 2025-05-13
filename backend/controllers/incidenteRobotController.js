import { sequelize } from '../config/database.js';
import RobotIncident from '../models/robot_incident.model.js';

// Crear incidente_robot
export const createIncidentRobot = async (req, res) => {
  const robot_incident = req.body;

  try {
    const result = await RobotIncident.create(robot_incident);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error al crear incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los registros
export const getIncidentRobot = async (_req, res) => {
  try {
    const result = await RobotIncident.findAll();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener incidentes_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener uno por ID
export const getIncidentRobotById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await RobotIncident.findByPk(id);
    if (!result) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar registro
export const updateIncidetRobot = async (req, res) => {
  const { id } = req.params;
  const robot_incident = req.body;

  try {
    const robot = await RobotIncident.findByPk(robot_incident.robot_id);
    const result = await RobotIncident.update(robot_incident, { where: { id } });
    if (!result) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Error al actualizar incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar registro
export const deleteIncidentRobot = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await RobotIncident.destroy({ where: { id } });
    if (!result) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.status(200).json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar incidente_robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
