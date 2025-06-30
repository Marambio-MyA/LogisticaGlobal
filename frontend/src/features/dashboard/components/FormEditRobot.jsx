// components/robots/FormEditRobot.jsx
import { useState, useEffect } from 'react';
import {
  Box, TextField, MenuItem, Button
} from '@mui/material';
import axiosInstance from '../../../api/axiosInstance';
import capitalizeFirst from '../../utils/utils';

const ESTADOS_ROBOT = ['operativo', 'en_reparacion', 'fuera_servicio'];

const FormEditRobot = ({ robotId, onSubmit }) => {
  const [robot, setRobot] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/robots/${robotId}`)
      .then(res => setRobot(res.data))
      .catch(err => console.error('Error al cargar robot', err));
  }, [robotId]);

  const handleSubmit = async () => {
    const confirmar = window.confirm('¿Actualizar este robot?');
    if (!confirmar) return;
    try {
      await axiosInstance.put(`/robots/${robotId}`, robot);
      onSubmit?.();
    } catch (err) {
      console.error('Error al editar robot', err);
    }
  };

  if (!robot) return <div>Cargando...</div>;

  return (
    <Box>
      <TextField
        id="modelo-robot-edit-input"
        fullWidth margin="normal" label="Modelo"
        value={robot.modelo}
        onChange={e => setRobot({ ...robot, modelo: e.target.value })}
        required
      />
      <TextField
        id="estado-robot-edit-select"
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
        id="ubicacion-robot-edit-input"
        fullWidth margin="normal" label="Ubicación actual"
        value={robot.ubicacion_actual}
        onChange={e => setRobot({ ...robot, ubicacion_actual: e.target.value })}
        required
      />
      <Box mt={2}>
        <Button id="guardar-cambios-button" variant="contained" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};

export default FormEditRobot;
