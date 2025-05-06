import React from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegistrationPage from "./pages/AdminRegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";
import AllBookings from "./pages/AllBooking";
import History from "./pages/History";
import PendingApproval from "./pages/PendingApproval";
import AdminMyView from "./pages/AdminMyView";
import ProtectedRoute from "./routes/ProtectedRoutes"; 
import UserManagement from "./pages/UserManagement";
import PublicRoutes from "./routes/PublicRoutes";
import "./App.css";
import Home from "./components/AdminHome";


function App() {
  return (
    <Router>
    <Routes>

      {/* Public Routes */}
  
      <Route path="/admin-login" element={<PublicRoutes element={<AdminLoginPage />} />} />
      <Route path="/admin-register" element={<PublicRoutes element={<AdminRegistrationPage />} />} />

      {/* Admin Protected Routes */}
      <Route path="/" element={<ProtectedRoute element={<Home/>}/>}>
        <Route index element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/all-bookings" element={<AllBookings />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin-view" element={<AdminMyView />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Route>

    </Routes>
  </Router>
  );
}

export default App;
