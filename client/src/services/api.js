const API_URL = "http://localhost:5000/api";

// Helper function to get headers with authentication
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper function for API requests with error handling
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: options.headers || getHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`API request error (${url}):`, error);
    throw error;
  }
};

// Authentication API calls
export const auth = {
  login: async (credentials) => {
    return apiRequest(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest(`${API_URL}/auth/profile`);
  },
};

// Email Sequences API calls
export const sequences = {
  getAll: async () => {
    return apiRequest(`${API_URL}/sequences`);
  },

  create: async (sequenceData) => {
    return apiRequest(`${API_URL}/sequences`, {
      method: "POST",
      body: JSON.stringify(sequenceData),
    });
  },

  update: async (id, sequenceData) => {
    return apiRequest(`${API_URL}/sequences/${id}`, {
      method: "PUT",
      body: JSON.stringify(sequenceData),
    });
  },

  delete: async (id) => {
    return apiRequest(`${API_URL}/sequences/${id}`, {
      method: "DELETE",
    });
  },
};

// Email scheduling API calls
export const emails = {
  schedule: async (emailData) => {
    return apiRequest(`${API_URL}/schedule-email`, {
      method: "POST",
      body: JSON.stringify(emailData),
    });
  },
};
