export function initializeRatingComponents() {
    // Select and initialize all rating components on the page
    document.querySelectorAll('.rating').forEach(initRatingComponent);
}

function initRatingComponent(ratingElement) {
    const stars = ratingElement.querySelectorAll('.star');

    // Helper function to update star visual state based on the rating value
    const updateStars = (ratingValue) => {
        stars.forEach((star, index) => {
            star.classList.toggle('filled', index < ratingValue);
        });
    };

    // Set initial rating from data attribute or default to 0
    const initialRating = parseInt(ratingElement.getAttribute('data-rating'), 10) || 0;
    updateStars(initialRating);

    // Add event listeners for interactivity
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const newRating = index + 1;
            ratingElement.setAttribute('data-rating', newRating);
            updateStars(newRating);

            // Dispatch the custom "ratingSet" event for developers to listen to
            const ratingEvent = new CustomEvent('ratingSet', {
                detail: { rating: newRating, element: ratingElement }
            });
            ratingElement.dispatchEvent(ratingEvent);
        });

        star.addEventListener('mouseover', () => updateStars(index + 1));
        star.addEventListener('mouseleave', () => updateStars(ratingElement.getAttribute('data-rating')));
    });
}

// Automatically initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeRatingComponents);
