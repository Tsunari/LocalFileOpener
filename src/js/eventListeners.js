import { saveFilePaths, saveGroup, saveDarkModeState, saveTextareaInput, savePathTypeState } from './storageHandlers.js';
import { showSnackbar, updateModeIcon } from './uiHandlers.js';



export function handlePathTypeToggle(pathTypeToggle) {
    const isWebPath = pathTypeToggle.checked;
    savePathTypeState(isWebPath);
}

export function handleTextareaInput(filePathInput) {
    chrome.storage.local.get({ persistentStorage: true }, (result) => {
        if (result.persistentStorage) {
            saveTextareaInput(filePathInput.value);
        } else {
            chrome.storage.local.remove('textareaInput');
        }
    });
}

export function handleAddFilePath(filePathsList, filePathInput) {
    const newFilePaths = filePathInput.value.split('\n').map(filePath => filePath.trim()).filter(filePath => filePath);
    if (newFilePaths.length > 0) {
        saveFilePaths(newFilePaths, filePathsList);
        filePathInput.value = ''; // Clear the input field
    }
}

export function handleAddGroup(filePathsList) {
    const groupName = prompt('Enter group name:');
    if (groupName) {
        saveGroup(groupName, filePathsList);
    }
}


export function handleFileClick(event, filePath) {
    event.preventDefault(); // Prevent default behavior

    if (event.button === 1) { // Middle mouse button
        chrome.tabs.create({ url: filePath, active: false });
    } else if (event.ctrlKey || event.metaKey) { // Ctrl-click or Cmd-click
        chrome.tabs.create({ url: filePath, active: false });
    } else if (event.shiftKey) {
        chrome.windows.create({ url: filePath });
    } else { // Left-click
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            chrome.tabs.update(currentTab.id, { url: filePath });
        });
    }
}
export function handleDarkModeToggle(darkModeToggle, modeIcon) {
    const isDarkMode = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    saveDarkModeState(isDarkMode);
    updateModeIcon(modeIcon, isDarkMode);
}

export function handleFilePickerChange(event, filePathInput) {
    const files = event.target.files;
    if (files.length > 0) {
        filePathInput.value = files[0].webkitRelativePath || files[0].name;
    }
}

export function handleFilePickerButton() {
    showSnackbar('File picker is not supported.');
}

