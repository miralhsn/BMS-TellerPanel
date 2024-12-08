import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customerService = {
  searchCustomers: async (query) => {
    const response = await api.get(`/customers/search?query=${query}`);
    return response.data;
  },

  getCustomerDetails: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  updateCustomerInfo: async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  getTransactionHistory: async (id) => {
    const response = await api.get(`/customers/${id}/transactions`);
    return response.data;
  },

  addCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  getAllCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  processTransaction: async (transactionData) => {
    const response = await api.post('/transactions/process', transactionData);
    return response.data;
  },

  getTransactionHistory: async (customerId) => {
    try {
      const response = await api.get(`/transactions/history/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Transaction history error:', error);
      throw error;
    }
  },

  submitCheque: async (chequeData) => {
    const response = await api.post('/cheques/submit', chequeData);
    return response.data;
  },

  processCheque: async (chequeId, data) => {
    const response = await api.put(`/cheques/process/${chequeId}`, data);
    return response.data;
  },

  getCheques: async (customerId) => {
    const response = await api.get('/cheques', {
      params: { customerId }
    });
    return response.data.data;
  },

  getQuickBalance: async (query) => {
    try {
      const response = await api.get('/customers/balance-inquiry', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  sendStatementEmail: async (customerId, email) => {
    try {
      const response = await api.post(`/customers/${customerId}/send-statement`, { email });
      return response.data;
    } catch (error) {
      console.error('Send statement error:', error.response?.data || error);
      throw error;
    }
  },

  sendTransactionReceipt: async (transactionId, email) => {
    const response = await api.post(`/transactions/${transactionId}/receipt`, { email });
    return response.data;
  }
};

export default api; 