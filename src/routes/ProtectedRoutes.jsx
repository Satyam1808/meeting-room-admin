import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSnackbar } from 'notistack';

const ProtectedRoute = ({ element }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('adminToken');
          enqueueSnackbar('Session expired. Please log in again!', { variant: 'error' });
          navigate('/admin-login', { replace: true });
        } else {
          const timeLeft = (decodedToken.exp - currentTime) * 1000;
          const timer = setTimeout(() => {
            localStorage.removeItem('adminToken');
            enqueueSnackbar('Session expired. Please log in again!', { variant: 'error' });
            navigate('/admin-login', { replace: true });
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('adminToken');
        enqueueSnackbar('Invalid session. Please log in again!', { variant: 'error' });
        navigate('/admin-login', { replace: true });
      }
    }
  }, [token, enqueueSnackbar, navigate]);

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return element;
};

export default ProtectedRoute;
