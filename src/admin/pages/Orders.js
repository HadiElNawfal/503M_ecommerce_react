// src/pages/admin/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManageOrders from '../../components/ManageOrders';
import { Box, CircularProgress, Typography } from '@mui/material';
import config from '../../config'

const Orders = () => {
  const { server } = config;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 seconds

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
      await axios.put(`${server}/api/orders/${orderId}`, { status: newStatus });

      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error(`Failed to update status for order ${orderId}:`, error);
      setError("Failed to update order status");
    }
  };


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
    <ManageOrders orders={orders} onStatusChange={handleStatusChange} />
  </Box>
  );
};

export default Orders;
