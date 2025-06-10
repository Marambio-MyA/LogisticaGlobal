// components/FormCreateUser.jsx
import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';

/* ─────────────────────────── */
/*  Catálogos simples          */
/* ─────────────────────────── */
const ROLES = ['Administrador', 'Operador', 'Supervisor','Tecnico'];

/* ─────────────────────────── */
/*  Componente                 */
/* ─────────────────────────── */
const FormCreateUser = ({ onSubmit }) => {
  const currentUser = useSelector((s) => s.auth.user); // si quieres guardar quién creó
  const [user, setUser] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Operador',
    estado: 'activo',
  });

  const handleChange = (field) => (e) =>
    setUser({ ...user, [field]: e.target.value });

  const handleSave = async () => {
    if (!user.nombre || !user.email || !user.password) {
      alert('Nombre, correo y contraseña son obligatorios');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      alert('Correo no válido');
      return;
    }

    const confirmar = window.confirm('¿Crear este usuario?');
    if (!confirmar) return;

    try {
      await axiosInstance.post('/usuarios', {
        ...user,
        creado_por: currentUser?.id, // opcional
      });
      onSubmit?.(); // cierra diálogo y refresca lista
    } catch (err) {
      console.error('Error al crear usuario', err);
      alert('No se pudo crear el usuario');
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        value={user.nombre}
        onChange={handleChange('nombre')}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Correo"
        type="email"
        value={user.email}
        onChange={handleChange('email')}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Contraseña"
        type="password"
        value={user.password}
        onChange={handleChange('password')}
        required
      />

      {/* Rol */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="rol-label">Rol</InputLabel>
        <Select
          labelId="rol-label"
          label="Rol"
          value={user.rol}
          onChange={handleChange('rol')}
        >
          {ROLES.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={3} textAlign="right">
        <Button variant="contained" onClick={handleSave}>
          Crear usuario
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateUser;
