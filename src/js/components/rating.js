export function initializeKromaRatingComponents() {
    // Automatically initialize all rating components on the page
    document.querySelectorAll('.kroma-rating').forEach(initializeRatingComponent);
}

function initializeRatingComponent(ratingElement) {
    const stars = ratingElement.querySelectorAll('.kroma-star');
    const isDisabled = ratingElement.dataset.disabled === "true";

    if (isDisabled) return; // Skip interactivity if the component is disabled

    // Helper function to update star visual state
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
        // On click, set the rating
        star.addEventListener('click', () => {
            const newRating = index + 1;
            ratingElement.setAttribute('data-rating', newRating);
            updateStars(newRating);

            // Dispatch custom "ratingSet" event
            const ratingEvent = new CustomEvent('ratingSet', {
                detail: { rating: newRating, element: ratingElement },
            });
            ratingElement.dispatchEvent(ratingEvent);
        });

        // On hover, preview the rating
        star.addEventListener('mouseover', () => updateStars(index + 1));
        star.addEventListener('mouseleave', () =>
            updateStars(parseInt(ratingElement.getAttribute('data-rating'), 10) || 0)
        );
    });
}

// Initialize all rating components on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeKromaRatingComponents);
