// Dashboard synchronization with backend API
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  if (!api.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    // Load user info
    await loadUserInfo();
    
    // Load purchased themes
    await loadPurchasedThemes();
    
    // Load user downloads
    await loadUserDownloads();
    
    // Show admin upload form if ADMIN
    if (api.isAdmin()) {
      showAdminUploadForm();
      addResetButton(); // Add reset button for admin
    }
  } catch (error) {
    console.error('Dashboard initialization error:', error);
    handleApiError(error, 'dashboard init');
    if (error.message.includes('401') || error.message.includes('User not found')) {
      api.logout();
    }
  }
});

async function loadUserInfo() {
  try {
    const user = api.getCurrentUser();
    
    // Defensive check for undefined user
    if (!user || !user.name) {
      console.error('User data is corrupted or missing');
      Toast.error('Session data corrupted. Please login again.');
      api.logout();
      return;
    }
    
    // Update navbar
    const navAvatar = document.querySelector('.nav-avatar');
    if (navAvatar) {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      navAvatar.textContent = initials;
      navAvatar.setAttribute('data-tip', user.name);
      
      // Add click event to open profile modal
      navAvatar.onclick = () => openProfileModal(user);
    }
    
    // Update sidebar user card
    const sidebarAvatar = document.querySelector('.sidebar-avatar');
    const sidebarName = document.querySelector('.sidebar-user-name');
    const sidebarRole = document.querySelector('.sidebar-user-role');
    
    if (sidebarAvatar) {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      sidebarAvatar.textContent = initials;
    }
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = user.role === 'ADMIN' ? 'Administrator' : 'Premium Member';
    
    // Update page header greeting
    const greeting = document.querySelector('.page-header h1');
    if (greeting) {
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      greeting.textContent = `${timeGreeting}, ${user.name.split(' ')[0]} 👋`;
    }
  } catch (error) {
    console.error('Error loading user info:', error);
    handleApiError(error, 'loadUserInfo');
  }
}

async function loadUserDownloads() {
  try {
    const downloads = await api.getUserDownloads();
    renderDownloads(downloads);
  } catch (error) {
    console.error('Error loading downloads:', error);
    renderEmptyDownloads();
  }
}

function renderDownloads(downloads) {
  const container = document.querySelector('.card-box.animate-in.delay-5 > div');
  if (!container) return;
  
  if (!downloads || downloads.length === 0) {
    renderEmptyDownloads();
    return;
  }
  
  container.innerHTML = downloads.slice(0, 3).map(download => `
    <div class="download-item">
      <div class="download-thumb"><i class="fas fa-palette"></i></div>
      <div>
        <div class="download-name">${download.theme_title || 'Unknown Theme'}</div>
        <div class="download-date">${formatDate(download.download_date)}</div>
      </div>
      <button class="download-btn" onclick="handleDownload(${download.theme_id})" data-tip="Download">
        <i class="fas fa-download"></i>
      </button>
    </div>
  `).join('');
}

function renderEmptyDownloads() {
  const container = document.querySelector('.card-box.animate-in.delay-5 > div');
  if (!container) return;
  
  container.innerHTML = `
    <div style="text-align:center;padding:2rem;color:var(--muted);">
      <i class="fas fa-inbox" style="font-size:2.5rem;margin-bottom:1rem;display:block;"></i>
      <p>No downloads yet</p>
      <a href="category.html" class="btn-primary-tm" style="margin-top:1rem;">
        <i class="fas fa-search"></i> Browse Themes
      </a>
    </div>
  `;
}

async function handleDownload(themeId) {
  try {
    await api.downloadTheme(themeId);
    Toast.success('Download started!');
    // Reload downloads
    await loadUserDownloads();
  } catch (error) {
    handleApiError(error, 'download');
  }
}

function showAdminUploadForm() {
  const pageHeader = document.querySelector('.page-header');
  if (!pageHeader) return;
  
  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'btn-primary-tm';
  uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Theme';
  uploadBtn.onclick = showUploadModal;
  pageHeader.appendChild(uploadBtn);
}

function showUploadModal() {
  // Create modal dynamically
  const modal = document.createElement('div');
  modal.id = 'uploadModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
  
  modal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:2rem;max-width:500px;width:90%;">
      <h3 style="margin-bottom:1.5rem;color:var(--secondary);">
        <i class="fas fa-upload me-2"></i>Upload Theme
      </h3>
      <form id="uploadForm">
        <div class="mb-3">
          <label class="form-label">Theme Title</label>
          <input type="text" class="form-control" name="title" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" name="description" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Theme File (ZIP)</label>
          <input type="file" class="form-control" name="file" accept=".zip" required>
        </div>
        <div class="d-flex gap-2">
          <button type="submit" class="btn-primary-tm">
            <i class="fas fa-upload"></i> Upload
          </button>
          <button type="button" class="btn-secondary" onclick="closeUploadModal()" style="padding:0.6rem 1.5rem;border-radius:8px;border:1px solid #ddd;background:white;cursor:pointer;">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await api.uploadTheme(formData);
      alert('Theme uploaded successfully!');
      closeUploadModal();
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  });
}

function closeUploadModal() {
  const modal = document.getElementById('uploadModal');
  if (modal) modal.remove();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFileSize(bytes) {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + ' MB';
}

// Logout handler
function handleLogout() {
  if (confirm('Are you sure you want to log out?')) {
    api.logout();
  }
}

// Load purchased themes
async function loadPurchasedThemes() {
  try {
    const purchasedThemes = await api.getPurchasedThemes();
    renderPurchasedThemes(purchasedThemes);
  } catch (error) {
    console.error('Error loading purchased themes:', error);
    renderEmptyPurchasedThemes();
  }
}

function renderPurchasedThemes(themes) {
  // Find the purchases card container
  const container = document.querySelector('.card-box.animate-in.delay-4 > div');
  if (!container) return;
  
  if (!themes || themes.length === 0) {
    renderEmptyPurchasedThemes();
    return;
  }
  
  container.innerHTML = themes.map(theme => `
    <div class="download-item">
      <div class="download-thumb"><i class="fas fa-shopping-bag"></i></div>
      <div>
        <div class="download-name">${theme.title}</div>
        <div class="download-date">Purchased ${formatDate(theme.purchasedAt)} · ${formatFileSize(theme.fileSize)}</div>
      </div>
      <button class="download-btn" onclick="handlePurchaseDownload('${theme.id}')" data-tip="Download">
        <i class="fas fa-download"></i>
      </button>
    </div>
  `).join('');
}

function renderEmptyPurchasedThemes() {
  const container = document.querySelector('.card-box.animate-in.delay-4 > div');
  if (!container) return;
  
  container.innerHTML = `
    <div style="text-align:center; padding:2rem; color:var(--muted);">
      <i class="fas fa-shopping-cart" style="font-size:3rem; margin-bottom:1rem; opacity:0.3;"></i>
      <p>No purchases yet. Browse our themes and make your first purchase!</p>
      <a href="index.html" class="btn btn-primary btn-sm mt-2">Browse Themes</a>
    </div>
  `;
}

// Handle download from purchased themes
async function handlePurchaseDownload(themeId) {
  try {
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    await api.downloadTheme(themeId);
    
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'rgba(40,167,69,0.1)';
    btn.style.color = '#28a745';
    
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 2000);
  } catch (error) {
    alert(error.message || 'Download failed');
    const btn = event.target.closest('button');
    btn.innerHTML = '<i class="fas fa-download"></i>';
    btn.disabled = false;
  }
}

// Open profile modal with user details
async function openProfileModal(user) {
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  
  // Update modal content
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  document.getElementById('modalAvatar').textContent = initials;
  document.getElementById('modalUserName').textContent = user.name;
  document.getElementById('modalUserEmail').textContent = user.email;
  document.getElementById('modalFullName').textContent = user.name;
  document.getElementById('modalEmail').textContent = user.email;
  document.getElementById('modalRole').textContent = user.role === 'ADMIN' ? 'Administrator' : 'Premium Member';
  
  // Format join date
  const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
  const monthYear = joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('modalJoined').textContent = monthYear;
  
  // Load stats
  try {
    const purchases = await api.getPurchasedThemes();
    const downloads = await api.getUserDownloads();
    const orders = await api.getOrders();
    
    document.getElementById('statPurchases').textContent = purchases.length;
    document.getElementById('statDownloads').textContent = downloads.length;
    document.getElementById('statOrders').textContent = orders.length;
  } catch (error) {
    console.error('Error loading stats:', error);
    document.getElementById('statPurchases').textContent = '0';
    document.getElementById('statDownloads').textContent = '0';
    document.getElementById('statOrders').textContent = '0';
  }
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close profile modal
function closeProfileModal(event) {
  // If event exists and click was on the modal itself (not overlay), don't close
  if (event && event.target.classList.contains('profile-modal')) {
    return;
  }
  
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProfileModal();
    closeSettingsModal();
  }
});

// ═══════════════════════════════════════════════════════
// SETTINGS MODAL FUNCTIONS
// ═══════════════════════════════════════════════════════

// Open settings modal
function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;
  
  // Load saved settings
  loadSettings();
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Close settings modal
function closeSettingsModal(event) {
  if (event && event.target.classList.contains('settings-modal')) {
    return;
  }
  
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Load settings from AppState
function loadSettings() {
  const settings = AppState.settings.getAll();
  
  // Appearance
  document.getElementById('darkModeToggle').checked = settings.darkMode || false;
  document.getElementById('compactModeToggle').checked = settings.compactMode || false;
  document.getElementById('languageSelect').value = settings.language || 'en';
  
  // Notifications
  document.getElementById('emailNotifToggle').checked = settings.emailNotif !== false;
  document.getElementById('pushNotifToggle').checked = settings.pushNotif !== false;
  document.getElementById('marketingToggle').checked = settings.marketing || false;
  
  // Privacy
  document.getElementById('profileVisibilityToggle').checked = settings.profileVisibility !== false;
  document.getElementById('downloadHistoryToggle').checked = settings.downloadHistory !== false;
  
  // Data
  document.getElementById('autoSaveToggle').checked = settings.autoSave !== false;
}

// Save settings to AppState
function saveSettings() {
  const settings = {
    // Appearance
    darkMode: document.getElementById('darkModeToggle').checked,
    compactMode: document.getElementById('compactModeToggle').checked,
    language: document.getElementById('languageSelect').value,
    
    // Notifications
    emailNotif: document.getElementById('emailNotifToggle').checked,
    pushNotif: document.getElementById('pushNotifToggle').checked,
    marketing: document.getElementById('marketingToggle').checked,
    
    // Privacy
    profileVisibility: document.getElementById('profileVisibilityToggle').checked,
    downloadHistory: document.getElementById('downloadHistoryToggle').checked,
    
    // Data
    autoSave: document.getElementById('autoSaveToggle').checked,
    
    // Metadata
    updatedAt: new Date().toISOString()
  };
  
  AppState.settings.setAll(settings);
  
  // Apply settings immediately
  applySettings(settings);
  
  // Show success message
  alert('✅ Settings saved successfully!');
  
  // Close modal
  closeSettingsModal();
}

// Apply settings to the page
function applySettings(settings) {
  // Dark mode (placeholder - would need full dark mode CSS)
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // Compact mode
  if (settings.compactMode) {
    document.body.classList.add('compact-mode');
  } else {
    document.body.classList.remove('compact-mode');
  }
  
  console.log('Settings applied:', settings);
}

// Reset settings to defaults
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    AppState.settings.reset();
    loadSettings();
    alert('✅ Settings reset to defaults!');
  }
}

// Clear cache
function clearCache() {
  if (confirm('Clear all cached data? This will not delete your account or purchases.')) {
    // Clear AppState cache (themes, cart, etc.)
    AppState.themes.set([]);
    AppState.cart.clear();
    
    alert('✅ Cache cleared successfully!');
  }
}
