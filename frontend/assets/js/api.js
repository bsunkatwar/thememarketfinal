// API Client for ThemeMarket Backend
// Connects to Spring Boot backend API on port 3005

// Dynamically determine API URL based on current host
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3005/api' 
    : `http://${window.location.hostname}:3005/api`;

const api = {
  // ========== AUTH ENDPOINTS ==========
  
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store token and user in AppState for session management
    AppState.user.setToken(data.token);
    AppState.user.setCurrentUser(data.user);
    
    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    const data = await response.json();
    
    // Store token and user in AppState for session management
    AppState.user.setToken(data.token);
    AppState.user.setCurrentUser(data.user);
    
    return data;
  },

  logout() {
    AppState.user.clear();
    window.location.href = 'login.html';
  },

  isLoggedIn() {
    return AppState.user.isLoggedIn();
  },

  getCurrentUser() {
    return AppState.user.getCurrentUser();
  },

  isAdmin() {
    return AppState.user.isAdmin();
  },

  async getMe() {
    const token = AppState.user.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to get user info');
    return await response.json();
  },

  // Helper method for authenticated requests
  async authenticatedFetch(endpoint, options = {}) {
    const token = AppState.user.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token expired or invalid
      AppState.user.clear();
      window.location.href = 'login.html';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response;
  },

  // ========== THEME ENDPOINTS ==========

  async getThemes() {
    const response = await fetch(`${API_BASE_URL}/themes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch themes');
    }

    const result = await response.json();
    return result;
  },

  async getTheme(id) {
    const response = await fetch(`${API_BASE_URL}/themes/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch theme');
    }

    const result = await response.json();
    
    if (!result.success || !result.data) throw new Error('Theme not found');
    
    return result;
  },

  async uploadTheme(formData) {
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }

    const token = AppState.user.getToken();
    
    const response = await fetch(`${API_BASE_URL}/themes/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return await response.json();
  },

  async deleteTheme(id) {
    return this.authenticatedFetch(`/themes/${id}`, {
      method: 'DELETE'
    }).then(() => ({ success: true }));
  },

  // ========== DOWNLOAD ENDPOINTS ==========

  async downloadTheme(themeId) {
    const token = AppState.user.getToken();
    if (!token) throw new Error('Please login to download');

    // Call backend to download and trigger file download
    const response = await fetch(`${API_BASE_URL}/themes/download/${themeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Download failed');
    }

    // Get the file from response and trigger download
    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'theme.zip';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  },

  async checkDownloadAccess(themeId) {
    if (!this.isLoggedIn()) return { hasAccess: false };
    
    // Backend handles access control on download endpoint
    return { hasAccess: true };
  },

  async getUserDownloads() {
    const response = await this.authenticatedFetch('/user/downloads');
    const result = await response.json();
    return result.data || [];
  },

  // ========== ORDER ENDPOINTS ==========

  async createOrder(themeId) {
    // For now, orders are handled during payment
    // This would need a backend endpoint for order creation
    return { success: true, message: 'Order created via payment' };
  },

  async getPurchasedThemes() {
    if (!this.isLoggedIn()) {
      throw new Error('Not authenticated');
    }

    // This would need a backend endpoint
    // For now, return empty array
    return [];
  },

  async hasPurchasedTheme(themeId) {
    if (!this.isLoggedIn()) return false;
    
    // Backend controls download access
    // For now, return false (user needs to purchase)
    return false;
  },

  async getOrders() {
    if (!this.isLoggedIn()) {
      throw new Error('Not authenticated');
    }

    // This would need a backend endpoint
    return [];
  },

  async getOrder(id) {
    // This would need a backend endpoint
    throw new Error('Order endpoint not implemented');
  },

  // ========== UTILITY METHODS ==========

  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// Make api available globally
window.api = api;
