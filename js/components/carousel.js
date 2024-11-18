document.addEventListener('DOMContentLoaded', () => {
  const carouselList = document.querySelector('.carousel-list');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.dot');
  const autoPlayToggle = document.querySelector('.auto-play-toggle');

  let currentIndex = 0;
  let isPlaying = true;
  const interval = 3000;
  let timer;

  const updateCarousel = () => {
    carouselList.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % dots.length;
    updateCarousel();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + dots.length) % dots.length;
    updateCarousel();
  };

  const toggleAutoPlay = () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      timer = setInterval(nextSlide, interval);
      autoPlayToggle.textContent = '⏸️';
    } else {
      clearInterval(timer);
      autoPlayToggle.textContent = '▶️';
    }
  };

  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);
  autoPlayToggle.addEventListener('click', toggleAutoPlay);
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  if (isPlaying) {
    timer = setInterval(nextSlide, interval);
  }
});