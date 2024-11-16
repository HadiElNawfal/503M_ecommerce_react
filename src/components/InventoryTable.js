import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const InventoryTable = ({ data }) => {
  return (
    <Box sx={{ mt: 2, maxWidth: '1000px' }}> {/* Adjusted max-width for balance */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FFFFF' }}>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Product ID</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Stock Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell>{product.Product_ID}</TableCell>
                <TableCell>{product.Name}</TableCell>
                <TableCell>{product.Stock_Level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryTable;