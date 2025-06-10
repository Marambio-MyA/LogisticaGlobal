// components/FormEditUser.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';

const FormEditUser = ({ open, onClose, usuario }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (usuario) {
      setFormData({ ...usuario });
    }
  }, [usuario]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres editar este usuario?');
    if (!confirmar) return;

    try {
      await axiosInstance.put(`/usuarios/${formData.id}`, {
        ...formData,
        // evitar enviar campos sensibles si no son modificables
        password: undefined,
      });
      onClose(); // cierra y permite recargar
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          value={formData.nombre || ''}
          onChange={(e) => handleFieldChange('nombre', e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={formData.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Rol"
          value={formData.rol || ''}
          onChange={(e) => handleFieldChange('rol', e.target.value)}
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="operador">Operador</MenuItem>
          <MenuItem value="invitado">Invitado</MenuItem>
          <MenuItem value="invitado">Tecnico</MenuItem>
        </TextField>
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

export default FormEditUser;
