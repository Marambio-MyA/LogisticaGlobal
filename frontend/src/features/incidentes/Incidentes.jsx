import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../api/axiosInstance';
import FormCreateIncident from './components/FormCreateIncident';
import FormEditIncident from './components/FormEditIncident';

const Incidentes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('view');

  const fetchIncidentes = async () => {
    try {
      const response = await axiosInstance.get('/incidentes');
      setIncidentes(response.data);
    } catch (error) {
      console.error('Error al obtener incidentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIncidente = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este incidente?');
    if (!confirmar) return;

    try {
      await axiosInstance.delete(`/incidentes/${id}`);
      await fetchIncidentes(); // Actualiza la lista
    } catch (error) {
      console.error('Error al eliminar el incidente:', error);
    }
  };

  useEffect(() => {
    fetchIncidentes();
  }, []);

  const handleOpenDialog = (mode, incidente = null) => {
    setDialogMode(mode);
    setSelected(incidente);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelected(null);
    fetchIncidentes();
  };

  const filtered = incidentes.filter((i) =>
    i.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Incidentes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create', {
            codigo: '',
            fecha: '',
            hora: '',
            ubicacion: '',
            tipo_incidente: '',
            descripcion: '',
            estado: '',
            creado_por: '',
          })}
        >
          Nuevo Incidente
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Buscar por código"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.codigo}</TableCell>
                  <TableCell>{new Date(i.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{i.ubicacion}</TableCell>
                  <TableCell>{i.tipo_incidente}</TableCell>
                  <TableCell>{i.estado}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenDialog('view', i)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog('edit', { ...i })}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteIncidente(i.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron incidentes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {dialogMode === 'view'
            ? 'Detalle del Incidente'
            : dialogMode === 'edit'
            ? 'Editar Incidente'
            : 'Nuevo Incidente'}
        </DialogTitle>

        <DialogContent>
          {dialogMode === 'create' ? (
            <FormCreateIncident onSubmit={handleCloseDialog} />
          ) : dialogMode === 'edit' ? (
            <FormEditIncident
              open={dialogOpen}
              onClose={handleCloseDialog}
              incidente={selected}
            />
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Código"
                value={selected?.codigo || ''}
                onChange={(e) => setSelected({ ...selected, codigo: e.target.value })}
                InputProps={{ readOnly: dialogMode === 'view' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fecha"
                type="date"
                value={selected?.fecha?.split('T')[0] || ''}
                onChange={(e) => setSelected({ ...selected, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: dialogMode === 'view' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hora"
                type="time"
                value={selected?.hora || ''}
                onChange={(e) => setSelected({ ...selected, hora: e.target.value })}
                InputProps={{ readOnly: dialogMode === 'view' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Ubicación"
                value={selected?.ubicacion || ''}
                onChange={(e) => setSelected({ ...selected, ubicacion: e.target.value })}
                InputProps={{ readOnly: dialogMode === 'view' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tipo de Incidente"
                value={selected?.tipo_incidente || ''}
                onChange={(e) => setSelected({ ...selected, tipo_incidente: e.target.value })}
                InputProps={{ readOnly: dialogMode === 'view' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Descripción"
                value={selected?.descripcion || ''}
                onChange={(e) => setSelected({ ...selected, descripcion: e.target.value })}
                multiline
                InputProps={{ readOnly: dialogMode === 'view' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Estado"
                value={selected?.estado || ''}
                onChange={(e) => setSelected({ ...selected, estado: e.target.value })}
                InputProps={{ readOnly: dialogMode === 'view' }}
              />

              {dialogMode === 'view' && selected?.detalle_robots?.length > 0 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Robots Involucrados
                  </Typography>
                  {selected.detalle_robots.map((robot, index) => {
                    let bgColor;
                    switch (robot.estado) {
                      case 'en_reparacion':
                        bgColor = '#fbc02d'; // amarillo
                        break;
                      case 'fuera_servicio':
                        bgColor = '#e53935'; // rojo
                        break;
                      case 'operativo':
                        bgColor = '#43a047'; // verde
                        break;
                      default:
                        bgColor = '#757575';
                    }

                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: bgColor,
                          color: '#fff',
                          borderRadius: 2,
                          padding: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1">
                          <strong>ID:</strong> {robot.id}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Estado:</strong> {robot.estado.replace('_', ' ')}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
          {dialogMode === 'edit' && (
            <Button variant="contained" onClick={() => alert('Guardar no implementado')}>
              Guardar
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Incidentes;
