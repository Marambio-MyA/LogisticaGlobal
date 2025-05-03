import express from 'express';
import cors from 'cors';
import robotRoutes from './routes/robotRoutes.js';
import userRoutes from './routes/userRoutes.js';
import incidenteRoutes from './routes/incidenteRoutes.js';
import incidenteRobotRoutes from './routes/incidenteRobotRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', robotRoutes);
app.use('/api', userRoutes);
app.use('/api', incidenteRoutes);
app.use('/api', incidenteRobotRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
