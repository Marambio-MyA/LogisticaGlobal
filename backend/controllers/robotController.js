import { sequelize } from '../config/database.js';
import Robot from '../models/robot.model.js';

// Crear un nuevo robot
export const createRobot = async (req, res) => {
  const robot = req.body;
  try {
    const result = await Robot.create(robot);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error al crear el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los robots
export const getRobots = async (req, res) => {
  try {
    const result = await Robot.findAll();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener los robots:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un robot por ID
export const getRobotById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Robot.findByPk(id);
    if (!result) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al obtener el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar un robot
export const updateRobot = async (req, res) => {
  const { id } = req.params;
  const robot = req.body;
  try {
    const result = await Robot.update(robot, { where: { id } });
    if (!result) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al actualizar el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar un robot
export const deleteRobot = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Robot.destroy({ where: { id } });
    if (!result) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    res.status(200).json({ message: 'Robot eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar el robot:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
