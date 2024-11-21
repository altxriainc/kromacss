document.addEventListener('DOMContentLoaded', () => {
  initializeCodeblock(document);
});

export function initializeCodeblock() {
  document.querySelectorAll('.kroma-code-block').forEach((block) => {
    // Check if buttons are already rendered to avoid duplication
    if (block.querySelector('.kroma-code-block-header')) return;

    // Create action buttons container
    const header = document.createElement('div');
    header.className = 'kroma-code-block-header';

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'kroma-action-btn kroma-copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code');
    copyBtn.addEventListener('click', () => {
      const codeElement = block.querySelector('pre code');
      const rawCode = codeElement.getAttribute('data-raw-code'); // Use raw, unescaped code
      navigator.clipboard.writeText(rawCode).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });

    // Fullscreen Button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'kroma-action-btn kroma-fullscreen-btn';
    fullscreenBtn.textContent = 'Full Screen';
    fullscreenBtn.setAttribute('aria-label', 'Toggle full screen');
    fullscreenBtn.addEventListener('click', () => {
      block.classList.toggle('kroma-fullscreen');
      fullscreenBtn.textContent = block.classList.contains('kroma-fullscreen')
        ? 'Exit Full Screen'
        : 'Full Screen';
    });

    // Append buttons to header
    header.appendChild(copyBtn);
    header.appendChild(fullscreenBtn);
    block.appendChild(header);

    // Escape HTML in the <code> block and store original content
    const codeElement = block.querySelector('pre code');
    if (codeElement) {
      const rawHTML = codeElement.innerHTML.trim(); // Raw content
      const escapedHTML = rawHTML
        .replace(/&/g, '&amp;') // Escape &
        .replace(/</g, '&lt;') // Escape <
        .replace(/>/g, '&gt;') // Escape >
        .replace(/"/g, '&quot;') // Escape "
        .replace(/'/g, '&#039;'); // Escape '
      codeElement.innerHTML = escapedHTML; // Use escaped content
      codeElement.setAttribute('data-raw-code', rawHTML); // Store raw code for copying
    }
  });
}
