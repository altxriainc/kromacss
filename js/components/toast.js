let toastHistory = [];

export function showToast(message, variant = 'primary', position = 'top-right', autoDismiss = false, dismissDuration = 5) {
    let container = document.querySelector(`.toast-container-${position}`);
    if (!container) {
        container = document.createElement('div');
        container.className = `toast-container-${position}`;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${variant} toast-${position}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-dismiss" onclick="dismissToast(this.parentElement)">&times;</button>
    `;

    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length > 0) {
        toast.classList.add(position.includes('bottom') ? 'toast-stack-bottom' : 'toast-stack-top');
        const oldCounter = container.querySelector('.toast-stack-count');
        if (oldCounter) oldCounter.remove();
        const stackCounter = document.createElement('div');
        stackCounter.className = 'toast-stack-count';
        stackCounter.innerText = `+${existingToasts.length}`;
        toast.appendChild(stackCounter);
    }

    container.appendChild(toast);

    if (autoDismiss) {
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress';
        progressBar.style.animationDuration = `${dismissDuration}s`;
        toast.appendChild(progressBar);
        toast.progressBar = progressBar;
        pauseAllProgressBars();
        startAutoDismiss(toast, dismissDuration);
    }

    toast.classList.add('toast-enter');
    setTimeout(() => toast.classList.remove('toast-enter'), 300);

    toastHistory.push({ message, variant });
}

export function startAutoDismiss(toast, dismissDuration) {
    if (toast.progressBar) {
        toast.progressBar.style.animationPlayState = 'running';
    }
    toast.dismissTimeout = setTimeout(() => dismissToast(toast), dismissDuration * 1000);
}

export function pauseAllProgressBars() {
    document.querySelectorAll('.toast').forEach(t => {
        if (t.progressBar) {
            t.progressBar.style.animationPlayState = 'paused';
            clearTimeout(t.dismissTimeout);
        }
    });
}

export function dismissToast(toastElement) {
    const container = toastElement.parentNode;
    clearTimeout(toastElement.dismissTimeout);

    toastElement.classList.add('toast-exit');
    setTimeout(() => {
        toastElement.remove();
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

export function showToastHistory() {
    const existingHistory = document.querySelector('.toast-history-container');
    if (existingHistory) existingHistory.remove();

    const historyContainer = document.createElement('div');
    historyContainer.className = 'toast-history-container';
    historyContainer.innerHTML = `
        <button class="toast-history-close" onclick="closeToastHistory()">&times;</button>
    `;
    let count = 1;
    toastHistory.slice().reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `toast-history-item toast-${item.variant}`;
        historyItem.innerHTML = `<span>${item.message}</span>`;
        historyContainer.appendChild(historyItem);
        if (count === 1) {
            document.body.appendChild(historyContainer);
        }
        count++;
    });
}

export function closeToastHistory() {
    const historyContainer = document.querySelector('.toast-history-container');
    if (historyContainer) historyContainer.remove();
}
