import React from 'react';
import { Box, Typography } from '@mui/material';
import InventoryTable from '../../components/InventoryTable';
import InventoryReports from '../../components/InventoryReports';

const Inventory = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Inventory Management</Typography>
      <InventoryTable />
      <InventoryReports />
    </Box>
  );
};

export default Inventory;
