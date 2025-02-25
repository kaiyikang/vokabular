import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import config from "../config/configSchema";
import { createChatService } from "../services/chatService";
import { createAnkiService } from "../services/ankiService";
import { createWindow } from "./windowManager";

// service
const chatService = createChatService(config);
const ankiService = createAnkiService(config);

function createIpcHandler(name, handler) {
    ipcMain.handle(name, async (event, ...args) => {
        try {
            return await handler(...args);
        } catch (error) {
            console.error(`Error in ${name}:`, error);
            throw error;
        }
    });
}

createIpcHandler(
    "chat:generateWordExplanation",
    ({ queriedSentence, queriedWord }) =>
        chatService.generateWordExplanation(queriedSentence, queriedWord),
);

createIpcHandler("anki:addNoteToAnki", (fields) =>
    ankiService.addNoteToAnki(fields),
);

createIpcHandler("anki:checkHealth", () => ankiService.checkHealth());

function mainWindow() {
    return createWindow(
        "main",
        { width: 400, height: 660 },
        "index/index.html",
    );
}

function settingWindow() {
    return createWindow(
        "setting",
        { width: 600, height: 400 },
        "settings/settings.html",
    );
}

// connect
ipcMain.on("show-settings", settingWindow);

app.whenReady().then(() => {
    mainWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
