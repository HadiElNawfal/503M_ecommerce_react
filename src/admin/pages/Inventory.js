import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import InventoryTable from '../../components/InventoryTable';
import InventoryReports from '../../components/InventoryReports';
import LowStockAlert from '../../components/LowStockAlert';
import config from '../../config'
import axios from '../../axiosConfig';

const Inventory = () => {
  const { server } = config;
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [turnoverData, setTurnoverData] = useState({ labels: [], values: [] });
  const [popularProductsData, setPopularProductsData] = useState({ labels: [], values: [] });
  const [demandPredictionData, setDemandPredictionData] = useState({ labels: [], values: [] });

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/inventory`);
        const data = response.data;
        setInventoryData(data);
        const lowStock = data.filter(item => item.stock_level < 10);
        setLowStockProducts(lowStock);
    
        const reportResponse = await axios.get(`/api/inventory-reports`);
        const reportData = reportResponse.data;
        setTurnoverData(reportData.turnoverData);
        setPopularProductsData(reportData.popularProductsData);
        setDemandPredictionData(reportData.demandPredictionData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10000 ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [server]);

  return (
    <Box sx={{ padding: '20px', marginRight: '450px', marginTop: '50px'}}> {/* Fixed position for consistent alignment */}
    <Typography variant="h4" gutterBottom>Inventory Management</Typography>
    <div>
    <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleLogout}
              sx={{ mb: 2 }} // margin bottom
            >
              Logout
            </Button>
            </div>
      {/* Low Stock Alert */}
      <LowStockAlert lowStockProducts={lowStockProducts} />

      {/* Inventory Table and Reports */}
      <InventoryTable data={inventoryData} />
      <InventoryReports turnoverData={turnoverData}
        popularProductsData={popularProductsData}
        demandPredictionData={demandPredictionData}/>
    </Box>
  );
};

export default Inventory;
