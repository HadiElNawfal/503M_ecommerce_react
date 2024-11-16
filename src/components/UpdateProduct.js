import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import config from '../config';

const UpdateProduct = ({ product, onClose, onUpdate }) => {
  const { server } = config;

  // State for each field with initial values from the product
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const [productName, setProductName] = useState(product.Name);
  const [description, setDescription] = useState(product.Description);
  const [price, setPrice] = useState(product.Price);
  const [imageUrl, setImageUrl] = useState(product.ImageURL);
  const [listed, setListed] = useState(product.Listed);
  const [discountPercentage, setDiscountPercentage] = useState(product.Discount_Percentage);
  const [categoryId, setCategoryId] = useState(product.Category_ID);
  const [subCategoryId, setSubCategoryId] = useState(product.SubCategory_ID);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the inputs
    if (price < 0) {
      setErrorMessage('Price cannot be negative.');
      return;
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      setErrorMessage('Discount Percentage must be between 0 and 100.');
      return;
    }

    // Prepare the data object with only the updated fields
    const updatedFields = {};
    if (productName !== product.Name) updatedFields.Name = productName;
    if (description !== product.Description) updatedFields.Description = description;
    if (price !== product.Price) updatedFields.Price = parseFloat(price);
    if (imageUrl !== product.ImageURL) updatedFields.ImageURL = imageUrl;
    if (listed !== product.Listed) updatedFields.Listed = listed;
    if (discountPercentage !== product.Discount_Percentage) updatedFields.Discount_Percentage = parseInt(discountPercentage);
    if (categoryId !== product.Category_ID) updatedFields.Category_ID = parseInt(categoryId);
    if (subCategoryId !== product.SubCategory_ID) updatedFields.SubCategory_ID = parseInt(subCategoryId);

    try {
      const response = await fetch(`${server}/api/update_product/${product.Product_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        setErrorMessage(errorData.error || 'An error occurred while updating the product.');
      } else {
        onUpdate(); // Refresh the product list in the parent component
        onClose();  // Close the modal
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        maxHeight: '80vh', // Limits modal height to 80% of the viewport height
        overflowY: 'auto', // Enables vertical scrolling if content exceeds the modal height
      }}
    >
      <Typography variant="h6" gutterBottom>
        Update Product
      </Typography>
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}
      {product.ImageURL && (
        <img
          src={product.ImageURL}
          alt={product.Name}
          style={{ width: '100%', height: 'auto', objectFit: 'contain', marginBottom: '16px' }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={listed}
              onChange={(e) => setListed(e.target.checked)}
            />
          }
          label="Listed"
        />
        <TextField
          label="Discount Percentage"
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Category ID"
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Subcategory ID"
          type="number"
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Update Product
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateProduct;
