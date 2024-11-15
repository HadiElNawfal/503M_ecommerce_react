// src/components/AddProduct.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import config from '../config';

const AddProduct = ({ onClose, onAdd }) => {
  const { server } = config;
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      await fetch(`${server}/api/add-product`, { method: 'POST', body: formData });
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Add Product</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth required />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required />
        <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth required />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Product</Button>
      </form>
    </Box>
  );
};

export default AddProduct;
