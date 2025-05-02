import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        ssl: false,
        // dialectOptions: {
        //     ssl: {
        //         require: true,
        //         rejectUnauthorized: false 
        //     }
        // }
    }
);

export const syncDatabase = async () => {
    try {
        // force: false to avoid dropping tables
        // alter: true to make changes to tables if models change
        await sequelize.sync({ force: false, alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};