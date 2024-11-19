// Function to show toast with updated data-* attributes for customization
export function showToast(message, variant = 'primary', position = 'top-right', autoDismiss = false, dismissDuration = 5) {
    // Create or get existing container based on position
    let container = document.querySelector(`[data-toast-container="${position}"]`);
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('data-toast-container', position);
        document.body.appendChild(container);
    }

    // Create toast element with data attributes for variant and position
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('data-variant', variant);
    toast.setAttribute('data-position', position);
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-dismiss" onclick="dismissToast(this.parentElement)">&times;</button>
    `;

    // Handle stacking behavior
    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length > 0) {
        toast.classList.add(position.includes('bottom') ? 'toast-stacked-bottom' : 'toast-stacked-top');
        const oldCounter = container.querySelector('.toast-stack-count');
        if (oldCounter) oldCounter.remove();
        const stackCounter = document.createElement('div');
        stackCounter.className = 'toast-stack-count';
        stackCounter.innerText = `+${existingToasts.length}`;
        toast.appendChild(stackCounter);
    }

    // Append toast to container
    container.appendChild(toast);

    // Handle auto-dismiss with a progress bar
    if (autoDismiss) {
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress';
        progressBar.style.animationDuration = `${dismissDuration}s`;
        toast.appendChild(progressBar);
        toast.progressBar = progressBar;
        pauseAllProgressBars();
        startAutoDismiss(toast, dismissDuration);
    }

    // Apply entry animation
    toast.classList.add('toast-enter');
    setTimeout(() => toast.classList.remove('toast-enter'), 300);
}

// Start auto-dismiss functionality with a progress bar
export function startAutoDismiss(toast, dismissDuration) {
    if (toast.progressBar) {
        toast.progressBar.style.animationPlayState = 'running';
    }
    toast.dismissTimeout = setTimeout(() => dismissToast(toast), dismissDuration * 1000);
}

// Pause all progress bars when a new toast is added
export function pauseAllProgressBars() {
    document.querySelectorAll('.toast').forEach(t => {
        if (t.progressBar) {
            t.progressBar.style.animationPlayState = 'paused';
            clearTimeout(t.dismissTimeout);
        }
    });
}

// Dismiss toast with exit animation
export function dismissToast(toastElement) {
    const container = toastElement.parentNode;
    clearTimeout(toastElement.dismissTimeout);

    toastElement.classList.add('toast-exit');
    setTimeout(() => {
        toastElement.remove();
        // Handle stack counter for remaining toasts
        const remainingToasts = container.querySelectorAll('.toast');
        if (remainingToasts.length > 1) {
            const stackCounter = document.createElement('div');
            stackCounter.className = 'toast-stack-count';
            stackCounter.innerText = `+${remainingToasts.length - 1}`;
            remainingToasts[remainingToasts.length - 1].appendChild(stackCounter);
            pauseAllProgressBars();
            startAutoDismiss(remainingToasts[remainingToasts.length - 1], parseFloat(remainingToasts[remainingToasts.length - 1].progressBar.style.animationDuration));
        } else if (remainingToasts.length === 1) {
            const stackCounter = container.querySelector('.toast-stack-count');
            if (stackCounter) stackCounter.remove();
            pauseAllProgressBars();
            startAutoDismiss(remainingToasts[0], parseFloat(remainingToasts[0].progressBar.style.animationDuration));
        }
    }, 300);
}
