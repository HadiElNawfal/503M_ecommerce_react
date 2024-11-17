// src/components/AddOrderItem.js

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from '../axiosConfig';
import PropTypes from 'prop-types';

const AddOrderItem = ({ open, handleClose, orderId, refreshOrders }) => {
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/view_products'); // Ensure this endpoint is correct
        setProductOptions(response.data);
      } catch (err) {
        console.error('Error fetching product options:', err);
        setError('Failed to fetch product options.');
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchProducts();
  }, [open]);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    setQuantity(''); // Reset quantity when changing product
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Order ID:', orderId); // Debugging statement

    try {
      // Fetch the selected product to get the price
      const selectedProduct = productOptions.find(
        (product) => product.Product_ID === selectedProductId
      );

      if (!selectedProduct) {
        setError('Selected product not found.');
        return;
      }

      const price = selectedProduct.Price;

      await axios.post('/api/create_order_item', {
        Order_ID: orderId, // Ensure orderId is correctly passed
        Product_ID: selectedProductId,
        Quantity: parseInt(quantity, 10),
        Price: price,
      });

      refreshOrders(); // Refresh the orders in the parent component
      handleClose(); // Close the modal
      setSelectedProductId('');
      setQuantity('');
    } catch (err) {
      console.error('Error adding order item:', err);
      setError('Failed to add item to the order.');
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-order-item-modal-title"
      aria-describedby="add-order-item-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="add-order-item-modal-title" variant="h6" gutterBottom>
          Add Item to Order
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Product Selection */}
            <TextField
              select
              required
              label="Product Name"
              value={selectedProductId}
              onChange={handleProductChange}
              fullWidth
              margin="normal"
            >
              {productOptions.map((product) => (
                <MenuItem key={product.Product_ID} value={product.Product_ID}>
                  {product.Name}
                </MenuItem>
              ))}
            </TextField>

            {/* Quantity */}
            <TextField
              required
              label="Quantity"
              type="number"
              inputProps={{ min: 1 }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              margin="normal"
            />

            {/* Submit and Cancel Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!selectedProductId || !quantity || quantity <= 0}
              >
                Add Item
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

AddOrderItem.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired, // Assuming Order_ID is a number
  refreshOrders: PropTypes.func.isRequired,
};

export default AddOrderItem;