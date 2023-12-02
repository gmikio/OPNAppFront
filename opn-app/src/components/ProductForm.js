// ProductForm.js
import React from 'react';
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { unitEnum, supermarketIdEnum } from './constants';

const ProductForm = ({ 
    productData, 
    setProductData, 
    userConfirmed, 
    showEditButton, 
    showRegisterButton, 
    handleProductSubmit, 
    handleUserConfirmation,
    unitEnum,
    handleProductNameChange,
    selectSuggestion,
    productSuggestions
}) => {
    const isDisabled = !userConfirmed && !showEditButton && !showRegisterButton;

    return (
        <Grid container spacing={2} style={{ padding: '20px', backgroundColor: 'lightgreen', borderRadius: '13px', marginTop: '20px' }}>
            <TextField 
                label="Código do Produto" 
                value={productData.code || ''} 
                onChange={(e) => setProductData({ ...productData, code: e.target.value })} 
                fullWidth 
                disabled={isDisabled}
            />
            <TextField 
                label="Nome do Produto" 
                value={productData.name || ''} 
                onChange={(e) => setProductData({ ...productData, name: e.target.value })} 
                fullWidth 
                disabled={isDisabled}
            />
            <TextField 
                label="Medida" 
                type="number" 
                value={productData.measurement || ''} 
                onChange={(e) => setProductData({ ...productData, measurement: e.target.value })} 
                fullWidth 
                disabled={isDisabled}
            />
            <FormControl fullWidth disabled={isDisabled}>
                <InputLabel id="unit-label">Unidade de Medida</InputLabel>
                <Select
                    labelId="unit-label"
                    id="unit"
                    value={productData.unit || ''}
                    onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                >
                    {Object.keys(unitEnum).map((unit) => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {userConfirmed && (
                <>
                    <FormControl fullWidth>
                        <InputLabel id="supermarket-label">Região</InputLabel>
                        <Select
                            labelId="supermarket-label"
                            id="supermarketId"
                            value={productData.supermarketId || ''}
                            onChange={(e) => setProductData({ ...productData, supermarketId: e.target.value })}
                        >
                            {Object.keys(supermarketIdEnum).map((supermarket) => (
                                <MenuItem key={supermarket} value={supermarket}>{supermarket}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField 
                        label="Quantidade" 
                        type="number" 
                        value={productData.amount || ''} 
                        onChange={(e) => setProductData({ ...productData, amount: e.target.value })} 
                        fullWidth 
                    />
                </>
            )}

            {!userConfirmed && showRegisterButton && (
                <Button onClick={() => handleProductSubmit('register')} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Registrar Produto
                </Button>
            )}

            {!userConfirmed && showEditButton && (
                <Button onClick={() => handleProductSubmit('edit')} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                    Editar Produto
                </Button>
            )}

            {!userConfirmed && !showEditButton && !showRegisterButton && (
                <>
                    <Button onClick={() => handleUserConfirmation(true)} variant="contained" color="primary" style={{ margin: '10px' }}>Confirmar Produto</Button>
                    <Button onClick={() => handleUserConfirmation(false)} variant="contained" color="secondary" style={{ margin: '10px' }}>Não é esse o produto</Button>
                </>
            )}
        </Grid>
    );
};

export default ProductForm;
