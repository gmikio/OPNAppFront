import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Grid, TextField, Button, Typography, Container } from '@mui/material';
// import Grow from '@mui/material/Grow';
import BarcodeScanner from '../components/BarcodeScanner';
import { checkProduct, addProduct, editProduct, registerProduct } from '../api/productApi';
import ProductForm from '../components/ProductForm';
import CustomSnackbar from '../components/CustomSnackbar';

const ContabilizacaoScreen = () => {
    const { user } = useContext(UserContext);
    const [barcode, setBarcode] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [productData, setProductData] = useState(null);
    const [productSuggestions, setProductSuggestions] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const [userConfirmed, setUserConfirmed] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleBarcodeChange = (event) => {
        setBarcode(event.target.value);
    };

    // Função mock para simular a detecção do código de barras
    const handleBarcodeDetected = (scannedBarcode) => {
        setBarcode(scannedBarcode);
        // Aqui você pode adicionar a lógica para chamar handleProductCheck automaticamente
        // após o código de barras ser detectado, ou deixar que o usuário o faça manualmente.
    };

    // Adicione aqui o estado e a lógica para lidar com a ativação do scanner de código de barras
    // ...

    const handleProductNameChange = async (event) => {
        const productName = event.target.value;
        setProductData({ ...productData, name: productName });
        
        if (productName.length > 0) {
            try {
                const response = await fetch(`http://opn-contabilizacao-env.eba-wnru99in.us-east-1.elasticbeanstalk.com/api/product/Search?term=${productName}`);
                if (response.ok) {
                    const suggestions = await response.json();
                    setProductSuggestions(suggestions);
                } else {
                    console.error('Erro ao buscar sugestões de produtos.');
                }
            } catch (error) {
                console.error('Erro na rede:', error);
            }
        } else {
            setProductSuggestions([]);
        }
    };

    const selectSuggestion = (suggestion) => {
        setProductData({ ...productData, ...suggestion });
        setProductSuggestions([]);
    };

    const renderProductSuggestions = () => {
        return productSuggestions.map((suggestion) => (
            <div key={suggestion.code} onClick={() => selectSuggestion(suggestion)}>
                {suggestion.name}
            </div>
        ));
    };

    const handleProductCheck = async () => {
        try {
            const response = await checkProduct(barcode);
            if (response.status === 200) {
                const data = await response.json();
                setProductData(data);
                setUserConfirmed(false);
                setActionType('add');
                setSnackbarMessage('Produto encontrado. Prossiga para confirmação.');
                setSnackbarSeverity('success');
            } else if (response.status === 404) {
                setProductData({ barcode });
                setUserConfirmed(false);
                setActionType('register');
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

    const handleUserConfirmation = (confirmed) => {
        setUserConfirmed(confirmed);
        if (!confirmed) {
            // Se os dados não conferem, mude para a ação de editar
            setActionType('edit');
        }
    };

    const handleProductSubmit = async () => {
        let response;
        try {
            switch (actionType) {
                case 'add':
                    response = await addProduct(productData);
                    break;
                case 'edit':
                    response = await editProduct(productData);
                    break;
                case 'register':
                    response = await registerProduct(productData);
                    setActionType('add');
                    handleProductSubmit();
                    break;
                default:
                    // Nenhuma ação definida
                    throw new Error('Nenhuma ação de submissão definida');
            }

            if (response.status === 200) {
                setSnackbarMessage('Operação realizada com sucesso.');
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage('Erro ao realizar operação.');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage('Erro de comunicação com o servidor: ' + error.message);
            setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
    };

    return (
        <Container>
            <Typography variant="h4" style={{ marginTop: '20px', textAlign: 'center' }}>
                BORA CONTABILIZAR OS DONATIVOS, {user.name} :D !
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <TextField
                    label="Código de Barras"
                    value={barcode}
                    onChange={handleBarcodeChange}
                    fullWidth
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleProductCheck} 
                    style={{ backgroundColor: 'green', color: 'white', marginTop: '20px' }}
                >
                    Verificar Produto
                </Button>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {/* Código de barras e botão de verificação */}
            </Grid>

            {productData && (
                <>
                    <ProductForm
                        productData={productData}
                        setProductData={setProductData}
                        userConfirmed={userConfirmed}
                        handleProductSubmit={handleProductSubmit}
                        handleUserConfirmation={handleUserConfirmation}
                        user={user}
                        showConfirmButton={!userConfirmed && actionType === 'add'}
                        showEditButton={actionType === 'edit'}
                        showRegisterButton={actionType === 'register'}
                    />
                    {renderProductSuggestions()}
                    <Button onClick={() => setShowScanner(true)}>Ativar Scanner</Button></>
            )}

            <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} handleClose={() => setOpenSnackbar(false)} />

            {showScanner && <BarcodeScanner onBarcodeDetected={(scannedBarcode) => setBarcode(scannedBarcode)} />}
        </Container>
    );
};

export default ContabilizacaoScreen;
