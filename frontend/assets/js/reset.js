// Reset Utility for ThemeMarket
// Use this to clear all AppState data and reset to defaults

function resetAllData() {
  if (confirm('⚠️ This will delete ALL your session data and reset to defaults.\n\nAre you sure you want to continue?')) {
    if (confirm('⚠️ FINAL WARNING: This action cannot be undone!\n\nClick OK to proceed.')) {
      // Clear all AppState data
      AppState.user.clear();
      AppState.cart.clear();
      AppState.settings.reset();
      AppState.themes.set([]);
      
      console.log('✓ All ThemeMarket state cleared');
      
      alert('✓ Data has been reset to defaults!\n\nYou will need to log in again.');
      
      // Reload page
      window.location.reload();
    }
  }
}

// Add reset button to dashboard (admin only)
function addResetButton() {
  if (api.isAdmin()) {
    const navbar = document.querySelector('.navbar-nav');
    if (navbar && !document.getElementById('resetBtn')) {
      const resetLi = document.createElement('li');
      resetLi.className = 'nav-item';
      resetLi.innerHTML = `
        <button 
          id="resetBtn"
          class="btn btn-sm btn-danger" 
          onclick="resetAllData()"
          style="margin-left: 10px; font-size: 12px;"
          title="Reset all data to defaults"
        >
          <i class="fas fa-trash"></i> Reset Data
        </button>
      `;
      navbar.appendChild(resetLi);
    }
  }
}

// Add to window
window.resetAllData = resetAllData;
window.addResetButton = addResetButton;
