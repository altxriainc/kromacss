function initializeKromaFileUploadComponents() {
    document.querySelectorAll('.kroma-file-upload').forEach((fileUpload) => {
        const dropzone = fileUpload.querySelector('.kroma-file-upload-dropzone');
        const input = fileUpload.querySelector('.kroma-file-upload-input');
        const isMultiple = fileUpload.dataset.multiple === 'true';
        const fileList = fileUpload.querySelector('.kroma-file-upload-list');
        const fileNameDisplay = fileUpload.querySelector('.kroma-file-upload-filename');
        const fileProgressDisplay = fileUpload.querySelector('.kroma-file-upload-progress');

        // Handle click to open file selector
        dropzone.addEventListener('click', () => input.click());

        // Handle file selection
        input.addEventListener('change', (event) => {
            handleFiles(event.target.files);
        });

        // Drag and drop functionality
        dropzone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropzone.classList.add('dragging');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragging');
        });

        dropzone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropzone.classList.remove('dragging');
            const files = event.dataTransfer.files;
            input.files = files; // Update input's file list
            handleFiles(files);
        });

        // Handle files
        function handleFiles(files) {
            const fileArray = Array.from(files);
            if (fileArray.length === 0) return;

            if (isMultiple && fileList) {
                fileList.innerHTML = ''; // Clear existing list
                fileArray.forEach((file) => appendFileToList(file, fileList));
            } else if (fileNameDisplay && fileProgressDisplay) {
                const file = fileArray[0];
                fileNameDisplay.textContent = file.name;
                fileProgressDisplay.textContent = 'Ready to upload';
            }
        }

        // Append a file to the list
        function appendFileToList(file, listContainer) {
            const listItem = document.createElement('div');
            listItem.className = 'kroma-file-upload-list-item';
            const fileNameSpan = document.createElement('span');
            fileNameSpan.textContent = file.name;
            const removeButton = document.createElement('button');
            removeButton.setAttribute('aria-label', 'Remove file');
            removeButton.textContent = '×';
            listItem.appendChild(fileNameSpan);
            listItem.appendChild(removeButton);
            // Handle remove file
            listItem.querySelector('button').addEventListener('click', () => {
                listItem.remove();
            });
            listContainer.appendChild(listItem);
        }
    });
}

// Automatically initialize components on DOM load
document.addEventListener('DOMContentLoaded', initializeKromaFileUploadComponents);
