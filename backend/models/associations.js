import Incident from './incident.model.js';
import Robot from './robot.model.js';
import RobotIncident from './robot_incident.model.js';
import User from './user.model.js';

// Incidente creado por un usuario
Incident.belongsTo(User, { foreignKey: 'creado_por', as: 'creador' });
User.hasMany(Incident, { foreignKey: 'creado_por', as: 'incidentesCreados' });

// Relación N:M entre Incident y Robot a través de RobotIncident
Incident.belongsToMany(Robot, {
  through: RobotIncident,
  foreignKey: 'incidente_id',
  otherKey: 'robot_id',
  as: 'robots'
});

Robot.belongsToMany(Incident, {
  through: RobotIncident,
  foreignKey: 'robot_id',
  otherKey: 'incidente_id',
  as: 'incidentes'
});

// Para acceder directamente a detalles desde RobotIncident
RobotIncident.belongsTo(Incident, { foreignKey: 'incidente_id', as: 'incidente' });
RobotIncident.belongsTo(Robot, { foreignKey: 'robot_id', as: 'robot' });
RobotIncident.belongsTo(User, { foreignKey: 'reportado_por', as: 'reportadoPor' });

Incident.hasMany(RobotIncident, { foreignKey: 'incidente_id', as: 'asignacionesRobot' });
Robot.hasMany(RobotIncident, { foreignKey: 'robot_id', as: 'asignacionesIncidente' });
