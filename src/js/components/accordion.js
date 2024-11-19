export function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const parentItem = content.parentElement;
    const isOpen = parentItem.classList.contains('accordion-item-open') || parentItem.classList.contains('accordion-sub-item-open');

    if (isOpen) {
        // Close accordion
        content.style.height = content.scrollHeight + 'px'; // Start with current height
        content.offsetHeight; // Force reflow
        content.style.height = '0'; // Collapse

        parentItem.classList.remove('accordion-item-open', 'accordion-sub-item-open');
        content.addEventListener('transitionend', function handler() {
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            content.removeEventListener('transitionend', handler);
        });
    } else {
        // Open accordion
        const parent = element.closest('.accordion-container, .accordion-item, .accordion-sub-item');
        const openSubItems = parent.querySelectorAll('.accordion-item-open > .accordion-content, .accordion-sub-item-open > .accordion-sub-content');

        openSubItems.forEach(subItem => {
            subItem.style.height = subItem.scrollHeight + 'px';
            subItem.offsetHeight; // Force reflow
            subItem.style.height = '0';
            subItem.parentElement.classList.remove('accordion-item-open', 'accordion-sub-item-open');
        });

        content.style.height = '0';
        content.style.paddingTop = '';
        content.style.paddingBottom = '';
        parentItem.classList.add('accordion-item-open', 'accordion-sub-item-open');
        content.offsetHeight; // Force reflow
        content.style.height = content.scrollHeight + 'px'; // Expand to full height

        content.addEventListener('transitionend', function handler() {
            content.style.height = 'auto';
            content.removeEventListener('transitionend', handler);
        });
    }
}