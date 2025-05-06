import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

// Register user/admin function
export const register = async (fullname, email, division, designation, password, role) => {
    try {
        const response = await api.post('/auth/register', { fullname, email, division, designation, password, role });
        return response.data;
    } catch (error) {
        console.error('Error registering:', error.response?.data?.message || error.message);
        throw error;
    }
};
export const login = async (email, password) => {
    try {
        if (typeof email !== "string") {
            throw new Error("Email must be a string");
        }
        
        console.log("Attempting login for:", email); // ✅ Debug frontend email
        const response = await api.post("/auth/login", { email: email.toLowerCase(), password });
        console.log("Login Successful:", response.data); // ✅ Log response data
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.response?.data?.message || error.message);
        throw error;
    }
};
