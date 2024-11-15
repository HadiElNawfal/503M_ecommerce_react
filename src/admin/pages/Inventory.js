import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import InventoryTable from '../../components/InventoryTable';
import InventoryReports from '../../components/InventoryReports';
import LowStockAlert from '../../components/LowStockAlert';
import config from '../../config'

const Inventory = () => {
  const { server } = config;
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [turnoverData, setTurnoverData] = useState({ labels: [], values: [] });
  const [popularProductsData, setPopularProductsData] = useState({ labels: [], values: [] });
  const [demandPredictionData, setDemandPredictionData] = useState({ labels: [], values: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/api/inventory`); // Corrected template string syntax
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Corrected error handling syntax
        }
        const data = await response.json();
        setInventoryData(data);
        const lowStock = data.filter(item => item.stock_level < 10);
        setLowStockProducts(lowStock);

        const reportResponse = await fetch(`${server}/api/inventory-reports`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Corrected error handling syntax
        }
        const reportData = await reportResponse.json();
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
