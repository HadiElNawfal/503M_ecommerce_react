import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from '../axiosConfig';
import config from '../config';

const RemoveProduct = ({ product, onClose, onRemove }) => {
  const { server } = config;

  const handleRemoveProduct = async () => {
    // Check if product and product_id are defined
    if (!product || !product.Product_ID) {
      console.error("Product ID is missing or undefined.");
      return; // Exit if product_id is not available
    }

    try {
      await axios.delete(`${server}/api/delete_product/${product.Product_ID}`);
      console.log(`Product ${product.Product_ID} deleted successfully`);
      onRemove(); // Trigger parent component to refresh the product list
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Remove Product
      </Typography>
      {product ? (
        <Typography>
          Are you sure you want to delete the product <strong>{product.product_name}</strong>?
        </Typography>
      ) : (
        <Typography color="error">Product information is missing.</Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleRemoveProduct}
          disabled={!product || !product.Product_ID} // Disable if product or product_id is missing
          sx={{
            backgroundColor: 'red',
            '&:hover': {
              backgroundColor: 'darkred',
            },
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Confirm Delete
        </Button>
      </Box>
    </Box>
  );
};

export default RemoveProduct;
