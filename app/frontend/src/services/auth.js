import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },

  logout: () => {
    localStorage.clear();
    // Using Navigate from React Router instead of window.location.href for smooth navigation
    window.location.href = '/login'; // Or use <Navigate /> if inside a React component
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Decode the JWT token if you're using JWT and check its expiry
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      // If the token is expired, consider the user as not authenticated
      localStorage.removeItem('token');
      return false;
    }
    return !!token;
  }
};

// A simple JWT decoding function (use an actual library like jwt-decode for more safety)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
