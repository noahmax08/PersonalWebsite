const icons = document.querySelectorAll('.icon');
const closeButtons = document.querySelectorAll('.closeButton');
const startButton = document.getElementById('startButton');
const settingsButton = document.getElementById('settingsButton');
const taskbarItems = document.getElementById('taskbarItems');

let zIndexCounter = 10; // tracks which window should be "on top"

// Open (or focus) a window when a desktop icon is clicked
icons.forEach(icon => {
    icon.addEventListener('click', function() {
        const folderName = icon.getAttribute('data-folder');
        openWindow(folderName);
    });
});

function openWindow(folderName) {
    const windowEl = document.getElementById('window-' + folderName);
    if (!windowEl) return;

    // Show the window and bring it to front
    windowEl.classList.remove('hidden');
    zIndexCounter++;
    windowEl.style.zIndex = zIndexCounter;

    // Only add a taskbar button if one doesn't already exist for this folder
    const existingItem = document.getElementById('taskbarItem-' + folderName);
    if (!existingItem) {
        const item = document.createElement('button');
        item.className = 'taskbarItem';
        item.id = 'taskbarItem-' + folderName;
        item.textContent = '📂 ' + folderName;

        item.addEventListener('click', function() {
            // Clicking the taskbar item brings that window to front
            windowEl.classList.remove('hidden');
            zIndexCounter++;
            windowEl.style.zIndex = zIndexCounter;
            setActiveTaskbarItem(item);
        });

        taskbarItems.appendChild(item);
    }

    setActiveTaskbarItem(document.getElementById('taskbarItem-' + folderName));
}

function setActiveTaskbarItem(activeItem) {
    document.querySelectorAll('.taskbarItem').forEach(item => {
        item.classList.remove('active');
    });
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Close a window and remove its taskbar item
closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const folderName = btn.getAttribute('data-close');
        const windowEl = document.getElementById('window-' + folderName);
        windowEl.classList.add('hidden');

        const item = document.getElementById('taskbarItem-' + folderName);
        if (item) {
            item.remove();
        }
    });
});

// Start button - leaves the site
startButton.addEventListener('click', function() {
    window.location.href = 'https://google.com';
});

// Settings button - opens a window instead of navigating away
settingsButton.addEventListener('click', function() {
    openWindow('Settings');
});