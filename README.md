# Chrome Extension - File Path Opener

This is a simple Chrome extension that allows users to store, manage, and open local file paths directly in the browser. The extension stores file paths persistently using Chrome's local storage API, enabling you to open documents, images, and other files from your local machine with just a click.

## Features

- **Store and manage file paths**: Save local file paths in the extension's storage and manage them easily.
- **Persistent storage**: File paths are saved across browser sessions using `chrome.storage.local`, ensuring that saved paths are available even after the browser or extension is restarted.
- **Open files in new tabs**: Open saved file paths directly in new browser tabs.
- **Simple user interface**: The extension provides a straightforward popup for adding and viewing file paths.

## How It Works

1. **Add a file path**: Enter a valid file path (e.g., `file:///C:/Users/Username/Documents/File.pdf`) in the input field.
2. **Store the path**: The file path is saved in Chrome's local storage for persistent access.
3. **View saved file paths**: Saved file paths are listed in the popup, and each path can be clicked to open the corresponding file in a new tab.
4. **Support for Windows paths**: File paths entered in Windows format (e.g., `C:\Users\Username\Documents\File.pdf`) are automatically converted to the `file:///` URL format.
5. Webpage paths can also be saved and opened. For this just toggle the Web Path switch.

## Installation

1. [Download the latest release](https://github.com/Tsunari/LocalFileOpener/releases/latest) or clone the repository. 
2. Navigate to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode** at the top right.
4. Click **Load unpacked** and select the `src` directory.
5. The extension icon should appear in your browser's toolbar.

## Usage

- Click the extension icon to open the popup.
- Enter path in the provided input field and click **Save** to add it to the list.
- Click on any saved file path to open it in a new tab.

## Technologies Used

- **Chrome Extensions API**
- **HTML/CSS**
- **JavaScript (ES6+)**
- **Chrome Storage API**

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. Any suggestions or improvements are welcome!
