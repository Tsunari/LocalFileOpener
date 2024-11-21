document.addEventListener('DOMContentLoaded', function () {
    const filePathsList = document.getElementById('filePathsList');
    const addFilePathButton = document.getElementById('addFilePath');
    const addGroupButton = document.getElementById('addGroupButton');
    const filePathInput = document.getElementById('filePathInput');
    const filePickerButton = document.getElementById('filePickerButton');
    const filePicker = document.getElementById('filePicker');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const modeIcon = document.getElementById('modeIcon');

    // Load saved file paths, dark mode state, and textarea input from Local Storage
    loadFilePaths();
    loadDarkModeState();
    loadTextareaInput();

    // Event listeners
    addFilePathButton.addEventListener('click', handleAddFilePath);
    addGroupButton.addEventListener('click', handleAddGroup);
    filePicker.addEventListener('change', handleFilePickerChange);
    darkModeToggle.addEventListener('change', handleDarkModeToggle);
    filePathInput.addEventListener('input', handleTextareaInput);

    function handleAddFilePath() {
        const newFilePaths = filePathInput.value.split('\n').map(filePath => filePath.trim()).filter(filePath => filePath);
        if (newFilePaths.length > 0) {
            saveFilePaths(newFilePaths);
            filePathInput.value = ''; // Clear the input field
        }
    }

    function handleAddGroup() {
        const groupName = prompt('Enter group name:');
        if (groupName) {
            saveGroup(groupName);
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

    function handleTextareaInput() {
        chrome.storage.local.get({ persistentStorage: true }, (result) => {
            if (result.persistentStorage) {
                saveTextareaInput(filePathInput.value);
            } else {
                chrome.storage.local.remove('textareaInput');
            }
        });
    }

    function convertToFileURL(filePath) {
        filePath = filePath.replace(/"/g, '');
        return 'file:///' + filePath.replace(/\\/g, '/');
    }

    function saveFilePaths(filePaths) {
        chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
            const existingFilePaths = result.filePaths;
            filePaths.forEach(filePath => {
                existingFilePaths.push({ filePath: convertToFileURL(filePath), fileName: extractFileName(filePath) });
            });
            chrome.storage.local.set({ filePaths: existingFilePaths }, loadFilePaths);
        });
    }

    function saveGroup(groupName) {
        chrome.storage.local.get({ groups: [] }, (result) => {
            const groups = result.groups;
            groups.push({ name: groupName, filePaths: [], collapsed: true });
            chrome.storage.local.set({ groups: groups }, loadFilePaths);
        });
    }

    function loadFilePaths() {
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
                    groupHeader.textContent = group.name;
                    groupHeader.addEventListener('click', () => {
                        groupElement.classList.toggle('collapsed');
                        groupElement.classList.toggle('expanded');
                        group.collapsed = !group.collapsed;
                        saveGroups(groups);
                    });

                    const openAllButton = document.createElement('button');
                    openAllButton.textContent = 'Open All';
                    openAllButton.className = 'open-all';
                    openAllButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        openAllFilesInGroup(event, group.filePaths);
                    });

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

                        li.appendChild(link);
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

                    li.appendChild(link);
                    li.appendChild(actionsContainer);
                    filePathsList.appendChild(li);
                });
            }
        });
    }

    function handleFileClick(event, filePath) {
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

    function openAllFilesInGroup(event, filePaths) {
        if (event.shiftKey) {
            chrome.windows.create({ url: filePaths.map(file => file.filePath) });
        } else {
            filePaths.forEach(file => {
                chrome.tabs.create({ url: file.filePath, active: false });
            });
        }
    }

    function moveFilePath(currentGroupIndex, filePathIndex, targetGroupIndex) {
        chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
            const filePaths = result.filePaths;
            const groups = result.groups;
            let filePath;

            if (currentGroupIndex !== null) {
                filePath = groups[currentGroupIndex].filePaths.splice(filePathIndex, 1)[0];
            } else {
                filePath = filePaths.splice(filePathIndex, 1)[0];
            }

            if (targetGroupIndex === 'main') {
                filePaths.push(filePath);
            } else {
                groups[targetGroupIndex].filePaths.push(filePath);
            }

            chrome.storage.local.set({ filePaths: filePaths, groups: groups }, loadFilePaths);
        });
    }

    function deleteFilePath(groupIndex, index) {
        chrome.storage.local.get({ filePaths: [], groups: [] }, (result) => {
            if (groupIndex !== null) {
                const groups = result.groups;
                groups[groupIndex].filePaths.splice(index, 1);
                chrome.storage.local.set({ groups: groups }, loadFilePaths);
            } else {
                const filePaths = result.filePaths;
                filePaths.splice(index, 1);
                chrome.storage.local.set({ filePaths: filePaths }, loadFilePaths);
            }
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

    function extractFileName(filePath) {
        const normalizedPath = filePath.replace(/"/g, '').replace(/\\/g, '/');
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

    function saveTextareaInput(input) {
        chrome.storage.local.set({ textareaInput: input });
    }

    function loadTextareaInput() {
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
});
