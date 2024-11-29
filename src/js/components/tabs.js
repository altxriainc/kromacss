function toggleTabContent(event, contentId, containerId) {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.kroma-tab');
    const contents = container.querySelectorAll('.kroma-tab-content');

    // Deactivate all tabs and contents
    tabs.forEach(tab => tab.classList.remove('kroma-tab-active'));
    contents.forEach(content => {
        content.classList.remove('kroma-tab-content-active');
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Activate selected tab and corresponding content
    event.currentTarget.classList.add('kroma-tab-active');
    const activeContent = document.getElementById(contentId);
    activeContent.classList.add('kroma-tab-content-active');
}
