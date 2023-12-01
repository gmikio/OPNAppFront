import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext'; // Adjust the import path as needed
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [idn, setIdn] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        console.log('Attempting login with:', { name, idn }); // Log attempt

        try {
            const response = await fetch(`http://opn-contabilizacao-env.eba-wnru99in.us-east-1.elasticbeanstalk.com/api/User/Login/?idn=${idn}&name=${name}`);
            console.log('Response status:', response.status); // Log response status

            if (response.status === 200) {
                // Set user context here
                console.log('Login successful for:', { name, idn });
                setUser({ name, idn });
                navigate('/menu', { state: { userName: name, userIdn: idn } });
            } else {
                // Handle login error
                console.error('Login failed:', response.statusText); // Log error message
                // Implement more specific error handling if necessary
            }
        } catch (error) {
            // Handle request error
            console.error('Error during login request:', error); // Log error details
            // Implement additional error handling logic if needed
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
                label="Name"
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
            >
                Sign In
            </Button>
        </Container>
    );
};

export default LoginScreen;
