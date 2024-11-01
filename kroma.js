// Toast history storage
let toastHistory = [];

// Function to show toast
function showToast(message, variant = 'primary', position = 'top-right', autoDismiss = false, dismissDuration = 5) {
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

// Auto-dismiss setup
function startAutoDismiss(toast, dismissDuration) {
    if (toast.progressBar) {
        toast.progressBar.style.animationPlayState = 'running';
    }
    toast.dismissTimeout = setTimeout(() => dismissToast(toast), dismissDuration * 1000);
}

function pauseAllProgressBars() {
    document.querySelectorAll('.toast').forEach(t => {
        if (t.progressBar) {
            t.progressBar.style.animationPlayState = 'paused';
            clearTimeout(t.dismissTimeout);
        }
    });
}

// Dismiss toast and update stack
function dismissToast(toastElement) {
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

// Show toast history
function showToastHistory() {
    // Remove existing history if already shown
    const existingHistory = document.querySelector('.toast-history-container');
    if (existingHistory) existingHistory.remove();

    const historyContainer = document.createElement('div');
    historyContainer.className = 'toast-history-container';
    historyContainer.innerHTML = `
        <button class="toast-history-close" onclick="closeToastHistory()">&times;</button>
    `;
    count = 1;
    toastHistory.slice().reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `toast-history-item toast-${item.variant}`;
        historyItem.innerHTML = `<span>${item.message}</span>`;
        historyContainer.appendChild(historyItem);
        if(count == 1)
            document.body.appendChild(historyContainer);
        count++;
    });
}

// Close toast history
function closeToastHistory() {
    const historyContainer = document.querySelector('.toast-history-container');
    if (historyContainer) historyContainer.remove();
}

function showTabContent(event, contentId, containerId) {
    // Get all tabs and contents within the specific container
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.tab');
    const contents = container.parentNode.querySelectorAll('.tab-content');

    // Remove active class from all tabs and hide all contents
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    contents.forEach(content => content.classList.remove('tab-content-active'));

    // Activate the selected tab and show corresponding content
    event.currentTarget.classList.add('tab-active');
    document.getElementById(contentId).classList.add('tab-content-active');
}

function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const parentItem = content.parentElement;
    const isOpen = parentItem.classList.contains('accordion-item-open') || parentItem.classList.contains('accordion-sub-item-open');

    if (isOpen) {
        // Close accordion
        content.style.height = content.scrollHeight + 'px'; // Start with current height
        content.offsetHeight; // Force reflow
        content.style.height = '0'; // Collapse

        parentItem.classList.remove('accordion-item-open', 'accordion-sub-item-open');
        content.addEventListener('transitionend', function handler() {
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            content.removeEventListener('transitionend', handler);
        });
    } else {
        // Open accordion
        const parent = element.closest('.accordion-container, .accordion-item, .accordion-sub-item');
        const openSubItems = parent.querySelectorAll('.accordion-item-open > .accordion-content, .accordion-sub-item-open > .accordion-sub-content');

        openSubItems.forEach(subItem => {
            subItem.style.height = subItem.scrollHeight + 'px';
            subItem.offsetHeight; // Force reflow
            subItem.style.height = '0';
            subItem.parentElement.classList.remove('accordion-item-open', 'accordion-sub-item-open');
        });

        content.style.height = '0';
        content.style.paddingTop = '';
        content.style.paddingBottom = '';
        parentItem.classList.add('accordion-item-open', 'accordion-sub-item-open');
        content.offsetHeight; // Force reflow
        content.style.height = content.scrollHeight + 'px'; // Expand to full height

        content.addEventListener('transitionend', function handler() {
            content.style.height = 'auto';
            content.removeEventListener('transitionend', handler);
        });
    }
}

document.querySelectorAll('.alert-dismissible .alert-close').forEach(button => {
    button.addEventListener('click', (e) => {
      const alert = e.target.closest('.alert');
      alert.classList.add('fade-out');
      setTimeout(() => alert.remove(), 400); // 400ms matches the CSS transition duration
    });
  });
  





  
  






