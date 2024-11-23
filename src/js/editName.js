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

export function updateFileName(groupIndex, fileIndex, newFileName) {
    chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
        if (groupIndex !== null) {
            result.groups[groupIndex].filePaths[fileIndex].fileName = newFileName;
        } else {
            result.filePaths[fileIndex].fileName = newFileName;
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
