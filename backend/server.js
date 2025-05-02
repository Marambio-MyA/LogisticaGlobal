const express = require('express');
const app = express();
const cors = require('cors');
const robotRoutes = require('./routes/robotRoutes');
const userRoutes = require('./routes/userRoutes');  // Si ya tienes rutas de usuario
const incidenteRoutes = require('./routes/incidenteRoutes'); // Si ya tienes rutas de incidente
const incidenteRobotRoutes = require('./routes/incidenteRobotRoutes'); // Si ya tienes rutas de incidente robot

// Middlewares
app.use(cors());
app.use(express.json());  // Para recibir datos en formato JSON

// Rutas
app.use('/api', robotRoutes);  // Rutas de robots
app.use('/api', userRoutes);   // Rutas de usuarios 
app.use('/api', incidenteRoutes); // Rutas de incidentes
app.use('/api', incidenteRobotRoutes); // Rutas de incidentes robots

app.listen(3000, () => {
  console.log('Servidor en funcionamiento en http://localhost:3000');
});
