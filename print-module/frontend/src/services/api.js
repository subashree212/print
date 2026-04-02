import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/print';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Upload a PDF file to get the page count.
 * @param {File} file
 * @returns {Promise<{fileName: string, pageCount: number}>}
 */
export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Calculate price based on type, pages and copies.
 * @param {string} printType 
 * @param {number} pageCount
 * @param {number} copies
 * @returns {Promise<{totalPrice: number, pricePerPage: number}>}
 */
export const calculatePrice = async (printType, pageCount, copies) => {
  const response = await api.get('/price', {
    params: { printType, pageCount, copies },
  });
  return response.data;
};

/**
 * Create and save a new print order.
 * @param {{fileName, pageCount, printType, copies}} orderData
 * @returns {Promise<OrderResponse>}
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Fetch all saved orders.
 * @returns {Promise<OrderResponse[]>}
 */
export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Delete an order by ID.
 * @param {number} id
 */
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
