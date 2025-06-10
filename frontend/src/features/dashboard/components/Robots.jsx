import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axiosInstance from '../../../api/axiosInstance';

import FormCreateRobot from './FormCreateRobot';
import FormEditRobot from './FormEditRobot';

// Mapeo de estados a etiquetas visuales
const ESTADOS = {
  operativo: 'Operativo',
  en_reparacion: 'En reparación',
  fuera_servicio: 'Fuera de servicio'
};

const estadoColor = {
  operativo: 'success',
  en_reparacion: 'warning',
  fuera_servicio: 'error'
};

const Robots = () => {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Estados para controlar diálogos
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRobotId, setSelectedRobotId] = useState(null);

  const fetchRobots = async () => {
    try {
      const res = await axiosInstance.get('/robots');
      setRobots(res.data);
    } catch (error) {
      console.error('Error al obtener los robots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/robots/${id}`);
      fetchRobots();
    } catch (error) {
      console.error('Error al eliminar el robot:', error);
    }
  };

  // Crear
  const handleCreateOpen = () => setOpenCreate(true);
  const handleCreateClose = () => setOpenCreate(false);
  const handleCreateSubmit = () => {
    setOpenCreate(false);
    fetchRobots();
  };

  // Editar
  const handleEditOpen = (robotId) => {
    setSelectedRobotId(robotId);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setSelectedRobotId(null);
    setOpenEdit(false);
  };
  const handleEditSubmit = () => {
    setOpenEdit(false);
    setSelectedRobotId(null);
    fetchRobots();
  };

  const filteredRobots = robots.filter((robot) =>
    robot.modelo?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Typography>Cargando robots...</Typography>;
  }

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Gestión de Robots</Typography>
        <Button variant="contained" onClick={handleCreateOpen}>Crear Robot</Button>
      </Box>

      <TextField
        label="Buscar por modelo"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Estado Actual</TableCell>
              <TableCell>Ubicación Actual</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRobots.map((robot) => (
              <TableRow key={robot.id}>
                <TableCell>{robot.id}</TableCell>
                <TableCell>{robot.modelo}</TableCell>
                <TableCell>
                  <Chip
                    label={ESTADOS[robot.estado_actual] || 'Desconocido'}
                    color={estadoColor[robot.estado_actual] || 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{robot.ubicacion_actual}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditOpen(robot.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(robot.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRobots.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center">No se encontraron robots.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear robot */}
      <Dialog open={openCreate} onClose={handleCreateClose} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Robot</DialogTitle>
        <DialogContent>
          <FormCreateRobot onSubmit={handleCreateSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar robot */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Robot</DialogTitle>
        <DialogContent>
          {selectedRobotId && (
            <FormEditRobot robotId={selectedRobotId} onSubmit={handleEditSubmit} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Robots;
