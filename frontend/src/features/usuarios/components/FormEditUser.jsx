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
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    id: null,
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        rol: usuario.rol || '',
        id: usuario.id || usuario._id || null,
      });
    }
  }, [usuario]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres editar este usuario?');
    if (!confirmar) return;

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;

      await axiosInstance.put(`/usuarios/${formData.id}`, dataToSend);
      onClose(); // cierra y permite recargar
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  // Opcional: muestra un loader o mensaje si no hay id aún
  if (!formData.id) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          id="edit-nombre-input"
          value={formData.nombre}
          onChange={(e) => handleFieldChange('nombre', e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          id="edit-email-input"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          type="email"
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Rol"
          id="edit-rol-select"
          value={formData.rol}
          onChange={(e) => handleFieldChange('rol', e.target.value)}
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="supervisor">Supervisor</MenuItem>
          <MenuItem value="jefe_turno">Jefe de turno</MenuItem>
          <MenuItem value="tecnico">Técnico</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button id="cancelar-editar-usuario-btn" onClick={onClose}>Cancelar</Button>
        <Button id="guardar-cambios-btn" variant="contained" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormEditUser;
