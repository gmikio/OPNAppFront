import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

const LoginScreen = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [idn, setIdn] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { status, data } = await loginUser(idn, name);
            if (status === 200) {
                setUser({ name, idn });
                navigate('/menu', { state: { userName: name, userIdn: idn } });
            } else {
                setSnackbarMessage('Erro no login: ' + data.message);
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Falha na conexão com o servidor.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <img src={`${process.env.PUBLIC_URL}/logoMaior.png`} alt="OPN Logo" style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
            <Typography component="h1" variant="h5">
                Sign In
            </Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nome"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="idn"
                label="IDN"
                name="idn"
                autoComplete="idn"
                value={idn}
                onChange={(e) => setIdn(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: '10px' }}
            >
                Sign In
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default LoginScreen;
