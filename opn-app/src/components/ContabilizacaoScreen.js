import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Grid, TextField, Button, Typography, Container } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { checkProduct, addProduct, editProduct, registerProduct } from '../api/productApi';
import Grow from '@mui/material/Grow';
import BarcodeScanner from './BarcodeScanner';


const unitEnum = {
    "Kg": 0,
    "g": 1,
    "L": 2,
    "mL": 3,
    "Unidade(s)": 4
};

const supermarketIdEnum = {
    "Bandeirantes": 1,
    "Ponte Preta": 2,
    "Souzas": 3,
    "Guará": 4,
    "São Vicente": 5
};

const ContabilizacaoScreen = () => {
    const { user } = useContext(UserContext);
    const [barcode, setBarcode] = useState('');
    const [showScanner, setShowScanner] = useState(false);

    const [productData, setProductData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userConfirmed, setUserConfirmed] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // New state variable for registration flow

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleBarcodeScanned = (scannedBarcode) => {
    setBarcode(scannedBarcode); // Assuming 'setBarcode' updates the barcode state
    setShowScanner(false); // Hide scanner after detection
    };

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
                setSnackbarMessage('Produto encontrado. Prossiga para confirmação.');
                setSnackbarSeverity('success');
            } else if (response.status === 404) {
                setProductData({ barcode }); // Initialize with barcode
                setUserConfirmed(false); // Auto-confirm for registering new product
                setIsRegistering(true); // Indicate we are in the registration flow
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
        } else {
            setIsEditing(true)
        }
    };

    // Function to handle form submit for Add, Edit, or Register
    const handleProductSubmit = async () => {
        // Convert unit to enum value
        const convertedUnit = unitEnum[productData.unit] || 0;
        console.log("idn: ", user.idn)

        let response;
        if (isEditing) {
            const productDetails = {
                "productCode": productData.code, 
                "name": productData.name,
                "measurement": parseInt(productData.measurement),
                "price": parseInt(productData.price),
                "brand": productData.brand,
                "unit": parseInt(convertedUnit),
                "authorIdn": user.idn.toString()
            };
            console.log("productDetails: ", productDetails)
            response = await editProduct(productDetails);
        } else if (isRegistering) {
            const productDetails = {
                "code": productData.code, 
                "name": productData.name,
                "measurement": parseInt(productData.measurement),
                "price": parseInt(productData.price),
                "brand": productData.brand,
                "unit": parseInt(convertedUnit),
                "authorIdn": user.idn.toString()
            };
            response = await registerProduct(productDetails);
        } else {
            const convertedSupermarketId = supermarketIdEnum[productData.supermarketId] || 0;

            const productDetails = {
                "productCode": productData.productCode, 
                "supermarketId": parseInt(convertedSupermarketId),
                "shiftId": parseInt(productData.shiftId),
                "amount": parseInt(productData.amount),
                "authorIdn": productData.authorIdn
            };
            response = await addProduct(productDetails);
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
                <Grid container spacing={2} style={{ padding: '20px', backgroundColor: 'lightgreen', borderRadius: '13px', marginTop: '20px' }}>
                {/* Always display the product details for registration */}
                {(
                    <>
                        <TextField label="Código do Produto" className="formField" value={productData.code || ''} onChange={(e) => setProductData({ ...productData, code: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
                        <TextField label="Nome do Produto" className="formField" value={productData.name || ''} onChange={(e) => setProductData({ ...productData, name: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
                        <TextField label="Preço" type="number" className="formField" value={productData.price || ''} onChange={(e) => setProductData({ ...productData, price: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
                        <TextField label="Measurement" type="number" className="formField" value={productData.measurement || ''} onChange={(e) => setProductData({ ...productData, measurement: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
                        <TextField label="Marca" isRequired={true} className="formField" value={productData.brand || ''} onChange={(e) => setProductData({ ...productData, brand: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
                        <FormControl className="formField" fullWidth disabled={!userConfirmed && !isEditing && !isRegistering}>
                            <InputLabel id="unit-label">Unidade de Medida</InputLabel>
                            <Select
                                labelId="unit-label"
                                id="unit"
                                value={productData.unit || ''}
                                label="unit"
                                onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                            >
                                <MenuItem value={"Kg"}>Kg</MenuItem>
                                <MenuItem value={"g"}>g</MenuItem>
                                <MenuItem value={"L"}>L</MenuItem>
                                <MenuItem value={"mL"}>mL</MenuItem>
                                <MenuItem value={"Unidade(s)"}>Unidade(s)</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
                    
                    {/* Conditional rendering for user confirmed case or after registration */}
                    {userConfirmed && (
                        <>
                            <FormControl className="formField" fullWidth>
                                <InputLabel id="unit-label">Supermercado</InputLabel>
                                <Select
                                    labelId="supermarketId-label"
                                    id="supermarketId"
                                    value={productData.supermarketId || ''}
                                    label="supermarketId"
                                    onChange={(e) => setProductData({ ...productData, supermarketId: e.target.value })}
                                >
                                    <MenuItem value={"Bandeirantes"}>Bandeirantes</MenuItem>
                                    <MenuItem value={"Guará"}>Guará</MenuItem>
                                    <MenuItem value={"Ponte Preta"}>Ponte Preta</MenuItem>
                                    <MenuItem value={"São Vicente"}>São Vicente</MenuItem>
                                    <MenuItem value={"Souzas"}>Souzas</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className="formField" fullWidth>
                                <InputLabel id="shift-label">Turno</InputLabel>
                                <Select
                                    labelId="shift-label"
                                    id="shiftId"
                                    value={productData.shiftId || ''}
                                    label="shiftId"
                                    onChange={(e) => setProductData({ ...productData, shiftId: e.target.value })}
                                >
                                    <MenuItem value={"3"}>3</MenuItem>
                                    <MenuItem value={"4"}>4</MenuItem>

                                </Select>
                            </FormControl>
                            <TextField label="Quantidade" type="number" className="formField" value={productData.amount || ''} onChange={(e) => setProductData({ ...productData, amount: e.target.value })} fullWidth />
                            <Button onClick={handleProductSubmit} variant="contained" color="secondary" style={{ backgroundColor: 'red', marginTop: '10px' }}>
                                Adicionar Produto
                            </Button>
                        </>
                    )}

                    {/* Buttons for confirming or editing the product */}
                    {!userConfirmed && !isRegistering && !isEditing && (
                        <>
                            <Button onClick={() => handleUserConfirmation(true)} variant="contained" color="secondary" style={{ backgroundColor: 'green', margin: '10px' }}>Confirmar Produto</Button>
                            <Button onClick={() => handleUserConfirmation(false)} variant="contained" color="secondary" style={{ backgroundColor: 'red', margin: '10px' }}>Não é esse o produto</Button>
                        </>
                    )}

                    {/* Conditional rendering for editing case */}
                    {isEditing && !userConfirmed && (
                        <Button onClick={handleProductSubmit} variant="contained" color="secondary" style={{ backgroundColor: 'red', marginTop: '10px' }}>
                            Editar Produto
                        </Button>
                    )}
                    {/* Conditional rendering for editing case */}
                    {!userConfirmed && isRegistering && (
                        <Button onClick={handleProductSubmit} variant="contained" color="secondary" style={{ backgroundColor: 'red', marginTop: '10px' }}>
                            Registrar Produto
                        </Button>
                    )}                  
                </Grid>
            </Grow>
        ): null;
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
            {showScanner && <BarcodeScanner onBarcodeDetected={handleBarcodeScanned} />}
        </Container>

    );
};

export default ContabilizacaoScreen;
