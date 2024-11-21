document.addEventListener('DOMContentLoaded', () => {
  initializeAlerts(document);
});

/**
 * Initialize all alerts within a container
 * @param {HTMLElement} container - The container with alerts to initialize
 */
function initializeAlerts(container) {
  const alerts = container.querySelectorAll('.kroma-alert');
  alerts.forEach(alert => initializeAlert(alert));
}

/**
 * Initialize a single alert
 * @param {HTMLElement} alert - The alert element
 */
function initializeAlert(alert) {
  const iconMap = {
    success: '✔',
    error: '❌',
    warning: '⚠',
    info: 'ℹ',
  };

  // Ensure the icon is present
  let iconElement = alert.querySelector('.kroma-alert-icon');
  if (!iconElement) {
    iconElement = document.createElement('span');
    iconElement.classList.add('kroma-alert-icon');
    iconElement.textContent = alert.dataset.icon || iconMap[alert.dataset.variant] || '';
    alert.prepend(iconElement); // Insert icon at the beginning
  }

  // Ensure the content wrapper is present
  let contentElement = alert.querySelector('.kroma-alert-content');
  if (!contentElement) {
    contentElement = document.createElement('div');
    contentElement.classList.add('kroma-alert-content');
    alert.appendChild(contentElement);
  }

  // Ensure the title is present
  if (alert.dataset.title) {
    let titleElement = contentElement.querySelector('.kroma-alert-title');
    if (!titleElement) {
      titleElement = document.createElement('p');
      titleElement.classList.add('kroma-alert-title');
      titleElement.textContent = alert.dataset.title;
      contentElement.appendChild(titleElement);
    }
  }

  // Ensure the body is present
  if (alert.dataset.body) {
    let bodyElement = contentElement.querySelector('.kroma-alert-body');
    if (!bodyElement) {
      bodyElement = document.createElement('p');
      bodyElement.classList.add('kroma-alert-body');
      bodyElement.textContent = alert.dataset.body;
      contentElement.appendChild(bodyElement);
    }
  }

  // Ensure the close button is present
  let closeButton = alert.querySelector('.kroma-alert-close');
  if (!closeButton) {
    closeButton = document.createElement('button');
    closeButton.classList.add('kroma-alert-close');
    closeButton.setAttribute('aria-label', 'Close alert');
    closeButton.innerHTML = '&times;';
    alert.appendChild(closeButton);
  }

  // Add close button functionality
  closeButton.addEventListener('click', () => handleAlertClose(alert));
}

/**
 * Handle alert close functionality
 * @param {HTMLElement} alert - The alert to close
 */
function handleAlertClose(alert) {
  if (!alert) return;

  // Set the initial height for smooth transition
  alert.style.maxHeight = `${alert.scrollHeight}px`;

  // Trigger the transition
  requestAnimationFrame(() => {
    alert.classList.add('fade-out');
    alert.style.maxHeight = '0';
  });

  // Remove the alert after the animation ends
  alert.addEventListener('transitionend', () => {
    if (alert.parentNode) alert.remove();
  }, { once: true });
}
