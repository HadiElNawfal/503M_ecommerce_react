// src/components/InventoryTable.js
import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const InventoryTable = ({ data }) => {
  return (
    <Box sx={{ mt: 2, maxWidth: '700px' }}> {/* Adjusted max-width for balance */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#4A90E2' }}>
              <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Stock Level</TableCell>
              <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Warehouse Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.stock_level}</TableCell>
                <TableCell>{product.warehouse_location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryTable;
