import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getMediaUrl = (path) => {
  if (!path) return "";

  return `${import.meta.env.VITE_MEDIA_BASE_URL}${path}`;
};

export default api;
