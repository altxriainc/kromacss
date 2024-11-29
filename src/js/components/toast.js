function initializeKromaToastComponents() {
    // Automatically initialize and track toast components
    document.querySelectorAll('.kroma-toast').forEach((toast) => {
        if (toast.dataset.autoDismiss === "true") {
            const duration = parseInt(toast.dataset.dismissDuration, 10) || 5;
            startAutoDismiss(toast, duration);
        }
    });
}

function showKromaToast(message, {
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
