import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import DashboardOverview from '../../components/DashboardOverview';
import BarChart from '../../components/BarChart'; // Import BarChart component
import Inventory from './Inventory'; // Import your Inventory component
import Orders from './Orders';
import Returns from './Returns';
import Products from './Products';
import axios from 'axios';
import config from '../../config'

const AdminDashboard = () => {
  const { server } = config;
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    ordersToday: 0,
    totalCustomers: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    // Fetch data from backend when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/api/dashboard`); // Replace with your actual backend endpoint
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // 10000 ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [server]);

  const renderContent = () => {
    switch (selectedPage) {
      case "inventory":
        return <Inventory />;
      case "orders":
        return <Orders />;
      case "returns":
        return <Returns />;
      case "products":
        return <Products />;
      case "customers":
        return <Typography variant="h4">Customer Management</Typography>;
      default:
        return (
          <div>
            <DashboardOverview />
            <Box sx={{ marginTop: 3 }}>
              <BarChart
                labels={["Total Products", "Orders Today", "Total Customers", "Pending Orders"]}
                data={[
                  dashboardData.totalProducts,
                  dashboardData.ordersToday,
                  dashboardData.totalCustomers,
                  dashboardData.pendingOrders
                ]}
                colors={["rgb(75, 192, 192)", "rgb(255, 99, 132)", "rgb(153, 102, 255)", "rgb(255, 159, 64)"]}
              />
            </Box>
          </div>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar onSelect={setSelectedPage} />
      
      {/* Main content area */}
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
