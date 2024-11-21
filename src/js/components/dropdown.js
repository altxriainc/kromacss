document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
  });
  
  function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.kroma-dropdown');
  
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.kroma-dropdown-trigger');
      const menu = dropdown.querySelector('.kroma-dropdown-menu');
      const isHoverEnabled = dropdown.dataset.onHover === 'true';
  
      if (!trigger || !menu) return;
  
      // Toggle dropdown visibility on click
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdown.classList.contains('kroma-open')) {
          closeDropdown(dropdown);
        } else {
          closeAllDropdowns();
          openDropdown(dropdown);
        }
      });
  
      // Hover behavior
      if (isHoverEnabled) {
        trigger.addEventListener('mouseenter', () => openDropdown(dropdown));
        dropdown.addEventListener('mouseleave', () => closeDropdown(dropdown));
      }
  
      // Close dropdown on outside click or Escape key
      document.addEventListener('click', () => closeDropdown(dropdown));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDropdown(dropdown);
      });
    });
  }
  
  function openDropdown(dropdown) {
    dropdown.classList.add('kroma-open');
  }
  
  function closeDropdown(dropdown) {
    dropdown.classList.remove('kroma-open');
  }
  
  function closeAllDropdowns() {
    document.querySelectorAll('.kroma-dropdown.kroma-open').forEach((dropdown) => {
      dropdown.classList.remove('kroma-open');
    });
  }
  