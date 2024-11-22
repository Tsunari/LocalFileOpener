document.addEventListener('DOMContentLoaded', function () {
    initializePersistentStorageToggle();
    loadDarkModeState();
});

function initializePersistentStorageToggle() {
    const persistentStorageToggle = document.getElementById('persistentStorageToggle');

    if (persistentStorageToggle) {
        // Load saved persistent storage state from Local Storage
        loadPersistentStorageState(persistentStorageToggle);

        // Event listener for the toggle switch
        persistentStorageToggle.addEventListener('change', () => handlePersistentStorageToggle(persistentStorageToggle));
    }
}

function handlePersistentStorageToggle(persistentStorageToggle) {
    const isPersistentStorage = persistentStorageToggle.checked;
    savePersistentStorageState(isPersistentStorage);
}

function savePersistentStorageState(isPersistentStorage) {
    chrome.storage.local.set({ persistentStorage: isPersistentStorage });
}

function loadPersistentStorageState(persistentStorageToggle) {
    chrome.storage.local.get({ persistentStorage: false }, (result) => {
        const isPersistentStorage = result.persistentStorage;
        persistentStorageToggle.checked = isPersistentStorage;
    });
}

function loadDarkModeState() {
    chrome.storage.local.get({ darkMode: false }, (result) => {
        const isDarkMode = result.darkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
    });
}