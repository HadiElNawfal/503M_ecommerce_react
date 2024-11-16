// src/admin/pages/Warehouse.js

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Modal, TextField
} from '@mui/material';
import axios from '../../axiosConfig';
import config from '../../config';

const Warehouse = () => {
  const { server } = config;
  const [warehouses, setWarehouses] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [managerId, setManagerId] = useState('');
  const [location, setLocation] = useState('');

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

  // Fetch warehouses from backend
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/api/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    const intervalId = setInterval(fetchWarehouses, 10000); // 10000 ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [server]);

  // Handlers for Modals
  const handleOpenCreateModal = () => {
    setManagerId('');
    setLocation('');
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleOpenUpdateModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setManagerId(warehouse.Manager_ID);
    setLocation(warehouse.Location);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  // Create Warehouse
  const handleCreateWarehouse = async () => {
    try {
      await axios.post('/api/create_warehouse', {
        Manager_ID: managerId,
        Location: location,
      });
      fetchWarehouses();
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating warehouse:', error);
    }
  };

  // Update Warehouse
  const handleUpdateWarehouse = async () => {
    try {
      await axios.put(`/api/update_warehouse/${selectedWarehouse.Warehouse_ID}`, {
        Manager_ID: managerId,
        Location: location,
      });
      fetchWarehouses();
      handleCloseUpdateModal();
    } catch (error) {
      console.error('Error updating warehouse:', error);
    }
  };

  // Modal Styles
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ padding: '20px', marginRight: '450px', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Warehouses
      </Typography>
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

      {/* Create Warehouse Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreateModal}
        sx={{ mb: 2 }}
      >
        Create Warehouse
      </Button>

      {/* Warehouses Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Warehouse ID</TableCell>
            <TableCell>Manager ID</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse.Warehouse_ID}>
              <TableCell>{warehouse.Warehouse_ID}</TableCell>
              <TableCell>{warehouse.Manager_ID}</TableCell>
              <TableCell>{warehouse.Location}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenUpdateModal(warehouse)}
                >
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Warehouse Modal */}
      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        aria-labelledby="create-warehouse-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="create-warehouse-modal-title" variant="h6" gutterBottom>
            Create Warehouse
          </Typography>
          <TextField
            label="Manager ID"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleCreateWarehouse}>
            Create
          </Button>
        </Box>
      </Modal>

      {/* Update Warehouse Modal */}
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="update-warehouse-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="update-warehouse-modal-title" variant="h6" gutterBottom>
            Update Warehouse
          </Typography>
          <TextField
            label="Manager ID"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleUpdateWarehouse}>
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Warehouse;