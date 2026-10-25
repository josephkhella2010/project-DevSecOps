/* import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically log out when authentication fails
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // Preserve the original error
    return Promise.reject(error);
  },
);

interface ApiRequest {
  api: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export const apiRequest = async ({
  api,
  endpoint = "",
  method = "GET",
  token,
  body,
  headers,
}: ApiRequest) => {
  const response = await axiosInstance({
    url: `/${api}${endpoint}`,
    method,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: body,
  });

  return response.data;
};

export default axiosInstance; */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.headers?.Authorization
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

interface ApiRequest {
  api: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export const apiRequest = async ({
  api,
  endpoint = "",
  method = "GET",
  token,
  body,
  headers,
}: ApiRequest) => {
  const response = await axiosInstance({
    url: `/${api}${endpoint}`,
    method,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: body,
  });

  return response.data;
};
