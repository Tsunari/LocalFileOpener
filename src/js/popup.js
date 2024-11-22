
import { loadFilePaths, loadDarkModeState, loadTextareaInput, loadPathTypeState } from './storageHandlers.js';
import { handleAddFilePath, handleAddGroup, handleFilePickerChange, handleDarkModeToggle, handleTextareaInput, handlePathTypeToggle, handleFilePickerButton } from './eventListeners.js';

document.addEventListener('DOMContentLoaded', () => {
    const addFilePathButton = document.getElementById('addFilePath');
    const addGroupButton = document.getElementById('addGroupButton');
    const filePickerButton = document.getElementById('filePickerButton');
    const filePicker = document.getElementById('filePicker');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const filePathInput = document.getElementById('filePathInput');
    const pathTypeToggle = document.getElementById('pathTypeToggle');
    
    const modeIcon = document.getElementById('modeIcon');
    const filePathsList = document.getElementById('filePathsList');

    // Load saved file paths, dark mode state, and textarea input from Local Storage
    loadFilePaths(filePathsList);
    loadDarkModeState(darkModeToggle, modeIcon);
    loadTextareaInput(filePathInput);
    loadPathTypeState(pathTypeToggle);

    // Event listeners
    filePathInput.addEventListener('input', () => handleTextareaInput(filePathInput));
    addFilePathButton.addEventListener('click', () => handleAddFilePath(filePathsList, filePathInput));
    addGroupButton.addEventListener('click', () => handleAddGroup(filePathsList));
    filePickerButton.addEventListener('click', handleFilePickerButton);
    filePicker.addEventListener('change', (event) => handleFilePickerChange(event, filePathInput));
    darkModeToggle.addEventListener('change',() => handleDarkModeToggle(darkModeToggle, modeIcon));
    pathTypeToggle.addEventListener('change', () => handlePathTypeToggle(pathTypeToggle));
});