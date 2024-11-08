// Import components
import { toggleAccordion } from './components/accordion.js';
import { showHologram } from './components/hologram.js';
import { showTabContent } from './components/tabs.js';
import { showToast, showToastHistory, dismissToast, startAutoDismiss, pauseAllProgressBars, closeToastHistory } from './components/toast.js';
import { Modal } from './components/modal.js'; // Import the Modal component

// Initialize alert close functionality
document.querySelectorAll('.alert-dismissible .alert-close').forEach(button => {
  button.addEventListener('click', (e) => {
    const alert = e.target.closest('.alert');
    alert.classList.add('fade-out');
    setTimeout(() => alert.remove(), 400);
  });
});

// Export functions globally if needed
window.toggleAccordion = toggleAccordion;
window.showHologram = showHologram;
window.showTabContent = showTabContent;
window.showToast = showToast;
window.showToastHistory = showToastHistory;
window.dismissToast = dismissToast;
window.startAutoDismiss = startAutoDismiss;
window.pauseAllProgressBars = pauseAllProgressBars;
window.closeToastHistory = closeToastHistory;
window.Modal = Modal; // Export the Modal class globally
