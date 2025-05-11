import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { sequelize, syncDatabase } from './config/database.js';
import Incident from './models/incident.model.js';
import Robot from './models/robot.model.js';
import RobotIncident from './models/robot_incident.model.js';
import User from './models/user.model.js';

import robotRoutes from './routes/robotRoutes.js';
import userRoutes from './routes/userRoutes.js';
import incidenteRoutes from './routes/incidenteRoutes.js';
import incidenteRobotRoutes from './routes/incidenteRobotRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api', robotRoutes);
app.use('/api', userRoutes);
app.use('/api', incidenteRoutes);
app.use('/api', incidenteRobotRoutes);
app.use('/api/auth', authRoutes);

// Función para verificar y crear la base de datos si no existe usando pool
async function ensureDatabaseExists() {
  try {
    const res = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = :dbname`,
      {
        replacements: { dbname: process.env.DB_NAME },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (res.rowCount === 0) {
      console.log(`Creando base de datos "${process.env.DB_NAME}"...`);
      await sequelize.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    } else {
      console.log(`La base de datos "${process.env.DB_NAME}" ya existe.`);
    }
  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
    throw error;
  }
}

// Inicializa base de datos y lanza servidor
async function startServer() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos');

    await syncDatabase(); // Sincroniza los modelos usando sequelize
    console.log('✅ Modelos sincronizados correctamente');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en funcionamiento en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

startServer();
