document.addEventListener('DOMContentLoaded', function () {
    const filePathsList = document.getElementById('filePathsList');
    const addFilePathButton = document.getElementById('addFilePath');

    // Lade gespeicherte Dateipfade aus dem Local Storage
    loadFilePaths();

    // Button zum Hinzufügen eines neuen Dateipfades
    addFilePathButton.addEventListener('click', function () {
        const newFilePath = prompt('Geben Sie den Dateipfad ein:', 'e.g. "C:\\Users\\Username\\Downloads\\New File.pdf"');
        if (newFilePath) {
            // Speichern des neuen Dateipfads
            saveFilePath(convertToFileURL(newFilePath));
        }
    });

    function convertToFileURL(filePath) {
        filePath = filePath.replace(/"/g, '');
        return 'file:///' + filePath.replace(/\\/g, '/');
    }

    // Funktion zum Speichern eines Dateipfads in chrome.storage
    function saveFilePath(filePath) {
        chrome.storage.local.get({ filePaths: [] }, function (result) {
            const filePaths = result.filePaths;
            filePaths.push({ filePath: filePath });
            
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

            filePaths.forEach(function (item) {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = item.filePath;
                link.addEventListener('click', function () {
                    openFile(item.filePath);
                });
                li.appendChild(link);
                filePathsList.appendChild(li);
            });
        });
    }

    // Öffnet die Datei im neuen Tab
    function openFile(filePath) {
        chrome.tabs.create({ url: filePath }, function () {
            window.close(); // Schließt das Popup
        });
    }
});
