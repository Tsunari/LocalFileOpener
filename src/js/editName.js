import { loadFilePaths } from './storageHandlers.js';

export function createEditIcon(onClick) {
    const editIcon = document.createElement('span');
    editIcon.className = 'material-symbols-outlined';
    editIcon.textContent = 'edit';
    editIcon.style.cursor = 'pointer';
    editIcon.style.fontSize = '15px'; // Adjust size as needed
    editIcon.style.color = getComputedStyle(document.body).getPropertyValue('--icon-color'); // Theme-sensitive color
    editIcon.style.marginLeft = '5px'; // Adjust margin as needed
    editIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Stop event propagation to prevent collapsing
        onClick();
    });
    return editIcon;
}

export function updateFileName(groupIndex, fileIndex, newFileName, newFilePath) {
    chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
        if (groupIndex !== null) {
            result.groups[groupIndex].filePaths[fileIndex].fileName = newFileName;
            result.groups[groupIndex].filePaths[fileIndex].filePath = newFilePath;
        } else {
            result.filePaths[fileIndex].fileName = newFileName;
            result.filePaths[fileIndex].filePath = newFilePath;
        }
        chrome.storage.local.set({ filePaths: result.filePaths, groups: result.groups }, loadFilePaths);
    });
}

export function updateGroupName(groupIndex, newGroupName) {
    chrome.storage.local.get({ groups: [] }, (result) => {
        result.groups[groupIndex].name = newGroupName;
        chrome.storage.local.set({ groups: result.groups }, loadFilePaths);
    });
}

export function openEditFileModal(groupIndex, fileIndex, currentFileName, currentFilePath) {
    const modal = document.getElementById('editFileModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const saveButton = document.getElementById('saveFileChanges');
    const newFileNameInput = document.getElementById('newFileName');
    const newFilePathInput = document.getElementById('newFilePath');

    newFileNameInput.value = currentFileName;
    newFilePathInput.value = currentFilePath;

    modal.style.display = 'block';

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    saveButton.onclick = () => {
        const newFileName = newFileNameInput.value;
        const newFilePath = newFilePathInput.value;
        if (newFileName && newFilePath) {
            updateFileName(groupIndex, fileIndex, newFileName, newFilePath);
            modal.style.display = 'none';
        }
    };
}
