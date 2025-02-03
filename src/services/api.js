import { API_CONFIG } from '../config/api';

export const fetchData = async (endpoint, params = {}, options = {}) => {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}?${new URLSearchParams(params)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.HEADERS,
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`API çağrısı başarısız: ${error.message}`);
  }
};
