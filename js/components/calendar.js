export function initializeCalendarComponents() {
    document.querySelectorAll('.calendar').forEach(initCalendar);
}

function initCalendar(calendarElement) {
    const monthYearDisplay = calendarElement.querySelector('.calendar-month-year');
    const prevButton = calendarElement.querySelector('.calendar-nav.prev');
    const nextButton = calendarElement.querySelector('.calendar-nav.next');
    const weekdaysContainer = calendarElement.querySelector('.calendar-weekdays');
    const datesContainer = calendarElement.querySelector('.calendar-dates');
    
    // Load events from data attribute if present
    const eventsData = calendarElement.getAttribute('data-events');
    const events = eventsData ? JSON.parse(eventsData) : {};

    // Create selectors once
    const monthSelector = document.createElement('select');
    const yearSelector = document.createElement('select');

    if (weekdaysContainer.childElementCount === 0) {
        addWeekdays(weekdaysContainer);
    }
    if (!calendarElement.querySelector('.calendar-selectors')) {
        calendarElement.querySelector('.calendar-header').appendChild(createMonthYearSelectors());
    }

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

        for (let i = 0; i < firstDayOfMonth; i++) {
            datesContainer.appendChild(document.createElement('div'));
        }

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

    function createMonthYearSelectors() {
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
        selectorContainer.className = 'calendar-selectors';
        selectorContainer.appendChild(monthSelector);
        selectorContainer.appendChild(yearSelector);
        return selectorContainer;
    }

    function addWeekdays(container) {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const weekdayElement = document.createElement('div');
            weekdayElement.textContent = day;
            container.appendChild(weekdayElement);
        });
    }
}

// Automatically initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeCalendarComponents);
