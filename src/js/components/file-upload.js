export function initializeFileUploadComponents() {
    document.querySelectorAll('.file-upload').forEach((fileUpload) => {
        const dropzone = fileUpload.querySelector('.file-upload-dropzone');
        const input = fileUpload.querySelector('.file-upload-input');
        const isMultiple = fileUpload.dataset.multiple === 'true';
        const fileList = fileUpload.querySelector('.file-upload-list');
        const fileNameDisplay = fileUpload.querySelector('.file-upload-filename');
        const fileProgressDisplay = fileUpload.querySelector('.file-upload-progress');

        dropzone.addEventListener('click', () => input.click());

        input.addEventListener('change', (event) => {
            const files = Array.from(event.target.files);
            if (files.length === 0) return;

            if (isMultiple && fileList) {
                fileList.innerHTML = '';
                files.forEach((file) => appendFileToList(file, fileList));
            } else if (fileNameDisplay && fileProgressDisplay) {
                const file = files[0];
                fileNameDisplay.textContent = file.name;
                fileProgressDisplay.textContent = 'Ready to upload';
            }
        });

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
            const files = Array.from(event.dataTransfer.files);
            input.files = event.dataTransfer.files;

            if (isMultiple && fileList) {
                fileList.innerHTML = '';
                files.forEach((file) => appendFileToList(file, fileList));
            } else if (fileNameDisplay && fileProgressDisplay) {
                const file = files[0];
                fileNameDisplay.textContent = file.name;
                fileProgressDisplay.textContent = 'Ready to upload';
            }
        });

        function appendFileToList(file, listContainer) {
            const listItem = document.createElement('div');
            listItem.className = 'file-upload-list-item';
            listItem.innerHTML = `
                <span>${file.name}</span>
                <button aria-label="Remove file">&times;</button>
            `;
            listItem.querySelector('button').addEventListener('click', () => {
                listItem.remove();
            });
            listContainer.appendChild(listItem);
        }
    });
}
