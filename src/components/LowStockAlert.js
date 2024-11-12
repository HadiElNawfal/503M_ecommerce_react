// src/components/LowStockAlert.js
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const LowStockAlert = ({ lowStockProducts }) => (
  lowStockProducts.length > 0 && (
    <Box sx={{ position: 'absolute', top: '10%', right: '5%', width: '300px' }}> {/* Positioned on the right */}
      <Typography variant="h5" color="error" gutterBottom>
        Alert: Low Stock Products
      </Typography>
      <Grid container spacing={2} direction="column">
        {lowStockProducts.map((product) => (
          <Grid item xs={12} key={product.product_name}>
            <Card sx={{ display: 'flex', justifyContent: 'center', padding: 1, bgcolor: '#FF7F7F', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" noWrap>{product.product_name}</Typography>
                <Typography variant="h5" color="primary" noWrap>
                  Only {product.stock_level} left
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Location: {product.warehouse_location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
);

export default LowStockAlert;
