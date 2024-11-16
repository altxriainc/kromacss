import React, { useState, useEffect } from 'react';

const Carousel = ({ items, autoPlay = true, interval = 3000, transitionDuration = 700 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(nextSlide, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, interval, currentIndex]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
      {/* Slides */}
      <div
        className="flex transition-transform"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            {typeof item === 'string' ? (
              <img src={item} alt={`Slide ${index}`} className="w-full h-auto" />
            ) : (
              item
            )}
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? 'bg-gray-800 dark:bg-white'
                : 'bg-gray-400 dark:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
    </div>
  );
};

export default Carousel;