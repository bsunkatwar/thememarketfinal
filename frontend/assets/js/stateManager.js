// Global State Management System
// Replaces localStorage with in-memory JavaScript state management

const AppState = {
  // User session state
  user: {
    token: null,
    currentUser: null,
    
    setToken(token) {
      this.token = token;
    },
    
    getToken() {
      return this.token;
    },
    
    setCurrentUser(user) {
      this.currentUser = user;
    },
    
    getCurrentUser() {
      return this.currentUser;
    },
    
    clear() {
      this.token = null;
      this.currentUser = null;
    },
    
    isLoggedIn() {
      return !!this.token;
    },
    
    isAdmin() {
      return this.currentUser && this.currentUser.role === 'ADMIN';
    }
  },
  
  // Cart state
  cart: {
    items: [],
    
    getItems() {
      return this.items;
    },
    
    addItem(item) {
      const exists = this.items.find(i => Number(i.id) === Number(item.id));
      if (!exists) {
        this.items.push(item);
        return true;
      }
      return false;
    },
    
    removeItem(itemId) {
      this.items = this.items.filter(item => Number(item.id) !== Number(itemId));
    },
    
    clear() {
      this.items = [];
    },
    
    getTotal() {
      return this.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    },
    
    getItemCount() {
      return this.items.length;
    }
  },
  
  // User settings state
  settings: {
    data: {},
    
    get(key) {
      return this.data[key];
    },
    
    set(key, value) {
      this.data[key] = value;
    },
    
    getAll() {
      return { ...this.data };
    },
    
    setAll(settingsObj) {
      this.data = { ...settingsObj };
    },
    
    reset() {
      this.data = {};
    }
  },
  
  // Theme data cache
  themes: {
    data: [],
    
    set(themesData) {
      this.data = themesData;
    },
    
    get() {
      return this.data;
    },
    
    getById(id) {
      return this.data.find(theme => Number(theme.id) === Number(id));
    }
  }
};

// Make AppState available globally
window.AppState = AppState;

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppState;
}
