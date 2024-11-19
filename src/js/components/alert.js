document.querySelectorAll('.alert .alert-close').forEach(button => {
  button.addEventListener('click', event => {
    const alert = button.closest('.alert');
    alert.style.maxHeight = alert.scrollHeight + 'px'; // Set max-height to element's height for smooth collapse
    alert.classList.add('fade-out');
    alert.addEventListener('transitionend', () => {
      if (alert.parentNode) alert.remove();
    });
  });
});
