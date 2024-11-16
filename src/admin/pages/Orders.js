// src/pages/admin/order.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import config from '../../config';
import axios from '../../axiosConfig';

const Orders = () => {
  const { server } = config;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [dataLoadError, setDataLoadError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [server]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update status in local state
      const updatedOrders = orders.map((order) =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      // Send the updated status to the backend
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });

      console.log(`Order ${orderId} status updated to ${newStatus}`);

      // Show success message
      setSnackbarMessage(`Order ${orderId} status updated to ${newStatus}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Failed to update status for order ${orderId}:`, error);
      // Display a small error message without affecting the rest of the page
      setSnackbarMessage(`Failed to update status for order ${orderId}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    const issueDate = new Date().toLocaleDateString();

    // Invoice Header
    doc.setFontSize(18);
    doc.text('Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Invoice number: ${order.order_id}`, 105, 30, null, null, 'center');
    doc.text(`Date of issue: ${issueDate}`, 105, 40, null, null, 'center');

    // Company Information
    doc.setFontSize(10);
    doc.text('Gaming Console Store', 14, 70);
    doc.text('Bliss Street', 14, 75);
    doc.text('Hamra, Beirut', 14, 80);
    doc.text('Lebanon', 14, 85);
    doc.text('support@GSC.com', 14, 90);

    // Bill To
    doc.text('Bill to', 150, 70);
    doc.text(order.customer_name, 150, 75);
    doc.text(order.address || 'Address not provided', 150, 80);
    doc.text(`${order.city || ''}, ${order.postal_code || ''}`, 150, 85);
    doc.text(order.country || 'Country not provided', 150, 90);
    doc.text(order.email || 'Email not provided', 150, 95);

    // Table of items
    doc.autoTable({
      startY: 105,
      head: [['Description', 'Qty', 'Unit price', 'Amount']],
      body: [
        [
          order.product_name,
          order.quantity,
          `$${order.total_price.toFixed(2)}`,
          `$${(order.quantity * order.total_price).toFixed(2)}`,
        ],
        ['Tax', '1', '$0.00', '$0.00'],
      ],
    });

    // Subtotal, Total, Amount Due
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${order.total_price.toFixed(2)}`, 14, finalY);
    doc.text(`Total: $${order.total_price.toFixed(2)}`, 14, finalY + 5);
    doc.text(`Amount due: $${order.total_price.toFixed(2)} USD`, 14, finalY + 10);

    // Save the PDF
    doc.save(`Invoice-${order.order_id}.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Remove early return on data load error
  // Always render the main content

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Snackbar for displaying status update errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Display data load error if any */}
      
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mb: 2 }}
        >
          Logout
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.product_name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.total_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => generateInvoice(order)}
                    >
                      Generate Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
