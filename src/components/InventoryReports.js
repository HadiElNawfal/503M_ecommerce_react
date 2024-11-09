import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const InventoryReports = () => {
  return (
    <Box mt={4}>
      <Typography variant="h5">Generate Inventory Reports</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>Generate Report</Button>
    </Box>
  );
};

export default InventoryReports;
