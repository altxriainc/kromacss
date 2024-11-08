export class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal.closest('.modal-overlay');
        this.closeButton = this.modal.querySelector('.modal-close');

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay && !this.overlay.classList.contains('no-close-on-outside-click')) {
                this.close();
            }
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
        document.querySelectorAll('.modal-overlay').forEach((overlay) => {
            const modalId = overlay.querySelector('.modal').id;
            new Modal(modalId);
        });
    }
}

// Initialize modals when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    Modal.initAll();

    document.querySelectorAll('[data-toggle="modal"]').forEach((trigger) => {
        const targetId = trigger.dataset.target;
        trigger.addEventListener('click', () => {
            const modal = new Modal(targetId);
            modal.open();
        });
    });
});
