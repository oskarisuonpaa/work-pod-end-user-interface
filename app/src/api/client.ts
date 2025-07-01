import axios from "axios";

/**
 * API client for making requests to the backend.
 * @module apiClient
 * @description This module creates an Axios instance configured with the base URL and authorization header.
 * It is used for making API requests throughout the application.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

export default apiClient;
