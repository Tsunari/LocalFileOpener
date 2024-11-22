import { handleFileClick } from './eventListeners.js';
import { convertToFileURL, deleteFilePath, extractFileName, moveFilePath, openAllFilesInGroup } from './fileHandlers.js';
import { updateModeIcon } from './uiHandlers.js';
import { createEditIcon, updateFileName, updateGroupName } from './editName.js';

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
                const groupElement = document.createElement('div');
                groupElement.className = 'group';
                if (group.collapsed) {
                    groupElement.classList.add('collapsed');
                } else {
                    groupElement.classList.add('expanded');
                }

                const groupHeader = document.createElement('div');
                groupHeader.className = 'group-header';
                const groupHeaderText = document.createElement('span');
                groupHeaderText.textContent = group.name;
                groupHeader.appendChild(groupHeaderText);
                groupHeader.addEventListener('click', () => {
                    groupElement.classList.toggle('collapsed');
                    groupElement.classList.toggle('expanded');
                    group.collapsed = !group.collapsed;
                    saveGroups(groups);
                });

                const editGroupIcon = createEditIcon(() => {
                    const newGroupName = prompt('Enter new group name:', group.name);
                    if (newGroupName) {
                        updateGroupName(groupIndex, newGroupName);
                    }
                });
                groupHeaderText.appendChild(editGroupIcon); // Move icon closer to the text

                const openAllButton = document.createElement('button');
                openAllButton.textContent = 'Open All';
                openAllButton.className = 'open-all';
                openAllButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    openAllFilesInGroup(event, group.filePaths, group.name, group.openInChromeGroup);
                });

                const chromeGroupToggle = document.createElement('input');
                chromeGroupToggle.type = 'checkbox';
                chromeGroupToggle.checked = group.openInChromeGroup;
                chromeGroupToggle.addEventListener('change', (event) => {
                    group.openInChromeGroup = event.target.checked;
                    saveGroups(groups);
                });

                const chromeGroupLabel = document.createElement('label');
                chromeGroupLabel.className = 'switch';
                chromeGroupLabel.appendChild(chromeGroupToggle);
                chromeGroupLabel.appendChild(document.createElement('span')).className = 'slider round';

                const chromeGroupContainer = document.createElement('div');
                chromeGroupContainer.className = 'chrome-group-toggle';
                chromeGroupContainer.appendChild(document.createTextNode('Open in Chrome Group'));
                chromeGroupContainer.appendChild(chromeGroupLabel);

                const deleteGroupIcon = document.createElement('img');
                deleteGroupIcon.src = 'res/trash-light.png';
                deleteGroupIcon.className = 'trash-icon delete-group';
                deleteGroupIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    deleteGroup(groupIndex);
                });

                const actionsContainer = document.createElement('div');
                actionsContainer.style.display = 'flex';
                actionsContainer.style.alignItems = 'center';
                actionsContainer.appendChild(chromeGroupContainer);
                actionsContainer.appendChild(openAllButton);
                actionsContainer.appendChild(deleteGroupIcon);

                groupHeader.appendChild(actionsContainer);

                const groupContent = document.createElement('div');
                groupContent.className = 'group-content';

                group.filePaths.forEach((item, index) => {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = item.fileName; // Display the filename
                    link.addEventListener('click', (event) => handleFileClick(event, item.filePath));
                    link.addEventListener('auxclick', (event) => handleFileClick(event, item.filePath)); // Handle middle-click

                    const linkContainer = document.createElement('span');
                    linkContainer.style.display = 'flex';
                    linkContainer.style.alignItems = 'center';
                    linkContainer.appendChild(link);
                    const editFileIcon = createEditIcon(() => {
                        const newFileName = prompt('Enter new file name:', item.fileName);
                        if (newFileName) {
                            updateFileName(groupIndex, index, newFileName);
                        }
                    });
                    linkContainer.appendChild(editFileIcon);
                    li.appendChild(linkContainer);

                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = 'res/trash-light.png';
                    deleteIcon.className = 'trash-icon';
                    deleteIcon.addEventListener('click', () => deleteFilePath(groupIndex, index));

                    const moveDropdown = document.createElement('select');
                    moveDropdown.innerHTML = `<option value="">Move to...</option><option value="main">Main List</option>`;
                    groups.forEach((group, groupIndex) => {
                        const option = document.createElement('option');
                        option.value = groupIndex;
                        option.textContent = group.name;
                        moveDropdown.appendChild(option);
                    });
                    moveDropdown.addEventListener('change', (event) => moveFilePath(groupIndex, index, event.target.value));

                    const actionsContainer = document.createElement('div');
                    actionsContainer.style.display = 'flex';
                    actionsContainer.style.alignItems = 'center';
                    actionsContainer.appendChild(moveDropdown);
                    actionsContainer.appendChild(deleteIcon);

                    li.appendChild(actionsContainer);
                    groupContent.appendChild(li);
                });

                groupElement.appendChild(groupHeader);
                groupElement.appendChild(groupContent);
                filePathsList.appendChild(groupElement);
            });

            filePaths.forEach((item, index) => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = item.fileName; // Display the filename
                link.addEventListener('click', (event) => handleFileClick(event, item.filePath));
                link.addEventListener('auxclick', (event) => handleFileClick(event, item.filePath)); // Handle middle-click

                const linkContainer = document.createElement('span');
                linkContainer.style.display = 'flex';
                linkContainer.style.alignItems = 'center';
                linkContainer.appendChild(link);
                const editFileIcon = createEditIcon(() => {
                    const newFileName = prompt('Enter new file name:', item.fileName);
                    if (newFileName) {
                        updateFileName(null, index, newFileName);
                    }
                });
                linkContainer.appendChild(editFileIcon);
                li.appendChild(linkContainer);

                const deleteIcon = document.createElement('img');
                deleteIcon.src = 'res/trash-light.png';
                deleteIcon.className = 'trash-icon';
                deleteIcon.addEventListener('click', () => deleteFilePath(null, index));

                const moveDropdown = document.createElement('select');
                moveDropdown.innerHTML = `<option value="">Move to group...</option>`;
                groups.forEach((group, groupIndex) => {
                    const option = document.createElement('option');
                    option.value = groupIndex;
                    option.textContent = group.name;
                    moveDropdown.appendChild(option);
                });
                moveDropdown.addEventListener('change', (event) => moveFilePath(null, index, event.target.value));

                const actionsContainer = document.createElement('div');
                actionsContainer.style.display = 'flex';
                actionsContainer.style.alignItems = 'center';
                actionsContainer.appendChild(moveDropdown);
                actionsContainer.appendChild(deleteIcon);

                li.appendChild(actionsContainer);
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

function deleteGroup(groupIndex) {;
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