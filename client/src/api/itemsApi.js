import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// GET
export const getItems = async () => {
  const res = await axios.get(`${API_BASE}/api/items`);
  return res.data;
};

// CREATE 
export const createItem = async (item) => {
  const res = await axios.post(`${API_BASE}/api/items`, item);
  return res.data; // { id: ... }
};

// UPDATE 
export const updateItem = async (id, updates) => {
  const res = await axios.put(`${API_BASE}/api/items/${id}`, updates);
  return res.data;
};

// SOFT DELETE 
export const deleteItem = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/items/${id}`);
  return res.data;
};

// HARD DELETE 
/*export const hardDeleteItem = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/items/${id}/hard`);
  return res.data;
};*/