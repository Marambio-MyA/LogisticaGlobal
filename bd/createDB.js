import dotenv from 'dotenv';
import { Client } from 'pg';
import { sequelize } from './config/database.js';

import Incident from './models/incident.model.js';
import Robot from './models/robot.model.js';
import RobotIncident from './models/robot_incident.model.js';
import User from './models/user.model.js';

dotenv.config();

// 1. Verifica si existe la base de datos, y si no, la crea
async function ensureDatabaseExists() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres', // base temporal para verificar
  });

  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [process.env.DB_NAME]
  );

  if (res.rowCount === 0) {
    console.log(`Creando base de datos "${process.env.DB_NAME}"...`);
    await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
  } else {
    console.log(`La base de datos "${process.env.DB_NAME}" ya existe.`);
  }

  await client.end();
}

// 2. Ejecuta el proceso completo
async function setup() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos');

    // Importación de modelos ya fuerza su registro en Sequelize
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error durante el setup:', error);
    process.exit(1);
  }
}

setup();
