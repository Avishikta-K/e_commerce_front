import axios from 'axios';

// 1. Set the Base URL to your live Render backend
const BASE_URL = 'https://fashion-store-ak.onrender.com/api';

// 2. Create the Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor: Auto-attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- PRODUCT API FUNCTIONS ---

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error.response ? error.response.data : { message: 'Product not found' };
  }
};

// --- AUTHENTICATION API FUNCTIONS ---

export const sendOtp = async (email) => {
  try {
    const response = await api.post('/login', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Login Failed' };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Invalid OTP' };
  }
};

// --- MISSING FUNCTION 1: LOGOUT ---
export const logoutUser = async (email) => {
  try {
    const response = await api.post('/logout', { email });
    return response.data;
  } catch (error) {
    console.error("Logout backend notification failed", error);
    return { success: false };
  }
};

// --- ORDER API FUNCTIONS ---

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error.response ? error.response.data : { message: 'Order Failed' };
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error("Fetch orders failed:", error);
    throw error.response ? error.response.data : { message: 'Failed to fetch orders' };
  }
};

// --- USER & ADMIN API FUNCTIONS ---

export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Failed to fetch profile' };
  }
};

// --- MISSING FUNCTION 2: ADMIN ACTIVITY LOG ---
export const getUserActivity = async () => {
  try {
    const response = await api.get('/users/activity');
    return response.data;
  } catch (error) {
    console.error("Fetch activity failed:", error);
    throw error.response ? error.response.data : { message: 'Failed to fetch activity' };
  }
};

export default api;