// Profile page synchronization with backend API
document.addEventListener('DOMContentLoaded', async () => {
  if (!api.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const user = api.getCurrentUser();
    
    // Update profile header
    const usernameEl = document.querySelector('.username');
    if (usernameEl) {
      usernameEl.textContent = user.name;
    }
    
    // Update profile info
    const profileSection = document.getElementById('profile');
    if (profileSection) {
      profileSection.innerHTML = `
        <div class="card">
          <h3>Profile Information</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role === 'ADMIN' ? 'Administrator' : 'User'}</p>
        </div>
      `;
    }
    
    // Load downloads
    await loadProfileDownloads();
  } catch (error) {
    console.error('Profile initialization error:', error);
    if (error.message.includes('401')) {
      api.logout();
    }
  }
});

async function loadProfileDownloads() {
  try {
    const downloads = await api.getUserDownloads();
    const downloadsSection = document.getElementById('downloads');
    
    if (!downloadsSection) return;
    
    if (!downloads || downloads.length === 0) {
      downloadsSection.innerHTML = `
        <div class="card">
          <h3>Downloads</h3>
          <p>No downloads yet. Browse themes to get started!</p>
          <a href="category.html" class="btn btn-primary" style="background:#00403d;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:10px;">Browse Themes</a>
        </div>
      `;
      return;
    }
    
    downloadsSection.innerHTML = `
      <div class="card">
        <h3>Downloads (${downloads.length})</h3>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Theme</th>
                <th>Download Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${downloads.map(d => {
                const download = normalizeDownload(d);
                return `
                <tr>
                  <td><strong>${download.theme_title}</strong></td>
                  <td>${new Date(download.download_date).toLocaleDateString()}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="handleDownload(${download.theme_id})" style="background:#00403d;border:none;">
                      <i class="fas fa-download"></i> Download
                    </button>
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading downloads:', error);
  }
}

async function handleDownload(themeId) {
  try {
    await api.downloadTheme(themeId);
    Toast.success('Download started!');
    // Reload downloads
    await loadProfileDownloads();
  } catch (error) {
    handleApiError(error, 'download');
  }
}


