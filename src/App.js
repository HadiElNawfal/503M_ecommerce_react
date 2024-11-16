import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from './axiosConfig';
import AdminDashboard from './admin/pages/AdminDashboard';
import LoginForm from './admin/pages/LoginForm';
import Inventory from './admin/pages/Inventory';
import Orders from './admin/pages/Orders';
import Returns from './admin/pages/Returns';
import Products from './admin/pages/Products';

const ForceRefreshRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return <div>Redirecting...</div>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [adminUrl, setAdminUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false); // Flag to prevent multiple redirects

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/api/get-csrf-token');
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    if (isAuthenticated) {
      fetchCsrfToken();
    }
  }, [isAuthenticated]);


  useEffect(() => {
    const init = async () => {
      try {

        const response = await axios.get('/api/check-auth');
        if (response.status === 200 && response.data.authenticated) {
          setIsAuthenticated(true);
          setUserRoles(response.data.roles);

          if (response.data.roles.includes('Admin')) {
            const adminResponse = await axios.get('/api/get-admin-url');
            setAdminUrl(adminResponse.data.admin_url);
          } else {
            // User is authenticated but not an Admin
            if (!redirecting) {
              setRedirecting(true); // Prevent further redirects
              await axios.post('/api/logout');
              setIsAuthenticated(false);
              setUserRoles([]);
              setAdminUrl('');
              // Optional: You can display a message here using state
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [redirecting]);

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
              <ForceRefreshRedirect to={adminUrl} />
            )
          }
        />
        {isAuthenticated && userRoles.includes('Admin') && adminUrl && (
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
            isAuthenticated && userRoles.includes('Admin') ? (
              <Navigate to={adminUrl} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;