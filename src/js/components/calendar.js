function initializeCalendarComponents() {
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
