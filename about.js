const icons = document.querySelectorAll('.icon');
const closeButtons = document.querySelectorAll('.closeButton');
const startButton = document.getElementById('startButton');
const settingsButton = document.getElementById('settingsButton');
const taskbarItems = document.getElementById('taskbarItems');
const windows = document.querySelectorAll('.window');

let zIndexCounter = 10; // tracks which window should be "on top"

// Open (or focus) a window when a desktop icon is clicked
icons.forEach(icon => {
    icon.addEventListener('click', function() {
        const folderName = icon.getAttribute('data-folder');
        openWindow(folderName);
    });
});

// Settings button - opens a window instead of navigating away
settingsButton.addEventListener('click', function() {
    openWindow('Settings');
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

        const emoji = folderName === 'Settings' ? '⚙️' : '📂';
        item.textContent = emoji + ' ' + folderName;

        item.addEventListener('click', function() {
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

// Make all windows draggable by their titlebar
windows.forEach(windowEl => {
    const titlebar = windowEl.querySelector('.window-titlebar');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener('mousedown', function(e) {
        isDragging = true;

        const rect = windowEl.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        zIndexCounter++;
        windowEl.style.zIndex = zIndexCounter;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newY = Math.max(0, newY);

        windowEl.style.left = newX + 'px';
        windowEl.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
});

// Make all windows resizable via the bottom-right handle
windows.forEach(windowEl => {
    const resizeHandle = windowEl.querySelector('.resize-handle');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowEl.offsetWidth;
        startHeight = windowEl.offsetHeight;

        zIndexCounter++;
        windowEl.style.zIndex = zIndexCounter;

        e.stopPropagation();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        windowEl.style.width = newWidth + 'px';
        windowEl.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
    });
});