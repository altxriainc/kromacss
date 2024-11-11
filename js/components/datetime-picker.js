export class DateTimePicker {
    constructor(elementId, { format = 'YYYY-MM-DD HH:mm', includeTime = true, variant = 'primary' } = {}) {
        this.container = document.getElementById(elementId);
        this.input = this.container.querySelector('.datetime-input');
        this.picker = this.container.querySelector('.datetime-picker');
        this.calendarGrid = this.picker.querySelector('.calendar-grid');
        this.quickSelectContainer = this.picker.querySelector('.quick-select');
        this.monthHeader = this.picker.querySelector('.calendar-month');
        this.yearHeader = this.picker.querySelector('.calendar-year');
        this.format = format;
        this.includeTime = includeTime;
        this.variant = variant;
        this.currentDate = new Date();
        this.selectedDate = new Date();

        this.init();
    }

    init() {
        this.applyVariantStyles();
        this.input.addEventListener('focus', () => this.togglePicker(true));
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && !this.picker.contains(e.target)) {
                this.togglePicker(false);
            }
        });

        this.picker.querySelector('.prev-month').addEventListener('click', () => this.changeMonth(-1));
        this.picker.querySelector('.next-month').addEventListener('click', () => this.changeMonth(1));
        this.monthHeader.addEventListener('click', () => this.showMonthSelector());
        this.yearHeader.addEventListener('click', () => this.showYearSelector());

        this.buildCalendar();
        this.addQuickSelectButtons();
        if (this.includeTime) {
            this.addTimeSelectors();
        }

        this.addConfirmButton();
    }

    togglePicker(open) {
        this.picker.classList.toggle('active', open);
    }

    buildCalendar() {
        this.monthHeader.textContent = this.capitalizeFirstLetter(this.currentDate.toLocaleString('default', { month: 'long' }));
        this.yearHeader.textContent = `${this.currentDate.getFullYear()}`;
        this.calendarGrid.innerHTML = '';

        const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            const filler = document.createElement('div');
            filler.classList.add('calendar-day', 'disabled');
            this.calendarGrid.appendChild(filler);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('calendar-day');
            day.textContent = i;
            day.addEventListener('click', () => this.selectDate(i));

            if (this.isCurrentMonth() && this.isToday(i)) {
                day.classList.add('current-day');
            }

            if (this.isSelectedMonth() && this.isSelectedDay(i)) {
                day.classList.add('selected-day');
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
        this.selectedDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        this.updateInputValue();
        this.buildCalendar();
    }

    isToday(day) {
        const today = new Date();
        return day === today.getDate() &&
               this.currentDate.getMonth() === today.getMonth() &&
               this.currentDate.getFullYear() === today.getFullYear();
    }

    isSelectedDay(day) {
        return day === this.selectedDate.getDate() &&
               this.currentDate.getMonth() === this.selectedDate.getMonth() &&
               this.currentDate.getFullYear() === this.selectedDate.getFullYear();
    }

    isCurrentMonth() {
        const today = new Date();
        return this.currentDate.getMonth() === today.getMonth() && this.currentDate.getFullYear() === today.getFullYear();
    }

    isSelectedMonth() {
        return this.currentDate.getMonth() === this.selectedDate.getMonth() && this.currentDate.getFullYear() === this.selectedDate.getFullYear();
    }

    formatDate(date) {
        let formattedDate = date.toISOString().slice(0, 10);
        if (this.includeTime) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            formattedDate += ` ${hours}:${minutes}`;
        }
        return formattedDate;
    }

    updateInputValue() {
        const formattedDate = this.formatDate(this.selectedDate);
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

    showMonthSelector() {
        this.removeSelectorContainers();
        const monthSelector = document.createElement('div');
        monthSelector.classList.add('month-selector');

        for (let month = 0; month < 12; month++) {
            const monthOption = document.createElement('div');
            monthOption.classList.add('month-option');
            monthOption.textContent = this.capitalizeFirstLetter(new Date(0, month).toLocaleString('default', { month: 'long' }));
            monthOption.addEventListener('click', () => {
                this.currentDate.setMonth(month);
                this.updateSelectedDateForMonthChange();
                this.buildCalendar();
                monthSelector.remove();
            });
            monthSelector.appendChild(monthOption);
        }

        this.picker.appendChild(monthSelector);
        monthSelector.style.display = 'block';
    }

    showYearSelector() {
        this.removeSelectorContainers();
        const yearSelector = document.createElement('div');
        yearSelector.classList.add('year-selector');

        for (let year = this.currentDate.getFullYear() - 5; year <= this.currentDate.getFullYear() + 5; year++) {
            const yearOption = document.createElement('div');
            yearOption.classList.add('year-option');
            yearOption.textContent = year;
            yearOption.addEventListener('click', () => {
                this.currentDate.setFullYear(year);
                this.updateSelectedDateForMonthChange();
                this.buildCalendar();
                yearSelector.remove();
            });
            yearSelector.appendChild(yearOption);
        }

        this.picker.appendChild(yearSelector);
        yearSelector.style.display = 'block';
    }

    removeSelectorContainers() {
        const existingSelectors = this.picker.querySelectorAll('.month-selector, .year-selector');
        existingSelectors.forEach(selector => selector.remove());
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
            button.addEventListener('click', () => {
                this.selectedDate = date;
                this.currentDate.setFullYear(date.getFullYear(), date.getMonth());
                this.updateInputValue();
                this.buildCalendar();
            });
            this.quickSelectContainer.appendChild(button);
        });
    }

    addTimeSelectors() {
        const timeSelectorContainer = document.createElement('div');
        timeSelectorContainer.classList.add('time-selector');

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
        confirmButton.classList.add('confirm-button');
        confirmButton.textContent = 'OK';
        confirmButton.addEventListener('click', () => this.togglePicker(false));
        this.picker.appendChild(confirmButton);
    }

    applyVariantStyles() {
        this.input.classList.add(`datetime-input-${this.variant}`);
        this.picker.classList.add(`datetime-picker-${this.variant}`);
    }
}

// Initialize DateTimePicker
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.datetime-picker-container').forEach((el) => {
        const format = el.dataset.format || 'YYYY-MM-DD HH:mm';
        const includeTime = el.dataset.time !== 'false';
        const variant = el.dataset.variant || 'primary';
        new DateTimePicker(el.id, { format, includeTime, variant });
    });
});
