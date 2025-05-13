import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    InputLabel,
    FormControl,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import axiosInstance from '../../../api/axiosInstance';
  
  const FormEditIncident = ({ open, onClose, incidente }) => {
    const [formData, setFormData] = useState(null);
    const [robotsDisponibles, setRobotsDisponibles] = useState([]);
  
    useEffect(() => {
      if (incidente) {
        // Clonar incidente recibido
        setFormData({
          ...incidente,
          detalle_robots: incidente.detalle_robots || [],
        });
      }
    }, [incidente]);
  
    useEffect(() => {
      const fetchRobots = async () => {
        try {
          const res = await axiosInstance.get('/robots');
          setRobotsDisponibles(res.data);
        } catch (error) {
          console.error('Error al obtener robots:', error);
        }
      };
  
      fetchRobots();
    }, []);
  
    const handleFieldChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleRobotStateChange = (index, estado) => {
      const updated = [...formData.detalle_robots];
      updated[index].estado = estado;
      setFormData((prev) => ({ ...prev, detalle_robots: updated }));
    };
  
    const handleSubmit = async () => {
      const confirmar = window.confirm('¿Estás seguro de que quieres editar este incidente?');
      if (!confirmar) return;
      try {
        await axiosInstance.put(`/incidentes/${formData.id}`, {
          ...formData,
          creado_por: undefined // aseguramos que no se actualiza eso
        });
        onClose(); // cierra y permite recargar
      } catch (err) {
        console.error('Error al actualizar incidente:', err);
      }
    };
  
    if (!formData) return null;
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Editar Incidente</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Código"
            value={formData.codigo || ''}
            onChange={(e) => handleFieldChange('codigo', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={formData.fecha?.split('T')[0] || ''}
            onChange={(e) => handleFieldChange('fecha', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            type="time"
            label="Hora"
            value={formData.hora || ''}
            onChange={(e) => handleFieldChange('hora', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Ubicación"
            value={formData.ubicacion || ''}
            onChange={(e) => handleFieldChange('ubicacion', e.target.value)}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Tipo de Incidente"
            value={formData.tipo_incidente || ''}
            onChange={(e) => handleFieldChange('tipo_incidente', e.target.value)}
          >
            <MenuItem value="mecanico">Mecánico</MenuItem>
            <MenuItem value="colision">Colisión</MenuItem>
            <MenuItem value="software">Software</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            value={formData.descripcion || ''}
            onChange={(e) => handleFieldChange('descripcion', e.target.value)}
            multiline
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Estado"
            value={formData.estado || ''}
            onChange={(e) => handleFieldChange('estado', e.target.value)}
          >
            <MenuItem value="creado">Creado</MenuItem>
            <MenuItem value="cerrado">Cerrado</MenuItem>
          </TextField>
  
          {formData.detalle_robots.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Robots Involucrados
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.detalle_robots.map((robot, index) => (
                    <TableRow key={index}>
                      <TableCell>{robot.id}</TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <InputLabel>Estado</InputLabel>
                          <Select
                            value={robot.estado}
                            label="Estado"
                            onChange={(e) => handleRobotStateChange(index, e.target.value)}
                          >
                            <MenuItem value="operativo">Operativo</MenuItem>
                            <MenuItem value="en_reparacion">En reparación</MenuItem>
                            <MenuItem value="fuera_servicio">Fuera de servicio</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default FormEditIncident;
  