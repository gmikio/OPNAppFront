// TasksScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';

const TasksScreen = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                oi :)
            </Typography>
            <Typography variant="h6" gutterBottom>
                OPN Tasks desativada por agora (culpe a Jess)
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/contabilizacao')}
                style={{ marginTop: '20px' }}
            >
                Ir para Contabilização
            </Button>
        </Container>
    );
};

export default TasksScreen;