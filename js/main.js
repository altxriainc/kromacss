// Import components
import { toggleAccordion } from './components/accordion.js';
import { showHologram } from './components/hologram.js';
import { showTabContent } from './components/tabs.js';
import { showToast, showToastHistory, dismissToast, startAutoDismiss, pauseAllProgressBars, closeToastHistory } from './components/toast.js';
import { Modal } from './components/modal.js';
import { MultiSelect } from './components/multiselect.js';
import { DateTimePicker } from './components/datetime-picker.js';
import { Slideshow } from './components/slideshow.js';
import { initializeRatingComponents } from './components/rating.js'; 


document.querySelectorAll('.alert .alert-close').forEach(button => {
  button.addEventListener('click', event => {
    const alert = button.closest('.alert');
    alert.style.maxHeight = alert.scrollHeight + 'px'; 
    alert.classList.add('fade-out');
    alert.addEventListener('transitionend', () => {
      if (alert.parentNode) alert.remove();
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize rating components
  initializeRatingComponents();

  // Initialize other components, if applicable
  document.querySelectorAll('.alert .alert-close').forEach(button => {
      button.addEventListener('click', event => {
          const alert = button.closest('.alert');
          alert.style.maxHeight = alert.scrollHeight + 'px'; 
          alert.classList.add('fade-out');
          alert.addEventListener('transitionend', () => {
              if (alert.parentNode) alert.remove();
          });
      });
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
window.Modal = Modal;
window.MultiSelect = MultiSelect;
window.DateTimePicker = DateTimePicker;
window.initializeRatingComponents = initializeRatingComponents;

