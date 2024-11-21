// let filePaths = [];

// chrome.runtime.onInstalled.addListener(function () {
//     console.log('Extension installed')
//     // Standard-Dateipfad, falls keine JSON-Datei vorhanden ist
//     const defaultFilePath = { filePath: "file:///C:/Users/User1/Downloads/NewFile.pdf" };
    
//     // Überprüfen, ob Dateipfade schon gespeichert sind
//     chrome.storage.local.get('filePaths', function(result) {
//         if (!result.filePaths) {
//             chrome.storage.local.set({ 'filePaths': [defaultFilePath] });
//         } else {
//             filePaths = result.filePaths;
//         }
//     });
// });

// // Funktion, um alle Dateipfade zu laden
// chrome.runtime.onConnect.addListener(function (port) {
//     console.assert(port.name === "popup");

//     // Wenn das Popup nach den Dateipfaden fragt
//     port.onMessage.addListener(function (msg) {
//         if (msg.action === 'getFilePaths') {
//             port.postMessage({ filePaths: filePaths });
//         }
//         if (msg.action === 'saveFilePath') {
//             const newFilePath = msg.filePath;
//             filePaths.push({ filePath: newFilePath });
//             chrome.storage.local.set({ 'filePaths': filePaths });
//         }
//     });
// });
