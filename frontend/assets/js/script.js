// Theme data is now loaded from themesData.js
// const themes variable is replaced by THEMES_DATA from themesData.js

// Generate Theme Cards - Fetch from Backend with Local Fallback
async function generateThemeCards() {
    const grid = document.getElementById('themesGrid');
    if (!grid) return;
    
    // Ensure api is loaded
    if (typeof api === 'undefined') {
        console.error('API object not loaded. Using local data fallback.');
        // Fallback to local themes
        loadLocalThemes(grid);
        return;
    }
    
    try {
        // Try fetching themes from backend API
        const response = await api.getThemes();
        
        if (response.success && response.data && response.data.length > 0) {
            const backendThemes = response.data.map(theme => ({
                id: theme.id,
                title: theme.title,
                category: theme.category,
                image: theme.preview_image ? 
                    `assets/image/${theme.preview_image}` : 
                    'assets/image/theme6.jpeg',
                price: parseFloat(theme.price),
                rating: 4.5, // Default rating
                sales: parseInt(theme.download_count) || 0,
                badge: 'Premium'
            }));
            
            console.log(`✅ Loaded ${backendThemes.length} themes from backend`);
            renderThemeCards(backendThemes, grid);
        } else {
            console.warn('No themes from backend, using local data...');
            loadLocalThemes(grid);
        }
    } catch (error) {
        console.warn('Backend unavailable, falling back to local themes:', error.message);
        // FALLBACK TO LOCAL THEMES
        loadLocalThemes(grid);
    }
}

// Load themes from local data (fallback when backend is unavailable)
function loadLocalThemes(grid) {
    if (typeof THEMES_DATA === 'undefined') {
        console.error('No theme data available');
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                <h3>Unable to load themes</h3>
                <p class="text-muted">Theme data not available. Please refresh the page.</p>
                <button class="btn btn-primary mt-3" onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i> Retry
                </button>
            </div>
        `;
        return;
    }
    
    const localThemes = THEMES_DATA.map(theme => ({
        id: theme.id,
        title: theme.title,
        category: theme.category,
        image: theme.image,
        price: theme.price,
        rating: theme.rating,
        sales: theme.sales,
        badge: theme.badge
    }));
    
    console.log(`✅ Loaded ${localThemes.length} themes from local data`);
    renderThemeCards(localThemes, grid);
}

// Helper function to render theme cards
function renderThemeCards(themeList, grid) {
    // Cache themes for filtering
    window.currentThemes = themeList;
    
    const html = themeList.map(theme => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="theme-card">
                <div class="theme-image">
                    <img src="${theme.image}" alt="${theme.title}">
                    <div class="theme-badge">${theme.badge}</div>
                    <div class="theme-overlay">
                        <div class="overlay-btn" title="Preview">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="overlay-btn" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="overlay-btn" title="Wishlist">
                            <i class="fas fa-heart"></i>
                        </div>
                    </div>
                </div>
                <div class="theme-content">
                    <h3 class="theme-title">
                        <a href="product.html?id=${theme.id}">${theme.title}</a>
                    </h3>
                    <div class="theme-category">${theme.category}</div>
                    <div class="theme-meta">
                        <div class="theme-rating">
                            ${generateStars(theme.rating)}
                            <span>${theme.rating}</span>
                        </div>
                        <div class="theme-sales">
                            <i class="fas fa-download"></i> ${formatNumber(theme.sales)}
                        </div>
                    </div>
                    <div class="theme-footer">
                        <div class="theme-price">$${theme.price}</div>
                        <a href="product.html?id=${theme.id}" class="theme-btn">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

// Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Format Number
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        console.log('Searching for:', query);
        // Implement search logic here
    });
}

// Scroll to Top Button
function initScrollTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('active');
        } else {
            scrollBtn.classList.remove('active');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animate elements on scroll
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe theme cards and other elements
    document.querySelectorAll('.theme-card, .category-card, .feature-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Sticky Navbar
function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > navbarHeight) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
    });
}

// Cart Functionality - Enhanced with validation and sync
// Cart is now managed by AppState instead of localStorage

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const cartCount = CartManager ? CartManager.getItemCount() : AppState.cart.getItemCount();
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

function addToCart(themeId) {
    // Try backend first, fallback to local data
    api.getTheme(themeId)
        .then(response => {
            const theme = response.data;
            const added = CartManager ? CartManager.addToCart(theme) : legacyAddToCart(theme);
            if (added && !CartManager) {
                showNotification('Item added to cart!');
            }
        })
        .catch(error => {
            console.warn('Backend fetch failed, trying local data:', error);
            // Fallback to local THEMES_DATA
            const localTheme = window.THEMES_DATA?.find(t => Number(t.id) === Number(themeId));
            if (localTheme) {
                const added = CartManager ? CartManager.addToCart(localTheme) : legacyAddToCart(localTheme);
                if (added && !CartManager) {
                    showNotification('Item added to cart!');
                }
            } else {
                const errorMsg = CartManager ? 'Theme not found' : 'Failed to add item to cart';
                if (CartManager) {
                    Toast.error(errorMsg);
                } else {
                    showNotification(errorMsg, 'error');
                }
            }
        });
}

// Legacy add to cart (fallback when CartManager not available)
function legacyAddToCart(theme) {
    const normalizedTheme = normalizeTheme ? normalizeTheme(theme) : theme;
    const cartItem = {
        id: Number(normalizedTheme.id),
        title: normalizedTheme.title,
        price: parseFloat(normalizedTheme.price),
        image: normalizedTheme.image && normalizedTheme.image.startsWith('assets/') ? 
            normalizedTheme.image : 
            `assets/image/${normalizedTheme.image || 'theme6.jpeg'}`
    };
    
    // Check for duplicates using normalized ID
    const existingCart = AppState.cart.getItems();
    if (!existingCart.find(item => Number(item.id) === Number(normalizedTheme.id))) {
        AppState.cart.addItem(cartItem);
        updateCartBadge();
        return true;
    }
    return false;
}

function removeFromCart(themeId) {
    if (CartManager) {
        CartManager.removeFromCart(themeId);
    } else {
        AppState.cart.removeItem(themeId);
        updateCartBadge();
    }
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#dc3545'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
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

// Newsletter Form
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('Thank you for subscribing!');
            form.reset();
        }
    });
}

// Filter functionality for category page
let currentFilters = {
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'popular'
};

function applyFilters() {
    // Get themes from the grid or fetch from backend
    const themesToUse = window.currentThemes || [];
    let filtered = [...themesToUse];
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(theme => 
            theme.category.toLowerCase().includes(currentFilters.category.toLowerCase())
        );
    }
    
    // Price filter
    if (currentFilters.priceRange !== 'all') {
        const [min, max] = currentFilters.priceRange.split('-').map(Number);
        filtered = filtered.filter(theme => 
            theme.price >= min && theme.price <= max
        );
    }
    
    // Rating filter
    if (currentFilters.rating !== 'all') {
        const minRating = parseFloat(currentFilters.rating);
        filtered = filtered.filter(theme => theme.rating >= minRating);
    }
    
    // Sort
    switch (currentFilters.sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'sales':
            filtered.sort((a, b) => b.sales - a.sales);
            break;
        default:
            // popular - already sorted by sales
            filtered.sort((a, b) => b.sales - a.sales);
    }
    
    return filtered;
}

// Initialize filter listeners
function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            currentFilters.category = e.target.value;
            updateThemeDisplay();
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', function(e) {
            currentFilters.priceRange = e.target.value;
            updateThemeDisplay();
        });
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', function(e) {
            currentFilters.rating = e.target.value;
            updateThemeDisplay();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function(e) {
            currentFilters.sortBy = e.target.value;
            updateThemeDisplay();
        });
    }
}

function updateThemeDisplay() {
    const filtered = applyFilters();
    const grid = document.getElementById('themesGrid');
    
    if (!grid) return;
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h3>No themes found</h3>
                <p class="text-muted">Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    const html = filtered.map(theme => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="theme-card">
                <div class="theme-image">
                    <img src="${theme.image}" alt="${theme.title}">
                    <div class="theme-badge">${theme.badge}</div>
                    <div class="theme-overlay">
                        <div class="overlay-btn" title="Preview">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="overlay-btn" onclick="addToCart(${theme.id})" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="overlay-btn" title="Wishlist">
                            <i class="fas fa-heart"></i>
                        </div>
                    </div>
                </div>
                <div class="theme-content">
                    <h3 class="theme-title">
                        <a href="product.html?id=${theme.id}">${theme.title}</a>
                    </h3>
                    <div class="theme-category">${theme.category}</div>
                    <div class="theme-meta">
                        <div class="theme-rating">
                            ${generateStars(theme.rating)}
                            <span>${theme.rating}</span>
                        </div>
                        <div class="theme-sales">
                            <i class="fas fa-download"></i> ${formatNumber(theme.sales)}
                        </div>
                    </div>
                    <div class="theme-footer">
                        <div class="theme-price">$${theme.price}</div>
                        <a href="product.html?id=${theme.id}" class="theme-btn">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    initScrollAnimation();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    generateThemeCards();
    initSearch();
    initScrollTop();
    initScrollAnimation();
    initStickyNav();
    initNewsletter();
    initFilters();
    updateCartBadge();
    
    // Add click handlers for overlay buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.overlay-btn')) {
            const btn = e.target.closest('.overlay-btn');
            const title = btn.getAttribute('title');
            
            if (title === 'Preview') {
                showNotification('Preview feature coming soon!', 'info');
            } else if (title === 'Wishlist') {
                showNotification('Added to wishlist!');
            }
        }
    });
});

// Export for use in other pages
window.themeData = {
    themes: window.currentThemes || [],
    addToCart,
    removeFromCart,
    updateCartBadge,
    showNotification
};

// Product page - Load theme details from backend
const params = new URLSearchParams(window.location.search);
const themeId = params.get("id");

if (themeId) {
    api.getTheme(themeId).then(response => {
        const theme = response.data;
        
        const titleEl = document.querySelector(".product-title");
        const priceEl = document.querySelector(".product-price");
        const descEl = document.querySelector(".product-description");
        const mainImg = document.getElementById("mainImage");
        
        if (titleEl) titleEl.innerText = theme.title;
        if (priceEl) priceEl.innerText = "$" + parseFloat(theme.price);
        if (descEl) descEl.innerText = theme.description || 'Premium WordPress theme';
        if (mainImg) {
            mainImg.src = theme.preview_image ? 
                `assets/image/${theme.preview_image}` : 
                'assets/image/theme6.jpeg';
        }
    }).catch(error => {
        console.error('Failed to load theme:', error);
    });
}