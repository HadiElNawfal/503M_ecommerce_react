// src/components/ManageReturns.js
import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';

const ManageReturns = ({ returns, onStatusChange }) => {
  return (
    <Box sx={{ padding: '20px', marginLeft: '250px' }}> {/* Fixed position for consistent alignment */}
    <Typography variant="h4" gutterBottom>Returns Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Return Reason</TableCell>
              <TableCell>Requested Action</TableCell>
              <TableCell>Return Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((returnOrder) => (
              <TableRow key={returnOrder.order_id}>
                <TableCell>{returnOrder.order_id}</TableCell>
                <TableCell>{returnOrder.customer_name}</TableCell>
                <TableCell>{returnOrder.product_name}</TableCell>
                <TableCell>{returnOrder.quantity}</TableCell>
                <TableCell>${returnOrder.total_price.toFixed(2)}</TableCell>
                <TableCell>{returnOrder.return_reason}</TableCell>
                <TableCell>{returnOrder.requested_action}</TableCell>
                <TableCell>
                  <Select
                    value={returnOrder.return_status}
                    onChange={(e) => onStatusChange(returnOrder.order_id, e.target.value)}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onStatusChange(returnOrder.order_id, returnOrder.requested_action)}
                  >
                    {returnOrder.requested_action === 'refund' ? 'Issue Refund' : 'Process Replacement'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageReturns;
