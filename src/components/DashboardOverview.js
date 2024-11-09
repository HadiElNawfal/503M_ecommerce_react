import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const DashboardOverview = () => {
  const stats = [
    { title: "Total Products", value: 320 },
    { title: "Orders Today", value: 15 },
    { title: "Total Customers", value: 1234 },
    { title: "Pending Orders", value: 42 }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{display: 'flex', width:"auto", justifyContent: 'center', padding: 1}}>
            <CardContent>
              <Typography variant="h5" noWrap>{stat.title}</Typography>
              <Typography variant="h4" color="primary" noWrap>{stat.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardOverview;
