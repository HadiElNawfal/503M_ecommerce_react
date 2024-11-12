// App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from './axiosConfig';
import AdminDashboard from './admin/pages/AdminDashboard';
import LoginForm from './admin/pages/LoginForm';
import Inventory from './admin/pages/Inventory';
import Orders from './admin/pages/Orders';
import Returns from './admin/pages/Returns';
import Products from './admin/pages/Products';

// App.js
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUrl, setAdminUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    try {
      const response = await axios.get('/api/get-admin-url');
      setAdminUrl(response.data.admin_url);
    } catch (error) {
      console.error('Failed to fetch admin URL', error);
    }
  };

  // Single useEffect for initial setup
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Get CSRF token once
        await axios.get('/api/get-csrf-token');
        
        // Check authentication
        try {
          const response = await axios.get('/api/check-auth');
          if (mounted && response.status === 200) {
            setIsAuthenticated(true);
            const adminResponse = await axios.get('/api/get-admin-url');
            if (mounted) {
              setAdminUrl(adminResponse.data.admin_url);
            }
          }
        } catch (error) {
          // Authentication failed - do nothing, will redirect to login
          console.log('Not authenticated');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to={adminUrl} replace />
            )
          } 
        />
        {isAuthenticated && adminUrl && (
          <Route path={`${adminUrl}/*`} element={<AdminDashboard />}>
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="returns" element={<Returns />} />
            <Route path="products" element={<Products />} />
          </Route>
        )}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? `${adminUrl}` : '/login'} replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;