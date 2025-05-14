import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ element }) => {
  const token = localStorage.getItem('adminToken'); 
  return !token ? element : <Navigate to="/" replace />;
};

export default PublicRoutes;
