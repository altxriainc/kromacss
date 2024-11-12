export function showTabContent(event, contentId, containerId) {
    // Find the specific container for this tab set
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.tab');
    const contents = container.querySelectorAll('.tab-content');

    // Deactivate all tabs and contents
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    contents.forEach(content => content.classList.remove('tab-content-active'));

    // Activate the selected tab and show corresponding content
    event.currentTarget.classList.add('tab-active');
    document.getElementById(contentId).classList.add('tab-content-active');
}
