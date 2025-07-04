// components/FormCreateUser.jsx
import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";

const ROLES = {
  admin: "Administrador",
  jefe_turno: "Jefe de turno",
  supervisor: "Supervisor",
  tecnico: "Tecnico",
};

const FormCreateUser = ({ onSubmit }) => {
  const currentUser = useSelector((s) => s.auth.user);

  const [user, setUser] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "Operador",
    estado: "activo",
  });

  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const handleSave = async () => {
    if (!user.nombre || !user.email || !user.password) {
      alert("Nombre, correo y contraseña son obligatorios");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      alert("Correo no válido");
      return;
    }

    const confirmar = window.confirm("¿Crear este usuario?");
    if (!confirmar) return;

    try {
      await axiosInstance.post("/usuarios", {
        ...user,
        creado_por: currentUser?.id,
      });
      onSubmit?.();
    } catch (err) {
      console.error("Error al crear usuario", err);
      alert("No se pudo crear el usuario");
    }
  };

  return (
    <Box>
      <TextField
        id="nombre-input"
        fullWidth
        margin="normal"
        label="Nombre"
        required
        value={user.nombre}
        onChange={handleChange("nombre")}
      />

      <TextField
        id="email-input"
        fullWidth
        margin="normal"
        label="Correo"
        type="email"
        value={user.email}
        onChange={handleChange("email")}
        required
      />

      <TextField
        id="password-input"
        fullWidth
        margin="normal"
        label="Contraseña"
        type="password"
        value={user.password}
        onChange={handleChange("password")}
        required
      />

      <TextField
        id="rol-select"
        select
        fullWidth
        label="Rol"
        value={user.rol}
        onChange={handleChange("rol")}
      >
        {Object.entries(ROLES).map(([rolKey, rolLabel]) => (
          <MenuItem key={rolKey} value={rolKey} id={`rol-option-${rolKey}`}>
            {rolLabel}
          </MenuItem>
        ))}
      </TextField>

      <Box mt={3} textAlign="right">
        <Button id="crear-usuario-btn" variant="contained" onClick={handleSave}>
          Crear usuario
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateUser;
