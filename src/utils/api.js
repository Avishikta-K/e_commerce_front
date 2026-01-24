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
// This ensures that if a user is logged in, their token is sent with every request.
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

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Fetch a single product by ID
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

// --- ORDER API FUNCTIONS (NEW) ---

// Create a new order (Protected by Token)
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error.response ? error.response.data : { message: 'Order Failed' };
  }
};

// Get logged-in user's orders (Protected by Token)
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error("Fetch orders failed:", error);
    throw error.response ? error.response.data : { message: 'Failed to fetch orders' };
  }
};

// --- USER PROFILE ---

export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Failed to fetch profile' };
  }
};

export default api;