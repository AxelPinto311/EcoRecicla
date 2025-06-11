import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const productService = {
  getAllProducts: async (page = 0, size = 12) => {
    try {
      const response = await axios.get(`${API_URL}/api/product/find?page=${page}&size=${size}`, {
        withCredentials: true,
      });
      return response.data.products || [];
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      throw error;
    }
  },

  getByCategories: async (categories = [], page = 0, size = 12) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/product/findByCategories?page=${page}&size=${size}`,
        categories,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.products || [];
    } catch (error) {
      console.error('Error en getByCategories:', error);
      throw error;
    }
  },
};
