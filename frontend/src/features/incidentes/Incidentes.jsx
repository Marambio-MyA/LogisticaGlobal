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
                    <IconButton onClick={() => alert('Eliminar no implementado')}>
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {dialogMode === 'view'
            ? 'Detalle del Incidente'
            : dialogMode === 'edit'
            ? 'Editar Incidente'
            : 'Nuevo Incidente'}
        </DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
          {dialogMode !== 'view' && (
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
