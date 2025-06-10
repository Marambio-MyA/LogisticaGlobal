import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Incidentes from './features/incidentes/Incidentes';
import { Typography } from '@mui/material';
import DashboardHome from './features/dashboard/DashboardHome';

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
