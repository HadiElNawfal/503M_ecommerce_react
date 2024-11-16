import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@mui/material';
import axios from '../../axiosConfig';
import config from '../../config';

const Returns = () => {
  const { server } = config;
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.replace('/login'); // Force navigation
    } catch (error) {
      console.error('Logout error:', error); // Detailed error log
    }
  };

  const fetchReturns = async () => {
    try {
      const response = await axios.get(`/api/returns`);
      setReturns(response.data);
    } catch (error) {
      console.error('Failed to load returned orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
    const intervalId = setInterval(fetchReturns, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, [server]);

  const handleEdit = (returnOrder) => {
    setSelectedReturn(returnOrder);
    setNewStatus(returnOrder.return_status);
  };

  const handleCloseModal = () => {
    setSelectedReturn(null);
    setNewStatus('');
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/returns/${selectedReturn.return_id}`, {
        return_status: newStatus,
      });
      fetchReturns();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating return status:', error);
      setError('Failed to update return status. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Typography variant="h4" gutterBottom>
        Returns Management
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ mt: 2, mb: 3 }} // Add margin-top for spacing below the header
      >
        Logout
      </Button>

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Loading Indicator */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Return ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((returnOrder) => (
              <TableRow key={returnOrder.return_id}>
                <TableCell>{returnOrder.return_id}</TableCell>
                <TableCell>{returnOrder.order_id}</TableCell>
                <TableCell>{returnOrder.product_name}</TableCell>
                <TableCell>{returnOrder.customer_name}</TableCell>
                <TableCell>{returnOrder.return_reason}</TableCell>
                <TableCell>{returnOrder.return_status}</TableCell>
                <TableCell>{returnOrder.requested_action}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(returnOrder)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Update Return Modal */}
      {selectedReturn && (
        <Dialog open onClose={handleCloseModal}>
          <DialogTitle>Update Return Order</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              Return ID: {selectedReturn.return_id}
            </Typography>
            <Typography variant="subtitle1">
              Customer: {selectedReturn.customer_name}
            </Typography>
            <Typography variant="subtitle1">
              Product: {selectedReturn.product_name}
            </Typography>
            <Typography variant="subtitle1">
              Reason: {selectedReturn.return_reason}
            </Typography>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Refund Issued">Issue Refund</MenuItem>
              <MenuItem value="Replacement Sent">Send Replacement</MenuItem>
              <MenuItem value="Return Denied">Deny Return</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Returns;
