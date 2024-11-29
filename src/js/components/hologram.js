export function showHologram(titleText, subtitleText, variant = 'primary', intensity = 'medium', duration = 6000) {
    // Remove any existing holograms and dim overlay
    document.querySelectorAll('.kroma-hologram-overlay, .kroma-body-dim').forEach(el => el.remove());

    // Create dim overlay for background
    const dimOverlay = document.createElement('div');
    dimOverlay.className = 'kroma-body-dim';
    document.body.appendChild(dimOverlay);

    // Create hologram overlay container
    const hologramOverlay = document.createElement('div');
    hologramOverlay.className = 'kroma-hologram-overlay';
    hologramOverlay.setAttribute('data-variant', variant);
    hologramOverlay.setAttribute('data-intensity', intensity);
    
    // Create and configure title element
    const title = document.createElement('div');
    title.className = 'kroma-hologram-title';
    title.textContent = titleText;
    hologramOverlay.appendChild(title);

    // Create and configure subtitle element
    const subtitle = document.createElement('div');
    subtitle.className = 'kroma-hologram-subtitle';
    subtitle.textContent = subtitleText;
    hologramOverlay.appendChild(subtitle);

    // Append overlay to body
    document.body.appendChild(hologramOverlay);

    // Remove hologram and dim overlay after animation
    setTimeout(() => {
        hologramOverlay.remove();
        dimOverlay.remove();
    }, duration);
}
