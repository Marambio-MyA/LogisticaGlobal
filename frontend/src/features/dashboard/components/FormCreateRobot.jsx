// components/robots/FormCreateRobot.jsx
import { useState } from 'react';
import {
  Box, TextField, MenuItem, Button
} from '@mui/material';
import axiosInstance from '../../../api/axiosInstance';
import capitalizeFirst from '../../utils/utils';

const ESTADOS_ROBOT = ['operativo', 'en_reparacion', 'fuera_servicio'];

const FormCreateRobot = ({ onSubmit }) => {
  const [robot, setRobot] = useState({
    modelo: '',
    estado_actual: 'operativo',
    ubicacion_actual: ''
  });

  const handleSubmit = async () => {
    const confirmar = window.confirm('¿Crear este robot?');
    if (!confirmar) return;
    try {
      await axiosInstance.post('/robots', robot);
      onSubmit?.();
    } catch (err) {
      console.error('Error al crear robot', err);
    }
  };

  return (
    <Box>
      <TextField
        id= "modelo-robot-input"
        fullWidth margin="normal" label="Modelo"
        value={robot.modelo}
        onChange={e => setRobot({ ...robot, modelo: e.target.value })}
        required
      />
      <TextField
        id="estado-robot-select"
        select fullWidth margin="normal" label="Estado"
        value={robot.estado_actual}
        onChange={e => setRobot({ ...robot, estado_actual: e.target.value })}
      >
        {ESTADOS_ROBOT.map(estado => (
          <MenuItem id={`estado-robot-${estado}`} key={estado} value={estado}>
            {capitalizeFirst(estado, true)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="ubicacion-robot-input"
        fullWidth margin="normal" label="Ubicación actual"
        value={robot.ubicacion_actual}
        onChange={e => setRobot({ ...robot, ubicacion_actual: e.target.value })}
        required
      />
      <Box mt={2}>
        <Button id="crear-robot-button" variant="contained" onClick={handleSubmit}>
          Crear Robot
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateRobot;
