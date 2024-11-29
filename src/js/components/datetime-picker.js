class DateTimePicker {
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
