import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, ButtonBase, Container } from '@mui/material';
import GiftIcon from '@mui/icons-material/CardGiftcard'; // Example icon

const MenuScreen = ({ userName, userId }) => {
    const navigate = useNavigate();

    const buttonStyle = {
        padding: '20px',
        margin: '10px',
        backgroundColor: 'lightgreen',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <Container style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h4" style={{ color: 'green', marginBottom: '30px' }}>
                OPN App
            </Typography>
            <Grid container spacing={2} justify="center">
                <Grid item>
                    <Paper style={buttonStyle}>
                        <ButtonBase onClick={() => navigate('/tasks')}>
                            <GiftIcon style={{ fontSize: 'large', color: 'green' }} />
                            <Typography variant="h6">OPN Tasks</Typography>
                        </ButtonBase>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper style={{ ...buttonStyle, backgroundColor: 'red' }}>
                        <ButtonBase onClick={() => navigate('/contabilizacao', { state: { userName, userId } })}>
                            <GiftIcon style={{ fontSize: 'large', color: 'white' }} />
                            <Typography variant="h6" style={{ color: 'white' }}>OPN Contabilização</Typography>
                        </ButtonBase>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MenuScreen;
