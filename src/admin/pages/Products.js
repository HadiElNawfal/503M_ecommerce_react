import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import AddProduct from '../../components/AddProduct';
import UpdateProduct from '../../components/UpdateProduct';
import RemoveProduct from '../../components/RemoveProduct';

import config from '../../config';
import Papa from 'papaparse';

const Products = () => {
  const { server } = config;
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${server}/api/view_products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [server]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

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

  const openPricingModal = (product) => {
    setSelectedProduct(product);
    setIsPricingOpen(true);
  };
  const closePricingModal = () => setIsPricingOpen(false);

  const handleCsvUpload = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const processCsvFile = () => {
    if (!csvFile) {
      console.error('No file selected');
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const productsData = result.data;
        try {
          const response = await fetch(`${server}/api/bulk-add-products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: productsData })
          });
          if (response.ok) {
            fetchData();
            console.log('Bulk upload successful');
            setCsvFile(null);
          } else {
            console.error('Bulk upload failed');
          }
        } catch (error) {
          console.error('Error uploading CSV data:', error);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV file:', error);
      }
    });
  };

  return (
    <Box sx={{ padding: '20px', marginLeft: '250px' }}>
      <Typography variant="h4" gutterBottom>Product Management</Typography>
      <Button variant="contained" onClick={openAddModal} sx={{ mb: 3 }}>Add Product</Button>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Bulk Upload Products</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            type="file"
            inputProps={{ accept: ".csv" }}
            onChange={handleCsvUpload}
          />
          <Button variant="contained" onClick={processCsvFile} disabled={!csvFile}>Upload CSV</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Listed</TableCell>
              <TableCell>Category ID</TableCell>
              <TableCell>Subcategory ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.Product_ID}>
                <TableCell>{product.Product_ID}</TableCell>
                <TableCell>{product.Name}</TableCell>
                <TableCell>{product.Description}</TableCell>
                <TableCell>${product.Price.toFixed(2)}</TableCell>
                <TableCell>{product.Discount_Percentage || 0}%</TableCell>
                <TableCell>
                  {product.ImageURL ? (
                    <img src={product.ImageURL} alt={product.Name} width="50" height="50" />
                  ) : (
                    'No Image'
                  )}
                </TableCell>
                <TableCell>{product.Listed ? 'Yes' : 'No'}</TableCell>
                <TableCell>{product.Category_ID || 'N/A'}</TableCell>
                <TableCell>{product.SubCategory_ID || 'N/A'}</TableCell>
                <TableCell>
                  <Button onClick={() => openUpdateModal(product)} variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                  <Button onClick={() => openRemoveModal(product)} variant="outlined" color="error">Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isAddOpen} onClose={closeAddModal}>
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 4, bgcolor: 'background.paper', mt: 8 }}>
          <AddProduct onClose={closeAddModal} onAdd={fetchData} />
        </Box>
      </Modal>

      <Modal open={isUpdateOpen} onClose={closeUpdateModal}>
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 4, bgcolor: 'background.paper', mt: 8 }}>
          <UpdateProduct product={selectedProduct} onClose={closeUpdateModal} onUpdate={fetchData} />
        </Box>
      </Modal>

      <Modal open={isRemoveOpen} onClose={closeRemoveModal}>
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 4, bgcolor: 'background.paper', mt: 8 }}>
          <RemoveProduct product={selectedProduct} onClose={closeRemoveModal} onRemove={fetchData} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Products;
