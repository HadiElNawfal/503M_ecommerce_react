// src/pages/admin/Returns.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManageReturns from '../../components/ManageReturns';
import { Box, CircularProgress, Typography } from '@mui/material';
import config from '../../config'

const Returns = () => {
  const { server } = config;
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/api/returns`); // Fetch return data from backend
        setReturns(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load returned orders');
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [server]);

  // Handle return status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update status in local state
      const updatedReturns = returns.map((returnOrder) =>
        returnOrder.order_id === orderId ? { ...returnOrder, return_status: newStatus } : returnOrder
      );
      setReturns(updatedReturns);

      // Send the updated return status to the backend
      await axios.put(`${server}/api/returns/${orderId}`, { return_status: newStatus });
      console.log(`Return status for order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error(`Failed to update return status for order ${orderId}:`, error);
      setError("Failed to update return status");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <ManageReturns returns={returns} onStatusChange={handleStatusChange} />
    </Box>
  );
};

export default Returns;
