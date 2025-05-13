import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Incidentes from './features/incidentes/Incidentes';
import { Typography } from '@mui/material';

// Componente de inicio del dashboard (ruta index)
const DashboardHome = () => (
  <div>
    <Typography variant="h4">Panel de Control</Typography>
    <Typography>Bienvenido al inicio del dashboard</Typography>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="incidentes" element={<Incidentes />} />
          {/* Puedes agregar más subrutas aquí, como perfil o configuración */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
