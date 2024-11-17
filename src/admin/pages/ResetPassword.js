import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/system';
import axios from '../../axiosConfig';
import MuiAlert from '@mui/material/Alert';

// Styled Components
const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: "primary", // Use theme's background.default
  padding: '16px',
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
}));

// Alert Component for Snackbar
const AlertComponent = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await axios.post(`/api/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Password reset failed', error);
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Card>
        <Typography variant="h5" gutterBottom>
          Set New Password
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Enter your new password below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary" // Use primary color
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ mt: 1 }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {message ? (
            <AlertComponent onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {message}
            </AlertComponent>
          ) : error ? (
            <AlertComponent onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              {error}
            </AlertComponent>
          ) : null}
        </Snackbar>
      </Card>
    </Container>
  );
};

export default ResetPassword;