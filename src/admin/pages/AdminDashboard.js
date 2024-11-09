import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import DashboardOverview from '../../components/DashboardOverview';
import BarChart from '../../components/BarChart'; // Import BarChart component
import Inventory from './Inventory'; // Import your Inventory component
import Orders from './Orders';
import Products from './Products';

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const renderContent = () => {
    switch (selectedPage) {
      case "inventory":
        return <Inventory />; // Render the full Inventory component here
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      case "customers":
        return <Typography variant="h4">Customer Management</Typography>;
      default:
        return (
          <div>
            <DashboardOverview />
            <Box sx={{ marginTop: 3 }}>
              {/* Single bar chart displaying all stats */}
              <BarChart
                labels={["Total Products", "Orders Today", "Total Customers", "Pending Orders"]}
                data={[320, 15, 1234, 42]} // The data for each stat
                colors={["rgb(75, 192, 192)", "rgb(255, 99, 132)", "rgb(153, 102, 255)", "rgb(255, 159, 64)"]} // Different colors for each stat
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
