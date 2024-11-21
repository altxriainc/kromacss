// Import components
import { } from './components/alert.js';
import {  } from './components/accordion.js';
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
import { KromaSidebar } from './components/sidebar.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize rating components
  initializeRatingComponents();

  // Initialize calendar components
  initializeCalendarComponents();

  // Initialize file upload components
  initializeFileUploadComponents();

  initializeCommandPalette();

  initializeCodeblock();

});

// Export functions globally if needed
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
