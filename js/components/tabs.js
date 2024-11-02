export function showTabContent(event, contentId, containerId) {
    // Get all tabs and contents within the specific container
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.tab');
    const contents = container.parentNode.querySelectorAll('.tab-content');

    // Remove active class from all tabs and hide all contents
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    contents.forEach(content => content.classList.remove('tab-content-active'));

    // Activate the selected tab and show corresponding content
    event.currentTarget.classList.add('tab-active');
    document.getElementById(contentId).classList.add('tab-content-active');
}