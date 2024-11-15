// src/components/RemoveProduct.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import config from '../config';

const RemoveProduct = ({ product, onClose, onRemove }) => {
  const { server } = config;

  const handleRemove = async () => {
    try {
      await fetch(`${server}/api/remove-product/${product.product_id}`, { method: 'DELETE' });
      onRemove();
      onClose();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Remove Product</Typography>
      <Typography>Are you sure you want to remove "{product.product_name}"?</Typography>
      <Button onClick={handleRemove} variant="contained" color="error" sx={{ mt: 2 }}>Remove</Button>
    </Box>
  );
};

export default RemoveProduct;
