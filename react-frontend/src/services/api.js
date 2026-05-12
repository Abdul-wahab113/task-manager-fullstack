// This service handles all API calls
const API_URL = 'http://localhost:8000/api/v1';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (resolve, reject) => {
  refreshSubscribers.push({ resolve, reject });
};

const onRefreshed = (error, token) => {
  refreshSubscribers.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshSubscribers = [];
};

// Generic request function
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      // Handle 401 Unauthorized by trying to refresh the token
      if (response.status === 401 && !endpoint.includes('/users/login') && !endpoint.includes('/users/register') && !endpoint.includes('/users/refresh')) {
        
        // Wait for the token refresh to complete
        const retryOriginalRequest = new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            config.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(fetch(`${API_URL}${endpoint}`, config));
          }, reject);
        });

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_URL}/users/refresh`, {
              method: 'POST',
              credentials: 'include',
            });
            
            if (!refreshRes.ok) throw new Error('Refresh failed');
            
            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.data.accessToken;
            
            localStorage.setItem('token', newAccessToken);
            isRefreshing = false;
            onRefreshed(null, newAccessToken);
          } catch (refreshErr) {
            isRefreshing = false;
            const sessionError = new Error('Session expired. Please login again.');
            onRefreshed(sessionError, null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            // We do not throw here, because the retryOriginalRequest will reject and we await it below!
          }
        }

        const retryResponse = await retryOriginalRequest;
        const retryData = await retryResponse.json();
        
        if (!retryResponse.ok) {
          const error = new Error(retryData.message || 'Something went wrong');
          error.fieldErrors = retryData.errors;
          throw error;
        }
        return retryData;
      }

      const error = new Error(data.message || 'Something went wrong');
      error.fieldErrors = data.errors;
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const authService = {
  login: (email, password) => request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (username, email, password) => request('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  }),
  logout: () => request('/users/logout', { method: 'POST' }),
};

export const taskService = {
  getAll: () => request('/tasks'),
  create: (taskData) => request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  update: (id, taskData) => request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(taskData),
  }),
  delete: (id) => request(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};
