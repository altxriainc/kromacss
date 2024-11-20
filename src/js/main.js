// Import components
import { toggleAccordion } from './components/accordion.js';
import { showHologram } from './components/hologram.js';
import { showTabContent } from './components/tabs.js';
import { showToast, dismissToast, startAutoDismiss, pauseAllProgressBars } from './components/toast.js';
import { Modal } from './components/modal.js';
import { MultiSelect } from './components/multiselect.js';
import { DateTimePicker } from './components/datetime-picker.js';
import { KromaSlideshow } from './components/slideshow.js';
import { initializeRatingComponents } from './components/rating.js';
import { initializeCalendarComponents } from './components/calendar.js';
import { KromaNavbar } from './components/navbar.js';
import { initializeFileUploadComponents } from './components/file-upload.js';
import { initializeCommandPalette } from './components/command-palette.js';
import { initializeCodeblock } from './components/codeblock.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize rating components
  initializeRatingComponents();

  // Initialize calendar components
  initializeCalendarComponents();

  // Initialize file upload components
  initializeFileUploadComponents();

  initializeCommandPalette();

  initializeCodeblock();

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
window.dismissToast = dismissToast;
window.startAutoDismiss = startAutoDismiss;
window.pauseAllProgressBars = pauseAllProgressBars;
window.Modal = Modal;
window.MultiSelect = MultiSelect;
window.DateTimePicker = DateTimePicker;
window.initializeRatingComponents = initializeRatingComponents;
window.initializeCalendarComponents = initializeCalendarComponents;

