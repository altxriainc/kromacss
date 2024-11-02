document.querySelectorAll('.alert-dismissible .alert-close').forEach(button => {
    button.addEventListener('click', (e) => {
      const alert = e.target.closest('.alert');
      alert.classList.add('fade-out');
      setTimeout(() => alert.remove(), 400); // 400ms matches the CSS transition duration
    });
  });