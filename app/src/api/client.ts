import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

export default apiClient;
