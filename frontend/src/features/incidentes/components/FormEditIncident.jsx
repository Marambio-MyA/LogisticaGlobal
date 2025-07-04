// components/FormEditRobotIncident.jsx
import React, { useState } from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import axiosInstance from "../../../api/axiosInstance";

const estados = ["operativo", "en_reparacion", "fuera_servicio"];

const FormEditRobotIncident = ({ asignacion, onClose }) => {
  const [formData, setFormData] = useState({
    estado_final_robot: asignacion?.estado_final_robot || "",
    trabajo_realizado: asignacion?.trabajo_realizado || "",
    fecha_cierre: asignacion?.fecha_cierre?.split("T")[0] || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/incidente-robot/${asignacion.id}`, formData);
      onClose(); // Cierra el diálogo y refresca
    } catch (error) {
      console.error("Error al actualizar asignación:", error);
      alert("Error al actualizar");
    }
  };

  if (!asignacion) return <p>Cargando datos...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} p={1}>
        <TextField
          label="ID de Incidente"
          value={asignacion.incidente_id}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="ID de Robot"
          value={asignacion.robot_id}
          InputProps={{ readOnly: true }}
        />

        <TextField
          select
          name="estado_final_robot"
          label="Estado Final del Robot"
          value={formData.estado_final_robot}
          onChange={handleChange}
          required
        >
          {estados.map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() +
                estado.slice(1).replace("_", " ")}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="trabajo_realizado"
          label="Trabajo Realizado"
          multiline
          minRows={4}
          value={formData.trabajo_realizado}
          onChange={handleChange}
        />

        <TextField
          name="fecha_cierre"
          label="Fecha de Cierre"
          type="date"
          value={formData.fecha_cierre}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default FormEditRobotIncident;
