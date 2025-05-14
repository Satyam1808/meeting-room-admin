import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;


export const register = async (fullName, email, division, designation, password, role, secretCode = null) => {
  try {
    const payload = { fullName, email, division, designation, password, role };
    if (secretCode) payload.secretCode = secretCode;

    const response = await api.post('/auth/register-admin', payload);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    if (typeof email !== 'string') {
      throw new Error('Email must be a string');
    }

    const response = await api.post('/auth/login', { email: email.toLowerCase(), password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getAllBookings = async (token) => {
  try {
    const res = await api.get("/bookings/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API response inside getAllBookings:", res.data);
    return res.data;
  } catch (err) {
    console.error("API call failed", err);
    return [];
  }
};

export const addUser = async (fullName, email, division, designation, password, token) => {
    try {
      const response = await api.post(
        '/users/add-user',
        { fullName, email, division, designation, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // ✅ Delete User
  export const deleteUser = async (id, token) => {
    try {
      const response = await api.delete(`/users/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  

  
  // ✅ Get All Users
  export const getAllUsers = async (token) => {
    try {
      const response = await api.get('/users/get-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // ✅ Get User by ID
  export const getUserById = async (id, token) => {
    try {
      const response = await api.get(`/users/get-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error.response?.data?.message || error.message);
      throw error;
    }
  };


  export const getRoomBookingsInRange = async (roomId, from, to, token) => {
    const response = await api.get(`/bookings/room-bookings-in-range`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { roomId, from, to },
    });
    return response.data;
  };
  
  export const getUserBookings = async (token) => {
    try{
      const response = await api.get("/bookings/user-bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
    }catch (error) {
      console.error("Error fetching user bookings:", error.response?.data?.message || error.message);
      throw error;
    }
    
  };
  export const getPendingBookings = async (token) => {
    try {
      const response = await api.get(`/bookings/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.bookings;  
    } catch (error) {
      throw error;
    }
  };

  export const getRooms = async (token) => {
    try {
      const response = await api.get("/rooms" ,{
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms:", error.response?.data?.message || error.message);
      throw error;
    }
  };
  export const updateRoomStatus = async (id, status, token) => {
    try {
      const response = await api.patch(`/rooms/${id}/status`, 
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating room status:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  export const approveBookingAPI = async (bookingId, token) => {
    try {
      const response = await api.put(`/bookings/approve/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error approving booking:", error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Reject Booking
  export const rejectBookingAPI = async (bookingId, token) => {
    try {
      const response = await api.put(`/bookings/reject/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting booking:", error.response?.data?.message || error.message);
      throw error;
    }
  };

   export const editUser = async (id, updatedData, token) => {
    try {
      const response = await api.put(`/users/edit-admin/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.message || error.message);
      throw error;
    }
  };


