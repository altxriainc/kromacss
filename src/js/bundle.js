/*
Project: kromacss
Version: 1.0.2
Description: A modern, lightweight, and dependency-free CSS framework designed for simplicity, speed, and adaptability.
Author: Altxria Inc.
License: MIT
*/

/* --- accordion.js --- */
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.kroma-accordion-container');
  
    accordions.forEach(container => {
      const items = container.querySelectorAll('[data-header]');
  
      items.forEach(item => {
        const headerText = item.getAttribute('data-header');
        const contentText = item.getAttribute('data-content');
        const isSubItem = item.closest('.kroma-accordion-content');
  
        const header = document.createElement('button');
        header.classList.add(isSubItem ? 'kroma-accordion-sub-header' : 'kroma-accordion-header');
        header.setAttribute('aria-label', `Toggle ${headerText}`);
        header.textContent = headerText;
        header.onclick = () => toggleAccordion(header);
  
        const content = document.createElement('div');
        content.classList.add(isSubItem ? 'kroma-accordion-sub-content' : 'kroma-accordion-content');
        content.innerHTML = `<p>${contentText}</p>`;
  
        item.appendChild(header);
        item.appendChild(content);
        item.removeAttribute('data-header');
        item.removeAttribute('data-content');
      });
    });
  });
  
  function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const parentItem = content.parentElement;
    const isOpen = parentItem.classList.contains('kroma-accordion-item-open') || parentItem.classList.contains('kroma-accordion-sub-item-open');
  
    if (isOpen) {
      content.style.height = content.scrollHeight + 'px'; // Start with current height
      content.offsetHeight; // Force reflow
      content.style.height = '0'; // Collapse
  
      parentItem.classList.remove('kroma-accordion-item-open', 'kroma-accordion-sub-item-open');
      content.addEventListener('transitionend', function handler() {
        content.style.paddingTop = '0';
        content.style.paddingBottom = '0';
        content.removeEventListener('transitionend', handler);
      });
    } else {
      const parent = element.closest('.kroma-accordion-container, .kroma-accordion-item, .kroma-accordion-sub-item');
      const openSubItems = parent.querySelectorAll('.kroma-accordion-item-open > .kroma-accordion-content, .kroma-accordion-sub-item-open > .kroma-accordion-sub-content');
  
      openSubItems.forEach(subItem => {
        subItem.style.height = subItem.scrollHeight + 'px';
        subItem.offsetHeight; // Force reflow
        subItem.style.height = '0';
        subItem.parentElement.classList.remove('kroma-accordion-item-open', 'kroma-accordion-sub-item-open');
      });
  
      content.style.height = '0';
      content.style.paddingTop = '';
      content.style.paddingBottom = '';
      parentItem.classList.add('kroma-accordion-item-open', 'kroma-accordion-sub-item-open');
      content.offsetHeight; // Force reflow
      content.style.height = content.scrollHeight + 'px'; // Expand to full height
  
      content.addEventListener('transitionend', function handler() {
        content.style.height = 'auto';
        content.removeEventListener('transitionend', handler);
      });
    }
  }
  

/* --- alert.js --- */
document.addEventListener('DOMContentLoaded', () => {
  initializeAlerts(document);
});

/**
 * Initialize all alerts within a container
 * @param {HTMLElement} container - The container with alerts to initialize
 */
function initializeAlerts(container) {
  const alerts = container.querySelectorAll('.kroma-alert');
  alerts.forEach(alert => initializeAlert(alert));
}

/**
 * Initialize a single alert
 * @param {HTMLElement} alert - The alert element
 */
function initializeAlert(alert) {
  const iconMap = {
    success: '✔',
    error: '❌',
    warning: '⚠',
    info: 'ℹ',
  };

  // Ensure the icon is present
  let iconElement = alert.querySelector('.kroma-alert-icon');
  if (!iconElement) {
    iconElement = document.createElement('span');
    iconElement.classList.add('kroma-alert-icon');
    iconElement.textContent = alert.dataset.icon || iconMap[alert.dataset.variant] || '';
    alert.prepend(iconElement); // Insert icon at the beginning
  }

  // Ensure the content wrapper is present
  let contentElement = alert.querySelector('.kroma-alert-content');
  if (!contentElement) {
    contentElement = document.createElement('div');
    contentElement.classList.add('kroma-alert-content');
    alert.appendChild(contentElement);
  }

  // Ensure the title is present
  if (alert.dataset.title) {
    let titleElement = contentElement.querySelector('.kroma-alert-title');
    if (!titleElement) {
      titleElement = document.createElement('p');
      titleElement.classList.add('kroma-alert-title');
      titleElement.textContent = alert.dataset.title;
      contentElement.appendChild(titleElement);
    }
  }

  // Ensure the body is present
  if (alert.dataset.body) {
    let bodyElement = contentElement.querySelector('.kroma-alert-body');
    if (!bodyElement) {
      bodyElement = document.createElement('p');
      bodyElement.classList.add('kroma-alert-body');
      bodyElement.textContent = alert.dataset.body;
      contentElement.appendChild(bodyElement);
    }
  }

  // Ensure the close button is present
  let closeButton = alert.querySelector('.kroma-alert-close');
  if (!closeButton) {
    closeButton = document.createElement('button');
    closeButton.classList.add('kroma-alert-close');
    closeButton.setAttribute('aria-label', 'Close alert');
    closeButton.innerHTML = '&times;';
    alert.appendChild(closeButton);
  }

  // Add close button functionality
  closeButton.addEventListener('click', () => handleAlertClose(alert));
}

/**
 * Handle alert close functionality
 * @param {HTMLElement} alert - The alert to close
 */
function handleAlertClose(alert) {
  if (!alert) return;

  // Set the initial height for smooth transition
  alert.style.maxHeight = `${alert.scrollHeight}px`;

  // Trigger the transition
  requestAnimationFrame(() => {
    alert.classList.add('fade-out');
    alert.style.maxHeight = '0';
  });

  // Remove the alert after the animation ends
  alert.addEventListener('transitionend', () => {
    if (alert.parentNode) alert.remove();
  }, { once: true });
}


/* --- calendar.js --- */
export function initializeCalendarComponents() {
    document.querySelectorAll('.kroma-calendar').forEach(initCalendar);
}

function initCalendar(calendarElement) {
    ensureCalendarStructure(calendarElement);

    const monthYearDisplay = calendarElement.querySelector('.kroma-calendar-month-year');
    const prevButton = calendarElement.querySelector('.kroma-calendar-nav.prev');
    const nextButton = calendarElement.querySelector('.kroma-calendar-nav.next');
    const weekdaysContainer = calendarElement.querySelector('.kroma-calendar-weekdays');
    const datesContainer = calendarElement.querySelector('.kroma-calendar-dates');
    
    // Load events from data attribute if present
    const eventsData = calendarElement.getAttribute('data-events');
    const events = eventsData ? JSON.parse(eventsData) : {};

    const monthSelector = document.createElement('select');
    const yearSelector = document.createElement('select');

    addWeekdays(weekdaysContainer);
    addMonthYearSelectors(calendarElement, monthSelector, yearSelector);

    let currentDate = new Date();
    renderCalendar();

    // Navigation event listeners
    prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Month and year selectors
    monthSelector.addEventListener('change', () => {
        currentDate.setMonth(monthSelector.value);
        renderCalendar();
    });

    yearSelector.addEventListener('change', () => {
        currentDate.setFullYear(yearSelector.value);
        renderCalendar();
    });

    function renderCalendar() {
        datesContainer.innerHTML = '';
        monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();

        monthSelector.value = month;
        yearSelector.value = year;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty divs for offset
        for (let i = 0; i < firstDayOfMonth; i++) {
            datesContainer.appendChild(document.createElement('div'));
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateButton = document.createElement('button');
            dateButton.textContent = day;

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const selectedDate = new Date(year, month, day);

            if (selectedDate.toDateString() === today.toDateString()) {
                dateButton.setAttribute('data-today', 'true');
            }

            if (calendarElement.getAttribute('data-type') === 'with-items' && events[dateKey]) {
                events[dateKey].forEach(event => {
                    const eventLabel = document.createElement('div');
                    eventLabel.className = 'date-item';
                    eventLabel.textContent = event;
                    dateButton.appendChild(eventLabel);
                });
            }

            dateButton.addEventListener('click', () => {
                const dateEvent = new CustomEvent('dateSelected', {
                    detail: { date: selectedDate, events: events[dateKey] || [], element: calendarElement }
                });
                calendarElement.dispatchEvent(dateEvent);
            });

            datesContainer.appendChild(dateButton);
        }
    }
}

function ensureCalendarStructure(calendarElement) {
    // Check and render missing calendar structure
    if (!calendarElement.querySelector('.kroma-calendar-header')) {
        const header = document.createElement('div');
        header.className = 'kroma-calendar-header';

        const prevButton = document.createElement('button');
        prevButton.className = 'kroma-calendar-nav prev';
        prevButton.setAttribute('aria-label', 'Previous Month');
        prevButton.textContent = '‹';

        const nextButton = document.createElement('button');
        nextButton.className = 'kroma-calendar-nav next';
        nextButton.setAttribute('aria-label', 'Next Month');
        nextButton.textContent = '›';

        const monthYearDisplay = document.createElement('div');
        monthYearDisplay.className = 'kroma-calendar-month-year';

        header.appendChild(prevButton);
        header.appendChild(monthYearDisplay);
        header.appendChild(nextButton);

        calendarElement.appendChild(header);
    }

    if (!calendarElement.querySelector('.kroma-calendar-body')) {
        const body = document.createElement('div');
        body.className = 'kroma-calendar-body';

        const weekdays = document.createElement('div');
        weekdays.className = 'kroma-calendar-weekdays';

        const dates = document.createElement('div');
        dates.className = 'kroma-calendar-dates';

        body.appendChild(weekdays);
        body.appendChild(dates);

        calendarElement.appendChild(body);
    }
}

function addWeekdays(container) {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    container.innerHTML = ''; // Clear weekdays if already present
    weekdays.forEach(day => {
        const weekdayElement = document.createElement('div');
        weekdayElement.textContent = day;
        container.appendChild(weekdayElement);
    });
}

function addMonthYearSelectors(calendarElement, monthSelector, yearSelector) {
    if (calendarElement.querySelector('.kroma-calendar-selectors')) return;

    const currentYear = new Date().getFullYear();

    for (let m = 0; m < 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = new Date(0, m).toLocaleString('default', { month: 'long' });
        monthSelector.appendChild(option);
    }

    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelector.appendChild(option);
    }

    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'kroma-calendar-selectors';
    selectorContainer.appendChild(monthSelector);
    selectorContainer.appendChild(yearSelector);

    calendarElement.querySelector('.kroma-calendar-header').appendChild(selectorContainer);
}

// Automatically initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeCalendarComponents);


/* --- codeblock.js --- */
document.addEventListener('DOMContentLoaded', () => {
  initializeCodeblock(document);
});

export function initializeCodeblock() {
  document.querySelectorAll('.kroma-code-block').forEach((block) => {
    // Check if buttons are already rendered to avoid duplication
    if (block.querySelector('.kroma-code-block-header')) return;

    // Create action buttons container
    const header = document.createElement('div');
    header.className = 'kroma-code-block-header';

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'kroma-action-btn kroma-copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code');
    copyBtn.addEventListener('click', () => {
      const codeElement = block.querySelector('pre code');
      const rawCode = codeElement.getAttribute('data-raw-code'); // Use raw, unescaped code
      navigator.clipboard.writeText(rawCode).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });

    // Fullscreen Button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'kroma-action-btn kroma-fullscreen-btn';
    fullscreenBtn.textContent = 'Full Screen';
    fullscreenBtn.setAttribute('aria-label', 'Toggle full screen');
    fullscreenBtn.addEventListener('click', () => {
      block.classList.toggle('kroma-fullscreen');
      fullscreenBtn.textContent = block.classList.contains('kroma-fullscreen')
        ? 'Exit Full Screen'
        : 'Full Screen';
    });

    // Append buttons to header
    header.appendChild(copyBtn);
    header.appendChild(fullscreenBtn);
    block.appendChild(header);

    // Escape HTML in the <code> block and store original content
    const codeElement = block.querySelector('pre code');
    if (codeElement) {
      const rawHTML = codeElement.innerHTML.trim(); // Raw content
      const escapedHTML = rawHTML
        .replace(/&/g, '&amp;') // Escape &
        .replace(/</g, '&lt;') // Escape <
        .replace(/>/g, '&gt;') // Escape >
        .replace(/"/g, '&quot;') // Escape "
        .replace(/'/g, '&#039;'); // Escape '
      codeElement.innerHTML = escapedHTML; // Use escaped content
      codeElement.setAttribute('data-raw-code', rawHTML); // Store raw code for copying
    }
  });
}


/* --- command-palette.js --- */
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


/* --- datetime-picker.js --- */
export class DateTimePicker {
    constructor(elementId, { format = 'YYYY-MM-DD HH:mm', includeTime = true, variant = 'primary' } = {}) {
        this.container = document.getElementById(elementId);
        this.format = format;
        this.includeTime = includeTime;
        this.variant = variant;
        this.currentDate = new Date();
        this.selectedDate = new Date();

        this.init();
    }

    init() {
        this.createHTMLStructure();
        this.applyVariantStyles();
        this.addEventListeners();
        this.buildCalendar();
        this.addQuickSelectButtons();
        if (this.includeTime) {
            this.addTimeSelectors();
        }
    }

    createHTMLStructure() {
        // Create input field
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.classList.add('kroma-datetime-input');
        this.input.placeholder = 'Select Date';
        this.input.setAttribute('aria-label', `${this.variant} DateTime Input`);
        this.container.appendChild(this.input);

        // Create the picker container
        this.picker = document.createElement('div');
        this.picker.classList.add('kroma-datetime-picker');
        this.picker.setAttribute('aria-hidden', 'true');
        this.container.appendChild(this.picker);

        // Create calendar header
        const calendarHeader = document.createElement('div');
        calendarHeader.classList.add('kroma-calendar-header');
        this.picker.appendChild(calendarHeader);

        // Previous month button
        const prevMonthButton = document.createElement('button');
        prevMonthButton.classList.add('kroma-prev-month');
        prevMonthButton.setAttribute('aria-label', 'Previous Month');
        prevMonthButton.textContent = '<';
        calendarHeader.appendChild(prevMonthButton);

        // Month and year display
        this.monthHeader = document.createElement('span');
        this.monthHeader.classList.add('kroma-calendar-month');
        calendarHeader.appendChild(this.monthHeader);

        this.yearHeader = document.createElement('span');
        this.yearHeader.classList.add('kroma-calendar-year');
        calendarHeader.appendChild(this.yearHeader);

        // Next month button
        const nextMonthButton = document.createElement('button');
        nextMonthButton.classList.add('kroma-next-month');
        nextMonthButton.setAttribute('aria-label', 'Next Month');
        nextMonthButton.textContent = '>';
        calendarHeader.appendChild(nextMonthButton);

        // Calendar grid
        this.calendarGrid = document.createElement('div');
        this.calendarGrid.classList.add('kroma-calendar-grid');
        this.picker.appendChild(this.calendarGrid);

        // Quick select container
        this.quickSelectContainer = document.createElement('div');
        this.quickSelectContainer.classList.add('kroma-quick-select');
        this.picker.appendChild(this.quickSelectContainer);
    }

    addEventListeners() {
        this.input.addEventListener('focus', () => this.togglePicker(true));
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && !this.picker.contains(e.target)) {
                this.togglePicker(false);
            }
        });

        this.picker.querySelector('.kroma-prev-month').addEventListener('click', () => this.changeMonth(-1));
        this.picker.querySelector('.kroma-next-month').addEventListener('click', () => this.changeMonth(1));
    }

    togglePicker(open) {
        this.picker.classList.toggle('kroma-active', open);
    }

    buildCalendar() {
        this.monthHeader.textContent = this.capitalizeFirstLetter(this.currentDate.toLocaleString('default', { month: 'long' }));
        this.yearHeader.textContent = `${this.currentDate.getFullYear()}`;
        this.calendarGrid.innerHTML = '';

        const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            const filler = document.createElement('div');
            filler.classList.add('kroma-calendar-day', 'disabled');
            this.calendarGrid.appendChild(filler);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('kroma-calendar-day');
            day.textContent = i;
            day.setAttribute('tabindex', 0);
            day.setAttribute('role', 'button');
            day.setAttribute('aria-label', `Select ${this.formatDate(this.currentDate, i)}`);
            day.addEventListener('click', () => this.selectDate(i));

            if (this.isCurrentMonth() && this.isToday(i)) {
                day.classList.add('kroma-current-day');
            }

            if (this.isSelectedMonth() && this.isSelectedDay(i)) {
                day.classList.add('kroma-selected-day');
            }

            this.calendarGrid.appendChild(day);
        }
    }

    changeMonth(step) {
        this.currentDate.setMonth(this.currentDate.getMonth() + step);
        this.updateSelectedDateForMonthChange();
        this.buildCalendar();
    }

    selectDate(day) {
        this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        this.updateInputValue();
        this.buildCalendar();
    }

    isToday(day) {
        const today = new Date();
        return day === today.getDate() && this.currentDate.getMonth() === today.getMonth() && this.currentDate.getFullYear() === today.getFullYear();
    }

    isSelectedDay(day) {
        return day === this.selectedDate.getDate() && this.currentDate.getMonth() === this.selectedDate.getMonth() && this.currentDate.getFullYear() === this.selectedDate.getFullYear();
    }

    isCurrentMonth() {
        const today = new Date();
        return this.currentDate.getMonth() === today.getMonth() && this.currentDate.getFullYear() === today.getFullYear();
    }

    isSelectedMonth() {
        return this.currentDate.getMonth() === this.selectedDate.getMonth() && this.currentDate.getFullYear() === this.selectedDate.getFullYear();
    }

    formatDate(date, day = null) {
        const dateObj = new Date(date.getFullYear(), date.getMonth(), day || date.getDate());
        let formattedDate = dateObj.toISOString().slice(0, 10);
        if (this.includeTime) {
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            formattedDate += ` ${hours}:${minutes}`;
        }
        return formattedDate;
    }

    updateInputValue() {
        const year = this.selectedDate.getFullYear();
        const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.selectedDate.getDate()).padStart(2, '0');
        const hours = String(this.selectedDate.getHours()).padStart(2, '0');
        const minutes = String(this.selectedDate.getMinutes()).padStart(2, '0');

        let formattedDate = `${year}-${month}-${day}`;
        if (this.includeTime) {
            formattedDate += ` ${hours}:${minutes}`;
        }
        this.input.value = formattedDate;
    }

    updateSelectedDateForMonthChange() {
        const daysInCurrentMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        const dayToSet = Math.min(this.selectedDate.getDate(), daysInCurrentMonth);
        this.selectedDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), dayToSet);
        this.updateInputValue();
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    addQuickSelectButtons() {
        this.quickSelectContainer.innerHTML = '';
        const quickDates = {
            Yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
            Today: new Date(),
            Tomorrow: new Date(new Date().setDate(new Date().getDate() + 1)),
        };

        Object.entries(quickDates).forEach(([label, date]) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.classList.add('kroma-quick-select-button');
            button.addEventListener('click', () => {
                this.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.selectedDate.getHours(), this.selectedDate.getMinutes());
                this.currentDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                this.updateInputValue();
                this.buildCalendar();
            });
            this.quickSelectContainer.appendChild(button);
        });
    }

    addTimeSelectors() {
        const timeSelectorContainer = document.createElement('div');
        timeSelectorContainer.classList.add('kroma-time-selector');

        const hourInput = document.createElement('input');
        hourInput.type = 'number';
        hourInput.min = 0;
        hourInput.max = 23;
        hourInput.placeholder = 'HH';
        hourInput.value = this.selectedDate.getHours().toString().padStart(2, '0');

        const minuteInput = document.createElement('input');
        minuteInput.type = 'number';
        minuteInput.min = 0;
        minuteInput.max = 59;
        minuteInput.placeholder = 'MM';
        minuteInput.value = this.selectedDate.getMinutes().toString().padStart(2, '0');

        hourInput.addEventListener('input', () => {
            this.selectedDate.setHours(hourInput.value);
            this.updateInputValue();
        });
        minuteInput.addEventListener('input', () => {
            this.selectedDate.setMinutes(minuteInput.value);
            this.updateInputValue();
        });

        timeSelectorContainer.appendChild(hourInput);
        timeSelectorContainer.appendChild(minuteInput);
        this.picker.appendChild(timeSelectorContainer);
    }

    addConfirmButton() {
        const confirmButton = document.createElement('button');
        confirmButton.classList.add('kroma-confirm-button');
        confirmButton.textContent = 'OK';
        confirmButton.addEventListener('click', () => this.togglePicker(false));
        this.picker.appendChild(confirmButton);
    }

    applyVariantStyles() {
        this.container.dataset.variant = this.variant;
        this.input.classList.add(`kroma-datetime-input-${this.variant}`);
        this.picker.classList.add(`kroma-datetime-picker-${this.variant}`);
    }
}

// Initialize DateTimePicker
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.kroma-datetime-picker-container').forEach((el) => {
        const format = el.dataset.format || 'YYYY-MM-DD HH:mm';
        const includeTime = el.dataset.time !== 'false';
        const variant = el.dataset.variant || 'primary';
        new DateTimePicker(el.id, { format, includeTime, variant });
    });
});


/* --- dropdown.js --- */
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
  

/* --- file-upload.js --- */
export function initializeKromaFileUploadComponents() {
    document.querySelectorAll('.kroma-file-upload').forEach((fileUpload) => {
        const dropzone = fileUpload.querySelector('.kroma-file-upload-dropzone');
        const input = fileUpload.querySelector('.kroma-file-upload-input');
        const isMultiple = fileUpload.dataset.multiple === 'true';
        const fileList = fileUpload.querySelector('.kroma-file-upload-list');
        const fileNameDisplay = fileUpload.querySelector('.kroma-file-upload-filename');
        const fileProgressDisplay = fileUpload.querySelector('.kroma-file-upload-progress');

        // Handle click to open file selector
        dropzone.addEventListener('click', () => input.click());

        // Handle file selection
        input.addEventListener('change', (event) => {
            handleFiles(event.target.files);
        });

        // Drag and drop functionality
        dropzone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropzone.classList.add('dragging');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragging');
        });

        dropzone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropzone.classList.remove('dragging');
            const files = event.dataTransfer.files;
            input.files = files; // Update input's file list
            handleFiles(files);
        });

        // Handle files
        function handleFiles(files) {
            const fileArray = Array.from(files);
            if (fileArray.length === 0) return;

            if (isMultiple && fileList) {
                fileList.innerHTML = ''; // Clear existing list
                fileArray.forEach((file) => appendFileToList(file, fileList));
            } else if (fileNameDisplay && fileProgressDisplay) {
                const file = fileArray[0];
                fileNameDisplay.textContent = file.name;
                fileProgressDisplay.textContent = 'Ready to upload';
            }
        }

        // Append a file to the list
        function appendFileToList(file, listContainer) {
            const listItem = document.createElement('div');
            listItem.className = 'kroma-file-upload-list-item';
            listItem.innerHTML = `
                <span>${file.name}</span>
                <button aria-label="Remove file">&times;</button>
            `;
            // Handle remove file
            listItem.querySelector('button').addEventListener('click', () => {
                listItem.remove();
            });
            listContainer.appendChild(listItem);
        }
    });
}

// Automatically initialize components on DOM load
document.addEventListener('DOMContentLoaded', initializeKromaFileUploadComponents);


/* --- hologram.js --- */
export function showHologram(titleText, subtitleText, variant = 'primary', intensity = 'medium', duration = 6000) {
    // Remove any existing holograms and dim overlay
    document.querySelectorAll('.kroma-hologram-overlay, .kroma-body-dim').forEach(el => el.remove());

    // Create dim overlay for background
    const dimOverlay = document.createElement('div');
    dimOverlay.className = 'kroma-body-dim';
    document.body.appendChild(dimOverlay);

    // Create hologram overlay container
    const hologramOverlay = document.createElement('div');
    hologramOverlay.className = 'kroma-hologram-overlay';
    hologramOverlay.setAttribute('data-variant', variant);
    hologramOverlay.setAttribute('data-intensity', intensity);
    
    // Create and configure title element
    const title = document.createElement('div');
    title.className = 'kroma-hologram-title';
    title.textContent = titleText;
    hologramOverlay.appendChild(title);

    // Create and configure subtitle element
    const subtitle = document.createElement('div');
    subtitle.className = 'kroma-hologram-subtitle';
    subtitle.textContent = subtitleText;
    hologramOverlay.appendChild(subtitle);

    // Append overlay to body
    document.body.appendChild(hologramOverlay);

    // Remove hologram and dim overlay after animation
    setTimeout(() => {
        hologramOverlay.remove();
        dimOverlay.remove();
    }, duration);
}


/* --- modal.js --- */
class KromaModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal.closest('.kroma-modal-overlay');
        this.closeButton = this.modal.querySelector('.kroma-modal-close');
        this.init();
    }

    init() {
        // Close button in header
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        // Close modal when clicking on overlay (if allowed)
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay && !this.overlay.classList.contains('no-close-on-outside-click')) {
                this.close();
            }
        });

        // Close modal when clicking a button with the class "close-modal" inside the modal
        this.modal.querySelectorAll('.close-modal').forEach((button) => {
            button.addEventListener('click', () => this.close());
        });
    }

    open() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    static initAll() {
        document.querySelectorAll('.kroma-modal-overlay').forEach((overlay) => {
            const modalId = overlay.querySelector('.kroma-modal').id;
            new KromaModal(modalId);
        });
    }
}

// Initialize modals on document load
document.addEventListener('DOMContentLoaded', () => {
    KromaModal.initAll();

    // Trigger modal open via data attributes
    document.querySelectorAll('[data-toggle="kroma-modal"]').forEach((trigger) => {
        const targetId = trigger.dataset.target;
        trigger.addEventListener('click', () => {
            const modal = new KromaModal(targetId);
            modal.open();
        });
    });
});


/* --- multiselect.js --- */
class KromaMultiSelect {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.dropdown = this.element.querySelector('.kroma-multiselect-dropdown');
        this.optionsContainer = this.element.querySelector('.kroma-multiselect-options');
        this.searchInput = this.element.querySelector('.kroma-multiselect-search');
        this.clearButton = this.element.querySelector('.kroma-clear-selection');
        this.selectedOptions = [];

        this.init();
    }

    init() {
        this.dropdown.addEventListener('click', () => {
            this.toggleOptions();
            this.searchInput.focus();
        });

        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.closeOptions();
            }
        });

        this.optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.kroma-multiselect-option');
            if (option) {
                this.toggleSelection(option);
                this.searchInput.value = '';
                this.filterOptions();
            }
        });

        this.searchInput.addEventListener('input', () => {
            this.filterOptions();
        });

        this.clearButton.addEventListener('click', () => {
            this.clearSelections();
        });
    }

    toggleOptions() {
        this.optionsContainer.classList.toggle('active');
    }

    closeOptions() {
        this.optionsContainer.classList.remove('active');
    }

    toggleSelection(option) {
        const value = option.getAttribute('data-value');
        if (this.selectedOptions.includes(value)) {
            this.selectedOptions = this.selectedOptions.filter(item => item !== value);
            option.classList.remove('selected');
        } else {
            this.selectedOptions.push(value);
            option.classList.add('selected');
        }
        this.updateSelectedDisplay();
    }

    updateSelectedDisplay() {
        const chipsContainer = this.element.querySelector('.kroma-multiselect-chips');
        chipsContainer.innerHTML = '';

        this.selectedOptions.forEach(value => {
            const chip = document.createElement('div');
            chip.classList.add('kroma-multiselect-chip');
            chip.textContent = value;

            const removeIcon = document.createElement('span');
            removeIcon.classList.add('kroma-chip-remove');
            removeIcon.innerHTML = '&times;';
            removeIcon.setAttribute('aria-label', `Remove ${value}`);
            removeIcon.addEventListener('click', () => {
                this.removeSelection(value);
            });

            chip.appendChild(removeIcon);
            chipsContainer.appendChild(chip);
        });

        this.clearButton.style.display = this.selectedOptions.length > 0 ? 'inline-block' : 'none';
    }

    removeSelection(value) {
        const option = this.optionsContainer.querySelector(`[data-value="${value}"]`);
        if (option) {
            option.classList.remove('selected');
        }
        this.selectedOptions = this.selectedOptions.filter(item => item !== value);
        this.updateSelectedDisplay();
    }

    clearSelections() {
        this.selectedOptions = [];
        this.optionsContainer.querySelectorAll('.kroma-multiselect-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.updateSelectedDisplay();
    }

    filterOptions() {
        const query = this.searchInput.value.toLowerCase();
        this.optionsContainer.querySelectorAll('.kroma-multiselect-option').forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(query) ? 'block' : 'none';
        });
    }
}

// Initialize all MultiSelect components
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.kroma-multiselect').forEach((el) => {
        new KromaMultiSelect(el.id);
    });
});


/* --- navbar.js --- */
export class KromaNavbar {

    /*
    id (string) = navbar element id
    siteTitle (string) = title to display as alt or instead of image logo

    requires basic preexisting html structure with desired data, such as:

        <!--main nav menu-->
        <nav class="kroma-navbar">

            <!--logo-->
            <img src="./src/images/dummy-logo.png">

            <!--menu links-->
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contacts</a>

        </nav>
    
    */

    constructor(id = 'nav-main', siteTitle = ('x' == 'x' ? undefined : 'x')){

        //get navbar container
        this.id = id;
        this.nav = document.getElementById(id);
        if(!this.nav){ throw new Error(`element "${id}" not found`); }
        if(this.nav.classList.contains('kroma-navbar-set')){ throw new Error(`navbar already set.`); }
        this.nav.classList.add('kroma-navbar-set');

        //get logo path/text
        this.hasLogo = (this.nav.querySelector('img') && this.nav.querySelector('img').src) ? true : false;
        this.logoPath = this.hasLogo ? this.nav.querySelector('img').src : undefined;
        this.siteTitle = document.querySelector('head title');
        this.siteTitle = siteTitle ?? (this.siteTitle.innerText ?? '');


        //get menu items
        this.hasMenu = this.nav.querySelector('a') ? true : false;
        this.pages = [];
        this.nav.querySelectorAll('a').forEach((a)=>{

            var page = {};
            page.href = a.href ?? '';
            page.text = a.innerText ?? 'Page';
            this.pages.push(page);
            
        
        });

        //remove anything else in navbar container
        this.nav.innerHTML = "";

        //add logo or simple text with site title
        this.addLogo();

        //add menu toggle and list
        if(this.hasMenu){

            this.addToggle();
            this.addMenu();


        }

        

    }

    addLogo(){

        var logo_cnt = document.createElement('div');
        logo_cnt.classList.add('nav-logo');

        if(this.hasLogo){
            
            var logo_img = document.createElement('img');
            logo_img.src = this.logoPath;
            logo_img.alt = this.siteTitle;
            logo_cnt.appendChild(logo_img);
            

        }

        var logo_txt = document.createElement('span');
        logo_txt.innerText = this.siteTitle;
        logo_cnt.appendChild(logo_txt);


        this.nav.appendChild(logo_cnt);

    }


    addToggle(){


        var toggle = document.createElement('div');
        

        toggle.classList.add('nav-toggle');
        toggle.addEventListener('click',function(){if(this.classList.contains('show')){this.classList.remove('show');}else{this.classList.add('show');}});

        for(var i = 1; i <= 3; i++){

            var line = document.createElement('span');
            line.id = ('nav-line-'+i);
            line.classList.add('nav-line');
            toggle.appendChild(line);

        }

        this.nav.appendChild(toggle);


    }

    addMenu(){

        var menu = document.createElement('div');
        menu.classList.add('nav-menu');
        var ul = document.createElement('ul');
        
        for(var i = 0; i < this.pages.length; i++){

            var li = document.createElement('li');
            var a = document.createElement('a');
            if(this.pages[i].href.length > 0){ a.href = this.pages[i].href; }
            a.innerText = this.pages[i].text;
            li.appendChild(a);
            ul.appendChild(li);

        }

        menu.appendChild(ul);
        this.nav.appendChild(menu);


    }


}




//initialize first available
document.addEventListener("DOMContentLoaded", () => {

    window.KromaNavbar = KromaNavbar;
    if(!window.kromaNavs){ window.kromaNavs = []; }
    var domNavs = document.querySelectorAll('.kroma-navbar');
    if(domNavs && domNavs[0]){  

        domNavs[0].id = (domNavs[0].id ?? '').length > 0 ? domNavs[0].id : ( 'kroma-navbar-' + window.kromaNavs.length );
        window.kromaNavs[window.kromaNavs.length] = new KromaNavbar( domNavs[0].id );
        
    }

});

/* --- rating.js --- */
export function initializeKromaRatingComponents() {
    // Automatically initialize all rating components on the page
    document.querySelectorAll('.kroma-rating').forEach(initializeRatingComponent);
}

function initializeRatingComponent(ratingElement) {
    const stars = ratingElement.querySelectorAll('.kroma-star');
    const isDisabled = ratingElement.dataset.disabled === "true";

    if (isDisabled) return; // Skip interactivity if the component is disabled

    // Helper function to update star visual state
    const updateStars = (ratingValue) => {
        stars.forEach((star, index) => {
            star.classList.toggle('filled', index < ratingValue);
        });
    };

    // Set initial rating from data attribute or default to 0
    const initialRating = parseInt(ratingElement.getAttribute('data-rating'), 10) || 0;
    updateStars(initialRating);

    // Add event listeners for interactivity
    stars.forEach((star, index) => {
        // On click, set the rating
        star.addEventListener('click', () => {
            const newRating = index + 1;
            ratingElement.setAttribute('data-rating', newRating);
            updateStars(newRating);

            // Dispatch custom "ratingSet" event
            const ratingEvent = new CustomEvent('ratingSet', {
                detail: { rating: newRating, element: ratingElement },
            });
            ratingElement.dispatchEvent(ratingEvent);
        });

        // On hover, preview the rating
        star.addEventListener('mouseover', () => updateStars(index + 1));
        star.addEventListener('mouseleave', () =>
            updateStars(parseInt(ratingElement.getAttribute('data-rating'), 10) || 0)
        );
    });
}

// Initialize all rating components on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeKromaRatingComponents);


/* --- sidebar.js --- */
export class KromaSidebar {

    /*
    id (string) = navbar element id
    siteTitle (string) = title to display as alt or instead of image logo

    requires basic preexisting html structure with desired data, such as:

    <!--main sidebar menu-->
    <div class="kroma-sidebar" data-title="The Sidebar">

        <!--logo img-->
        <img src="./src/images/star.png">

        <!--menu links-->
        <i class="fa-solid fa-home"></i>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contacts</a>

        <!--menu links with children-->
        <a>Profile</a>
        <a data-child="true" href="#">Login</a>
        <a data-child="true" href="#">Register</a>


    </div>
    
    */

    constructor(id = 'sdb-main', title = ('x' == 'x' ? undefined : 'x')){

        //get sidebar container
        this.id = id;
        this.sdb = document.getElementById(id);
        if(!this.sdb){ throw new Error(`element "${id}" not found`); }
        if(this.sdb.classList.contains('kroma-sidebar-set')){ throw new Error(`sidebar already set.`); }
        this.sdb.classList.add('kroma-sidebar-set');
        this.sdb.classList.add('collapsed');

        //get logo path/text
        this.hasLogo = (this.sdb.querySelector('img') && this.sdb.querySelector('img').src) ? true : false;
        this.logoPath = this.hasLogo ? this.sdb.querySelector('img').src : undefined;
        this.siteTitle = document.querySelector('head title');
        this.siteTitle = ( this.sdb.dataset.title ?? title ) ?? (this.siteTitle.innerText ?? '');


        //get menu items
        this.hasMenu = this.sdb.querySelector('a') ? true : false;
        this.pages = [];
        this.sdb.querySelectorAll('a').forEach((a)=>{

            var page = {};
            page.href = a.href ?? '';
            page.text = a.innerText ?? 'Page';
            page.title = page.text;
            page.icon = a.previousElementSibling;
            if(!page.icon || (page.icon.tagName ?? '') != 'I' ){
                page.icon = document.createElement('i');
                page.icon.classList.add('fa-solid');
                page.icon.classList.add('fa-link');
            }
            page.isChild = eval(a.dataset.child ?? false);
            this.pages.push(page);
            
        });

        //remove anything else in navbar container
        this.sdb.innerHTML = "";

        //add logo or simple text with site title
        this.addLogo();

        //add menu toggle and list
        if(this.hasMenu){

            
            this.addMenu();

        }

        this.addToggle();

        

    }

    addLogo(){

        var logo_cnt = document.createElement('div');
        logo_cnt.classList.add('sdb-logo');

        if(this.hasLogo){
            
            var logo_img = document.createElement('img');
            logo_img.src = this.logoPath;
            logo_img.alt = this.siteTitle;
            logo_cnt.appendChild(logo_img);

        }

        var logo_txt = document.createElement('span');
        logo_txt.innerText = this.siteTitle;
        logo_cnt.appendChild(logo_txt);

        this.sdb.appendChild(logo_cnt);

    }

    addToggle(){


        var toggle = document.createElement('div');
        

        toggle.classList.add('sdb-toggle');
        toggle.addEventListener('click',function(){if(this.closest('.kroma-sidebar').classList.contains('collapsed')){this.closest('.kroma-sidebar').classList.remove('collapsed');}else{this.closest('.kroma-sidebar').classList.add('collapsed');}});

        var arrow = document.createElement('i');
        arrow.classList.add('fa-solid');
        arrow.classList.add('fa-chevron-right');
        arrow.classList.add('sdb-arrow');
        toggle.appendChild(arrow);

        this.sdb.appendChild(toggle);


    }

    addMenu(){

        var menu = document.createElement('div');
        menu.classList.add('sdb-menu');
        var ul = document.createElement('ul');

        var lastIdParent = 0;
        
        for(var i = 0; i < this.pages.length; i++){

            var li = document.createElement('li');
            li.classList.add('no-selection');

            //parent page
            if(!this.pages[i].isChild){
                li.classList.add('parent');
                lastIdParent = i;
                li.dataset.myid = i;
                li.addEventListener('click',function(){

                    var children = this.closest('.kroma-sidebar').querySelectorAll('a[idparent="'+this.dataset.myid+'"]');
                    if(children){
                        children.forEach(function(a){

                            if(a.classList.contains('visible')){a.classList.remove('visible');}else{a.classList.add('visible');}

                        });
                    }

                });
            }

            //child page
            else{

                li.dataset.idparent = lastIdParent;

            }
            var a = document.createElement('a');
            var aSpan = document.createElement('span');
            if(this.pages[i].href.length > 0){ a.href = this.pages[i].href; }
            a.title = this.pages[i].title;
            aSpan.innerText = this.pages[i].text;
            a.appendChild(this.pages[i].icon);
            a.appendChild(aSpan);
            li.appendChild(a);
            ul.appendChild(li);

        }

        menu.appendChild(ul);
        this.sdb.appendChild(menu);

        //remove parent class from childless links
        document.querySelectorAll('#'+this.sdb.id+' .sdb-menu ul li.parent').forEach((li)=>{
            var liChildren = document.querySelectorAll('#'+this.sdb.id+' .sdb-menu ul li[data-idparent="'+li.dataset.myid+'"]');
            if(liChildren.length < 1){li.classList.remove('parent');}
            else{
                li.classList.add('collapsed');
                li.querySelector('a').removeAttribute('href');  //remove href from collapsable parent
                li.addEventListener('click',function(){

                    var sdbId = this.closest('.kroma-sidebar').id;
                    var liChildren = document.querySelectorAll('#'+sdbId+' .sdb-menu ul li[data-idparent="'+this.dataset.myid+'"]');

                    if(this.classList.contains('collapsed')){
                        this.classList.remove('collapsed');
                        liChildren.forEach(function(liChild){ liChild.classList.remove('collapsed'); });
                    }
                    else{
                        this.classList.add('collapsed');
                        liChildren.forEach(function(liChild){ liChild.classList.add('collapsed'); });
                    }

                });
            
            }
        });

        //collapse all children links
        document.querySelectorAll('#'+this.sdb.id+' .sdb-menu ul li[data-idparent]').forEach((li)=>{
            li.classList.add('collapsed');
        });

    }


    


}


//initialize first available
document.addEventListener("DOMContentLoaded", () => {

    window.KromaSidebar = KromaSidebar;
    if(!window.kromaSides){ window.kromaSides = []; }
    var domSides = document.querySelectorAll('.kroma-sidebar');
    if(domSides && domSides[0]){  

        domSides[0].id = (domSides[0].id ?? '').length > 0 ? domSides[0].id : ( 'kroma-sidebar-' + window.kromaSides.length );
        window.kromaSides[window.kromaSides.length] = new KromaSidebar( domSides[0].id );
        
    }

});




/* --- slideshow.js --- */
export class KromaSlideshow {

    /*
    id (string) = slideshow element id
    inheritSize (boolean) = set height/width to 100% of parent container
    autoScroll (boolean) = enable autoscrolling
    waitTime (integer) = milliseconds between slides
    hoverPause (boolean) = pause slide when mouse over it
    scrollingPauseTime (integer) = milliseconds of pause after manual scroll
    enableArrows (boolean) = show/hide nav. arrows
    enableBullets (boolean) = show/hide nav. bullets 
    radiusVar (string) = border radius sizing ('sm','md','lg','xl','2xl',) 

    requires basic preexisting html structure with desired data, such as:

    <div class="kroma-slideshow rounded"
        data-autoscroll="fase"
        data-waitime="3000"
        data-hoverpause="true"
        data-scrollingpausetime="2000"
        data-enablearrows="true"
        data-enablebullets="true"
        data-inheritsize="true"
    >

      <img src="https://t3.ftcdn.net/jpg/05/24/43/88/360_F_524438877_PZFzwc5OWJ3MTWQVFfHKwu1DRVMaSgPx.jpg">
      <img src="https://t3.ftcdn.net/jpg/05/85/86/44/360_F_585864419_kgIYUcDQ0yiLOCo1aRjeu7kRxndcoitz.jpg">
      <img src="https://t3.ftcdn.net/jpg/05/64/82/08/360_F_564820811_n9WP1mM43pLiQwLkIA07KF9Hat5vkX2v.jpg">
      <img src="https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180384_837ZQVtGdBocnKQr5prxWzpjIa64wtgO.jpg">

    </div>   

    */

    constructor(id = 'slideshow', inheritSize = (true == true ? undefined : true), autoScroll = (true == true ? undefined : true), waitTime = (1 == 1 ? undefined : 1), hoverPause = (true == true ? undefined : true), scrollingPauseTime = (1 == 1 ? undefined : 1), enableArrows = (true == true ? undefined : true), enableBullets = (true == true ? undefined : true)) {

        

        //get slideshow container
        this.id = id;
        this.cnt_sld = document.getElementById(id);
        if(!this.cnt_sld){ throw new Error(`element "${id}" not found`); }
        if(this.cnt_sld.classList.contains('kroma-slideshow-set')){ throw new Error(`slideshow already set.`); }
        this.cnt_sld.classList.add('kroma-slideshow-set');


        //get parameters from call if passed else from element dataset if available else default
        this.autoScroll = eval(autoScroll ?? (this.cnt_sld.dataset.autoscroll ?? true));
        this.waitTime = eval(waitTime ?? (this.cnt_sld.dataset.waittime ?? 3000));
        this.hoverPause = eval(hoverPause ?? (this.cnt_sld.dataset.hoverpause ?? true));
        this.scrollingPauseTime = eval(scrollingPauseTime ?? (this.cnt_sld.dataset.scrollingpausetime ?? 2000));
        this.enableArrows = eval(enableArrows ?? (this.cnt_sld.dataset.enablearrows ?? true));
        this.enableBullets = eval(enableBullets ?? (this.cnt_sld.dataset.enablebullets ?? true));
        this.inheritSize = eval(inheritSize ?? (this.cnt_sld.dataset.inheritsize ?? false));

        //set size
        if( this.inheritSize ){ this.cnt_sld.classList.add('inheritsize'); }

        //get imgs
        var prvSlds = this.cnt_sld.querySelectorAll('img');
        
        //add arrows
        if(this.enableArrows && prvSlds.length>1){

            var arrowLeft = document.createElement('div');
            var arrowLeftIcon = document.createElement('i');
            arrowLeft.classList.add('arrow');
            arrowLeft.classList.add('arrowLeft');
            arrowLeft.classList.add('hidden');
            arrowLeftIcon.classList.add('fa-solid');
            arrowLeftIcon.classList.add('fa-chevron-left');
            arrowLeft.appendChild(arrowLeftIcon);
            
            var arrowRight = document.createElement('div');
            var arrowRightIcon = document.createElement('i');
            arrowRight.classList.add('arrow');
            arrowRight.classList.add('arrowRight');
            arrowRight.classList.add('hidden');
            arrowRightIcon.classList.add('fa-solid');
            arrowRightIcon.classList.add('fa-chevron-right');
            arrowRight.appendChild(arrowRightIcon);

            this.cnt_sld.appendChild(arrowRight);
            this.cnt_sld.appendChild(arrowLeft);

        }

        //get arrows
        this.arr_r = this.cnt_sld.querySelector('.arrowRight');
        this.arr_l = this.cnt_sld.querySelector('.arrowLeft');

        //add bullets
        if(this.enableBullets && prvSlds.length>1){

            var cnt_blt = document.createElement('div');
            cnt_blt.classList.add('bullets');
            cnt_blt.classList.add('hidden');

            var blt = document.createElement('div');
            blt.classList.add('bullet');
            cnt_blt.appendChild(blt);
            
            this.cnt_sld.appendChild(cnt_blt);

        }
        
        //get bullets
        this.cnt_blt = this.cnt_sld.querySelector('.bullets');
        this.blts = this.cnt_sld.querySelectorAll('.bullet');

        //set slides
        prvSlds.forEach((prvSld,index) => {

            
            var sld = document.createElement('div');
            sld.classList.add('slide');
            if(index == 0){sld.classList.add('first');}
            if(index == (prvSlds.length - 1)){sld.classList.add('last');}
            sld.style.background = 'url('+prvSld.src+')';
            this.cnt_sld.appendChild(sld);
            prvSld.remove();


        });

        //get slides
        this.slds = this.cnt_sld.querySelectorAll('.slide');

        
        this.autoSlidesTimers = [];

        //set slidewhow
        this.setSlide();


    }

    //first slideshow setting
    setSlide(){


        this.cnt_sld.classList.add('slideshow');


        //display bullets
        if(this.enableBullets && this.slds.length>1){

   
            for(var i = 0; i < this.slds.length; i++){

                
                var newBlt = this.blts[0].cloneNode();          
                newBlt.dataset.index = i;

                newBlt.addEventListener('click',(e) => {

                    if(e.target.dataset.index != this.getCurrentSlide()){

                        var curScroll = parseInt(this.cnt_sld.scrollLeft);
                        var newScroll = e.target.dataset.index * parseInt(getComputedStyle(this.cnt_sld).width);
                        this.slideScroll(newScroll - curScroll);

                    }

                });

                this.cnt_blt.appendChild(newBlt);

            }

            this.blts[0].remove();
            this.blts = this.cnt_sld.querySelectorAll('.bullet');
            this.cnt_blt.classList.remove('hidden');
            this.blts[0].classList.add('current');

        }

        //display arrows
        if(this.enableArrows && this.slds.length>1){

            this.arr_r.classList.remove('hidden');
            this.arr_r.addEventListener('click',() => {this.slideSwipe('r');});
            this.arr_l.addEventListener('click',() => {this.slideSwipe('l');});

        }

        //add hover class
        if(this.hoverPause){

            this.cnt_sld.addEventListener('mouseover',() => {

                if(!this.cnt_sld.classList.contains("hovering")){
                    this.cnt_sld.classList.add("hovering");
                }
            
            });
            
            //rimuovi class hover
            this.cnt_sld.addEventListener('mouseout',() => {

                if(this.cnt_sld.classList.contains("hovering")){
                    this.cnt_sld.classList.remove("hovering");
                }
            
            });

        }

        //update scrolling class
        //update arrows and buttons
        this.cnt_sld.addEventListener('scroll',() => {

            if(!this.cnt_sld.classList.contains("scrolling")){

                this.cnt_sld.classList.add("scrolling");
                setTimeout(() => { this.cnt_sld.classList.remove("scrolling"); }, this.scrollingPauseTime);

            }

            var cur_sld = this.getCurrentSlide();
            if(cur_sld == (this.slds.length - 1)){this.arr_r.classList.add('hidden');}
            else if(this.enableArrows){this.arr_r.classList.remove('hidden');}
            if(cur_sld == 0){this.arr_l.classList.add('hidden');}
            else if(this.enableArrows){this.arr_l.classList.remove('hidden');}

            if(this.enableBullets && this.blts[0]){
                this.cnt_blt.querySelector('.current').classList.remove('current');
                this.blts[cur_sld].classList.add('current');
            }



        });

        //start automatic scroll
        if(this.autoScroll){this.slideAuto();}

        
    }

    //get the index of the current visbile slide
    getCurrentSlide(){

        return parseInt( parseInt(this.cnt_sld.scrollLeft) / parseInt(getComputedStyle(this.cnt_sld).width) );

    }

    //manual scroller using pixels
    slideScroll(n){

        this.cnt_sld.scrollBy({left: n,behavior: 'smooth'});

    }

    //scroll to previous/next slide
    slideSwipe(dir = 'r'){

        if(dir=='r'){this.slideScroll(parseInt(getComputedStyle(this.cnt_sld).width));}
        else if(dir=='l'){this.slideScroll(-1 * parseInt(getComputedStyle(this.cnt_sld).width));}

    }

    //set automatic scrolling
    slideAuto(){

        this.autoSlidesTimers[this.id] = setInterval(() => {

            //verifica scrolling e hovering
            if(!this.cnt_sld.classList.contains('hovering') && !this.cnt_sld.classList.contains('scrolling') ){
                if(this.getCurrentSlide() == (this.slds.length - 1)){ this.cnt_sld.scrollLeft = 0; }
                else{this.slideSwipe();}
            }

        }, this.waitTime);

    }



}



//initialize first available
document.addEventListener("DOMContentLoaded", () => {

    window.kromaSlideshow = KromaSlideshow;
    if(!window.kromaSlideshows){ window.kromaSlideshows = []; }
    var domSlideshows = document.querySelectorAll('.kroma-slideshow');
    if(domSlideshows && domSlideshows[0]){  

        domSlideshows[0].id = (domSlideshows[0].id ?? '').length > 0 ? domSlideshows[0].id : ( 'kroma-slideshow-' + window.kromaSlideshow.length );
        window.kromaSlideshow[window.kromaSlideshow.length] = new KromaSlideshow( domSlideshows[0].id );
        
    }

});




/* --- tabs.js --- */
export function toggleTabContent(event, contentId, containerId) {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.kroma-tab');
    const contents = container.querySelectorAll('.kroma-tab-content');

    // Deactivate all tabs and contents
    tabs.forEach(tab => tab.classList.remove('kroma-tab-active'));
    contents.forEach(content => {
        content.classList.remove('kroma-tab-content-active');
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Activate selected tab and corresponding content
    event.currentTarget.classList.add('kroma-tab-active');
    const activeContent = document.getElementById(contentId);
    activeContent.classList.add('kroma-tab-content-active');
}


/* --- toast.js --- */
export function initializeKromaToastComponents() {
    // Automatically initialize and track toast components
    document.querySelectorAll('.kroma-toast').forEach((toast) => {
        if (toast.dataset.autoDismiss === "true") {
            const duration = parseInt(toast.dataset.dismissDuration, 10) || 5;
            startAutoDismiss(toast, duration);
        }
    });
}

export function showKromaToast(message, {
    variant = 'primary',
    position = 'top-right',
    autoDismiss = false,
    dismissDuration = 5
} = {}) {
    // Create or get existing container for the position
    let container = document.querySelector(`[data-toast-container="${position}"]`);
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('data-toast-container', position);
        //container.style.position = 'fixed';
        document.body.appendChild(container);
        
    }

    container.classList.add('kroma-toast-container');

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'kroma-toast';
    toast.setAttribute('data-variant', variant);
    toast.setAttribute('data-position', position);
    toast.innerHTML = `
        <span>${message}</span>
        <button class="kroma-toast-dismiss" aria-label="Dismiss toast">&times;</button>
    `;

    // Add dismiss button functionality
    toast.querySelector('.kroma-toast-dismiss').addEventListener('click', () => dismissToast(toast));

    // Auto-dismiss functionality
    if (autoDismiss) {
        const progressBar = document.createElement('div');
        progressBar.className = 'kroma-toast-progress';
        progressBar.style.animationDuration = `${dismissDuration}s`;
        toast.appendChild(progressBar);
        startAutoDismiss(toast, dismissDuration);
    }

    // Apply entry animation
    toast.classList.add('kroma-toast-enter');
    setTimeout(() => toast.classList.remove('kroma-toast-enter'), 300);

    // Add to container
    container.appendChild(toast);

    // Handle stacking
    updateToastStack(container, position);
}

// Start auto-dismiss functionality
function startAutoDismiss(toast, duration) {
    const timeout = setTimeout(() => dismissToast(toast), duration * 1000);
    toast.dismissTimeout = timeout;
}

// Dismiss toast with exit animation
function dismissToast(toast) {
    clearTimeout(toast.dismissTimeout);
    toast.classList.add('kroma-toast-exit');
    setTimeout(() => {
        const container = toast.parentNode;
        toast.remove();
        updateToastStack(container, toast.dataset.position);
    }, 300);
}

// Update stack counter for remaining toasts
function updateToastStack(container, position) {
    const toasts = container.querySelectorAll('.kroma-toast');
    toasts.forEach((toast, index) => {
        toast.classList.toggle('kroma-toast-stacked', index > 0);
    });

    const stackCount = container.querySelector('.kroma-toast-stack-count');
    if (stackCount) stackCount.remove();

    if (toasts.length > 1) {
        const counter = document.createElement('div');
        counter.className = 'kroma-toast-stack-count';
        counter.textContent = `+${toasts.length - 1}`;
        toasts[toasts.length - 1].appendChild(counter);
    }
}

// Initialize toast components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeKromaToastComponents);


