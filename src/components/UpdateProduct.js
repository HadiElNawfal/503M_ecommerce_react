// src/components/UpdateProduct.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import config from '../config';

const UpdateProduct = ({ product, onClose, onUpdate }) => {
  const { server } = config;
  const [productName, setProductName] = useState(product.product_name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${server}/api/update-product/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName, description, price })
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Update Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth required />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required />
        <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth required />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Update Product</Button>
      </form>
    </Box>
  );
};

export default UpdateProduct;
