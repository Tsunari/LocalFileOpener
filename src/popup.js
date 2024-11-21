document.addEventListener('DOMContentLoaded', function () {
    const filePathsList = document.getElementById('filePathsList');
    const addFilePathButton = document.getElementById('addFilePath');
    const filePathInput = document.getElementById('filePathInput');
    const filePickerButton = document.getElementById('filePickerButton');
    const filePicker = document.getElementById('filePicker');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const modeIcon = document.getElementById('modeIcon');

    // Load saved file paths and dark mode state from Local Storage
    loadFilePaths();
    loadDarkModeState();

    // Event listeners
    addFilePathButton.addEventListener('click', handleAddFilePath);
    // filePickerButton.addEventListener('click', () => filePicker.click());
    filePicker.addEventListener('change', handleFilePickerChange);
    darkModeToggle.addEventListener('change', handleDarkModeToggle);

    function handleAddFilePath() {
        const newFilePaths = filePathInput.value.split('\n').map(filePath => filePath.trim()).filter(filePath => filePath);
        if (newFilePaths.length > 0) {
            saveFilePaths(newFilePaths);
            // filePathInput.value = ''; // Clear the input field
        }
    }

    function handleFilePickerChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
            filePathInput.value = files[0].webkitRelativePath || files[0].name;
        }
    }

    function handleDarkModeToggle() {
        const isDarkMode = darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        saveDarkModeState(isDarkMode);
        updateModeIcon(isDarkMode);
    }

    function convertToFileURL(filePath) {
        filePath = filePath.replace(/"/g, '');
        return 'file:///' + filePath.replace(/\\/g, '/');
    }

    function saveFilePaths(filePaths) {
        chrome.storage.local.get({ filePaths: [] }, (result) => {
            const existingFilePaths = result.filePaths;
            filePaths.forEach(filePath => {
                existingFilePaths.push({ filePath: convertToFileURL(filePath), fileName: extractFileName(filePath) });
            });
            chrome.storage.local.set({ filePaths: existingFilePaths }, loadFilePaths);
        });
    }

    function loadFilePaths() {
        chrome.storage.local.get({ filePaths: [] }, (result) => {
            const filePaths = result.filePaths;
            filePathsList.innerHTML = ''; // Reset list

            if (filePaths.length === 0) {
                const noFilePathsMessage = document.createElement('p');
                noFilePathsMessage.textContent = 'No file paths saved.';
                filePathsList.appendChild(noFilePathsMessage);
            } else {
                filePaths.forEach((item, index) => {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = item.fileName; // Display the filename
                    link.addEventListener('click', () => openFile(item.filePath));

                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = 'res/trash-light.png';
                    deleteIcon.className = 'trash-icon';
                    deleteIcon.addEventListener('click', () => deleteFilePath(index));

                    li.appendChild(link);
                    li.appendChild(deleteIcon);
                    filePathsList.appendChild(li);
                });
            }
        });
    }

    function openFile(filePath) {
        chrome.tabs.create({ url: filePath }, () => window.close());
    }

    function deleteFilePath(index) {
        chrome.storage.local.get({ filePaths: [] }, (result) => {
            const filePaths = result.filePaths;
            filePaths.splice(index, 1);
            chrome.storage.local.set({ filePaths: filePaths }, loadFilePaths);
        });
    }

    function extractFileName(filePath) {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/"/g, '').replace(/\\/g, '/');
        // Split the path and return the last part
        return normalizedPath.split('/').pop();
    }

    function saveDarkModeState(isDarkMode) {
        chrome.storage.local.set({ darkMode: isDarkMode });
    }

    function loadDarkModeState() {
        chrome.storage.local.get({ darkMode: false }, (result) => {
            const isDarkMode = result.darkMode;
            darkModeToggle.checked = isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            updateModeIcon(isDarkMode);
        });
    }

    function updateModeIcon(isDarkMode) {
        modeIcon.src = isDarkMode ? 'res/dark-mode-icon.png' : 'res/light-mode-icon.png';
    }
});
