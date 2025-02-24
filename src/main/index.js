import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import config from "../config/configSchema";
// Common
const defaultWindowConfig = {
    webPreferences: {
        webSecurity: false,
        sandbox: false,
        preload: path.join(__dirname, "../preload/preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
    },
};

function createWindowWithPage(options = {}, pagePath) {
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
        console.log(`[Renderer] ${level}: ${message}`);
    });

    return win;
}

function createMainWindow() {
    return createWindowWithPage(
        { width: 400, height: 600 },
        "index/index.html",
    );
}

function createSettingsWindow() {
    return createWindowWithPage(
        { width: 600, height: 400 },
        "settings/settings.html",
    );
}

// connect
ipcMain.on("show-settings", createSettingsWindow);

app.whenReady().then(() => {
    createMainWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
