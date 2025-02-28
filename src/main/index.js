import { app, BrowserWindow, ipcMain } from "electron";
import config from "../config/configSchema";
import { createChatService } from "../services/chatService";
import { createAnkiService } from "../services/ankiService";
import { createWindow } from "./windowManager";

config.clear();

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
app.whenReady().then(() => {
    mainWindow();
    registerIpcHandlers();
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

function registerIpcHandlers() {
    createIpcHandler(
        "chat:generateWordExplanation",
        ({ queriedSentence, queriedWord }) =>
            chatService.generateWordExplanation(queriedSentence, queriedWord),
    );

    createIpcHandler("anki:addNoteToAnki", (fields) =>
        ankiService.addNoteToAnki(fields),
    );

    createIpcHandler("anki:checkHealth", () => ankiService.checkHealth());

    ipcMain.on("show-settings", settingWindow);
}
