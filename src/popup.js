document.addEventListener('DOMContentLoaded', function () {
    const filePathsList = document.getElementById('filePathsList');
    const addFilePathButton = document.getElementById('addFilePath');
    const filePathInput = document.getElementById('filePathInput');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Lade gespeicherte Dateipfade aus dem Local Storage
    loadFilePaths();

    // Button zum Hinzufügen eines neuen Dateipfades
    addFilePathButton.addEventListener('click', function () {
        const newFilePath = filePathInput.value;
        if (newFilePath) {
            // Speichern des neuen Dateipfads
            saveFilePath(convertToFileURL(newFilePath));
            filePathInput.value = ''; // Clear the input field
        }
    });

    darkModeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    });

    function convertToFileURL(filePath) {
        filePath = filePath.replace(/"/g, '');
        return 'file:///' + filePath.replace(/\\/g, '/');
    }

    // Funktion zum Speichern eines Dateipfads in chrome.storage
    function saveFilePath(filePath) {
        chrome.storage.local.get({ filePaths: [] }, function (result) {
            const filePaths = result.filePaths;
            filePaths.push({ filePath: filePath, fileName: extractFileName(filePath) });
            
            chrome.storage.local.set({ filePaths: filePaths }, function () {
                loadFilePaths(); // Lade die Dateipfade nach dem Speichern neu
            });
        });
    }

    // Funktion zum Laden der Dateipfade aus chrome.storage
    function loadFilePaths() {
        chrome.storage.local.get({ filePaths: [] }, function (result) {
            const filePaths = result.filePaths;
            filePathsList.innerHTML = ''; // Liste zurücksetzen

            if (filePaths.length === 0) {
                const noFilePathsMessage = document.createElement('p');
                noFilePathsMessage.textContent = 'No file paths saved.';
                filePathsList.appendChild(noFilePathsMessage);
            } else {
                filePaths.forEach(function (item, index) {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = item.fileName; // Display the filename
                    link.addEventListener('click', function () {
                        openFile(item.filePath);
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function () {
                        deleteFilePath(index);
                    });

                    li.appendChild(link);
                    li.appendChild(deleteButton);
                    filePathsList.appendChild(li);
                });
            }
        });
    }

    // Öffnet die Datei im neuen Tab
    function openFile(filePath) {
        chrome.tabs.create({ url: filePath }, function () {
            window.close(); // Schließt das Popup
        });
    }

    // Funktion zum Löschen eines Dateipfads aus chrome.storage
    function deleteFilePath(index) {
        chrome.storage.local.get({ filePaths: [] }, function (result) {
            const filePaths = result.filePaths;
            filePaths.splice(index, 1);

            chrome.storage.local.set({ filePaths: filePaths }, function () {
                loadFilePaths(); // Lade die Dateipfade nach dem Löschen neu
            });
        });
    }

    // Funktion zum Extrahieren des Dateinamens aus dem Dateipfad
    function extractFileName(filePath) {
        return filePath.split('/').pop();
    }
});
