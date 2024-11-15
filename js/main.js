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
import { initializeCalendarComponents } from './components/calendar.js';
import { Navbar } from './components/navbar.js';
import { initializeFileUploadComponents } from './components/file-upload.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize rating components
  initializeRatingComponents();

  // Initialize calendar components
  initializeCalendarComponents();

  // Initialize file upload components
  initializeFileUploadComponents();

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

  //initialize navbar
  let navMain = new Navbar('nav-main');

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
window.Slideshow = Slideshow;
window.initializeRatingComponents = initializeRatingComponents;
window.initializeCalendarComponents = initializeCalendarComponents;
window.Navbar = Navbar;
