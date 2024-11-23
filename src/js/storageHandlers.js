import { handleFileClick } from './eventListeners.js';
import { convertToFileURL, deleteFilePath, extractFileName, moveFilePath, openAllFilesInGroup } from './fileHandlers.js';
import { updateModeIcon } from './uiHandlers.js';
import { createEditIcon, updateFileName, updateGroupName } from './editName.js';
import { createSaveIcon, saveGroupToFile } from './saveLoadGroup.js';
import { createGroupElement, createFilePathElement } from './filePathsList.js';

export function loadFilePaths() {
    const filePathsList = document.getElementById('filePathsList');
    chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
        const filePaths = result.filePaths;
        const groups = result.groups;
        filePathsList.innerHTML = ''; // Reset list

        if (filePaths.length === 0 && groups.length === 0) {
            const noFilePathsMessage = document.createElement('p');
            noFilePathsMessage.textContent = 'No file paths saved.';
            filePathsList.appendChild(noFilePathsMessage);
        } else {
            groups.forEach((group, groupIndex) => {
                const groupElement = createGroupElement(group, groupIndex, groups, saveGroups, deleteGroup);
                filePathsList.appendChild(groupElement);
            });

            filePaths.forEach((item, index) => {
                const li = createFilePathElement(item, null, index, groups);
                filePathsList.appendChild(li);
            });
        }
    });
}

export function saveFilePaths(filePaths) {
    chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
        const existingFilePaths = result.filePaths;
        filePaths.forEach(filePath => {
            existingFilePaths.push({ filePath: convertToFileURL(filePath), fileName: extractFileName(filePath) });
        });
        chrome.storage.local.set({ filePaths: existingFilePaths }, loadFilePaths);
    });
}

export function saveGroup(groupName) {
    chrome.storage.local.get({ groups: [] }, (result) => {
        const groups = result.groups;
        groups.push({ name: groupName, filePaths: [], collapsed: true, openInChromeGroup: false });
        chrome.storage.local.set({ groups: groups }, loadFilePaths);
    });
}

function deleteGroup(groupIndex) {
    chrome.storage.local.get({ groups: [] }, (result) => {
        const groups = result.groups;
        groups.splice(groupIndex, 1);
        chrome.storage.local.set({ groups: groups }, loadFilePaths);
    });
}

function saveGroups(groups) {
    chrome.storage.local.set({ groups: groups });
}

export function loadDarkModeState(darkModeToggle, modeIcon) {
    chrome.storage.local.get({ darkMode: false }, (result) => {
        const isDarkMode = result.darkMode;
        darkModeToggle.checked = isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        updateModeIcon(modeIcon, isDarkMode);
    });
}

export function saveDarkModeState(isDarkMode) {
    chrome.storage.local.set({ darkMode: isDarkMode });
}

export function loadTextareaInput(filePathInput) {
    chrome.storage.local.get({ persistentStorage: false }, (storageResult) => {
        if (storageResult.persistentStorage) {
            chrome.storage.local.get({ textareaInput: '' }, (result) => {
                filePathInput.value = result.textareaInput;
            });
        } else {
            filePathInput.value = '';
        }
    });
}

export function saveTextareaInput(input) {
    chrome.storage.local.set({ textareaInput: input });
}

export function loadPathTypeState(pathTypeToggle) {
    chrome.storage.local.get({ pathType: false }, (result) => {
        const isWebPath = result.pathType;
        pathTypeToggle.checked = isWebPath;
    });
}

export function savePathTypeState(isWebPath) {
    chrome.storage.local.set({ pathType: isWebPath });
}