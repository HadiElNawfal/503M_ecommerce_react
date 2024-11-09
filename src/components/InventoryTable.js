import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const InventoryTable = () => {
  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h5" gutterBottom>Inventory Table</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Stock Level</TableCell>
            <TableCell>Warehouse Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Product 1</TableCell>
            <TableCell>150</TableCell>
            <TableCell>Warehouse A</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Product 2</TableCell>
            <TableCell>80</TableCell>
            <TableCell>Warehouse B</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default InventoryTable;
