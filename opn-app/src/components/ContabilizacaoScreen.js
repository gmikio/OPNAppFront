import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Grid, TextField, Button, Typography, Container } from '@mui/material';
import Grow from '@mui/material/Grow';
import BarcodeScanner from './BarcodeScanner';
import { checkProduct, addProduct, editProduct, registerProduct } from '../api/productApi';
import ProductForm from './ProductForm';
import CustomSnackbar from './CustomSnackbar';

const ContabilizacaoScreen = () => {
    const { user } = useContext(UserContext);
    const [barcode, setBarcode] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [productData, setProductData] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [showEditButton, setShowEditButton] = useState(false);
    const [showRegisterButton, setShowRegisterButton] = useState(false);

    const handleBarcodeChange = (event) => {
        setBarcode(event.target.value);
    };

    const handleProductCheck = async () => {
        try {
            const response = await checkProduct(barcode);
            if (response.status === 200) {
                const data = await response.json();
                setProductData(data);
                setShowConfirmButton(true);
                setShowEditButton(false);
                setShowRegisterButton(false);
                setSnackbarMessage('Produto encontrado. Prossiga para confirmação.');
                setSnackbarSeverity('success');
            } else if (response.status === 404) {
                setProductData({ barcode }); // Initialize with barcode
                setShowConfirmButton(false);
                setShowEditButton(false);
                setShowRegisterButton(true);
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

    const handleProductSubmit = async (submitType) => {
        // Lógica para submeter o produto (adicionar, editar ou registrar)
        // ...

        if (response && response.status === 200) {
            setSnackbarMessage('Operação realizada com sucesso.');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage('Erro ao realizar operação.');
            setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
    };

    return (
        <Container>
            {/* Cabeçalho e campo de código de barras */}
            {/* ... */}

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

            {productData && (
                <ProductForm
                    productData={productData}
                    setProductData={setProductData}
                    showConfirmButton={showConfirmButton}
                    showEditButton={showEditButton}
                    showRegisterButton={showRegisterButton}
                    handleProductSubmit={handleProductSubmit}
                    user={user}
                />
            )}

            <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} handleClose={() => setOpenSnackbar(false)} />

            {showScanner && <BarcodeScanner onBarcodeDetected={(scannedBarcode) => setBarcode(scannedBarcode)} />}
        </Container>
    );
};

export default ContabilizacaoScreen;