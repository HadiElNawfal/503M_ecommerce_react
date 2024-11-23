// src/pages/Products.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Alert,
} from '@mui/material';
import AddProduct from '../../components/AddProduct';
import UpdateProduct from '../../components/UpdateProduct';
import RemoveProduct from '../../components/RemoveProduct';
import axios from '../../axiosConfig'; // Ensure the correct import path

const Products = () => {
  // State for managing products and modals
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // To display success/error messages
  const [isUploading, setIsUploading] = useState(false); // To manage upload button state

  const fileInputRef = useRef(null); // Ref for the file input

  // Handle user logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to fetch products from the backend
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('/api/view_products');
      console.log('API Response:', response.data); // Log the response for debugging

      // Check if the response is an array
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && Array.isArray(response.data.products)) {
        // Fallback if the response has a 'products' key
        setProducts(response.data.products);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  }, []);

  // Fetch products on component mount and set up interval for refreshing
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Modal handlers
  const openAddModal = () => setIsAddOpen(true);
  const closeAddModal = () => setIsAddOpen(false);

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateOpen(true);
  };
  const closeUpdateModal = () => setIsUpdateOpen(false);

  const openRemoveModal = (product) => {
    setSelectedProduct(product);
    setIsRemoveOpen(true);
  };
  const closeRemoveModal = () => setIsRemoveOpen(false);

  // Handle CSV file selection
  const handleCsvUpload = (event) => {
    setCsvFile(event.target.files[0]);
    setUploadStatus(null); // Reset status on new file selection
  };

  // Process and upload CSV file
  const processCsvFile = async () => {
    if (!csvFile) {
      setUploadStatus({ type: 'error', message: 'No file selected' });
      return;
    }

    // Create FormData object to send the file
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      setIsUploading(true); // Start uploading
      const response = await axios.post('/api/upload_products', formData, {
        // Do NOT set 'Content-Type' header manually; let Axios handle it
      });

      if (response.status === 201) {
        const { message, failed_rows } = response.data;
        if (failed_rows?.length) {
          setUploadStatus({
            type: 'warning',
            message: `${message}. However, some rows failed to upload.`,
          });
        } else {
          setUploadStatus({ type: 'success', message });
        }
        fetchData(); // Refresh data
        setCsvFile(null); // Reset file input state
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // Reset file input value
        }
      } else {
        setUploadStatus({ type: 'error', message: response.data.error || 'Upload failed' });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || 'Unknown error occurred';
      setUploadStatus({ type: 'error', message: errorMsg });
      console.error('Error uploading CSV data:', errorMsg);
    } finally {
      setIsUploading(false); // End uploading
    }
  };

  return (
    <Box sx={{ padding: '20px', marginLeft: '250px' }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      {/* Logout Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mb: 2 }}
        >
          Logout
        </Button>
      </Box>

      {/* Add Product Button */}
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" onClick={openAddModal}>
          Add Product
        </Button>
      </Box>

      {/* Bulk Upload Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bulk Upload Products
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Please upload a CSV file with the following headers: Name, Price, Category_ID, SubCategory_ID.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            ref={fileInputRef} // Assign ref to the input
            style={{ display: 'block' }} // Optional styling
          />
          <Button
            variant="contained"
            onClick={processCsvFile}
            disabled={!csvFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </Box>

        {/* Display Upload Status */}
        {uploadStatus && (
          <Alert severity={uploadStatus.type} sx={{ mt: 2 }}>
            {uploadStatus.message}
          </Alert>
        )}
      </Box>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Product ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Discount (%)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Listed</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subcategory ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.Product_ID}>
                  <TableCell>{product.Product_ID}</TableCell>
                  <TableCell>{product.Name}</TableCell>
                  <TableCell>{product.Description}</TableCell>
                  <TableCell>${product.Price.toFixed(2)}</TableCell>
                  <TableCell>{product.Discount_Percentage || 0}%</TableCell>
                  <TableCell>
                    {product.ImageURL ? (
                      <img
                        src={product.ImageURL}
                        alt={product.Name}
                        width="50"
                        height="50"
                      />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>{product.Listed ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{product.Category_ID || 'N/A'}</TableCell>
                  <TableCell>{product.SubCategory_ID || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => openUpdateModal(product)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => openRemoveModal(product)}
                      variant="outlined"
                      color="error"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Modal */}
      <Modal open={isAddOpen} onClose={closeAddModal}>
        <Box
          sx={{
            maxWidth: 500,
            mx: 'auto',
            p: 4,
            bgcolor: 'background.paper',
            mt: 8,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <AddProduct onClose={closeAddModal} onAdd={fetchData} />
        </Box>
      </Modal>

      {/* Update Product Modal */}
      <Modal open={isUpdateOpen} onClose={closeUpdateModal}>
        <Box
          sx={{
            maxWidth: 500,
            mx: 'auto',
            p: 4,
            bgcolor: 'background.paper',
            mt: 8,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <UpdateProduct
            product={selectedProduct}
            onClose={closeUpdateModal}
            onUpdate={fetchData}
          />
        </Box>
      </Modal>

      {/* Remove Product Modal */}
      <Modal open={isRemoveOpen} onClose={closeRemoveModal}>
        <Box
          sx={{
            maxWidth: 500,
            mx: 'auto',
            p: 4,
            bgcolor: 'background.paper',
            mt: 8,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <RemoveProduct
            product={selectedProduct}
            onClose={closeRemoveModal}
            onRemove={fetchData}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Products;