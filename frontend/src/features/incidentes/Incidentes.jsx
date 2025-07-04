import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../api/axiosInstance";
import FormCreateIncident from "./components/FormCreateIncident";
import FormEditRobotIncident from "./components/FormEditIncident";
import capitalizeFirst from "../utils/utils";

const Incidentes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");
  const [asignaciones, setAsignaciones] = useState([]);

  const fetchAsignaciones = async () => {
    try {
      const response = await axiosInstance.get("/incidente-robot");
      setAsignaciones(response.data);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/incidente-robot");
        setIncidentes(res.data); // ← aquí están viniendo los RobotIncident
      } catch (error) {
        console.error("Error al obtener incidentes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleOpenDialog = (mode, incidente = null) => {
    setDialogMode(mode);
    setSelected(incidente);
    setDialogOpen(true);
  };

  const handleCloseDialog = (nuevoIncidente) => {
    setDialogOpen(false);
    setSelected(null);
    if (nuevoIncidente?.id) {
      // Si se creó un incidente nuevo, obtener los RobotIncident vinculados
      axiosInstance
        .get(`/incidente-robot`)
        .then((res) => setAsignaciones(res.data))
        .catch((err) =>
          console.error(
            "Error al cargar RobotIncidents del nuevo incidente",
            err
          )
        );
    } else {
      fetchAsignaciones();
    }
  };

  const fetchIncidentes = async () => {
    try {
      const response = await axiosInstance.get("/incidente-robot");
      setIncidentes(response.data);
    } catch (error) {
      console.error("Error al obtener incidentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAsignacion = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar esta asignación?");
    if (!confirmar) return;

    try {
      await axiosInstance.delete(`/incidente-robot/${id}`);
      await fetchAsignaciones();
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
    }
  };

  useEffect(() => {
    fetchIncidentes();
  }, []);

  const filtered = incidentes.filter((i) =>
    i.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Incidentes</Typography>
        <Button
          variant="contained"
          id="nuevo-incidente-btn"
          startIcon={<AddIcon />}
          onClick={() =>
            handleOpenDialog("create", {
              codigo: "",
              fecha: "",
              hora: "",
              ubicacion: "",
              tipo_incidente: "",
              descripcion: "",
              estado: "",
              creado_por: "",
            })
          }
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
                <TableCell>Incidente</TableCell>
                <TableCell>Robot ID</TableCell>
                <TableCell>Estado Final</TableCell>
                <TableCell>Trabajo Realizado</TableCell>
                <TableCell>Fecha Cierre</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((asig) => (
                <TableRow key={asig.id}>
                  <TableCell>{asig.incidente_id}</TableCell>
                  <TableCell>{asig.robot_id}</TableCell>
                  <TableCell>
                    {capitalizeFirst(asig.estado_inicial_robot, true)}
                  </TableCell>
                  <TableCell>
                    {capitalizeFirst(asig.estado_final_robot || "-", true)}
                  </TableCell>
                  <TableCell>
                    {asig.trabajo_realizado?.length > 30
                      ? `${asig.trabajo_realizado.slice(0, 30)}...`
                      : asig.trabajo_realizado || "-"}
                  </TableCell>
                  <TableCell>
                    {asig.fecha_cierre
                      ? new Date(asig.fecha_cierre).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      id={`ver-asignacion-${asig.id}`}
                      onClick={() => handleOpenDialog("view", asig)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      id={`editar-asignacion-${asig.id}`}
                      onClick={() => handleOpenDialog("edit", asig)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      id={`eliminar-asignacion-${asig.id}`}
                      onClick={() => deleteAsignacion(asig.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron asignaciones.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {dialogMode === "view"
            ? "Detalle de Asignación"
            : dialogMode === "edit"
            ? "Editar Asignación"
            : "Nueva Asignación"}
        </DialogTitle>

        <DialogContent>
          {dialogMode === "create" ? (
            <FormCreateIncident onSubmit={handleCloseDialog} />
          ) : dialogMode === "edit" ? (
            <FormEditRobotIncident
              open={dialogOpen}
              onClose={handleCloseDialog}
              asignacion={selected}
            />
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Incidente"
                value={selected?.incidente_id || ""}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Robot ID"
                value={selected?.robot_id || ""}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Estado Final"
                value={capitalizeFirst(
                  selected?.estado_final_robot || "-",
                  true
                )}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Trabajo Realizado"
                multiline
                value={selected?.trabajo_realizado || "-"}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fecha de Cierre"
                value={
                  selected?.fecha_cierre
                    ? new Date(selected.fecha_cierre).toLocaleDateString()
                    : "-"
                }
                InputProps={{ readOnly: true }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Incidentes;
