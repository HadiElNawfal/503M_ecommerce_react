import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './admin/pages/AdminDashboard';
import Inventory from './admin/pages/Inventory';
import Orders from './admin/pages/Orders';
import Returns from './admin/pages/Returns';
import Products from './admin/pages/Products';
import LoginForm from './admin/pages/LoginForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth', { withCredentials: true });
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        ) : (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
        {isAuthenticated && (
          <Route path="admin" element={<AdminDashboard />}>
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders" element={<Returns />} />
            <Route path="products" element={<Products />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
