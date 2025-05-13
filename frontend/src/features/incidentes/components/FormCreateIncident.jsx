// components/FormularioNuevoIncidente.jsx
import { useState, useEffect } from 'react';
import {
  Box, TextField, MenuItem, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, Select, InputLabel, FormControl
} from '@mui/material';
import axiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';

const ESTADOS_ROBOT = ['operativo', 'en_reparacion', 'fuera_servicio'];

const FormCreateIncident = ({ onSubmit }) => {
  const user = useSelector(state => state.auth.user);
  const [robots, setRobots] = useState([]);
  const [incidente, setIncidente] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    ubicacion: '',
    tipo_incidente: 'mecanico',
    descripcion: '',
    estado: 'creado',
    detalle_robots: []
  });

  useEffect(() => {
    axiosInstance.get('/robots')
      .then(res => setRobots(res.data))
      .catch(err => console.error('Error al cargar robots', err));
  }, []);

  const agregarRobot = (robot) => {
    if (!incidente.detalle_robots.some(r => r.id === robot.id)) {
      setIncidente({
        ...incidente,
        detalle_robots: [...incidente.detalle_robots, { id: robot.id, estado: 'operativo' }]
      });
    }
  };

  const actualizarEstadoRobot = (index, estado) => {
    const nuevos = [...incidente.detalle_robots];
    nuevos[index].estado = estado;
    setIncidente({ ...incidente, detalle_robots: nuevos });
  };

  const handleSubmit = async () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres añadir este incidente?');
    if (!confirmar) return;
    try {
      await axiosInstance.post('/incidentes', {
        ...incidente,
        creado_por: user.id
      });
      onSubmit?.();
    } catch (err) {
      console.error('Error al crear incidente', err);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth margin="normal" label="Ubicación"
        value={incidente.ubicacion}
        onChange={e => setIncidente({ ...incidente, ubicacion: e.target.value })}
      />
      <TextField
        fullWidth margin="normal" label="Descripción"
        value={incidente.descripcion}
        onChange={e => setIncidente({ ...incidente, descripcion: e.target.value })}
        multiline
      />
      <TextField
        select fullWidth margin="normal" label="Tipo de Incidente"
        value={incidente.tipo_incidente}
        onChange={e => setIncidente({ ...incidente, tipo_incidente: e.target.value })}
      >
        {['mecanico', 'colision', 'software'].map(tipo => (
          <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
        ))}
      </TextField>
      <TextField
        select fullWidth margin="normal" label="Estado"
        value={incidente.estado}
        onChange={e => setIncidente({ ...incidente, estado: e.target.value })}
      >
        {['creado', 'cerrado'].map(estado => (
          <MenuItem key={estado} value={estado}>{estado}</MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth margin="normal" label="Fecha" type="date"
        value={incidente.fecha}
        onChange={e => setIncidente({ ...incidente, fecha: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth margin="normal" label="Hora" type="time"
        value={incidente.hora}
        onChange={e => setIncidente({ ...incidente, hora: e.target.value })}
      />

      <Typography variant="h6" mt={3}>Robots disponibles</Typography>
      <Paper sx={{ maxHeight: 200, overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {robots.map(robot => (
              <TableRow key={robot.id}>
                <TableCell>{robot.id}</TableCell>
                <TableCell>{robot.nombre}</TableCell>
                <TableCell>{robot.modelo}</TableCell>
                <TableCell>
                  <Button onClick={() => agregarRobot(robot)}>Agregar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {incidente.detalle_robots.length > 0 && (
        <>
          <Typography variant="h6" mt={3}>Robots seleccionados</Typography>
          {incidente.detalle_robots.map((r, idx) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={r.estado}
                    label="Estado"
                    onChange={e => actualizarEstadoRobot(idx, e.target.value)}
                  >
                    {ESTADOS_ROBOT.map(est => (
                      <MenuItem key={est} value={est}>{est}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}

        </>
      )}

      <Box mt={3}>
        <Button variant="contained" onClick={handleSubmit}>
          Crear Incidente
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateIncident;
