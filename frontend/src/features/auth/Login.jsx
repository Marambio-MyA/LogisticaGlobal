import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      dispatch(login({ username, password }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        {!isAuthenticated ? (
          <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Iniciar Sesión
            </Typography>
            <TextField
              fullWidth
              label="Nombre de usuario"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ mt: 2 }}
            >
              Entrar
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Bienvenido, {user.username}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Cerrar sesión
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Login;
