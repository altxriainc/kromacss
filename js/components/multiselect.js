export class MultiSelect {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.dropdown = this.element.querySelector('.multiselect-dropdown');
        this.optionsContainer = this.element.querySelector('.multiselect-options');
        this.searchInput = this.element.querySelector('.multiselect-search');
        this.clearButton = this.element.querySelector('.clear-selection');
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
            const option = e.target.closest('.multiselect-option');
            if (option) {
                this.toggleSelection(option);
                this.searchInput.value = ''; // Clear search input after selection
                this.filterOptions(); // Reset options display after selection
            }
        });

        this.searchInput.addEventListener('input', () => {
            this.filterOptions();
        });

        this.clearButton.addEventListener('click', () => {
            this.clearSelections();
        });

        this.optionsContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.focusNextOption();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.focusPreviousOption();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const focusedOption = document.activeElement;
                if (focusedOption && focusedOption.classList.contains('multiselect-option')) {
                    this.toggleSelection(focusedOption);
                }
            }
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
        const chipsContainer = this.element.querySelector('.multiselect-chips');
        chipsContainer.innerHTML = ''; // Clear current chips

        this.selectedOptions.forEach(value => {
            const chip = document.createElement('div');
            chip.classList.add('multiselect-chip');
            chip.textContent = value;

            const removeIcon = document.createElement('span');
            removeIcon.classList.add('chip-remove');
            removeIcon.innerHTML = '&times;';
            removeIcon.setAttribute('aria-label', `Remove ${value}`);
            removeIcon.addEventListener('click', () => {
                this.removeSelection(value);
            });

            chip.appendChild(removeIcon);
            chipsContainer.appendChild(chip);
        });

        // Toggle clear button visibility based on selection
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
        this.optionsContainer.querySelectorAll('.multiselect-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.updateSelectedDisplay();
    }

    filterOptions() {
        const query = this.searchInput.value.toLowerCase();
        this.optionsContainer.querySelectorAll('.multiselect-option').forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(query) ? 'block' : 'none';
        });
    }

    focusNextOption() {
        const focusedElement = document.activeElement;
        const options = Array.from(this.optionsContainer.querySelectorAll('.multiselect-option'));
        let index = options.indexOf(focusedElement);
        if (index !== -1 && index < options.length - 1) {
            options[index + 1].focus();
        }
    }

    focusPreviousOption() {
        const focusedElement = document.activeElement;
        const options = Array.from(this.optionsContainer.querySelectorAll('.multiselect-option'));
        let index = options.indexOf(focusedElement);
        if (index > 0) {
            options[index - 1].focus();
        }
    }
}

// Initialize all MultiSelect components
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.multiselect').forEach((el) => {
        new MultiSelect(el.id);
    });
});
