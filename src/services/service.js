import axios from "axios";
const API_BASE = import.meta.env.VITE_URL;

const getAll = async (searchTerm) => {
  try {
    const url = searchTerm ? `${API_BASE}${searchTerm}` : `${API_BASE}chicken`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error?.message };
  }
};

export default { getAll };
