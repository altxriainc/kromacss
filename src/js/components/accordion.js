document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.kroma-accordion-container');
  
    accordions.forEach(container => {
      const items = container.querySelectorAll('[data-header]');
  
      items.forEach(item => {
        const headerText = item.getAttribute('data-header');
        const contentText = item.getAttribute('data-content');
        const isSubItem = item.closest('.kroma-accordion-content');
  
        const header = document.createElement('button');
        header.classList.add(isSubItem ? 'kroma-accordion-sub-header' : 'kroma-accordion-header');
        header.setAttribute('aria-label', `Toggle ${headerText}`);
        header.textContent = headerText;
        header.onclick = () => toggleAccordion(header);
  
        const content = document.createElement('div');
        content.classList.add(isSubItem ? 'kroma-accordion-sub-content' : 'kroma-accordion-content');
        content.innerHTML = `<p>${contentText}</p>`;
  
        item.appendChild(header);
        item.appendChild(content);
        item.removeAttribute('data-header');
        item.removeAttribute('data-content');
      });
    });
  });
  
  function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const parentItem = content.parentElement;
    const isOpen = parentItem.classList.contains('kroma-accordion-item-open') || parentItem.classList.contains('kroma-accordion-sub-item-open');
  
    if (isOpen) {
      content.style.height = content.scrollHeight + 'px'; // Start with current height
      content.offsetHeight; // Force reflow
      content.style.height = '0'; // Collapse
  
      parentItem.classList.remove('kroma-accordion-item-open', 'kroma-accordion-sub-item-open');
      content.addEventListener('transitionend', function handler() {
        content.style.paddingTop = '0';
        content.style.paddingBottom = '0';
        content.removeEventListener('transitionend', handler);
      });
    } else {
      const parent = element.closest('.kroma-accordion-container, .kroma-accordion-item, .kroma-accordion-sub-item');
      const openSubItems = parent.querySelectorAll('.kroma-accordion-item-open > .kroma-accordion-content, .kroma-accordion-sub-item-open > .kroma-accordion-sub-content');
  
      openSubItems.forEach(subItem => {
        subItem.style.height = subItem.scrollHeight + 'px';
        subItem.offsetHeight; // Force reflow
        subItem.style.height = '0';
        subItem.parentElement.classList.remove('kroma-accordion-item-open', 'kroma-accordion-sub-item-open');
      });
  
      content.style.height = '0';
      content.style.paddingTop = '';
      content.style.paddingBottom = '';
      parentItem.classList.add('kroma-accordion-item-open', 'kroma-accordion-sub-item-open');
      content.offsetHeight; // Force reflow
      content.style.height = content.scrollHeight + 'px'; // Expand to full height
  
      content.addEventListener('transitionend', function handler() {
        content.style.height = 'auto';
        content.removeEventListener('transitionend', handler);
      });
    }
  }
  