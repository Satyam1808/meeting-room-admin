import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import { useSnackbar } from 'notistack';

const ProtectedRoute = ({ element }) => {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; 

        if (decodedToken.exp < currentTime) {
          // Token has expired
          localStorage.removeItem('adminToken');
          enqueueSnackbar('Token expired. Please log in again!', { variant: 'error' });
        } else {
          const timeLeft = (decodedToken.exp - currentTime) * 1000;
          const timer = setTimeout(() => {
            localStorage.removeItem('adminToken');
            enqueueSnackbar('Token expired. Please log in again!', { variant: 'error' });
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        enqueueSnackbar('Invalid token. Please log in again!', { variant: 'error' });
        localStorage.removeItem('adminToken');
      }
    }
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('isReloading', 'true');
    };

    const handleUnload = () => {
      const isReloading = localStorage.getItem('isReloading') === 'true';
      if (!isReloading) {
        localStorage.removeItem('adminToken');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  useEffect(() => {
    const isReloading = localStorage.getItem('isReloading') === 'true';
    if (isReloading) {
      localStorage.removeItem('isReloading');
    }
  }, []);
  
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return element;
};

export default ProtectedRoute;
