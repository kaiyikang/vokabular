import { BrowserWindow } from "electron";
import path from "path";

const windows = new Map();

const defaultWindowConfig = {
    webPreferences: {
        webSecurity: true,
        allowRunningInsecureContent: false,
        sandbox: false,
        preload: path.join(__dirname, "../preload/preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
    },
};

export function createWindow(name, options = {}, pagePath) {
    if (windows.has(name)) {
        const existingWindow = windows.get(name);
        if (!existingWindow.isDestroyed()) {
            existingWindow.focus();
            return existingWindow;
        }
    }

    const win = new BrowserWindow({
        ...defaultWindowConfig,
        ...options,
    });

    const pageUrl =
        process.env.NODE_ENV === "development"
            ? `http://localhost:5173/pages/${pagePath}`
            : path.join(__dirname, `../renderer/pages/${pagePath}`);

    process.env.NODE_ENV === "development"
        ? win.loadURL(pageUrl)
        : win.loadFile(pageUrl);

    win.webContents.on("console-message", (event, level, message) => {
        console.log(`[${name}] ${level}: ${message}`);
    });

    win.on("closed", () => {
        if (name === "main") {
            closeAllWindowsExcept("main");
        }
        windows.delete(name);
    });

    windows.set(name, win);
    return win;
}

function closeAllWindowsExcept(exceptName) {
    for (const [name, window] of windows.entries()) {
        if (name !== exceptName && !window.isDestroyed()) {
            window.close();
        }
    }
}

export function getWindow(name) {
    return windows.get(name);
}
