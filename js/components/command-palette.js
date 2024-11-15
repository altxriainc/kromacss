export function initializeCommandPalette() {
    const palette = document.getElementById('command-palette');
    const openButton = document.getElementById('open-palette');
    const searchInput = document.getElementById('command-search');
    const itemContainer = palette.querySelector('.palette-list');
    const items = Array.from(itemContainer.querySelectorAll('.palette-item'));
    let activeIndex = 0;
  
    // Open Command Palette
    openButton.addEventListener('click', () => {
      palette.classList.add('open');
      searchInput.value = '';
      searchInput.focus();
      filterItems('');
    });
  
    // Close Command Palette
    const closePalette = () => {
      palette.classList.remove('open');
      activeIndex = 0;
      items.forEach((item) => item.removeAttribute('data-active'));
    };
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && palette.classList.contains('open')) {
        closePalette();
      }
    });
  
    // Filter Items
    const filterItems = (query) => {
      const lowerQuery = query.toLowerCase();
      let visibleCount = 0;
  
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lowerQuery)) {
          item.style.display = 'block';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
  
      // Handle No Results
      if (visibleCount === 0) {
        if (!itemContainer.querySelector('.no-results')) {
          const noResults = document.createElement('div');
          noResults.classList.add('no-results');
          noResults.textContent = 'No commands found.';
          itemContainer.appendChild(noResults);
        }
      } else {
        const noResults = itemContainer.querySelector('.no-results');
        if (noResults) noResults.remove();
      }
    };
  
    // Search Input Handling
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      filterItems(query);
    });
  
    // Keyboard Navigation
    searchInput.addEventListener('keydown', (e) => {
      const visibleItems = items.filter((item) => item.style.display !== 'none');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % visibleItems.length;
        updateActiveItem(visibleItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
        updateActiveItem(visibleItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (visibleItems[activeIndex]) {
          triggerCommand(visibleItems[activeIndex]);
        }
      }
    });
  
    // Update Active Item
    const updateActiveItem = (visibleItems) => {
      visibleItems.forEach((item, index) => {
        if (index === activeIndex) {
          item.setAttribute('data-active', 'true');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.removeAttribute('data-active');
        }
      });
    };
  
    // Trigger Custom Event for Commands
    const triggerCommand = (item) => {
      const commandName = item.dataset.command;
      const commandEvent = new CustomEvent('commandExecuted', {
        detail: { command: commandName },
      });
      palette.dispatchEvent(commandEvent);
      closePalette();
    };
  
    // Click Handlers for Items
    items.forEach((item) => {
      item.addEventListener('click', () => {
        triggerCommand(item);
      });
    });
  }
  