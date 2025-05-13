import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Configuración de Sequelize
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        ssl: false
    }
);

export const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false, alter: true });
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};
