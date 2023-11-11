import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Grid, TextField, Button, Typography, Container } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { checkProduct, addProduct, editProduct, registerProduct } from '../api/productApi';
import Grow from '@mui/material/Grow';

const ContabilizacaoScreen = () => {
    const { user } = useContext(UserContext);
    const [barcode, setBarcode] = useState('');

    const [productData, setProductData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userConfirmed, setUserConfirmed] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    // Function to handle barcode input change
    const handleBarcodeChange = (event) => {
        setBarcode(event.target.value);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleProductCheck = async () => {
        try {
            const response = await checkProduct(barcode);
            if (response.status === 200) {
                const data = await response.json();
                setProductData(data);
                setUserConfirmed(false); // Reset user confirmation
                setIsEditing(false);
                setSnackbarMessage('Produto encontrado. Prossiga para confirmação.');
                setSnackbarSeverity('success');
            } else if (response.status === 404) {
                setProductData({ barcode }); // Initialize with barcode
                setUserConfirmed(true); // Auto-confirm for registering new product
                setIsEditing(true);
                setSnackbarMessage('Produto não encontrado. Prossiga para registro.');
                setSnackbarSeverity('warning');
            }
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage('Erro na verificação do produto.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Handle user confirmation for product details
    const handleUserConfirmation = (confirm) => {
        setUserConfirmed(confirm);
        setIsEditing(!confirm); // Enable editing only if user denies confirmation
        if (confirm) {
            // Prepare fields for adding the product
            setProductData({
                ...productData,
                productCode: productData.code,
                supermarketId: '', // User needs to fill this
                shiftId: '',       // User needs to fill this
                amount: '',        // User needs to fill this
                authorIdn: user.idn
            });
        }
    };

    // Function to handle form submit for Add, Edit, or Register
    const handleProductSubmit = async () => {
        let response;
        if (isEditing) {
            response = await registerProduct({ ...productData, authorIDN: user.idn });
        } else {
            response = await addProduct(barcode, user.idn); // Changed from editProduct to addProduct
        }
        if (response && response.status === 200) {
            // Handle successful response
            setSnackbarMessage('Operação realizada com sucesso.');
            setSnackbarSeverity('success');
        } else {
            // Handle errors or non-200 responses
            setSnackbarMessage('Erro ao realizar operação.');
            setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
    };

    // UI for product form
    const renderProductForm = () => {
        return productData ? (
            <Grow in={true}>
                <Grid container spacing={2} style={{ padding: '20px', backgroundColor: 'lightgreen', borderRadius: '10px', marginTop: '20px' }}>
                    {/* Always display the product details */}
                    <TextField label="Product Code" value={productData.code || ''} disabled fullWidth />
                    <TextField label="Product Name" value={productData.name || ''} disabled fullWidth />
                    <TextField label="Price" type="number" value={productData.price || ''} disabled fullWidth />
                    <TextField label="Measurement" type="number" value={productData.measurement || ''} disabled fullWidth />
                    <TextField label="Brand" value={productData.brand || ''} disabled fullWidth />
                    <TextField label="Unit" type="number" value={productData.unit || ''} disabled fullWidth />
                    
                    {/* Conditional rendering for user confirmed case */}
                    {userConfirmed && (
                        <>
                            <TextField label="Supermarket ID" value={productData.supermarketId || ''} onChange={(e) => setProductData({ ...productData, supermarketId: e.target.value })} fullWidth />
                            <TextField label="Shift ID" value={productData.shiftId || ''} onChange={(e) => setProductData({ ...productData, shiftId: e.target.value })} fullWidth />
                            <TextField label="Amount" type="number" value={productData.amount || ''} onChange={(e) => setProductData({ ...productData, amount: e.target.value })} fullWidth />
                            <Button variant="contained" color="secondary" onClick={handleProductSubmit} style={{ backgroundColor: 'red', marginTop: '10px' }}>
                                Add Product
                            </Button>
                        </>
                    )}

                    {/* Conditional rendering for editing case */}
                    {!userConfirmed && isEditing && (
                        <>
                            <Button onClick={() => handleUserConfirmation(false)} variant="contained" color="secondary" style={{ backgroundColor: 'red', margin: '10px' }}>
                                Não é esse o produto
                            </Button>
                        </>
                    )}
                </Grid>
            </Grow>
        ) : null;
    };

    return (
        <Container>
            <Typography variant="h4" style={{ marginTop: '20px', textAlign: 'center' }}>
                Bem-vindo à OPN Contabilização, {user.name}
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {/* Barcode Input Field */}
                <TextField
                    label="Barcode"
                    value={barcode}
                    onChange={handleBarcodeChange}
                    fullWidth
                />
            </Grid>
            <Grow in={true}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleProductCheck} 
                    style={{ backgroundColor: 'green', color: 'white', marginTop: '20px' }}
                >
                    Verificar Produto
                </Button>
            </Grow>
            {renderProductForm()}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>

    );
};

export default ContabilizacaoScreen;
