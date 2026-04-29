// Global Utilities for ThemeMarket
// Provides data normalization, error handling, and shared functionality

// ========== DATA NORMALIZATION LAYER ==========

/**
 * Normalize theme data from any source (backend or local)
 * Handles both snake_case and camelCase properties
 */
function normalizeTheme(theme) {
  if (!theme) return null;
  
  return {
    id: Number(theme.id) || 0,
    title: theme.title || theme.theme_title || 'Unknown Theme',
    description: theme.description || theme.theme_description || '',
    price: parseFloat(theme.price) || 0,
    category: theme.category || 'Uncategorized',
    image: theme.preview_image || theme.image || 'theme6.jpeg',
    rating: parseFloat(theme.rating) || 4.5,
    sales: parseInt(theme.sales) || parseInt(theme.download_count) || 0,
    badge: theme.badge || (parseFloat(theme.price) > 0 ? 'Premium' : 'Free'),
    download_count: parseInt(theme.download_count) || 0,
    is_published: theme.is_published !== undefined ? theme.is_published : true
  };
}

/**
 * Normalize user data from API response
 */
function normalizeUser(user) {
  if (!user) return null;
  
  return {
    id: Number(user.id) || 0,
    name: user.name || 'User',
    email: user.email || '',
    role: user.role || 'USER',
    created_at: user.created_at || user.createdAt || new Date().toISOString()
  };
}

/**
 * Normalize download record from backend
 */
function normalizeDownload(download) {
  if (!download) return null;
  
  return {
    id: Number(download.id) || 0,
    user_id: Number(download.user_id) || 0,
    theme_id: Number(download.theme_id) || 0,
    theme_title: download.theme_title || download.themeTitle || 'Unknown Theme',
    download_date: download.download_date || download.downloadDate || new Date().toISOString()
  };
}

/**
 * Normalize order record from backend
 */
function normalizeOrder(order) {
  if (!order) return null;
  
  return {
    id: Number(order.id) || 0,
    user_id: Number(order.user_id) || 0,
    theme_id: Number(order.theme_id) || 0,
    theme_title: order.theme_title || order.themeTitle || 'Unknown Theme',
    theme_image: order.theme_image || order.themeImage || '',
    amount: parseFloat(order.amount) || 0,
    status: order.status || 'completed',
    payment_method: order.payment_method || 'credit_card',
    order_date: order.order_date || order.orderDate || new Date().toISOString()
  };
}

// ========== API RESPONSE HANDLER ==========

/**
 * Standardized API response handler with error normalization
 */
async function handleApiResponse(response) {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.response = response;
    throw error;
  }
  
  return await response.json();
}

// ========== TOAST NOTIFICATION SYSTEM ==========

/**
 * Non-blocking toast notification system
 * Replaces alert() with modern UI notifications
 */
const Toast = {
  container: null,
  
  init() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(this.container);
  },
  
  show(message, type = 'success', duration = 3000) {
    this.init();
    
    const toast = document.createElement('div');
    const colors = {
      success: { bg: '#28a745', icon: 'fa-check-circle' },
      error: { bg: '#dc3545', icon: 'fa-exclamation-circle' },
      warning: { bg: '#ffc107', icon: 'fa-exclamation-triangle', text: '#000' },
      info: { bg: '#17a2b8', icon: 'fa-info-circle' }
    };
    
    const color = colors[type] || colors.info;
    
    toast.style.cssText = `
      background: ${color.bg};
      color: ${color.text || '#fff'};
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideInRight 0.3s ease-out;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      cursor: pointer;
    `;
    
    toast.innerHTML = `
      <i class="fas ${color.icon}" style="font-size: 1.2rem;"></i>
      <span style="flex: 1;">${message}</span>
      <i class="fas fa-times" style="opacity: 0.7; cursor: pointer;"></i>
    `;
    
    // Click to dismiss
    toast.addEventListener('click', () => this.dismiss(toast));
    
    this.container.appendChild(toast);
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
    
    return toast;
  },
  
  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },
  
  success(message, duration) {
    return this.show(message, 'success', duration);
  },
  
  error(message, duration) {
    return this.show(message, 'error', duration || 5000);
  },
  
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },
  
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ========== CART SYSTEM ==========

/**
 * Enhanced cart system with validation and sync
 */
const CartManager = {
  getCart() {
    // Get cart items from AppState
    const cart = AppState.cart.getItems();
    // Validate cart items
    return cart.filter(item => 
      item && 
      item.id !== undefined && 
      item.title && 
      typeof item.price === 'number'
    );
  },
  
  saveCart(cart) {
    // Save cart to AppState
    AppState.cart.items = cart;
  },
  
  addToCart(theme) {
    const normalizedTheme = normalizeTheme(theme);
    const cart = this.getCart();
    
    // Check for duplicates using normalized ID
    const exists = cart.find(item => Number(item.id) === Number(normalizedTheme.id));
    
    if (exists) {
      Toast.info('Item already in cart');
      return false;
    }
    
    const cartItem = {
      id: normalizedTheme.id,
      title: normalizedTheme.title,
      price: normalizedTheme.price,
      image: normalizedTheme.image.startsWith('assets/') ? 
        normalizedTheme.image : 
        `assets/image/${normalizedTheme.image}`
    };
    
    cart.push(cartItem);
    this.saveCart(cart);
    this.updateBadge();
    Toast.success('Item added to cart!');
    
    return true;
  },
  
  removeFromCart(themeId) {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => Number(item.id) !== Number(themeId));
    this.saveCart(filteredCart);
    this.updateBadge();
    Toast.info('Item removed from cart');
  },
  
  clearCart() {
    this.saveCart([]);
    this.updateBadge();
  },
  
  updateBadge() {
    const cart = this.getCart();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = cart.length;
      badge.style.display = cart.length > 0 ? 'flex' : 'none';
    });
  },
  
  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  },
  
  getItemCount() {
    return this.getCart().length;
  }
};

// ========== LOADING STATE MANAGER ==========

/**
 * Manage loading states for buttons and forms
 */
const LoadingState = {
  set(elementOrId, loading = true, loadingText = '') {
    const element = typeof elementOrId === 'string' ? 
      document.getElementById(elementOrId) : 
      elementOrId;
    
    if (!element) return;
    
    if (loading) {
      element.disabled = true;
      element.dataset.originalText = element.innerHTML;
      element.innerHTML = loadingText || '<i class="fas fa-spinner fa-spin"></i> Loading...';
      element.classList.add('loading');
    } else {
      element.disabled = false;
      element.innerHTML = element.dataset.originalText || element.innerHTML;
      element.classList.remove('loading');
    }
  },
  
  async withLoading(elementOrId, asyncFn, loadingText = 'Processing...') {
    this.set(elementOrId, true, loadingText);
    
    try {
      const result = await asyncFn();
      return result;
    } finally {
      this.set(elementOrId, false);
    }
  }
};

// ========== SESSION VALIDATION ==========

/**
 * Validate user session and handle expired tokens
 */
function validateUserSession() {
  if (!api.isLoggedIn()) {
    return false;
  }
  
  const user = api.getCurrentUser();
  if (!user || !user.name) {
    // Corrupted session
    AppState.user.clear();
    Toast.warning('Session expired. Please login again.');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return false;
  }
  
  return true;
}

// ========== ERROR HANDLER ==========

/**
 * Global error handler for API calls
 */
function handleApiError(error, context = '') {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
  
  if (error.status === 401 || error.message.includes('token')) {
    Toast.error('Session expired. Please login again.');
    AppState.user.clear();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  
  if (error.status === 404) {
    Toast.error('Resource not found');
    return;
  }
  
  if (error.status === 500 || !navigator.onLine) {
    Toast.error('Server error. Please try again later.');
    return;
  }
  
  Toast.error(error.message || 'An error occurred. Please try again.');
}

// ========== RETRY MECHANISM ==========

/**
 * Retry failed API calls with exponential backoff
 */
async function retryAsync(fn, maxRetries = 2, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const backoffDelay = delay * Math.pow(2, i);
      console.warn(`Retry ${i + 1}/${maxRetries} after ${backoffDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

// ========== GLOBAL INITIALIZATION ==========

/**
 * Global initialization function for all pages
 */
function initApp() {
  // Initialize toast system
  Toast.init();
  
  // Update cart badge on every page load
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  } else {
    CartManager.updateBadge();
  }
  
  // Validate user session
  validateUserSession();
  
  // Attach global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    handleApiError(event.reason, 'unhandled promise');
  });
  
  console.log('✅ ThemeMarket initialized');
}

// ========== EXPORT TO GLOBAL SCOPE ==========

if (typeof window !== 'undefined') {
  window.normalizeTheme = normalizeTheme;
  window.normalizeUser = normalizeUser;
  window.normalizeDownload = normalizeDownload;
  window.normalizeOrder = normalizeOrder;
  window.handleApiResponse = handleApiResponse;
  window.Toast = Toast;
  window.CartManager = CartManager;
  window.LoadingState = LoadingState;
  window.validateUserSession = validateUserSession;
  window.handleApiError = handleApiError;
  window.retryAsync = retryAsync;
  window.initApp = initApp;
}
