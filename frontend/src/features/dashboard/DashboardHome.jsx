import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import capitalizeFirst from '../utils/utils';

import RobotStatusPieChart from './components/RobotStatusPieChart';
import IncidentesBarChart from './components/IncidentesBarChart';
import Robots from './components/Robots'; // CRUD de robots

import { useSelector } from 'react-redux';
import { generarReportePDF } from './components/ReportePDFIncidentes';

// Mapa de colores por estado
const colorByEstado = {
  operativo: '#4CAF50',
  en_reparacion: '#FFC107',
  fuera_servicio: '#F44336',
  creado: '#2196F3',
  en_investigacion: '#FF9800',
  resuelto: '#9C27B0'
};

const DashboardHome = () => {
  const [robots, setRobots] = useState([]);
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const fetchData = async () => {
    try {
      const [robotsRes, incidentesRes] = await Promise.all([
        axiosInstance.get('/robots'),
        axiosInstance.get('/incidentes')
      ]);
      setRobots(robotsRes.data);
      setIncidentes(incidentesRes.data);
    } catch (error) {
      console.error('Error al obtener los datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Datos robots
  const robotStatusData = Object.entries(
    robots.reduce((acc, robot) => {
      if (acc[robot.estado_actual] !== undefined) {
        acc[robot.estado_actual]++;
      }
      return acc;
    }, {
      operativo: 0,
      en_reparacion: 0,
      fuera_servicio: 0
    })
  ).map(([name, value]) => ({
    name: capitalizeFirst(name, true),
    value,
    raw: name
  }));

  // Datos incidentes (con porcentaje)
  const totalIncidentes = incidentes.length;
  const incidentesPorEstado = Object.entries(
    incidentes.reduce((acc, inc) => {
      acc[inc.estado] = (acc[inc.estado] || 0) + 1;
      return acc;
    }, {
      creado: 0,
      en_investigacion: 0,
      resuelto: 0
    })
  ).map(([estado, count]) => ({
    estado: capitalizeFirst(estado, true),
    count,
    percent: totalIncidentes > 0 ? (count / totalIncidentes) * 100 : 0,
    raw: estado
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Panel de Control
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => generarReportePDF(incidentes, user)}
        >
          Generar Reporte
        </Button>
      </Box>

      <Paper sx={{ display: 'flex', justifyContent: 'space-around', p: 2, gap: 4, padding: 5 }}>
        <RobotStatusPieChart data={robotStatusData} colors={colorByEstado} />
        <IncidentesBarChart data={incidentesPorEstado} colors={colorByEstado} />
      </Paper>

      <Box mt={4}>
        <Robots />
      </Box>
    </Box>
  );
};

export default DashboardHome;
