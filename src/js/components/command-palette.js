document.addEventListener('DOMContentLoaded', () => {
    initializeCommandPalettes();
});

export function initializeCommandPalettes() {
    // Select all command palettes on the page
    const palettes = document.querySelectorAll('.kroma-command-palette');

    palettes.forEach((palette) => {
        initializeCommandPalette(palette);
    });
}

function initializeCommandPalette(palette) {
    let activeIndex = 0;

    // Insert header if not present
    if (!palette.querySelector('.kroma-palette-header')) {
        const header = document.createElement('div');
        header.classList.add('kroma-palette-header');
        header.innerHTML = `
          <input type="text" placeholder="Search commands..." aria-label="Search commands">
        `;
        palette.prepend(header);
    }

    // Insert footer if not present
    if (!palette.querySelector('.kroma-palette-footer')) {
        const footer = document.createElement('div');
        footer.classList.add('kroma-palette-footer');
        footer.innerHTML = `<strong>Esc</strong>`;
        palette.append(footer);
    }

    const searchInput = palette.querySelector('.kroma-palette-header input');
    const itemContainer = palette.querySelector('.kroma-palette-list');
    const items = itemContainer ? Array.from(itemContainer.querySelectorAll('.kroma-palette-item')) : [];

    if (!searchInput || !itemContainer) {
        console.warn('Command Palette: Missing required elements.');
        return;
    }

    /**
     * Opens the Command Palette
     */
    const openPalette = () => {
        setTimeout(() => {
            palette.classList.add('kroma-open');
            searchInput.value = '';
            searchInput.focus();
            filterItems('');
        }, 0); 
    };
    

    /**
     * Closes the Command Palette
     */
    const closePalette = () => {
        palette.classList.remove('kroma-open');
        activeIndex = 0;
        items.forEach((item) => item.removeAttribute('data-active'));
    };

    /**
     * Filters items based on the query
     * @param {string} query - User search input
     */
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

        const noResults = itemContainer.querySelector('.kroma-no-results');
        if (visibleCount === 0 && !noResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.classList.add('kroma-no-results');
            noResultsDiv.textContent = 'No commands found.';
            itemContainer.appendChild(noResultsDiv);
        } else if (visibleCount > 0 && noResults) {
            noResults.remove();
        }
    };

    /**
     * Handles keyboard navigation
     * @param {KeyboardEvent} e - The keydown event
     */
    const handleKeyboardNavigation = (e) => {
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
    };

    /**
     * Updates the active item during keyboard navigation
     * @param {Array} visibleItems - List of visible items
     */
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

    /**
     * Triggers a custom event when a command is executed
     * @param {HTMLElement} item - The selected palette item
     */
    const triggerCommand = (item) => {
        const commandName = item.dataset.command;
        const commandEvent = new CustomEvent('commandExecuted', {
            detail: { command: commandName },
        });
        palette.dispatchEvent(commandEvent);
        closePalette();
    };

    /**
     * Handles click events outside the palette
     * @param {MouseEvent} e - The click event
     */
    const handleOutsideClick = (e) => {
        if (!palette.contains(e.target) && palette.classList.contains('kroma-open')) {
            closePalette();
        }
    };

    // Event Listeners
    document.addEventListener('click', handleOutsideClick);

    palette.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && palette.classList.contains('kroma-open')) {
            closePalette();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        filterItems(query);
    });

    searchInput.addEventListener('keydown', handleKeyboardNavigation);

    items.forEach((item) => {
        item.addEventListener('click', () => triggerCommand(item));
    });

    // Find and set up the button associated with this palette
    const openButton = document.querySelector(`[data-open-palette="${palette.dataset.paletteId}"]`);
    if (openButton) {
        openButton.addEventListener('click', openPalette);
    }
}
