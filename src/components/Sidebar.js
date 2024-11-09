import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar = ({ onSelect }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, key: "dashboard" },
    { text: "Inventory", icon: <InventoryIcon />, key: "inventory" },
    { text: "Orders", icon: <InventoryIcon />, key: "orders" },
    { text: "Products", icon: <InventoryIcon />, key: "products" },
    { text: "Customers", icon: <PeopleIcon />, key: "customers" }
  ];

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#1976d2",
        height: "100vh", // full height
        color: "white",
        position: "fixed", // Ensure the sidebar stays fixed to the left
        top: 0, // Align to the top of the page
        left: 0, // Align to the left of the page
        zIndex: 1, // Ensure the sidebar stays on top of other elements
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.key} onClick={() => onSelect(item.key)}>
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
