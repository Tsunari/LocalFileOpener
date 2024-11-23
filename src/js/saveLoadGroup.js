
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