// pages/Usuarios.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../api/axiosInstance";
import FormCreateUser from "./components/FormCreateUser";
import FormEditUser from "./components/FormEditUser";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import capitalizeFirst from "../utils/utils";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const res = await axiosInstance.get("/usuarios");
      setUsuarios(res.data);
      setFilteredUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const ROLES = {admin: 'Administrador',jefe_turno: 'Jefe de turno',supervisor: 'Supervisor', tecnico: 'Tecnico'}

  const deleteUsuario = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres eliminar a este usuario?"
    );
    if (!confirmar) return;

    try {
      await axiosInstance.delete(`/usuario/${id}`);
      await fetchUsuarios(); // Actualiza la lista
    } catch (error) {
      console.error("Error al eliminar al usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [searchText, usuarios]);

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchUsuarios(); // Refresca lista al cerrar
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Administración de Usuarios</Typography>
        <Button
          variant="contained"
          id="nuevo-usuario-btn"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
        >
          Nuevo Usuario
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label="Buscar por nombre o email"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsuarios.map((user) => (
              <TableRow key={user.id || user._id}>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{ROLES[user.rol]}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog("edit", user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteUsuario(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialogMode === "create" && "Crear Usuario"}
          {dialogMode === "edit" && "Editar Usuario"}
          {!["create", "edit"].includes(dialogMode) && "Usuario"}
        </DialogTitle>
        <DialogContent>
          {dialogMode === "create" && (
            <FormCreateUser onSubmit={handleCloseDialog} />
          )}
          {dialogMode === "edit" && (
            <FormEditUser
              open={openDialog && dialogMode === "edit"}
              onClose={handleCloseDialog}
              usuario={selectedUser}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Usuarios;
