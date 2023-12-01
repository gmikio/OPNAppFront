// ProductForm.js
import React from 'react';
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { unitEnum, supermarketIdEnum } from '../constants';

const ProductForm = ({ productData, setProductData, userConfirmed, isEditing, isRegistering, handleProductSubmit, user }) => {
    return (
        <Grid container spacing={2} style={{ padding: '20px', backgroundColor: 'lightgreen', borderRadius: '13px', marginTop: '20px' }}>
            <TextField label="Código do Produto" value={productData.code || ''} onChange={(e) => setProductData({ ...productData, code: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
            <TextField label="Nome do Produto" value={productData.name || ''} onChange={(e) => setProductData({ ...productData, name: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
            <TextField label="Preço" type="number" value={productData.price || ''} onChange={(e) => setProductData({ ...productData, price: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
            <TextField label="Medida" type="number" value={productData.measurement || ''} onChange={(e) => setProductData({ ...productData, measurement: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />
            <TextField label="Marca" value={productData.brand || ''} onChange={(e) => setProductData({ ...productData, brand: e.target.value })} fullWidth disabled={!userConfirmed && !isEditing && !isRegistering} />

            <FormControl fullWidth disabled={!userConfirmed && !isEditing && !isRegistering}>
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
                        <InputLabel id="supermarket-label">Supermercado</InputLabel>
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

                    <TextField label="Quantidade" type="number" value={productData.amount || ''} onChange={(e) => setProductData({ ...productData, amount: e.target.value })} fullWidth />

                    <Button onClick={handleProductSubmit} variant="contained" color="secondary" style={{ backgroundColor: 'red', marginTop: '10px' }}>
                        {isRegistering ? "Registrar Produto" : "Adicionar Produto"}
                    </Button>
                </>
            )}

            {!userConfirmed && !isRegistering && !isEditing && (
                <>
                    <Button onClick={() => handleUserConfirmation(true)} variant="contained" color="primary" style={{ margin: '10px' }}>Confirmar Produto</Button>
                    <Button onClick={() => handleUserConfirmation(false)} variant="contained" color="secondary" style={{ margin: '10px' }}>Não é esse o produto</Button>
                </>
            )}

            {isEditing && !userConfirmed && (
                <Button onClick={handleProductSubmit} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Editar Produto
                </Button>
            )}
        </Grid>
    );
};

export default ProductForm;
