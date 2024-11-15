// // src/components/ManagePricing.js
// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography } from '@mui/material';
// import config from '../config';

// const ManagePricing = ({ product, onClose, onUpdate }) => {
//   const [price, setPrice] = useState(product.price);
//   const [discount, setDiscount] = useState(product.discount || 0); // Discount in percentage

//   const handleUpdate = async () => {
//     try {
//       // Send the updated price and discount to the backend
//       const response = await fetch(`${server}/api/update-pricing/${product.product_id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ price, discount })
//       });

//       if (response.ok) {
//         onUpdate(); // Refresh products listc
//         onClose(); // Close the modal
//       } else {
//         console.error('Failed to update pricing');
//       }
//     } catch (error) {
//       console.error('Error updating pricing:', error);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Manage Pricing & Promotions for {product.product_name}
//       </Typography>
//       <TextField
//         label="Price"
//         type="number"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         label="Promotion Discount (%)"
//         type="number"
//         value={discount}
//         onChange={(e) => setDiscount(e.target.value)}
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//       <Button variant="contained" color="primary" onClick={handleUpdate}>
//         Update Pricing
//       </Button>
//     </Box>
//   );
// };

// export default ManagePricing;
