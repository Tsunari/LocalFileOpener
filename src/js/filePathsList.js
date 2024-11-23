import { handleFileClick } from './eventListeners.js';
import { createEditIcon, updateFileName, updateGroupName } from './editName.js';
import { createSaveIcon, saveGroupToFile } from './saveLoadGroup.js';
import { openAllFilesInGroup } from './fileHandlers.js';
import { deleteFilePath, moveFilePath } from './fileHandlers.js';

export function createGroupElement(group, groupIndex, groups, saveGroups, deleteGroup) {
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
    groupHeaderText.appendChild(editGroupIcon);

    const openAllButton = document.createElement('button');
    openAllButton.textContent = 'Open All';
    openAllButton.className = 'open-all';
    openAllButton.style.marginRight = '5px';
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
    deleteGroupIcon.style.marginLeft = '5px';
    deleteGroupIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteGroup(groupIndex);
    });

    const saveGroupIcon = createSaveIcon((event) => {
        event.stopPropagation();
        saveGroupToFile(group);
    });

    const actionsContainer = document.createElement('div');
    actionsContainer.style.display = 'flex';
    actionsContainer.style.alignItems = 'center';
    actionsContainer.appendChild(chromeGroupContainer);
    actionsContainer.appendChild(openAllButton);
    actionsContainer.appendChild(saveGroupIcon);
    actionsContainer.appendChild(deleteGroupIcon);

    groupHeader.appendChild(actionsContainer);

    const groupContent = document.createElement('div');
    groupContent.className = 'group-content';

    group.filePaths.forEach((item, index) => {
        const li = createFilePathElement(item, groupIndex, index, groups);
        groupContent.appendChild(li);
    });

    groupElement.appendChild(groupHeader);
    groupElement.appendChild(groupContent);

    return groupElement;
}

export function createFilePathElement(item, groupIndex, index, groups) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = item.fileName;
    link.addEventListener('click', (event) => handleFileClick(event, item.filePath));
    link.addEventListener('auxclick', (event) => handleFileClick(event, item.filePath));

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

    return li;
}