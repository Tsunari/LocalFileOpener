import { pathTypeToggle } from './popup';
import { loadFilePaths } from './storageHandlers';
import { showSnackbar } from './uiHandlers';


export function convertToFileURL(filePath) {
    filePath = filePath.replace(/"/g, '');
    if (!pathTypeToggle.checked) {
        return 'file:///' + filePath.replace(/\\/g, '/');
    }
    return filePath;
}

export function extractFileName(filePath) {
    const normalizedPath = filePath.replace(/"/g, '').replace(/\\/g, '/');
    return normalizedPath.split('/').pop();
}

export function openAllFilesInGroup(event, filePaths, groupName, openInChromeGroup) {
    if (openInChromeGroup) {
        if (event.shiftKey) {
            showSnackbar('Chrome group shift-click functionality is currently not available.');
        } else {
            chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
                const tabIds = [];
                filePaths.forEach(file => {
                    chrome.tabs.create({ url: file.filePath, windowId: currentWindow.id, active: false }, (tab) => {
                        tabIds.push(tab.id);
                        if (tabIds.length === filePaths.length) {
                            chrome.tabs.group({ tabIds: tabIds }, (groupId) => {
                                chrome.tabGroups.update(groupId, { title: groupName });
                            });
                        }
                    });
                });
            });
        }
    } else if (event.shiftKey) {
        chrome.windows.create({ url: filePaths.map(file => file.filePath), focused: true });
    } else {
        filePaths.forEach(file => {
            chrome.tabs.create({ url: file.filePath, active: false });
        });
    }
}

export function moveFilePath(currentGroupIndex, filePathIndex, targetGroupIndex) {
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

export function deleteFilePath(groupIndex, index) {
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