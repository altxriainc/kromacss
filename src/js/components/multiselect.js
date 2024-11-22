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
