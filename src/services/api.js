import axios from "axios";

const API = axios.create({
baseURL: "https://lost-found-portal-backend-production-1b02.up.railway.app",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const publicRoutes = ["/auth", "/users", "/lost-items", "/found-items"];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.startsWith(route)
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;