
export function showSnackbar(message) {
    const snackbar = document.createElement('div');
    snackbar.className = 'snackbar';
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.add('show');
    }, 100);

    setTimeout(() => {
        snackbar.classList.remove('show');
        snackbar.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(snackbar);
        }, 500);
    }, 2000);
}

export function updateModeIcon(modeIcon, isDarkMode) {
    modeIcon.src = isDarkMode ? 'res/dark-mode-icon.png' : 'res/light-mode-icon.png';
}