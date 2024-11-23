import { loadFilePaths } from './storageHandlers.js';

export function createSaveIcon(onClick) {
    const saveIcon = document.createElement('span');
    saveIcon.className = 'material-symbols-outlined';
    saveIcon.textContent = 'save';
    saveIcon.style.cursor = 'pointer';
    saveIcon.style.fontSize = '20px'; // Adjust size as needed
    saveIcon.style.color = getComputedStyle(document.body).getPropertyValue('--icon-color'); // Theme-sensitive color
    saveIcon.style.marginLeft = '5px'; // Adjust margin as needed
    saveIcon.addEventListener('click', onClick);
    return saveIcon;
}

export function saveGroupToFile(group) {
    const groupData = {
        name: group.name,
        filePaths: group.filePaths
    };
    const blob = new Blob([JSON.stringify(groupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${group.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function loadGroupFromFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const group = JSON.parse(event.target.result);
            chrome.storage.local.get({ groups: [] }, (result) => {
                const groups = result.groups;
                const existingGroup = groups.find(g => g.name === group.name);
                if (!existingGroup) {
                    groups.push(group);
                    chrome.storage.local.set({ groups: groups }, loadFilePaths);
                } else {
                    console.warn('Group with the same name already exists.');
                }
            });
        } catch (error) {
            console.error('Error parsing JSON file:', error);
        }
    };
    reader.readAsText(file);
}

document.getElementById('loadGroupButton').addEventListener('click', () => {
    document.getElementById('loadGroupInput').click();
});

document.getElementById('loadGroupInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        loadGroupFromFile(file);
        event.target.value = ''; // Reset the input value to allow loading the same file again
    }
});