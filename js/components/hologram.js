export function showHologram(titleText, subtitleText, variant = 'primary', intensity = 'medium') {
    // Remove any existing hologram to prevent stacking
    document.querySelectorAll('.hologram-overlay').forEach(el => el.remove());

    // Create hologram overlay container
    const hologramOverlay = document.createElement('div');
    hologramOverlay.className = 'hologram-overlay';
    hologramOverlay.setAttribute('data-variant', variant);
    hologramOverlay.setAttribute('data-intensity', intensity);
    
    // Create and configure title element
    const title = document.createElement('div');
    title.className = 'hologram-title';
    title.textContent = titleText;
    hologramOverlay.appendChild(title);

    // Create and configure subtitle element
    const subtitle = document.createElement('div');
    subtitle.className = 'hologram-subtitle';
    subtitle.textContent = subtitleText;
    hologramOverlay.appendChild(subtitle);

    // Append overlay to body
    document.body.appendChild(hologramOverlay);

    // Remove hologram after animation completes
    setTimeout(() => {
        hologramOverlay.remove();
    }, 6000); // Match the duration of the CSS animation
}
