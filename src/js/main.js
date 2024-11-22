// Import components
import { } from './components/alert.js';
import {  } from './components/accordion.js';
import { showHologram } from './components/hologram.js';
import { toggleTabContent } from './components/tabs.js';
import { showToast, dismissToast, startAutoDismiss, pauseAllProgressBars } from './components/toast.js';
import { Modal } from './components/modal.js';
import { MultiSelect } from './components/multiselect.js';
import { } from './components/datetime-picker.js';
import { KromaSlideshow } from './components/slideshow.js';
import { initializeRatingComponents } from './components/rating.js';
import { } from './components/calendar.js';
import { KromaNavbar } from './components/navbar.js';
import { initializeFileUploadComponents } from './components/file-upload.js';
import {  } from './components/command-palette.js';
import {  } from './components/codeblock.js';
import { KromaSidebar } from './components/sidebar.js';
import {} from './components/dropdown.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize rating components
  initializeRatingComponents();

  // Initialize file upload components
  initializeFileUploadComponents();

});

// Export functions globally if needed
window.showHologram = showHologram;
window.toggleTabContent = toggleTabContent;
window.showToast = showToast;
window.dismissToast = dismissToast;
window.startAutoDismiss = startAutoDismiss;
window.pauseAllProgressBars = pauseAllProgressBars;
window.Modal = Modal;
window.MultiSelect = MultiSelect;
window.initializeRatingComponents = initializeRatingComponents;

